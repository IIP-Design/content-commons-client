/**
 *
 * IconPopup
 *
 */

import React from 'react';
import { string } from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

import Focusable from 'components/Focusable/Focusable';

const IconPopup = props => {
  const {
    message, iconSize, iconType, popupSize
  } = props;
  return (
    <Popup
      trigger={ (
        <span>
          <Focusable>
            <Icon size={ iconSize } name={ iconType } />
          </Focusable>
        </span>
      ) }
      content={ message }
      size={ popupSize }
      on={ [
        'hover',
        'click',
        'focus'
      ] }
      inverted
    />
  );
};

IconPopup.propTypes = {
  message: string.isRequired,
  iconSize: string,
  iconType: string.isRequired,
  popupSize: string
};

export default IconPopup;
