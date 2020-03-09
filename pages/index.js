import React, { useEffect } from 'react';
import cookies from 'next-cookies';
import { useDispatch } from 'react-redux';
import Featured from 'components/Featured/Featured';
import { clearFilters } from 'lib/redux/actions/filter';
import { loadFeatured } from 'components/Featured/actions';
import { loadPostTypes } from 'lib/redux/actions/postType';
import { userLoggedIn, userLoggedOut } from 'lib/redux/actions/authentication';
import { v4 } from 'uuid';

const featuredData = [
  {
    key: v4(),
    component: 'packages',
    order: 1,
    props: {
      postType: 'package',
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'priorities',
    order: 2,
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
    order: 3,
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
    order: 4,
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
    component: 'recents',
    order: 5,
    props: {
      postType: 'video',
      locale: 'en-us'
    }
  },
  {
    key: v4(),
    component: 'recents',
    order: 6,
    props: {
      postType: 'post',
      locale: 'en-us'
    }
  }
];

const Landing = () => (
  <section>
    <Featured data={ featuredData } />
  </section>
);

Landing.getInitialProps = async ctx => {
  const { store } = ctx;
  const { authentication } = cookies( ctx );
  const isLoggedIn = authentication === 'loggedIn';

  // Dispatch authentication action on SSR render
  if ( isLoggedIn ) {
    store.dispatch( userLoggedIn() );
  } else {
    store.dispatch( userLoggedOut() );
  }

  // trigger parellel loading calls
  const resetFilters = store.dispatch( clearFilters() );
  const postTypes = store.dispatch( loadPostTypes( isLoggedIn ) );
  const featured = store.dispatch( loadFeatured( featuredData ) );

  // await completion
  await Promise.all( [
    resetFilters,
    postTypes,
    featured
  ] );

  return {};
};

export default Landing;
