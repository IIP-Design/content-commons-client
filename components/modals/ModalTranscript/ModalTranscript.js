import React from 'react';
import { string } from 'prop-types';
import './ModalTranscript.scss';

const ModalTranscript = props => {
  const { transcript, classes } = props;

  return (
    <div className={ classes }>
      <p className="transcript_label">Transcript:</p>
      <div className="transcript_text">
        { transcript }
      </div>
    </div>
  );
};

ModalTranscript.propTypes = {
  transcript: string,
  classes: string
};

export default ModalTranscript;
