import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { Pagination } from 'semantic-ui-react';
import * as actions from 'lib/redux/actions/search';
import { useAuth } from 'context/authContext';
import './ResultsPagination.scss';

const ResultsPagination = ( { targetRequest, search } ) => {
  const { totalPages, currentPage } = search;
  const { user } = useAuth();

  if ( totalPages < 2 ) return null;

  const handlePaginationChange = ( e, { activePage } ) => targetRequest( activePage, user );
  const nextDisabled = currentPage === totalPages;
  const prevDisabled = currentPage === 1;

  return (
    <section className="resultsPagination">
      <Pagination
        nextItem={ { content: 'Next ⟩', disabled: nextDisabled } }
        prevItem={ { content: '⟨ Previous', disabled: prevDisabled } }
        activePage={ currentPage < 0 ? 1 : currentPage }
        onPageChange={ handlePaginationChange }
        totalPages={ totalPages }
        siblingRange="2"
        firstItem={ null }
        lastItem={ null }
      />
    </section>
  );
};

const mapStateToProps = state => ( {
  search: state.search
} );

ResultsPagination.propTypes = {
  search: object,
  targetRequest: func
};

export default connect( mapStateToProps, actions )( ResultsPagination );
