import { mount } from 'enzyme';

import useInitialStatus from '../hooks/useInitialStatus';

const setup = ( ...args ) => {
  const returnVal = {};

  const TestComponent = () => {
    Object.assign( returnVal, useInitialStatus( ...args ) );

    return null;
  };

  mount( <TestComponent /> );

  return returnVal;
};

describe( 'useInitialStatus', () => {
  it( 'returns correct values for initially created projects', () => {
    const dateStatuses = setup( {
      created: '2021-07-01T14:53:10.605Z',
      updated: '2021-07-01T14:53:10.975Z',
      published: null,
      initialPublished: null,
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: true,
      isInitialPublish: false,
      isSavedUpdate: false,
    } );
  } );

  it( 'returns correct values for initially PUBLISHED projects', () => {
    const dateStatuses = setup( {
      created: '2021-06-04T19:06:16.585Z',
      updated: '2021-07-01T12:30:33.793Z',
      published: '2021-07-01T12:30:33.418Z',
      initialPublished: '2021-07-01T12:30:33.252Z',
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: false,
      isInitialPublish: true,
      isSavedUpdate: false,
    } );
  } );

  it( 'returns correct values for updated DRAFT projects', () => {
    const dateStatuses = setup( {
      created: '2021-07-01T14:53:10.605Z',
      updated: '2021-07-01T14:58:24.975Z',
      published: null,
      initialPublished: null,
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: true,
      isInitialPublish: false,
      isSavedUpdate: false,
    } );
  } );

  it( 'returns correct values for PUBLISHED project with unpublished changes', () => {
    const dateStatuses = setup( {
      created: '2021-06-04T19:06:16.585Z',
      updated: '2021-07-03T12:32:40.793Z',
      published: '2021-07-03T12:30:33.418Z',
      initialPublished: '2021-07-01T12:30:33.252Z',
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: false,
      isInitialPublish: false,
      isSavedUpdate: true,
    } );
  } );

  it( 'returns correct values for PUBLISHED projects that have been republished', () => {
    const dateStatuses = setup( {
      created: '2021-06-04T19:06:16.585Z',
      updated: '2021-07-03T12:30:33.793Z',
      published: '2021-07-03T12:30:33.418Z',
      initialPublished: '2021-07-01T12:30:33.252Z',
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: false,
      isInitialPublish: false,
      isSavedUpdate: false,
    } );
  } );

  it( 'returns correct values for PUBLISHED projects that have been unpublished', () => {
    const dateStatuses = setup( {
      created: '2021-06-04T19:06:16.585Z',
      updated: '2021-07-05T12:30:33.793Z',
      published: null,
      initialPublished: '2021-07-01T12:30:33.252Z',
    } );

    expect( dateStatuses ).toEqual( {
      isNeverPublished: false,
      isInitialPublish: false,
      isSavedUpdate: false,
    } );
  } );
} );
