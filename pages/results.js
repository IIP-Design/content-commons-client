import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';

import Results from 'components/Results/Results/';

import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import {
  categoryUpdate, countryUpdate, dateUpdate, postTypeUpdate, sourceUpdate,
} from 'lib/redux/actions/filter';
import {
  createRequest, updateLanguage, updateSearchTerm, updateSort,
} from 'lib/redux/actions/search';
import { fetchUser } from 'context/authContext';
import { loadCategories } from 'lib/redux/actions/category';
import { loadCountries } from 'lib/redux/actions/country';
import { loadLanguages } from 'lib/redux/actions/language';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { loadSources } from 'lib/redux/actions/source';
import storeWrapper from 'lib/redux/store';

const ResultsPage = ( {
  filter, loaders, sendRequest, user,
} ) => {
  const gqlCountries = useQuery( COUNTRIES_REGIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
  } );

  useEffect( () => {
    sendRequest( user );
    loaders.loadCategories();
    loaders.loadCountries( gqlCountries );
    loaders.loadLanguages();
    loaders.loadPostTypes( user );
    loaders.loadSources();
  }, [
    filter, gqlCountries, loaders, sendRequest, user,
  ] );

  return (
    <Results />
  );
};

export const getServerSideProps = storeWrapper.getServerSideProps( async context => {
  // Get search params from URL.
  const { store, query } = context;

  const {
    categories, countries, date, language, postTypes, sortBy, sources, term,
  } = query;

  const user = await fetchUser( context );

  // Trigger parallel loading calls
  store.dispatch( updateLanguage( language || 'en-us' ) );
  store.dispatch( updateSort( sortBy || 'published' ) );
  store.dispatch( postTypeUpdate( postTypes ) );
  store.dispatch( updateSearchTerm( term || null ) );
  store.dispatch( dateUpdate( date ) );
  store.dispatch( categoryUpdate( categories ) );
  store.dispatch( countryUpdate( countries ) );
  store.dispatch( sourceUpdate( sources ) );

  store.dispatch( createRequest( user ) );

  return {
    props: { user },
  };
} );

const mapDispatchToProps = dispatch => ( {
  sendRequest: bindActionCreators( createRequest, dispatch ),
  loaders: {
    loadCategories: bindActionCreators( loadCategories, dispatch ),
    loadCountries: bindActionCreators( loadCountries, dispatch ),
    loadLanguages: bindActionCreators( loadLanguages, dispatch ),
    loadPostTypes: bindActionCreators( loadPostTypes, dispatch ),
    loadSources: bindActionCreators( loadSources, dispatch ),
  },
} );

const mapStateToProps = state => ( {
  filter: state.filter,
} );

ResultsPage.propTypes = {
  filter: propTypes.object,
  loaders: propTypes.object,
  sendRequest: propTypes.func,
  user: propTypes.object,
};

export default connect( mapStateToProps, mapDispatchToProps )( ResultsPage );
