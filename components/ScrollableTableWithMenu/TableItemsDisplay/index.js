/**
 *
 * TableItemsDisplay
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Dropdown } from 'semantic-ui-react';
import './TableItemsDisplay.scss';

const displaySizeOptions = [
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' }
];

const TableItemsDisplay = props => {
  const { value: count, handleChange } = props;
  return (
    <Grid.Column className="items_display">
      <span>
        Show:{ ' ' }
        <Dropdown
          inline
          options={ displaySizeOptions }
          value={ count }
          onChange={ ( e, { value } ) => handleChange( e, value ) }
        />
        <span> | 1 - { count } of 137 for 'search term'</span>
      </span>
    </Grid.Column>
  );
};

TableItemsDisplay.propTypes = {
  value: PropTypes.number,
  handleChange: PropTypes.func
};

export default TableItemsDisplay;
