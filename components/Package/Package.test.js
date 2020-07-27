import { mount } from 'enzyme';
import Router from 'next/router';
import wait from 'waait';
import { normalizeItem } from 'lib/elastic/parser';
import { getPluralStringOrNot, suppressActWarning } from 'lib/utils';
import DownloadPkgFiles from 'components/admin/download/DownloadPkgFiles/DownloadPkgFiles';
import { getDateTimeTerms, normalizeDocumentItemByAPI } from './utils';
import Package from './Package';
import { packageItem } from './packageElasticMock';
import { packageItemGraph } from './packageGraphMock';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080',
  },
} ) );

jest.mock( 'components/Share/Share', () => 'share' );
jest.mock( 'components/popups/PopupTabbed', () => 'popup-tabbed' );
jest.mock( 'components/popups/PopupTrigger', () => 'popup-trigger' );
jest.mock( 'components/Package/PackageItem/PackageItem', () => 'package-item' );
jest.mock( 'components/admin/MetaTerms/MetaTerms', () => 'meta-terms' );

describe( '<Package /> (GraphQL API)', () => {
  const {
    createdAt, updatedAt, title, team, type, documents,
  } = packageItemGraph;
  const item = {
    id: 'test-123',
    published: createdAt,
    modified: updatedAt,
    team,
    type,
    title,
    documents,
  };
  const props = {
    displayAsModal: true,
    isAdminPreview: true,
    useGraphQl: true,
    item,
  };
  const Component = <Package { ...props } />;
  let wrapper;

  beforeEach( () => {
    const mockedRouter = {
      replace: jest.fn(),
    };

    Router.router = mockedRouter;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct headline', () => {
    const headline = wrapper.find( '.modal_headline' );

    expect( headline.name() ).toEqual( 'h1' );
    expect( headline.text() ).toEqual( props.item.title );
  } );

  it( 'renders the preview Notification', () => {
    const notification = wrapper.find( 'Notification' );
    const msg = 'This is a preview of your package on Content Commons.';

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'msg' ) ).toEqual( msg );
    expect( notification.prop( 'customStyles' ) )
      .toEqual( {
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        padding: '1em 1.5em',
        fontSize: '1em',
        backgroundColor: '#fdb81e',
      } );
  } );

  it.skip( 'renders the MetaTerms', () => {
    const metaTerms = wrapper.find( 'MetaTerms' );
    const { published, modified } = props.item;
    const terms = getDateTimeTerms( published, modified, 'LT, l' );

    expect( metaTerms.exists() ).toEqual( true );
    expect( metaTerms.prop( 'className' ) ).toEqual( 'date-time' );
    expect( metaTerms.prop( 'unitId' ) ).toEqual( props.item.id );
    expect( metaTerms.prop( 'terms' )[0].displayName ).toEqual( 'Updated' );
    expect( metaTerms.prop( 'terms' )[0].name ).toEqual( 'Updated' );
    expect( mount( metaTerms.prop( 'terms' )[0].definition ) )
      .toEqual( mount( terms[0].definition ) );
  } );

  it.skip( 'renders Share PopupTrigger', () => {
    const triggers = wrapper.find( 'PopupTrigger' );
    const shareTrigger = triggers.findWhere( n => n.prop( 'tooltip' ) === 'Share package' );
    const content = mount( shareTrigger.prop( 'content' ) );
    const share = content.find( 'Share' );

    expect( shareTrigger.exists() ).toEqual( true );
    expect( shareTrigger.prop( 'show' ) ).toEqual( true );
    expect( shareTrigger.prop( 'icon' ) ).toEqual( {
      img: 'image-stub',
      dim: 18,
    } );
    expect( content.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'Popup' );
    expect( content.prop( 'title' ) ).toEqual( 'Share this package.' );
    expect( share.exists() ).toEqual( true );
    expect( share.props() ).toEqual( {
      id: props.item.id,
      isPreview: props.isAdminPreview,
      language: 'en-us',
      link: 'The direct link to the package will appear here.',
      site: props.item.site,
      title: props.item.title,
      type: 'package',
    } );
  } );

  it.skip( 'renders Download PopupTrigger', () => {
    const triggers = wrapper.find( 'PopupTrigger' );
    const downloadTrigger = triggers.findWhere( n => n.prop( 'tooltip' ) === getPluralStringOrNot( documents, 'Download file' ) );
    const content = mount( downloadTrigger.prop( 'content' ) );
    const downloadTab = content.find( 'PopupTabbed' );
    const pane = downloadTab.prop( 'panes' )[0];

    expect( downloadTrigger.exists() ).toEqual( true );
    expect( downloadTrigger.prop( 'position' ) ).toEqual( 'right' );
    expect( downloadTrigger.prop( 'show' ) ).toEqual( true );
    expect( downloadTrigger.prop( 'icon' ) ).toEqual( {
      img: 'image-stub',
      dim: 18,
    } );
    expect( content.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'PopupTabbed' );
    expect( content.prop( 'title' ) )
      .toEqual( getPluralStringOrNot( documents, 'Package File' ) );
    expect( downloadTab.exists() ).toEqual( true );
    expect( downloadTab.prop( 'title' ) )
      .toEqual( getPluralStringOrNot( documents, 'Package File' ) );
    expect( pane.title )
      .toEqual( getPluralStringOrNot( documents, 'Document' ) );
    expect( mount( pane.component ) ).toEqual( mount(
      <DownloadPkgFiles
        files={ documents }
        isPreview={ props.isAdminPreview }
        instructions={ getPluralStringOrNot( documents, 'Download Package File' ) }
      />,
    ) );
  } );

  it( 'renders correct file count for file downloads', () => {
    const fileCountElem = wrapper.find( '.file-count' );
    const visuallyHidden = fileCountElem.find( 'VisuallyHidden' );

    expect( fileCountElem.text() )
      .toEqual( ` (${props.item.documents.length}) documents in this package` );
    expect( visuallyHidden.exists() ).toEqual( true );
  } );

  it.skip( 'renders the correct PackageItems', () => {
    const packageItems = wrapper.find( 'PackageItem' );

    expect( packageItems.exists() ).toEqual( true );
    expect( packageItems ).toHaveLength( props.item.documents.length );
    packageItems.forEach( ( pkgItem, i ) => {
      const file = props.item.documents[i];
      const { useGraphQl } = props;

      expect( pkgItem.prop( 'type' ) ).toEqual( 'DAILY_GUIDANCE' );
      expect( pkgItem.prop( 'isAdminPreview' ) )
        .toEqual( props.isAdminPreview );
      expect( pkgItem.prop( 'file' ) )
        .toEqual( normalizeDocumentItemByAPI( { file, useGraphQl } ) );
    } );
  } );

  it( 'does not call updateUrl on mount', () => {
    mount( Component );

    // updateUrl returns Router.replace call
    expect( Router.router.replace ).not.toHaveBeenCalled();
  } );
} );

