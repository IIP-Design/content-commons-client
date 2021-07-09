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

jest.mock( 'components/download/DownloadItem/DownloadItemContent', () => 'download-item-content' );
jest.mock( 'components/Share/Share', () => 'share' );
jest.mock( 'components/popups/Popover/Popover', () => 'popover' );
jest.mock( 'components/TexturedSection/TexturedSection', () => 'textured-section' );

describe( '<Playbook />', () => {
  const wrapper = mount( <Playbook item={ mockItem } /> );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'each supported file is added to the downloadable attachments list', () => {
    const resources = wrapper.find( '.resources-list' );

    expect( resources.children() ).toHaveLength( mockItem.supportFiles.length );
  } );

  it( 'has a policy badge', () => {
    const policyBadge = wrapper.find( '.policy-container' );

    expect( policyBadge.exists() ).toEqual( true );
    expect( policyBadge.contains( mockItem.policy ) ).toEqual( true );
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
