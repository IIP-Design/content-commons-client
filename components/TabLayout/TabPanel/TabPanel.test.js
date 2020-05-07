import { mount } from 'enzyme';

import TabPanel from './TabPanel';

const props = {
  title: 'Test title',
  content: <div id="test">Test content</div>
};

describe( 'TabPanel', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( <TabPanel { ...props } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'renders provided content', () => {
    const wrapper = mount( <TabPanel { ...props } /> );
    const testContent = wrapper.find( '#test' );

    expect( testContent.exists() ).toEqual( true );
    expect( testContent.text() ).toEqual( 'Test content' );
  } );
} );
