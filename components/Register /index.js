/**
 *
 *  Register
 *
 */

import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import SelectRole from './SelectRole';
import UserDetails from './UserDetails';
import TeamDetails from './TeamDetails';
import ReviewSubmit from './ReviewSubmit';
import './Register.scss';


/* eslint-disable react/prefer-stateless-function */
class Register extends Component {
  state = {
    activeIndex: 0,
    data: {
      permissions: '',
      team: '',
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      country: '',
      city: '',
      howHeard: '',
      teamName: '',
      organization: '',
      contentType: []
    },
    panes: [
      {
        menuItem: 'Select Role',
        render: () => (
          <Tab.Pane attached={ false }>
            <SelectRole
              data={ this.state.data }
              updateState={ this.updateState }
              showTeamDetail={ this.showTeamDetailsTab }
              goNext={ this.goNext }
            />
          </Tab.Pane> )
      },
      {
        menuItem: 'User Details',
        render: () => (
          <Tab.Pane attached={ false }>
            <UserDetails
              data={ this.state.data }
              error={ this.state.error }
              updateState={ this.updateState }
              goBack={ this.goBack }
              goNext={ this.goNext }
            />
          </Tab.Pane> )
      },
      {
        menuItem: 'Review Submit',
        render: () => (
          <Tab.Pane attached={ false }>
            <ReviewSubmit
              data={ this.state.data }
              goBack={ this.goBack }
            />
          </Tab.Pane>
        )
      },
    ]
  }

  updateState = data => {
    this.setState( state => ( { ...state, data: { ...state.data, ...data } } ) );
  }

  showTeamDetailsTab = () => {
    const { panes } = this.state;

    if ( panes.length !== 4 ) {
      const teamDetailTab = {
        menuItem: 'Team Details',
        render: () => (
          <Tab.Pane attached={ false }>
            <TeamDetails
              data={ this.state.data }
              updateState={ this.updateState }
              goBack={ this.goBack }
              goNext={ this.goNext }
            />
          </Tab.Pane> )
      };
      panes.splice( 1, 0, teamDetailTab );
      this.setState( { panes } );
    }
    // Take user to team details tab
    this.setState( { activeIndex: 1 } );
  }

  goBack = () => {
    this.setState( state => ( { activeIndex: state.activeIndex - 1 } ) );
  }

  goNext = () => {
    this.setState( state => ( { activeIndex: state.activeIndex + 1 } ) );
  }

  render() {
    const {
      activeIndex,
      panes
    } = this.state;

    return (
      <div className="register register_wrapper">

        <h1 className="register_title">Register</h1>
        <Tab
          menu={ { secondary: true, pointing: true } }
          panes={ panes }
          activeIndex={ activeIndex }
        />
      </div>
    );
  }
}

export default Register;
