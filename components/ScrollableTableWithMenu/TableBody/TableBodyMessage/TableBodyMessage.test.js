import { mount } from 'enzyme';
import { Loader } from 'semantic-ui-react';

import TableBodyMessage from './TableBodyMessage';

// Wrap TableBody in a table component to avoid warning message about invalid nesting of a <tbody>
const createTable = messageProps => (
  <table>
    <TableBodyMessage { ...messageProps } />
  </table>
);

describe( '<TableBodyMessage>', () => {
  it( 'renders error message if set to type error', () => {
    const messageProps = {
      error: { message: 'There was an error.' },
      type: 'error',
    };

    const wrapper = mount( createTable( messageProps ) );

    const errorComponent = wrapper.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
  } );

  it( 'renders a loader if set to type loading', () => {
    const wrapper = mount( createTable( { type: 'loading' } ) );

    const loader = <Loader active inline size="small" />;

    expect( wrapper.contains( loader ) ).toEqual( true );
    expect( wrapper.contains( 'Loading...' ) ).toEqual( true );
  } );

  it( 'renders the message "No projects" if set to type no-projects', () => {
    const wrapper = mount( createTable( { type: 'no-projects' } ) );

    expect( wrapper.contains( 'No projects' ) ).toEqual( true );
  } );

  it( 'renders a no results if set to type no-results', () => {
    const term = 'Test search term';

    const wrapper = mount( createTable( {
      searchTerm: term,
      type: 'no-results',
    } ) );

    expect( wrapper.contains( `No results for &ldquo;${term}&rdquo;` ) ).toEqual( true );
  } );

  it( 'renders null if no type is passed', () => {
    const wrapper = mount( createTable() );

    const message = wrapper.find( 'TableBodyMessage' );

    expect( message.html( ) ).toEqual( null );
  } );
} );
