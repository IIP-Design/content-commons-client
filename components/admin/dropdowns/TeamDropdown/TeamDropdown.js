import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { Form } from 'semantic-ui-react';
import sortBy from 'lodash/sortBy';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

const TEAMS_QUERY = gql`
  query TEAMS_QUERY($where: TeamWhereInput) {
    teams(where: $where) {
      id
      name
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const TeamDropdown = ( {
  id,
  label,
  name,
  variables,
  ...rest
} ) => {
  const { data, loading, error } = useQuery( TEAMS_QUERY, { variables } );

  if ( error ) return `Error! ${error.message}`;

  let options = [];

  if ( data?.teams ) {
    const { teams } = data;

    options = sortBy( teams, team => team.name )
      .map( t => ( { key: t.id, text: t.name, value: t.id } ) );
  }

  return (
    <Fragment>
      { !label
        && (
          <VisuallyHidden>
            <label htmlFor={ id }>
              { `${id} team` }
            </label>
          </VisuallyHidden>
        ) }

      <Form.Dropdown
        id={ id }
        { ...( label && { label } ) }
        // label={ label }
        name={ name }
        options={ options }
        placeholder="–"
        loading={ loading }
        fluid
        selection
        { ...rest }
      />
    </Fragment>
  );
};

TeamDropdown.defaultProps = {
  id: '',
  name: 'team',
  variables: {},
};

TeamDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  variables: PropTypes.object,
};

export default React.memo( TeamDropdown, areEqual );

export { TEAMS_QUERY };
