import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import './Popup.scss';

const Popup = ( { title, children } ) => (
  <div>
    <Header as="h2">{ title }</Header>
    { children }
  </div>
);

Popup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};

export default Popup;
