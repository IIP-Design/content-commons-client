import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const DropdownSupportFileUse = props => {
  const { data, ...rest } = props;
  if ( data.loading ) return 'Loading file use...';
  if ( data.error ) return 'Loading error...';
  return <Dropdown { ...rest } options={ data.uses } selection />;
};

DropdownSupportFileUse.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  data: PropTypes.object,
  fluid: PropTypes.bool,
  required: PropTypes.bool
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
