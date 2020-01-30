import { shallow } from 'enzyme';
import { FeaturedUnconnected } from './Featured';

const props1 = {
  data: [
    {
      key: 'key1',
      component: 'priorities',
      order: 1,
      props: {
        term: 'test',
        label: 'Test',
        categories: [],
        locale: 'en-us'
      }
    },
    {
      key: 'key2',
      component: 'recents',
      order: 2,
      props: {
        postType: 'video',
        locale: 'en-us'
      }
    }
  ]
};

const props2 = {
  data: []
};

jest.mock( './Priorities/Priorities', () => 'Priorities' );
jest.mock( './Recents/Recents', () => 'Recents' );

const Component1 = <FeaturedUnconnected { ...props1 } />;
const Component2 = <FeaturedUnconnected { ...props2 } />;

describe( '<FeaturedUnconnected />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component1 );
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a div with classname featured', () => {
    const wrapper = shallow( Component1 );
    expect( wrapper.hasClass( 'featured' ) ).toEqual( true );
  } );

  it( 'renders the correct components based on data', () => {
    const wrapper = shallow( Component1 );
    let componentCopy;
    props1.data.forEach( d => {
      componentCopy = wrapper.find( d.component.charAt( 0 ).toUpperCase() + d.component.slice( 1 ) );
      expect( componentCopy.exists() ).toEqual( true );
    } );
  } );

  it( 'renders an empty div when no data', () => {
    const wrapper = shallow( Component2 );
    expect( wrapper.html() ).toBe( '<div></div>' );
  } );
} );
