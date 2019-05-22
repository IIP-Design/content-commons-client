/**
 *
 * TableMobileDataToggleIcon
 *
 */
import React from 'react';
import { Icon } from 'semantic-ui-react';
import './TableMobileDataToggleIcon.scss';

const toggleMobileData = e => {
  e.persist();

  const parentTR = e.target.parentNode.parentNode;
  const isParentTRActive = parentTR.classList.contains( 'activeTableRow' );

  if ( !isParentTRActive ) {
    const currentActiveTableRow = document.querySelector( '.activeTableRow' );
    if ( currentActiveTableRow !== null ) {
      currentActiveTableRow.classList.remove( 'activeTableRow' );
      const currentActiveTableRowToggleIcon = currentActiveTableRow.querySelector( '.items_table_mobileDataToggleIcon' );
      currentActiveTableRowToggleIcon.classList.replace( 'up', 'down' );
    }
  }

  const DOMactiveTableRow = e.target.parentNode.parentNode;
  const DOMactiveTableRowToggleIcon = DOMactiveTableRow.querySelector( '.items_table_mobileDataToggleIcon' );

  DOMactiveTableRow.classList.toggle( 'activeTableRow' );

  if ( DOMactiveTableRowToggleIcon.classList.contains( 'down' ) ) {
    DOMactiveTableRowToggleIcon.classList.replace( 'down', 'up' );
  } else {
    DOMactiveTableRowToggleIcon.classList.replace( 'up', 'down' );
  }
};

const TableMobileDataToggleIcon = () => (
  <Icon
    name="chevron down"
    className="items_table_mobileDataToggleIcon"
    onClick={ toggleMobileData }
  />
);

export default TableMobileDataToggleIcon;
