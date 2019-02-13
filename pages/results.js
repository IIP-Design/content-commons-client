import React, { Component } from 'react';
import Results from 'components/Results/Results/';

import {
  updateSort, updateSearchTerm, updateLanguage, createRequest
} from 'lib/redux/actions/search';
import { postTypeUpdate } from 'lib/redux/actions/filter';
import { loadPostTypes } from '../lib/redux/actions/postType';

class ResultsPage extends Component {
  static async getInitialProps ( {
    query: {
      language, term, sortBy, postType
    }, req, store
  } ) {
    let postTypes;

    // trigger parellel loading calls
    const languageUpdate = store.dispatch( updateLanguage( language ) );
    const sortByUpdate = store.dispatch( updateSort( sortBy ) );
    const typeUpdate = store.dispatch( postTypeUpdate( postType ) );
    const termUpdate = store.dispatch( updateSearchTerm( term ) );

    // if this is a server request, we need to load the post types
    // as they will not be in the store
    if ( req ) {
      postTypes = store.dispatch( loadPostTypes() );
      await postTypes;
    }

    await languageUpdate;
    await sortByUpdate;
    await termUpdate;
    await typeUpdate;

    // after alll store values are updated, execute search request
    await store.dispatch( createRequest() );

    return {};
  }

  render() {
    return (
      <Results />
    );
  }
}

export default ResultsPage;
