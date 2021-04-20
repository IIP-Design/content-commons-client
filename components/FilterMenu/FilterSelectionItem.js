import React from 'react';
import PropTypes from 'prop-types';
import closeIcon from 'static/icons/icon_close.svg';

const FilterSelectionItem = props => {
  const {
    value,
    name,
    label,
    filter,
    single,
    onClick,
    className,
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
      className={ className }
      { ...( !single
        ? { onClick: handleOnClick, type: 'button' }
        : {} ) }
    >
      { label }
      { !single
        && (
          <img src={ closeIcon } alt="" height="12" width="9" />
        ) }
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
  className: PropTypes.string,
};

export default FilterSelectionItem;
