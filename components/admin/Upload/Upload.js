/**
 *
 * PageUpload
 *
 */
import React, { useState, useReducer } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import moment from 'moment';
import Router from 'next/router';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';

import ApolloError from 'components/errors/ApolloError';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { CREATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import { buildCreatePackageTree } from 'lib/graphql/builders/package';
import { useAuth } from 'context/authContext';

import imageIcon from 'static/icons/icon_150px_images_blue.png';
import docIcon from 'static/icons/icon_150px_document_blue.png';
import eduIcon from 'static/icons/icon_150px_edu_blue.png';
import videoIcon from 'static/icons/icon_150px_video_blue.png';
import audioIcon from 'static/icons/icon_150px_audio_blue.png';

import './Upload.scss';

const VideoUpload = dynamic( () => import( /* webpackChunkName: "videoUpload" */ './modals/VideoUpload/VideoUpload' ) );
const GraphicUpload = dynamic( () => import( /* webpackChunkName: "graphicUpload" */ './modals/GraphicUpload/GraphicUpload' ) );

const Upload = () => {
  const { user } = useAuth();

  // Reducer to manage the modal state for multiple modals
  const reducer = ( _state, action ) => {
    // content types are upper-cased to match graphQL enum
    const key = action.contentType.toLowerCase();

    switch ( action.type ) {
      case 'open':
        return { ..._state, [key]: { open: true, files: action.files } };

      case 'close':
        return { ..._state, [key]: { open: false, files: null } };

      default:
        return {};
    }
  };

  const [state, dispatch] = useReducer( reducer, {
    video: { open: false, files: null },
    graphic: { open: false, files: null },
  } );

  const [modalClassname, setModalClassname] = useState( 'upload_modal' );

  const handleModalClassname = updatedModalClassname => setModalClassname( updatedModalClassname );

  const [creationError, setCreationError] = useState( '' );
  const [createPackage, { loading: createPackageLoading }] = useMutation(
    CREATE_PACKAGE_MUTATION,
  );

  /**
  * Create daily guidance packages and sends user to
  * package details screen on success.
  */
  const createPressOfficePackage = async () => {
    // Generate the daily standard title
    const title = `Guidance Package ${moment().format( 'MM-D-YY' )}`;

    try {
      const res = await createPackage( {
        variables: {
          data: buildCreatePackageTree( user, {
            type: 'DAILY_GUIDANCE',
            title,
          } ),
        },
      } );

      const { id } = res.data.createPackage;

      Router.push( `/admin/package/${id}?action=create` );
    } catch ( err ) {
      setCreationError( err );
    }
  };

  /**
 * Checks whether team has permission to create provided content type
 * @param {string} contentType content type to verify, i.e. VIDEO
 */
  const teamCanCreateContentType = contentType => {
    const team = user?.team;

    const type = contentType.toUpperCase();

    if ( team && team.contentTypes ) {
      return team.contentTypes.includes( type );
    }

    return false;
  };

  /**
  * Sets button state based on team. Add loading class if
  * button is processing.  Defaults to disabled
  * @param {String} contentType Type of content to create
  */
  const setButtonState = contentType => {
    let cls = 'disabled'; // disabled is default state

    if ( teamCanCreateContentType( contentType ) ) {
      // enable button
      cls = '';
    }
    if ( createPackageLoading ) {
      cls = `${cls} loading`;
    }

    return cls;
  };

  /**
  * Verify that a team can create a package before executing the
  * create handler.
  */
  const handleCreateNewPackage = async () => {
    if ( teamCanCreateContentType( 'PACKAGE' ) ) {
      createPressOfficePackage();
    }
  };


  /**
   * Renders button and only adds click handler if user is a member of the allowed team
   * @param {object} options Contains button configuration
   */
  const renderButton = options => {
    const {
      contentType, icon, label, alt,
    } = options;

    // enable button by adding click handler as opposed to simply setting 'disabled' attr as this could be easily changed
    const onClick = teamCanCreateContentType( contentType ) ? () => dispatch( { type: 'open', contentType } ) : null;

    return (
      <Button
        className={ `type ${setButtonState( contentType )}` }
        aria-label={ alt }
        onClick={ onClick }
      >
        <img src={ icon } alt={ alt } />
        <span>{ label }</span>
      </Button>
    );
  };

  /**
   * Handles processing files before modal is opened.
   * For modals that are expecting incoming files props
   * @param {object} event object
   */
  const handleAddFiles = e => {
    const files = Array.from( e.target.files );

    if ( files.length ) {
      // check permissions again before opening
      // (i.e. putting another check here as enabling a button in source code is easier )
      if ( teamCanCreateContentType( 'GRAPHIC' ) ) {
        dispatch( { type: 'open', contentType: 'GRAPHIC', files } );
      }
    }
  };

  return (
    <div>
      <h1>Upload Content</h1>
      <section className="upload-content">
        <div className="contentTypes">
          { /* Audios */ }
          <Button className="type disabled" aria-label="Upload Audio Content">
            <img src={ audioIcon } alt="Upload Audio Content" />
            <span>Audio</span>
          </Button>

          { /* Videos */ }
          <Modal
            className={ modalClassname }
            open={ state.video.open }
            trigger={ renderButton( {
              contentType: 'VIDEO',
              label: 'Videos',
              icon: videoIcon,
              alt: 'Upload video content',
            } ) }
            content={ (
              <VideoUpload
                closeModal={ () => dispatch( { type: 'close', contentType: 'video' } ) }
                updateModalClassname={ handleModalClassname }
              />
            ) }
          />

          { /* Graphics */ }
          <Modal
            className={ modalClassname }
            open={ state.graphic.open }
            style={ { width: '820px' } }
            trigger={ (
              <ButtonAddFiles
                className={ `type ${setButtonState( 'GRAPHIC' )}` }
                aria-label="Upload graphics content"
                multiple
                accept=".png,.jpg,.jpeg,.gif,.psd,.ai,.ae,.pdf,.doc,.docx,.ttf,.otf"
                onChange={ handleAddFiles }
              >
                <img src={ imageIcon } alt="Upload graphics content" />
                <span>Graphics</span>
              </ButtonAddFiles>
            ) }
            content={ (
              <GraphicUpload
                files={ state.graphic.files }
                closeModal={ () => dispatch( { type: 'close', contentType: 'graphic' } ) }
                updateModalClassname={ handleModalClassname }
              />
            ) }
          />

          { /* Documents */ }
          <Button className="type disabled" aria-label="Upload Document Content">
            <img src={ docIcon } alt="Upload document content" />
            <span>Documents</span>
          </Button>

          { /* Teaching Materials */ }
          <Button className="type disabled" aria-label="Upload Teaching Material Content">
            <img src={ eduIcon } alt="Upload teaching material content" />
            <span>Teaching Materials</span>
          </Button>
        </div>

        { /* Packages */ }
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
          <ApolloError error={ { otherError: creationError } } />
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
            By uploading content you agree to our
            <Link href="/about">
              <a>Terms of Use</a>
            </Link>
            .
          </p>
          <p>
            Still have questions? Read our
            <Link href="/about">
              <a>FAQs</a>
            </Link>
            about uploading content.
          </p>
        </div>
        <div className="upload_information_bestResults">
          <h3>For best results:</h3>
          <p>
            We recommend naming files descriptively using keywords or languages, ex: &quot;
            { ' ' }
            <i>project-tile_arabic.jpg</i>
            { ' ' }
            &quot;, to help pre-populate metadata fields and save you
            time when uploading content!
          </p>
        </div>
      </section>
    </div>
  );
};


export default Upload;
