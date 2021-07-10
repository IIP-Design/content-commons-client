import { mount } from 'enzyme';

import Playbook from './Playbook';

import { mockItem } from './mocks';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080',
  },
} ) );

jest.mock( 'next/router', () => ( {
  useRouter: jest.fn( () => ( {
    asPath: '/admin/package/playbook/id123/preview',
  } ) ),
} ) );

jest.mock(
  'components/download/DownloadItem/DownloadItemContent',
  () => function DownloadItemContent() { return ''; },
);
jest.mock(
  'components/Share/Share',
  () => function Share() { return ''; },
);
jest.mock(
  'components/popups/Popover/Popover',
  () => function Popover() { return ''; },
);
jest.mock(
  'components/TexturedSection/TexturedSection',
  () => function TexturedSection() { return ''; },
);

describe( '<Playbook />, when published with updates (GraphQL)', () => {
  const wrapper = mount( <Playbook item={ mockItem } /> );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'each supported file is added to the downloadable attachments list', () => {
    const resources = wrapper.find( '.resources-list' );

    expect( resources.children() ).toHaveLength( mockItem.supportFiles.length );
  } );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Updated: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.contains( 'May 28, 2021 at 7:12 AM (Washington, DC)' ) )
      .toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( mockItem.updatedAt );
  } );
} );

describe( '<Playbook />, when published with updates (Elasticsearch)', () => {
  const item = {
    ...mockItem,
    created: '2021-05-26T11:12:34.140Z',
    modified: '2021-05-28T11:12:34.740Z',
    published: '2021-05-28T11:12:34.140Z',
    initialPublished: '2021-05-27T08:18:44.410Z',
  };

  delete item.createdAt;
  delete item.updatedAt;
  delete item.publishedAt;
  delete item.initialPublishedAt;

  const wrapper = mount( <Playbook item={ item } /> );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Updated: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.contains( 'May 28, 2021 at 7:12 AM (Washington, DC)' ) )
      .toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( item.modified );
  } );
} );

describe( '<Playbook />, when DRAFT and updated (GraphQL)', () => {
  const item = {
    ...mockItem,
    createdAt: '2021-05-26T11:12:34.140Z',
    updatedAt: '2021-05-28T18:42:34.520Z',
    publishedAt: null,
    initialPublishedAt: '2021-05-28T11:12:34.230Z',
  };

  const wrapper = mount( <Playbook item={ item } /> );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Updated: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.contains( 'May 28, 2021 at 2:42 PM (Washington, DC)' ) )
      .toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( item.updatedAt );
  } );
} );

describe( '<Playbook />, when initially created (GraphQL)', () => {
  const item = {
    ...mockItem,
    createdAt: '2021-05-28T11:12:34.140Z',
    updatedAt: '2021-05-28T11:12:34.740Z',
    publishedAt: null,
    initialPublishedAt: null,
  };

  const wrapper = mount( <Playbook item={ item } /> );

  it( 'renders the correct date and time', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Published: ' ) ).toEqual( true );
    expect( dateTime.contains( '(date will appear here)' ) )
      .toEqual( true );
  } );

  it( 'does not render the date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.exists() ).toEqual( false );
  } );
} );

describe( '<Playbook />, when initially published (GraphQL)', () => {
  const item = {
    ...mockItem,
    createdAt: '2021-05-26T11:12:34.140Z',
    updatedAt: '2021-05-28T11:12:34.740Z',
    publishedAt: '2021-05-28T11:12:34.320Z',
    initialPublishedAt: '2021-05-28T11:12:34.230Z',
  };

  const wrapper = mount( <Playbook item={ item } /> );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Published: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.contains( 'May 28, 2021 at 7:12 AM (Washington, DC)' ) )
      .toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( item.publishedAt );
  } );
} );

describe( '<Playbook />, when initially published (Elasticsearch)', () => {
  const item = {
    ...mockItem,
    created: '2021-05-26T11:12:34.140Z',
    modified: '2021-05-28T11:12:34.740Z',
    published: '2021-05-28T11:12:34.320Z',
    initialPublished: '2021-05-28T11:12:34.230Z',
  };

  delete item.createdAt;
  delete item.updatedAt;
  delete item.publishedAt;
  delete item.initialPublishedAt;

  const wrapper = mount( <Playbook item={ item } /> );

  it( 'renders the correct date and time label', () => {
    const dateTime = wrapper.find( '.title + p' );

    expect( dateTime.contains( 'Published: ' ) ).toEqual( true );
  } );

  it( 'renders the correct date and time', () => {
    const time = wrapper.find( '.title + p > time' );

    expect( time.contains( 'May 28, 2021 at 7:12 AM (Washington, DC)' ) )
      .toEqual( true );
    expect( time.prop( 'dateTime' ) ).toEqual( item.published );
  } );
} );

describe( '<Playbook /> without policy', () => {
  const noPolicyMocks = {
    ...mockItem,
    policy: undefined,
    theme: undefined,
  };

  const wrapper = mount( <Playbook item={ noPolicyMocks } /> );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not contain a policy badge', () => {
    const policyBadge = wrapper.find( '.policy-container' );

    expect( policyBadge.exists() ).toEqual( false );
  } );
} );
