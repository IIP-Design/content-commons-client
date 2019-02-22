import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon } from 'semantic-ui-react';

const FilterSelectionItem = props => {
  const handleOnClick = () => {
    props.onClick( {
      value: props.value,
      name: props.name
    } );
  };

  return (
    <Label key={ props.value } data-label={ props.value } className={ props.single ? 'single' : '' }>
      { props.label }
      { !props.single && <Icon name="delete" filter={ props.filter } onClick={ handleOnClick } /> }
    </Label>
  );
};

FilterSelectionItem.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  filter: PropTypes.string,
  single: PropTypes.bool,
  onClick: PropTypes.func,
  name: PropTypes.string
};

export default FilterSelectionItem;
