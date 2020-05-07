import React from 'react';
import gql from 'graphql-tag';

import { getProjectsType, normalizeDashboardData } from 'lib/graphql/util';
// import { DELETE_GRAPHIC_PROJECT_MUTATION, TEAM_GRAPHIC_PROJECTS_QUERY, TEAM_GRAPHIC_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/graphic';
import { DELETE_PACKAGE_MUTATION, PACKAGE_FILES_QUERY, TEAM_PACKAGES_QUERY, TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';
import { DELETE_VIDEO_PROJECT_MUTATION, TEAM_VIDEO_PROJECTS_QUERY, TEAM_VIDEO_PROJECTS_COUNT_QUERY, VIDEO_PROJECT_FILES_QUERY } from 'lib/graphql/queries/video';

import { graphicMock } from './mocks';
// Use dummy queries instead of actual graphic, not yet written queries, to suppress errors
const DELETE_GRAPHIC_PROJECT_MUTATION = gql`mutation { deleteUser(where: { id: "1234" }) { id } }`;
const TEAM_GRAPHIC_PROJECTS_QUERY = gql`query { users { lastName } }`;
const TEAM_GRAPHIC_PROJECTS_COUNT_QUERY = gql`query { users { lastName } }`;
const GRAPHIC_PROJECT_FILES_QUERY = gql`query { users { lastName } }`;

// Sets default values before any GraphQL query is executed
const initialState = {
  column: 'createdAt',
  content: {},
  count: {},
  direction: 'descending',
  queries: {
    content: null,
    count: null,
    files: null,
    remove: null,
  },
  selected: {
    displayActionsMenu: false,
    selectedItems: new Map(),
  },
  team: { contentTypes: null },
};

export const DashboardContext = React.createContext( initialState );

/**
 * Returns the project type based off of the content type available to a team
 *
 * @param {Object} team team data recieved from GraphQL
 */
const getContentTypesFromTeam = team => {
  const contentTypes = team?.contentTypes ? team.contentTypes : '';

  const type = getProjectsType( contentTypes );

  return type || null;
};

/**
 * Checks whether there are and projects of a given type and returns their count
 *
 * @param {Object} queryData project data recieved from GraphQL
 * @param {Object} team team data recieved from GraphQL
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

/**
 * Returns the expected queries depending on what content types a team has access to
 *
 * @param {Object} team team data recieved from GraphQL
 * @returns {Object} list of relevant queries
 */
export const setQueries = team => {
  const queries = {};

  switch ( getContentTypesFromTeam( team ) ) {
    case 'graphicProjects':
      queries.content = TEAM_GRAPHIC_PROJECTS_QUERY;
      queries.count = TEAM_GRAPHIC_PROJECTS_COUNT_QUERY;
      queries.files = GRAPHIC_PROJECT_FILES_QUERY;
      queries.remove = DELETE_GRAPHIC_PROJECT_MUTATION;

      return queries;
    case 'videoProjects':
      queries.content = TEAM_VIDEO_PROJECTS_QUERY;
      queries.count = TEAM_VIDEO_PROJECTS_COUNT_QUERY;
      queries.files = VIDEO_PROJECT_FILES_QUERY;
      queries.remove = DELETE_VIDEO_PROJECT_MUTATION;

      return queries;
    case 'packages':
      queries.content = TEAM_PACKAGES_QUERY;
      queries.count = TEAM_PACKAGES_COUNT_QUERY;
      queries.files = PACKAGE_FILES_QUERY;
      queries.remove = DELETE_PACKAGE_MUTATION;

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
        direction: payload.direction,
      };
    case 'UPDATE_COUNT':
      // Count and error load in mock values for graphics until actual queries get connected
      return {
        ...state,
        count: {
          count: payload.type === 'graphicProjects' ? parseCount( graphicMock, payload.team ) : parseCount( payload.count.data, payload.team ),
          error: payload.type === 'graphicProjects' ? null : payload.count.error,
          loading: payload.count.loading,
          refetch: payload.count.refetch,
        },
      };
    case 'UPDATE_CONTENT':
      // Data and error load in mock values for graphics until actual queries get connected
      return {
        ...state,
        content: {
          data: payload.type === 'graphicProjects' ? normalizeDashboardData( graphicMock, payload.type ) : normalizeDashboardData( payload.data, payload.type ),
          error: payload.type === 'graphicProjects' ? null : payload.error,
          loading: payload.loading,
          refetch: payload.refetch,
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
