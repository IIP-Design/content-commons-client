
import * as Yup from 'yup';

export const validationSchema = Yup.object().shape( {
  permissions: Yup.string()
    .required( 'Permissions is required!' ),
  team: Yup.string()
    .required( 'Team is required!' ),
} );
