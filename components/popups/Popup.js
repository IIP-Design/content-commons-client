import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import './Popup.scss';

const Popup = props => (
  <div>
    <Header as="h2">{ props.title }</Header>
    { props.children }
  </div>
);

Popup.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Popup;
