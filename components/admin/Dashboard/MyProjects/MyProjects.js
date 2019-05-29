/**
 *
 * MyProjects
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu/ScrollableTableWithMenu';
import './MyProjects.scss';

const persistentTableHeaders = [
  { name: 'projectTitle', label: 'PROJECT TITLE' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'updatedAt', label: 'MODIFIED' },
  { name: 'team', label: 'TEAM' }
];

const menuItems = [
  { name: 'author', label: 'AUTHOR' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'createdAt', label: 'DATE' },
];

const MyProjects = props => (
  <ScrollableTableWithMenu
    columnMenu={ menuItems }
    persistentTableHeaders={ persistentTableHeaders }
    team={ props.user.team.name }
  />
);

MyProjects.propTypes = {
  user: PropTypes.object
};

export default MyProjects;
