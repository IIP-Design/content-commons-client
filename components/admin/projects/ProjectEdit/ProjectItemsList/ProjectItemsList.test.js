import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
// import { projects } from 'components/admin/projects/ProjectEdit/mockData';
import ProjectItemsList from './ProjectItemsList';

const Trigger = () => <div className="trigger">Trigger</div>;
const Content = () => <div className="content">Content</div>;

const videos = [
  {
    id: '3728',
    title: 'Made in America',
    language: { locale: 'en-us' }
  },
  {
    id: '3729',
    title: 'Fabriqué en Amérique',
    language: { locale: 'fr-fr' }
  }
];

const props = {
  data: videos,
  projectId: { videoID: 'made-in-america' },
  headline: 'Videos in Project',
  hasSubmittedData: true,
  projectType: 'video',
  displayItemInModal: true,
  modalTrigger: Trigger,
  modalContent: Content
};

const Component = <ProjectItemsList { ...props } />;

describe( '<ProjectItemsList />', () => {
  it( 'renders without crashing', () => {
    const wrapper = shallow( Component );
    expect( wrapper.exists() ).toEqual( true );
    expect( toJSON( wrapper ) ).toMatchSnapshot();
  } );

  it( 'renders the correct number of ProjectItem components', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    expect( projectItems ).toHaveLength( props.data.length );
  } );

  it( 'receives the Trigger component as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'modalTrigger' )() )
        .toEqual( Trigger() );
    } );
  } );

  it( 'receives the Content component as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'modalContent' )() )
        .toEqual( Content() );
    } );
  } );

  it( 'receives the projectType as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'type' ) )
        .toEqual( props.projectType );
    } );
  } );

  it( 'receives the projectId as a prop', () => {
    const wrapper = shallow( Component );
    const projectItems = wrapper.find( 'ProjectItem' );
    projectItems.forEach( item => {
      expect( item.prop( 'projectId' ) )
        .toEqual( props.projectId );
    } );
  } );
} );
