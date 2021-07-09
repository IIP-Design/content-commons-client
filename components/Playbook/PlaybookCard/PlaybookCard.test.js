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

describe( '<PlaybookCard />', () => {
  const props = {
    item: {
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
      published: '2021-06-21T15:28:50.747Z',
      modified: '2021-06-21T15:28:50.747Z',
      visibility: 'INTERNAL',
      title: 'Vivamus sagittis lacus',
      desc: 'Nullam quis risus eget urna mollis ornare vel eu leo. Cras justo odio, dapibus ac facilisis in, eges',
      policy: {
        name: 'Covid-19 Recovery',
        theme: '#dd7533',
      },
      supportFiles: [],
    },
  };
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
} );
