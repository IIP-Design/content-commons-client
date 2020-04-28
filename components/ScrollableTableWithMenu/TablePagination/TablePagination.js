import React from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'semantic-ui-react';

import ApolloError from 'components/errors/ApolloError';

import './TablePagination.scss';

const TablePagination = ( {
  activePage, count, error, handlePageChange, itemsPerPage, loading
} ) => {
  if ( loading && !count ) return 'Loading....';
  if ( error ) return <ApolloError error={ error } />;

  if ( !count ) return null;

  const totalPages = Math.ceil( count / itemsPerPage );

  if ( count > 0 && totalPages > 1 ) {
    return (
      <Pagination
        activePage={ activePage }
        totalPages={ totalPages }
        nextItem={ { content: 'Next ⟩', disabled: activePage === totalPages } }
        prevItem={ { content: '⟨ Previous', disabled: activePage === 1 } }
        siblingRange="2"
        firstItem={ null }
        lastItem={ null }
        onPageChange={ handlePageChange }
      />
    );
  }

  return null;
};

TablePagination.propTypes = {
  activePage: PropTypes.number,
  count: PropTypes.number,
  error: PropTypes.object,
  handlePageChange: PropTypes.func,
  itemsPerPage: PropTypes.number,
  loading: PropTypes.bool
};

export default TablePagination;
