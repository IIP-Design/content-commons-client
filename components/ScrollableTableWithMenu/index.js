/**
 *
 * ScrollableTableWithMenu
 *
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import { Table, Grid } from 'semantic-ui-react';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import ApolloError from 'components/errors/ApolloError';
import DashSearch from 'components/admin/DashSearch';
import MyProjectPrimaryCol from 'components/admin/Dashboard/MyProjects/MyProjectPrimaryCol';
import TableMobileDataToggleIcon from 'components/ScrollableTableWithMenu/TableMobileDataToggleIcon';
import TableHeader from './TableHeader';
import TableItemsDisplay from './TableItemsDisplay';
import TableMenu from './TableMenu';
import TableActionsMenu from './TableActionsMenu';
import TablePagination from './TablePagination';
import './ScrollableTableWithMenu.scss';

const TEAM_VIDEO_PROJECTS_QUERY = gql`
  query VideoProjectsByTeam( $team: String!, $first: Int ) {
    videoProjects(
      where: {
        team: {
          name: $team
        }
      },
      first: $first
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

/* eslint-disable react/prefer-stateless-function */
class ScrollableTableWithMenu extends React.Component {
  state = {
    tableHeaders: this.props.persistentTableHeaders,
    selectAllItems: false,
    selectedItems: new Map(),
    displayActionsMenu: false,
    column: null,
    direction: null,
    windowWidth: '',
    itemsPerPage: 25
  };

