import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';
import GraphicProject from './GraphicProject';
import { getTransformedLangTaxArray } from 'lib/utils';
import { normalizeGraphicProjectByAPI } from './utils';
import { graphicElasticMock } from './graphicElasticMock';
import { graphicGraphqlMock } from './graphicGraphqlMock';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: {} } ) );

jest.mock(
  'context/authContext',
  () => ( {
    useAuth: jest.fn( () => ( { user: { firstName: 'user' } } ) ),
  } ),
);

jest.mock( 'lib/browser', () => ( { updateUrl: jest.fn() } ) );

jest.mock(
  'next/router',
  () => ( {
    replace: jest.fn(),
    useRouter: jest.fn( () => ( {
      query: {
        content: 'graphic',
        id: 'ck8en7r8x0b7007652jpf9a59',
        site: 'commons.america.gov',
        language: 'en-us',
      },
    } ) ),
  } ),
);

jest.mock( 'components/Notification/Notification', () => 'mock-notification' );
jest.mock( 'components/Share/Share', () => 'mock-share' );
jest.mock( 'components/TabLayout/TabLayout', () => 'tab-layout' );
jest.mock( 'components/download/DownloadItem/DownloadItem', () => 'download-item' );
jest.mock( './Download/GraphicFiles', () => 'graphic-files' );
jest.mock( './Download/GenericFiles', () => 'generic-files' );
jest.mock( './Download/Help', () => 'help' );
jest.mock( 'components/modals/ModalLangDropdown/ModalLangDropdown', () => 'modal-lang-dropdown' );
jest.mock( '../modals/ModalImage/ModalImage', () => 'modal-image' );
jest.mock( '../modals/ModalContentMeta/ModalContentMeta', () => 'modal-content-meta' );
jest.mock( 'components/modals/ModalDescription/ModalDescription', () => 'modal-description' );
jest.mock( 'components/modals/ModalPostMeta/ModalPostMeta', () => 'modal-post-meta' );
jest.mock( 'components/modals/ModalPostTags/ModalPostTags', () => 'modal-post-tags' );

