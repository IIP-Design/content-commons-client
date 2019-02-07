import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Input, Icon } from 'semantic-ui-react';
import { detectLanguage } from 'lib/language';
import './SearchInput.scss';

// import * as actions from '../../actions';

const Search = props => {
  // componentDidMount() {
  // Clear session if on home page
  // if ( this.props.location.pathname === '/' ) {
  //   this.props.clearFilters();
  //   this.props.languageUpdate( { display_name: 'English', key: 'en-us' } );
  //   this.props.createRequest();
  // }
  // }

  const [term, setTerm] = useState( '' );
  const [language, setLanguage] = useState( {
    locale: 'en-us',
    direction: 'left'
  } );

  /**
   * Send term to Google API to determine language
   * Update state if valid language detected
   */
  const getLanguage = async () => {
    const detected = await detectLanguage( term );
    if ( detected ) {
      setLanguage( {
        ...language,
        locale: detected.language.key,
        direction: detected.direction,
      } );
    }
  };

  /**
   * Only execute if term changes
   */
  useEffect( () => {
    getLanguage();
  }, [term] );

  const handleQueryOnChange = async e => {
    const text = e.target.value;
    setTerm( text.trim() );
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const sortBy = term ? 'relevance' : 'published';
    props.router.push( `/results?language=${language.locale}&term=${term}&sortBy=${sortBy}` );
    // props.router.push( {
    //   pathname: '/results',
    //   query: {
    //     language: language.locale,
    //     term: encodeURIComponent( term )
    //   },
    // }, `/results/${language.locale}/${sortBy}/${term}` );

    // await this.props.createRequest();
  };


  let inputProps = {};
  if ( language.direction === 'left' ) {
    inputProps = { className: 'search_input' };
  } else {
    inputProps = { className: 'search_input right', iconPosition: 'left' };
  }

  return (
    <section className="search_bar">
      <Form onSubmit={ handleSubmit }>
        <Input
          onChange={ handleQueryOnChange }
          // value={ term }
          size="large"
          icon={ <Icon name="search" onClick={ handleSubmit } /> }
          placeholder="Type in keywords to search our content"
          { ...inputProps }
        />
      </Form>
    </section>
  );
};


const mapStateToProps = state => ( {
  search: state.search
} );

Search.propTypes = {
  updateSearchQuery: PropTypes.func,
  updateSort: PropTypes.func,
  createRequest: PropTypes.func,
  clearFilters: PropTypes.func,
  languageUpdate: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  router: PropTypes.object,
  search: PropTypes.shape( {
    query: PropTypes.string
  } )
};


// export default withRouter( connect( mapStateToProps, actions )( Search ) );

export default withRouter( connect( mapStateToProps )( Search ) );
