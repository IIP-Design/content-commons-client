import { mount } from 'enzyme';
import GraphicProject from './GraphicProject';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080'
  }
} ) );

const Component = <GraphicProject />;

describe( 'GraphicProject', () => {
  const wrapper = mount( Component );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
