/**
 *
 * ScrollableTableWithMenu
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Table, Grid } from 'semantic-ui-react';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import TableHeader from './TableHeader/TableHeader';
import TableBody from './TableBody/TableBody';
import TableItemsDisplay from './TableItemsDisplay/TableItemsDisplay';
import TableSearch from './TableSearch/TableSearch';
import TableMenu from './TableMenu/TableMenu';
import TableActionsMenu from './TableActionsMenu/TableActionsMenu';
import TablePagination from './TablePagination/TablePagination';
import './ScrollableTableWithMenu.scss';

/* eslint-disable react/prefer-stateless-function */
class ScrollableTableWithMenu extends React.Component {
  state = {
    tableHeaders: this.props.persistentTableHeaders,
    selectedItems: new Map(),
    hasSelectedAllItems: false, // eslint-disable-line
    displayActionsMenu: false,
    column: 'createdAt',
    direction: 'descending',
    windowWidth: null,
    searchTerm: '',
    activePage: 1,
    itemsPerPage: 15,
    orderBy: 'createdAt_DESC',
    skip: 0
  };

  TIMEOUT_DELAY = 500;

  /* eslint-disable react/sort-comp */
  componentDidMount = () => {
    this.tableMenuSelectionsOnMobile();
    window.addEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

  componentDidUpdate = ( _, prevState ) => {
    const { itemsPerPage } = this.state;

    if ( prevState.itemsPerPage !== itemsPerPage ) {
      this.handleResetActivePage();
    }
  }

  componentWillUnmount = () => {
    window.removeEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

  handleItemsPerPageChange = ( e, value ) => {
    this.setState( { itemsPerPage: value } );
  };

  handlePageChange = ( e, { activePage } ) => {
    this.setState( prevState => {
      const { itemsPerPage } = prevState;
      const skip = ( activePage - 1 ) * itemsPerPage;

      return {
        selectedItems: new Map(),
        displayActionsMenu: false,
        activePage,
        skip
      };
    } );
  };

  handleResetActivePage = () => {
    this.setState( { activePage: 1, skip: 0 } );
  }

  handleResetSelections = () => {
    this.setState(
      {
        selectedItems: new Map(),
        displayActionsMenu: false
      },
      this.handleResetActivePage
    );
  }

  handleSearchSubmit = ( e, searchTerm ) => {
    e.preventDefault();
    this.setState(
      { searchTerm: searchTerm.trim() },
      this.handleResetActivePage
    );
  }

  handleSort = clickedColumn => () => {
    const { displayActionsMenu } = this.state;

    if ( displayActionsMenu ) return;

    // Pass column, direction to TableBody so re-rendered on TableHeader click
    // Reset to first page of results after sort
    this.setState( prevState => {
      const column = prevState.column !== clickedColumn ? clickedColumn : prevState.column;
      const direction = prevState.direction === 'ascending' ? 'descending' : 'ascending';
      const orderBy = `${column}_${direction === 'ascending' ? 'ASC' : 'DESC'}`;

      return {
        column,
        direction,
        orderBy
      };
    }, this.handleResetActivePage );
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

  tableMenuSelectionsOnResize = debounce( () => {
    const { persistentTableHeaders, columnMenu } = this.props;
    const windowWidth = window.innerWidth;
    const { windowWidth: prevWindowWidth } = this.state;

    if ( prevWindowWidth !== '' && prevWindowWidth <= this._breakpoint && !isWindowWidthLessThanOrEqualTo( this._breakpoint ) ) {
      return this.setState( { tableHeaders: persistentTableHeaders, windowWidth } );
    }
    if ( isWindowWidthLessThanOrEqualTo( this._breakpoint ) ) {
      return this.setState( { tableHeaders: [...persistentTableHeaders, ...columnMenu], windowWidth } );
    }

    return this.setState( { windowWidth } );
  }, this.TIMEOUT_DELAY, { leading: false, trailing: true } )

  tableMenuSelectionsOnMobile = () => {
    if ( isMobile() ) {
      const { columnMenu } = this.props;

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
        newSelectedItems.set( item, !prevState.hasSelectedAllItems );
      } );

      return {
        selectedItems: newSelectedItems,
        hasSelectedAllItems: !prevState.hasSelectedAllItems,
        displayActionsMenu: !prevState.hasSelectedAllItems
      };
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

  render() {
    const {
      tableHeaders,
      displayActionsMenu,
      column,
      direction,
      selectedItems,
      searchTerm,
      activePage,
      itemsPerPage,
      skip,
      orderBy,
      windowWidth
    } = this.state;

    const { columnMenu, projectTab, team } = this.props;

    const variables = { team: team.name, searchTerm };

    const bodyPaginationVars = { first: itemsPerPage, orderBy, skip };
    const paginationVars = { first: itemsPerPage, skip };

    return (
      <Grid>
        <Grid.Row className="items_tableSearch">
          <TableSearch handleSearchSubmit={ this.handleSearchSubmit } />
        </Grid.Row>
        <Grid.Row className="items_tableMenus_wrapper">
          <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
            <TableActionsMenu
              team={ team }
              displayActionsMenu={ displayActionsMenu }
              variables={ { ...variables, ...paginationVars } }
              selectedItems={ selectedItems }
              handleResetSelections={ this.handleResetSelections }
              toggleAllItemsSelection={ this.toggleAllItemsSelection }
            />
          </Grid.Column>
          <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
            <TableItemsDisplay
              team={ team }
              handleChange={ this.handleItemsPerPageChange }
              searchTerm={ searchTerm }
              value={ itemsPerPage }
              variables={ { ...variables, ...paginationVars } }
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
                <TableBody
                  searchTerm={ searchTerm }
                  selectedItems={ selectedItems }
                  tableHeaders={ tableHeaders }
                  toggleItemSelection={ this.toggleItemSelection }
                  team={ team }
                  bodyPaginationVars={ { ...bodyPaginationVars } }
                  variables={ { ...variables } }
                  windowWidth={ windowWidth }
                  column={ column }
                  direction={ direction }
                  projectTab={ projectTab }
                />
              </Table>
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column className="items_tablePagination">
            <TablePagination
              activePage={ activePage }
              handlePageChange={ this.handlePageChange }
              itemsPerPage={ itemsPerPage }
              variables={ variables }
              team={ team }
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

ScrollableTableWithMenu.propTypes = {
  persistentTableHeaders: PropTypes.array,
  columnMenu: PropTypes.array,
  team: PropTypes.object,
  projectTab: PropTypes.string
};

export default ScrollableTableWithMenu;
