/**
 *
 * ScrollableTableWithMenu
 *
 */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import gql from 'graphql-tag';
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
  const [windowWidth, setWindowWidth] = useState( null );
  const [searchTerm, setSearchTerm] = useState( '' );
  const [activePage, setActivePage] = useState( 1 );
  const [itemsPerPage, setItemsPerPage] = useState( 15 );
  const [orderBy, setOrderBy] = useState( 'createdAt_DESC' );
  const [skip, setSkip] = useState( 0 );

  // Constants for layout transformations
  const TIMEOUT_DELAY = 500;
  const _breakpoint = 767;

  const { dispatch, state } = useContext( DashboardContext );
  const projectType = state?.projectType || '';
  const column = state?.column || 'createdAt';
  const direction = state?.direction || 'descending';

  // No-op query is never called, but added to avoid reference error in cases where context has not yet loaded
  const noopQuery = gql`query{ NOOP { noop } }`;

  // Get the content data
  const contentQuery = state?.queries?.content || noopQuery;
  const countQuery = state?.queries?.count || noopQuery;

  // Set GraphQL query variables
  const variables = { team: team.name, searchTerm };
  const bodyPaginationVars = { first: itemsPerPage, orderBy, skip };
  const paginationVars = { first: itemsPerPage, skip };

  /**
   * Get count of projects from GraphQL
   */
  const countData = useQuery( countQuery, {
    variables: { ...variables },
    fetchPolicy: 'cache-and-network',
  } );

  // The data for following columns cannot by sort within the GraphQL query
  const isLegacySort = column === 'author' || column === 'categories' || column === 'team';

  /**
   * Get data for each project from GraphQL, if can be sorted by the GraphQL query send pagination vars
   * Otherwise, return all results for client-side sorting within the TableBody Component
   */
  const contentData = useQuery( contentQuery, {
    variables: isLegacySort ? { ...variables } : { ...variables, ...bodyPaginationVars },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
  } );

  useEffect( () => {
    const { data, error, loading, refetch } = countData;

    // Save project count in context
    dispatch( {
      type: 'UPDATE_COUNT',
      payload: {
        count: { data, error, loading, refetch }, team, type: projectType,
      },
    } );
  }, [
    countData, dispatch, projectType, team,
  ] );

  useEffect( () => {
    const { data, error, loading, refetch } = contentData;

    // Save project data in context
    dispatch( { type: 'UPDATE_CONTENT', payload: { data, error, loading, refetch, type: projectType } } );
  }, [
    contentData, dispatch, projectType,
  ] );

  /**
   * Set the table headers on mobile
   */
  const tableMenuSelectionsOnMobile = () => {
    if ( isMobile() ) {
      setTableHeaders( [...tableHeaders, ...columnMenu] );
    }
  };

  /**
   * Handle resizing the table
   */
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

  useEffect( () => {
    tableMenuSelectionsOnMobile();
    window.addEventListener( 'resize', tableMenuSelectionsOnResize );

    // Clean up event listener on dismount
    return () => {
      window.removeEventListener( 'resize', tableMenuSelectionsOnResize );
    };
  }, [] );

  /**
   * Update the table when navigating using the table pagination
   *
   * @param {Object} _ Unused synthetic click event object
   * @param {Object} data Event data object destructured to pull off active page
   */
  const handlePageChange = ( _, { activePage: page } ) => {
    dispatch( { type: 'RESET_SELECTED' } );
    setActivePage( page );
    setSkip( ( page - 1 ) * itemsPerPage );
  };

  /**
   * Resets the table to the first page of results.
   */
  const handleResetActivePage = () => {
    setActivePage( 1 );
    setSkip( 0 );
  };

  /**
   * Resets the table and the selected items list
   */
  const handleResetSelections = () => {
    dispatch( { type: 'RESET_SELECTED' } );
    handleResetActivePage();
  };

  /**
   * Saves the submitted search term to state initiating a new filtered query
   *
   * @param {Object} e Synthetic click event object
   * @param {string} term Term on which to filter search results
   */
  const handleSearchSubmit = ( e, term ) => {
    e.preventDefault();
    setSearchTerm( term.trim() );
    handleResetActivePage();
  };

  /**
   * Resorts the table based on the selected column name.
   *
   * @param {string} clickedColumn Selected column name
   */
  const handleSort = clickedColumn => () => {
    if ( state.displayActionsMenu ) return;

    // Pass column, direction to TableBody so re-rendered on TableHeader click
    // Reset to first page of results after sort
    const dir = direction === 'ascending' ? 'descending' : 'ascending';

    dispatch( { type: 'UPDATE_COLUMN', payload: { column: clickedColumn, direction: dir } } );

    const isVideo = team?.contentTypes && team.contentTypes.includes( 'VIDEO' );
    const columnName = !isVideo && clickedColumn === 'projectTitle'
      ? 'title'
      : clickedColumn;

    setOrderBy( `${columnName}_${dir === 'ascending' ? 'ASC' : 'DESC'}` );

    handleResetActivePage();
  };

  /**
   * Updates the table when a column is shown/hidden
   *
   * @param {Object} e Synthetic click event object
   */
  const tableMenuOnChange = e => {
    e.persist();
    const menuItem = {
      name: e.target.parentNode.dataset.propname,
      label: e.target.parentNode.dataset.proplabel,
    };

    if ( tableHeaders.map( h => h.name ).includes( menuItem.name ) ) {
      setTableHeaders( tableHeaders.filter( h => h.name !== menuItem.name ) );
    } else {
      setTableHeaders( [...tableHeaders, menuItem] );
    }
  };

  /**
   * Toggles all items in table to selected true/false
   *
   * @param {Object} e Synthetic click event object
   */
  const toggleAllItemsSelection = e => {
    e.stopPropagation();
    const selected = state?.selected?.selectedItems ? state.selected.selectedItems : new Map();

    dispatch( { type: 'UPDATE_SELECTED_ALL', payload: { selected } } );
  };

  const count = state?.count?.count || null;
  const countError = state?.count?.error || null;
  const countLoading = state?.count?.loading || false;
  const countRefetch = state?.count?.refetch || ( () => {} );

  const projectData = state?.content?.data || null;
  const projectError = state?.content?.error || null;
  const projectLoading = state?.content?.loading || false;
  const projectRefetch = state?.content?.refetch || ( () => {} );

  return (
    <Grid>
      <Grid.Row className="items_tableSearch">
        <TableSearch handleSearchSubmit={ handleSearchSubmit } />
      </Grid.Row>
      <Grid.Row className="items_tableMenus_wrapper">
        <Grid.Column mobile={ 16 } tablet={ 3 } computer={ 3 }>
          <TableActionsMenu
            data={ projectData }
            error={ projectError }
            handleResetSelections={ handleResetSelections }
            loading={ projectLoading }
            refetch={ projectRefetch }
            refetchCount={ countRefetch }
            toggleAllItemsSelection={ toggleAllItemsSelection }
            variables={ { ...variables, ...paginationVars } }
          />
        </Grid.Column>
        <Grid.Column mobile={ 16 } tablet={ 13 } computer={ 13 } className="items_tableMenus">
          <TableItemsDisplay
            count={ count }
            error={ countError }
            loading={ countLoading }
            handleChange={ setItemsPerPage }
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
              />
              <TableBody
                bodyPaginationVars={ { ...bodyPaginationVars } }
                column={ column }
                data={ projectData }
                direction={ direction }
                error={ projectError }
                loading={ projectLoading }
                projectTab={ projectTab }
                searchTerm={ searchTerm }
                tableHeaders={ tableHeaders }
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
  projectTab: PropTypes.string,
};

export default ScrollableTableWithMenu;
