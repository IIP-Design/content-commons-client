import React from 'react';
import PropTypes from 'prop-types';
import ClipboardCopy from '../ClipboardCopy';
import './Embed.scss';

const Embed = props => {
  const embedItem = props.embedItem ? props.embedItem : '';
  return (
    <div>
      <div className="form-group_instructions">{ props.instructions }</div>
      <ClipboardCopy label="Embed Code" copyItem={ embedItem } />
      { props.children }
    </div>
  );
};

Embed.propTypes = {
  instructions: PropTypes.string,
  children: PropTypes.array,
  embedItem: PropTypes.string
};

export default Embed;
