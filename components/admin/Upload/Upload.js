/**
 *
 * PageUpload
 *
 */
import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useQuery, useMutation } from '@apollo/react-hooks';
import Link from 'next/link';
import { Button, Modal, Icon } from 'semantic-ui-react';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import ApolloError from 'components/errors/ApolloError';
import imageIcon from 'static/icons/icon_150px_images_blue.png';
import docIcon from 'static/icons/icon_150px_document_blue.png';
import eduIcon from 'static/icons/icon_150px_edu_blue.png';
import videoIcon from 'static/icons/icon_150px_video_blue.png';
import audioIcon from 'static/icons/icon_150px_audio_blue.png';
import { CURRENT_USER_QUERY } from 'components/User/User';
import { CREATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import { buildCreatePackageTree } from 'lib/graphql/builders/package';
import moment from 'moment';
import './Upload.scss';

// using dynamic import so that components load when they are needed, or rendered
const VideoUpload = dynamic( () => import( /* webpackChunkName: "videoUpload" */ './modals/VideoUpload/VideoUpload' ) );

const Upload = () => {
  const { loading, error, data } = useQuery( CURRENT_USER_QUERY );
  const [createPackage, {
    error: createPackageError,
    loading: createPackageLoading
  }] = useMutation(
    CREATE_PACKAGE_MUTATION
  );

  const [modalOpen, setModalOpen] = useState( false );
  const [modalClassname, setModalClassname] = useState( 'upload_modal' );

  const handleModalClassname = updatedModalClassname => setModalClassname( updatedModalClassname );

  /**
   * Create dauly guidance packages ans sends user to
   * package details screen on success
   * @param {onject} user authenticated user
   */
  const createPressOfficePackage = async user => {
    try {
      const res = await createPackage( {
        variables: {
          data: buildCreatePackageTree( user, {
            type: 'DAILY_GUIDANCE',
            title: `Guidance Package ${moment().format( 'MM-D-YY' )}`,
          } )
        }
      } );

      const { id } = res.data.createPackage;
      Router.push( `/admin/package/${id}` );
    } catch ( err ) { // apollo populates createPackageError }
    }
  };


  if ( loading ) return 'Loading...';
  if ( error ) return `Error! ${error.message}`;

  const { authenticatedUser: { team } } = data;

  /**
   * Sets button state based on team. Add loading class if
   * button is processing.  Defaults to disabled
   * @param {String} contentType Type of content to create
   */
  const setButtonState = contentType => {
    let cls = 'disabled'; // disabled is default state
    const type = contentType.toUpperCase();
    if ( team.contentTypes.includes( type ) ) {
      // enable button
      cls = '';
    }
    if ( createPackageLoading ) {
      cls = `${cls} loading`;
    }
    return cls;
  };


  /**
   * Wrapper function that farms out package creation to a
   * function that handles specifc team's use case
   */
  const handleCreateNewPackage = async () => {
    const { authenticatedUser } = data;
    if ( team ) {
      switch ( team.name ) {
        case 'GPA Press Office':
          createPressOfficePackage( authenticatedUser );
          break;

        default:
      }
    }
  };

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
                className={ `type ${setButtonState( 'VIDEO' )}` }
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
            className={ `btn primary ${setButtonState( 'PACKAGE' )}` }
            aria-label="Create New Package"
            onClick={ handleCreateNewPackage }
          >
            <Icon name="plus circle" style={ { opacity: 1 } } />
            Create New Package
          </Button>
          <ApolloError error={ createPackageError } />
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
