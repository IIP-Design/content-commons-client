import { mount } from 'enzyme';
import MetaTerms from './MetaTerms';

const props = {
  unitId: 'c7203k1',
  terms: [
    {
      definition: 'xyz-file',
      displayName: 'File Name',
      name: 'file-name',
    },
    {
      definition: 'abc-file',
      displayName: 'Release Type',
      name: 'release-type',
    },
  ],
};

const Component = <MetaTerms { ...props } />;

describe( '<MetaTerms />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct id attribute value', () => {
    const wrapper = mount( Component );
    const dt = wrapper.find( 'dt' );
    const { unitId } = props;

    dt.forEach( ( el, i ) => {
      const { name } = props.terms[i];

      expect( el.prop( 'id' ) ).toEqual( `${name}-${unitId}` );
    } );
  } );

  it( 'renders the correct aria-labelledby attribute value', () => {
    const wrapper = mount( Component );
    const dd = wrapper.find( 'dd' );
    const { unitId } = props;

    dd.forEach( ( el, i ) => {
      const { name } = props.terms[i];

      expect( el.prop( 'aria-labelledby' ) ).toEqual( `${name}-${unitId}` );
    } );
  } );

  it( 'renders the correct dt term', () => {
    const wrapper = mount( Component );
    const dt = wrapper.find( 'dt' );

    dt.forEach( ( el, i ) => {
      const { displayName } = props.terms[i];

      expect( el.text() ).toEqual( displayName );
    } );
  } );

  it( 'renders the correct dd definition', () => {
    const wrapper = mount( Component );
    const dd = wrapper.find( 'dd' );

    dd.forEach( ( el, i ) => {
      const { definition } = props.terms[i];

      expect( el.text() ).toEqual( definition );
    } );
  } );

  it( 'renders a custom className value', () => {
    const wrapper = mount( Component );
    const dl = () => wrapper.find( 'dl' );
    const className = 'some-custom-class';

    // default
    expect( dl().hasClass( 'terms' ) ).toEqual( true );

    // set custom className
    wrapper.setProps( { className } );
    expect( dl().hasClass( `terms ${className}` ) ).toEqual( true );
  } );
} );
