import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

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

  return (
    <Label
      key={ value }
      data-label={ value }
      className={ single ? 'single' : '' }
      onClick={ !single ? handleOnClick : null }
    >
      { label }
      { !single && <Icon name="delete" filter={ filter } /> }
    </Label>
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
