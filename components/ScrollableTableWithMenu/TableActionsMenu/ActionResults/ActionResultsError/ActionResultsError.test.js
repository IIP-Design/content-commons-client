import { mount } from 'enzyme';
import { List } from 'semantic-ui-react';
import { failure, errorStrings } from '../mocks';
import ActionResultsError from './ActionResultsError';

const props = { ...failure };

const component = (
  <List>
    <ActionResultsError { ...props } />
  </List>
);

describe( '<ActionResultsError />', () => {
  it( 'renders without crashing', () => {
    const wrapper = mount( component );
    const item = wrapper.find( ActionResultsError );

    expect( item.exists() ).toEqual( true );
  } );

  it( 'renders the project title', () => {
    const wrapper = mount( component );
    const item = wrapper.find( ActionResultsError );
    const msg = `Project '${failure.project.projectTitle}' ${failure.action} failed with errors:`;

    expect( item.find( '.header' ).text() ).toEqual( msg );
  } );

  it( 'renders a list with the expected error strings', () => {
    const wrapper = mount( component );
    const item = wrapper.find( ActionResultsError );
    const list = item.find( List );

    expect( list.prop( 'items' ) ).toEqual( errorStrings );
  } );
} );
