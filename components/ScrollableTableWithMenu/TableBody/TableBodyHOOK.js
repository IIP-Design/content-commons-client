import './TableBody.scss';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import orderBy from 'lodash/orderBy';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';
import {
  TEAM_VIDEO_PROJECTS_QUERY,
  TEAM_PACKAGES_QUERY
} from 'lib/graphql/queries/dashboard';
import TableBodyLoading from './TableBodyLoading';
import TableBodyError from './TableBodyError';
import TableBodyNoResults from './TableBodyNoResults';
import TableBodyNoProjects from './TableBodyNoProjects';

// TEMP
// import { packageMocks, documentFileMocks } from './pressMocks';
// const teamPackages = packageMocks[0].result.data;
// const teamDocumentFiles = documentFileMocks[0].result.data;

const getLangTaxonomies = ( array, locale = 'en-us' ) => {
  if ( !Array.isArray( array ) || !array.length ) return '';
  return (
    array.map( tax => (
      tax.translations
        .find( translation => translation.language.locale === locale )
        .name
    ) ).join( ', ' )
  );
};

const normalizeTypesData = type => {
  const projectTitle = () => {
    if ( type.__typename === 'VideoProject' ) return type.projectTitle;
    if ( type.__typename === 'Package' ) return type.title;
    if ( type.__typename === 'DocumentFile' ) return type.filename;
    return '';
  };

  const thumbnail = () => {
    if ( !type.thumbnail ) return {};
    return ( {
      signedUrl: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].signedUrl : '',
      alt: type.thumbnails && type.thumbnails.length ? type.thumbnails[0].alt : ''
    } );
  };

  const normalizedTypeData = Object.create( {}, {
    __typename: { value: type.__typename },
    id: { value: type.id },
    createdAt: { value: type.createdAt },
    updatedAt: { value: type.updatedAt },
    projectTitle: { value: projectTitle() },
    author: { value: `${type.author ? type.author.firstName : ''} ${type.author ? type.author.lastName : ''}` },
    team: { value: type.team ? type.team.name : '' },
    status: { value: type.status || '' },
    visibility: { value: type.visibility },
    thumbnail: { value: thumbnail() },
    categories: { value: getLangTaxonomies( type.categories ) }
  } );

  return normalizedTypeData;
};

const normalizeDashboardData = types => {
  const normalizedProjects = [];
  types.forEach( type => normalizedProjects.push( normalizeTypesData( type ) ) );
  return normalizedProjects;
};

const updateProjectStatus = ( prev, { subscriptionData: { data: { projectStatusChange } } } ) => {
  if ( !projectStatusChange ) {
    return prev;
  }

  let projectIndex;
  if ( prev.videoProjects ) {
    projectIndex = prev.videoProjects.findIndex( p => p.id === projectStatusChange.id );
  }
  if ( prev.packages ) {
    projectIndex = prev.packages.findIndex( p => p.id === projectStatusChange.id );
  }
  if ( projectIndex === -1 ) {
    return prev;
  }

  // Using immutability helper in order to ensure that React will rerender after the status change
  if ( prev.videoProjects ) {
    return update( prev, { videoProjects: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
  }
  if ( prev.packages ) {
    return update( prev, { packages: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
  }
};


const TableBodyHOOK = props => {
  const {
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    projectTab,
    team
  } = props;

  // Get TEAM, run QUERY
  const setGraphQuery = () => {
    let query;
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) query = TEAM_VIDEO_PROJECTS_QUERY;
    if ( contentTypes.includes( 'PACKAGE' ) ) query = TEAM_PACKAGES_QUERY;
    return query;
  };
  const graphQuery = setGraphQuery();

  const {
    loading, error, data, subscribeToMore
  } = useQuery( graphQuery, {
    variables: { ...variables },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  } );

  const [statusSubscription, setStatusSubscription] = useState();
  let statusProjectIds = [];

  useEffect( () => {
    const subscribeToStatuses = () => subscribeToMore( {
      document: PROJECT_STATUS_CHANGE_SUBSCRIPTION,
      variables: { ids: statusProjectIds },
      updateQuery: updateProjectStatus
    } );

    if ( statusSubscription ) {
      // Do not resubscribe if the IDs did not change
      if ( isEqual( statusSubscription.ids, statusProjectIds ) ) {
        return;
      }
      statusSubscription.unsub();
    }
    if ( statusProjectIds.length < 1 ) {
      setStatusSubscription( null );
      return;
    }
    const subscription = {
      ids: statusProjectIds,
      unsub: subscribeToStatuses()
    };
    setStatusSubscription( subscription );
    return () => {
      subscription.unsub();
    };
  }, [] );

  if ( loading ) return <TableBodyLoading />;
  if ( error ) return <TableBodyError error={ error } />;

  const getProjectType = () => {
    let projectsType;
    const { contentTypes } = team;
    if ( contentTypes.includes( 'VIDEO' ) ) projectsType = 'VideoProject';
    if ( contentTypes.includes( 'PACKAGE' ) ) projectsType = 'Package';
    return projectsType;
  };
  const projectType = getProjectType();

  const setProjectData = () => {
    let projectsData;
    if ( projectType === 'VideoProject' ) projectsData = data.videoProjects;
    if ( projectType === 'Package' ) projectsData = data.packages;
    return projectsData || null;
  };
  const dashboardProjects = setProjectData();
  statusProjectIds = dashboardProjects ? dashboardProjects.map( p => p.id ) : [];

  if ( !dashboardProjects ) return null;
  if ( searchTerm && !dashboardProjects.length ) return <TableBodyNoResults searchTerm={ searchTerm } />;
  if ( !dashboardProjects.length ) return <TableBodyNoProjects />;

  // Sort data by clicked column & direction
  // Default sort by createdAt & DESC
  const direction = props.direction ? `${props.direction === 'ascending' ? 'asc' : 'desc'}` : 'desc';

  const tableData = orderBy(
    normalizeDashboardData( dashboardProjects ),
    tableDatum => {
      let { column } = props;
      if ( !column ) column = 'createdAt';
      // Format table data for case insensitive sorting
      const formattedTableDatum = tableDatum[column].toString().toLowerCase();
      return formattedTableDatum;
    },
    [direction]
  );

  // skip & first query vars are used as start/end slice() params to paginate tableData on client
  const { skip, first } = variables;
  const paginatedTableData = tableData.slice( skip, skip + first );

  return (
    <Table.Body className="projects">
      { paginatedTableData.map( d => (
        <TableRow
          key={ d.id }
          d={ d }
          selectedItems={ selectedItems }
          tableHeaders={ tableHeaders }
          toggleItemSelection={ toggleItemSelection }
          projectTab={ projectTab }
        />
      ) ) }
    </Table.Body>
  );
};

TableBodyHOOK.propTypes = {
  column: PropTypes.string,
  // teamVideoProjects: PropTypes.object,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  // videoProjectIds: PropTypes.array,
  // subscribeToStatuses: PropTypes.func,
  team: PropTypes.object,
};

export default TableBodyHOOK;
