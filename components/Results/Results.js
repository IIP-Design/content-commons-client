import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { Grid } from 'semantic-ui-react';

import { postTypeUpdate } from 'lib/redux/actions/filter';
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

const Results = ( { search, filterPostTypeUpdate } ) => {
  const [view, setView] = useState( 'gallery' );

  const toggleView = e => {
    setView( e.target.dataset.view );
  };

  const items = getDataFromHits( search.response );

  const router = useRouter();
  const {
    query: { postTypes },
  } = router;
  const viewingAllPkgs = postTypes?.includes( 'package' );

  useEffect( () => {
    // Update postType to document if package
    // If coming from guidance pkg Browse All link, any searches should be on docs
    if ( viewingAllPkgs ) {
      filterPostTypeUpdate( 'document' );
    }
  }, [viewingAllPkgs, filterPostTypeUpdate] );

  return (
    <section className="results">
      { search.currentPage !== -1 && (
        <div>
          <SearchTerm />
          { !items.length && <NoResults searchTerm={ search.currentTerm } /> }
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
                className={ view === 'gallery' ? 'card_wrapper card_wrapper--gallery' : 'card_wrapper card_wrapper--list' }
                key={ item._id }
              >
                <ResultItem key={ item._id } item={ normalizeItem( item, search.language ) } />
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
  search: state.search,
} );

Results.propTypes = {
  search: PropTypes.object,
  filterPostTypeUpdate: PropTypes.func,
};

export default connect( mapStateToProps, { filterPostTypeUpdate: postTypeUpdate } )( Results );
