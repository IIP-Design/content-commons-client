/**
 *
 * MyProjects
 *
 */
import React, { Fragment, useEffect, useReducer } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useAuth } from 'context/authContext';
import { DashboardContext, dashboardReducer } from 'context/dashboardContext';

const ScrollableTableWithMenu = dynamic( () => import( /* webpackChunkName: "ScrollableTableWithMenu" */ 'components/ScrollableTableWithMenu/ScrollableTableWithMenu' ) );

const persistentTableHeaders = [
  { name: 'projectTitle', label: 'PROJECT TITLE' },
  { name: 'createdAt', label: 'CREATED' },
  { name: 'visibility', label: 'VISIBILITY' },
  { name: 'author', label: 'AUTHOR' },
];

const menuItems = [
  { name: 'team', label: 'TEAM' },
  { name: 'categories', label: 'CATEGORIES' },
  { name: 'updatedAt', label: 'MODIFIED DATE' },
];

const TeamProjects = () => {
  const { user } = useAuth();
  const team = user?.team;

  const [state, dispatch] = useReducer( dashboardReducer );

  useEffect( () => {
    dispatch( { type: 'UPDATE_TEAM', payload: { team } } );
  }, [user] );

  if ( !team ) return null;

  const uploadLink = <Link href="/admin/upload" passHref><a className="linkStyle">upload a project</a></Link>;
  const browseLink = <Link href="/" passHref><a className="linkStyle">browse for other PD content</a></Link>;

  // If a team does not have any contentTypes associated with it then display message with links
  if ( !team.contentTypes.length ) {
    return (
      <Fragment>
        <p>There aren&apos;t any team projects available to view.</p>
        <p>{`You can ${uploadLink} or ${browseLink}.`}</p>
      </Fragment>
    );
  }

  // Hide category column if viewing Packages
  const setMenuItems = () => {
    let columnMenuItems = menuItems;

    if ( team.contentTypes.includes( 'PACKAGE' ) ) {
      columnMenuItems = menuItems.filter( item => item.name !== 'categories' );
    }

    return columnMenuItems;
  };

  return (
    <DashboardContext.Provider value={ { dispatch, state } }>
      <ScrollableTableWithMenu
        columnMenu={ setMenuItems() }
        persistentTableHeaders={ persistentTableHeaders }
        team={ team }
        projectTab="teamProjects"
      />
    </DashboardContext.Provider>
  );
};

export default TeamProjects;
