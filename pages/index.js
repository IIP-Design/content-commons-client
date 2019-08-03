import React, { Component } from 'react';

import Recents from 'components/Recents/Recents';
import { clearFilters } from 'lib/redux/actions/filter';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { loadRecents } from '../components/Recents/actions';

class Landing extends Component {
  static async getInitialProps ( { store } ) {
    // trigger parellel loading calls
    const resetFilters = store.dispatch( clearFilters() );
    const recentVideos = store.dispatch( loadRecents( 'video', 'en-us' ) );
    const recentPosts = store.dispatch( loadRecents( 'post', 'en-us' ) );
    const postTypes = store.dispatch( loadPostTypes() );

    // await completion
    await Promise.all( [
      resetFilters,
      recentVideos,
      recentPosts,
      postTypes
    ] );

    return {};
  }

  render() {
    return (
      <section className="max_width_1200">
        <Recents postType="video" />
        <Recents postType="post" />
      </section>
    );
  }
}

export default Landing;
