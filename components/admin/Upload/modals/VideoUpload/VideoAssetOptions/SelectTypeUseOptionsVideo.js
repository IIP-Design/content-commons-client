import React, { Fragment } from 'react';
import { Select } from 'semantic-ui-react';
import { typeUseOptionsVideo } from './fileSelectOptions';

const SelectTypeUseOptionsVideo = () => (
  <Fragment>
    <p className="videoProjectFiles_asset_options_mobileLabel">Video Type</p>
    <Select
      options={ typeUseOptionsVideo }
      className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
      placeholder="-"
    />
  </Fragment>
);

export default SelectTypeUseOptionsVideo;
