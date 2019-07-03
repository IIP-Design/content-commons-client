import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { openWindow, isMobile } from 'lib/browser';

const ShareButton = props => {
  const {
    url, icon, isPreview, label
  } = props;

  /**
   * Opens a new window. If mobile, go a new window, else open popup window
   * Calling this function as opposed to directly calling openWindow allows
   * us to fetch window config if present on the element. It also does not force
   * deaking with the event object in the openWindow method
   * @param {*} e event object
   * @param {*} data element data attributes
   */
  const willOpenWindow = ( e, data = {} ) => {
    if ( isPreview ) {
      e.preventDefault();
      return;
    }

    if ( !isMobile() ) {
      e.preventDefault();
      openWindow( url, data );
    }
  };

  return (
    <List.Item
      as="a"
      href={ url }
      rel="noopener noreferrer"
      target="_blank"
      onClick={ willOpenWindow }
      onKeyPress={ willOpenWindow }
      style={ { cursor: isPreview ? 'default' : 'pointer' } }
    >
      <List.Icon name={ icon } />
      <List.Content>{ label }</List.Content>
    </List.Item>
  );
};

ShareButton.propTypes = {
  url: PropTypes.string,
  icon: PropTypes.string,
  isPreview: PropTypes.bool,
  label: PropTypes.string
};

export default ShareButton;
