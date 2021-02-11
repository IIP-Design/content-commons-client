import { shallow } from 'enzyme';
import { Icon } from 'semantic-ui-react';
import UploadSuccessMsg from './UploadSuccessMsg';

const Component = <UploadSuccessMsg />;

describe( '<UploadSuccessMsg />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders a paragraph element', () => {
    const wrapper = shallow( Component );

    expect( wrapper.name() ).toEqual( 'p' );
  } );

  it( 'renders a child <Icon />', () => {
    const wrapper = shallow( Component );
    const icon = <Icon name="check circle outline" style={ { fontSize: '1.2em', fontWeight: 600 } } as="i" />;

    expect( wrapper.contains( icon ) ).toEqual( true );
  } );

  it( 'renders a "Files uploaded successfully!"', () => {
    const wrapper = shallow( Component );

    expect( wrapper.contains( 'Files uploaded successfully!' ) )
      .toEqual( true );
  } );
} );
