import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from 'semantic-ui-react';

import { normalizeItem, getDataFromHits } from 'lib/elastic/parser';
import SearchTerm from 'components/SearchTerm/SearchTerm';
import FilterMenu from 'components/FilterMenu/FilterMenu';
import ResultItem from './ResultItem/ResultItem';
import ResultsHeader from './ResultsHeader/ResultsHeader';
import NoResults from './NoResults';
import ResultsPagination from './ResultsPagination/ResultsPagination';
import loadingIcon from 'static/icons/icon_loader.svg';

import styles from './Results.module.scss';

/**
 * NOTE: Getting error: chunk styles [mini-css-extract-plugin] Conflicting order between:
 * Seems to occurs when the same styles are re imported, i.e modal styles imported in recents
 * and results - resolved by reordering import statements
*/

const Results = ( { search } ) => {
  const [view, setView] = useState( 'gallery' );

  const toggleView = e => {
    setView( e.target.dataset.view );
  };

  const items = getDataFromHits( search.response );

  if ( !items ) {
    return (
      <div className={ styles.loader }>
        <img src={ loadingIcon } alt="Loading" />
      </div>
    );
  }

  return (
    <section className={ styles.results }>
      { search.currentPage !== -1 && (
        <div>
          <SearchTerm />
          { !items.length && <NoResults searchTerm={ search.currentTerm } /> }
          <hr />
          <FilterMenu />
          <section>
            <ResultsHeader toggleView={ toggleView } currentView={ view } />
          </section>
          <Grid className={ styles.results_wrapper }>
            { items.map( item => (
              <Grid.Column
                mobile={ 16 }
                tablet={ view === 'gallery' ? 8 : 16 }
                computer={ view === 'gallery' ? 4 : 16 }
                className={ view === 'gallery'
                  ? `${styles.card_wrapper} ${styles['card_wrapper--gallery']}`
                  : `${styles.card_wrapper} ${styles['card_wrapper--list']}` }
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
};

export default connect( mapStateToProps )( Results );
