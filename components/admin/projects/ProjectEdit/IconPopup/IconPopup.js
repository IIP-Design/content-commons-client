/**
 *
 * IconPopup
 *
 */

import React from 'react';
import { string } from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

import Focusable from 'components/admin/projects/shared/Focusable/Focusable';

const IconPopup = props => {
  const { message, size, iconType } = props;
  return (
    <Popup
      trigger={ (
        <span>
          <Focusable>
            <Icon size={ size } name={ iconType } />
          </Focusable>
        </span>
      ) }
      content={ message }
      size={ size }
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
  size: string,
  iconType: string.isRequired
};

export default IconPopup;
