import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Checkbox, Popup } from 'semantic-ui-react';
import MyProjectPrimaryCol from './MyProjectPrimaryCol';

/**
 * Need to mock Next.js dynamic imports
 * in order for this test suite to run.
 */
jest.mock( 'next-server/dynamic', () => () => 'VideoDetailsPopup' );
jest.mock( 'next-server/dynamic', () => () => 'ImageDetailsPopup' );

const props = {
  d: {
    id: '111',
    createdAt: 'May 9, 2019',
    updatedAt: 'May 9, 2019',
    projectTitle: 'Test Project',
    author: 'Jane Doe',
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    thumbnail: {
      alt: 'the alt text',
      url: 'https://website.com'
    }
  },
  header: {
    label: 'PROJECT TITLE',
    name: 'projectTitle'
  },
  selectedItems: new Map( [['999', true]] ),
  toggleItemSelection: jest.fn()
};

const Component = <MyProjectPrimaryCol { ...props } />;

describe( '<MyProjectPrimaryCol />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );

    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders an unchecked Checkbox if item is *not* selected', () => {
    const wrapper = shallow( Component );
    const checkbox = wrapper.find( Checkbox );

    expect( checkbox.prop( 'checked' ) ).toEqual( false );
  } );

  it( 'renders a checked Checkbox if item is selected', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( { selectedItems: new Map( [[props.d.id, true]] ) } );

    const checkbox = wrapper.find( Checkbox );

    expect( checkbox.prop( 'checked' ) ).toEqual( true );
  } );

  it( 'checking/unchecking the Checkbox calls toggleItemSelection', () => {
    const wrapper = shallow( Component );
    const checkbox = wrapper.find( Checkbox );

    checkbox.simulate( 'change' );
    expect( props.toggleItemSelection ).toHaveBeenCalled();
  } );

  it( 'does not render a Popup if project title is less than 35 characters', () => {
    const wrapper = shallow( Component );
    const popup = wrapper.find( Popup );

    expect( props.d.projectTitle.length ).toBeLessThanOrEqual( 35 );
    expect( popup.exists() ).toEqual( false );
  } );

  it( 'renders a Popup with a truncated project title if it is over 35 characters', () => {
    const wrapper = shallow( Component );
    wrapper.setProps( {
      d: {
        ...props.d,
        projectTitle: 'Test Project Test Project Test Project Test Project'
      }
    } );
    const popup = wrapper.find( Popup );

    expect( popup.exists() ).toEqual( true );
    expect( popup.prop( 'content' ) )
      .toEqual( 'Test Project Test Project Test Project Test Project' );
    expect( popup.prop( 'content' ).length ).toBeGreaterThan( 35 );
    expect( toJSON( popup ) ).toMatchSnapshot();
  } );

  it( 'renders "draft" class value for thumbnail img if status is DRAFT', () => {
    const wrapper = shallow( Component );
    const thumbnail = () => wrapper.find( '.myProjects_thumbnail img' );

    // initial value
    expect( thumbnail().prop( 'className' ) ).toEqual( null );

    wrapper.setProps( { d: { ...props.d, status: 'DRAFT' } } );
    expect( thumbnail().prop( 'className' ) ).toEqual( 'draft' );
  } );

  it( 'renders an overlay with "DRAFT" text for thumbnail img if status is DRAFT', () => {
    const wrapper = shallow( Component );
    const overlay = () => wrapper.find( '.draft-overlay' );

    // does not exist if status !== DRAFT
    expect( overlay().exists() ).toEqual( false );

    wrapper.setProps( { d: { ...props.d, status: 'DRAFT' } } );
    expect( overlay().exists() ).toEqual( true );
    expect( overlay().contains( <span>DRAFT</span> ) ).toEqual( true );
  } );
} );
