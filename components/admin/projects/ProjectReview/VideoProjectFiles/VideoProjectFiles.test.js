import React from 'react';
import { shallow } from 'enzyme';

import VideoProjectFiles from './VideoProjectFiles';

describe( '<VideoProjectFiles />', () => {
  it( 'renders without crashing', () => {
    shallow( <VideoProjectFiles /> );
  } );
} );
