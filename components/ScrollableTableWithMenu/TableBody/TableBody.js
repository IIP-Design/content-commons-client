import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import orderBy from 'lodash/orderBy';
import { getLangTaxonomies } from 'lib/utils';
import { getProjectsType, setProjectsQueries } from 'lib/graphql/util';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';
import { TEAM_VIDEO_PROJECTS_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY } from 'lib/graphql/queries/package';
import { Table } from 'semantic-ui-react';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import TableBodyLoading from './TableBodyLoading';
import TableBodyError from './TableBodyError';
import TableBodyNoResults from './TableBodyNoResults';
import TableBodyNoProjects from './TableBodyNoProjects';
import './TableBody.scss';

const normalizeTypesData = type => {
  const projectTitle = () => {
    if ( type.__typename === 'VideoProject' ) return type.projectTitle;
    if ( type.__typename === 'Package' ) return type.title;
    if ( type.__typename === 'DocumentFile' ) return type.filename;
    return '';
  };

  const thumbnail = () => {
    if ( !type.thumbnails ) return {};
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

const updateProjectStatus = dashboardProjectsType => ( prev, { subscriptionData: { data: { projectStatusChange } } } ) => {
  if ( !projectStatusChange ) {
    return prev;
  }
  const projectIndex = prev[dashboardProjectsType].findIndex( p => p.id === projectStatusChange.id );
  if ( projectIndex === -1 ) {
    return prev;
  }
  // Using immutability helper in order to ensure that React will rerender after the status change
  return update( prev, { [dashboardProjectsType]: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
};

const TableBody = props => {
  const {
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    projectTab,
    team
  } = props;

  // Determine type of dashboard projects
  const dashboardProjectsType = getProjectsType( team );

  // Determine which Query to run
  const graphQuery = setProjectsQueries( team, {
    videoProjects: TEAM_VIDEO_PROJECTS_QUERY,
    packages: TEAM_PACKAGES_QUERY
  } );

  // Run Query
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
      updateQuery: updateProjectStatus( dashboardProjectsType )
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
  }, [statusProjectIds] );

  if ( loading ) return <TableBodyLoading />;
  if ( error ) return <TableBodyError error={ error } />;

  // Set dashboard projects data & ID's for status subscription
  const setDashboardProjectsData = () => {
    let projectsData;
    if ( dashboardProjectsType === 'videoProjects' ) projectsData = data.videoProjects;
    if ( dashboardProjectsType === 'packages' ) projectsData = data.packages;
    return projectsData || null;
  };
  const dashboardProjects = setDashboardProjectsData();
  statusProjectIds = dashboardProjects ? dashboardProjects.map( p => p.id ) : [];

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
          team={ team }
        />
      ) ) }
    </Table.Body>
  );
};

TableBody.propTypes = {
  column: PropTypes.string,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  team: PropTypes.object,
};

export default TableBody;

export { TEAM_VIDEO_PROJECTS_QUERY, updateProjectStatus };
