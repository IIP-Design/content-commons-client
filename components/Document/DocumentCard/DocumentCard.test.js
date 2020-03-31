import { mount } from 'enzyme';
import moment from 'moment';
import { act } from 'react-dom/test-utils';
import { normalizeDocumentItemByAPI } from 'components/Package/utils.js';
import DocumentCard from './DocumentCard';

jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: { REACT_APP_PUBLIC_API: 'http://localhost:8080' } } ) );
jest.mock(
  'components/InternalUseDisplay/InternalUseDisplay',
  () => function InternalUseDisplay() { return ''; }
);
jest.mock(
  'components/MediaObject/MediaObject',
  () => function MediaObject() { return ''; }
);
jest.mock(
  'components/admin/MetaTerms/MetaTerms',
  () => function MetaTerms() { return ''; }
);
jest.mock(
  'components/modals/ModalPostTags/ModalPostTags',
  () => function TagsList() { return ''; }
);
jest.mock(
  'react-markdown',
  () => function ReactMarkdown() { return ''; }
);
jest.mock(
  '../Document',
  () => function Document() { return ''; }
);
jest.mock(
  'lib/browser', () => ( {
    hasCssSupport: jest.fn( () => true )
  } )
);

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
    excerpt: '<p>A statement provides the official U.S. policy/view or comment on a particular foreign policy issue usually in the name of the Spokesperson, Deputy Spokesperson, and sometimes from the Secretary of State.</p>',
    content: {
      id: 'ck391csz01yrw07205d7xr8iw',
      rawText: 'U.S. DEPARTMENT OF STATE Office of the Spokesperson For Immediate Release Statement by ROBERT PALLADINO, DEPUTY SPOKESPERSON Month Date, 2018 100th Anniversary of the U.S.-Canada Boundary Waters Treaty &lt;Not in CAPS&gt; A statement provides the official U.S. policy/view or comment on a particular foreign policy issue usually in the name of the Spokesperson, Deputy Spokesperson, and sometimes from the Secretary of State.',
      html: '<p>U.S. DEPARTMENT OF STATE</p><p>Office of the Spokesperson</p><p>For Immediate Release </p><p>Statement by ROBERT PALLADINO, DEPUTY SPOKESPERSON</p><p>Month Date, 2018</p><p>100th Anniversary of the U.S.-Canada Boundary Waters Treaty &lt;Not in CAPS&gt;</p><p>A statement provides the official U.S. policy/view or comment on a particular foreign policy issue usually in the name of the Spokesperson, Deputy Spokesperson, and sometimes from the Secretary of State.</p>',
      __typename: 'DocumentConversionFormat'
    },
    use: {
      id: 'ck2wbvj6010kz0720c358mbrt',
      name: 'Department Press Briefing',
      __typename: 'DocumentUse'
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
      __typename: 'Language'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
          }
        ],
        __typename: 'Tag'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
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
              __typename: 'Language'
            },
            __typename: 'LanguageTranslation'
          }
        ],
        __typename: 'Tag'
      }
    ],
    __typename: 'DocumentFile'
  },
  handleClick: jest.fn()
};

const normalizedDocFile = normalizeDocumentItemByAPI( { file: props.file, useGraphQl: true } );

