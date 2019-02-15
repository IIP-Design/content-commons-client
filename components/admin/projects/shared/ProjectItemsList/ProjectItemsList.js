/**
 *
 * ProjectItemsList
 *
 */

import React from 'react';
import {
  array, bool, func, object, string
} from 'prop-types';

import ProjectItem from 'components/admin/projects/shared/ProjectItem/ProjectItem';
import './ProjectItemsList.scss';

const ProjectItemsList = props => {
  const {
    listEl,
    data,
    projectId,
    headline,
    hasSubmittedData,
    projectType,
    displayItemInModal,
    modalTrigger,
    modalContent,
    customListStyle,
    customPlaceholderStyle
  } = props;

  const List = listEl;

  const defaultListStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(13em, 1fr))',
    gridGap: '1.5em 1em',
    paddingLeft: '0',
    listStyle: 'none'
  };

  const listStyle = { ...defaultListStyle, ...customListStyle };

  return (
    <div className="project-items">
      <h2 className="list-heading">{ headline }</h2>
      <List className="items-list" style={ listStyle }>
        { data.map( item => (
          <ProjectItem
            key={ `${item.title} - ${item.language.locale}` }
            isAvailable={ hasSubmittedData }
            type={ projectType }
            displayItemInModal={ displayItemInModal }
            projectId={ projectId }
            itemId={ item.id }
            modalTrigger={ modalTrigger }
            modalContent={ modalContent }
            customPlaceholderStyle={ customPlaceholderStyle }
          />
        ) ) }
      </List>
    </div>
  );
};

ProjectItemsList.propTypes = {
  listEl: string,
  data: array.isRequired,
  projectId: object.isRequired,
  headline: string,
  hasSubmittedData: bool,
  projectType: string.isRequired,
  displayItemInModal: bool,
  modalTrigger: func,
  modalContent: func,
  customListStyle: object,
  customPlaceholderStyle: object
};

ProjectItemsList.defaultProps = {
  listEl: 'ul'
};

export default ProjectItemsList;
