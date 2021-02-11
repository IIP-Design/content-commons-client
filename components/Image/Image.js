import React from 'react';
import { object } from 'prop-types';
import './Image.scss';

const Image = props => {
  const { item } = props;

  return (
    <section>{ item.title || 'Image Item' }</section>
  );
};

Image.propTypes = {
  item: object,
};

export default Image;
