/**
 *
 * ProjectHeader
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import styles from './ProjectHeader.module.scss';

const ProjectHeader = props => {
  const { text, icon } = props;

  return (
    <header className={ `${styles.section} ${styles['section--project_header']}` }>
      <div className={ styles.project_header }>
        <h2 className={ styles.headline }>
          { icon && <Icon name={ icon } size="tiny" circular inverted /> }
          <span className={ styles.project_header_text }>{ text }</span>
        </h2>
      </div>

      <div className={ styles.project_buttons }>
        { props.children }
      </div>
    </header>
  );
};

ProjectHeader.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  icon: PropTypes.string,
};

export default ProjectHeader;
