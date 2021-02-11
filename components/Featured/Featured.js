import React from 'react';
import sortBy from 'lodash/sortBy';
import Packages from './Packages/Packages';
import Recents from './Recents/Recents';
import Priorities from './Priorities/Priorities';
import { useAuth } from 'context/authContext';

const privateData = [
  {
    key: 'packages_1',
    component: Packages,
    order: 1,
    props: {
      postType: 'package',
      locale: 'en-us',
    },
  },
];

const publicData = [
  {
    key: 'priorities_1',
    component: Priorities,
    order: 2,
    props: {
      term: 'china',
      label: 'China',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_2',
    component: Priorities,
    order: 3,
    props: {
      term: 'coronavirus covid',
      label: 'Coronavirus (COVID-19)',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_3',
    component: Priorities,
    order: 4,
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
    key: 'priorities_4',
    component: Priorities,
    order: 5,
    props: {
      term: '5G',
      label: '5G',
      categories: [],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_5',
    component: Priorities,
    order: 6,
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
    key: 'recents_1',
    component: Recents,
    order: 7,
    props: {
      postType: 'video',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_2',
    component: Recents,
    order: 8,
    props: {
      postType: 'post',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_3',
    component: Recents,
    order: 9,
    props: {
      postType: 'graphic',
      locale: 'en-us',
    },
  },
];

const Featured = () => {
  const { user } = useAuth();

  const renderSection = data => {
    const { key, props } = data;
    const ComponentName = data.component;

    return <ComponentName key={ key } { ...props } user={ user } />;
  };

  return (
    <div className="featured">
      { user && user.id !== 'public' && sortBy( privateData, 'order' ).map( d => renderSection( d ) ) }

      { sortBy( publicData, 'order' ).map( d => renderSection( d ) ) }
    </div>
  );
};

export default Featured;
