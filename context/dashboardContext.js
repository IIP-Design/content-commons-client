import React from 'react';

import { normalizeDashboardData } from 'lib/graphql/util';
import { TEAM_GRAPHIC_PROJECTS_QUERY, TEAM_GRAPHIC_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/graphic';
import { TEAM_VIDEO_PROJECTS_QUERY, TEAM_VIDEO_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY, TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';

const initialState = {
  content: {},
  count: {},
  queries: null,
  team: { contentTypes: null }
};

export const DashboardContext = React.createContext( initialState );

const testContentTypes = team => {
  const contentTypes = team?.contentTypes ? team.contentTypes : '';

  if ( contentTypes.includes( 'GRAPHIC' ) ) return 'graphic';
  if ( contentTypes.includes( 'VIDEO' ) ) return 'video';
  if ( contentTypes.includes( 'PACKAGE' ) ) return 'packages';

  return null;
};

const parseCount = ( queryData, team ) => {
  const type = testContentTypes( team );

  const count = queryData?.[type] ? queryData[type].length : 0;

  return count;
};

export const setQueries = team => {
  const queries = {};

  switch ( testContentTypes( team ) ) {
  case 'graphic':
    queries.content = TEAM_GRAPHIC_PROJECTS_QUERY;
    queries.count = TEAM_GRAPHIC_PROJECTS_COUNT_QUERY;

    return queries;
  case 'video':
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
  switch ( action.type ) {
  case 'UPDATE_COUNT':
    return {
      ...state,
      count: {
        count: parseCount( action.payload.count.data, action.payload.team ),
        error: action.payload.count.error,
        loading: action.payload.count.loading,
        refetch: action.payload.count.refetch
      }
    };
  case 'UPDATE_CONTENT':
    return {
      ...state,
      content: {
        data: normalizeDashboardData( action.payload.data, action.payload.type ),
        error: action.payload.error,
        loading: action.payload.loading,
        refetch: action.payload.refetch
      }
    };
  case 'UPDATE_TEAM':
    return {
      ...state,
      team: action.payload.team,
      projectType: testContentTypes( action.payload.team ),
      queries: setQueries( action.payload.team )
    };
  default:
    return { ...state };
  }
};
