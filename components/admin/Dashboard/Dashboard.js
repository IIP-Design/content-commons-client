import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Tab, Popup, Image
} from 'semantic-ui-react';
import UserAdmin from 'components/User/UserAdmin'; // for testing purposes, allows changing of user props
import userIcon from 'static/icons/icon_user_profile_dark.svg';
import TeamProjects from './TeamProjects/TeamProjects';
import './Dashboard.scss';

/* eslint-disable react/prefer-stateless-function */
class Dashboard extends React.Component {
  renderPanes = () => {
    const { user } = this.props;
    return [
      {
        menuItem: {
          key: '1',
          content: <Popup
            trigger={ <span>Overview</span> }
            content="Coming Soon!"
            inverted
            position="bottom left"
          />,
          disabled: true
        },
        render: function OverviewTab() { return <Tab.Pane />; }
      },
      {
        menuItem: {
          key: '2',
          content: <Popup
            trigger={ <span>My Projects</span> }
            content="Coming Soon!"
            inverted
            position="bottom left"
          />,
          disabled: true
        },
        render: function MyProjectsTab() { return <Tab.Pane />; }
      },
      {
        menuItem: {
          key: '3',
          name: 'Team Projects'
        },
        render: function TeamProjectsTab() {
          return (
            <Tab.Pane>
              <TeamProjects user={ user } />
            </Tab.Pane>
          );
        }
      },
      {
        menuItem: {
          key: '4',
          content: <Popup
            trigger={ <span>Favorites</span> }
            content="Coming Soon!"
            inverted
            position="bottom left"
          />,
          disabled: true
        },
        render: function FavoritesTab() { return <Tab.Pane />; }
      },
      {
        menuItem: {
          key: '5',
          content: <Popup
            trigger={ <span>Collections</span> }
            content="Coming Soon!"
            inverted
            position="bottom left"
          />,
          disabled: true
        },
        render: function CollectionsTab() { return <Tab.Pane />; }
      }
    ];
  }

  render() {
    return (
      <section className="dashboard">
        <Grid stackable>
          <Grid.Column width={ 3 }>
            <Image src={ userIcon } avatar className="dashboard__avatar-img" />
            <span className="dashboard__avatar-label">Dashboard</span>
          </Grid.Column>
          <Grid.Column width={ 13 }>
            <UserAdmin />
            <Tab
              menu={ { text: true, stackable: true } }
              panes={ this.renderPanes() }
              defaultActiveIndex={ 2 }
            />
          </Grid.Column>
        </Grid>
      </section>
    );
  }
}

Dashboard.propTypes = {
  user: PropTypes.object
};

export default Dashboard;
