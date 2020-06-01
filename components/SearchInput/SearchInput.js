import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import {
  Form, Input, Icon, Dropdown, Radio,
} from 'semantic-ui-react';

import { getDirection } from 'lib/language';
import { fetchQueryString } from 'lib/searchQueryString';
import { useAuth } from 'context/authContext';
import * as actions from 'lib/redux/actions';

import './SearchInput.scss';

const SearchInput = ( { filter, languages, loadLanguages, search, router, updateSearchTerm } ) => {
  const [locale, setLocale] = useState( search.language );
  const [direction, setDirection] = useState( 'left' );
  const [selectedRadio, setSelectedRadio] = useState( '' );

  // Get current user
  const { user } = useAuth();

  const isUser = user?.id && user.id !== 'public';
  const pathname = router?.pathname ? router.pathname : '';
  const langList = languages?.list ? languages.list : [];
  const { language } = search?.language ? search.language : {};

  useEffect( () => {
    isUser ? setSelectedRadio( 'multiple' ) : setSelectedRadio( '' );

    if ( pathname.indexOf( 'admin' ) === -1 && !langList.length ) {
      loadLanguages();
    }

    if ( pathname === '/' ) {
      setLocale( 'en-us' );
      setDirection( 'left' );
      updateSearchTerm( '' );
    } else {
      setLocale( language );
      setDirection( getDirection( language ) );
    }
  }, [
    isUser, langList, language, loadLanguages, pathname, updateSearchTerm,
  ] );

  const handleLangOnChange = ( e, { value } ) => {
    setLocale( value );
    setDirection( getDirection( value ) );
  };

  const handleQueryOnChange = ( e, { value } ) => {
    updateSearchTerm( value );
  };

  const handleRadioChange = ( e, { value } ) => {
    setSelectedRadio( value );
  };

  const handleSubmit = async () => {
    let postTypes = '';

    if ( selectedRadio === 'multiple' ) postTypes = ['video', 'post'];
    if ( selectedRadio === 'document' ) postTypes = 'document';

    const query = fetchQueryString( { ...filter, term: search.term, language: locale, postTypes } );

    router.push( {
      pathname: '/results',
      query,
    } );
  };

  const handleSearchClick = e => {
    e.preventDefault();
    handleSubmit();
  };

  const handleSearchKeyUp = e => {
    if ( e.key === 'Enter' ) {
      handleSubmit();
    }
  };

  const inputProps = {
    className: `search_input${direction === 'right' ? ' right' : ''}`,
  };

  const getLangOptions = () => langList.map( l => ( {
    key: l.key,
    text: l.display_name,
    value: l.key,
  } ) );

  const langOptions = langList.length === 0 ? [{ key: 'en-us', text: 'English', value: 'en-us' }] : getLangOptions();

  return (
    <section className="search_bar">
      <Form onSubmit={ handleSubmit }>
        {isUser && pathname === '/' && (
          <Form.Group inline>
            <div className="radio-flex">
              <Radio
                label="Articles and Videos"
                name="radioGroup"
                value="multiple"
                checked={ selectedRadio === 'multiple' }
                onChange={ handleRadioChange }
              />
              <Radio
                label="Press Materials"
                name="radioGroup"
                value="document"
                checked={ selectedRadio === 'document' }
                onChange={ handleRadioChange }
              />
            </div>
          </Form.Group>
        )}
        <Input
          label={ (
            <Dropdown
              value={ locale }
              options={ langOptions }
              onChange={ handleLangOnChange }
            />
          ) }
          labelPosition="left"
          onChange={ handleQueryOnChange }
          value={ search?.term ? search.term : '' }
          size="large"
          icon={ (
            <Icon
              tabIndex="0"
              name="search"
              onClick={ handleSearchClick }
              onKeyUp={ handleSearchKeyUp }
            />
          ) }
          placeholder="Type in keywords to search"
          { ...inputProps }
        />
      </Form>
    </section>
  );
};

const mapStateToProps = state => ( {
  search: state.search,
  languages: state.global.languages,
  filter: state.filter,
} );

SearchInput.propTypes = {
  router: PropTypes.object,
  filter: PropTypes.object,
  isUser: PropTypes.bool,
  search: PropTypes.object,
  languages: PropTypes.object,
  loadLanguages: PropTypes.func,
  updateSearchTerm: PropTypes.func,
};

export default withRouter( connect( mapStateToProps, actions )( SearchInput ) );
