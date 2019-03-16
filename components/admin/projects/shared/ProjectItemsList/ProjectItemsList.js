/**
 *
 * ProjectItemsList
 *
 */

import React from 'react';
import {
  bool, func, object, string
} from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import ProjectItem from 'components/admin/projects/shared/ProjectItem/ProjectItem';
import './ProjectItemsList.scss';

const ProjectItemsList = props => {
  const {
    listEl,
    data: { error, loading, project: { units } },
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

  if ( loading ) return 'Loading the project items...';
  if ( error ) return `Error! ${error.message}`;

  return (
    <div className="project-items">
      <h2 className="list-heading">{ headline }</h2>
      <List className="items-list" style={ listStyle }>
        { units.map( unit => (
          <ProjectItem
            key={ `${unit.title} - ${unit.language.languageCode}` }
            isAvailable={ hasSubmittedData }
            type={ projectType }
            displayItemInModal={ displayItemInModal }
            projectId={ projectId }
            itemId={ unit.id }
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
  data: object.isRequired,
  projectId: string.isRequired,
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

const PROJECT_ITEMS_QUERY = gql`
  query ProjectItems($id: ID!) {
    project: videoProject(id: $id) {
      units {
        id
        title
        language {
          languageCode
        }
      }
    }
  }
`;

export default graphql( PROJECT_ITEMS_QUERY, {
  options: props => ( {
    variables: {
      id: props.projectId
    },
  } )
} )( ProjectItemsList );
export { PROJECT_ITEMS_QUERY };
