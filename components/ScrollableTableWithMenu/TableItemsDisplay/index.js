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
  { key: 2, value: 2, text: '2' }, // temp value, for development
  { key: 4, value: 4, text: '4' }, // temp value, for development
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' },
];

const TableItemsDisplay = props => {
  const { value: count, handleChange, searchTerm } = props;
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
        <span> | 1 - { count } of 137{ searchTerm && <span> for &ldquo;{ searchTerm }&rdquo;</span> }</span>
      </span>
    </Grid.Column>
  );
};

TableItemsDisplay.propTypes = {
  value: PropTypes.number,
  handleChange: PropTypes.func,
  searchTerm: PropTypes.string
};

export default TableItemsDisplay;
