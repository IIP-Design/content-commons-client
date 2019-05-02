import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Loader, Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import MyProjectPrimaryCol from 'components/admin/Dashboard/MyProjects/MyProjectPrimaryCol';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon';
import { formatDate } from 'lib/utils';
import './TableBody.scss';

const TEAM_VIDEO_PROJECTS_QUERY = gql`
  query VideoProjectsByTeam(
    $team: String!, $first: Int, $skip: Int, $searchTerm: String
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
              { projectType_contains: $searchTerm },
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
      },
      first: $first,
      skip: $skip
     ) {
      id
      createdAt
      updatedAt
      team {
        name
        organization
      }
      author {
        firstName
        lastName
      }
      projectTitle
      status
      visibility
      thumbnails {
        url
        alt
        caption
        filename
        filetype
        dimensions {
          width
          height
        }                
      }      
    }
  }
`;

const normalizeData = videoProjects => {
  const normalizedVideoProjects = [];

  videoProjects.forEach( videoProject => {
    const normalizedProject = Object.create( {}, {
      id: { value: videoProject.id },
      createdAt: { value: formatDate( videoProject.createdAt ) },
      updatedAt: { value: formatDate( videoProject.updatedAt ) },
      projectTitle: { value: videoProject.projectTitle },
      author: { value: `${videoProject.author ? videoProject.author.firstName : ''} ${videoProject.author ? videoProject.author.lastName : ''}` },
      team: { value: videoProject.team.name },
      status: { value: videoProject.status },
      visibility: { value: videoProject.visibility },
      thumbnail: {
        value: {
          url: videoProject.thumbnails[0].url,
          alt: videoProject.thumbnails[0].alt
        }
      }
    } );
    normalizedVideoProjects.push( normalizedProject );
  } );

  return normalizedVideoProjects;
};

const TableBody = props => {
  const {
    searchTerm,
    selectedItems,
    tableHeaders,
    toggleItemSelection,
    variables,
    windowWidth
  } = props;

  return (
    <Query
      query={ TEAM_VIDEO_PROJECTS_QUERY }
      variables={ { ...variables } }
    >
      { ( { loading, error, data: { videoProjects } } ) => {
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

        const tableData = normalizeData( videoProjects );

        return (
          <Table.Body className="myProjects">
            { tableData.map( d => (
              <Table.Row
                key={ d.id }
                className={ d.isNew ? 'myProjects_newItem' : '' }
              >
                { tableHeaders.map( ( header, i ) => (
                  <Table.Cell
                    data-header={ header.label }
                    key={ `${d.id}_${header.name}` }
                    className="items_table_item"
                  >
                    { i === 0
                      ? (
                        // Table must include .primary_col div for fixed column
                        <Fragment>
                          <div className="primary_col">
                            <MyProjectPrimaryCol
                              d={ d }
                              header={ header }
                              selectedItems={ selectedItems }
                              toggleItemSelection={ toggleItemSelection }
                            />
                          </div>
                          { windowWidth && <TableMobileDataToggleIcon /> }
                        </Fragment>
                      )
                      : (
                        <Fragment>
                          <span>
                            <div className="items_table_mobileHeader">{ header.label }</div>
                            { d[header.name] }
                          </span>
                          <br />
                          { header.label === 'MODIFIED'
                            ? <span>{ d.status }</span>
                            : null }
                        </Fragment>
                      ) }
                  </Table.Cell>
                ) ) }
              </Table.Row>
            ) ) }
          </Table.Body>
        );
      } }
    </Query>
  );
};

TableBody.propTypes = {
  searchTerm: PropTypes.string,
  selectedItems: PropTypes.object,
  tableHeaders: PropTypes.array,
  toggleItemSelection: PropTypes.func,
  variables: PropTypes.object,
  windowWidth: PropTypes.oneOfType( [
    PropTypes.string,
    PropTypes.number
  ] )
};

export default TableBody;
export { TEAM_VIDEO_PROJECTS_QUERY };
