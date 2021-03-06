/* eslint-disable jest/no-disabled-tests */
import React from 'react';
import { mount, shallow } from 'enzyme';

import Featured from './Featured';
// import * as api from 'lib/elastic/api';

import { mockFeaturedData } from './mocks';

const mockProps = {
  data: mockFeaturedData,
  user: { id: 'public' },
};

const dispatch = jest.fn();

jest.mock( './Packages/Packages', () => 'packages-mock' );
jest.mock( './Priorities/Priorities', () => 'priorities-mock' );
jest.mock( './Recents/Recents', () => 'recents-mock' );
jest.mock( './utils', () => ( {
  getFeatured: jest.fn(),
  loadPostTypes: jest.fn(),
} ) );

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

// jest.mock( 'react', () => ( {
//   ...jest.requireActual( 'react' ),
//   useReducer: jest.fn()
//     .mockImplementationOnce( () => mockErrorContext )
//     .mockImplementationOnce( () => mockPostTypes )
//     .mockImplementationOnce( () => mockLoadingContext )
//     .mockImplementationOnce( () => mockPostTypes )
//     .mockImplementationOnce( () => mockNotStaleContext )
//     .mockImplementationOnce( () => mockPostTypes )
//     .mockImplementationOnce( () => mockContext )
//     .mockImplementationOnce( () => mockPostTypes )
//     .mockImplementationOnce( () => mockContext )
//     .mockImplementationOnce( () => mockPostTypes )
//     .mockImplementationOnce( () => mockContext )
//     .mockImplementationOnce( () => mockPostTypes ),
// } ) );

// const createApiSpy = func => jest
//   .spyOn( api, func )
//   .mockResolvedValue( Promise.resolve( {} ) );

describe.skip( '<Featured />', () => {
  afterEach( () => dispatch.mockRestore() );

  it( 'returns an error message when in an error state', () => {
    const errorMsg = 'Oops, something went wrong. We are unable to load the most recent content.';

    const wrapper = shallow( <Featured { ...mockProps } /> );

    const message = wrapper.find( 'Message' );

    expect( wrapper.exists() ).toEqual( true );
    expect( message.exists() ).toEqual( true );
    expect( message.dive().text() ).toEqual( errorMsg );
  } );

  it( 'returns a loader when in a loading state', () => {
    const wrapper = shallow( <Featured { ...mockProps } /> );

    const loader = wrapper.find( 'Loader' );

    expect( wrapper.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
  } );


  // eslint-disable-next-line jest/no-disabled-tests
  it.skip( 'renders with all the provided sections', () => {
    const wrapper = shallow( <Featured { ...mockProps } /> );

    const packages = wrapper.find( 'packages-mock' );
    const priorities = wrapper.find( 'priorities-mock' );
    const recents = wrapper.find( 'recents-mock' );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.find( 'ContextProvider' ).at( 1 )
      .children().length ).toEqual( 3 );
    expect( packages.exists() ).toEqual( true );
    expect( priorities.exists() ).toEqual( true );
    expect( recents.exists() ).toEqual( true );
  } );

  it( 'renders nothing when there is no featured data', () => {
    const noData = {
      ...mockProps,
      data: [],
    };

    const wrapper = mount( <Featured { ...noData } /> );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.children().length ).toEqual( 0 );
  } );
} );
