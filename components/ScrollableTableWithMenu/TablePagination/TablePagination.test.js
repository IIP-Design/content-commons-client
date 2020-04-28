import { mount } from 'enzyme';
import { Pagination } from 'semantic-ui-react';

import TablePagination from './TablePagination';

const props = {
  activePage: 1,
  count: 15,
  error: null,
  handlePageChange: jest.fn(),
  itemsPerPage: 5,
  loading: false
};

describe( '<TablePagination />', () => {
  it( 'renders initial loading state without crashing', () => {
    const newProps = { ...props, count: undefined, loading: true };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( TablePagination );

    expect( pagination.exists() ).toEqual( true );
    expect( pagination.contains( 'Loading....' ) ).toEqual( true );
  } );

  it( 'renders error message if an error is returned', async() => {
    const errorMock = { message: 'There was an error.' };
    const newProps = { ...props, error: errorMock };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const errorComponent = wrapper.find( 'ApolloError' );

    expect( errorComponent.exists() ).toEqual( true );
    // expect( errorComponent.contains( 'There was an error.' ) ).toEqual( true );
  } );

  it( 'renders null if count is null', () => {
    const newProps = { ...props, count: null };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( TablePagination );

    expect( pagination.html() ).toEqual( null );
  } );

  it( 'renders null if the count is 0', () => {
    const newProps = { ...props, count: 0 };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( TablePagination );

    expect( pagination.html() ).toEqual( null );
  } );

  it( 'renders null if there is one page and there is at least one project', () => {
    const newItemsPerPage = props.count;
    const newProps = { ...props, itemsPerPage: newItemsPerPage };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( TablePagination );
    const totalPages = Math.ceil( props.count / newItemsPerPage );

    expect( props.count ).toBeGreaterThan( 0 );
    expect( totalPages ).toEqual( 1 );
    expect( pagination.html() ).toEqual( null );
  } );

  it( 'renders the correct number of pages', () => {
    const totalPages = Math.ceil( props.count / props.itemsPerPage );
    const wrapper = mount( <TablePagination { ...props } /> );

    const pagination = wrapper.find( Pagination );
    const paginationItems = pagination.find( 'PaginationItem' );

    expect( pagination.prop( 'totalPages' ) ).toEqual( totalPages );
    // add 2 to include Previous & Next
    expect( paginationItems.length ).toEqual( totalPages + 2 );
  } );

  it( 'disables prevItem initially when activePage is the first page', () => {
    const wrapper = mount( <TablePagination { ...props } /> );

    const pagination = wrapper.find( Pagination );

    expect( pagination.prop( 'activePage' ) ).toEqual( props.activePage );
    expect( pagination.prop( 'prevItem' ).disabled ).toEqual( true );
    expect( pagination.prop( 'nextItem' ).disabled ).toEqual( false );
  } );

  it( 'disables nextItem if activePage is the last page', () => {
    const lastPage = Math.ceil( props.count / props.itemsPerPage );
    const newProps = { ...props, activePage: lastPage };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( Pagination );

    expect( pagination.prop( 'activePage' ) ).toEqual( lastPage );
    expect( pagination.prop( 'nextItem' ).disabled ).toEqual( true );
    expect( pagination.prop( 'prevItem' ).disabled ).toEqual( false );
  } );

  it( 'enables prevItem & nextItem if activePage is neither the first nor last page', () => {
    const totalPages = Math.ceil( props.count / props.itemsPerPage );
    const newProps = { ...props, activePage: 2 };

    const wrapper = mount( <TablePagination { ...newProps } /> );

    const pagination = wrapper.find( Pagination );

    expect( totalPages ).toBeGreaterThan( 2 );
    expect( pagination.prop( 'prevItem' ).disabled ).toEqual( false );
    expect( pagination.prop( 'nextItem' ).disabled ).toEqual( false );
  } );

  it( 'changing the page calls handlePageChange', () => {
    const wrapper = mount( <TablePagination { ...props } /> );

    const pagination = wrapper.find( Pagination );

    pagination.prop( 'onPageChange' )();
    expect( props.handlePageChange ).toHaveBeenCalledTimes( 1 );
  } );
} );
