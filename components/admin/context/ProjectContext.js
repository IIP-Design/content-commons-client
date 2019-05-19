import React, { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const ProjectContext = createContext();

// shoild this be here as opposed to project page?
// const reducer = ( state, action ) => {
//   switch ( action.type ) {
//     case 'updateProject':
//       return {
//         ...state
//       };

//     default:
//       return state;
//   }
// };


export const ProjectProvider = ( { reducer, initialState, children } ) => (
  <ProjectContext.Provider value={ useReducer( reducer, initialState ) }>
    { children }
  </ProjectContext.Provider>
);

ProjectProvider.propTypes = {
  reducer: PropTypes.func,
  initialState: PropTypes.object,
  children: PropTypes.node
};


export const useProjectStateValue = () => useContext( ProjectContext );
