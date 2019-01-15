import React from 'react';
import { string } from 'prop-types';
import './ModalDescription.scss';

const ModalDescription = props => {
  const { description } = props;
  return (
    <section className="modal_section modal_section--description">
      <p className="modal_description_text">{ description }</p>
    </section>
  );
};

ModalDescription.propTypes = {
  description: string
};

export default ModalDescription;
