import { mount } from 'enzyme';
import { mocks } from 'components/admin/PackageEdit/mocks';

import DownloadPkgFiles from './DownloadPkgFiles';

jest.mock( './SignedUrlLink/SignedUrlLink', () => 'signed-url-link' );

const props = {
  files: mocks[0].result.data.pkg.documents,
  instructions: 'Download Package File(s)',
  isPreview: false,
};

describe( '<DownloadPkgFiles />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <DownloadPkgFiles { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the instructions', () => {
    const wrapper = mount( <DownloadPkgFiles { ...props } /> );

    expect( wrapper.contains( props.instructions ) ).toEqual( true );
  } );

  it( 'renders a signed url link for each file', () => {
    const wrapper = mount( <DownloadPkgFiles { ...props } /> );

    const signedUrlLinks = wrapper.find( 'signed-url-link' );

    expect( signedUrlLinks.length ).toEqual( props.files.length );
  } );

  it( 'shows the "No files to download" message if no files are present', () => {
    const msg = 'There are no files available for download at this time.';
    const newProps = { ...props, files: [] };

    const wrapper = mount( <DownloadPkgFiles { ...newProps } /> );

    expect( wrapper.contains( msg ) ).toEqual( true );
  } );

  it( 'does not show any download links when no files are present', () => {
    const newProps = { ...props, files: [] };
    const wrapper = mount( <DownloadPkgFiles { ...newProps } /> );

    const signedUrlLinks = wrapper.find( 'signed-url-link' );

    expect( signedUrlLinks.length ).toEqual( 0 );
  } );
} );
