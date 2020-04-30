import React from 'react';

import { getProjectsType, normalizeDashboardData } from 'lib/graphql/util';
import { TEAM_GRAPHIC_PROJECTS_QUERY, TEAM_GRAPHIC_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/graphic';
import { TEAM_VIDEO_PROJECTS_QUERY, TEAM_VIDEO_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY, TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';

const initialState = {
  column: 'createdAt',
  content: {},
  count: {},
  direction: 'descending',
  queries: null,
  selected: {
    displayActionsMenu: false,
    selectedItems: new Map()
  },
  team: { contentTypes: null }
};

export const DashboardContext = React.createContext( initialState );

const getContentTypesFromTeam = team => {
  const contentTypes = team?.contentTypes ? team.contentTypes : '';

  const type = getProjectsType( contentTypes );

  return type || null;
};

const parseCount = ( queryData, team ) => {
  const type = getContentTypesFromTeam( team );

  const count = queryData?.[type] ? queryData[type].length : 0;

  return count;
};

const toggleItemSelection = ( data, selected ) => {
  const isChecked = data.checked;

  const updated = selected.set( String( data['data-label'] ), isChecked );
  const areOthersSelected = Array.from( updated.values() ).includes( true );

  return {
    displayActionsMenu: areOthersSelected,
    selectedItems: updated
  };
};

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
    selectedItems: newSelectedItems
  };
};

export const setQueries = team => {
  const queries = {};

  switch ( getContentTypesFromTeam( team ) ) {
    case 'graphicProjects':
      queries.content = TEAM_GRAPHIC_PROJECTS_QUERY;
      queries.count = TEAM_GRAPHIC_PROJECTS_COUNT_QUERY;

      return queries;
    case 'videoProjects':
      queries.content = TEAM_VIDEO_PROJECTS_QUERY;
      queries.count = TEAM_VIDEO_PROJECTS_COUNT_QUERY;

      return queries;
    case 'packages':
      queries.content = TEAM_PACKAGES_QUERY;
      queries.count = TEAM_PACKAGES_COUNT_QUERY;

      return queries;
    default:
      return queries;
  }
};

export const dashboardReducer = ( state, action ) => {
  const { payload } = action;

  switch ( action.type ) {
    case 'UPDATE_COLUMN':
      return {
        ...state,
        column: payload.column,
        direction: payload.direction
      };
    case 'UPDATE_COUNT':
      return {
        ...state,
        count: {
          count: parseCount( payload.count.data, payload.team ),
          error: payload.count.error,
          loading: payload.count.loading,
          refetch: payload.count.refetch
        }
      };
    case 'UPDATE_CONTENT':
      return {
        ...state,
        content: {
          data: normalizeDashboardData( payload.data, payload.type ),
          error: payload.error,
          loading: payload.loading,
          refetch: payload.refetch
        }
      };
    case 'UPDATE_SELECTED':
      return {
        ...state,
        selected: toggleItemSelection( payload.data, payload.selected )
      };
    case 'UPDATE_SELECTED_ALL':
      return {
        ...state,
        selected: toggleAllItemsSelection( payload.selected )
      };
    case 'RESET_SELECTED':
      return {
        ...state,
        selected: {
          displayActionsMenu: false,
          selectedItems: new Map()
        }
      };
    case 'UPDATE_TEAM':
      return {
        ...state,
        team: payload.team,
        projectType: getContentTypesFromTeam( payload.team ),
        queries: setQueries( payload.team )
      };
    default:
      return { ...state };
  }
};
