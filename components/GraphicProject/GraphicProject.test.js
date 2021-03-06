import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { act } from 'react-dom/test-utils';

import { useAuth } from 'context/authContext';
import { updateUrl } from 'lib/browser';
import { getTransformedLangTaxArray } from 'lib/utils';
import { normalizeGraphicProjectByAPI } from './utils';

import { graphicElasticMock } from './graphicElasticMock';
import { graphicGraphqlMock } from './graphicGraphqlMock';

import GraphicProject from './GraphicProject';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: {} } ) );
jest.mock( 'lib/browser', () => ( { updateUrl: jest.fn() } ) );
jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => ( {
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
  } ) ),
} ) );

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

jest.mock(
  'components/InternalUseDisplay/InternalUseDisplay',
  () => function InternalUseDisplay() { return ''; },
);
jest.mock(
  'components/Notification/Notification',
  () => function Notification() { return ''; },
);
jest.mock(
  'components/Share/Share',
  () => function Share() { return ''; },
);
jest.mock(
  'components/TabLayout/TabLayout',
  () => function TabLayout() { return ''; },
);
jest.mock(
  'components/download/DownloadItem/DownloadItem',
  () => function DownloadItem() { return ''; },
);
jest.mock(
  './Download/GraphicFiles',
  () => function GraphicFiles() { return ''; },
);
jest.mock(
  './Download/GenericFiles',
  () => function GenericFiles() { return ''; },
);
jest.mock( './Download/Help', () => function Help() { return ''; } );
jest.mock(
  'components/modals/ModalLangDropdown/ModalLangDropdown',
  () => function ModalLangDropdown() { return ''; },
);
jest.mock(
  '../modals/ModalImage/ModalImage',
  () => function ModalImage() { return ''; },
);
jest.mock(
  '../modals/ModalContentMeta/ModalContentMeta',
  () => function ModalContentMeta() { return ''; },
);
jest.mock(
  'components/modals/ModalDescription/ModalDescription',
  () => function ModalDescription() { return ''; },
);
jest.mock(
  'components/modals/ModalPostMeta/ModalPostMeta',
  () => function ModalPostMeta() { return ''; },
);
jest.mock(
  'components/modals/ModalPostTags/ModalPostTags',
  () => function ModalPostTags() { return ''; },
);

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
    const notification = wrapper.find( 'Notification' );
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
    const langDropdown = wrapper.find( '.modal_options_left > ModalLangDropdown' );

    expect( langDropdown.exists() ).toEqual( true );
    expect( langDropdown.prop( 'item' ) ).toEqual( normalizedData );
    expect( langDropdown.prop( 'selected' ) )
      .toEqual( selectedUnit.language.display_name );
    expect( langDropdown.prop( 'handleLanguageChange' ).name ).toEqual( 'handleLanguageChange' );
  } );

  it( 'calling handleLanguageChange selects a new language unit', () => {
    const langDropdown = () => wrapper.find( '.modal_options_left > ModalLangDropdown' );
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
    const modalImage = wrapper.find( 'ModalImage' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: normalizedData.alt },
    } );
  } );

  it( 'renders the ModalContentMeta', () => {
    const contentMeta = wrapper.find( 'ModalContentMeta' );
    const { modified, projectType } = normalizedData;

    expect( contentMeta.exists() ).toEqual( true );
    expect( contentMeta.props() ).toEqual( {
      type: `${projectType.toLowerCase().replace( '_', ' ' )} graphic`,
      dateUpdated: modified,
    } );
  } );

  it( 'renders the ModalDescription', () => {
    const contentDesc = wrapper.find( 'ModalDescription' );

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
    const postMeta = wrapper.find( 'ModalPostMeta' );
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
    const postTags = wrapper.find( 'ModalPostTags' );

    expect( postTags.exists() ).toEqual( true );
    expect( postTags.props() ).toEqual( {
      tags: getTransformedLangTaxArray( props.item.categories ),
    } );
  } );

  it( 'does not render the InternalUseDisplay if visibility is PUBLIC', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( false );
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
    const modalImage = wrapper.find( 'ModalImage' );

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

describe( '<GraphicProject />, for GraphQL data with INTERNAL visibility', () => {
  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    item: {
      ...graphicGraphqlMock,
      visibility: 'INTERNAL',
    },
    useGraphQl: true,
  };

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the InternalUseDisplay', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( true );
    expect( internalDisplay.props() ).toEqual( {
      style: { marginLeft: 'auto' },
    } );
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
    const langDropdown = wrapper.find( '.modal_options_left > ModalLangDropdown' );

    expect( langDropdown.exists() ).toEqual( true );
    expect( langDropdown.prop( 'item' ) ).toEqual( normalizedData );
    expect( langDropdown.prop( 'selected' ) )
      .toEqual( selectedUnit.language.display_name );
    expect( langDropdown.prop( 'handleLanguageChange' ).name ).toEqual( 'handleLanguageChange' );
  } );

  it( 'calling handleLanguageChange selects a new language unit', () => {
    const langDropdown = () => wrapper.find( '.modal_options_left > ModalLangDropdown' );
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
    const modalImage = wrapper.find( 'ModalImage' );

    expect( modalImage.exists() ).toEqual( true );
    expect( modalImage.props() ).toEqual( {
      thumbnail: selectedUnit.url,
      thumbnailMeta: { alt: selectedUnit.alt },
    } );
  } );

  it( 'renders the ModalContentMeta', () => {
    const contentMeta = wrapper.find( 'ModalContentMeta' );
    const { modified, projectType } = normalizedData;

    expect( contentMeta.exists() ).toEqual( true );
    expect( contentMeta.props() ).toEqual( {
      type: `${projectType.toLowerCase().replace( '_', ' ' )} graphic`,
      dateUpdated: modified,
    } );
  } );

  it( 'renders the ModalDescription', () => {
    const contentDesc = wrapper.find( 'ModalDescription' );

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
    const postMeta = wrapper.find( 'ModalPostMeta' );
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
    const postTags = wrapper.find( 'ModalPostTags' );

    expect( postTags.exists() ).toEqual( true );
    expect( postTags.props() ).toEqual( {
      tags: props.item.categories,
    } );
  } );

  it( 'does not render the InternalUseDisplay if visibility is PUBLIC', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( false );
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
    const modalImage = wrapper.find( 'ModalImage' );

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

describe( '<GraphicProject />, for ElasticSearch data with INTERNAL visibility', () => {
  const props = {
    item: {
      ...graphicElasticMock[0]._source,
      visibility: 'INTERNAL',
    },
  };

  const normalizedData = normalizeGraphicProjectByAPI( {
    file: props.item,
  } );

  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders the InternalUseDisplay', () => {
    const internalDisplay = wrapper.find( 'InternalUseDisplay' );

    expect( internalDisplay.exists() ).toEqual( true );
    expect( internalDisplay.props() ).toEqual( {
      style: { marginLeft: 'auto' },
    } );
  } );
} );

describe( '<GraphicProject />, for a user not logged in', () => {
  const props = {
    item: graphicElasticMock[0]._source,
  };
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <GraphicProject { ...props } />;
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
    const triggerContainer = wrapper.find( '.trigger-container' );
    const popover = triggerContainer.find( `[id="${id}_graphic-download"]` );
    const tabLayout = mount( popover.prop( 'children' ) );
    const { tabs } = tabLayout.props();
    const tabTitles = [
      'Graphic Files', 'Other', 'Help',
    ];

    expect( tabs.length ).toEqual( tabTitles.length );
    tabs.forEach( ( tab, i ) => {
      expect( tab.title ).toEqual( tabTitles[i] );
    } );
  } );

  it( 'does not render the internal description', () => {
    const internalDesc = wrapper.find( '.graphic-project__content.internal-desc' );

    expect( internalDesc.exists() ).toEqual( false );
  } );
} );
