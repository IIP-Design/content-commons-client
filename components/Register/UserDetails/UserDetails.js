import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { optionFormatter } from 'lib/form';
import countries from 'static/data/countries.json';
import { getValidationSchema } from './validationSchema';

const countryOptions = optionFormatter( countries, 'code' );

const UserDetails = ( {
  values,
  errors,
  handleSubmit,
  handleChange,
  setFieldValue,
  isSubmitting,
  updateState,
  goBack
} ) => {
  // Need to use this callback instead of the standard formik handleChange
  // to deal with selects, dropdowns, radio, checkbox groups
  const handleOnChange = ( e, { name, value } ) => setFieldValue( name, value );
  const handleBackClick = () => {
    updateState( values );
    goBack();
  };

  return (
    <Form noValidate>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input
            id="firstName"
            label="First Name"
            name="firstName"
            value={ values.firstName }
            onChange={ handleChange }
            error={ !!errors.firstName }
            required
          />
          <p className="error-message">{ errors.firstName }</p>
        </Form.Field>
        <Form.Field>
          <Form.Input
            id="lastName"
            label="Last Name"
            name="lastName"
            value={ values.lastName }
            onChange={ handleChange }
            error={ !!errors.lastName }
            required
          />
          <p className="error-message">{ errors.lastName }</p>
        </Form.Field>
      </Form.Group>

      <Form.Group widths="equal">
        <Form.Field>
          <Form.Input
            id="email"
            type="email"
            label="Email Address"
            name="email"
            value={ values.email }
            onChange={ handleChange }
            error={ !!errors.email }
            required
          />
          <span className="subtext">Use of an america.gov email is required.</span>
          <p className="error-message">{ errors.email }</p>
        </Form.Field>
        <Form.Input
          id="jobTitle"
          label="Job Title"
          name="jobTitle"
          value={ values.jobTitle }
          onChange={ handleChange }
        />
      </Form.Group>
      <Form.Group widths="equal">
        <Form.Field>
          <Form.Dropdown
            id="country"
            name="country"
            label="Country"
            value={ values.country }
            placeholder="- Select Country"
            search
            selection
            options={ countryOptions }
            onChange={ handleOnChange }
            error={ !!errors.country }
            required
          />
          <p className="error-message">{ errors.country }</p>
        </Form.Field>
        <Form.Field>
          <Form.Input
            id="city"
            label="City"
            name="city"
            value={ values.city }
            onChange={ handleChange }
            error={ !!errors.city }
            required
          />
          <p className="error-message">{ errors.city }</p>
        </Form.Field>
      </Form.Group>
      <Form.TextArea
        id="howHeard"
        label="How did you hear about the Content Commons?"
        name="howHeard"
        value={ values.howHeard }
        onChange={ handleChange }
      />

      <div className="register_progress">
        <Button
          type="button"
          onClick={ handleBackClick }
          disabled={ isSubmitting }
          className="secondary"
        >Previous
        </Button>
        <Button
          type="submit"
          onClick={ handleSubmit }
          disabled={ isSubmitting }
          className="primary"
        >Next
        </Button>
      </div>
    </Form>
  );
};

UserDetails.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  setFieldValue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  updateState: PropTypes.func,
  goBack: PropTypes.func
};

// Set the initial form values with the state props
// Validation happens against the formik values object
// On submit, update state with the validated values
export default withFormik( {
  mapPropsToValues: props => {
    const { user } = props;

    return ( {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      jobTitle: user.jobTitle,
      country: user.country,
      city: user.city,
      howHeard: user.howHeard
    } );
  },

  validationSchema: getValidationSchema,
  validateOnBlur: false,
  validateOnChange: false,

  handleSubmit: ( values, { props, setSubmitting } ) => {
    props.updateState( values );
    props.goNext();
    setSubmitting( false );
  }
} )( UserDetails );
