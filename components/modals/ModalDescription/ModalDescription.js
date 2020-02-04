import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { parseHtml } from 'lib/utils';
import './ModalDescription.scss';

const ModalDescription = props => {
  const { description } = props;

  return (
    <section className="modal_section modal_section--description">
      { description.html && (
        <ReactMarkdown
          className="modal_description_text"
          source={ description.html }
          // must sanitize html during docx conversion
          escapeHtml={ false }
          astPlugins={ [parseHtml] }
        />
      ) }
      { !description.html && <p className="modal_description_text">{ description }</p> }
    </section>
  );
};

ModalDescription.propTypes = {
  description: PropTypes.oneOfType( [
    PropTypes.string,
    PropTypes.object
  ] ),
};

export default ModalDescription;
