import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  Form, Button, Modal, Select
} from 'semantic-ui-react';
import { USERS_QUERY } from 'components/admin/dropdowns/UserDropdown/UserDropdown';
import { titleCase } from 'lib/utils';
import { CURRENT_USER_QUERY } from 'components/User/User';

const GET_TEAMS_QUERY = gql`
  {
    teams(orderBy: name_ASC) {
      id
      name
    }
  }
`;

const PERMISSION_QUERY = gql`
  query PERMISSION_QUERY {
    __type(name: "Permission") {
      enumValues {
        name
      }
    }
  }
`;


const UPDATE_USER_MUTATION = gql`
  mutation UPDATE_USER_MUTATION($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
      team {
        id
        name
      }
    }
  }
`;

const UserAdmin = () => {
  const [open, setOpen] = useState( false );
  const [teams, setTeams] = useState( [] );
  const [users, setUsers] = useState( [] );
  const [permissions, setPermissions] = useState( [] );
  const [loggedInUser, setLoggedInUser] = useState();

  const { data: teamData } = useQuery( GET_TEAMS_QUERY );
  const { data: usersData } = useQuery( USERS_QUERY );
  const { data: permissionData } = useQuery( PERMISSION_QUERY );
  const { data: loggedInUserData } = useQuery( CURRENT_USER_QUERY );
  const [updateUser, { error, data }] = useMutation( UPDATE_USER_MUTATION );


  const [values, setValues] = useState( {
    user: '',
    team: '',
    permission: ''
  } );

  useEffect( () => {
    if ( usersData ) {
      const userOptions = usersData.users.map( user => ( {
        key: user.id,
        text: `${user.lastName}, ${user.firstName} [${user.email}]`,
        value: user.id
      } ) );

      setUsers( userOptions );
    }
  }, [usersData] );

  useEffect( () => {
    if ( teamData ) {
      const teamOptions = teamData.teams.map( team => ( {
        key: team.id,
        text: team.name,
        value: team.id
      } ) );

      setTeams( teamOptions );
    }
  }, [teamData] );

  useEffect( () => {
    if ( permissionData ) {
      const permissionOptions = permissionData.__type.enumValues.map( value => ( {
        key: value.name,
        text: titleCase( value.name ).replace( '_', ' ' ),
        value: value.name
      } ) );

      setPermissions( permissionOptions );
    }
  }, [permissionData] );

  useEffect( () => {
    if ( loggedInUserData ) {
      console.dir( loggedInUserData );
      setLoggedInUser( loggedInUserData.authenticatedUser );
    }
  }, [loggedInUserData] );


  // if ( teamLoading ) return 'Loading...';
  // if ( teamError ) return `Error! ${error.message}`;


  // const changeTeam = () => {
  //   const { authenticatedUser } = userData;
  //   if ( authenticatedUser ) {
  //     changeUserTeam( {
  //       variables: {
  //         userId: authenticatedUser.id,
  //         teamId: values.userTeam
  //       }
  //     } ).catch( err => '' );
  //   }
  // };

  const handleSave = async () => {
    await updateUser( {
      variables: {
        data: {
          permissions: {
            set: [values.permission]
          },
          team: {
            connect: { id: values.team }
          }
        },
        where: {
          id: values.user
        }
      }
    } ).catch( err => console.dir( err ) );
  };

  const handleChangeUser = ( e, { value } ) => {
    const { users: _users } = usersData;
    const user = _users.find( u => u.id === value );

    setValues( {
      user: value,
      team: user.team ? user.team.id : '',
      permission: user.permissions && user.permissions.length ? user.permissions[0] : ''
    } );
  };


  return (
    <div style={ { position: 'absolute', zIndex: 5 } }>
      { loggedInUser && loggedInUser.permissions.includes( 'ADMIN' ) && (
        <Button color="black" icon="user" onClick={ () => setOpen( true ) } />
      ) }
      <Modal
        closeIcon
        style={ { width: '520px', height: '300px' } }
        open={ open }
        onClose={ () => setOpen( false ) }
      >
        <Modal.Content>
          <p style={ { color: 'red', marginBottom: '15px' } }>{ error && error.message }</p>
          <p style={ { color: '#2e8540', marginBottom: '15px' } }>{ data && 'User updated' }</p>

          <Form>
            <Form.Field>
              <label>User</label>
              <Select
                placeholder="Select user"
                options={ users }
                value={ values.user }
                onChange={ handleChangeUser }
              />
            </Form.Field>
            <Form.Field>
              <label>Team</label>
              <Select
                placeholder="Select team"
                options={ teams }
                value={ values.team }
                onChange={ ( e, { value } ) => setValues( { ...values, team: value } ) }
              />
            </Form.Field>
            <Form.Field>
              <label>Role</label>
              <Select
                placeholder="Select role"
                options={ permissions }
                value={ values.permission }
                onChange={ ( e, { value } ) => setValues( { ...values, permission: value } ) }
              />
            </Form.Field>
            <Button className="btn primary" onClick={ handleSave }>
              Save
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default UserAdmin;
