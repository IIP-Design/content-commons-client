/**
 *
 * ProjectSupportFiles
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import SupportFileTypeList from 'components/admin/projects/ProjectEdit/SupportFileTypeList/SupportFileTypeList';

import './ProjectSupportFiles.scss';

const ProjectSupportFiles = props => {
  const {
    heading,
    projectId,
    config
  } = props;


  const fileTypes = Object.keys( config );

  const renderFileTypes = type => (
    <Fragment key={ `file-type-${type}` }>
      <Grid.Column>
        <SupportFileTypeList
          projectId={ projectId }
          config={ config[type] }
        />

      </Grid.Column>
    </Fragment>
  );

  return (
    <div className="support-files">
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={ 16 }>
            <h2 className="heading uppercase">{ heading }</h2>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row columns={ fileTypes.length } divided>
          { fileTypes.map( renderFileTypes ) }
        </Grid.Row>

      </Grid>
    </div>
  );
};

ProjectSupportFiles.propTypes = {
  heading: PropTypes.string,
  projectId: PropTypes.string,
  config: PropTypes.object.isRequired,
};

export default ProjectSupportFiles;
