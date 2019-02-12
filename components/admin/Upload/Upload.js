/**
 *
 * PageUpload
 *
 */
import React, { Component } from 'react';
import Link from 'next/link';
import {
  Button,
  Modal,
  Form,
  Checkbox
} from 'semantic-ui-react';
import imageIcon from 'static/icons/icon_150px_images_blue.png';
import docIcon from 'static/icons/icon_150px_document_blue.png';
import eduIcon from 'static/icons/icon_150px_edu_blue.png';
import videoIcon from 'static/icons/icon_150px_video_blue.png';
import audioIcon from 'static/icons/icon_150px_audio_blue.png';
import './Upload.scss';

// as="video/234/edit"

class Upload extends Component {
  state = {
    modalOpen: false
  }

  handleModalOpen = () => {
    this.setState( { modalOpen: true } );
  }

  handleModalClose = () => {
    this.setState( { modalOpen: false } );
  }

  render() {
    const { modalOpen } = this.state;
    return (
      <div>
        <h1>Upload Content</h1>
        <section className="upload-content">
          <div className="contentTypes">
            <Button className="type disabled" aria-label="Upload Audio Content">
              <img src={ audioIcon } alt="Upload Audio Content" />
              <span>Audio</span>
            </Button>

            <Button
              className="type"
              aria-label="Upload Video Content"
              onClick={ this.handleModalOpen }
            >
              <img src={ videoIcon } alt="Upload video content" />
              <span>Videos</span>
            </Button>
            <Modal
              open={ modalOpen }
              onClose={ this.handleModalClose }
            >
              <Modal.Header>What type of video project is this?</Modal.Header>
              <Modal.Content>
                <Form>
                  <Form.Field>
                    <div>
                      <Checkbox
                        radio
                        label="One video with its variations and assets"
                      />
                      <p>Select for importing video files and assets that are translated variations for one video.</p>
                    </div>
                    <div>
                      <Checkbox
                        radio
                        label="A set of videos that are related and their assets"
                      />
                      <p>Select for bulk importing multiple videos that are related to each other, but not variations of the same video.</p>
                    </div>
                    <div>
                      <Checkbox
                        radio
                        label="Unrelated video files and their assets"
                      />
                      <p>Select for bulk importing multiple videos that are unrelated to each other.</p>
                    </div>
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button content="Cancel" />
                <Button content="Next" />
              </Modal.Actions>
            </Modal>


            <Button className="type disabled" aria-label="Upload Image Content">
              <img src={ imageIcon } alt="Upload images content" />
              <span>Images</span>
            </Button>
            <Button className="type disabled" aria-label="Upload Document Content">
              <img src={ docIcon } alt="Upload document content" />
              <span>Documents</span>
            </Button>
            <Button className="type disabled" aria-label="Upload Teaching Material Content">
              <img src={ eduIcon } alt="Upload teaching material content" />
              <span>Teaching Materials</span>
            </Button>
          </div>
        </section>

        <section className="upload_information">
          <div className="upload_information_advisory">
            <h3>Only upload files that:</h3>
            <ol>
              <li>You have the right to upload.</li>
              <li>Are allowed on the CDP servers.</li>
            </ol>
            <p>Still have questions?</p>
            <p>Read our <Link href="/about"><a>FAQs</a></Link> about uploading content.</p>
          </div>
          <div className="upload_information_bestResults">
            <h3>For best results:</h3>
            <p>We recommend naming files descriptively using keywords or languages, ex: "project-tile_arabic.jpg", to help pre-populate metadata fields and save you time when uplaoding content!</p>
          </div>
        </section>
      </div>
    );
  }
}

export default Upload;
