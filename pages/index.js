import React, { Component } from 'react';

import Featured from 'components/Featured/Featured';
import { clearFilters } from 'lib/redux/actions/filter';
import { loadFeatured } from 'components/Featured/actions';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { v4 } from 'uuid';

const featuredData = [
  {
    key: v4(),
    component: 'priorities',
    order: 1,
    props: {
      term: 'iran',
      label: 'Iran',
      categories: [
        { key: 'dLWWJ2MBCLPpGnLD3D-N', display_name: 'Economic Opportunity' },
        { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' },
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' }
      ],
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'priorities',
    order: 2,
    props: {
      term: '5G',
      label: '5G',
      categories: [],
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'recents',
    order: 3,
    props: {
      postType: 'video',
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'recents',
    order: 4,
    props: {
      postType: 'post',
      locale: 'en-us'
    }
  }
];

class Landing extends Component {
  static async getInitialProps ( { store } ) {
    // trigger parellel loading calls
    const resetFilters = store.dispatch( clearFilters() );
    const featured = store.dispatch( loadFeatured( featuredData ) );
    const postTypes = store.dispatch( loadPostTypes() );

    // await completion
    await Promise.all( [
      resetFilters,
      featured,
      postTypes
    ] );

    return {};
  }

  render() {
    return (
      <section>
        <Featured data={ featuredData } />
      </section>
    );
  }
}

export default Landing;
