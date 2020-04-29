import React from 'react';
import PropTypes from 'prop-types';

const DownloadItem = ( { instructions, children } ) => (
  <div className="download-item__wrapper">
    <div className="download-item__instructions">{ instructions }</div>
    { children }
  </div>
);

DownloadItem.propTypes = {
  children: PropTypes.oneOfType( [
    PropTypes.array,
    PropTypes.object
  ] ),
  instructions: PropTypes.oneOfType( [
    PropTypes.string,
    PropTypes.object
  ] )
};

export default DownloadItem;
