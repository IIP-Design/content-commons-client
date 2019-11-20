import { shallow } from 'enzyme';
import { Recents } from './Recents';

const propsArray = [
  {
    featured: {
      loading: false,
      error: false
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The First Title',
        type: 'video'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The Second Title',
        type: 'video'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image3.jpg',
        icon: 'https://www.icon.com/image3.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' }
        ],
        title: 'The Third Title',
        type: 'video'
      }
    ],
    postType: 'video',
    postTypeLabels: [
      { key: 'video', display_name: 'Video' },
      { key: 'post', display_name: 'Article' }
    ],
    label: 'Test Label'
  },
  {
    featured: {
      loading: false,
      error: false
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The First Title',
        type: 'post'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The Second Title',
        type: 'post'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image3.jpg',
        icon: 'https://www.icon.com/image3.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' }
        ],
        title: 'The Third Title',
        type: 'post'
      }
    ],
    postType: 'post',
    postTypeLabels: [
      { key: 'video', display_name: 'Video' },
      { key: 'post', display_name: 'Article' }
    ],
    label: 'Test Label'
  },
  {
    featured: {
      loading: false,
      error: true
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The First Title',
        type: 'post'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The Second Title',
        type: 'post'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image3.jpg',
        icon: 'https://www.icon.com/image3.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' }
        ],
        title: 'The Third Title',
        type: 'post'
      }
    ],
    postType: 'post',
    postTypeLabels: [
      { key: 'video', display_name: 'Video' },
      { key: 'post', display_name: 'Article' }
    ],
    label: 'Test Label'
  },
  {
    featured: {
      loading: false,
      error: false
    },
    recents: [
      {
        thumbnail: 'https://www.thumbnail.com/image1.jpg',
        icon: 'https://www.icon.com/image1.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The First Title',
        type: 'post'
      },
      {
        thumbnail: 'https://www.thumbnail.com/image2.jpg',
        icon: 'https://www.icon.com/image2.jpg',
        categories: [
          { id: 'MlqWJ2MBNxuyMP4E6Cj2', name: 'democracy' },
          { id: 'lLWWJ2MBCLPpGnLD5z8X', name: 'human rights' },
          { id: 'crWWJ2MBCLPpGnLD3D8Y', name: 'transparency' },
          { id: 'mbWWJ2MBCLPpGnLD6D-X', name: 'media & press' }
        ],
        title: 'The Second Title',
        type: 'post'
      }
    ],
    postType: 'post',
    postTypeLabels: [
      { key: 'video', display_name: 'Video' },
      { key: 'post', display_name: 'Article' }
    ],
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
      it( 'renders the correct postType component', () => {
        const wrapper = shallow( Component );
        const modalContent = wrapper.find( 'ModalContent' );

        modalContent.forEach( mc => {
          const component = mc.find( props.postType.charAt(0).toUpperCase() + props.postType.slice( 1 ) );

          expect( mc.exists() ).toEqual( true );
          expect( component.exists() ).toEqual( true );
          expect( mc.childAt(0) ).toEqual( component );
        } );
      } );
    }
  } );
} );
