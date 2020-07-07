import { mount } from 'enzyme';

import Post from './Post';
import { mockItem } from './mocks';

const mockRouter = { pathname: '/post' };

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_CDP_MODULES_URL: '',
    REACT_APP_SINGLE_ARTICLE_MODULE: '',
  },
} ) );

jest.mock( 'components/modals/ModalItem', () => 'modal-item' );
jest.mock( 'components/modals/ModalLangDropdown/ModalLangDropdown', () => 'modal-lang-dropdown' );
jest.mock( 'components/modals/ModalContentMeta/ModalContentMeta', () => 'modal-content-meta' );
jest.mock( 'components/modals/ModalImage/ModalImage', () => 'modal-image' );
jest.mock( 'components/modals/ModalPostMeta/ModalPostMeta', () => 'modal-post-meta' );
jest.mock( 'components/modals/ModalPostTags/ModalPostTags', () => 'modal-post-tags' );
jest.mock( 'components/modals/ModalText/ModalText', () => 'modal-text' );
jest.mock( 'components/popups/PopupTrigger', () => 'popup-trigger' );
jest.mock( 'components/popups/PopupTabbed', () => 'popup-tabbed' );
jest.mock( 'components/popups/Popup', () => 'popup' );
jest.mock( 'components/Share/Share', () => 'share' );

afterAll( () => { jest.restoreAllMocks(); } );

describe( '<Post />', () => {
  const wrapper = mount( <Post item={ mockItem } router={ mockRouter } /> );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'passes the expected props to the ModalItem component', () => {
    const modalItem = wrapper.find( 'modal-item' );

    expect( modalItem.exists() ).toEqual( true );
    expect( modalItem.prop( 'headline' ) ).toEqual( mockItem.title );
    expect( modalItem.prop( 'textDirection' ) ).toEqual( mockItem.language.text_direction );
  } );

  it( 'passes the expected props to the ModalImage component', () => {
    const modalImage = wrapper.find( 'modal-image' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.prop( 'thumbnail' ) ).toEqual( mockItem.thumbnail );
    expect( modalImage.prop( 'thumbnailMeta' ) ).toEqual( mockItem.thumbnailMeta );
  } );

  it( 'passes the expected props to the ModalContentMeta component', () => {
    const modalContentMeta = wrapper.find( 'modal-content-meta' );

    expect( modalContentMeta.exists() ).toEqual( true );
    expect( modalContentMeta.prop( 'type' ) ).toEqual( mockItem.type );
    expect( modalContentMeta.prop( 'dateUpdated' ) ).toEqual( mockItem.modified );
  } );

  it( 'passes the expected props to the ModalPostMeta component', () => {
    const postMeta = wrapper.find( 'modal-post-meta' );

    expect( postMeta.exists() ).toEqual( true );
    expect( postMeta.prop( 'datePublished' ) ).toEqual( mockItem.published );
    expect( postMeta.prop( 'logo' ) ).toEqual( mockItem.logo );
    expect( postMeta.prop( 'source' ) ).toEqual( mockItem.site );
    expect( postMeta.prop( 'originalLink' ) ).toEqual( mockItem.link );
    expect( postMeta.prop( 'sourceLink' ) ).toEqual( mockItem.sourceLink );
    expect( postMeta.prop( 'type' ) ).toEqual( mockItem.type );
  } );

  it( 'renders the "Content Unavailable" message when no item is passed in', () => {
    const noItemWrapper = mount( <Post item={ null } router={ mockRouter } /> );

    const modalItem = noItemWrapper.find( 'modal-item' );

    expect( modalItem.prop( 'headline' ) ).toEqual( 'Content Unavailable' );
  } );
} );
