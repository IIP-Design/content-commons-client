import { mount } from 'enzyme';
import PackageEdit from './PackageEdit';
import { mocks } from './PackageDetailsForm/PressPackageDetailsForm/mocks';

const Component = <PackageEdit />;

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
    const titleLabel = wrapper.find( 'label[htmlFor="packageTitle"]' );
    const titleInput = wrapper.find( 'input#packageTitle' );
    const { packageTitle } = mocks[0].result.data.packageForm;

    expect( titleLabel.text() ).toEqual( 'Title' );
    expect( titleInput.prop( 'value' ) ).toEqual( packageTitle );
  } );

  it( 'renders the package type field', () => {
    const wrapper = mount( Component );
    const typeLabel = wrapper.find( 'label[htmlFor="packageType"]' );
    const typeInput = wrapper.find( 'input#packageType' );
    const { packageType } = mocks[0].result.data.packageForm;

    expect( typeLabel.text() ).toEqual( 'Package Type' );
    expect( typeInput.prop( 'value' ) ).toEqual( packageType );
  } );
} );
