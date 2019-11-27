import './TableBody.scss';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import orderBy from 'lodash/orderBy';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';
import {
  TEAM_VIDEO_PROJECTS_QUERY,
  // DASHBOARD_PROJECTS_QUERY - queries videoProjects, packages, documentFiles
} from 'lib/graphql/queries/dashboard';

// TEMP
import { packageMocks, documentFileMocks } from './pressMocks';

const teamPackages = packageMocks[0].result.data;
const teamDocumentFiles = documentFileMocks[0].result.data;

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

const getTypesData = types => {
  let typesData = [];
  const filterTypesData = types.filter( type => type !== null );
  typesData = typesData.concat( ...filterTypesData );
  return typesData;
};

const TableBody = props => {
  const {
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    projectTab,
    teamVideoProjects: {
      loading, error, videoProjects
    },
    videoProjectIds,
    subscribeToStatuses
  } = props;

  // TEMP - add mock data w/ videoProjects query result
  const allProjectTypesData = getTypesData( [
    videoProjects,
    teamDocumentFiles,
    teamPackages
  ] );

  const [statusSubscription, setStatusSubscription] = useState();

  useEffect( () => {
    if ( statusSubscription ) {
      // Do not resubscribe if the IDs did not change
      if ( isEqual( statusSubscription.ids, videoProjectIds ) ) {
        return;
      }
      statusSubscription.unsub();
    }
    if ( videoProjectIds.length < 1 ) {
      setStatusSubscription( null );
      return;
    }
    const subscription = {
      ids: videoProjectIds,
      unsub: subscribeToStatuses()
    };
    setStatusSubscription( subscription );
    return () => {
      subscription.unsub();
    };
  }, [videoProjectIds.join( ',' )] );

  if ( loading ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Loader active inline size="small" />
            <span style={ { marginLeft: '0.5em', fontSize: '1.5em' } }>
              Loading...
            </span>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }
  if ( error ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <ApolloError error={ error } />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  // if ( !videoProjects ) return null;
  if ( !allProjectTypesData ) return null;

  // if ( searchTerm && !videoProjects.length ) {
  if ( searchTerm && !allProjectTypesData.length ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            No results for &ldquo;{ searchTerm }&rdquo;
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  // if ( !videoProjects.length ) {
  if ( !allProjectTypesData.length ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>No projects</Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  // Sort data by clicked column & direction
  // Default sort by createdAt & DESC
  const direction = props.direction ? `${props.direction === 'ascending' ? 'asc' : 'desc'}` : 'desc';

  const tableData = orderBy(
    normalizeDashboardData( allProjectTypesData ),
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

TableBody.propTypes = {
  column: PropTypes.string,
  teamVideoProjects: PropTypes.object,
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  videoProjectIds: PropTypes.array,
  subscribeToStatuses: PropTypes.func
};

const updateProjectStatus = ( prev, { subscriptionData: { data: { projectStatusChange } } } ) => {
  if ( !projectStatusChange ) {
    return prev;
  }
  const projectIndex = prev.videoProjects.findIndex( p => p.id === projectStatusChange.id );
  if ( projectIndex === -1 ) {
    return prev;
  }
  // Using immutability helper in order to ensure that React will rerender after the status change
  return update( prev, { videoProjects: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
};

const teamProjectsQuery = graphql( TEAM_VIDEO_PROJECTS_QUERY, {
  name: 'teamVideoProjects',
  props: ( { teamVideoProjects } ) => {
    const { videoProjects, subscribeToMore } = teamVideoProjects;
    const videoProjectIds = videoProjects ? videoProjects.map( p => p.id ) : [];
    return {
      teamVideoProjects,
      videoProjectIds,
      subscribeToStatuses: () => subscribeToMore( {
        document: PROJECT_STATUS_CHANGE_SUBSCRIPTION,
        variables: { ids: videoProjectIds },
        updateQuery: updateProjectStatus
      } )
    };
  },
  options: props => ( {
    variables: { ...props.variables },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  } )
} );

// const dashboardProjectsQuery = graphql( DASHBOARD_PROJECTS_QUERY, {
//   name: 'dashboardProjects',
//   props: ( { dashboardProjects } ) => {
//     const {
//       subscribeToMore,
//       documentFiles,
//       packages,
//       videoProjects
//     } = dashboardProjects;
//     const allDashboardProjects = getTypesData( [ documentFiles, packages, videoProjects ] );
//     const dashboardProjectIDs = allDashboardProjects ? allDashboardProjects.map( p => p.id ) : [];
//     return {
//       dashboardProjects,
//       dashboardProjectIDs,
//       subscribeToStatuses: () => subscribeToMore( {
//         document: PROJECT_STATUS_CHANGE_SUBSCRIPTION,
//         variables: { ids: dashboardProjectIDs },
//         updateQuery: ( prev, { subscriptionData: { data: { projectStatusChange } } } ) => {
//           if ( !projectStatusChange ) {
//             return prev;
//           }
//           const projectIndex = prev.dashboardProjects.findIndex( p => p.id === projectStatusChange.id );
//           if ( projectIndex === -1 ) {
//             return prev;
//           }
//           return update( prev, { dashboardProjects: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
//         }
//       } )
//     };
//   },
//   options: props => ( {
//     variables: { ...props.variables },
//     notifyOnNetworkStatusChange: true,
//     fetchPolicy: 'cache-and-network'
//   } )
// } );

export default teamProjectsQuery( TableBody );

const TableBodyRaw = TableBody;
export {
  TEAM_VIDEO_PROJECTS_QUERY, updateProjectStatus, teamProjectsQuery, TableBodyRaw
};
