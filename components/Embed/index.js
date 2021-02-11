import React from 'react';
import PropTypes from 'prop-types';
import ClipboardCopy from '../ClipboardCopy';
import './Embed.scss';

const Embed = props => {
  const { children, instructions, isPreview } = props;
  const embedItem = props.embedItem ? props.embedItem : '';

  return (
    <div>
      <div className="form-group_instructions">{ instructions }</div>
      <ClipboardCopy
        label="Embed Code"
        copyItem={ embedItem }
        isPreview={ isPreview }
      />
      { children }
    </div>
  );
};

Embed.propTypes = {
  instructions: PropTypes.string,
  children: PropTypes.array,
  embedItem: PropTypes.string,
  isPreview: PropTypes.bool,
};

export default Embed;
