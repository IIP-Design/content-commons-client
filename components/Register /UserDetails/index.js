import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { optionFormatter } from '../../../lib/form';
import { validationSchema } from './validationSchema';
import countries from '../../../static/data/countries';

const countryOptions = optionFormatter( countries );

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
          <span className="subtext">We recommend using your america.gov email if you have one.</span>
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
  goBack: PropTypes.func,
  goNext: PropTypes.func
};

export default withFormik( {
  mapPropsToValues: props => {
    const { data } = props;

    return ( {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      jobTitle: data.jobTitle,
      country: data.country,
      city: data.city,
      howHeard: data.howHeard
    } );
  },

  // validationSchema,
  // validateOnBlur: false,
  // validateOnChange: false,

  handleSubmit: ( values, { props, setSubmitting } ) => {
    props.updateState( values );
    props.goNext();
    setSubmitting( false );
  }

} )( UserDetails );
