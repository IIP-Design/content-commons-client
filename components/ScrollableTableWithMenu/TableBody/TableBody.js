import './TableBody.scss';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';
import isEqual from 'lodash/isEqual';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import gql from 'graphql-tag';
import orderBy from 'lodash/orderBy';
import { PROJECT_STATUS_CHANGE_SUBSCRIPTION } from 'lib/graphql/queries/common';

// TEMP
import { mocks } from './mocks';

const teamPackages = mocks[0].result.data;

const TEAM_VIDEO_PROJECTS_QUERY = gql`
  query VideoProjectsByTeam(
    $team: String!, $searchTerm: String
  ) {
    videoProjects(
      where: {
        AND: [
          { team: { name: $team } },
          {
            OR: [
              { projectTitle_contains: $searchTerm },
              { descPublic_contains: $searchTerm },
              { descInternal_contains: $searchTerm },
              {
                categories_some: {
                  translations_some: { name_contains: $searchTerm }
                }
              },
              {
                author: {
                  OR: [
                    { firstName_contains: $searchTerm },
                    { lastName_contains: $searchTerm },
                    { email_contains: $searchTerm }
                  ]
                }
              }
            ]
          }
        ]
      }
     ) {
      id
      createdAt
      updatedAt
      team {
        id
        name
        organization
      }
      author {
        id
        firstName
        lastName
      }
      projectTitle
      status
      visibility
      thumbnails {
        id
        url
        signedUrl
        alt
      }
      categories {
        id
        translations {
          id
          name
          language {
            id
            locale
          }
        }
      }
    }
  }
`;

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

// const normalizeData = videoProjects => {
//   const normalizedVideoProjects = [];

//   videoProjects.forEach( videoProject => {
//     const normalizedProject = Object.create( {}, {
//       id: { value: videoProject.id },
//       createdAt: { value: videoProject.createdAt },
//       updatedAt: { value: videoProject.updatedAt },
//       projectTitle: { value: videoProject.projectTitle },
//       author: { value: `${videoProject.author ? videoProject.author.firstName : ''} ${videoProject.author ? videoProject.author.lastName : ''}` },
//       team: { value: videoProject.team ? videoProject.team.name : '' },
//       status: { value: videoProject.status },
//       visibility: { value: videoProject.visibility },
//       thumbnail: {
//         value: {
//           signedUrl: videoProject.thumbnails && videoProject.thumbnails.length ? videoProject.thumbnails[0].signedUrl : '',
//           alt: videoProject.thumbnails && videoProject.thumbnails.length ? videoProject.thumbnails[0].alt : ''
//         }
//       },
//       categories: { value: getLangTaxonomies( videoProject.categories ) }
//     } );
//     normalizedVideoProjects.push( normalizedProject );
//   } );

//   return normalizedVideoProjects;
// };

const normalizeVideoProject = videoProject => {
  const normalizedVideoProject = Object.create( {}, {
    id: { value: videoProject.id },
    createdAt: { value: videoProject.createdAt },
    updatedAt: { value: videoProject.updatedAt },
    projectTitle: { value: videoProject.projectTitle },
    author: { value: `${videoProject.author ? videoProject.author.firstName : ''} ${videoProject.author ? videoProject.author.lastName : ''}` },
    team: { value: videoProject.team ? videoProject.team.name : '' },
    status: { value: videoProject.status },
    visibility: { value: videoProject.visibility },
    thumbnail: {
      value: {
        signedUrl: videoProject.thumbnails && videoProject.thumbnails.length ? videoProject.thumbnails[0].signedUrl : '',
        alt: videoProject.thumbnails && videoProject.thumbnails.length ? videoProject.thumbnails[0].alt : ''
      }
    },
    categories: { value: getLangTaxonomies( videoProject.categories ) }
  } );
  return normalizedVideoProject;
};

const normalizePackage = pkg => {
  const normalizedPackage = Object.create( {}, {
    __typename: { value: pkg.__typename },
    id: { value: pkg.id },
    createdAt: { value: pkg.createdAt },
    updatedAt: { value: pkg.updatedAt },
    projectTitle: { value: pkg.title },
    author: { value: `${pkg.author ? pkg.author.firstName : ''} ${pkg.author ? pkg.author.lastName : ''}` },
    team: { value: pkg.team ? pkg.team.name : '' },
    status: { value: pkg.status || '' },
    visibility: { value: pkg.visibility },
    thumbnail: {},
    categories: { value: getLangTaxonomies( pkg.categories ) }
  } );
  return normalizedPackage;
};

const normalizeProjectData = projects => {
  const { videoProjects, packages } = projects;
  const normalizedProjects = [];

  if ( videoProjects.length > 0 ) {
    videoProjects.forEach( videoProject => normalizedProjects.push( normalizeVideoProject( videoProject ) ) );
  }

  if ( packages.length > 0 ) {
    packages.forEach( pkg => normalizedProjects.push( normalizePackage( pkg ) ) );
  }

  return normalizedProjects;
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

  if ( !videoProjects ) return null;

  if ( searchTerm && !videoProjects.length ) {
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

  if ( !videoProjects.length ) {
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

  // TEMP
  const propsWithPackages = { ...props, teamPackages };

  const tableData = orderBy(
    // normalizeData( videoProjects ),
    normalizeProjectData( {
      videoProjects: propsWithPackages.teamVideoProjects.videoProjects,
      packages: propsWithPackages.teamPackages,
    } ),
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

const teamVideoProjectsQuery = graphql( TEAM_VIDEO_PROJECTS_QUERY, {
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
        updateQuery: ( prev, { subscriptionData: { data: { projectStatusChange } } } ) => {
          if ( !projectStatusChange ) {
            return prev;
          }
          const projectIndex = prev.videoProjects.findIndex( p => p.id === projectStatusChange.id );
          if ( projectIndex === -1 ) {
            return prev;
          }
          // Using immutability helper in order to ensure that React will rerender after the status change
          return update( prev, { videoProjects: { [projectIndex]: { status: { $set: projectStatusChange.status } } } } );
        }
      } )
    };
  },
  options: props => ( {
    variables: { ...props.variables },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  } )
} );

// const teamPackagesQuery = graphql( PACKAGE_QUERY, {
//   name: 'teamPackages',
//   options: {
//     variables: { id: props.id },
//   },
// } );

// export default teamProjectsQuery( TableBody );
export default compose(
  teamVideoProjectsQuery,
  // teamPackagesQuery,
)( TableBody );
export { TEAM_VIDEO_PROJECTS_QUERY };
