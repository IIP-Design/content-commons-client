import React, { Component } from 'react';

import { loadRecents } from '../components/Recents/actions';
import { loadPostTypes } from '../lib/redux/globalActions/postType';
import Recents from '../components/Recents';

class Landing extends Component {
  static async getInitialProps ( { store } ) {
    // trigger parellel loading calls
    const recentVideos = store.dispatch( loadRecents( 'video', 'en-us' ) );
    const recentPosts = store.dispatch( loadRecents( 'post', 'en-us' ) );
    const postTypes = store.dispatch( loadPostTypes() );

    // await completion
    await recentVideos;
    await recentPosts;
    await postTypes;
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
