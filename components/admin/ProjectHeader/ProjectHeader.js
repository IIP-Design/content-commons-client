/**
 *
 * ProjectHeader
 *
 */

import React from 'react';
import { node, string } from 'prop-types';
import { Icon } from 'semantic-ui-react';
import './ProjectHeader.scss';

const ProjectHeader = props => {
  const { text, icon } = props;

  return (
    <header className="section section--project_header">
      <div className="project_header">
        <h2 className="headline">
          { icon && <Icon name={ icon } size="tiny" circular inverted /> }
          <span className="project_header_text">{ text }</span>
        </h2>
      </div>

      <div className="project_buttons">
        { props.children }
      </div>
    </header>
  );
};

ProjectHeader.propTypes = {
  children: node,
  text: string,
  icon: string
};

export default ProjectHeader;
