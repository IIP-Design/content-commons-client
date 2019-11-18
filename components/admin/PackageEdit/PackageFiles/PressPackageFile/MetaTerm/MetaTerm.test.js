import { mount } from 'enzyme';
import MetaTerm from './MetaTerm';

const props = {
  unitId: 'c7203k1',
  term: {
    definition: 'xyz-file',
    displayName: 'File Name',
    name: 'file-name'
  }
};

const Component = <dl><MetaTerm { ...props } /></dl>;

describe( '<MetaTerm />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct id attribute value', () => {
    const wrapper = mount( Component );
    const dt = wrapper.find( 'dt' );
    const { unitId } = props;
    const { name } = props.term;

    expect( dt.prop( 'id' ) ).toEqual( `${name}-${unitId}` );
  } );

  it( 'renders the correct aria-labelledby attribute value', () => {
    const wrapper = mount( Component );
    const dd = wrapper.find( 'dd' );
    const { unitId } = props;
    const { name } = props.term;

    expect( dd.prop( 'aria-labelledby' ) ).toEqual( `${name}-${unitId}` );
  } );

  it( 'renders the correct dt term', () => {
    const wrapper = mount( Component );
    const dt = wrapper.find( 'dt' );

    expect( dt.text() ).toEqual( props.term.displayName );
  } );

  it( 'renders the correct dd definition', () => {
    const wrapper = mount( Component );
    const dd = wrapper.find( 'dd' );

    expect( dd.text() ).toEqual( props.term.definition );
  } );
} );
