import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const DropdownSupportFileUse = props => {
  const { data, ...rest } = props;
  return <Dropdown { ...rest } options={ data.uses } />;
};

DropdownSupportFileUse.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  data: PropTypes.object,
  fluid: PropTypes.bool,
  required: PropTypes.bool,
  selection: PropTypes.bool,
  options: PropTypes.array
};

const SUPPORT_FILE_USES_QUERY = gql`
  query SupportFileUse($orderBy: SupportFileUseOrderByInput) {
    uses: supportFileUses(orderBy: $orderBy) {
      value: id
      text: name
    }
  }
`;

export default graphql( SUPPORT_FILE_USES_QUERY, {
  options: {
    variables: { orderBy: 'name_ASC' }
  }
} )( DropdownSupportFileUse );

export { SUPPORT_FILE_USES_QUERY };
