import React from 'react';
import PropTypes from 'prop-types';

const ActionHeadline = props => {
  const {
    className,
    el: Element,
    type,
    published,
    updated
  } = props;

  return (
    <Element className={ className }>
      { published && updated && `It looks like you made changes to your ${type}. Do you want to publish changes?` }
      { !published && `Your ${type} looks great! Are you ready to Publish?` }
      { published && !updated && 'Not ready to share with the world yet?' }
    </Element>
  );
};

ActionHeadline.defaultProps = {
  el: 'h3',
  type: 'project'
};

ActionHeadline.propTypes = {
  className: PropTypes.string,
  el: PropTypes.string,
  type: PropTypes.string,
  published: PropTypes.bool,
  updated: PropTypes.bool
};

export default ActionHeadline;