  componentDidMount() {
    this.tableMenuSelectionsOnMobile();
    window.addEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

  handleItemsPerPageChange = ( e, value ) => {
    this.setState( { itemsPerPage: value } );
  };

  tableMenuOnChange = e => {
    e.persist();
    const menuItem = {
      name: e.target.parentNode.dataset.propname,
      label: e.target.parentNode.dataset.proplabel
    };
    this.setState( prevState => {
      if ( prevState.tableHeaders.map( h => h.name ).includes( menuItem.name ) ) {
        return {
          tableHeaders: prevState.tableHeaders.filter( h => h.name !== menuItem.name )
        };
      }
      return { tableHeaders: [...prevState.tableHeaders, menuItem] };
    } );
  };

  tableMenuSelectionsOnResize = () => {
    const { persistentTableHeaders, columnMenu } = this.props;
    const windowWidth = window.innerWidth;
    const prevWindowWidth = this.state.windowWidth;

    let resizeMenuSelectionsTimer = null;
    if ( resizeMenuSelectionsTimer !== null ) clearTimeout( resizeMenuSelectionsTimer );
    resizeMenuSelectionsTimer = setTimeout( () => {
      if ( prevWindowWidth !== '' && prevWindowWidth <= 767 && !isWindowWidthLessThanOrEqualTo( 767 ) ) {
        return this.setState( { tableHeaders: persistentTableHeaders, windowWidth } );
      }
      if ( isWindowWidthLessThanOrEqualTo( 767 ) ) {
        return this.setState( { tableHeaders: [...persistentTableHeaders, ...columnMenu], windowWidth } );
      }
      return this.setState( { windowWidth } );
    }, 500 );
  }

  tableMenuSelectionsOnMobile = () => {
    const { columnMenu } = this.props;
    if ( isMobile() ) {
      this.setState( prevState => ( {
        tableHeaders: [...prevState.tableHeaders, ...columnMenu]
      } ) );
    }
  }

  toggleAllItemsSelection = e => {
    e.stopPropagation();
    const allItems = Array
      .from( document.querySelectorAll( '[data-label]' ) )
      .map( item => item.dataset.label );

    this.setState( prevState => {
      const newSelectedItems = new Map();

      allItems.forEach( item => {
        if ( prevState.selectAllItems ) {
          newSelectedItems.set( item, false );
        } else {
          newSelectedItems.set( item, true );
        }
      } );

      return ( {
        selectAllItems: !prevState.selectAllItems,
        selectedItems: newSelectedItems,
        displayActionsMenu: !prevState.selectAllItems
      } );
    } );
  }

  toggleItemSelection = ( e, data ) => {
    const isChecked = data.checked;
    this.setState( prevState => {
      const updatedSelectedItems = prevState.selectedItems.set( String( data['data-label'] ), isChecked );
      const areOtherItemsSelected = Array.from( updatedSelectedItems.values() ).includes( true );
      return {
        selectedItems: updatedSelectedItems,
        displayActionsMenu: areOtherItemsSelected
      };
    } );
  }

  handleSort = clickedColumn => () => {
    const {
      column,
      data,
      direction,
      displayActionsMenu
    } = this.state;

    if ( displayActionsMenu ) return;

    if ( column !== clickedColumn ) {
      return this.setState( {
        column: clickedColumn,
        data: sortBy( data, [clickedColumn] ),
        direction: 'ascending'
      } );
    }

    this.setState( {
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    } );
  };

  normalizeData = videoProjects => {
    const normalizedVideoProjects = [];

    videoProjects.forEach( videoProject => {
      const normalizedProject = Object.create( {}, {
        id: { value: videoProject.id },
        createdAt: { value: moment( videoProject.createdAt ).format( 'MMMM DD, YYYY' ) },
        updatedAt: { value: moment( videoProject.updatedAt ).format( 'MMMM DD, YYYY' ) },
        projectTitle: { value: videoProject.projectTitle },
        author: { value: `${videoProject.author ? videoProject.author.firstName : ''} ${videoProject.author ? videoProject.author.lastName : ''}` },
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

    return normalizedVideoProjects;
  }

  render() {
    const {
      tableHeaders,
      displayActionsMenu,
      column,
      direction,
      selectedItems,
      itemsPerPage
    } = this.state;

    const { columnMenu, team } = this.props;

    return (
      <Grid>
        <Grid.Row className="items_tableSearch">
          <DashSearch />
        </Grid.Row>
        <Grid.Row className="items_tableMenus_wrapper">
          <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
            <TableActionsMenu
              displayActionsMenu={ displayActionsMenu }
              toggleAllItemsSelection={ this.toggleAllItemsSelection }
            />
          </Grid.Column>
          <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
            <TableItemsDisplay
              value={ itemsPerPage }
              handleChange={ this.handleItemsPerPageChange }
            />
            <TableMenu
              columnMenu={ columnMenu }
              tableMenuOnChange={ this.tableMenuOnChange }
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className="items_table_wrapper">
            <div className="items_table">
              <Table sortable celled>
                <TableHeader
                  tableHeaders={ tableHeaders }
                  column={ column }
                  direction={ direction }
                  handleSort={ this.handleSort }
                  toggleAllItemsSelection={ this.toggleAllItemsSelection }
                  displayActionsMenu={ displayActionsMenu }
                />
                { /* ADD CUSTOM TABLE BODY */ }
                <Query
                  query={ TEAM_VIDEO_PROJECTS_QUERY }
                  variables={ { team, first: itemsPerPage } }
                >
                  { ( { loading, error, data: { videoProjects } } ) => {
                    if ( loading ) {
                      return (
                        <Table.Body>
                          <Table.Row>
                            <Table.Cell>Loading....</Table.Cell>
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

                    const tableData = this.normalizeData( videoProjects );

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
                                          toggleItemSelection={ this.toggleItemSelection }
                                        />
                                      </div>
                                      <TableMobileDataToggleIcon />
                                    </Fragment>
                                  )
                                  : (
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
                    );
                  } }
                </Query>
              </Table>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className="items_tablePagination">
            <TablePagination />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ScrollableTableWithMenu.propTypes = {
  persistentTableHeaders: PropTypes.array,
  columnMenu: PropTypes.array,
  team: PropTypes.string
};

export default ScrollableTableWithMenu;
export { TEAM_VIDEO_PROJECTS_QUERY };
