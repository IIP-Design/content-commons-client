import React from 'react';
import { mount } from 'enzyme';

import GraphicPreview from './GraphicPreview';

import { mockData, mockGraphicItem, mockState } from './mocks';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: {},
} ) );

jest.mock( 'react', () => ( {
  ...jest.requireActual( 'react' ),
  useContext: jest.fn()
    .mockImplementationOnce( () => ( { state: mockState.error } ) )
    .mockImplementationOnce( () => ( { state: mockState.loading } ) )
    .mockImplementation( () => ( { state: mockState.default } ) ),
} ) );

jest.mock( 'components/GraphicProject/GraphicProject', () => 'graphic-project' );

describe( '<GraphicPreview />', () => {
  it( 'renders an error message when in an error state', () => {
    const wrapper = mount( <GraphicPreview data={ mockData } /> );

    const error = wrapper.find( 'ApolloError' );

    expect( wrapper.exists() ).toEqual( true );
    expect( error.exists() ).toEqual( true );
  } );

  it( 'renders a loader when in a loading state', () => {
    const wrapper = mount( <GraphicPreview data={ mockData } /> );

    const loader = wrapper.find( 'PreviewLoader' );

    expect( wrapper.exists() ).toEqual( true );
    expect( loader.exists() ).toEqual( true );
  } );


  it( 'renders without crashing', () => {
    const wrapper = mount( <GraphicPreview data={ mockData } /> );

    expect( wrapper.exists() ).toEqual( true );
  } );

  it( 'transforms the provided data and returns a GraphicProject using the transformed data', () => {
    const wrapper = mount( <GraphicPreview data={ mockData } /> );

    const graphicProject = wrapper.find( 'graphic-project' );

    expect( graphicProject.exists() ).toEqual( true );
    expect( graphicProject.prop( 'item' ) ).toEqual( mockGraphicItem );
    expect( graphicProject.prop( 'item' ).type ).toEqual( mockData.__typename );
    expect( graphicProject.prop( 'item' ).published ).toEqual( mockData.createdAt );
    expect( graphicProject.prop( 'item' ).modified ).toEqual( mockData.updatedAt );
    expect( graphicProject.prop( 'item' ).owner ).toEqual( mockData.team );
  } );

  it( 'does not render anything when no data is provided', () => {
    const wrapper = mount( <GraphicPreview /> );

    expect( wrapper.exists() ).toEqual( true );
    expect( wrapper.children() ).toHaveLength( 0 );
  } );
} );
