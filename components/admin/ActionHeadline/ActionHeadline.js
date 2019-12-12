import React from 'react';
import PropTypes from 'prop-types';

const ActionHeadline = props => {
  const {
    className,
    el: Element,
    notPublished,
    publishedAndUpdated,
    publishedAndNotUpdated,
    type
  } = props;

  return (
    <Element className={ className }>
      { publishedAndUpdated && `It looks like you made changes to your ${type}. Do you want to publish changes?` }
      { notPublished && `Your ${type} looks great! Are you ready to Publish?` }
      { publishedAndNotUpdated && 'Not ready to share with the world yet?' }
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
  notPublished: PropTypes.bool,
  publishedAndUpdated: PropTypes.bool,
  publishedAndNotUpdated: PropTypes.bool,
  type: PropTypes.string
};

export default ActionHeadline;
