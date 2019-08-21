import React from 'react';
import ProjectSupportFiles from '../ProjectSupportFiles';
import { config } from './config';

const updateDatabase = files => {
  console.log( 'updateFiles' );
  console.dir( files );
};

const removeFromDataBase = files => {
  console.log( 'removeFiles' );
  console.dir( files );
};


const VideoProjectSupportFiles = props => (
  <ProjectSupportFiles
    { ...props }
    updateDatabase={ updateDatabase }
    removeFromDataBase={ removeFromDataBase }
    config={ config.supportFiles }
  />
);

export default VideoProjectSupportFiles;
