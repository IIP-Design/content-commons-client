import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';
import { getPluralStringOrNot } from 'lib/utils';
import ActionResultsItem from './ActionResultsItem/ActionResultsItem';

const ActionResultError = ( { action, errors, projectTitle } ) => {
  const withErrors = errors.length >= 1 ? ` with ${getPluralStringOrNot( errors, 'error' )}:` : '';
  const header = `Project '${projectTitle}' ${action} failed${withErrors}`;
  return (
    <ActionResultsItem isError>
      <List.Header>{ header }</List.Header>
      { errors.length > 0 && (
        <List.Description>
          <List items={ errors } style={ { paddingTop: '0.25em', paddingBottom: '0.75em' } } />
        </List.Description>
      ) }
    </ActionResultsItem>
  );
};

ActionResultError.propTypes = {
  action: PropTypes.string,
  errors: PropTypes.array,
  projectTitle: PropTypes.string
};

export default ActionResultError;
