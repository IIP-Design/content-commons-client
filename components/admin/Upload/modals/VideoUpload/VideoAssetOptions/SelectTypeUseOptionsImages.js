import React, { Fragment } from 'react';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsImages } from './fileSelectOptions';

const SelectTypeUseOptionsImages = () => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Image Use</p>
    <Select
      options={ typeUseOptionsImages }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
      placeholder="-"
    />
  </Fragment>
);

export default SelectTypeUseOptionsImages;
