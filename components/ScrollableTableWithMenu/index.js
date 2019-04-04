/**
 *
 * ScrollableTableWithMenu
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { Table, Grid } from 'semantic-ui-react';
import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import TableItemsDisplay from './TableItemsDisplay';
import TableMenu from './TableMenu';
import TableHeader from './TableHeader';
import TableActionsMenu from './TableActionsMenu';
import TablePagination from './TablePagination';
import './ScrollableTableWithMenu.scss';

/* eslint-disable react/prefer-stateless-function */
class ScrollableTableWithMenu extends React.Component {
  state = {
    data: this.props.tableData,
    tableHeaders: this.props.persistentTableHeaders,
    selectAllItems: false,
    selectedItems: new Map(),
    displayActionsMenu: false,
    column: null,
    direction: null,
    windowWidth: ''
  };

  componentDidMount() {
    this.tableMenuSelectionsOnMobile();
    window.addEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.tableMenuSelectionsOnResize );
  }

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

  render() {
    const {
      tableHeaders,
      displayActionsMenu,
      column,
      direction
    } = this.state;

    const {
      columnMenu,
      renderTableBody,
      renderDashSearch
    } = this.props;

    return (
      <Grid>
        <Grid.Row className="items_tableSearch">
          { renderDashSearch() }
        </Grid.Row>
        <Grid.Row className="items_tableMenus_wrapper">
          <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
            <TableActionsMenu
              displayActionsMenu={ displayActionsMenu }
              toggleAllItemsSelection={ this.toggleAllItemsSelection }
            />
          </Grid.Column>
          <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
            <TableItemsDisplay />
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
                { renderTableBody( this.state, this.toggleItemSelection ) }
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
  tableData: PropTypes.array,
  persistentTableHeaders: PropTypes.array,
  columnMenu: PropTypes.array,
  renderTableBody: PropTypes.func,
  renderDashSearch: PropTypes.func
};

export default ScrollableTableWithMenu;
