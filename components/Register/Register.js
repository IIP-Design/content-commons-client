/**
 *
 *  Register
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Tab } from 'semantic-ui-react';
import SelectRole from './SelectRole/SelectRole';
import UserDetails from './UserDetails/UserDetails';
import TeamDetails from './TeamDetails/TeamDetails';
import ReviewSubmit from './ReviewSubmit/ReviewSubmit';
// import RegisterPending from './RegisterPending/RegisterPending';
import './Register.scss';

const WHITELIST_QUERY = gql`
  query WHITELIST_QUERY($email: String!) {
    isWhitelisted(email: $email)
  }
`;

/* eslint-disable react/prefer-stateless-function */
class Register extends Component {
  state = {
    activeIndex: 0,
    showTeamDetails: false,
    view: 'form',
    data: {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      country: '',
      city: '',
      permissions: 'EDITOR',
      howHeard: '',
      team: {
        id: '', // this will be different
        name: '',
        organization: '',
        contentTypes: []
      }
    },
    consentChecked: false
  }

  emptyTeam = {
    id: '',
    name: '',
    organization: '',
    contentTypes: []
  }

  panes = [
    {
      menuItem: 'Select Role',
      render: () => (
        <Tab.Pane attached={ false }>
          <SelectRole
            user={ this.state.data }
            updateState={ this.updateState }
            teamDetails={ this.state.showTeamDetails }
            showTeamDetails={ this.showTeamDetails }
            hideTeamDetails={ this.hideTeamDetails }
            goNext={ this.goNext }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Team Details',
      render: () => (
        <Tab.Pane attached={ false }>
          <TeamDetails
            user={ this.state.data }
            updateState={ this.updateState }
            goBack={ this.goBack }
            goNext={ this.goNext }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'User Details',
      render: () => (
        <Tab.Pane attached={ false }>
          <UserDetails
            user={ this.state.data }
            error={ this.state.error }
            updateState={ this.updateState }
            goBack={ this.goBack }
            goNext={ this.goNext }
            isWhitelisted={ this.isWhitelisted }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: 'Review & Submit',
      render: () => (
        <Tab.Pane attached={ false }>
          <ReviewSubmit
            user={ this.state.data }
            goBack={ this.goBack }
            consentChecked={ this.state.consentChecked }
            toggleConsentChecked={ this.toggleConsentChecked }
            handleSignUpUserSuccess={ this.handleSignUpUserSuccess }
          />
        </Tab.Pane>
      )
    },
  ]

  getPanes () {
    return this.panes.filter( pane => ( pane.menuItem !== 'Team Details' || this.state.showTeamDetails ) );
  }


  updateState = data => {
    this.setState( state => ( { ...state, data: { ...state.data, ...data } } ) );
  }

  toggleConsentChecked = () => {
    this.setState( prevState => ( {
      consentChecked: !prevState.consentChecked
    } ) );
  }

  hideTeamDetails = () => {
    this.setState( {
      showTeamDetails: false
    } );

    // TeamDetails has been removed, reset team state
    this.updateState( {
      team: { ...this.emptyTeam }
    } );
  }

  showTeamDetails = () => {
    if ( !this.state.showTeamDetails ) {
      this.setState( {
        showTeamDetails: true
      } );

      this.updateState( {
        permissions: 'TEAM_ADMIN',
        team: { ...this.emptyTeam }
      } );
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

  handleSignUpUserSuccess = () => {
    this.setState( {
      view: 'confirmation'
    } );
  }

  isWhitelisted = async email => {
    const { client } = this.props;
    try {
      const result = await client.query( {
        query: WHITELIST_QUERY,
        variables: { email }
      } );
      return result.data.isWhitelisted;
    } catch ( err ) {
      return false;
    }
  };

  render() {
    const { activeIndex, view } = this.state;

    if ( view === 'confirmation' ) {
      // if ( this.state.data.permissions === 'TEAM_ADMIN' ) {
      //   return <RegisterPending />;
      // }
      return (
        <div className="register register_wrapper">
          <h1 className="register_title">Confirm Registration</h1>
          <div style={ { textAlign: 'center' } }>Please check your email to complete your registration.</div>
        </div>
      );
    }

    return (
      <div className="register register_wrapper">
        <h1 className="register_title">Register</h1>
        <Tab
          menu={ { secondary: true, pointing: true } }
          panes={ this.getPanes() }
          activeIndex={ activeIndex }
        />
      </div>
    );
  }
}

Register.propTypes = {
  client: PropTypes.object
};

export default withApollo( Register );
