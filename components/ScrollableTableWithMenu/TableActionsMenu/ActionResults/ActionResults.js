import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import ActionResultsError from './ActionResultsError/ActionResultsError';
import ActionResultsItem from './ActionResultsItem/ActionResultsItem';

const ActionResults = ( { failures } ) => {
  const isError = failures && failures.length > 0;
  return (
    <List>
      { !isError && (
        <ActionResultsItem />
      ) }
      { isError && failures.map( failure => (
        <ActionResultsError { ...failure } key={ failure.project.id } />
      ) ) }
    </List>
  );
};

ActionResults.propTypes = {
  failures: PropTypes.arrayOf( PropTypes.object )
};

export default ActionResults;
