import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import TextInput from 'components/admin/PackageCreate/PackageForm/TextInput/TextInput';
import PackageTypeDropdown from 'components/admin/dropdowns/PackageTypeDropdown/PackageTypeDropdown';

import intersection from 'lodash/intersection';
import { titleCase } from 'lib/utils';

const packageTypes = [
  'PACKAGE',
  'TOOLKIT',
  'PLAYBOOK',
];

/**
 * Displays a readonly input for a team with a single content type
 * or a dropdown for a team with multiple content types
 * @params {}
 *  contentTypes: teams' associated content types
 *  value: field current value
 *  onChange: formik change handler
 *  required: is field required
 * @returns PackageTypeDropdown | TextInput
 */
const PackageType = ( { contentTypes, value, onChange, required } ) => {
  const router = useRouter();
  const isCreate = router.route.includes( '/package/create' );

  const renderTextInput = () => (
    <TextInput
      label="Package Type"
      id="type"
      name="type"
      type="text"
      value={ value === 'DAILY_GUIDANCE' ? 'Guidance' : titleCase( value ) }
      required={ required }
      readOnly="readOnly"
    />
  );

  // if on edit screen, always return readonly text field
  if ( !isCreate ) {
    return renderTextInput();
  }

  // if on create screen, return either input or dropdown based
  // on num content types in packageTypes type array above
  return (
    ( intersection( packageTypes, contentTypes ).length > 1 )
      ? (
        <PackageTypeDropdown
          id="type"
          name="type"
          label="Package Type"
          value={ value }
          onChange={ onChange }
          contentTypes={ contentTypes }
        />
      )
      : renderTextInput()
  );
};


PackageType.propTypes = {
  contentTypes: PropTypes.array,
  value: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

export default PackageType;