describe( '<GraphicProject />, for GraphQL data', () => {
  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    item: graphicGraphqlMock,
    useGraphQl: true,
  };

  const normalizedData = normalizeGraphicProjectByAPI( {
    file: props.item,
    useGraphQl: props.useGraphQl,
  } );

  let Component;
  let wrapper;
  const selectedUnit = normalizedData.images.find( img => img.language.locale === 'en-us' );

  /* eslint-disable global-require */
  const { updateUrl } = require( 'lib/browser' );

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the ModalItem with correct props', () => {
    const modalItem = wrapper.find( 'ModalItem' );
    const { language } = selectedUnit;
    const className = 'graphic-project adminPreview';

    expect( modalItem.exists() ).toEqual( true );
    expect( modalItem.prop( 'className' ) ).toEqual( className );
    expect( modalItem.prop( 'headline' ) ).toEqual( normalizedData.title ); // title is now project title, not unit level
    expect( modalItem.prop( 'lang' ) ).toEqual( language.language_code );
    expect( modalItem.prop( 'textDirection' ) )
      .toEqual( language.text_direction );
    expect( modalItem.prop( 'children' ).length ).toEqual( 9 );
  } );

  it( 'renders the preview Notification', () => {
    const notification = wrapper.find( 'mock-notification' );
    const notificationProps = {
      el: 'p',
      show: true,
      customStyles: {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        padding: '1em 1.5em',
        fontSize: '1em',
        backgroundColor: '#fdb81e',
      },
      msg: 'This is a preview of your graphics project on Content Commons.',
    };

    expect( notification.exists() ).toEqual( true );
    expect( notification.props() ).toEqual( notificationProps );
  } );

  it( 'renders the ModalLanguageDropdown', () => {
    const langDropdown = wrapper.find( '.modal_options_left > modal-lang-dropdown' );

    expect( langDropdown.exists() ).toEqual( true );
    expect( langDropdown.prop( 'item' ) ).toEqual( normalizedData );
    expect( langDropdown.prop( 'selected' ) )
      .toEqual( selectedUnit.language.display_name );
    expect( langDropdown.prop( 'handleLanguageChange' ).name ).toEqual( 'handleLanguageChange' );
  } );

  it( 'calling handleLanguageChange selects a new language unit', () => {
    const langDropdown = () => wrapper.find( '.modal_options_left > modal-lang-dropdown' );
    const newLangSelection = 'French';

    act( () => {
      langDropdown().prop( 'handleLanguageChange' )( newLangSelection );
    } );
    wrapper.update();

    const newSelectedUnit = normalizedData.images.find( img => img.language.display_name === newLangSelection );
    const modalHeadline = wrapper.find( '.modal_headline' );

    expect( langDropdown().prop( 'selected' ) )
      .toEqual( newSelectedUnit.language.display_name );
    expect( modalHeadline.text() ).toEqual( normalizedData.title ); // title is now project title, not unit level
    expect( updateUrl ).not.toHaveBeenCalled();
  } );

  it( 'renders the trigger container and its child components', () => {
    const triggerContainer = wrapper.find( '.trigger-container' );
    // use snapshot since child components are nested so deeply.

    expect( toJSON( triggerContainer ) ).toMatchSnapshot();
  } );

  it( 'renders the correct download tabs', () => {
    const { id } = props.item;
    const triggerContainer = wrapper.find( '.trigger-container' );
    const popover = triggerContainer.find( `[id="${id}_graphic-download"]` );
    const tabLayout = mount( popover.prop( 'children' ) );
    const { tabs } = tabLayout.props();
    const tabTitles = [
      'Graphic Files', 'Editable Files', 'Other', 'Help',
    ];

    expect( tabs.length ).toEqual( tabTitles.length );
    tabs.forEach( ( tab, i ) => {
      expect( tab.title ).toEqual( tabTitles[i] );
    } );
  } );

  it( 'renders the ModalImage thumbnail', () => {
    const modalImage = wrapper.find( 'modal-image' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: normalizedData.alt },
    } );
  } );

  it( 'renders the ModalContentMeta', () => {
    const contentMeta = wrapper.find( 'modal-content-meta' );
    const { modified, projectType } = normalizedData;

    expect( contentMeta.exists() ).toEqual( true );
    expect( contentMeta.props() ).toEqual( {
      type: `${projectType.toLowerCase().replace( '_', ' ' )} graphic`,
      dateUpdated: modified,
    } );
  } );

  it( 'renders the ModalDescription', () => {
    const contentDesc = wrapper.find( 'modal-description' );

    expect( contentDesc.exists() ).toEqual( true );
    expect( contentDesc.props() ).toEqual( {
      description: normalizedData.desc,
    } );
  } );

  it( 'renders the internal description', () => {
    const internalDesc = wrapper.find( '.graphic-project__content.internal-desc' );
    const title = internalDesc.find( '.graphic-project__content__title' );

    expect( internalDesc.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Internal Description:' );
    expect( internalDesc.contains( normalizedData.descInternal ) ).toEqual( true );
  } );

  it( 'renders the alt text', () => {
    const alt = wrapper.find( '.graphic-project__content.alt' );
    const title = alt.find( '.graphic-project__content__title' );

    expect( alt.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Alt (Alternative) Text:' );
    expect( alt.contains( normalizedData.alt ) ).toEqual( true );
  } );

  it( 'renders the ModalPostMeta', () => {
    const postMeta = wrapper.find( 'modal-post-meta' );
    const { owner, projectType, published } = normalizedData;
    const { language } = selectedUnit;

    expect( postMeta.exists() ).toEqual( true );
    expect( postMeta.props() ).toEqual( {
      type: projectType,
      logo: 'image-stub',
      source: owner,
      datePublished: published,
      textDirection: language.text_direction,
    } );
  } );

  it( 'renders the ModalPostTags', () => {
    const postTags = wrapper.find( 'modal-post-tags' );

    expect( postTags.exists() ).toEqual( true );
    expect( postTags.props() ).toEqual( {
      tags: getTransformedLangTaxArray( props.item.categories ),
    } );
  } );
} );

