import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Input, Button } from 'semantic-ui-react';
import { optionFormatter, formikHandleOnChange } from '../../../lib/form';
import { validationSchema } from './validationSchema';
import { permissionOptions } from '../permissionOptions';

const ALL_TEAMS_QUERY = gql`
  query ALL_TEAMS_QUERY {
    teams {
      id
      name
    }
  }
`;

const SelectRole = ( {
  values,
  errors,
  handleSubmit,
  setFieldValue,
  isSubmitting,
  teamDetails,
  showTeamDetails,
  hideTeamDetails
} ) => {
  const handleOnChange = ( e, { name, value, options } ) => {
    if ( name === 'permissions' && value !== 'TEAM_ADMIN' ) {
      hideTeamDetails();
    }

    // the team id is being stored in a hidden input field, so when the
    // the team changes, update the team id
    if ( name === 'team' ) {
      const selectedOption = options.filter( option => option.value === value );
      setFieldValue( 'teamId', selectedOption[0].key );
    }
    return formikHandleOnChange( name, value, setFieldValue );
  };


  return (
    <Form noValidate>
      <p className="register_question">What kind of access would you like when using the Content Commons?</p>

      { permissionOptions.map( option => (
        <Form.Field key={ option.key } className="register_option">
          <Form.Radio
            name="permissions"
            label={ option.label }
            value={ option.value }
            checked={ values.permissions === option.value }
            onChange={ handleOnChange }
            error={ !!errors.permissions }
          />
          <p className="checkbox_content">{ option.content }</p>
        </Form.Field>
      ) ) }
      <p className="error-message">{ errors.permissions }</p>

      <Query query={ ALL_TEAMS_QUERY }>
        { ( { data, loading, error } ) => {
          if ( loading ) return <p>loading...</p>;
          if ( error ) return <p>Error...</p>;

          return (
            <div>
              <Form.Dropdown
                name="team"
                className={ teamDetails ? 'register_dropdown hide' : 'register_dropdown show' }
                label="Which team will you be a part of?"
                placeholder="- Select Team"
                search
                selection
                options={ optionFormatter( data.teams, 'id' ) }
                value={ values.team }
                onChange={ handleOnChange }
                error={ !!errors.team }
              />
            </div>
          );
        } }
      </Query>
      <Input type="hidden" value={ values.teamId } />
      <p className="error-message">{ errors.team }</p>

      { /* Disable new team creation for now
       { values.permissions === 'TEAM_ADMIN'
        ? (
          <Button
            className={ teamDetails ? 'newTeam hide' : 'newTeam show' }
            type="button"
            onClick={ () => {
              showTeamDetails();
            } }
          >
            { 'I don\'t see my team\'s name. Request new...' }
          </Button>
        ) : null
      }
      */ }

      <div className="register_progress">
        <Button
          type="submit"
          onClick={ handleSubmit }
          disabled={ isSubmitting }
          className="primary init"
        >Next
        </Button>
      </div>

    </Form>
  );
};

SelectRole.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  setFieldValue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  showTeamDetails: PropTypes.func,
  hideTeamDetails: PropTypes.func,
  teamDetails: PropTypes.bool
};

// Set the initial form values with the state props
// Validation happens against the formik values object
// On submit, update state with the validated values
export default withFormik( {
  mapPropsToValues: props => {
    const { user } = props;

    return {
      permissions: user.permissions,
      team: user.team.name,
      teamId: user.team.id
    };
  },

  validationSchema,
  validateOnBlur: false, // turn off field validation, validate onSubmit
  validateOnChange: false, // turn off field validation, validate onSubmit

  handleSubmit: ( values, { props, setSubmitting } ) => {
    setSubmitting( false );
    props.updateState( {
      permissions: values.permissions,
      team: {
        ...props.user.team,
        id: values.teamId,
        name: values.team,
      }
    } );
    props.goNext();
  }

} )( SelectRole );
