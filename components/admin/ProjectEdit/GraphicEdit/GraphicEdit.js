import React from 'react';
import PropTypes from 'prop-types';

const GraphicEdit = props => {
  return <p>GraphicEdit Page { props.id }</p>;
};

GraphicEdit.propTypes = {
  id: PropTypes.string
};

export default GraphicEdit;
