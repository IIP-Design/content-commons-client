import React from 'react';
import { normalizeDashboardData } from 'lib/graphql/util';
import { getContentTypesFromTeam, setQueries } from 'components/admin/Dashboard/utils';

/**
 * Checks whether there are and projects of a given type and returns their count
 *
 * @param {Object} queryData project data received from GraphQL
 * @param {Object} team team data received from GraphQL
 */
const parseCount = ( queryData, team ) => {
  const type = getContentTypesFromTeam( team );

  const count = queryData?.[type] ? queryData[type].length : 0;

  return count;
};

/**
 * Toggles an item on/off when clicked
 *
 * @param {Object} data information from the click event
 * @param {Map} selected key-value pairings of items and whether or not they are selected
 */
const toggleItemSelection = ( data, selected ) => {
  const isChecked = data.checked;

  const updated = selected.set( String( data['data-label'] ), isChecked );
  const areOthersSelected = Array.from( updated.values() ).includes( true );

  return {
    displayActionsMenu: areOthersSelected,
    selectedItems: updated,
  };
};

/**
 * If any item is selected sets all to unselected and vice versa
 *
 * @param {Map} selected key-value pairings of items and whether or not they are selected
 */
const toggleAllItemsSelection = selected => {
  const selectedIds = Array
    .from( document.querySelectorAll( '[data-label]' ) )
    .map( item => item.dataset.label );

  const newSelectedItems = new Map();

  const hasSelected = Array.from( selected.keys() ).length > 0;

  if ( !hasSelected ) {
    selectedIds.forEach( item => {
      newSelectedItems.set( item, !hasSelected );
    } );
  }

  return {
    displayActionsMenu: !hasSelected,
    selectedItems: newSelectedItems,
  };
};

export const dashboardReducer = ( state, action ) => {
  const { payload } = action;

  switch ( action.type ) {
    case 'UPDATE_COLUMN':
      return {
        ...state,
        column: payload.column,
        direction: payload.direction,
      };
    case 'UPDATE_COUNT':
      return {
        ...state,
        count: {
          count: parseCount( payload.count.data, payload.team ),
          error: payload.count.error,
          loading: payload.count.loading,
          refetch: payload.count.refetch,
        },
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: {
          data: normalizeDashboardData( payload.data, payload.type ),
          error: payload.error,
          loading: payload.loading,
          refetch: payload.refetch,
        },
      };
    case 'UPDATE_FILES':
      return {
        ...state,
        files: {
          files: payload.files,
          error: payload.error,
          loading: payload.loading,
        },
      };
    case 'UPDATE_SELECTED':
      return {
        ...state,
        selected: toggleItemSelection( payload.data, payload.selected ),
      };
    case 'UPDATE_SELECTED_ALL':
      return {
        ...state,
        selected: toggleAllItemsSelection( payload.selected ),
      };
    case 'RESET_SELECTED':
      return {
        ...state,
        selected: {
          displayActionsMenu: false,
          selectedItems: new Map(),
        },
      };
    case 'UPDATE_TEAM':
      return {
        ...state,
        team: payload.team,
        projectType: getContentTypesFromTeam( payload.team ),
        queries: setQueries( payload.team ),
      };
    default:
      return { ...state };
  }
};

export const DashboardContext = React.createContext();