describe( '<GraphicProject />, for GraphQL data with no project alt', () => {
  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    item: {
      ...graphicGraphqlMock,
      alt: '',
    },
    useGraphQl: true,
  };

  const normalizedData = normalizeGraphicProjectByAPI( {
    file: props.item,
    useGraphQl: props.useGraphQl,
  } );

  let Component;
  let wrapper;
  const selectedUnit = normalizedData.images.find( img => img.language.locale === 'en-us' );

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the ModalImage thumbnail', () => {
    const modalImage = wrapper.find( 'modal-image' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: normalizedData.title },
    } );
  } );

  it( 'renders the alt text', () => {
    const alt = wrapper.find( '.graphic-project__content.alt' );
    const title = alt.find( '.graphic-project__content__title' );

    expect( alt.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Alt (Alternative) Text:' );
    expect( alt.contains( normalizedData.title ) ).toEqual( true );
  } );
} );

describe( '<GraphicProject />, for GraphQL data with no support files', () => {
  const noSupportFiles = {
    ...graphicGraphqlMock,
    supportFiles: [],
  };

  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    item: noSupportFiles,
    useGraphQl: true,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );

describe( '<GraphicProject />, for GraphQL data with null support files', () => {
  const noSupportFiles = {
    ...graphicGraphqlMock,
    supportFiles: null,
  };

  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    item: noSupportFiles,
    useGraphQl: true,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );

describe( '<GraphicProject />, for ElasticSearch data', () => {
  const props = {
    item: graphicElasticMock[0]._source,
  };

  const normalizedData = normalizeGraphicProjectByAPI( {
    file: props.item,
  } );

  let Component;
  let wrapper;
  const selectedUnit = normalizedData.images.find( img => img.language.locale === 'en-us' );

  const { updateUrl } = require( 'lib/browser' );

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the ModalItem with correct props', () => {
    const modalItem = wrapper.find( 'ModalItem' );
    const { language } = selectedUnit;

    expect( modalItem.exists() ).toEqual( true );
    expect( modalItem.prop( 'className' ) ).toEqual( 'graphic-project' );
    expect( modalItem.prop( 'headline' ) ).toEqual( normalizedData.title ); // title is now project title, not unit level
    expect( modalItem.prop( 'lang' ) ).toEqual( language.language_code );
    expect( modalItem.prop( 'textDirection' ) )
      .toEqual( language.text_direction );
    expect( modalItem.prop( 'children' ).length ).toEqual( 9 );
  } );

  it( 'does not render the preview Notification', () => {
    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( false );
  } );

  it( 'renders the ModalLanguageDropdown', () => {
    const langDropdown = wrapper.find( '.modal_options_left > modal-lang-dropdown' );

    expect( langDropdown.exists() ).toEqual( true );
    expect( langDropdown.prop( 'item' ) ).toEqual( normalizedData );
    expect( langDropdown.prop( 'selected' ) )
      .toEqual( selectedUnit.language.display_name );
    expect( langDropdown.prop( 'handleLanguageChange' ).name ).toEqual( 'handleLanguageChange' );
  } );

  it( 'calling handleLanguageChange selects a new language unit', () => {
    const langDropdown = () => wrapper.find( '.modal_options_left > modal-lang-dropdown' );
    const newLangSelection = 'French';

    act( () => {
      langDropdown().prop( 'handleLanguageChange' )( newLangSelection );
    } );
    wrapper.update();

    const newSelectedUnit = normalizedData.images.find( img => img.language.display_name === newLangSelection );
    const modalHeadline = wrapper.find( '.modal_headline' );
    const { id, site, type } = props.item;
    const { language } = newSelectedUnit;
    const newUrl = `/${type}?id=${id}&site=${site}&language=${language.locale}`;

    expect( langDropdown().prop( 'selected' ) )
      .toEqual( language.display_name );
    expect( modalHeadline.text() ).toEqual( normalizedData.title ); // title is now project title, not unit level
    expect( updateUrl ).toHaveBeenCalledWith( newUrl );
  } );

  it( 'renders the trigger container and its child components', () => {
    const triggerContainer = wrapper.find( '.trigger-container' );
    // use snapshot since child components are nested so deeply.

    expect( toJSON( triggerContainer ) ).toMatchSnapshot();
  } );

  it( 'renders the correct download tabs', () => {
    const { id } = props.item;
    const triggerContainer = wrapper.find( '.trigger-container' );
    const popover = triggerContainer.find( `[id="${id}_graphic-download"]` );
    const tabLayout = mount( popover.prop( 'children' ) );
    const { tabs } = tabLayout.props();
    const tabTitles = [
      'Graphic Files', 'Editable Files', 'Other', 'Help',
    ];

    expect( tabs.length ).toEqual( tabTitles.length );
    tabs.forEach( ( tab, i ) => {
      expect( tab.title ).toEqual( tabTitles[i] );
    } );
  } );

  it( 'renders the ModalImage thumbnail', () => {
    const modalImage = wrapper.find( 'modal-image' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: selectedUnit.alt },
    } );
  } );

  it( 'renders the ModalContentMeta', () => {
    const contentMeta = wrapper.find( 'modal-content-meta' );
    const { modified, projectType } = normalizedData;

    expect( contentMeta.exists() ).toEqual( true );
    expect( contentMeta.props() ).toEqual( {
      type: `${projectType.toLowerCase().replace( '_', ' ' )} graphic`,
      dateUpdated: modified,
    } );
  } );

  it( 'renders the ModalDescription', () => {
    const contentDesc = wrapper.find( 'modal-description' );

    expect( contentDesc.exists() ).toEqual( true );
    expect( contentDesc.props() ).toEqual( {
      description: normalizedData.desc,
    } );
  } );

  it( 'renders the internal description', () => {
    const internalDesc = wrapper.find( '.graphic-project__content.internal-desc' );
    const title = internalDesc.find( '.graphic-project__content__title' );

    expect( internalDesc.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Internal Description:' );
    expect( internalDesc.contains( normalizedData.descInternal ) ).toEqual( true );
  } );

  it( 'renders the alt text', () => {
    const alt = wrapper.find( '.graphic-project__content.alt' );
    const title = alt.find( '.graphic-project__content__title' );

    expect( alt.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Alt (Alternative) Text:' );
    expect( alt.contains( selectedUnit.alt ) ).toEqual( true );
  } );

  it( 'renders the ModalPostMeta', () => {
    const postMeta = wrapper.find( 'modal-post-meta' );
    const { owner, projectType, published } = normalizedData;
    const { language } = selectedUnit;

    expect( postMeta.exists() ).toEqual( true );
    expect( postMeta.props() ).toEqual( {
      type: projectType,
      logo: 'image-stub',
      source: owner,
      datePublished: published,
      textDirection: language.text_direction,
    } );
  } );

  it( 'renders the ModalPostTags', () => {
    const postTags = wrapper.find( 'modal-post-tags' );

    expect( postTags.exists() ).toEqual( true );
    expect( postTags.props() ).toEqual( {
      tags: props.item.categories,
    } );
  } );
} );

