import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import Link from 'next/link';
import './TermsConditions.scss';

const TermsConditions = props => {
  const { error, handleOnChange } = props;
  return (
    <Form.Checkbox
      id="termsConditions"
      className="terms-conditions"
      name="termsConditions"
      label={ (
        <label htmlFor="termsConditions">
          By uploading these files I agree to the Content Commons <Link href="/privacy"><a>Terms of Use</a></Link> and licensing agreements. I understand that my content will be available to the public for general use.
        </label>
      ) }
      type="checkbox"
      required
      onChange={ handleOnChange }
      error={ error }
    />
  );
};

TermsConditions.propTypes = {
  error: PropTypes.bool,
  handleOnChange: PropTypes.func
};

export default TermsConditions;
