import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import '../menu.scss';

class NotificationsMenu extends Component {
  render() {
    return (
      <div className="nav_submenu">
        <div className="nav_submenu_header">
          <p className="nav_submenu_header_item nav_submenu_header_item--title">Notifications</p>
          <Link href="/help">
            <a className="nav_submenu_header_item">
              <span onClick={ this.props.closePopup() } role="presentation">
                Help
              </span>
            </a>
          </Link>
        </div>
        <section className="nav_submenu_section">
          <p>Notifications appear here.</p>
        </section>
      </div>
    );
  }
}

NotificationsMenu.propTypes = {
  closePopup: PropTypes.func
};

export default NotificationsMenu;
