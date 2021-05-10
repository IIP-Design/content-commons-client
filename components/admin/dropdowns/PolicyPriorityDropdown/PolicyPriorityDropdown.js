import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { Form } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

const POLICY_PRIORITIES_QUERY = gql`
  query POLICY_PRIORITIES_QUERY {
    policyPriorities(orderBy: name_ASC) {
      id
      name
      theme
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const PolicyPriorityDropdown = ( {
  id,
  label,
  name,
  variables,
  ...rest
} ) => {
  const { data, loading, error } = useQuery( POLICY_PRIORITIES_QUERY, { variables } );

  if ( error ) return `Error! ${error.message}`;

  let options = [];

  if ( data?.policyPriorities ) {
    const { policyPriorities } = data;

    options = policyPriorities.map( priority => ( {
      key: priority.id,
      text: priority.name,
      value: priority.id,
    } ) );
  }

  return (
    <Fragment>
      { !label
        && (
          <VisuallyHidden>
            { /* eslint-disable-next-line */ }
            <label htmlFor={ id }>
              Policy Priority
            </label>
          </VisuallyHidden>
        ) }

      <Form.Dropdown
        id={ id }
        { ...( label && { label } ) }
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

PolicyPriorityDropdown.defaultProps = {
  id: '',
  name: 'policyPriority',
  variables: {},
};

PolicyPriorityDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  variables: PropTypes.object,
};

export default React.memo( PolicyPriorityDropdown, areEqual );

export { POLICY_PRIORITIES_QUERY };
