import React from 'react';
import * as PropTypes from 'prop-types';
import { List } from 'semantic-ui-react';

const ActionResultsItem = ( { isError, children } ) => (
  <List.Item>
    <List.Icon
      color={ isError ? 'red' : 'green' }
      name={ isError ? 'exclamation triangle' : 'check circle outline' }
      size="big"
    />
    <List.Content style={ { fontSize: '1rem', verticalAlign: 'middle' } }>
      { !isError && (
        <List.Description>
          You&rsquo;ve updated your projects successfully.
        </List.Description>
      ) }
      { children }
    </List.Content>
  </List.Item>
);

ActionResultsItem.propTypes = {
  isError: PropTypes.bool,
  children: PropTypes.oneOfType( [PropTypes.array, PropTypes.element] )
};

export default ActionResultsItem;
