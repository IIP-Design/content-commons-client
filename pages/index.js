import React, { Component } from 'react';

import Featured from 'components/Featured/Featured';
import { clearFilters } from 'lib/redux/actions/filter';
import { loadFeatured } from 'components/Featured/actions';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { v4 } from 'uuid';

const featuredData = [
  {
    key: v4(),
    component: 'packages',
    order: 1,
    props: {
      term: 'venezuela',
      label: 'Venezuela',
      categories: [
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' },
        { key: 'MVqWJ2MBNxuyMP4E6Ci0', display_name: 'Good Governance' },
        { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' }
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
    component: 'priorities',
    order: 3,
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
    component: 'recents',
    order: 4,
    props: {
      postType: 'video',
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'recents',
    order: 5,
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
