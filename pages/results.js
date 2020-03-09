import React from 'react';
import cookies from 'next-cookies';
import Results from 'components/Results/Results/';
import {
  updateLanguage, updateSort, updateSearchTerm, createRequest
} from 'lib/redux/actions/search';
import {
  postTypeUpdate, dateUpdate, categoryUpdate, sourceUpdate
} from 'lib/redux/actions/filter';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { loadSources } from 'lib/redux/actions/source';
import { loadCategories } from 'lib/redux/actions/category';
import { loadLanguages } from 'lib/redux/actions/language';
import { userLoggedIn, userLoggedOut } from 'lib/redux/actions/authentication';

const ResultsPage = () => <Results />;

ResultsPage.getInitialProps = async ctx => {
  const {
    query: {
      language, term, sortBy, postTypes, date, categories, sources
    },
    store
  } = ctx;

  // Check cookie if user is logged in, update authentication prop on redux store
  const { authentication } = cookies( ctx );
  const isLoggedIn = authentication === 'loggedIn';

  // Dispatch authentication action on SSR render
  if ( isLoggedIn ) {
    store.dispatch( userLoggedIn() );
  } else {
    store.dispatch( userLoggedOut() );
  }

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
  await typeUpdate;
  await termUpdate;
  await dateChange;
  await categoryChange;
  await sourceChange;

  // after all search values are updated, execute search request
  store.dispatch( createRequest() );
  // load filter menus if needed
  const { global } = store.getState();

  // Always load srcs and cats based on query
  const srcs = store.dispatch( loadSources() );
  const cats = store.dispatch( loadCategories() );

  let types;
  let langs;

  if ( !global.postTypes.list.length ) {
    types = store.dispatch( loadPostTypes( isLoggedIn ) ); // uses authentication filter to set which types to display
  }

  if ( !global.languages.list.length ) {
    langs = store.dispatch( loadLanguages() );
  }

  if ( types ) await types;
  if ( srcs ) await srcs;
  if ( cats ) await cats;
  if ( langs ) await langs;

  return {};
};

export default ResultsPage;
