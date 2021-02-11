import { mount } from 'enzyme';

import PackageItem from './PackageItem';

import { suppressActWarning } from 'lib/utils';
import { normalizeDocumentItemByAPI } from '../utils';

jest.mock( 'components/Document/DocumentCard/DocumentCard', () => 'document-card' );
jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

const props = {
  file: {
    id: 'ck38xhb9v1ypy072002wr8i5f',
    createdAt: '2019-11-21T16:26:33.402Z',
    updatedAt: '2020-01-03T13:51:29.909Z',
    publishedAt: null,
    title: 'sample one.doc 111',
    filename: 'sample one.docx',
    filetype: null,
    filesize: null,
    status: 'DRAFT',
    visibility: 'INTERNAL',
    url: '2019/12/sample one.docx',
    signedUrl: 'https://amgov-publisher-dev.s3.amazonaws.com/2019/12/sample%20one.docx?AWSAccessKeyId=ggggg&Expires=1578603029&Signature=erererer',
    content: {
      id: 'ck391csz01yrw07205d7xr8iw',
      rawText: 'U.S. DEPARTMENT OF STATE Office of the Spokesperson For Immediate Release Statement by ROBERT PALLADINO, DEPUTY SPOKESPERSON Month Date, 2018 100th Anniversary of the U.S.-Canada Boundary Waters Treaty &lt;Not in CAPS&gt; A statement provides the official U.S. policy/view or comment on a particular foreign policy issue usually in the name of the Spokesperson, Deputy Spokesperson, and sometimes from the Secretary of State.',
      html: '<p>U.S. DEPARTMENT OF STATE</p><p>Office of the Spokesperson</p><p>For Immediate Release </p><p>Statement by ROBERT PALLADINO, DEPUTY SPOKESPERSON</p><p>Month Date, 2018</p><p>100th Anniversary of the U.S.-Canada Boundary Waters Treaty &lt;Not in CAPS&gt;</p><p>A statement provides the official U.S. policy/view or comment on a particular foreign policy issue usually in the name of the Spokesperson, Deputy Spokesperson, and sometimes from the Secretary of State.</p>',
      __typename: 'DocumentConversionFormat',
    },
    use: {
      id: 'ck2wbvj6010kz0720c358mbrt',
      name: 'Department Press Briefing',
      __typename: 'DocumentUse',
    },
    bureaus: [],
    image: [],
    language: {
      id: 'ck2lzfx710hkq07206thus6pt',
      locale: 'en-us',
      languageCode: 'en',
      displayName: 'English',
      textDirection: 'LTR',
      nativeName: 'English',
      __typename: 'Language',
    },
    categories: [],
    tags: [
      {
        id: 'ck2lzgu500rgb0720scmree6q',
        translations: [
          {
            id: 'ck2lzg81f0l220720xozsqnww',
            name: 'business and entrepreneurship',
            language: {
              id: 'ck2lzfx710hkq07206thus6pt',
              locale: 'en-us',
              languageCode: 'en',
              displayName: 'English',
              textDirection: 'LTR',
              nativeName: 'English',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
          {
            id: 'ck2lzg81z0l2907209nhmfzce',
            name: 'negocios y emprendimiento',
            language: {
              id: 'ck2lzfx7o0hl707205uteku77',
              locale: 'es-es',
              languageCode: 'es',
              displayName: 'Spanish',
              textDirection: 'LTR',
              nativeName: 'Español',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
          {
            id: 'ck2lzg82k0l2g0720yojg47ku',
            name: 'affaires et entrepreneuriat',
            language: {
              id: 'ck2lzfx710hkp07206oo0icbv',
              locale: 'fr-fr',
              languageCode: 'fr',
              displayName: 'French',
              textDirection: 'LTR',
              nativeName: 'Français',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
        ],
        __typename: 'Tag',
      },
      {
        id: 'ck2lzgu5b0rho07207cqfeya0',
        translations: [
          {
            id: 'ck2lzghuy0nne0720be7g4kki',
            name: 'armed conflict',
            language: {
              id: 'ck2lzfx710hkq07206thus6pt',
              locale: 'en-us',
              languageCode: 'en',
              displayName: 'English',
              textDirection: 'LTR',
              nativeName: 'English',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
          {
            id: 'ck2lzghvp0nnl0720ddbyim3m',
            name: 'conflicto armado',
            language: {
              id: 'ck2lzfx7o0hl707205uteku77',
              locale: 'es-es',
              languageCode: 'es',
              displayName: 'Spanish',
              textDirection: 'LTR',
              nativeName: 'Español',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
          {
            id: 'ck2lzghwb0nns07207xjmveqe',
            name: 'un conflit armé',
            language: {
              id: 'ck2lzfx710hkp07206oo0icbv',
              locale: 'fr-fr',
              languageCode: 'fr',
              displayName: 'French',
              textDirection: 'LTR',
              nativeName: 'Français',
              __typename: 'Language',
            },
            __typename: 'LanguageTranslation',
          },
        ],
        __typename: 'Tag',
      },
    ],
    __typename: 'DocumentFile',
  },
  team: {
    id: 'ck2qgfbku0ubh0720iwhkvuyn',
    name: 'GPA Press Office',
    __typename: 'Team',
  },
  type: 'DAILY_GUIDANCE',
  isAdminPreview: true,
};

const normalizedDocFile = normalizeDocumentItemByAPI( { file: props.file, useGraphQl: true } );

const Component = (
  <PackageItem
    file={ normalizedDocFile }
    team={ props.team }
    type={ props.type }
    isAdminPreview={ props.isAdminPreview }
  />
);

describe( '<PackageItem />', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );

  afterAll( () => {
    console.error = consoleError;
  } );

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'does not crash if props.file is undefined', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { file: undefined } );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.html() ).toEqual( null );
  } );

  it( 'does not crash if props.file is {}', () => {
    const wrapper = mount( Component );

    wrapper.setProps( { file: {} } );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.html() ).toEqual( null );
  } );

  it.skip( 'calling handleOpen/handleClose opens/closes the Modal', () => {
    const wrapper = mount( Component );
    const modal = () => wrapper.find( 'Modal' );

    // closed initially
    expect( modal().prop( 'open' ) ).toEqual( false );
    expect( modal().prop( 'onOpen' ).name ).toEqual( 'handleOpen' );
    expect( modal().prop( 'onClose' ).name ).toEqual( 'handleClose' );

    // open the modal, i.e., call handleOpen
    modal().prop( 'onOpen' )();
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( true );
  } );

  it.skip( 'renders the correct TriggerComponent and props', () => {
    const wrapper = mount( Component );
    const modal = wrapper.find( 'Modal' );
    const trigger = mount( modal.prop( 'trigger' ) );

    expect( wrapper.prop( 'type' ) ).toEqual( props.type );
    expect( trigger.name() ).toEqual( 'PressPackageItem' );
    expect( trigger.prop( 'file' ) ).toEqual( normalizedDocFile );
    expect( trigger.prop( 'handleClick' ).name ).toEqual( 'handleOpen' );
  } );

  it.skip( 'renders the correct Modal Content', () => {
    const wrapper = mount( Component );
    const modal = () => wrapper.find( 'Modal' );

    // open the modal
    modal().prop( 'onOpen' )();
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( true );

    const contentComponent = modal().find( 'Document' );

    expect( contentComponent.exists() ).toEqual( true );
    expect( contentComponent.prop( 'isAdminPreview' ) ).toEqual( true );
    expect( contentComponent.prop( 'item' ) ).toEqual( {
      type: 'document',
      id: props.file.id,
      published: '',
      modified: props.file.updatedAt,
      created: props.file.createdAt,
      author: '',
      owner: '',
      site: '',
      title: props.file.title,
      content: props.file.content,
      logo: 'DosSeal',
      language: props.file.language,
      documentUrl: props.file.url,
      documentUse: props.file.use.name,
      tags: [
        { id: 'ck2lzgu500rgb0720scmree6q', name: 'business and entrepreneurship' },
        { id: 'ck2lzgu5b0rho07207cqfeya0', name: 'armed conflict' },
      ],
    } );
  } );
} );
