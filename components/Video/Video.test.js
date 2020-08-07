import { mount } from 'enzyme';
import { useAuth } from 'context/authContext';
import Video from './Video';
import { mockItem } from './mocks';

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: 'https://example.jpg' } ) ) );
jest.mock( 'lib/browser', () => ( {
  updateUrl: () => jest.fn(),
} ) );
jest.mock( './utils', () => ( {
  fetchVideoPlayer: () => ( {} ),
  getCaptions: jest.fn(),
  getLanguage: () => ( { display_name: 'English', locale: 'en-us', text_direction: 'ltr' } ),
  getVideoTranscript: jest.fn(),
} ) );
jest.mock( 'next/router', () => ( {
  withRouter: component => {
    component.defaultProps = {
      ...component.defaultProps,
      router: {
        pathname: '/video',
      },
    };

    return component;
  },
} ) );
jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn(),
} ) );

jest.mock( 'components/modals/ModalItem', () => 'modal-item' );
jest.mock( 'components/modals/ModalLangDropdown/ModalLangDropdown', () => 'modal-lang-dropdown' );
jest.mock( 'components/modals/ModalContentMeta/ModalContentMeta', () => 'modal-content-meta' );
jest.mock( 'components/modals/ModalDescription/ModalDescription', () => 'modal-description' );
jest.mock( 'components/modals/ModalPostMeta/ModalPostMeta', () => 'modal-post-meta' );
jest.mock( 'components/modals/ModalPostTags/ModalPostTags', () => 'modal-post-tags' );
jest.mock( 'components/popups/PopupTrigger', () => 'popup-trigger' );
jest.mock( 'components/popups/PopupTabbed', () => 'popup-tabbed' );
jest.mock( 'components/popups/Popup', () => 'popup' );
jest.mock( './Download/DownloadVideo', () => 'download-video' );
jest.mock( './Download/DownloadCaption', () => 'download-caption' );
jest.mock( './Download/DownloadTranscript', () => 'download-transcript' );
jest.mock( './Download/DownloadHelp', () => 'download-help' );
jest.mock( '../Share/Share', () => 'share' );
jest.mock( '../Embed', () => 'embed' );
jest.mock( './Download/EmbedHelp', () => 'embed-help' );

const mockRouter = { pathname: '/video' };

afterAll( () => { jest.restoreAllMocks(); } );

describe( '<Video />', () => {
  beforeEach( () => {
    useAuth.mockImplementation( () => ( {
      user: {
        id: 'ck2m042xo0rnp0720nb4gxjix',
        firstName: 'Joe',
        lastName: 'Schmoe',
        email: 'schmoej@america.gov',
        jobTitle: '',
        country: 'United States',
        city: 'Washington, DC',
        howHeard: '',
        permissions: ['EDITOR'],
        team: {
          id: 'ck2lzfx6u0hkj0720f8n8mtda',
          name: 'GPA Design & Editorial',
          contentTypes: ['GRAPHIC'],
          __typename: 'Team',
        },
        __typename: 'User',
        esToken: 'eyasdljfakljsdfklj',
      },
    } ) );
  } );

  it( 'renders without crashing', () => {
    const wrapper = mount( <Video item={ mockItem } router={ mockRouter } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it.skip( 'language dropdown populates based on language display name', () => {
    const wrapper = mount( <Video item={ mockItem } router={ mockRouter } /> );

    const langDropdown = wrapper.find( 'modal-lang-dropdown' );

    expect( langDropdown.prop( 'selected' ) ).toEqual( 'English' );
  } );

  it.skip( 'passes the meta values to the ModalPostMeta component', () => {
    const wrapper = mount( <Video item={ mockItem } router={ mockRouter } /> );

    const meta = wrapper.find( 'modal-post-meta' );

    expect( meta.prop( 'source' ) ).toEqual( 'GPA Video' );
    expect( meta.prop( 'datePublished' ) ).toEqual( '2020-05-18T17:48:00.103Z' );
  } );

  // it( 'returns "Content Unavailable" message if the selectedLanguageUnit is not set', () => {
  //   const newProps = {
  //     item: {
  //       ...mockItem,
  //       selectedLanguageUnit: null,
  //     },
  //     router: { mockRouter },
  //   };

  //   console.log( newProps );

  //   const wrapper = mount( <Video { ...newProps } /> );

  //   const modalItem = wrapper.find( 'ModalItem' );

  //   expect( modalItem.contains( 'Content Unavailable' ) ).toEqual( true );
  // } );
} );

describe( '<Video />, for a user not logged in', () => {
  const props = {
    item: mockItem,
    router: mockRouter,
    isAdminPreview: false,
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <Video { ...props } />;
    wrapper = mount( Component );

    useAuth.mockImplementation( () => ( {
      user: {
        id: 'public',
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: null,
        country: null,
        city: null,
        howHeard: null,
        permissions: [],
        team: null,
        __typename: 'User',
      },
    } ) );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct download tabs', () => {
    const { id } = props.item;
    const popover = wrapper.find( `[id="${id}_video-download"]` );
    const tabLayout = mount( popover.prop( 'children' ) );
    const { tabs } = tabLayout.props();
    const tabTitles = [
      'Video Files', 'Caption Files', 'Transcript', 'Other', 'Help',
    ];

    expect( tabs.length ).toEqual( tabTitles.length );
    tabs.forEach( ( tab, i ) => {
      expect( tab.title ).toEqual( tabTitles[i] );
    } );
  } );
} );
