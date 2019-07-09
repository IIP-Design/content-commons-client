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
  { name: 'createdAt', label: 'CREATED' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'author', label: 'AUTHOR' }
];

const menuItems = [
  { name: 'team', label: 'TEAM' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' },
];

const TeamProjects = props => (
  <ScrollableTableWithMenu
    columnMenu={ menuItems }
    persistentTableHeaders={ persistentTableHeaders }
    team={ props.user.team.name }
    projectTab="teamProjects"
  />
);

TeamProjects.propTypes = {
  user: PropTypes.object
};

export default TeamProjects;
