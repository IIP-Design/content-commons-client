import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { useQuery } from '@apollo/client';

import Results from 'components/Results/Results/';

import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';
import { filterUpdate } from 'lib/redux/actions/filter';
import {
  createRequest, updateLanguage, updateSearchTerm, updateSort,
} from 'lib/redux/actions/search';
import { useAuth } from 'context/authContext';
import { loadCategories } from 'lib/redux/actions/category';
import { loadCountries } from 'lib/redux/actions/country';
import { loadLanguages } from 'lib/redux/actions/language';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { loadSources } from 'lib/redux/actions/source';
import storeWrapper from 'lib/redux/store';

const ResultsPage = ( {
  filter, dispatch,
} ) => {
  const { user } = useAuth();

  const gqlCountries = useQuery( COUNTRIES_REGIONS_QUERY, {
    fetchPolicy: 'cache-and-network',
  } );

  useEffect( () => {
    dispatch( loadCategories() );
    dispatch( loadLanguages() );
    dispatch( loadSources() );
    dispatch( loadCountries( gqlCountries ) );
    dispatch( loadPostTypes( user ) );

    dispatch( createRequest( user ) );
  }, [
    filter, gqlCountries, user, dispatch,
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

  const filterUpdates = {
    postTypes,
    date,
    categories,
    countries,
    sources,
  };

  // update filter state
  store.dispatch( updateLanguage( language || 'en-us' ) );
  store.dispatch( updateSort( sortBy || 'published' ) );
  store.dispatch( updateSearchTerm( term || null ) );
  store.dispatch( filterUpdate( filterUpdates ) );

  return {
    props: {},
  };
} );


const mapStateToProps = state => ( {
  filter: state.filter,
} );

ResultsPage.propTypes = {
  filter: propTypes.object,
  dispatch: propTypes.func,
};

export default connect( mapStateToProps )( ResultsPage );
