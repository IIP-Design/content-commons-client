import React, { Component } from 'react';
import Results from 'components/Results/Results/';
import { fetchUser } from 'context/authContext';

import {
  updateLanguage, updateSort, updateSearchTerm, createRequest
} from 'lib/redux/actions/search';
import {
  postTypeUpdate, dateUpdate, categoryUpdate, countryUpdate, sourceUpdate
} from 'lib/redux/actions/filter';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { loadSources } from 'lib/redux/actions/source';
import { loadCategories } from 'lib/redux/actions/category';
import { loadCountries } from 'lib/redux/actions/country';
import { loadLanguages } from 'lib/redux/actions/language';
import { COUNTRIES_REGIONS_QUERY } from 'lib/graphql/queries/document';

class ResultsPage extends Component {
  // Get search params from url
  static async getInitialProps( ctx ) {
    const {
      query: {
        language, term, sortBy, postTypes, date, categories, sources, countries
      }, store
    } = ctx;

    const user = await fetchUser( ctx );

    // trigger parallel loading calls
    const languageUpdate = store.dispatch( updateLanguage( language || 'en-us' ) );
    const sortByUpdate = store.dispatch( updateSort( sortBy || 'published' ) );
    const typeUpdate = store.dispatch( postTypeUpdate( postTypes ) );
    const termUpdate = store.dispatch( updateSearchTerm( term ) );
    const dateChange = store.dispatch( dateUpdate( date ) );
    const categoryChange = store.dispatch( categoryUpdate( categories ) );
    const countryChange = store.dispatch( countryUpdate( countries ) );
    const sourceChange = store.dispatch( sourceUpdate( sources ) );

    await languageUpdate;
    await sortByUpdate;
    await typeUpdate;
    await termUpdate;
    await dateChange;
    await categoryChange;
    await countryChange;
    await sourceChange;

    // after all search values are updated, execute search request
    store.dispatch( createRequest( user ) );

    // load filter menus if needed
    const { global } = store.getState();

    // Always load srcs and cats based on query
    const srcs = store.dispatch( loadSources() );
    const cats = store.dispatch( loadCategories() );

    const gqlCountries = ctx.apolloClient.query( {
      query: COUNTRIES_REGIONS_QUERY
    } );
    const countrieses = store.dispatch( loadCountries( gqlCountries ) );

    let types;
    let langs;

    if ( !global.postTypes.list.length ) {
      types = store.dispatch( loadPostTypes( user ) );
    }

    if ( !global.languages.list.length ) {
      langs = store.dispatch( loadLanguages() );
    }

    if ( types ) await types;
    if ( srcs ) await srcs;
    if ( cats ) await cats;
    if ( langs ) await langs;
    if ( countrieses ) await countrieses;

    return {};
  }

  render() {
    return <Results />;
  }
}

export default ResultsPage;
