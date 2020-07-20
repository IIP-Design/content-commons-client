import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import { mocks, props, reduxState } from './mocks';
import { suppressActWarning } from 'lib/utils';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import FileDataForm from './FileDataForm';

jest.mock(
  'next/dynamic',
  () => function DynamicComponent() { return ''; },
);
jest.mock(
  'components/admin/ConfirmModalContent/ConfirmModalContent',
  () => function ConfirmModalContent() { return ''; },
);
jest.mock(
  'components/admin/dropdowns/QualityDropdown/QualityDropdown',
  () => function QualityDropdown() { return ''; },
);
jest.mock(
  'components/admin/dropdowns/VideoBurnedInStatusDropdown/VideoBurnedInStatusDropdown',
  () => function VideoBurnedInStatusDropdown() { return ''; },
);

const value = {
  language: {
    id: 'ck2lzfx710hkq07206thus6pt',
    displayName: 'English',
    locale: 'en-us',
    __typename: 'Language',
  },
  selectedFile: 'ckcoospf10bjh0720ftniacm3',
  selectedProject: 'ckcoositc0biv0720dwlj4l0g',
  selectedUnit: 'ckcoospdp0bjc07207x6j8xhw',
  setLanguage: jest.fn(),
  setSelectedFile: jest.fn(),
  setSelectedUnit: jest.fn(),
  setSelectedProject: jest.fn(),
  setShowNotification: jest.fn(),
  showNotication: jest.fn(),
  startTimeout: jest.fn(),
  updateSelectedUnit: jest.fn(),
};

const mockStore = configureStore( [] );

describe( '<FileDataForm />, when the video use is Clean', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let store;
  let Component;
  let wrapper;

  beforeEach( () => {
    store = mockStore( reduxState );
    Component = (
      <EditSingleProjectItemContext.Provider value={ value }>
        <Provider store={ store }>
          <MockedProvider mocks={ mocks } addTypename={ false }>
            <FileDataForm { ...{ ...props, ...value } } />
          </MockedProvider>
        </Provider>
      </EditSingleProjectItemContext.Provider>
    );
    wrapper = mount( Component );
  } );

  it( 'renders initial loading state without crashing', () => {
    const fileDataForm = wrapper.find( 'FileDataForm' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading the file data...';

    expect( fileDataForm.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    await wait( 0 );
    wrapper.update();
    const form = wrapper.find( 'Form' );
    const loader = wrapper.find( 'Loader' );

    expect( form.exists() ).toEqual( true );
    expect( form.hasClass( 'edit-video__form video-file-form' ) )
      .toEqual( true );
    expect( loader.exists() ).toEqual( false );
  } );

  it( 'renders file meta data', async () => {
    await wait( 0 );
    wrapper.update();
    const fileMeta = wrapper.find( '.file_meta' );

    expect( toJSON( fileMeta ) ).toMatchSnapshot();
  } );

  it( 'renders the Confirm modal', async () => {
    await wait( 0 );
    wrapper.update();
    const confirm = wrapper.find( 'Confirm' );

    expect( toJSON( confirm ) ).toMatchSnapshot();
  } );

  it( 'renders video links', async () => {
    await wait( 0 );
    wrapper.update();
    const videoLinks = wrapper.find( '.video-links' );

    expect( toJSON( videoLinks ) ).toMatchSnapshot();
  } );

  it( 'renders the LanguageDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const languageDropdown = wrapper.find( 'LanguageDropdown' );
    const languageId = mocks[1].result.data.file.language.id;

    expect( languageDropdown.exists() ).toEqual( true );
    expect( languageDropdown.prop( 'label' ) ).toEqual( 'Language' );
    expect( languageDropdown.prop( 'required' ) ).toEqual( true );
    expect( languageDropdown.prop( 'value' ) ).toEqual( languageId );
    // disabled since file (i.e., mocks[1]) has Clean video use
    expect( languageDropdown.prop( 'disabled' ) ).toEqual( true );
  } );

  it( 'renders the VideoBurnedInStatusDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const burnedInStatusDropdown = wrapper.find( 'VideoBurnedInStatusDropdown' );

    expect( burnedInStatusDropdown.prop( 'label' ) )
      .toEqual( 'On-Screen Text' );
    expect( burnedInStatusDropdown.prop( 'name' ) )
      .toEqual( 'videoBurnedInStatus' );
    expect( burnedInStatusDropdown.prop( 'type' ) )
      .toEqual( 'video' );
    expect( burnedInStatusDropdown.prop( 'required' ) )
      .toEqual( true );
    // disabled since file (i.e., mocks[1]) has Clean video use
    expect( burnedInStatusDropdown.prop( 'disabled' ) )
      .toEqual( true );
    expect( burnedInStatusDropdown.prop( 'onChange' ).name )
      .toEqual( 'handleDropdownSave' );
  } );

  it( 'renders the UseDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const useDropdown = wrapper.find( 'UseDropdown' );
    const useId = mocks[1].result.data.file.use.id;

    expect( useDropdown.prop( 'label' ) ).toEqual( 'Video Type' );
    expect( useDropdown.prop( 'name' ) ).toEqual( 'use' );
    expect( useDropdown.prop( 'type' ) ).toEqual( 'video' );
    expect( useDropdown.prop( 'required' ) ).toEqual( true );
    expect( useDropdown.prop( 'value' ) ).toEqual( useId );
    expect( useDropdown.prop( 'onChange' ).name )
      .toEqual( 'handleDropdownSave' );
  } );

  it( 'renders the QualityDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const qualityDropdown = wrapper.find( 'QualityDropdown' );
    const infoTip = 'Web: small - for social sharing, Broadcast: large - ambassador videos';

    expect( qualityDropdown.prop( 'label' ) )
      .toEqual( 'Video Quality' );
    expect( qualityDropdown.prop( 'name' ) ).toEqual( 'quality' );
    expect( qualityDropdown.prop( 'type' ) ).toEqual( 'video' );
    expect( qualityDropdown.prop( 'infotip' ) ).toEqual( infoTip );
    expect( qualityDropdown.prop( 'required' ) ).toEqual( true );
    expect( qualityDropdown.prop( 'onChange' ).name )
      .toEqual( 'handleDropdownSave' );
  } );
} );

