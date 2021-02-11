/**
 *
 * MyProjects
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu/ScrollableTableWithMenu';

const persistentTableHeaders = [
  { name: 'projectTitle', label: 'PROJECT TITLE' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'createdAt', label: 'CREATED' },
  { name: 'team', label: 'TEAM' },
];

const menuItems = [
  { name: 'author', label: 'AUTHOR' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' },
];

const MyProjects = props => (
  <ScrollableTableWithMenu
    columnMenu={ menuItems }
    persistentTableHeaders={ persistentTableHeaders }
    team={ props.user.team.name }
    projectTab="myProjects"
  />
);

MyProjects.propTypes = {
  user: PropTypes.object,
};

export default MyProjects;
