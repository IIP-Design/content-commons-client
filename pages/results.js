import React, { Component } from 'react';
import Results from 'components/Results/Results/';

import {
  updateSort, updateSearchTerm, createRequest
} from 'lib/redux/actions/search';
import {
  updateLanguage, postTypeUpdate, dateUpdate, categoryUpdate, sourceUpdate
} from 'lib/redux/actions/filter';
import { loadPostTypes } from '../lib/redux/actions/postType';
import { loadSources } from '../lib/redux/actions/source';
import { loadCategories } from '../lib/redux/actions/category';
import { loadLanguages } from '../lib/redux/actions/language';

class ResultsPage extends Component {
  // Get search params from url
  static async getInitialProps ( {
    query: {
      language, term, sortBy, postTypes, date, categories, sources
    }, store
  } ) {
    // trigger parallel loading calls
    const languageUpdate = store.dispatch( updateLanguage( language || 'en-us' ) );
    const sortByUpdate = store.dispatch( updateSort( sortBy || 'published' ) );
    const typeUpdate = store.dispatch( postTypeUpdate( postTypes ) );
    const termUpdate = store.dispatch( updateSearchTerm( term ) );
    const dateChange = store.dispatch( dateUpdate( date ) );
    const categoryChange = store.dispatch( categoryUpdate( categories ) );
    const sourceChange = store.dispatch( sourceUpdate( sources ) );

    await languageUpdate;
    await sortByUpdate;
    await termUpdate;
    await typeUpdate;
    await dateChange;
    await categoryChange;
    await sourceChange;

    // after all search values are updated, execute search request
    store.dispatch( createRequest() );

    // load filter menus if needed
    const { global } = store.getState();
    let types;
    let srcs;
    let cats;
    let langs;

    if ( !global.postTypes.list.length ) {
      types = store.dispatch( loadPostTypes() );
    }

    if ( !global.sources.list.length ) {
      srcs = store.dispatch( loadSources() );
    }

    if ( !global.categories.list.length ) {
      cats = store.dispatch( loadCategories() );
    }

    if ( !global.languages.list.length ) {
      langs = store.dispatch( loadLanguages() );
    }

    if ( types ) await types;
    if ( srcs ) await srcs;
    if ( cats ) await cats;
    if ( langs ) await langs;

    return {};
  }

  render() {
    return (
      <Results />
    );
  }
}

export default ResultsPage;
