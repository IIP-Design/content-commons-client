import React from 'react';
import { node, string } from 'prop-types';
import './ModalItem.scss';
import './ModalItemRTL.scss';

const ModalItem = props => {
  const {
    className, headline, subHeadline, textDirection
  } = props;

  return (
    <div className={ `modal ${textDirection} ${className}` }>
      <h1 className="modal_headline">
        { headline }
        { subHeadline && (
          <span className="modal_subheadline">{ subHeadline }</span>
        ) }
      </h1>
      { props.children }
    </div>
  );
};

ModalItem.propTypes = {
  className: string,
  headline: string,
  children: node,
  subHeadline: string,
  textDirection: string
};

export default ModalItem;
