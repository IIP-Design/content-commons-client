import { shallow } from 'enzyme';
import Carousel from './Carousel';

const generateComponent = num => {
  const children = [];

  // eslint-disable-next-line no-plusplus
  for ( let i = 0; i < num; i++ ) {
    const child = <div className="test" key={ i }>{ `Test ${i}` }</div>;
    children.push( child );
  }

  return <Carousel>{ children }</Carousel>;
};

describe( '<Carousel />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( generateComponent( 3 ) );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'recieves all children', () => {
    const wrapper = shallow( generateComponent( 3 ) );

    expect( wrapper.find( '.test' ) ).toHaveLength( 3 );
  } );

  it( 'applies vertical styles when passed vertical prop', () => {
    const wrapper = shallow( generateComponent( 3 ) ).setProps( { vertical: true } );
    const items = wrapper.find( '.carousel-item' );

    // Check styles on individual items
    items.forEach( item => {
      const itemStyles = item.props().style;
      expect( itemStyles ).toHaveProperty( 'width', '100%' );
      expect( itemStyles ).toHaveProperty( 'height', '32%' );
    } );
  } );

  it( 'displays a progress bar unless legend prop is set to false', () => {
    const wrapper = shallow( generateComponent( 4 ) );
    const wrapperVert = shallow( generateComponent( 4 ) ).setProps( {
      vertical: true
    } );

    // Look for presence of progress bar in both horizontal and vertical configurations
    expect( wrapper.find( '.carousel-progress-bar' ) ).toHaveLength( 1 );
    expect( wrapperVert.find( '.carousel-progress-bar' ) ).toHaveLength( 1 );

    // Confirm that progress bar is removed when legend prop is set to false
    wrapper.setProps( { legend: false } );
    wrapperVert.setProps( { legend: false } );
    expect( wrapper.find( '.carousel-progress-bar' ) ).toHaveLength( 0 );
    expect( wrapperVert.find( '.carousel-progress-bar' ) ).toHaveLength( 0 );
  } );

  it( 'only renders buttons when more than three children', () => {
    const wrapper = shallow( generateComponent( 3 ) );
    const wrapperFour = shallow( generateComponent( 4 ) );
    const wrapperVert = shallow( generateComponent( 3 ) ).setProps( {
      vertical: true
    } );
    const wrapperVertFour = shallow( generateComponent( 4 ) ).setProps( {
      vertical: true
    } );

    // Test horizontal configuration
    expect( wrapper.find( '.carousel-legend-button' ) ).toHaveLength( 0 );
    expect( wrapperFour.find( '.carousel-legend-button' ) ).toHaveLength( 2 );

    // Test vertical configuration
    expect( wrapperVert.find( '.scroll-button' ) ).toHaveLength( 0 );
    expect( wrapperVertFour.find( '.scroll-button' ) ).toHaveLength( 2 );
  } );
} );
