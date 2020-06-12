import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Icon } from 'semantic-ui-react';
import ModalTranscript from '../ModalTranscript/ModalTranscript';
import './ModalContentMeta.scss';

const ModalContentMeta = props => {
  const {
    type,
    dateUpdated: updated,
    transcript,
  } = props;
  const dateUpdated = moment( updated ).format( 'MMMM DD, YYYY' );

  const [isOpen, setIsOpen] = useState( false );

  const toggleTranscript = () => setIsOpen( !isOpen );

  return (
    <section className="modal_section modal_section--metaContent">
      <div className="modal_meta_wrapper">
        <div className="modal_meta">
          <span className="modal_meta_content modal_meta_content--filetype">
            { `File Type: ${type}` }
          </span>
          <span className="modal_meta_content modal_meta_content--date">
            { `Updated: ${dateUpdated}` }
          </span>
        </div>

        { transcript
          && (
            <div className="modal_transcript">
              <button
                className={ isOpen ? 'ui button transcriptDisplay' : 'ui button' }
                type="button"
                onClick={ toggleTranscript }
              >
                { isOpen ? 'Close Transcript' : 'Transcript' }
                <Icon name={ isOpen ? 'chevron up' : 'chevron down' } />
              </button>
            </div>
          ) }
      </div>

      { transcript
        && <ModalTranscript transcript={ transcript } classes={ isOpen ? 'transcript active' : 'transcript' } /> }
    </section>
  );
};

ModalContentMeta.propTypes = {
  type: PropTypes.string,
  dateUpdated: PropTypes.string,
  transcript: PropTypes.string,
};

export default ModalContentMeta;
