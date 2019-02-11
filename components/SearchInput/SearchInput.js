import React, { useState, useEffect } from 'react';
import { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { Form, Input, Icon } from 'semantic-ui-react';
import { detectLanguage } from 'lib/language';
import './SearchInput.scss';

const Search = props => {
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

  /**
   * Since function call the language detect api on text change
   * use debounce to enable better perfomance
   */
  const handleQueryOnChange = debounce( async ( e, data ) => {
    setTerm( data.value.trim() );
  }, 300 );


  const handleSubmit = async e => {
    e.preventDefault();

    let newPath = `/results?language=${language.locale}`;
    if ( term ) {
      newPath += `&term=${encodeURIComponent( term )}&sortBy=relevance`;
    } else {
      newPath += '&sortBy=published';
    }
    // debugging
    // console.log( `old : ${props.router.asPath}` );
    // console.log( `new : ${newPath}` );

    // only submit if search is different from previos
    if ( newPath !== props.router.asPath ) {
      props.router.push( newPath );
    }
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


Search.propTypes = {
  router: PropTypes.object,
};

export default withRouter( Search );
