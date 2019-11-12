import { shallow } from 'enzyme';
import { Recents } from './Recents';

const propsArray = [
  {
    featured: {
      error: false
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [],
        title: 'The First Title'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [],
        title: 'The Second Title'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image3.jpg',
        icon: 'https://www.icon.com/image3.jpg',
        categories: [],
        title: 'The Third Title'
      }
    ],
    postTypeLabels: ['Video', 'Article'],
    label: 'Test Label'
  },
  {
    featured: {
      error: true
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [],
        title: 'The First Title'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [],
        title: 'The Second Title'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image3.jpg',
        icon: 'https://www.icon.com/image3.jpg',
        categories: [],
        title: 'The Third Title'
      }
    ],
    postTypeLabels: ['Video', 'Article'],
    label: 'Test Label'
  },
  {
    featured: {
      error: false
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [],
        title: 'The First Title'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [],
        title: 'The Second Title'
      }
    ],
    postTypeLabels: ['Video', 'Article'],
    label: 'Test Label'
  },
];

jest.mock( 'components/Video/Video', () => 'Video' );
jest.mock( 'components/Post/Post', () => 'Post' );

propsArray.forEach( props => {
  const Component = <Recents { ...props } />;

  describe( '<Recents />', () => {
    it( 'renders without crashing', () => {
      const wrapper = shallow( Component );
      expect( wrapper.exists() ).toEqual( true );
    } );
    it( 'correctly displays error message if one exists', () => {
      const wrapper = shallow( Component );
      const errorText = wrapper.find( 'Message' );
      if ( props.featured.error ) {
        expect( errorText.exists() ).toEqual( true );
      } else {
        expect( errorText.exists() ).toEqual( false );
      }
    } );
    if ( props.recents.length < 3 ) {
      it( 'renders an empty div when less than 3 entries', () => {
        const wrapper = shallow( Component );
        expect( wrapper.html() ).toBe( '<div></div>' );
      } );
    } else if ( props.recents.length >= 3 ) {
      it( 'renders component as a section', () => {
        const wrapper = shallow( Component );
        expect( wrapper.name() ).toEqual( 'section' );
      } );
      it( 'renders a section with classname recents', () => {
        const wrapper = shallow( Component );
        expect( wrapper.hasClass( 'recents' ) ).toEqual( true );
      } );
    }
  } );
} );
