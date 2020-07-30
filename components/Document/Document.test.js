import { mount } from 'enzyme';
import Document from './Document';
import documentItem from './documentMock';

const mockSignedUrl = 'https://example.docx';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080',
  },
} ) );

jest.mock( 'lib/hooks/useSignedUrl', () => jest.fn( () => ( { signedUrl: mockSignedUrl } ) ) );

// GraphQL API
const previewProps = {
  isAdminPreview: true,
  displayAsModal: true,
  item: { ...documentItem },
};
const PreviewComponent = <Document { ...previewProps } />;
const previewWrapper = mount( PreviewComponent );

// Elastic API
const nonpreviewProps = {
  isAdminPreview: false,
  displayAsModal: true,
  item: { ...documentItem },
};
const NonPreviewComponent = <Document { ...nonpreviewProps } />;
const nonPreviewWrapper = mount( NonPreviewComponent );

describe( 'Document', () => {
  it( 'renders without crashing', () => {
    expect( previewWrapper.exists() ).toEqual( true );
  } );

  it( 'renders the preview Notification (GraphQL API)', () => {
    const notification = previewWrapper.find( 'Notification' );
    const msg = 'This is a preview of your file on Content Commons.';

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'msg' ) ).toEqual( msg );
  } );

  it( 'does not render the preview Notification w/ Elastic API', () => {
    const notification = nonPreviewWrapper.find( 'Notification' );

    expect( notification.exists() ).toEqual( false );
  } );

  it( 'renders the correct headline', () => {
    const headline = previewWrapper.find( '.modal_headline' );

    expect( headline.text() ).toEqual( previewProps.item.title );
  } );

  it( 'renders the Internal Use Only display', () => {
    const internalUseDisplay = previewWrapper.find( 'InternalUseDisplay' );

    expect( internalUseDisplay.length ).toEqual( 2 );

    let isOneExpanded = false;

    internalUseDisplay.forEach( node => {
      if ( node.prop( 'expanded' ) === true ) {
        isOneExpanded = true;
      }
    } );
    expect( isOneExpanded ).toEqual( true );
  } );

  it( 'renders Share Popup (Preview)', () => {
    const sharePopup = previewWrapper.find( 'Popover.document-project__popover--share' );

    expect( sharePopup.exists() ).toEqual( true );
  } );

  it( 'renders the Share (Non-preview)', () => {
    const sharePopup = previewWrapper.find( 'Popover.document-project__popover--share' );

    expect( sharePopup.exists() ).toEqual( true );

    // const shareTrigger = nonPreviewWrapper.findWhere( n => n.name() === 'PopupTrigger' && n.prop( 'toolTip' ) === 'Share document' );
    // expect( shareTrigger.exists() ).toEqual( true );

    // const content = mount( shareTrigger.prop( 'content' ) );
    // expect( content.exists() ).toEqual( true );
    // expect( content.name() ).toEqual( 'Popup' );
    // expect( content.prop( 'title' ) ).toEqual( 'Copy the link to share internally.' );

    // const share = content.find( 'Share' );
    // expect( share.exists() ).toEqual( true );
    // expect( share.props() ).toEqual( {
    //   id: nonpreviewProps.item.id,
    //   isPreview: nonpreviewProps.isAdminPreview,
    //   language: 'en-us',
    //   site: nonpreviewProps.item.site,
    //   title: nonpreviewProps.item.title,
    //   type: 'document',
    // } );

    // const directLink = share.find( 'ClipboardCopy' ).prop( 'copyItem' );
    // const documentLink = `http://${nonpreviewProps.item.site}/${nonpreviewProps.item.type}?id=${nonpreviewProps.item.id}&site=${nonpreviewProps.item.site}&language=en-us`;
    // expect( directLink ).toEqual( documentLink );
  } );

  it( 'renders the Download element (Preview)', () => {
    const downloadBtn = previewWrapper.findWhere( n => n.name() === 'Button' && n.prop( 'tooltip' ) === 'Not For Public Distribution' );

    expect( downloadBtn.exists() ).toEqual( true );

    const downloadURL = downloadBtn.findWhere( n => n.prop( 'href' ) === nonpreviewProps.item.documentUrl );

    expect( downloadURL.exists() ).toEqual( false );
  } );

  it( 'renders the Download element w/ url (Non-preview)', () => {
    const downloadBtn = nonPreviewWrapper.findWhere( n => n.name() === 'Button' && n.prop( 'tooltip' ) === 'Not For Public Distribution' );

    expect( downloadBtn.exists() ).toEqual( true );

    const downloadURL = downloadBtn.findWhere( n => n.prop( 'href' ) === mockSignedUrl );

    expect( downloadURL.exists() ).toEqual( true );
  } );

  it( 'renders the description (Preview)', () => {
    const desc = previewWrapper.find( 'ReactMarkdown' );

    expect( desc.prop( 'source' ) ).toEqual( previewProps.item.content.html );
  } );

  it( 'renders the description (Non-Preview)', () => {
    const desc = nonPreviewWrapper.find( 'ModalDescription' );
    const descSource = desc.find( 'ReactMarkdown' );

    expect( descSource.prop( 'source' ) ).toEqual( nonpreviewProps.item.content.html );
  } );
} );
