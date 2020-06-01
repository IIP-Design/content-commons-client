import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Featured from 'components/Featured/Featured';
import { clearFilters } from 'lib/redux/actions/filter';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { v4 } from 'uuid';
import { fetchUser } from 'context/authContext';

const featuredData = [
  {
    key: v4(),
    component: 'packages',
    order: 1,
    props: {
      postType: 'package',
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'priorities',
    order: 2,
    props: {
      term: 'coronavirus covid',
      label: 'Coronavirus (COVID-19)',
      categories: [],
      locale: 'en-us',
    },
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
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' },
      ],
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'priorities',
    order: 4,
    props: {
      term: '5G',
      label: '5G',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'priorities',
    order: 5,
    props: {
      term: 'venezuela',
      label: 'Venezuela',
      categories: [
        { key: 'JFqWJ2MBNxuyMP4E5Cgn', display_name: 'Global Issues' },
        { key: 'MVqWJ2MBNxuyMP4E6Ci0', display_name: 'Good Governance' },
        { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' },
      ],
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'recents',
    order: 6,
    props: {
      postType: 'video',
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'recents',
    order: 7,
    props: {
      postType: 'post',
      locale: 'en-us',
    },
  },
  {
    key: v4(),
    component: 'recents',
    order: 8,
    props: {
      postType: 'graphic',
      locale: 'en-us',
    },
  },
];

class Landing extends Component {
  static async getInitialProps( ctx ) {
    const { store } = ctx;
    const featuredDataForLanding = [...featuredData];

    const user = await fetchUser( ctx );

    if ( !user ) {
      // remove internal packages (internal content) from query if user is not present
      featuredDataForLanding.shift();
    }

    // trigger parallel loading calls
    const resetFilters = store.dispatch( clearFilters() );
    const postTypes = store.dispatch( loadPostTypes( user ) );

    // await completion
    await Promise.all( [
      resetFilters,
      postTypes,
    ] );

    return { featuredDataForLanding, user };
  }

  render() {
    const { featuredDataForLanding, user } = this.props;

    return (
      <section>
        <Featured data={ featuredDataForLanding } user={ user } />
      </section>
    );
  }
}

Landing.propTypes = {
  featuredDataForLanding: PropTypes.array,
  user: PropTypes.object,
};

export default Landing;
