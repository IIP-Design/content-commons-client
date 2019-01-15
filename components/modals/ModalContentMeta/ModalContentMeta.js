import React, { Component } from 'react';
import moment from 'moment';
import { string } from 'prop-types';
import { Icon } from 'semantic-ui-react';
import ModalTranscript from '../ModalTranscript/ModalTranscript';
import './ModalContentMeta.scss';

class ModalContentMeta extends Component {
  constructor( props ) {
    super( props );

    this.state = {
      isOpen: false
    };

    this.toggleTranscript = this.toggleTranscript.bind( this );
  }

  toggleTranscript() {
    this.setState( { isOpen: !this.state.isOpen } );
  }

  render() {
    const { isOpen } = this.state;
    const {
      type,
      transcript
    } = this.props;
    const dateUpdated = moment( this.props.dateUpdated ).format( 'MMMM DD, YYYY' );

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
            && <div className="modal_transcript">
              <button
                className={ isOpen ? 'ui button transcriptDisplay' : 'ui button' }
                onClick={ this.toggleTranscript }
              >
                { isOpen ? 'Close Transcript' : 'Transcript' }
                <Icon name={ isOpen ? 'chevron up' : 'chevron down' } />
              </button>
            </div>
          }
        </div>
        { transcript
          && <ModalTranscript transcript={ transcript } classes={ isOpen ? 'transcript active' : 'transcript' } />
        }
      </section>
    );
  }
}

ModalContentMeta.propTypes = {
  type: string,
  dateUpdated: string,
  transcript: string
};

export default ModalContentMeta;
