import { shallow } from 'enzyme';
// import toJSON from 'enzyme-to-json';
import NavigationPrompt from './NavigationPrompt';

const Content = () => (
  <div className="content">
    { 'Confirmation Message ' }
    <button type="button">Cancel</button>
    <button type="button">Confirm</button>
  </div>
);
const props = {
  when: true,
  children: Content,
  history: {},
};

const Component = <NavigationPrompt { ...props } />;

describe( '<NavigationPrompt />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
  } );
} );
