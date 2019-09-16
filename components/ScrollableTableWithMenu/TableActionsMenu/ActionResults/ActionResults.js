import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import ActionResultError from './ActionResultError';
import ActionResultsItem from './ActionResultsItem/ActionResultsItem';

const ActionResults = ( { failures } ) => {
  const isError = failures && failures.length > 0;
  return (
    <List>
      { !isError && (
        <ActionResultsItem isError={ false } />
      ) }
      { isError && failures.map( failure => (
        <ActionResultError { ...failure } key={ failure.id } />
      ) ) }
    </List>
  );
};

ActionResults.propTypes = {
  failures: PropTypes.arrayOf( PropTypes.object )
};

export default ActionResults;
