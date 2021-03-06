import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import TextInput from 'components/admin/PackageCreate/PackageForm/TextInput/TextInput';
import PackageTypeDropdown from 'components/admin/dropdowns/PackageTypeDropdown/PackageTypeDropdown';

import { titleCase } from 'lib/utils';

/**
 * Displays a readonly input for a team with a single content type
 * or a dropdown for a team with multiple content types
 * @param {Object} props
 * @param {string[]} props.packageTypes The package types that are associated with the current team. Array should only include 'PACKAGE', 'PLAYBOOK', and/or 'TOOLKIT'.
 * @param {string} props.value The field's current value.
 * @param {func} props.onChange The formik change handler callback function.
 * @param {bool} props.required Whether or not the given field is required.
 * @returns {PackageTypeDropdown|TextInput}
 */
const PackageType = ( { packageTypes, value, onChange, required } ) => {
  const router = useRouter();
  const isCreate = router.route.includes( '/package/create' );

  const renderTextInput = val => (
    <TextInput
      label="Package Type"
      id="type"
      name="type"
      type="text"
      value={ val === 'DAILY_GUIDANCE' || val === 'PACKAGE' ? 'Guidance' : titleCase( val ) }
      required={ required }
      readOnly="readOnly"
    />
  );

  // if on edit screen, always return readonly text field
  if ( !isCreate ) {
    return renderTextInput( value || '' );
  }

  // if on create screen, return either input or dropdown based
  // on num content types in packageTypes type array above
  return (
    ( packageTypes.length > 1 )
      ? (
        <PackageTypeDropdown
          id="type"
          name="type"
          label="Package Type"
          value={ value }
          onChange={ onChange }
          contentTypes={ packageTypes }
        />
      )
      : renderTextInput( packageTypes[0] || '' )
  );
};

PackageTypeDropdown.defaultProps = {
  contentTypes: [],
};

PackageType.propTypes = {
  packageTypes: PropTypes.array,
  value: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

export default PackageType;
