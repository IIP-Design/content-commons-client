import React from 'react';
import PropTypes from 'prop-types';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { validationSchema } from './validationSchema';

// Organizations/agency should be pulled from rest endpoint?
import {
  optionFormatter,
  formikHandleOnChange,
  formikHandleCheckboxOnChange
} from '../../../lib/form';
import organizations from '../../../static/data/organizations';

const organizationOptions = optionFormatter( organizations );

const contentOptions = [
  {
    key: 1,
    value: 'audio',
    label: 'Audio',
    content: 'Audio files of podcasts, music, b-roll audio, etc.'
  },
  {
    key: 2,
    value: 'document',
    label: 'Documents and Resources',
    content: 'Word documents, PowerPoint decks, PDFs, reports, training guides, etc.'
  },
  {
    key: 3,
    value: 'image',
    label: 'Imagery',
    content: 'Photos, social media graphics, posters, web graphics, etc.'
  },
  {
    key: 4,
    value: 'learning',
    label: 'Teaching Materials',
    content: 'Courses, lessons, glossaries, quizzes, etc'
  },
  {
    key: 5,
    value: 'video',
    label: 'Video',
    content: 'Video files for web and broadcast use.'
  }
];

const TeamDetails = ( {
  values,
  errors,
  handleSubmit,
  handleChange,
  setFieldValue,
  isSubmitting,
  updateState,
  goBack
} ) => {
  const handleOnChange = ( e, { name, value } ) => formikHandleOnChange( name, value, setFieldValue );

  const handleCheckboxOnChange = ( e, data ) => {
    formikHandleCheckboxOnChange( data, setFieldValue, values );
  };

  const handleBackClick = () => {
    updateState( values );
    goBack();
  };

  return (
    <Form noValidate>
      <Form.Field>
        <Form.Input
          id="teamName"
          name="teamName"
          label="What would you like to name this team?"
          value={ values.teamName }
          onChange={ handleChange }
          error={ !!errors.teamName }
          required
        />
        <p className="error-message">{ errors.teamName }</p>
      </Form.Field>
      <Form.Field>
        <Form.Dropdown
          id="organization"
          name="organization"
          label="Which USG agency is this team associated with"
          value={ values.organization }
          placeholder="- Select Agency"
          search
          selection
          options={ organizationOptions }
          onChange={ handleOnChange }
          error={ !!errors.organization }
        />
        <p className="error-message">{ errors.organization }</p>
      </Form.Field>
      <p className="register_question">What type of content will this team be contributing to the Content Commons? (select all that apply)</p>

      { contentOptions.map( option => (
        <Form.Field key={ option.key } className="register_option">
          <Form.Checkbox
            label={ option.label }
            value={ option.value }
            name="contentType"
            checked={ values.contentType.includes( option.value ) }
            onChange={ handleCheckboxOnChange }
            error={ !!errors.contentType }
          />
          <p className="checkbox_content">{ option.content }</p>
        </Form.Field>
      ) ) }
      <p className="error-message">{ errors.contentType }</p>

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

TeamDetails.propTypes = {
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
      teamName: data.teamName,
      organization: data.organization,
      contentType: data.contentType
    } );
  },

  validationSchema,
  validateOnBlur: false,
  validateOnChange: false,

  handleSubmit: ( values, { props, setSubmitting } ) => {
    setSubmitting( false );
    props.updateState( values );
    props.goNext();
  }

} )( TeamDetails );
