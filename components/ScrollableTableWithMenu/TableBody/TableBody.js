import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import TableRow from 'components/ScrollableTableWithMenu/TableRow/TableRow';
import gql from 'graphql-tag';
import orderBy from 'lodash/orderBy';
import withSignedUrl from 'hocs/withSignedUrl/withSignedUrl';
import './TableBody.scss';

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

const TableBody = props => {
  const {
    data,
    getSignedUrlGet,
    direction,
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    projectTab
  } = props;

  const { skip, first } = variables;

  const [tableData, setTableData] = useState( [] );

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

  const getSignedThumbnailUrl = async videoProject => {
    // need to store url as this re fetchs every time, .ie. between renders
    if ( videoProject.thumbnails && videoProject.thumbnails.length ) {
      const signedUrl = await getSignedUrlGet( videoProject.thumbnails[0].url );

      return {
        url: signedUrl,
        alt: videoProject.thumbnails[0].alt || ''
      };
    }
    return { url: '', alt: '' };
  };

  const getDirection = dir => ( dir === 'ascending' ? 'asc' : 'desc' );


  const normalizeData = async projects => {
    const normalizedVideoProjects = await Promise.all( projects.map( async videoProject => {
      const tn = await getSignedThumbnailUrl( videoProject );

      const _data = {
        id: videoProject.id,
        createdAt: videoProject.createdAt,
        updatedAt: videoProject.updatedAt,
        projectTitle: videoProject.projectTitle,
        author: `${videoProject.author ? videoProject.author.firstName : ''} ${videoProject.author ? videoProject.author.lastName : ''}`,
        team: videoProject.team ? videoProject.team.name : '',
        status: videoProject.status,
        visibility: videoProject.visibility,
        thumbnail: tn,
        categories: getLangTaxonomies( videoProject.categories )
      };

      return Promise.resolve( _data );
    } ) );

    setTableData( normalizedVideoProjects );
  };


  const sort = ( _tableData, dir ) => {
    // Sort data by clicked column & direction
    // Default sort by createdAt & DESC
    const sorted = orderBy(
      _tableData,
      tableDatum => {
        let { column } = props;
        if ( !column ) column = 'createdAt';
        // Format table data for case insensitive sorting
        const formattedTableDatum = tableDatum[column].toString().toLowerCase();
        return formattedTableDatum;
      },
      [dir]
    );

    return sorted;
  };


  useEffect( () => {
    if ( data.videoProjects && data.videoProjects.length ) {
      normalizeData( data.videoProjects );
    }
  }, [data.videoProjects] );


  const renderRow = d => (
    <TableRow
      key={ d.id }
      d={ d }
      selectedItems={ selectedItems }
      tableHeaders={ tableHeaders }
      toggleItemSelection={ toggleItemSelection }
      projectTab={ projectTab }
    />
  );


  if ( data.loading ) {
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

  if ( data.error ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <ApolloError error={ data.error } />
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  if ( data && !data.videoProjects ) return null;


  if ( searchTerm && !data.videoProjects.length ) {
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

  if ( !data.videoProjects.length ) {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell>No projects</Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <Table.Body className="projects">
      {
        sort( tableData, getDirection( direction || 'desc' ) ).slice( skip, skip + first ).map( d => renderRow( d ) )
      }
    </Table.Body>
  );
};


TableBody.propTypes = {
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  direction: PropTypes.string,
  projectTab: PropTypes.string,
  getSignedUrlGet: PropTypes.func,
  data: PropTypes.object
};

export default compose(
  withSignedUrl,
  graphql( TEAM_VIDEO_PROJECTS_QUERY, {
    options: props => ( {
      variables: { ...props.variables }
    } ),
    fetchPolicy: 'cache-and-network'
  } ),
)( TableBody );

export { TEAM_VIDEO_PROJECTS_QUERY };
