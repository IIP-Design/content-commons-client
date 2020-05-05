import { mount } from 'enzyme';

import GraphicProject from './GraphicProject';
import { graphicGraphqlMock } from './graphicGraphqlMock';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080'
  }
} ) );

jest.mock( 'context/authContext', () => ( {
  useAuth: jest.fn( () => ( { user: { firstName: 'user' } } ) )
} ) );

const props = {
  displayAsModal: true,
  isAdminPreview: false,
  item: graphicGraphqlMock,
  useGraphQl: true
};

const Component = <GraphicProject { ...props } />;

describe( 'GraphicProject', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'only shows preview notification it isAdminPreview prop is set to true', () => {
    const previewMsg = 'This is a preview of your graphics project on Content Commons.';
    const wrapper = mount( Component );

    expect( wrapper.find( 'Notification' ) ).toHaveLength( 0 );

    wrapper.setProps( { isAdminPreview: true } );
    wrapper.find( 'Notification' );
    expect( wrapper.find( 'Notification' ) ).toHaveLength( 1 );
    expect( wrapper.contains( previewMsg ) ).toEqual( true );
  } );
} );
