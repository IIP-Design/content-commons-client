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
    order: 1,
    props: {
      label: 'COVID-19 and Global Health',
      categories: ['health', 'sports'],
      tags: [
        'biomedical science',
        'covid-19',
        'coronavirus',
        'diseases',
        'drug use',
        'health organizations',
        'health facility',
        'healthcare policy',
        'health treatment',
        'treatment',
        'vaccine',
      ],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_2',
    component: Priorities,
    order: 2,
    props: {
      label: 'Climate Change',
      categories: ['environment'],
      tags: [
        'climate',
        'climate change',
        'conservation',
        'environmental politics',
        'environmental pollution',
      ],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_3',
    component: Priorities,
    order: 3,
    props: {
      label: 'Economy',
      categories: ['economic opportunity'],
      tags: [
        'economy',
        'economic sector',
        'business planning',
        'business plans & operations',
        'employment',
        'employment legislation',
        'labor market',
        'labor relations',
        'market',
        'small family business',
        'startups',
        'unemployment',
        'unions',
        'welfare',
      ],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_4',
    component: Priorities,
    order: 4,
    props: {
      term: 'asylum refugee',
      label: 'Immigration',
      categories: [],
      tags: ['immigration'],
      locale: 'en-us',
    },
  },
  {
    key: 'priorities_5',
    component: Priorities,
    order: 5,
    props: {
      label: 'Restoring America’s Global Standing',
      categories: ['democracy & civil society'],
      tags: [
        'american culture',
        'civic leadership',
        'democracy',
        'government Policy',
        'international relations',
        'leadership & community action',
        'policy',
        'state relations',
        'u.s. government',
        'values',
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
