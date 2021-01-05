import React, { useState, useEffect } from 'react';
import Featured from 'components/Featured/Featured';
import { useAuth } from 'context/authContext';
import { useDispatch } from 'react-redux';
import { clearFilters } from 'lib/redux/actions/filter';

const privateData = [
  {
    key: 'packages_1',
    component: 'packages',
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
    component: 'priorities',
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
    component: 'priorities',
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
    component: 'priorities',
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
    component: 'priorities',
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
    component: 'priorities',
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
    component: 'recents',
    order: 7,
    props: {
      postType: 'video',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_2',
    component: 'recents',
    order: 8,
    props: {
      postType: 'post',
      locale: 'en-us',
    },
  },
  {
    key: 'recents_3',
    component: 'recents',
    order: 9,
    props: {
      postType: 'graphic',
      locale: 'en-us',
    },
  },
];

const Landing = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [data, setData] = useState( [] );

  useEffect( () => {
    const _data = user && user.id !== 'public' ? [...publicData, ...privateData] : [...publicData];

    setData( _data );
  }, [user] );

  // trigger parallel loading calls to reset filters
  dispatch( clearFilters() );

  return (
    <section>
      <Featured
        data={ data }
        user={ user }
      />
    </section>
  );
};

export default Landing;
