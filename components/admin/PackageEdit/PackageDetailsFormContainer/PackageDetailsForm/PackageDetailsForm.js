/**
 *
 * PackageDetailsForm
 *
 */
import React, { createContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { Form, Grid, Input } from 'semantic-ui-react';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import TermsConditions from 'components/admin/TermsConditions/TermsConditions';
import './PackageDetailsForm.scss';

export const HandleOnChangeContext = createContext();

/**
* Form component only. Form is wrapped in specific content type HOC to handle
* queries, validation, etc
* @param {object} props
*/
const PackageDetailsForm = props => {
  const {
    children,
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    // isSubmitting,
    // isValid,
    setFieldTouched,
    // status,
    save,
    router
  } = props;

  const handleOnChange = ( e, {
    name, value, type, checked
  } ) => {
    if ( type === 'checkbox' ) {
      setFieldValue( name, checked );
    } else {
      setFieldValue( name, value );
    }
    setFieldTouched( name, true, false );
  };

  const getFormattedTypeName = type => {
    if ( type ) {
      switch ( type ) {
        case 'DAILY_GUIDANCE':
          return 'Guidance';
        // case 'SOME_FUTURE_TYPE':
        //   return 'Some Future Type';
        default:
          return type;
      }
    }
    return '';
  };

  return (
    <Fragment>
      { /* Only use autosave with existing project */ }
      { props.id && <FormikAutoSave save={ save } /> }
      <Form className="package-data" onSubmit={ handleSubmit }>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width="16">
              <h3 className="headline">
                <span className="uppercase">Description</span>
                <br />
                <small className="msg--required">Required Fields *</small>
              </h3>
            </Grid.Column>

            <Grid.Column mobile={ 16 } tablet={ 5 } computer={ 5 }>
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

            <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 }>
              <Form.Field
                id="type"
                name="type"
                control={ Input }
                label="Package Type"
                value={ getFormattedTypeName( values.type ) }
                onChange={ handleChange }
                readOnly
                tabIndex={ -1 }
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row reversed="computer">
            <Grid.Column mobile={ 11 }>
              { router.query.action === 'create'
                && (
                  <TermsConditions
                    handleOnChange={ handleOnChange }
                    error={ touched.termsConditions && !!errors.termsConditions }
                  />
                ) }
            </Grid.Column>
            <Grid.Column mobile={ 16 } computer={ 5 }>
              <ButtonAddFiles
                accept=".doc, .docx"
                onChange={ () => {} }
                fluid
                multiple
              >
                + Add Files
              </ButtonAddFiles>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column width="16">
              <HandleOnChangeContext.Provider value={ handleOnChange }>
                { children }
              </HandleOnChangeContext.Provider>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    </Fragment>
  );
};

PackageDetailsForm.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  // status: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  // isSubmitting: PropTypes.bool,
  // isValid: PropTypes.bool,
  setFieldTouched: PropTypes.func,
  save: PropTypes.func,
  router: PropTypes.object
};

export default withRouter( PackageDetailsForm );
