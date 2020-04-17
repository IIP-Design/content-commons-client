import { shallow, mount } from 'enzyme';
import Document from './Document';
import documentItem from './documentMock';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {
    REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url',
    REACT_APP_PUBLIC_API: 'http://localhost:8080'
  }
} ) );

const props = {
  isAdminPreview: true,
  displayAsModal: true,
  item: {...documentItem}
};

const Component = <Document { ...props } />;

describe( 'Document', () => {
  const wrapper = mount( Component );

  it( 'renders without crashing', () => {    
    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders the correct headline', () => {
    const headline = wrapper.find( '.modal_headline' );
    expect( headline.text() ).toEqual( props.item.title );
  } );

  it( 'renders the preview Notification', () => {
    const notification = wrapper.find( 'Notification' );
    const msg = 'This is a preview of your file on Content Commons.';

    expect( notification.exists() ).toEqual( true );
    expect( notification.prop( 'msg' ) ).toEqual( msg );
  } );

} );
