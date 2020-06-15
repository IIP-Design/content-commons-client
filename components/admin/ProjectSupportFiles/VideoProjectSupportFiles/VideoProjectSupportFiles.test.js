import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { MockedProvider } from '@apollo/react-testing';

import VideoProjectSupportFiles from './VideoProjectSupportFiles';

import { mocks, props } from './mocks';

jest.mock( 'next/config', () => () => ( {
  publicRuntimeConfig: { REACT_APP_AWS_S3_AUTHORING_BUCKET: 's3-bucket-url' },
} ) );

jest.mock( '../ProjectSupportFiles', () => 'project-support-files' );
jest.mock( 'components/admin/ProjectUnits/ProjectUnitItem/ProjectUnitItem', () => 'project-unit-item' );

const Component = (
  <MockedProvider mocks={ mocks } addTypename>
    <VideoProjectSupportFiles { ...props } />
  </MockedProvider>
);

describe.skip( '<VideoProjectSupportFiles />', () => {
  it( 'renders initial loading state without crashing', () => {
    const wrapper = mount( Component );
    const videoProjectSupportFiles = wrapper.find( 'VideoProjectSupportFiles' );

    expect( videoProjectSupportFiles.exists() ).toEqual( true );
    expect( toJSON( videoProjectSupportFiles ) ).toMatchSnapshot();
  } );

  it( 'renders final state without crashing', async () => {
    /**
     * Suppress heuristic fragment matching error message.
     * @todo May need further research on this since didn't
     * see where we were using fragment unions and interfaces
     * @see https://www.apollographql.com/docs/react/advanced/fragments/#fragments-on-unions-and-interfaces
     */
    const consoleError = console.error;

    console.error = jest.fn();

    const wrapper = mount( Component );

    await wait( 0 );
    wrapper.update();
    const videoProjectSupportFiles = wrapper.find( 'VideoProjectSupportFiles' );

    expect( videoProjectSupportFiles.exists() ).toEqual( true );
    expect( toJSON( videoProjectSupportFiles ) ).toMatchSnapshot();

    // restore console.error
    console.error = consoleError;
  } );
} );
