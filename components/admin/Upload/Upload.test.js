import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/client/testing';
import Upload from './Upload';

jest.mock(
  'next/dynamic',
  () => function DynamicComponent() { return ''; },
);
jest.mock( 'next/config', () => () => ( { publicRuntimeConfig: {} } ) );
jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => ( {
    user: {
      id: 'ck2m042xo0rnp0720nb4gxjix',
      firstName: 'Joe',
      lastName: 'Schmoe',
      email: 'schmoej@america.gov',
      jobTitle: '',
      country: 'United States',
      city: 'Washington, DC',
      howHeard: '',
      permissions: ['EDITOR'],
      team: {
        id: 'ck2lzfx6u0hkj0720f8n8mtda',
        name: 'GPA Design & Editorial',
        contentTypes: ['GRAPHIC'],
        __typename: 'Team',
      },
      __typename: 'User',
      esToken: 'eyasdljfakljsdfklj',
    },
  } ) ),
} ) );

const Component = (
  <MockedProvider mocks={ [] }>
    <Upload />
  </MockedProvider>
);

describe( '<Upload />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct content type buttons', () => {
    const wrapper = mount( Component );
    const btns = wrapper.find( 'Button' );
    const content = [
      'Audio',
      'Videos',
      'Graphics',
      'Documents',
      'Teaching Materials',
      'Create New Package',
    ];

    expect( btns.length ).toEqual( content.length );
    btns.forEach( ( btn, i ) => {
      expect( btn.contains( content[i] ) ).toEqual( true );
    } );
  } );

  it( 'renders the modals', () => {
    const wrapper = mount( Component );
    const modals = wrapper.find( 'Modal' );

    modals.forEach( ( modal, i ) => {
      const trigger = mount( modal.prop( 'trigger' ) );

      switch ( i ) {
        case 0:
          expect( trigger.name() ).toEqual( 'Button' );
          expect( trigger.prop( 'aria-label' ) )
            .toEqual( 'Upload video content' );
          break;

        case 1:
          expect( trigger.name() ).toEqual( 'ButtonAddFiles' );
          expect( trigger.prop( 'aria-label' ) )
            .toEqual( 'Upload graphics content' );
          expect( trigger.prop( 'multiple' ) ).toEqual( true );
          expect( trigger.prop( 'accept' ) )
            .toEqual( '.png,.jpg,.jpeg,.gif,.psd,.ai,.ae,.pdf,.doc,.docx,.ttf,.otf' );
          break;

        default:
          break;
      }
    } );
  } );
} );
