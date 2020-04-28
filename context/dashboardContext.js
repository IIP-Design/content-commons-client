import React from 'react';
import { useQuery } from '@apollo/react-hooks';

import { getProjectsType, setProjectsQueries, setProjectTitle } from 'lib/graphql/util';
import { TEAM_GRAPHIC_PROJECTS_QUERY, TEAM_GRAPHIC_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/graphic';
import { TEAM_VIDEO_PROJECTS_QUERY, TEAM_VIDEO_PROJECTS_COUNT_QUERY } from 'lib/graphql/queries/video';
import { TEAM_PACKAGES_QUERY, TEAM_PACKAGES_COUNT_QUERY } from 'lib/graphql/queries/package';

const initialState = {
  count: {},
  queries: null,
  team: { contentTypes: null }
};

export const DashboardContext = React.createContext( initialState );

// Determine type of dashboard projects
// const dashboardProjectsType = getProjectsType( team );

// // Determine which queries to run
// const graphQueries = setProjectsQueries( team, {
//   graphicProjects: TEAM_GRAPHIC_PROJECTS_QUERY,
//   graphicProjectsCount: TEAM_GRAPHIC_PROJECTS_COUNT_QUERY,
//   videoProjects: TEAM_VIDEO_PROJECTS_QUERY,
//   videoProjectsCount: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
//   packages: TEAM_PACKAGES_QUERY,
//   packagesCount: TEAM_PACKAGES_COUNT_QUERY
// } );

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
  case 'set-queries':
    return {
      ...state,
      queries: setQueries( action.payload.team )
    };
  case 'UPDATE_COUNT':
    return {
      ...state,
      count: {
        count: parseCount( action.payload.count.data, action.payload.team ),
        error: action.payload.count.error,
        loading: action.payload.count.loading
      }
    };
  case 'UPDATE_TEAM':
    return {
      ...state,
      team: action.payload.team,
      queries: setQueries( action.payload.team )
    };
  default:
    return { ...state };
  }
};
