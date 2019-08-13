import { mount } from 'enzyme';
import DeleteProjectsList from './DeleteProjectsList';
import { drafts, nonDrafts } from '../mocks';

const draftProps = {
  headline: 'the drafts list headline',
  isDrafts: true,
  projects: drafts
};

const nonDraftProps = {
  headline: 'the non-drafts list headline',
  projects: nonDrafts
};

const DraftsComponent = <DeleteProjectsList { ...draftProps } />;
const NonDraftsComponent = <DeleteProjectsList { ...nonDraftProps } />;

describe( '<DeleteProjectsList />', () => {
  it( 'renders drafts without crashing', () => {
    const wrapper = mount( DraftsComponent );
    const headline = wrapper.find( '#delete-drafts-desc' );
    const list = wrapper.find( 'ul.delete-list' );
    const listItem = wrapper.find( 'li.delete-list-item' );

    expect( wrapper.exists() ).toEqual( true );
    expect( headline.text() ).toEqual( draftProps.headline );
    expect( list.prop( 'aria-describedby' ) )
      .toEqual( 'delete-drafts-desc' );
    expect( listItem.length ).toEqual( draftProps.projects.length );
    listItem.forEach( ( item, i ) => {
      expect( item.hasClass( 'delete-list-item' ) ).toEqual( true );
      expect( item.text() ).toEqual( draftProps.projects[i].projectTitle );
    } );
  } );

  it( 'renders non-drafts without crashing', () => {
    const wrapper = mount( NonDraftsComponent );
    const headline = wrapper.find( '#delete-non-drafts-desc' );
    const list = wrapper.find( 'ul.delete-list' );
    const listItem = wrapper.find( 'li.delete-list-item' );

    expect( wrapper.exists() ).toEqual( true );
    expect( headline.text() ).toEqual( nonDraftProps.headline );
    expect( list.prop( 'aria-describedby' ) )
      .toEqual( 'delete-non-drafts-desc' );
    expect( listItem.length ).toEqual( nonDraftProps.projects.length );
    listItem.forEach( ( item, i ) => {
      expect( item.hasClass( 'delete-list-item' ) ).toEqual( true );
      expect( item.text() ).toEqual( nonDraftProps.projects[i].projectTitle );
    } );
  } );
} );
