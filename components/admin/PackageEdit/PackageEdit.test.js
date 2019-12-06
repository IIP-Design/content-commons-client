import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';
import PackageEdit from './PackageEdit';
import { mocks, props } from './mocks';

// name with hyphens to address "incorrect casing" warning
jest.mock( 'next/dynamic', () => () => 'Press-Package-File' );
jest.mock(
  'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsFormContainer',
  () => function PackageDetailsFormContainer() { return ''; }
);

const Component = (
  <MockedProvider mocks={ mocks }>
    <PackageEdit { ...props } />
  </MockedProvider>
);

describe( '<PackageEdit />', () => {
  const getBtn = ( str, buttons ) => (
    buttons.findWhere( n => n.text() === str )
  );

  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the header buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const btnTxt = ['Delete All', 'Save & Exit', 'Publish'];

    btnTxt.forEach( txt => {
      expect( getBtn( txt, btns ).exists() ).toEqual( true );
    } );
  } );

  it( 'renders the package title field', () => {
    const wrapper = mount( Component );
    const titleLabel = wrapper.find( 'label[htmlFor="title"]' );
    const titleInput = wrapper.find( 'input#title' );
    const { title } = mocks[0].result.data.package;

    expect( titleLabel.text() ).toEqual( 'Title' );
    expect( titleInput.prop( 'value' ) ).toEqual( title );
  } );

  it( 'renders the package type field', () => {
    const wrapper = mount( Component );
    const typeLabel = wrapper.find( 'label[htmlFor="type"]' );
    const typeInput = wrapper.find( 'input#type' );
    const { type } = mocks[0].result.data.package;

    expect( typeLabel.text() ).toEqual( 'Package Type' );
    expect( typeInput.prop( 'value' ) ).toEqual( type );
  } );

  it.skip( 'clicking the Delete All button opens the Confirm modal', () => {
    const wrapper = mount( Component );
    const deleteBtn = wrapper.find( 'Button.edit-package__btn--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );
  } );

  it.skip( 'clicking Cancel in <Confirm /> closes the modal', () => {
    const wrapper = mount( Component );
    const deleteBtn = wrapper.find( 'Button.edit-package__btn--delete' );
    const confirmModal = () => wrapper.find( 'Confirm' );
    const cancelBtn = () => wrapper.find( '[content="No, take me back"]' );

    // closed initially
    expect( confirmModal().prop( 'open' ) ).toEqual( false );

    // open the modal
    deleteBtn.simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( true );

    // close the modal
    cancelBtn().simulate( 'click' );
    expect( confirmModal().prop( 'open' ) ).toEqual( false );
  } );
} );
