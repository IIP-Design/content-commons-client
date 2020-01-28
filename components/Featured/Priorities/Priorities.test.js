import { shallow } from 'enzyme';
import { PrioritiesUnconnected } from './Priorities';

const propsArray = [
  {
    featured: {
      loading: false,
      error: false
    },
    priorities: [
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
        type: 'video',
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
        type: 'video'
      }
    ],
    categories: [
      { key: 'MlqWJ2MBNxuyMP4E6Cj2', display_name: 'Democracy' },
      { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' }
    ],
    term: 'test',
    label: 'Test Label',
    locale: 'en-us'
  },
  {
    featured: {
      loading: false,
      error: false
    },
    priorities: [
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
        type: 'post'
      }
    ],
    categories: [
      { key: 'MlqWJ2MBNxuyMP4E6Cj2', display_name: 'Democracy' },
      { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' }
    ],
    term: 'test',
    label: 'Test Label',
    locale: 'en-us'
  },
  {
    featured: {
      loading: false,
      error: true
    },
    priorities: [
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
        type: 'post'
      }
    ],
    categories: [
      { key: 'MlqWJ2MBNxuyMP4E6Cj2', display_name: 'Democracy' },
      { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' }
    ],
    term: 'test',
    label: 'Test Label',
    locale: 'en-us'
  },
  {
    featured: {
      loading: false,
      error: false
    },
    priorities: [
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
        type: 'video'
      }
    ],
    categories: [
      { key: 'MlqWJ2MBNxuyMP4E6Cj2', display_name: 'Democracy' },
      { key: 'lLWWJ2MBCLPpGnLD5z8X', display_name: 'Human Rights' }
    ],
    term: 'test',
    label: 'Test Label',
    locale: 'en-us'
  }
];

jest.mock( 'components/Video/Video', () => 'Video' );
jest.mock( 'components/Post/Post', () => 'Post' );

propsArray.forEach( props => {
  const Component = <PrioritiesUnconnected { ...props } />;

  describe( '<Priorities />', () => {
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
    if ( props.priorities.length < 3 ) {
      it( 'renders an empty div when less than 3 entries', () => {
        const wrapper = shallow( Component );
        expect( wrapper.html() ).toBe( '<div></div>' );
      } );
    } else if ( props.priorities.length >= 3 ) {
      it( 'renders component as a section', () => {
        const wrapper = shallow( Component );
        expect( wrapper.name() ).toEqual( 'section' );
      } );
      it( 'renders a section with classname priorities', () => {
        const wrapper = shallow( Component );
        expect( wrapper.hasClass( 'priorities' ) ).toEqual( true );
      } );
      it( 'renders the correct postType component', () => {
        const wrapper = shallow( Component );
        const modalContent = wrapper.find( 'ModalContent' );

        modalContent.forEach( ( mc, i ) => {
          const component = mc.find( props.priorities[i].type.charAt( 0 ).toUpperCase() + props.priorities[i].type.slice( 1 ) );

          expect( mc.exists() ).toEqual( true );
          expect( component.exists() ).toEqual( true );
          expect( mc.childAt( 0 ) ).toEqual( component );
        } );
      } );
      it( 'renders the correct header', () => {
        const wrapper = shallow( Component );
        const header = wrapper.find( 'Header' );

        expect( header.exists() ).toEqual( true );
        expect( header.childAt( 0 ).text() ).toBe( `Department Priority: ${props.label}` );
      } );
      it( 'renders two items on the right starting at index 1', () => {
        const wrapper = shallow( Component );
        const items = wrapper.find( 'ItemGroup Modal' );

        expect( items.exists() ).toEqual( true );
        expect( items.length ).toEqual( 2 );
        items.forEach( ( item, i ) => {
          const trigger = item.prop( 'trigger' );
          if ( i === 0 ) {
            expect( shallow( trigger ).contains( 'The Second Title' ) ).toEqual( true );
          } else {
            expect( shallow( trigger ).contains( 'The Third Title' ) ).toEqual( true );
          }
        } );
      } );
      it( 'renders no more than 3 categories', () => {
        const wrapper = shallow( Component );
        const items = wrapper.find( 'ItemGroup Modal' );

        expect( items.exists() ).toEqual( true );
        items.forEach( item => {
          const trigger = item.prop( 'trigger' );
          expect( shallow( trigger ).find( 'span.categories' ).exists() ).toEqual( true );
          expect( shallow( trigger ).find( 'span.categories' ).text().split( ' · ' ).length ).toBeLessThanOrEqual( 3 );
        } );
      } );
      it( 'renders the Browse All link and the correct href', () => {
        const wrapper = shallow( Component );
        const link = wrapper.find( 'Link' );

        expect( link.exists() ).toEqual( true );
        expect( link.find( 'a' ).text() ).toBe( 'Browse All' );
        expect( link.find( 'a' ).hasClass( 'browseAll' ) ).toEqual( true );
        expect( link.prop( 'href' ).pathname ).toBe( '/results' );
        link.prop( 'href' ).query.term.forEach( t => {
          expect( t ).toBe( props.term );
        } );
      } );
    }
  } );
} );
