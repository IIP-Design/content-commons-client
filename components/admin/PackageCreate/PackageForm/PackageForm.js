import React, { useState, useEffect, createContext } from 'react';
import PropTypes from 'prop-types';

import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown/CategoryDropdown';
import PolicyPriorityDropdown from 'components/admin/dropdowns/PolicyPriorityDropdown/PolicyPriorityDropdown';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
import TextInput from './TextInput/TextInput';
import PackageType from './PackageType/PackageType';

import styles from './PackageForm.module.scss';

export const HandleOnChangeContext = createContext();

const PackageForm = ( {
  setValues,
  setTouched,
  setFieldValue,
  setFieldTouched,
  touched,
  values,
  errors,
  children,
  packageTypes,
  reset,
} ) => {
  const [hideFields, setHideFields] = useState( true );
  const isGuidance = type => type === 'DAILY_GUIDANCE' || type === 'PACKAGE';

  /**
   * Hide or shows additional playbook/toolkit fields
   * If a type is not set, implies multiple package types available so show default
   * view (hide additional fields). Else check type = guidance package and hide if true
   * @param {string} type package type
   * @returns bool
   */
  const hideAdditionalFields = type => ( ( !type ) ? true : isGuidance( type ) );

  useEffect( () => {
    setHideFields( hideAdditionalFields( values.type ) );
  }, [values?.type] );

  const handleOnChange = ( e, {
    name, value, type, checked,
  } ) => {
    if ( type === 'checkbox' ) {
      setFieldValue( name, checked );
    } else {
      setFieldValue( name, value );
    }
    setFieldTouched( name, true, false );

    if ( name === 'type' ) {
      reset( value, setValues, setTouched );
    }
  };

  return (
    <div className={ styles.form_container }>
      <h3>
        <span className={ styles.uppercase }>Description</span>
        <small className={ styles['msg--required'] }>Required Fields *</small>
      </h3>
      <form>
        <div className={ styles.form }>
          <div className={ styles.title }>
            <TextInput
              label="Package Title"
              id="title"
              name="title"
              type="text"
              required
            />
          </div>
          <PackageType
            label="Package Type"
            id="type"
            name="type"
            value={ values.type }
            onChange={ handleOnChange }
            required
            packageTypes={ packageTypes }
          />
          <TextInput
            label="Team"
            id="team"
            name="team"
            type="text"
            value={ values.team }
            readOnly="readonly"
          />
        </div>
        <div className={ `${styles.form} ${hideFields && styles.hide}` }>
          <div className={ styles['dropdown-required'] }>
            <CategoryDropdown
              label="Categories"
              id="categories"
              name="categories"
              value={ values.categories }
              onChange={ handleOnChange }
              error={ touched.categories && ( !values.categories.length || values.categories.length > 2 ) }
              required
              multiple
              search
              closeOnBlur
              closeOnChange
            />
            <p className={ styles['field__helper-text'] }>Select up to two (2) categories. </p>
            <p className={ styles.required_error }>{ touched.categories ? errors.categories : '' }</p>
          </div>
          <TagDropdown
            label="Tags"
            id="tags"
            name="tags"
            locale="en-us"
            value={ values.tags }
            required
            onChange={ handleOnChange }
          />
          <PolicyPriorityDropdown
            label="Policy Priority"
            id="policy"
            name="policy"
            value={ values.policy }
            onChange={ handleOnChange }
            error={ touched.policy && !!errors.policy }
          />
          <VisibilityDropdown
            label="Visibility Setting"
            id="visibility"
            name="visibility"
            value={ values.visibility }
            onChange={ handleOnChange }
            disabled
          />
          <div className={ styles.description }>
            <TextInput
              label="Internal Description"
              id="desc"
              name="desc"
              type="textarea"
              rows="3"
              required
              helperTxt="Briefly describe this Playbook. This text will only appear in search results."
              maxLength={ 100 }
            />
          </div>
        </div>
        <div>
          <HandleOnChangeContext.Provider value={ handleOnChange }>
            { children }
          </HandleOnChangeContext.Provider>
        </div>
      </form>
    </div>
  );
};

PackageForm.propTypes = {
  setValues: PropTypes.func,
  setFieldValue: PropTypes.func,
  setTouched: PropTypes.func,
  setFieldTouched: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
  children: PropTypes.node,
  packageTypes: PropTypes.array,
  reset: PropTypes.func,
};

export default PackageForm;
