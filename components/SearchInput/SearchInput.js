import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Form, Icon, Dropdown } from 'semantic-ui-react';

import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

import { getDirection } from 'lib/language';
import { fetchQueryString } from 'lib/searchQueryString';
import { useAuth } from 'context/authContext';
import * as actions from 'lib/redux/actions';

import './SearchInput.scss';

const SearchInput = ( { filter,
  languages,
  loadLanguages,
  search, router,
  updateSearchTerm,
  postTypeUpdate } ) => {
  const [locale, setLocale] = useState( search.language );
  const [direction, setDirection] = useState( 'left' );
  const [selectedRadio, setSelectedRadio] = useState( 'multiple' );

  // Get current user
  const { user } = useAuth();

  const isUser = user?.id && user.id !== 'public';
  const pathname = router?.pathname ? router.pathname : '';
  const langList = useMemo( () => languages?.list || [], [languages] );

  const { language } = search?.language ? search.language : {};

  // Check if viewing guidance packages 'Browse All' results page
  const { postTypes } = filter;
  const viewingAllPkgs = postTypes?.includes( 'package' );

  useEffect( () => {
    if ( pathname.indexOf( 'admin' ) === -1 && !langList.length ) {
      loadLanguages();
    }

    if ( pathname === '/' ) {
      isUser
        ? postTypeUpdate( [
          'video', 'post', 'graphic',
        ] )
        : postTypeUpdate( '' );
      setLocale( 'en-us' );
      setDirection( 'left' );
      updateSearchTerm( '' );
      // Reset selected radio btn to default
      setSelectedRadio( 'multiple' );
    } else {
      setLocale( language );
      setDirection( getDirection( language ) );
    }
  }, [
    isUser, langList, language, loadLanguages, pathname, postTypeUpdate, updateSearchTerm,
  ] );

  const handleLangOnChange = ( e, { value } ) => {
    setLocale( value );
    setDirection( getDirection( value ) );
  };

  const handleQueryOnChange = e => {
    updateSearchTerm( e.target.value );
  };

  const handleRadioChange = e => {
    const { value } = e.target;

    setSelectedRadio( value );

    if ( value === 'multiple' ) postTypeUpdate( [
      'video', 'post', 'graphic',
    ] );
    if ( value === 'document' ) postTypeUpdate( 'document' );
  };

  const handleSubmit = async () => {
    let query;

    // If searching on the 'Browse All' guidance packages result page, search on document type
    if ( viewingAllPkgs ) {
      const updatedFilterPostypes = { ...filter, postTypes: ['document'] };

      query = fetchQueryString( { ...updatedFilterPostypes, term: search.term, language: locale } );
    } else {
      query = fetchQueryString( { ...filter, term: search.term, language: locale } );
    }

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

  const getLangOptions = () => langList.map( l => ( {
    key: l.key,
    text: l.display_name,
    value: l.key,
  } ) );

  const langOptions = langList.length === 0 ? [{ key: 'en-us', text: 'English', value: 'en-us' }] : getLangOptions();

  return (
    <section className="search_bar">
      <Form onSubmit={ handleSubmit }>
        { isUser && pathname === '/' && (
          <div className="inline fields">
            <label htmlFor="multiple" className="radio">
              <span className="radio-input">
                <input
                  id="multiple"
                  type="radio"
                  name="radioGroup"
                  value="multiple"
                  checked={ selectedRadio === 'multiple' }
                  onChange={ handleRadioChange }
                />
                <span className="radio-control" />
              </span>
              <span className="radio-label">Articles, Graphics, Videos</span>
            </label>
            <label htmlFor="document" className="radio">
              <span className="radio-input">
                <input
                  id="document"
                  type="radio"
                  name="radioGroup"
                  value="document"
                  checked={ selectedRadio === 'document' }
                  onChange={ handleRadioChange }
                />
                <span className="radio-control" />
              </span>
              <span className="radio-label">Press Materials</span>
            </label>
          </div>
        ) }

        <div className={ `ui large icon left labeled input search_input${direction === 'right' ? ' right' : ''}` }>
          <Dropdown
            aria-label="select language"
            className="label"
            value={ locale }
            options={ langOptions }
            onChange={ handleLangOnChange }
          />
          <label htmlFor="search-input">
            <VisuallyHidden>search</VisuallyHidden>
            <input
              id="search-input"
              type="text"
              onChange={ handleQueryOnChange }
              value={ search?.term || '' }
              placeholder="Type in keywords to search"
            />
          </label>
          <button
            type="submit"
            onClick={ handleSearchClick }
            onKeyUp={ handleSearchKeyUp }
          >
            <VisuallyHidden>submit search</VisuallyHidden>
            <Icon inverted name="search" />
          </button>
        </div>
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
  search: PropTypes.object,
  languages: PropTypes.object,
  loadLanguages: PropTypes.func,
  postTypeUpdate: PropTypes.func,
  updateSearchTerm: PropTypes.func,
};

export default withRouter( connect( mapStateToProps, actions )( SearchInput ) );
