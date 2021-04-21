import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { numberWithCommas } from 'lib/utils';
import './SearchTerm.scss';

const SearchTerm = ( { search } ) => {
  const { currentTerm, total } = search;

  return (
    <section className="searchTerm">
      <h1 className="ui header searchTermQuery">
        { currentTerm && `${currentTerm}` }
        <div className="sub header searchTermTotal">
          { numberWithCommas( total ) }
          { ' ' }
          { total === 1 ? 'item' : 'items' }
        </div>
      </h1>
    </section>
  );
};

const mapStateToProps = state => ( {
  search: state.search,
} );

SearchTerm.propTypes = {
  search: object,
};

export default connect( mapStateToProps )( SearchTerm );