describe( '<GraphicProject />, for ElasticSearch data with no image alts', () => {
  const props = {
    item: {
      ...graphicElasticMock[0]._source,
      images: graphicElasticMock[0]._source.images.map( img => ( {
        ...img,
        alt: '',
      } ) ),
    },
  };

  const normalizedData = normalizeGraphicProjectByAPI( {
    file: props.item,
  } );

  let Component;
  let wrapper;
  const selectedUnit = normalizedData.images.find( img => img.language.locale === 'en-us' );

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the ModalImage thumbnail', () => {
    const modalImage = wrapper.find( 'modal-image' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: normalizedData.title },
    } );
  } );

  it( 'renders the alt text', () => {
    const alt = wrapper.find( '.graphic-project__content.alt' );
    const title = alt.find( '.graphic-project__content__title' );

    expect( alt.exists() ).toEqual( true );
    expect( title.exists() ).toEqual( true );
    expect( title.text() ).toEqual( 'Alt (Alternative) Text:' );
    expect( alt.contains( normalizedData.title ) ).toEqual( true );
  } );
} );

describe( '<GraphicProject />, for ElasticSearch data with no support files', () => {
  const noSupportFiles = {
    ...graphicElasticMock[0]._source,
    supportFiles: [],
  };

  const props = {
    item: noSupportFiles,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );

describe( '<GraphicProject />, for ElasticSearch data with null support files', () => {
  const noSupportFiles = {
    ...graphicElasticMock[0]._source,
    supportFiles: null,
  };

  const props = {
    item: noSupportFiles,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
