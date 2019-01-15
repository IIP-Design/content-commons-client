import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { optionFormatter, formikHandleOnChange } from '../../../lib/form';
import { validationSchema } from './validationSchema';
import { permissionOptions } from '../permissionOptions';

const ALL_TEAMS_QUERY = gql`
  query ALL_TEAMS_QUERY {
    teams {
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
  showTeamDetail
} ) => {
  const handleOnChange = ( e, { name, value } ) => formikHandleOnChange( name, value, setFieldValue );

  return (
    <Form noValidate>
      <p className="register_question">What kind of access would you like when using the Content Commons?</p>

      { permissionOptions.map( option => (
        <Form.Field key={ option.key } className="register_option">
          <Form.Radio
            label={ option.label }
            value={ option.value }
            name="permissions"
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
            <Form.Dropdown
              className="register_dropdown"
              label="Which team will you be a part of?"
              placeholder="- Select Team"
              name="team"
              search
              selection
              options={ optionFormatter( data.teams ) }
              value={ values.team }
              onChange={ handleOnChange }
              error={ !!errors.team }
            />
          );
        } }
      </Query>
      <p className="error-message">{ errors.team }</p>

      { values.permissions === 'TEAM_ADMIN'
        ? (
          <Button
            className="newTeam"
            onClick={ showTeamDetail }
          >
            { 'I don\'t see my team\'s name. Request new...' }
          </Button>
        ) : null
      }
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
  showTeamDetail: PropTypes.func
};

export default withFormik( {
  mapPropsToValues: () => ( {
    permissions: 'EDITOR',
    team: 'IIP Video Production'
  } ),

  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,

  handleSubmit: ( values, { props, setSubmitting } ) => {
    setSubmitting( false );
    props.updateState( values );
    props.goNext();
  }

} )( SelectRole );
