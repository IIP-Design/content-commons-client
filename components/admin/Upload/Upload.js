/**
 *
 * PageUpload
 *
 */
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery } from '@apollo/react-hooks';
import Link from 'next/link';
import { Button, Modal, Icon } from 'semantic-ui-react';
import dynamic from 'next/dynamic';
import imageIcon from 'static/icons/icon_150px_images_blue.png';
import docIcon from 'static/icons/icon_150px_document_blue.png';
import eduIcon from 'static/icons/icon_150px_edu_blue.png';
import videoIcon from 'static/icons/icon_150px_video_blue.png';
import audioIcon from 'static/icons/icon_150px_audio_blue.png';
import { CURRENT_USER_QUERY } from 'components/User/User';
import './Upload.scss';

// using dynamic import so that components load when they are needed, or rendered
const VideoUpload = dynamic( () => import( /* webpackChunkName: "videoUpload" */ './modals/VideoUpload/VideoUpload' ) );

const Upload = () => {
  const { loading, error, data } = useQuery( CURRENT_USER_QUERY );

  const [modalOpen, setModalOpen] = useState( false );
  const [modalClassname, setModalClassname] = useState( 'upload_modal' );

  const handleModalClassname = updatedModalClassname => setModalClassname( updatedModalClassname );

  if ( loading ) return 'Loading...';
  if ( error ) return `Error! ${error.message}`;

  const { authenticatedUser: { team } } = data;

  return (
    <div>
      <h1>Upload Content</h1>
      <section className="upload-content">
        <div className="contentTypes">
          <Button className="type disabled" aria-label="Upload Audio Content">
            <img src={ audioIcon } alt="Upload Audio Content" />
            <span>Audio</span>
          </Button>
          <Modal
            className={ modalClassname }
            open={ modalOpen }
            trigger={ (
              <Button
                className={ `type ${team.name === 'GPA Video' ? '' : 'disabled'}` }
                aria-label="Upload Video Content"
                onClick={ () => setModalOpen( true ) }
              >
                <img src={ videoIcon } alt="Upload video content" />
                <span>Videos</span>
              </Button>
            ) }
            content={ (
              <VideoUpload
                closeModal={ () => setModalOpen( false ) }
                updateModalClassname={ handleModalClassname }
              />
            ) }
          />
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

        <div className="upload-content_package">
          <p className="conjunction">- OR -</p>
          <Button
            className={ `btn primary ${team.name === 'GPA Press Office' ? '' : 'disabled'}` }
            aria-label="Create New Package"
            onClick={ () => setModalOpen( true ) }
          >
            <Icon name="plus circle" style={ { opacity: 1 } } />
            Create New Package
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
          <p>
            By uploading content you agree to our{ ' ' }
            <Link href="/about">
              <a>Terms of Use</a>
            </Link>
            .
          </p>
          <p>
            Still have questions? Read our{ ' ' }
            <Link href="/about">
              <a>FAQs</a>
            </Link>{ ' ' }
            about uploading content.
          </p>
        </div>
        <div className="upload_information_bestResults">
          <h3>For best results:</h3>
          <p>
            We recommend naming files descriptively using keywords or languages, ex: "
            <i>project-tile_arabic.jpg</i>", to help pre-populate metadata fields and save you time
            when uploading content!
          </p>
        </div>
      </section>
    </div>
  );
};


export default Upload;
