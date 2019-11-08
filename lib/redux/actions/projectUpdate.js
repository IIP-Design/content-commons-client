import { PROJECT_UPDATED } from '../constants';

export const projectUpdated = ( id, isProjectUpdated ) => ( {
  type: PROJECT_UPDATED,
  payload: { key: id, isProjectUpdated }
} );
