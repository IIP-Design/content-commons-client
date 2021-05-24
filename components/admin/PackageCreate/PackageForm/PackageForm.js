import React, { useState, createContext } from 'react';
import PropTypes from 'prop-types';

import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown/CategoryDropdown';
import PolicyPriorityDropdown from 'components/admin/dropdowns/PolicyPriorityDropdown/PolicyPriorityDropdown';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';

import TextInput from './TextInput/TextInput';
import PackageType from './PackageType/PackageType';

import { useAuth } from 'context/authContext';
import styles from './PackageForm.module.scss';

export const HandleOnChangeContext = createContext();

const PackageForm = ( {
  setFieldValue,
  setFieldTouched,
  touched,
  values,
  errors,
  children,
} ) => {
  const { user } = useAuth();

  const isGuidance = type => type === 'DAILY_GUIDANCE';
  const [guidance, setGuidance] = useState( isGuidance( values.type ) );

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
      setGuidance( isGuidance( value ) );
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
            id="type"
            name="type"
            label="Package Type"
            value={ values.type }
            onChange={ handleOnChange }
            required
            contentTypes={ user?.team?.contentTypes }
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
        <div className={ `${styles.form} ${guidance ? styles.hide : ''}` }>
          <div className={ styles['dropdown-required'] }>
            <CategoryDropdown
              id="categories"
              name="categories"
              label="Categories"
              value={ values.categories }
              onChange={ handleOnChange }
              error={ touched.categories && ( !values.categories.length || values.categories.length > 2 ) }
              required
              multiple
              search
              closeOnBlur
              closeOnChange
            />
            <p className={ styles.required_error }>{ touched.categories ? errors.categories : '' }</p>
          </div>
          <TagDropdown
            id="tags"
            label="Tags"
            name="tags"
            locale="en-us"
            value={ values.tags }
            onChange={ handleOnChange }
          />
          <PolicyPriorityDropdown
            id="policy"
            name="policy"
            label="Policy Priority"
            required
            value={ values.policy }
            onChange={ handleOnChange }
            error={ touched.policy && !!errors.policy }
          />
          <VisibilityDropdown
            id="visibility"
            name="visibility"
            label="Visibility Setting"
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
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
  errors: PropTypes.object,
  children: PropTypes.node,
};

export default PackageForm;
