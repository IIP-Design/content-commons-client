import React from 'react';
import { node, string } from 'prop-types';
import './ModalItem.scss';
import './ModalItemRTL.scss';

const ModalItem = props => {
  const { className, headline, textDirection } = props;

  return (
    <div className={ `modal ${textDirection} ${className}` }>
      <h1 className="modal_headline">{ headline }</h1>
      { props.children }
    </div>
  );
};

ModalItem.propTypes = {
  className: string,
  headline: string,
  children: node,
  textDirection: string
};

export default ModalItem;
