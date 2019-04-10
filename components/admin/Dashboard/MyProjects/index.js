/**
 *
 * MyProjects
 *
 */
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon';
import MyProjectPrimaryCol from './MyProjectPrimaryCol';
import DashSearch from '../../DashSearch';
import './MyProjects.scss';

import { tempData, menuItems } from './constants';

const USER_VIDEO_PROJECTS_QUERY = gql`
  query {
    videoProjects {
      id
      author
      team {
        name
        organization        
      }
      projectType
      projectTitle
      descPublic
      descInternal
      status
      visibility
      units {
        id
        title
        descPublic
        language {
          languageCode
          locale
          textDirection
          displayName
        }
        files {
          id
          language {
            languageCode
            locale
            textDirection
            displayName
          }
          filetype
          filename
          use {
            id
            name
          }
          quality
          videoBurnedInStatus
          url
          md5
          duration
          bitrate
          filesize
          dimensions {
            width
            height
          }
          stream {
            id
            site
            url
            embedUrl
          }
        }
        thumbnails {
          size
          image {
            filetype
            filename
            url
            alt
            caption            
          }
        }
      }
      supportFiles {
        language {
          displayName
        }
        url
        filename
        filetype
        filesize
      }
      thumbnails {
        alt
        caption
        dimensions {
          width
          height
        }
        alt
        caption
        filename
        filetype
        url
      }
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
class MyProjects extends React.Component {
  render() {
    const persistentTableHeaders = [
      { name: 'title', label: 'PROJECT TITLE' },
      { name: 'visibility', label: 'VISIBILITY' },
      { name: 'modified', label: 'MODIFIED' },
      { name: 'owner', label: 'TEAM' }
    ];

    return (
      <Fragment>
        <p className="myProjects_headline">
          Overview, Team Projects, Favorites, and Collections coming in future iterations!
        </p>
        <ScrollableTableWithMenu
          tableData={ tempData }
          columnMenu={ menuItems }
          persistentTableHeaders={ persistentTableHeaders }
          renderDashSearch={ () => <DashSearch /> }
          renderTableBody={ ( {
            tableHeaders,
            selectedItems,
            data
          }, toggleItemSelection ) => (
            <Table.Body className="myProjects">
              { data.map( d => (
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
                        <span><div className="items_table_mobileHeader">{ header.label }</div>{ d[header.name] }</span>
                      ) }
                    </Table.Cell>
                  ) ) }
                </Table.Row>
              ) ) }
            </Table.Body>
          ) }
        />
      </Fragment>
    );
  }
}

MyProjects.propTypes = {

};

export default MyProjects;
