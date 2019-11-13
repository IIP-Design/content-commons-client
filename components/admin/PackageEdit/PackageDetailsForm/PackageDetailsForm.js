/**
 *
 * PackageDetailsForm
 *
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Input } from 'semantic-ui-react';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import './PackageDetailsForm.scss';

/**
* Form component only.  Form is wrapped in specifc content type HOC to handle
* queries, validation, etc
* @param {object} props
*/
const PackageDetailsForm = props => {
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    isSubmitting,
    isValid,
    setFieldTouched,
    status,
    save
  } = props;

  const handleOnChange = ( e, { name, value } ) => {
    setFieldValue( name, value );
    setFieldTouched( name, true, false );
  };

  return (
    <Fragment>
      { /* Only use autosave with exisiting project */ }
      { props.id && <FormikAutoSave save={ save } /> }
      <Form className="package-data" onSubmit={ handleSubmit }>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width="16">
              <h2 className="heading">
                <span className="uppercase">Description</span>
                <br />
                <small className="msg--required">Required Fields *</small>
              </h2>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 4 }>
              <Form.Group widths="equal">
                <div className="field">
                  <Form.Field
                    id="title"
                    name="title"
                    control={ Input }
                    label="Title"
                    required
                    autoFocus
                    value={ values.title }
                    onChange={ handleOnChange }
                    error={ touched && touched.title && !!errors.title }
                  />
                  <p className="error-message">{ touched.title ? errors.title : '' }</p>
                </div>
              </Form.Group>
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 4 }>
              <Form.Field
                id="type"
                name="type"
                control={ Input }
                label="Package Type"
                value={ values.type }
                onChange={ handleChange }
                readOnly
                tabIndex={ -1 }
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Fragment>
  );
};

PackageDetailsForm.propTypes = {
  id: PropTypes.string,
  status: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  setFieldTouched: PropTypes.func,
  save: PropTypes.func,
};

export default PackageDetailsForm;
