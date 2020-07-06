import React from 'react';
import { object, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { Form, Select, Dropdown } from 'semantic-ui-react';
import { numberWithCommas } from 'lib/utils';
import * as actions from 'lib/redux/actions/search';
import { useAuth } from 'context/authContext';
import ResultsToggleView from '../ResultsToggleView/ResultsToggleView';
import './ResultsHeader.scss';

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
  // Sort dropdown menu not relevant to pkgs
  // Check for package postTypes param if coming from pkgs Browse All link
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
      <ResultsToggleView toggle={ toggleView } currentView={ currentView } />
      <div className="results_header">
        <Form className="results_sort">
          <Form.Group>
            { !viewingAllPkgs && (
              <Form.Field
                control={ Select }
                value={ sort }
                options={ options }
                onChange={ handleOnChange }
              />
            ) }
          </Form.Group>
        </Form>
        <div className="results_total">
          { resultItemsStart }
          -
          { resultItemsEnd }
          {' '}
          of
          {' '}
          { numberWithCommas( total ) }
          <span style={ total > 12 ? { display: 'inline' } : { display: 'none' } }> | Show: </span>
          <Dropdown
            style={ total > 12 ? { display: 'inline' } : { display: 'none' } }
            defaultValue={ pageSize }
            options={ getPageSizes() }
            className="results_total_numOfResults"
            onChange={ toggleNumberOfResults }
          />
        </div>
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
