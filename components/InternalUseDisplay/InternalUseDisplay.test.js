import { mount } from 'enzyme';
import InternalUseDisplay from './InternalUseDisplay';

const props = {
  className: 'just-another-class-name',
  // expanded: false,
  style: {
    margin: '1em 1em 0 1em',
    width: 'fit-content'
  }
};

const Component = <InternalUseDisplay { ...props } />;

describe( '<InternalUseDisplay />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the brief paragraph and message', () => {
    const wrapper = mount( Component );
    const paragraph = wrapper.find( 'p' );
    const classValue = `internal-use brief ${props.className}`;
    const msg = 'INTERNAL USE ONLY';

    expect( paragraph.prop( 'className' ) ).toEqual( classValue );
    expect( paragraph.prop( 'style' ) ).toEqual( props.style );
    expect( paragraph.text() ).toEqual( msg );
  } );

  it( 'renders the expanded paragraph and message', () => {
    const wrapper = mount( Component );
    wrapper.setProps( { expanded: true } );

    const paragraph = wrapper.find( 'p' );
    const classValue = `internal-use expanded ${props.className}`;
    const msg = 'INTERNAL USE ONLY - NOT FOR PUBLIC DISTRIBUTION';

    expect( paragraph.prop( 'className' ) ).toEqual( classValue );
    expect( paragraph.prop( 'style' ) ).toEqual( props.style );
    expect( paragraph.text() ).toEqual( msg );
  } );
} );
