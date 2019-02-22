import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';
import * as actions from 'lib/redux/actions/filter';
import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import SearchTerm from 'components/SearchTerm/SearchTerm';
import FilterMenu from 'components/FilterMenu/FilterMenu';
import ResultItem from './ResultItem/ResultItem';
import ResultsHeader from './ResultsHeader/ResultsHeader';

import NoResults from './NoResults';
import ResultsPagination from './ResultsPagination/ResultsPagination';
import './Results.scss';

/**
 * NOTE: Getting error: chunk styles [mini-css-extract-plugin] Conflicting order between:
 * Seems to occurs when the same styles are re imported, i.e modal styles imported in recents
 * and results - resolved by reordering import statements
*/

const Results = props => {
  const [view, setView] = useState( 'gallery' );

  const toggleView = e => {
    setView( e.target.dataset.view );
  };

  const items = getDataFromHits( props.search.response );

  return (
    <section className="results">
      { props.search.currentPage !== -1 && (
      <div>
        <SearchTerm />
        { !items.length && ( <NoResults searchTerm={ props.search.currentTerm } /> ) }
        <hr />
        <FilterMenu />
        <section>
          <ResultsHeader toggleView={ toggleView } currentView={ view } />
        </section>
        <Grid className="results_wrapper">
          { items.map( item => (
            <Grid.Column
              mobile={ 16 }
              tablet={ view === 'gallery' ? 8 : 16 }
              computer={ view === 'gallery' ? 4 : 16 }
              className={
                    view === 'gallery' ? 'card_wrapper card_wrapper--gallery' : 'card_wrapper card_wrapper--list'
                  }
              key={ item._id }
            >
              <ResultItem key={ item._id } item={ normalizeItem( item ) } />
            </Grid.Column>
          ) ) }
        </Grid>
        <ResultsPagination />
      </div>
      ) }
    </section>
  );
};

const mapStateToProps = state => ( {
  search: state.search
} );

Results.propTypes = {
  search: PropTypes.shape( {
    response: PropTypes.shape( {
      hits: PropTypes.shape( {
        hits: PropTypes.array
      } )
    } ),
    currentPage: PropTypes.number,
    currentTerm: PropTypes.string
  } )
};

export default connect( mapStateToProps, actions )( Results );
