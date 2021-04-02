import { PROJECT_UPDATED } from '../constants';

const projectUpdate = ( state = {}, action ) => {
  switch ( action.type ) {
    case PROJECT_UPDATED:
      return {
        ...state,
        [action.payload.key]: action.payload.isProjectUpdated,
      };

    default:
      return state;
  }
};

export default projectUpdate;
