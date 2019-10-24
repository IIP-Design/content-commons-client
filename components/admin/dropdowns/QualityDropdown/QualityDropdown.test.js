import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import { addEmptyOption } from 'lib/utils';
import QualityDropdown, { VIDEO_QUALITY_QUERY, IMAGE_QUALITY_QUERY } from './QualityDropdown';

const props = {
  id: '',
  label: 'Quality',
  infotip: 'tooltip message',
  type: 'Video'
};

const imageProps = {
  ...props,
  type: 'Image'
};

const mocks = [
  {
    request: {
      query: VIDEO_QUALITY_QUERY
    },
    result: {
      data: {
        __type: {
          enumValues: [
            { name: 'WEB' },
            { name: 'BROADCAST' }
          ]
        }
      }
    }
  },
  {
    request: {
      query: IMAGE_QUALITY_QUERY
    },
    result: {
      data: {
        __type: null
      }
    }
  }
];

const errorMocks = [
  {
    ...mocks[0],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  },
  {
    ...mocks[1],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        __type: { enumValues: null }
      }
    }
  },
  {
    ...mocks[1],
    result: {
      data: {
        __type: null
      }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: {
        __type: { enumValues: [] }
      }
    }
  },
  {
    ...mocks[1],
    result: {
      data: {
        __type: { enumValues: [] }
      }
    }
  }
];

describe( '<QualityDropdown /> for video type', () => {
  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <QualityDropdown { ...props } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <QualityDropdown { ...props } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <QualityDropdown { ...props } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <QualityDropdown { ...props } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'QualityDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'QualityDropdown' );
    const error = errorMocks[0].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if enumValues is null', async () => {
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if enumValues is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'renders the final state without crashing', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { enumValues } = mocks[0].result.data.__type;
    const semanticUIValues = enumValues.map( quality => {
      const { name } = quality;
      return {
        key: name,
        text: `For ${name.toLowerCase()}`,
        value: name
      };
    } );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( enumValues.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown > div' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );

describe( '<QualityDropdown /> for image type', () => {
  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <QualityDropdown { ...imageProps } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <QualityDropdown { ...imageProps } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <QualityDropdown { ...imageProps } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <QualityDropdown { ...imageProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'QualityDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'QualityDropdown' );
    const error = errorMocks[1].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if enumValues (or __type for now) is null', async () => {
    // Will need to update mocks after image enums are added to model
    const wrapper = mount( NullComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it( 'does not crash if enumValues is []', async () => {
    const wrapper = mount( EmptyComponent );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const emptyOption = [{
      key: '-',
      text: '-',
      value: null
    }];

    expect( formDropdown.prop( 'options' ) ).toEqual( emptyOption );
  } );

  it.skip( 'renders the final state without crashing', async () => {
    // remove skip after image enums are added to model
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const formDropdown = wrapper.find( 'FormDropdown' );
    const dropdownItems = wrapper.find( 'DropdownItem' );
    const { enumValues } = mocks[1].result.data.__type;
    const semanticUIValues = enumValues.map( quality => {
      const { name } = quality;
      return {
        key: name,
        text: `For ${name.toLowerCase()}`,
        value: name
      };
    } );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( enumValues.length + 1 );
  } );

  it( 'assigns a matching id & htmlFor value to the Dropdown and label, respectively', async () => {
    const wrapper = mount( Component );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'Dropdown > div' );
    const label = wrapper.find( 'label' );

    expect( dropdown.prop( 'id' ) ).toEqual( props.id );
    expect( label.prop( 'htmlFor' ) ).toEqual( props.id );
  } );
} );
