import { mount } from 'enzyme';
import wait from 'waait';
import { MockedProvider } from 'react-apollo/test-utils';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';
import UseDropdown, { VIDEO_USE_QUERY, IMAGE_USE_QUERY, DOCUMENT_USE_QUERY } from './UseDropdown';

const props = {
  id: '',
  label: 'Type/Use',
  type: 'Video'
};

const imageProps = {
  ...props,
  type: 'Image'
};

const documentProps = {
  id: '',
  label: 'Release Type',
  type: 'Document'
};

const mocks = [
  {
    request: {
      query: VIDEO_USE_QUERY
    },
    result: {
      data: {
        videoUses: [
          {
            id: 'cjsw78q6p00lp07566znbyatd',
            name: 'Full Video'
          },
          {
            id: 'cjubbldgd0uq3075628v0917u',
            name: 'Video Assets (B-Roll)'
          },
          {
            id: 'cjubbldgj0uq50756f9el8l5j',
            name: 'Event Video'
          },
          {
            id: 'cjubbldgj0uq60756vtilh8w1',
            name: 'Promotional Teaser'
          }
        ]
      }
    }
  },
  {
    request: {
      query: IMAGE_USE_QUERY
    },
    result: {
      data: {
        imageUses: [
          {
            id: 'cjtkdq8kr0knf07569goo9eqe',
            name: 'Thumbnail/Cover Image'
          },
          {
            id: 'cjtkdqqjs0knk07565mgduq36',
            name: 'Social Media Graphic'
          },
          {
            id: 'cjtkdr7j40knp0756ppap6gqm',
            name: 'Email Graphic'
          },
          {
            id: 'cjtkdrndt0knu0756gha65mhd',
            name: 'Website Hero Image'
          },
          {
            id: 'cjubblddu0upq0756ioyonu50',
            name: 'Infographic'
          },
          {
            id: 'cjubbldfl0upu0756imis0hxp',
            name: 'Memes'
          },
          {
            id: 'cjubbldfo0upx0756pldnc0k0',
            name: '3D Graphics'
          }
        ]
      }
    }
  },
  {
    request: {
      query: DOCUMENT_USE_QUERY
    },
    result: {
      data: {
        documentUses: [
          {
            id: 'ck2wbvj5h10kq0720hr0nkfgz',
            name: 'Background Briefing'
          },
          {
            id: 'ck2wbvj6010kz0720c358mbrt',
            name: 'Department Press Briefing'
          },
          {
            id: 'ck2wbvj6w10l80720gzhwlr9s',
            name: 'Fact Sheet'
          },
          {
            id: 'ck2wbvj7b10lg0720htdvmgru',
            name: 'Interview'
          },
          {
            id: 'ck2wbvj7u10lo07207aa55qmz',
            name: 'Media Note'
          },
          {
            id: 'ck2wbvj8810lx0720ruj5eylz',
            name: 'Notice to the Press'
          },
          {
            id: 'ck2wbvj8n10m50720eu2ob3pq',
            name: 'On-the-record Briefing'
          },
          {
            id: 'ck2wbvj8y10md0720vsuqxq87',
            name: 'Press Guidance'
          },
          {
            id: 'ck2wbvj9b10ml0720245vk3uy',
            name: 'Remarks'
          },
          {
            id: 'ck2wbvj9v10mt0720hwq7013q',
            name: 'Speeches'
          },
          {
            id: 'ck2wbvjaa10n20720fg5ayhn9',
            name: 'Statement'
          },
          {
            id: 'ck2wbvjao10na0720ncwefnm6',
            name: 'Taken Questions'
          },
          {
            id: 'ck2wbvjb210nj07205m16k3xx',
            name: 'Travel Alert'
          },
          {
            id: 'ck2wbvjbf10nr0720o6zpopyt',
            name: 'Readout'
          },
          {
            id: 'ck2wbvjbu10nz072060p67wk5',
            name: 'Travel Warning'
          }
        ]
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
  },
  {
    ...mocks[2],
    result: {
      errors: [{ message: 'There was an error.' }]
    }
  }
];

const nullMocks = [
  {
    ...mocks[0],
    result: {
      data: { videoUses: null }
    }
  },
  {
    ...mocks[1],
    result: {
      data: { imageUses: null }
    }
  },
  {
    ...mocks[2],
    result: {
      data: { documentUses: null }
    }
  }
];

const emptyMocks = [
  {
    ...mocks[0],
    result: {
      data: { videoUses: [] }
    }
  },
  {
    ...mocks[1],
    result: {
      data: { imageUses: [] }
    }
  },
  {
    ...mocks[2],
    result: {
      data: { documentUses: [] }
    }
  }
];

describe( '<UseDropdown /> for video type', () => {
  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...props } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
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
    const { videoUses } = mocks[0].result.data;
    const semanticUIValues = sortBy( videoUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( videoUses.length + 1 );
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

describe( '<UseDropdown /> for image type', () => {
  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...imageProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
    const error = errorMocks[1].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if imageUses is null', async () => {
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

  it( 'does not crash if imageUses is []', async () => {
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
    const { imageUses } = mocks[1].result.data;
    const semanticUIValues = sortBy( imageUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( imageUses.length + 1 );
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

describe( '<UseDropdown /> for document type', () => {
  const Component = (
    <MockedProvider mocks={ mocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const ErrorComponent = (
    <MockedProvider mocks={ errorMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const NullComponent = (
    <MockedProvider mocks={ nullMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  const EmptyComponent = (
    <MockedProvider mocks={ emptyMocks } addTypename={ false }>
      <UseDropdown { ...documentProps } />
    </MockedProvider>
  );

  it( 'renders loading state without crashing', () => {
    const wrapper = mount( Component );
    const dropdown = wrapper.find( 'UseDropdown' );
    const formDropdown = wrapper.find( 'FormDropdown' );

    expect( dropdown.exists() ).toEqual( true );
    expect( formDropdown.prop( 'loading' ) ).toEqual( true );
  } );

  it( 'renders an error message if there is a GraphQL error', async () => {
    const wrapper = mount( ErrorComponent );
    await wait( 0 );
    wrapper.update();
    const dropdown = wrapper.find( 'UseDropdown' );
    const error = errorMocks[2].result.errors[0];
    const errorMsg = `Error! GraphQL error: ${error.message}`;

    expect( dropdown.contains( errorMsg ) ).toEqual( true );
  } );

  it( 'does not crash if documentUses is null', async () => {
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

  it( 'does not crash if documentUses is []', async () => {
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
    const { documentUses } = mocks[2].result.data;
    const semanticUIValues = sortBy( documentUses, use => use.name )
      .map( u => ( { key: u.id, text: u.name, value: u.id } ) );
    const options = addEmptyOption( semanticUIValues );

    expect( formDropdown.prop( 'options' ) ).toEqual( options );
    expect( dropdownItems.length ).toEqual( documentUses.length + 1 );
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