describe( '<FileDataForm />, when the video use is not Clean', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let store;
  let Component;
  let wrapper;

  const french = {
    id: 'ck2lzfx710hkp07206oo0icbv',
    displayName: 'French',
    locale: 'fr-fr',
    __typename: 'Language',
  };

  const newCtxValue = {
    ...value,
    language: french,
  };

  const newProps = {
    ...props,
    values: {
      ...props.values,
      language: french.id,
      use: 'ck2lzfx5y0hhz07207nol9j6r',
      videoBurnedInStatus: 'SUBTITLED',
    },
  };

  const newMocks = mocks.reduce( ( acc, curr, i ) => {
    if ( i === 1 ) {
      acc.push( {
        ...curr,
        result: {
          data: {
            file: {
              ...curr.result.data.file,
              language: french,
              use: {
                id: 'ck2lzfx5y0hhz07207nol9j6r',
                name: 'Full Video',
              },
            },
          },
        },
      } );
    } else {
      acc.push( curr );
    }

    return acc;
  }, [] );

  beforeEach( () => {
    store = mockStore( reduxState );
    Component = (
      <EditSingleProjectItemContext.Provider value={ newCtxValue }>
        <Provider store={ store }>
          <MockedProvider mocks={ newMocks } addTypename={ false }>
            <FileDataForm { ...{ ...newProps, ...newCtxValue } } />
          </MockedProvider>
        </Provider>
      </EditSingleProjectItemContext.Provider>
    );
    wrapper = mount( Component );
  } );

  it( 'renders initial loading state without crashing', () => {
    const fileDataForm = wrapper.find( 'FileDataForm' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading the file data...';

    expect( fileDataForm.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders final state without crashing', async () => {
    await wait( 0 );
    wrapper.update();
    const form = wrapper.find( 'Form' );
    const loader = wrapper.find( 'Loader' );

    expect( form.exists() ).toEqual( true );
    expect( form.hasClass( 'edit-video__form video-file-form' ) )
      .toEqual( true );
    expect( loader.exists() ).toEqual( false );
  } );

  it( 'renders the LanguageDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const languageDropdown = wrapper.find( 'LanguageDropdown' );
    const languageId = newMocks[1].result.data.file.language.id;

    expect( languageDropdown.exists() ).toEqual( true );
    expect( languageDropdown.prop( 'label' ) ).toEqual( 'Language' );
    expect( languageDropdown.prop( 'required' ) ).toEqual( true );
    expect( languageDropdown.prop( 'value' ) ).toEqual( languageId );
    // disabled since file (i.e., mocks[1]) has Clean video use
    expect( languageDropdown.prop( 'disabled' ) ).toEqual( false );
  } );

  it( 'renders the VideoBurnedInStatusDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const burnedInStatusDropdown = wrapper.find( 'VideoBurnedInStatusDropdown' );

    expect( burnedInStatusDropdown.prop( 'label' ) )
      .toEqual( 'On-Screen Text' );
    expect( burnedInStatusDropdown.prop( 'name' ) )
      .toEqual( 'videoBurnedInStatus' );
    expect( burnedInStatusDropdown.prop( 'type' ) )
      .toEqual( 'video' );
    expect( burnedInStatusDropdown.prop( 'required' ) )
      .toEqual( true );
    // disabled since file (i.e., mocks[1]) has Clean video use
    expect( burnedInStatusDropdown.prop( 'disabled' ) )
      .toEqual( false );
    expect( burnedInStatusDropdown.prop( 'onChange' ).name )
      .toEqual( 'handleDropdownSave' );
  } );

  it( 'renders the UseDropdown', async () => {
    await wait( 0 );
    wrapper.update();
    const useDropdown = wrapper.find( 'UseDropdown' );
    const useId = newMocks[1].result.data.file.use.id;

    expect( useDropdown.prop( 'label' ) ).toEqual( 'Video Type' );
    expect( useDropdown.prop( 'name' ) ).toEqual( 'use' );
    expect( useDropdown.prop( 'type' ) ).toEqual( 'video' );
    expect( useDropdown.prop( 'required' ) ).toEqual( true );
    expect( useDropdown.prop( 'value' ) ).toEqual( useId );
    expect( useDropdown.prop( 'onChange' ).name )
      .toEqual( 'handleDropdownSave' );
  } );
} );