describe( '<DocumentCard />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <DocumentCard file={ normalizedDocFile } handleClick={ props.handleClick } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the article.container', () => {
    const article = wrapper.find( 'article.container' );

    expect( article.exists() ).toEqual( true );
    expect( article.prop( 'lang' ) )
      .toEqual( props.file.language.languageCode );
  } );

  it( 'renders the .document-use MediaObject', () => {
    const mediaObject = wrapper.find( 'MediaObject.document-use' );
    const body = mount( <span>{ props.file.use.name }</span> );

    expect( mediaObject.exists() ).toEqual( true );
    expect( mount( mediaObject.prop( 'body' ) ) ).toEqual( body );
    expect( mediaObject.prop( 'img' ) ).toEqual( {
      src: 'image-stub',
      alt: 'document icon',
      style: { height: '30px', width: '30px' }
    } );
  } );

  it( 'renders InternalUseDisplay', () => {
    const internalUse = wrapper.find( 'InternalUseDisplay' );
    expect( internalUse.exists() ).toEqual( true );
  } );

  it( 'renders the header and title', () => {
    const header = wrapper.find( 'header' );
    const heading = wrapper.find( 'h2' );
    const title = heading.find( '.title' );

    expect( header.name() ).toEqual( 'header' );
    expect( header.prop( 'className' ) ).toEqual( 'header' );
    expect( heading.name() ).toEqual( 'h2' );
    expect( title.name() ).toEqual( 'button' );
    expect( title.text() ).toEqual( props.file.title );
    expect( title.prop( 'id' ) )
      .toEqual( `documentCard_trigger_${props.file.id}` );
  } );

  it( 'renders the modal with correct props', () => {
    const modal = wrapper.find( 'Modal' );

    expect( modal.prop( 'open' ) ).toEqual( false );
    expect( typeof modal.prop( 'onOpen' ) ).toEqual( 'function' );
    expect( modal.prop( 'onOpen' ).name ).toEqual( 'handleOpen' );
    expect( typeof modal.prop( 'onClose' ) ).toEqual( 'function' );
    expect( modal.prop( 'onClose' ).name ).toEqual( 'handleClose' );
    expect( modal.prop( 'closeIcon' ) ).toEqual( true );
  } );

  it( 'calling handleOpen/handleClose opens/closes the modal', () => {
    const modal = () => wrapper.find( 'Modal' );

    // initially closed
    expect( modal().prop( 'open' ) ).toEqual( false );

    // open modal
    act( () => {
      modal().prop( 'onOpen' )();
    } );
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( true );

    // close modal
    act( () => {
      modal().prop( 'onClose' )();
    } );
    wrapper.update();
    expect( modal().prop( 'open' ) ).toEqual( false );
  } );

  it( 'renders the card content markup', () => {
    const content = wrapper.find( 'CardContent > div.content' );
    const contentHeightClamp = content.find( 'ContentHeightClamp' );
    const markupElem = contentHeightClamp.find( 'ReactMarkdown' );

    expect( content.exists() ).toEqual( true );
    expect( content.prop( 'className' ) ).toEqual( 'content' );
    expect( content.contains( 'Excerpt:' ) ).toEqual( true );
    expect( contentHeightClamp.exists() ).toEqual( true );
    expect( markupElem.exists() ).toEqual( true );
    expect( markupElem.prop( 'source' ) ).toEqual( props.file.excerpt );
    expect( markupElem.prop( 'escapeHtml' ) ).toEqual( false );
  } );

  it( 'renders "No excerpt available" if !excerpt', () => {
    wrapper.setProps( {
      file: {
        ...props.file,
        excerpt: ''
      }
    } );
    const content = wrapper.find( 'CardContent > div.content' );
    const markupElem = content.find( 'div.excerpt' );
    const excerpt = <p>No excerpt available</p>;

    expect( content.exists() ).toEqual( true );
    expect( content.prop( 'className' ) ).toEqual( 'content' );
    expect( content.contains( 'Excerpt:' ) ).toEqual( false );
    expect( markupElem.exists() ).toEqual( false );
    expect( content.contains( excerpt ) ).toEqual( true );
  } );

  it( 'renders footer', () => {
    const footer = wrapper.find( 'CardMeta > .meta' );

    expect( footer.exists() ).toEqual( true );
    expect( footer.name() ).toEqual( 'footer' );
  } );

  it( 'renders footer > MetaTerms', () => {
    const metaTerms = wrapper.find( 'CardMeta MetaTerms' );

    const { id, createdAt, updatedAt } = props.file;
    const isUpdated = updatedAt > createdAt;
    const label = isUpdated ? 'Updated' : 'Created';
    const dateTime = isUpdated ? updatedAt : createdAt;
    const formattedDateTime = moment( dateTime ).format( 'LL' );
    const timeElement = mount( <time dateTime={ dateTime }>{ formattedDateTime }</time> );
    const { definition, displayName, name } = metaTerms.prop( 'terms' )[0];

    expect( metaTerms.exists() ).toEqual( true );
    expect( metaTerms.prop( 'className' ) ).toEqual( 'date-time' );
    expect( metaTerms.prop( 'unitId' ) ).toEqual( id );
    expect( displayName ).toEqual( label );
    expect( name ).toEqual( label );
    expect( mount( definition ) ).toEqual( timeElement );
  } );

  it( 'renders footer > TagsList', () => {
    const tagsList = wrapper.find( 'CardMeta TagsList' );

    expect( tagsList.exists() ).toEqual( true );
    expect( tagsList.prop( 'tags' ) ).toEqual( [
      {
        id: 'ck2lzgu500rgb0720scmree6q',
        name: 'business and entrepreneurship'
      },
      {
        id: 'ck2lzgu5b0rho07207cqfeya0',
        name: 'armed conflict'
      }
    ] );
  } );

  it( 'does not render footer > TagsList if !tags', () => {
    wrapper.setProps( {
      ...props,
      file: {
        ...props.file.tags,
        tags: []
      }
    } );
    const tagsList = wrapper.find( 'CardMeta TagsList' );

    expect( tagsList.exists() ).toEqual( false );
  } );

  it( 'renders footer > MediaObject', () => {
    const mediaObject = wrapper.find( 'CardMeta MediaObject' );
    const body = mount( <span>U.S. Department of State</span> );

    expect( mediaObject.exists() ).toEqual( true );
    expect( mediaObject.prop( 'className' ) ).toEqual( 'seal' );
    expect( mount( mediaObject.prop( 'body' ) ) ).toEqual( body );
    expect( mediaObject.prop( 'img' ) ).toEqual( {
      src: 'image-stub',
      alt: 'U.S. Department of State seal'
    } );
  } );
} );
