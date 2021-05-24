import { mount } from 'enzyme';
import PlaybookDetailsFormContainer from './PlaybookDetailsFormContainer';

jest.mock(
  'components/admin/PackageCreate/PackageForm/PackageForm',
  () => function PlaybookForm() { return ''; },
);

describe( '<PlaybookDetailsFormContainer />', () => {
  let Component;
  let wrapper;
  let formContainer;

  const props = {
    children: <div>just another child node</div>,
    playbook: {
      id: 'playbook123',
      title: 'COVID-19 Recovery',
      type: 'Playbook',
      team: 'team789',
      categories: ['category123', 'category456'],
      tags: [],
      policy: 'policy456',
      visibility: 'INTERNAL',
      desc: 'Lorem Ipsum',
      supportFiles: [],
    },
    setIsFormValid: jest.fn( () => true ),
  };

  beforeEach( () => {
    Component = <PlaybookDetailsFormContainer { ...props } />;
    wrapper = mount( Component );
    formContainer = wrapper.find( 'PlaybookDetailsFormContainer' );
  } );

  it( 'renders without crashing', () => {
    expect( formContainer.exists() ).toEqual( true );
  } );
} );