describe( '<FileDataForm />, when there is a GraphQL error for the videoFileQuery', () => {
  const consoleError = console.error;

  beforeAll( () => suppressActWarning( consoleError ) );
  afterAll( () => {
    console.error = consoleError;
  } );

  let store;
  let Component;
  let wrapper;

  const newMocks = mocks.reduce( ( acc, curr, i ) => {
    if ( i === 1 ) {
      acc.push( {
        ...curr,
        result: {
          errors: [{ message: 'There was an error.' }],
        },
      } );
    } else {
      acc.push( curr );
    }

    return acc;
  }, [] );

  beforeEach( () => {
    store = mockStore( reduxState );
    Component = (
      <EditSingleProjectItemContext.Provider value={ value }>
        <Provider store={ store }>
          <MockedProvider mocks={ newMocks } addTypename={ false }>
            <FileDataForm { ...{ ...props, ...value } } />
          </MockedProvider>
        </Provider>
      </EditSingleProjectItemContext.Provider>
    );
    wrapper = mount( Component );
  } );

  it( 'renders initial loading state without crashing', () => {
    const fileDataForm = wrapper.find( 'FileDataForm' );
    const loader = wrapper.find( 'Loader' );
    const msg = 'Loading the file data...';

    expect( fileDataForm.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
    expect( loader.contains( msg ) ).toEqual( true );
  } );

  it( 'renders the GraphQL error message', async () => {
    await wait( 0 );
    wrapper.update();
    const form = wrapper.find( 'Form' );
    const apolloError = wrapper.find( 'ApolloError' );
    const msg = 'There was an error.';

    expect( form.exists() ).toEqual( false );
    expect( apolloError.exists() ).toEqual( true );
    expect( apolloError.contains( msg ) ).toEqual( true );
  } );
} );
