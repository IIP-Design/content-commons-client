import React from 'react';
import { shallow } from 'enzyme';

import VideoSupportFiles from './VideoSupportFiles';

describe( '<VideoSupportFiles />', () => {
  it( 'renders without crashing', () => {
    shallow( <VideoSupportFiles /> );
  } );
} );
