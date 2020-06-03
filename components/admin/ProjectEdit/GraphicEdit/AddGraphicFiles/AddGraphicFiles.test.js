import { mount } from 'enzyme';
import AddGraphicFiles from './AddGraphicFiles';
import { normalize } from 'lib/graphql/normalizers/graphic';

jest.mock(
  'components/admin/EditFileGrid/EditFileGrid',
  () => function EditFileGrid() { return ''; },
);

const props = {
  files: [{ name: 'coffee.jpg' }],
  closeModal: jest.fn(),
  save: jest.fn(),
};

describe( '<AddGraphicFiles />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <AddGraphicFiles { ...props } />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the EditFileGrid', () => {
    const editFileGrid = wrapper.find( 'EditFileGrid' );

    expect( editFileGrid.exists() ).toEqual( true );
    expect( editFileGrid.prop( 'files' ) ).toEqual( normalize( props.files ) );
  } );
} );
