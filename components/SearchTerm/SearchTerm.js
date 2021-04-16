import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import { numberWithCommas } from 'lib/utils';
import './SearchTerm.scss';

const SearchTerm = ( { search } ) => {
  const { currentTerm, total } = search;

  return (
    <section className="searchTerm">
      <Header as="h1" className="searchTermQuery">
        { currentTerm && `${currentTerm}` }
        <Header.Subheader className="searchTermTotal">
          { numberWithCommas( total ) }
          { ' ' }
          { total === 1 ? 'item' : 'items' }
        </Header.Subheader>
      </Header>
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
