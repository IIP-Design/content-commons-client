import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Form, Input, Icon } from 'semantic-ui-react';
import { detectLanguage } from 'lib/language';
import { fetchQueryString } from 'lib/searchQuery';
import * as actions from 'lib/redux/actions';
import './SearchInput.scss';

class Search extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      locale: 'en-us',
      direction: 'left'
    };
  }

  /**
   * Send term to Google API to determine language
   * Update state if valid language detected
   */
 getLanguage = async term => {
   const detected = await detectLanguage( term );
   if ( detected ) {
     this.setState( {
       locale: detected.language.key,
       direction: detected.direction,
     } );
   }
 };

  /**
   * NOTE: Since function call the language detect api on text change
   * may need to use debounce to enable better perfomance
   */
  handleQueryOnChange = ( e, { value } ) => {
    this.getLanguage( value );
    this.props.updateSearchTerm( value );
  };


   handleSubmit = async e => {
     e.preventDefault();

     const { filter, search } = this.props;
     const query = fetchQueryString( { ...filter, term: search.term, language: this.state.locale } );

     this.props.router.push( {
       pathname: '/results',
       query
     } );
   };


   render () {
     let inputProps = {};
     if ( this.state.direction === 'left' ) {
       inputProps = { className: 'search_input' };
     } else {
       inputProps = { className: 'search_input right', iconPosition: 'left' };
     }

     return (
       <section className="search_bar">
         <Form onSubmit={ this.handleSubmit }>
           <Input
             onChange={ this.handleQueryOnChange }
             value={ this.props.search.term ? this.props.search.term : '' }
             size="large"
             icon={ <Icon name="search" onClick={ this.handleSubmit } /> }
             placeholder="Type in keywords to search our content"
             { ...inputProps }
           />
         </Form>
       </section>
     );
   }
}

const mapStateToProps = state => ( {
  search: state.search
} );

Search.propTypes = {
  router: PropTypes.object,
  filter: PropTypes.object,
  search: PropTypes.object,
  updateSearchTerm: PropTypes.func
};

export default withRouter( connect( mapStateToProps, actions )( Search ) );
