import { mount } from 'enzyme';
import PlaybookEdit from './PlaybookEdit';
import { MockedProvider } from '@apollo/client/testing';

const mocks = [];

jest.mock(
  'components/admin/PlaybookEdit/PlaybookDetailsFormContainer/PlaybookDetailsFormContainer',
  () => function PlaybookDetailsFormContainer() { return ''; },
);

jest.mock(
  'components/admin/TextEditor/TextEditor',
  () => function TextEditor() { return ''; },
);

jest.mock(
  'components/admin/PlaybookEdit/PlaybookResources/PlaybookResources',
  () => function PlaybookResources() { return ''; },
);

describe( '<PlaybookEdit />', () => {
  let wrapper;

  beforeEach( () => {
    wrapper = mount( (
      <MockedProvider mocks={ mocks } addTypename={ false }>
        <PlaybookEdit />
      </MockedProvider>
    ) );
  } );

  it( 'renders without crashing', () => {
    expect( wrapper.exists() ).toEqual( true );
  } );
} );
