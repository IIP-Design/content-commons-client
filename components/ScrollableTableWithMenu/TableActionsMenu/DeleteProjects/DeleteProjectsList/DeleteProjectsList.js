import React from 'react';
import PropTypes from 'prop-types';
import './DeleteProjectsList.scss';

const displayProjectTitle = project => {
  let title = '';
  if ( project.__typename === 'VideoProject' ) title = project.projectTitle;
  if ( project.__typename === 'Package' ) title = project.title;
  return title;
}

const DeleteProjectsList = props => {
  const { headline, isDrafts, projects } = props;

  return (
    <div className="list-container">
      <p id={ `delete-${isDrafts ? '' : 'non-'}drafts-desc` }>
        { headline }
      </p>
      <ul
        className="delete-list"
        aria-describedby={ `delete-${isDrafts ? '' : 'non-'}drafts-desc` }
      >
        { projects.map( project => (
          <li key={ project.id } className="delete-list-item">
            { displayProjectTitle( project ) }
          </li>
        ) ) }
      </ul>
    </div>
  );
};

DeleteProjectsList.propTypes = {
  headline: PropTypes.string,
  isDrafts: PropTypes.bool,
  projects: PropTypes.array
};

DeleteProjectsList.defaultProps = {
  isDrafts: false,
  projects: []
};

export default DeleteProjectsList;
