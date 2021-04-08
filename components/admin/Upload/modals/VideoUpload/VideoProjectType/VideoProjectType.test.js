import { mount } from 'enzyme';
import wait from 'waait';

import VideoProjectType from './VideoProjectType';

jest.mock(
  'components/ButtonAddFiles/ButtonAddFiles',
  () => function ButtonAddFiles() { return 'Add Files'; },
);

const props = {
  closeModal: jest.fn(),
  addAssetFiles: jest.fn(),
  updateModalClassname: jest.fn(),
  goNext: jest.fn(),
  accept: 'mp4',
};

const Component = <VideoProjectType { ...props } />;

describe( '<VideoProjectType />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'calls updateModalClassname on mount', () => {
    mount( Component );
    expect( props.updateModalClassname )
      .toHaveBeenCalledWith( 'upload_modal project-type-active' );
  } );

  it( 'calls updateModalClassname on unmount', async () => {
    const wrapper = mount( Component );

    wrapper.unmount();
    await wait( 2 );

    expect( props.updateModalClassname )
      .toHaveBeenCalledWith( 'upload_modal' );
  } );

  it( 'clicking the Cancel Button calls closeModal', () => {
    const wrapper = mount( Component );
    const getBtn = str => (
      wrapper.findWhere( n => n.text() === str && n.name() === 'Button' )
    );

    getBtn( 'Cancel' ).simulate( 'click' );
    wrapper.update();
    expect( props.closeModal ).toHaveBeenCalled();
  } );

  it( 'calling onChange on ButtonAddFiles calls handleOnChangeFiles, addAssetFiles, and goNext', () => {
    const wrapper = mount( Component );
    const btnAddFiles = wrapper.find( 'ButtonAddFiles' );
    const e = { target: { files: [] } };

    btnAddFiles.prop( 'onChange' )( e );
    expect( props.addAssetFiles ).toHaveBeenCalledWith( e.target.files );
    expect( props.goNext ).toHaveBeenCalled();
  } );
} );
