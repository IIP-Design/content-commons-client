import { mount } from 'enzyme';
import PlaybookEdit from './PlaybookEdit';

jest.mock(
  'components/admin/PlaybookEdit/PlaybookDetailsFormContainer/PlaybookDetailsFormContainer',
  () => function PlaybookDetailsFormContainer() { return ''; },
);

jest.mock(
  'components/admin/PlaybookEdit/PlaybookTextEditor/PlaybookTextEditor',
  () => function PlaybookTextEditor() { return ''; },
);

jest.mock(
  'components/admin/PlaybookEdit/PlaybookResources/PlaybookResources',
  () => function PlaybookResources() { return ''; },
);

describe( '<PlaybookEdit />', () => {
  let Component;
  let wrapper;

  beforeEach( () => {
    Component = <PlaybookEdit />;
    wrapper = mount( Component );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );