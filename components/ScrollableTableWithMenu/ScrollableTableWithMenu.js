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
  const bodyPaginationVars = { first: itemsPerPage, orderBy, skip };
  const paginationVars = { first: itemsPerPage, skip };

  const countData = useQuery( state.queries.count, {
    variables: { ...variables },
    fetchPolicy: 'cache-and-network'
  } );

  const isLegacySort = state.column === 'author' || state.column === 'team';

  const contentData = useQuery( state.queries.content, {
    variables: isLegacySort ? { ...variables } : { ...variables, ...bodyPaginationVars },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network'
  } );

  useEffect( () => {
    const { data, error, loading, refetch } = countData;

    dispatch( { type: 'UPDATE_COUNT', payload: { count: { data, error, loading, refetch }, team } } );
  }, [countData] );

  useEffect( () => {
    const { data, error, loading, refetch } = contentData;

    dispatch( { type: 'UPDATE_CONTENT', payload: { data, error, loading, refetch, type: state.projectType } } );
  }, [contentData] );

  const handleItemsPerPageChange = ( e, value ) => {
    setItemsPerPage( value );
  };

  const handlePageChange = ( e, { activePage: page } ) => {
    setSelectedItems( new Map() );
    setDisplayActionsMenu( false );
    setActivePage( page );
    setSkip( ( page - 1 ) * itemsPerPage );
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
    const direction = state.direction === 'ascending' ? 'descending' : 'ascending';

    if ( state.column !== clickedColumn ) {
      dispatch( { type: 'UPDATE_COLUMN', payload: { column: clickedColumn, direction } } );
    } else {
      dispatch( { type: 'UPDATE_COLUMN', payload: { column: clickedColumn, direction } } );
    }

    const columnName = clickedColumn === 'projectTitle' ? 'title' : clickedColumn;

    setOrderBy( `${columnName}_${direction === 'ascending' ? 'ASC' : 'DESC'}` );

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

    const hasSelected = !hasSelectedAllItems;

    allItems.forEach( item => {
      newSelectedItems.set( item, hasSelected );
    } );

    setSelectedItems( newSelectedItems );
    setHasSelectedAllItems( hasSelected );
    setDisplayActionsMenu( hasSelected );
  };

  const toggleItemSelection = ( e, d ) => {
    const isChecked = d.checked;

    const updatedSelectedItems = selectedItems.set( String( d['data-label'] ), isChecked );
    const areOtherItemsSelected = Array.from( updatedSelectedItems.values() ).includes( true );

    setSelectedItems( updatedSelectedItems );
    setDisplayActionsMenu( areOtherItemsSelected );
  };

  const count = state?.count?.count ? state.count.count : null;
  const countError = state?.count?.error ? state.count.error : null;
  const countLoading = state?.count?.loading ? state.count.loading : false;
  const countRefetch = state?.count?.refetch ? state.count.refetch : () => {};

  const projectData = state?.content?.data ? state.content.data : null;
  const projectError = state?.content?.error ? state.content.error : null;
  const projectLoading = state?.content?.loading ? state.content.loading : false;
  const projectRefetch = state?.content?.refetch ? state.content.refetch : () => {};

  return (
    <Grid>
      <Grid.Row className="items_tableSearch">
        <TableSearch handleSearchSubmit={ handleSearchSubmit } />
      </Grid.Row>
      <Grid.Row className="items_tableMenus_wrapper">
        <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
          <TableActionsMenu
            data={ projectData }
            displayActionsMenu={ displayActionsMenu }
            error={ projectError }
            handleResetSelections={ handleResetSelections }
            loading={ projectLoading }
            refetch={ projectRefetch }
            refetchCount={ countRefetch }
            selectedItems={ selectedItems }
            team={ team }
            toggleAllItemsSelection={ toggleAllItemsSelection }
            variables={ { ...variables, ...paginationVars } }
          />
        </Grid.Column>
        <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
          <TableItemsDisplay
            count={ count }
            error={ countError }
            loading={ countLoading }
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
                handleSort={ handleSort }
                tableHeaders={ tableHeaders }
                displayActionsMenu={ displayActionsMenu }
              />
              <TableBody
                bodyPaginationVars={ { ...bodyPaginationVars } }
                column={ state.column }
                data={ projectData }
                direction={ state.direction }
                error={ projectError }
                loading={ projectLoading }
                projectTab={ projectTab }
                searchTerm={ searchTerm }
                selectedItems={ selectedItems }
                tableHeaders={ tableHeaders }
                toggleItemSelection={ toggleItemSelection }
                team={ team }
              />
            </Table>
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column className="items_tablePagination">
          <TablePagination
            activePage={ activePage }
            count={ count }
            error={ countError }
            loading={ countLoading }
            handlePageChange={ handlePageChange }
            itemsPerPage={ itemsPerPage }
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
