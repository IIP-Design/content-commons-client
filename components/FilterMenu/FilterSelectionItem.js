import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';

const FilterSelectionItem = props => {
  const {
    value,
    name,
    label,
    filter,
    single,
    onClick,
  } = props;

  const handleOnClick = () => {
    onClick( {
      value,
      name,
    } );
  };

  const Component = single ? 'span' : 'button';

  return (
    <Component
      key={ value }
      data-label={ value }
      className="ui label"
      { ...( !single
        ? { onClick: handleOnClick, type: 'button' }
        : {}
      ) }
    >
      { label }
      { !single && <Icon name="delete" filter={ filter } /> }
    </Component>
  );
};

FilterSelectionItem.propTypes = {
  value: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  filter: PropTypes.string,
  single: PropTypes.bool,
  onClick: PropTypes.func,
};

export default FilterSelectionItem;
