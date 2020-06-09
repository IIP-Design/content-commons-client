import React from 'react';
import { string } from 'prop-types';
import Parser from 'html-react-parser';
import './ModalText.scss';

const ModalText = props => {
  const { textContent } = props;

  return (
    <section className="modal_section modal_section--textContent">
      <div className="textContent">
        { Parser( textContent ) }
      </div>
    </section>
  );
};

ModalText.propTypes = {
  textContent: string,
};

export default ModalText;
