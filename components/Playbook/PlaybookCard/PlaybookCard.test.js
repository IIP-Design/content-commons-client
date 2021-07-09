import { mount } from 'enzyme';
import PlaybookCard from './PlaybookCard';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

jest.mock(
  'components/MediaObject/MediaObject',
  () => function MediaObject() { return ''; },
);

jest.mock(
  'components/admin/MetaTerms/MetaTerms',
  () => function MetaTerms() { return ''; },
);

const item = {
  id: 'ckq6k1tzi0q710720lr0zwtpv',
  indexId: 'ANUwL3oB-mFYjIfRR7LL',
  site: 'commons.america.gov',
  logo: '',
  sourcelink: 'https://commons.america.gov',
  type: 'playbook',
  icon: 'data:image/png;base64,iVBORw0KGgoAAAANS',
  author: '',
  owner: 'GPA Global Campaigns Strategy Unit',
  link: '',
  created: '2021-06-21T11:50:36.443Z',
  modified: '2021-07-08T16:13:15.807Z',
  published: '2021-07-08T16:13:15.807Z',
  initialPublished: '2021-07-08T16:13:15.807Z',
  visibility: 'INTERNAL',
  title: 'Vivamus sagittis lacus',
  desc: 'Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac facilisis in, eges',
  policy: {
    name: 'Covid-19 Recovery',
    theme: '#dd7533',
  },
  supportFiles: [],
};

describe( '<PlaybookCard />, when initially published', () => {
  const props = { item };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookCard { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the decorative SVG wave as accessibly hidden', () => {
    const wave = wrapper.find( 'svg' );

    expect( wave.prop( 'aria-hidden' ) ).toEqual( 'true' );
    expect( wave.prop( 'focusable' ) ).toEqual( 'false' );
  } );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.date-time' );

    expect( dateTime.contains( 'Published: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( 'time' );

    expect( time.contains( 'July 8, 2021' ) ).toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( props.item.initialPublished );
  } );
} );

describe( '<PlaybookCard />, when published with updates', () => {
  const props = {
    item: {
      ...item,
      modified: '2021-07-08T17:29:46.896Z',
      published: '2021-07-08T17:29:46.896Z',
    },
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookCard { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.date-time' );

    expect( dateTime.contains( 'Updated: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( 'time' );

    expect( time.contains( 'July 8, 2021' ) ).toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( props.item.modified );
  } );
} );
