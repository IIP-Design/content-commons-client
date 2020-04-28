/**
 *
 * TableItemsDisplay
 *
 */
import React from 'react';
import ApolloError from 'components/errors/ApolloError';
import PropTypes from 'prop-types';
import { Dropdown, Grid, Loader } from 'semantic-ui-react';

import './TableItemsDisplay.scss';

const displaySizeOptions = [
  { key: 15, value: 15, text: '15' },
  { key: 25, value: 25, text: '25' },
  { key: 50, value: 50, text: '50' },
  { key: 75, value: 75, text: '75' },
  { key: 100, value: 100, text: '100' }
];

const TableItemsDisplay = ( {
  count,
  error,
  loading,
  handleChange,
  itemsPerPage,
  searchTerm,
  skip
} ) => {
  if ( loading ) {
    return (
      <Grid.Column className="items_display">
        <Loader active inline size="mini" />
        <span>Loading...</span>
      </Grid.Column>
    );
  }

  if ( error ) {
    return (
      <Grid.Column className="items_display">
        <ApolloError error={ error } />
      </Grid.Column>
    );
  }

  if ( !count ) return null;

  const firstPageItem = skip + 1;
  const range = skip + count;
  const lastPageItem = range < count ? range : count;

  return (
    <Grid.Column className="items_display">
      <span>
        { 'Show: ' }
        <Dropdown
          id="items-per-page"
          inline
          options={ displaySizeOptions }
          value={ itemsPerPage }
          onChange={ ( e, { value } ) => handleChange( e, value ) }
        />
        { ' | ' }
        { count > 0 ? (
          <span>
            {`${firstPageItem} - ${lastPageItem} of ${count}`}
            { searchTerm && ` for &ldquo; ${searchTerm} &rdquo`}
          </span>
        ) : (
          <span>
            {`No ${searchTerm ? 'results' : 'projects'}` }
            { searchTerm && ` for &ldquo; ${searchTerm} &rdquo;` }
          </span>
        ) }
      </span>
    </Grid.Column>
  );
};

TableItemsDisplay.propTypes = {
  count: PropTypes.number,
  error: PropTypes.object,
  handleChange: PropTypes.func,
  itemsPerPage: PropTypes.number,
  loading: PropTypes.bool,
  searchTerm: PropTypes.string,
  skip: PropTypes.number
};

export default TableItemsDisplay;
