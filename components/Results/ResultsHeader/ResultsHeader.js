import React, { Fragment } from 'react';
import { object, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { numberWithCommas } from 'lib/utils';
import * as actions from 'lib/redux/actions/search';
import { useAuth } from 'context/authContext';
import ResultsToggleView from '../ResultsToggleView/ResultsToggleView';
import styles from './ResultsHeader.module.scss';

const options = [
  { key: 1, text: 'Relevance', value: 'relevance' },
  { key: 2, text: 'Recent', value: 'published' },
];

const ResultsHeader = ( {
  search,
  filter,
  toggleView,
  currentView,
  sortRequest,
  updateSizeRequest,
} ) => {
  const { user } = useAuth();
  const searchResponseHits = search.response.took && search.response.hits.hits.length;

  if ( !searchResponseHits ) return null;

  // Check if Result page is from Guidance Packages 'Browse All' link on homepage
  // packages not included in search results
  // Sort dropdown menu not relevant to packages
  // Check for package postTypes param if coming from packages Browse All link
  const { postTypes } = filter;
  const viewingAllPkgs = postTypes?.includes( 'package' );

  const {
    total, startIndex, endIndex, sort, pageSize,
  } = search;

  const resultItemsStart = startIndex + 1;
  const resultItemsEnd = endIndex + 1;

  const getPageSizes = () => {
    const pageSizes = [];

    pageSizes.push( { text: '12', value: 12 } );

    if ( total > 12 ) {
      pageSizes.push( { text: '24', value: 24 } );
    }
    if ( total > 24 ) {
      pageSizes.push( { text: '48', value: 48 } );
    }
    if ( total > 48 ) {
      pageSizes.push( { text: '96', value: 96 } );
    }

    return pageSizes;
  };

  const handleOnChange = ( e, { value } ) => {
    sortRequest( value, user );
  };

  const toggleNumberOfResults = ( e, { value } ) => {
    updateSizeRequest( value, user );
  };

  return (
    <div>
      <div className={ styles.controls }>
        <div className={ styles.sortResults }>
          <div className={ `${styles.fields} ${viewingAllPkgs ? styles['no-border'] : ''}` }>
            { !viewingAllPkgs && (
              <Fragment>
                <span aria-hidden="true">Sort by</span>
                <Dropdown
                  aria-label="sort results by recent or relevance"
                  className={ styles.sortDropdown }
                  inline
                  options={ options }
                  onChange={ handleOnChange }
                  openOnFocus={ false }
                  value={ sort }
                />
              </Fragment>
            ) }
          </div>
        </div>
        { /* <ResultsToggleView toggle={ toggleView } currentView={ currentView } /> */ }
      </div>

      <div className={ styles.perPage }>
        <span role="status" aria-live="polite">
          { `${resultItemsStart} to ${resultItemsEnd} of ${numberWithCommas( total )}` }
        </span>
        <span aria-hidden="true" style={ total > 12 ? { display: 'inline' } : { display: 'none' } }>| Show:</span>
        <Dropdown
          aria-label="set results per page"
          className={ styles.perPageDropdown }
          defaultValue={ pageSize }
          onChange={ toggleNumberOfResults }
          openOnFocus={ false }
          options={ getPageSizes() }
          style={ total > 12 ? { display: 'inline' } : { display: 'none' } }
        />
      </div>
    </div>
  );
};

const mapStateToProps = state => ( {
  search: state.search,
  filter: state.filter,
} );

ResultsHeader.propTypes = {
  search: object,
  filter: object,
  sortRequest: func,
  updateSizeRequest: func,
  toggleView: func,
  currentView: string,
};

export default connect( mapStateToProps, actions )( ResultsHeader );
