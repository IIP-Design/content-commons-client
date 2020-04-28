/**
 *
 * ScrollableTableWithMenu
 *
 */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Table, Grid } from 'semantic-ui-react';
import { useQuery } from '@apollo/react-hooks';

import { isMobile, isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import TableHeader from './TableHeader/TableHeader';
import TableBody from './TableBody/TableBody';
import TableItemsDisplay from './TableItemsDisplay/TableItemsDisplay';
import TableSearch from './TableSearch/TableSearch';
import TableMenu from './TableMenu/TableMenu';
import TableActionsMenu from './TableActionsMenu/TableActionsMenu';
import TablePagination from './TablePagination/TablePagination';
import { DashboardContext } from 'context/dashboardContext';

import './ScrollableTableWithMenu.scss';

const ScrollableTableWithMenu = ( { columnMenu, persistentTableHeaders, projectTab, team } ) => {
  const [tableHeaders, setTableHeaders] = useState( persistentTableHeaders );
  const [selectedItems, setSelectedItems] = useState( new Map() );
  const [hasSelectedAllItems, setHasSelectedAllItems] = useState( false );
  const [displayActionsMenu, setDisplayActionsMenu] = useState( false );
  const [column, setColumn] = useState( 'createdAt' );
  const [direction, setDirection] = useState( 'descending' );
  const [windowWidth, setWindowWidth] = useState( null );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [activePage, setActivePage] = useState( 1 );
  const [itemsPerPage, setItemsPerPage] = useState( 15 );
  const [orderBy, setOrderBy] = useState( 'createdAt_DESC' );
  const [skip, setSkip] = useState( 0 );

  const TIMEOUT_DELAY = 500;
  const _breakpoint = 767;

  // componentDidUpdate = ( _, prevState ) => {
  //   const { itemsPerPage } = this.state;

  //   if ( prevState.itemsPerPage !== itemsPerPage ) {
  //     this.handleResetActivePage();
  //   }
  // }

  const tableMenuSelectionsOnMobile = () => {
    if ( isMobile() ) {
      setTableHeaders( [...tableHeaders, ...columnMenu] );
    }
  };

  const tableMenuSelectionsOnResize = debounce( () => {
    const currentWidth = window.innerWidth;

    if ( windowWidth !== '' && windowWidth <= _breakpoint && !isWindowWidthLessThanOrEqualTo( _breakpoint ) ) {
      setTableHeaders( persistentTableHeaders );
      setWindowWidth( currentWidth );
    }

    if ( isWindowWidthLessThanOrEqualTo( _breakpoint ) ) {
      setTableHeaders( [...persistentTableHeaders, ...columnMenu] );
      setWindowWidth( currentWidth );
    }

    setWindowWidth( currentWidth );
  }, TIMEOUT_DELAY, { leading: false, trailing: true } );

  const { dispatch, state } = useContext( DashboardContext );

  useEffect( () => {
    tableMenuSelectionsOnMobile();
    window.addEventListener( 'resize', tableMenuSelectionsOnResize );

    // Clean up event listener on dismount
    return () => {
      window.removeEventListener( 'resize', tableMenuSelectionsOnResize );
    };
  }, [] );

  const variables = { team: team.name, searchTerm };
  const countData = useQuery( state.queries.count, {
    variables: { ...variables }
  } );

  useEffect( () => {
    const { data, error, loading: countLoading } = countData;

    dispatch( { type: 'UPDATE_COUNT', payload: { count: { data, error, countLoading }, team } } );
  }, [countData] );

  const handleItemsPerPageChange = ( e, value ) => {
    setItemsPerPage( value );
  };

  const handlePageChange = () => {
    setSelectedItems( new Map() );
    setDisplayActionsMenu( false );
    setSkip( ( activePage - 1 ) * itemsPerPage );
  };

  const handleResetActivePage = () => {
    setActivePage( 1 );
    setSkip( 0 );
  };

  const handleResetSelections = () => {
    setSelectedItems( new Map() );
    setDisplayActionsMenu( false );
    handleResetActivePage();
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    setSearchTerm( searchTerm.trim() );
    handleResetActivePage();
  };

  const handleSort = clickedColumn => () => {
    if ( displayActionsMenu ) return;

    // Pass column, direction to TableBody so re-rendered on TableHeader click
    // Reset to first page of results after sort
    if ( column !== clickedColumn ) setColumn( clickedColumn );
    setDirection( direction === 'ascending' ? 'descending' : 'ascending' );
    setOrderBy( `${column}_${direction === 'ascending' ? 'ASC' : 'DESC'}` );

    handleResetActivePage();
  };

  const tableMenuOnChange = e => {
    e.persist();
    const menuItem = {
      name: e.target.parentNode.dataset.propname,
      label: e.target.parentNode.dataset.proplabel
    };

    if ( tableHeaders.map( h => h.name ).includes( menuItem.name ) ) {
      setTableHeaders( tableHeaders.filter( h => h.name !== menuItem.name ) );
    } else {
      setTableHeaders( [...tableHeaders, menuItem] );
    }
  };

  const toggleAllItemsSelection = e => {
    e.stopPropagation();
    const allItems = Array
      .from( document.querySelectorAll( '[data-label]' ) )
      .map( item => item.dataset.label );

    const newSelectedItems = new Map();

    allItems.forEach( item => {
      newSelectedItems.set( item, !hasSelectedAllItems );
    } );

    setSelectedItems( newSelectedItems );
    setHasSelectedAllItems( !hasSelectedAllItems );
    setDisplayActionsMenu( !hasSelectedAllItems );
  };

  const toggleItemSelection = ( e, d ) => {
    const isChecked = d.checked;

    const updatedSelectedItems = selectedItems.set( String( d['data-label'] ), isChecked );
    const areOtherItemsSelected = Array.from( updatedSelectedItems.values() ).includes( true );

    setSelectedItems( updatedSelectedItems );
    setDisplayActionsMenu( areOtherItemsSelected );
  };

  const bodyPaginationVars = { first: itemsPerPage, orderBy, skip };
  const paginationVars = { first: itemsPerPage, skip };

  const count = state?.count?.count ? state.count.count : null;
  const error = state?.count?.error ? state.count.error : null;
  const loading = state?.count?.loading ? state.count.loading : false;

  return (
    <Grid>
      <Grid.Row className="items_tableSearch">
        <TableSearch handleSearchSubmit={ handleSearchSubmit } />
      </Grid.Row>
      <Grid.Row className="items_tableMenus_wrapper">
        <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
          <TableActionsMenu
            team={ team }
            displayActionsMenu={ displayActionsMenu }
            variables={ { ...variables, ...paginationVars } }
            selectedItems={ selectedItems }
            handleResetSelections={ handleResetSelections }
            toggleAllItemsSelection={ toggleAllItemsSelection }
          />
        </Grid.Column>
        <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
          <TableItemsDisplay
            count={ count }
            error={ error }
            loading={ loading }
            handleChange={ handleItemsPerPageChange }
            itemsPerPage={ itemsPerPage }
            searchTerm={ searchTerm }
            skip={ skip }
          />
          <TableMenu
            columnMenu={ columnMenu }
            tableMenuOnChange={ tableMenuOnChange }
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
                handleSort={ handleSort }
                toggleAllItemsSelection={ toggleAllItemsSelection }
                displayActionsMenu={ displayActionsMenu }
              />
              <TableBody
                searchTerm={ searchTerm }
                selectedItems={ selectedItems }
                tableHeaders={ tableHeaders }
                toggleItemSelection={ toggleItemSelection }
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
            handlePageChange={ handlePageChange }
            itemsPerPage={ itemsPerPage }
            variables={ variables }
            team={ team }
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

ScrollableTableWithMenu.propTypes = {
  persistentTableHeaders: PropTypes.array,
  columnMenu: PropTypes.array,
  team: PropTypes.object,
  projectTab: PropTypes.string
};

export default ScrollableTableWithMenu;