describe( '<Package /> (Elastic API)', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  const props = {
    displayAsModal: true,
    isAdminPreview: false,
    useGraphQl: false,
    item: normalizeItem( packageItem[0], 'en-us' ),
  };
  const Component = <Package { ...props } />;
  let wrapper;

  beforeEach( () => {
    const mockedRouter = {
      replace: jest.fn(),
    };

    Router.router = mockedRouter;
    wrapper = mount( Component );
  } );

  it.skip( 'renders initial loading state without crashing', () => {
    const loader = wrapper.find( 'Loader' );

    expect( wrapper.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( 'Loading...' ) ).toEqual( true );
  } );

  it( 'renders the correct headline', () => {
    const headline = wrapper.find( '.modal_headline' );

    expect( headline.name() ).toEqual( 'h1' );
    expect( headline.text() ).toEqual( props.item.title );
  } );

  it( 'does not render the preview Notification', () => {
    const notification = wrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( false );
  } );

  it.skip( 'renders the MetaTerms', () => {
    const metaTerms = wrapper.find( 'MetaTerms' );
    const { published, modified } = props.item;
    const terms = getDateTimeTerms( published, modified, 'LT, l' );

    expect( metaTerms.exists() ).toEqual( true );
    expect( metaTerms.prop( 'className' ) ).toEqual( 'date-time' );
    expect( metaTerms.prop( 'unitId' ) ).toEqual( props.item.id );
    expect( metaTerms.prop( 'terms' )[0].displayName ).toEqual( 'Updated' );
    expect( metaTerms.prop( 'terms' )[0].name ).toEqual( 'Updated' );
    expect( mount( metaTerms.prop( 'terms' )[0].definition ) )
      .toEqual( mount( terms[0].definition ) );
  } );

  it.skip( 'renders Share PopupTrigger', () => {
    const triggers = wrapper.find( 'PopupTrigger' );
    const shareTrigger = triggers.findWhere( n => n.prop( 'tooltip' ) === 'Share package' );
    const content = mount( shareTrigger.prop( 'content' ) );
    const share = content.find( 'Share' );

    expect( shareTrigger.exists() ).toEqual( true );
    expect( shareTrigger.prop( 'show' ) ).toEqual( true );
    expect( content.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'Popup' );
    expect( content.prop( 'title' ) ).toEqual( 'Share this package.' );
    expect( share.exists() ).toEqual( true );
    expect( share.props() ).toEqual( {
      id: props.item.id,
      isPreview: props.isAdminPreview,
      language: 'en-us',
      link: 'The direct link to the package will appear here.',
      site: props.item.site,
      title: props.item.title,
      type: 'package',
    } );
  } );

  it.skip( 'renders Download PopupTrigger', () => {
    const triggers = wrapper.find( 'PopupTrigger' );
    const { documents } = props.item;
    const downloadTrigger = triggers.findWhere( n => n.prop( 'tooltip' ) === getPluralStringOrNot( documents, 'Download file' ) );
    const content = mount( downloadTrigger.prop( 'content' ) );
    const downloadTab = content.find( 'PopupTabbed' );
    const pane = downloadTab.prop( 'panes' )[0];

    expect( downloadTrigger.exists() ).toEqual( true );
    expect( downloadTrigger.prop( 'position' ) ).toEqual( 'right' );
    expect( downloadTrigger.prop( 'show' ) ).toEqual( true );
    expect( content.exists() ).toEqual( true );
    expect( content.name() ).toEqual( 'PopupTabbed' );
    expect( content.prop( 'title' ) )
      .toEqual( getPluralStringOrNot( documents, 'Package File' ) );
    expect( downloadTab.exists() ).toEqual( true );
    expect( downloadTab.prop( 'title' ) )
      .toEqual( getPluralStringOrNot( documents, 'Package File' ) );
    expect( pane.title )
      .toEqual( getPluralStringOrNot( documents, 'Document' ) );
    // expect( mount( pane.component ) ).toEqual( mount(
    //   <DownloadPkgFiles
    //     files={ documents }
    //     isPreview={ props.isAdminPreview }
    //     instructions={ getPluralStringOrNot( documents, 'Download Package File' ) }
    //   />
    // ) );
  } );

  it( 'renders correct file count for file downloads', () => {
    const fileCountElem = wrapper.find( '.file-count' );
    const visuallyHidden = fileCountElem.find( 'VisuallyHidden' );

    expect( fileCountElem.text() )
      .toEqual( ` (${props.item.documents.length}) documents in this package` );
    expect( visuallyHidden.exists() ).toEqual( true );
  } );

  it.skip( 'renders the correct PackageItems', async () => {
    await wait( 0 );
    wrapper.update();
    // const packageItems = wrapper.find( 'PackageItem' );

    // expect( packageItems.exists() ).toEqual( true );
    // expect( packageItems ).toHaveLength( props.item.documents.length );
    // packageItems.forEach( ( pkgItem, i ) => {
    //   const file = props.item.documents[i];
    //   const { useGraphQl } = props;
    //   expect( pkgItem.prop( 'type' ) ).toEqual( 'package' );
    //   expect( pkgItem.prop( 'isAdminPreview' ) )
    //     .toEqual( props.isAdminPreview );
    //   expect( pkgItem.prop( 'file' ) )
    //     .toEqual( normalizeDocumentItemByAPI( { file, useGraphQl } ) );
    // } );
  } );

  it.skip( 'calls updateUrl on mount', () => {
    mount( Component );
    const { id, site } = props.item;
    const url = `/package?id=${id}&site=${site}&language=en-us`;

    // updateUrl returns Router.replace call
    expect( Router.router.replace ).toHaveBeenCalledWith( url );
  } );
} );
