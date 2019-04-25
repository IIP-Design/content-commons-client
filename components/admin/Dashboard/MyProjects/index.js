/**
 *
 * MyProjects
 *
 */
import React, { Fragment } from 'react';
import User from 'components/User/User';
import ScrollableTableWithMenu from 'components/ScrollableTableWithMenu';
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

const MyProjects = () => (
  <Fragment>
    <p className="myProjects_headline">
      Overview, Team Projects, Favorites, and Collections coming in future iterations!
    </p>
    <User>
      { ( { data } ) => {
        const team = ( data && data.authenticatedUser && data.authenticatedUser.team )
          ? data.authenticatedUser.team.name
          : null;

        return (
          <ScrollableTableWithMenu
            columnMenu={ menuItems }
            persistentTableHeaders={ persistentTableHeaders }
            team={ team }
          />
        );
      } }
    </User>
  </Fragment>
);

export default MyProjects;
