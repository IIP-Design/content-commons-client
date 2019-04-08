/**
 *
 * TableItemsDisplay
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
import { Grid, Dropdown } from 'semantic-ui-react';
import './TableItemsDisplay.scss';

const displaySizeOptions = [
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' }
];

class TableItemsDisplay extends React.Component {
  state = {
    value: 25
  }

  handleChange = ( e, { value } ) => this.setState( { value } );

  render() {
    const { value } = this.state;
    return (
      <Grid.Column className="items_display">
        <span>
          Show:{ ' ' }
          <Dropdown
            inline
            options={ displaySizeOptions }
            defaultValue={ displaySizeOptions[0].value }
            onChange={ this.handleChange }
          />
          <span> | 1-{ value } of 137 for 'search term'</span>
        </span>
      </Grid.Column>
    );
  }
}

// TableItemsDisplay.propTypes = {};

export default TableItemsDisplay;
