/**
 *
 * MyProjects
 *
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { Table } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon';
import MyProjectPrimaryCol from './MyProjectPrimaryCol';
import DashSearch from '../../DashSearch';
import './MyProjects.scss';

const TEAM_VIDEO_PROJECTS_QUERY = gql`
  query VideoProjectsByTeam( $team: String! ) {
    videoProjects(
      where: {
        team: {
          name: $team
        }
      }
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

const persistentTableHeaders = [
  { name: 'projectTitle', label: 'PROJECT TITLE' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'updatedAt', label: 'MODIFIED' },
  { name: 'team', label: 'TEAM' }
];

const menuItems = [
  { name: 'author', label: 'AUTHOR' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'createdAt', label: 'DATE' },
];

class MyProjects extends React.PureComponent {
  render() {
    const team = this.props.user.team.name;
    return (
      <Query query={ TEAM_VIDEO_PROJECTS_QUERY } variables={ { team } }>
        { ( { loading, error, data: videoProjectsData } ) => {
          if ( loading ) return <p>Loading....</p>;
          if ( error ) return <ApolloError error={ error } />;

          const { videoProjects } = videoProjectsData;
          const normalizedVideoProjects = [];

          videoProjects.forEach( videoProject => {
            const normalizedProject = Object.create( {}, {
              id: { value: videoProject.id },
              createdAt: { value: moment( videoProject.createdAt ).format( 'MMMM DD, YYYY' ) },
              updatedAt: { value: moment( videoProject.updatedAt ).format( 'MMMM DD, YYYY' ) },
              projectTitle: { value: videoProject.projectTitle },
              author: { value: `${videoProject.author.firstName} ${videoProject.author.lastName}` },
              team: { value: videoProject.team.name },
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

          return (
            <ScrollableTableWithMenu
              tableData={ normalizedVideoProjects }
              columnMenu={ menuItems }
              persistentTableHeaders={ persistentTableHeaders }
              renderDashSearch={ () => <DashSearch /> }
              renderTableBody={ ( {
                tableHeaders,
                selectedItems,
                tableData
              }, toggleItemSelection ) => (
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
                          { i === 0 && (
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
                              <TableMobileDataToggleIcon />
                            </Fragment>
                          ) }
                          { i !== 0 && (
                            <span>
                              <div className="items_table_mobileHeader">{ header.label }</div>
                              { d[header.name] }
                            </span>
                          ) }
                        </Table.Cell>
                      ) ) }
                    </Table.Row>
                  ) ) }
                </Table.Body>
              ) }
            />
          );
        } }
      </Query>
    );
  }
}

MyProjects.propTypes = {
  user: PropTypes.object
};

export default MyProjects;
export { TEAM_VIDEO_PROJECTS_QUERY };
