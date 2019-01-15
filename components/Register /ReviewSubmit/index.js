import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import {
  Form, List, Button
} from 'semantic-ui-react';
import { validationSchema } from './validationSchema';
import { permissionOptions } from '../permissionOptions';


const ReviewSubmit = ( {
  values,
  errors,
  handleSubmit,
  handleChange,
  isSubmitting,
  goBack,
  data
} ) => {
  const role = permissionOptions.find( option => option.value === data.permissions );

  return (
    <Form>
      <div style={ { marginBottom: '1rem' } }>Review and submit your information below to request a Content Commons account.</div>
      <List className="register_review">
        <List.Item><span><strong>Name:</strong></span>{ ' ' } { data.firstName }{ values.lastName }</List.Item>
        <List.Item><span><strong>Email:</strong></span>{ ' ' }{ data.email }</List.Item>
        <List.Item><span><strong>Role:</strong></span>{ ' ' }{ role.label }</List.Item>
        <List.Item><span><strong>Team:</strong></span>{ ' ' }{ data.team }</List.Item>
        <List.Item><span><strong>Job Title:</strong></span>{ ' ' }{ data.jobTitle }</List.Item>
      </List>
      <Form.Checkbox
        id="consent"
        name="consent"
        className="register_review-label"
        label="I agree to the Content Commons Terms of Use"
        onChange={ handleChange }
        error={ !!errors.consent }
      />
      <p className="error-message">{ errors.consent }</p>
      <div className="register_progress">
        <Button
          type="button"
          onClick={ goBack }
          disabled={ isSubmitting }
          className="secondary"
        >Previous
        </Button>
        <Button
          type="submit"
          onClick={ handleSubmit }
          disabled={ isSubmitting }
          className="primary"
        >Submit
        </Button>

      </div>
    </Form>
  );
};

ReviewSubmit.propTypes = {

};

export default withFormik( {
  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,

  handleSubmit: ( values, { props, setSubmitting } ) => {
    setSubmitting( false );
    console.dir( values );
    // props.updateState( values );
    // props.goNext();
  }


} )( ReviewSubmit );
