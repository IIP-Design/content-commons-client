import React, { Component } from 'react';
import { object, func, string } from 'prop-types';
import { connect } from 'react-redux';
import { Form, Select, Dropdown } from 'semantic-ui-react';
import { numberWithCommas } from 'lib/utils';
import { sortRequest, updateSizeRequest } from 'lib/redux/actions/search';
import ResultsToggleView from '../ResultsToggleView/ResultsToggleView';
import './ResultsHeader.scss';

/** **
TEMP
**** */
const options = [{ key: 1, text: 'Relevance', value: 'relevance' }, { key: 2, text: 'Recent', value: 'published' }];
/** * */

class ResultsHeader extends Component {
  constructor( props ) {
    super( props );
    this.handleOnChange = this.handleOnChange.bind( this );
    this.toggleNumberOfResults = this.toggleNumberOfResults.bind( this );

    this.state = {
      pageSize: props.search.pageSize
    };
  }

  getPageSizes = () => {
    const pageSizes = [];
    const { total } = this.props.search;

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

  handleOnChange( event, { value } ) {
    this.props.sortRequest( value );
  }

  toggleNumberOfResults( e, { value } ) {
    this.props.updateSizeRequest( value );
  }

  // should probably se scroll query here??
  render() {
    const {
      total, startIndex, endIndex, sort
    } = this.props.search;
    const { toggleView, currentView } = this.props;
    const resultItemsStart = startIndex + 1;
    const resultItemsEnd = endIndex + 1;

    if ( this.props.search.response.took && this.props.search.response.hits.hits.length ) {
      return (
        <div>
          <ResultsToggleView toggle={ toggleView } currentView={ currentView } />
          <div className="results_header">
            <Form className="results_sort">
              <Form.Group>
                <Form.Field control={ Select } value={ sort } options={ options } onChange={ this.handleOnChange } />
              </Form.Group>
            </Form>
            <div className="results_total">
              { resultItemsStart }-{ resultItemsEnd } of { numberWithCommas( total ) }
              <span style={ total > 12 ? { display: 'inline' } : { display: 'none' } }> | Show: </span>
              <Dropdown
                style={ total > 12 ? { display: 'inline' } : { display: 'none' } }
                defaultValue={ this.state.pageSize }
                options={ this.getPageSizes() }
                className="results_total_numOfResults"
                onChange={ this.toggleNumberOfResults }
              />
            </div>
          </div>
        </div>
      );
    }

    return <div />;
  }
}

const mapStateToProps = state => ( {
  search: state.search
} );

ResultsHeader.propTypes = {
  search: object,
  sortRequest: func,
  updateSizeRequest: func,
  toggleView: func,
  currentView: string
};

export default connect( mapStateToProps, { sortRequest, updateSizeRequest } )( ResultsHeader );
