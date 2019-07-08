/**
 *
 * PreviewProjectContent
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Dropdown, Embed, Loader } from 'semantic-ui-react';

import ApolloError from 'components/errors/ApolloError';

import DownloadVideo from 'components/admin/download/DownloadVideo/DownloadVideo';
import DownloadSrt from 'components/admin/download/DownloadSrt/DownloadSrt';
import DownloadThumbnail from 'components/admin/download/DownloadThumbnail/DownloadThumbnail';
import DownloadOtherFiles from 'components/admin/download/DownloadOtherFiles/DownloadOtherFiles';
import DownloadHelp from 'components/Video/DownloadHelp';

import EmbedVideo from 'components/Embed';
import EmbedHelp from 'components/Video/EmbedHelp';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';

import Notification from 'components/Notification/Notification';
import Popup from 'components/popups/Popup';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';
import Share from 'components/Share/Share';

import downloadIcon from 'static/icons/icon_download.svg';
import embedIcon from 'static/icons/icon_embed.svg';
import shareIcon from 'static/icons/icon_share.svg';
import {
  getS3Url, getStreamData, getVimeoId, getYouTubeId
} from 'lib/utils';
import { UNIT_DETAILS_FRAGMENT } from 'lib/graphql/queries/video';

import './PreviewProjectContent.scss';

/* eslint-disable react/prefer-stateless-function */
class PreviewProjectContent extends React.PureComponent {
  constructor( props ) {
    super( props );

    this.state = {
      dropDownIsOpen: false,
      selectedLanguage: ''
    };
  }

  componentDidMount = () => {
    if ( this.props.data.project ) {
      const { units } = this.props.data.project;
      if ( !units || ( units && units.length === 0 ) ) return;

      const englishIndex = this.getEnglishIndex( units );
      const { language } = units[englishIndex > -1 ? englishIndex : 0];

      if ( !language || ( language && !Object.keys( language ).length ) ) {
        return;
      }

      this.setState( prevState => {
        if ( !prevState.selectedLanguage ) {
          return { selectedLanguage: language.displayName };
        }
      } );
    }
  }

  componentDidUpdate = ( _, prevState ) => {
    if ( this.props.data.project ) {
      const { units } = this.props.data.project;
      if ( !units || ( units && units.length === 0 ) ) return;

      const englishIndex = this.getEnglishIndex( units );
      const { language } = units[englishIndex > -1 ? englishIndex : 0];

      if ( !prevState.selectedLanguage ) {
        this.selectLanguage( language.displayName );
      }
    }
  }

  getLanguages = units => (
    units.map( unit => ( {
      key: unit.language.languageCode,
      value: unit.language.displayName,
      text: unit.language.displayName
    } ) )
  )

  getProjectUnits = units => (
    units.reduce( ( acc, unit ) => ( {
      ...acc,
      [unit.language.displayName]: unit
    } ), {} )
  );

  getEnglishIndex = units => (
    units.findIndex( unit => unit.language.displayName === 'English' )
  );

  getContentType = typename => {
    switch ( typename ) {
      case 'VideoProject':
        return 'video';
      /**
       * future content types would go here, e.g.,
       * case 'ImageProject':
       *   return 'image';
       */
      default:
        return '';
    }
  }

  getEmbedUrl = url => {
    if ( !url.includes( 'youtube' ) && !url.includes( 'vimeo' ) ) {
      return '';
    }

    let embedSrc = '';
    if ( url.includes( 'youtube' ) ) {
      embedSrc = `https://www.youtube.com/embed/${getYouTubeId( url )}`;
    } else if ( url.includes( 'vimeo' ) ) {
      embedSrc = `https://player.vimeo.com/video/${getVimeoId( url )}`;
    }

    return `<iframe src="${embedSrc}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
  }

  toggleArrow = () => {
    this.setState( prevState => ( {
      dropDownIsOpen: !prevState.dropDownIsOpen
    } ) );
  }

  selectLanguage = language => (
    this.setState( { selectedLanguage: language } )
  )

  handleChange = ( e, { value } ) => {
    this.toggleArrow();
    this.selectLanguage( value );
  }

  render() {
    const { id } = this.props;
    const { error, loading, project } = this.props.data;

    if ( loading ) {
      return (
        <div
          className="preview-project-loader"
          style={ {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px'
          } }
        >
          <Loader
            active
            inline="centered"
            style={ { marginBottom: '1em' } }
          />
          <p>Loading the project preview...</p>
        </div>
      );
    }

    if ( error ) return <ApolloError error={ error } />;
    if ( !project || !Object.keys( project ).length ) return null;

    const { __typename, team, units } = project;
    const { dropDownIsOpen, selectedLanguage } = this.state;

    const projectUnits = this.getProjectUnits( units );
    const selectedUnit = projectUnits[String( selectedLanguage )];

    if ( !selectedUnit || !Object.keys( selectedUnit ).length ) {
      return (
        <p style={ { fontSize: '1rem' } }>
          This project does not have any units to preview.
        </p>
      );
    }

    const {
      title, language, descPublic, files
    } = selectedUnit;
    const contentType = this.getContentType( __typename );

    if ( files && files.length === 0 ) {
      return (
        <p style={ { fontSize: '1rem' } }>
          This project unit does not have any files to preview.
        </p>
      );
    }

    const {
      createdAt, updatedAt, stream, videoBurnedInStatus
    } = files[0];

    const youTubeUrl = getStreamData( stream, 'youtube', 'url' );
    const vimeoUrl = getStreamData( stream, 'vimeo', 'url' );

    let embedItem = '';
    if ( youTubeUrl ) {
      embedItem = this.getEmbedUrl( youTubeUrl );
    } else if ( !youTubeUrl && vimeoUrl ) {
      embedItem = this.getEmbedUrl( vimeoUrl );
    }

    let thumbnailUrl = '';
    let thumbnailAlt = `a thumbnail image for this project in ${language.displayName}`;
    if ( selectedUnit.thumbnails && selectedUnit.thumbnails.length > 0 ) {
      thumbnailUrl = getS3Url( selectedUnit.thumbnails[0].image.url );
      thumbnailAlt = selectedUnit.thumbnails[0].image.alt;
    } else if ( project.thumbnails && project.thumbnails.length > 0 ) {
      thumbnailUrl = getS3Url( project.thumbnails[0].url );
      thumbnailAlt = project.thumbnails[0].alt;
    }

    const previewMsgStyles = {
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      // match Semantic UI border-radius
      borderTopLeftRadius: '0.28571429rem',
      borderTopRightRadius: '0.28571429rem',
      padding: '1em 1.5em',
      fontSize: '1em',
      backgroundColor: '#fdb81e'
    };

    return (
      <ModalItem
        className="project-preview"
        headline={ title }
        textDirection={ language.textDirection }
      >
        <Notification
          el="p"
          show
          customStyles={ previewMsgStyles }
          msg={ `This is a preview of your ${contentType} project on Content Commons.` }
        />

        <div className="modal_options">
          <Dropdown
            className="modal_languages"
            value={ selectedLanguage }
            icon={ dropDownIsOpen ? 'chevron up' : 'chevron down' }
            options={ this.getLanguages( units ) }
            onClick={ this.toggleArrow }
            onChange={ this.handleChange }
          />

          <div className="trigger-container">
            { ( contentType === 'video' && embedItem ) && (
              <PopupTrigger
                toolTip="Embed video"
                icon={ { img: embedIcon, dim: 24 } }
                show
                content={ (
                  <PopupTabbed
                    title="Embed this video on your site"
                    panes={ [
                      {
                        title: 'Copy Embed Code',
                        component: (
                          <EmbedVideo
                            instructions="Copy and paste the code below to embed video on your site"
                            embedItem={ embedItem }
                            isPreview
                          />
                        )
                      },
                      { title: 'Help', component: <EmbedHelp /> }
                    ] }
                  />
                ) }
              />
            ) }

            <PopupTrigger
              icon={ { img: shareIcon, dim: 18 } }
              tooltip="Share project"
              show
              content={ (
                <Popup title="Share this project.">
                  <Share
                    id={ id }
                    isPreview
                    language={ selectedUnit.language.locale }
                    link={ youTubeUrl || vimeoUrl }
                    site=""
                    title={ title }
                    type={ contentType }
                  />
                </Popup>
              ) }
            />

            <PopupTrigger
              toolTip="Download video"
              icon={ { img: downloadIcon, dim: 18 } }
              position="right"
              show={ contentType === 'video' }
              content={ (
                <PopupTabbed
                  title="Download this video."
                  panes={ [
                    {
                      title: 'Video File',
                      component: (
                        <DownloadVideo
                          selectedLanguageUnit={ selectedUnit }
                          instructions={ `Download the video and SRT files in ${selectedLanguage}.
                            This download option is best for uploading this video to web pages.` }
                          burnedInCaptions={ videoBurnedInStatus === 'CAPTIONED' }
                        />
                      )
                    },
                    {
                      title: 'SRT',
                      component: (
                        <DownloadSrt
                          id={ id }
                          instructions="Download SRT(s)"
                        />
                      )
                    },
                    {
                      title: 'Thumbnail',
                      component: (
                        <DownloadThumbnail
                          id={ id }
                          instructions="Download Thumbnail(s)"
                        />
                      )
                    },
                    {
                      title: 'Other',
                      component: (
                        <DownloadOtherFiles
                          id={ id }
                          instructions="Download Other File(s)"
                        />
                      )
                    },
                    { title: 'Help', component: <DownloadHelp /> }
                  ] }
                />
              ) }
            />
          </div>
        </div>

        <div className="project-preview__content">
          { youTubeUrl && (
            <Embed
              id={ getYouTubeId( youTubeUrl ) }
              placeholder={ thumbnailUrl }
              source="youtube"
            />
          ) }
          { ( !youTubeUrl && vimeoUrl ) && (
            <Embed
              id={ getVimeoId( vimeoUrl ) }
              placeholder={ thumbnailUrl }
              source="vimeo"
            />
          ) }
          { ( !youTubeUrl && !vimeoUrl ) && (
            <figure className="modal_thumbnail overlay">
              <img
                className="overlay-image"
                src={ thumbnailUrl }
                alt={ thumbnailAlt }
              />
            </figure>
          ) }

          <ModalContentMeta type={ contentType } dateUpdated={ updatedAt } />
          <ModalDescription description={ descPublic } />
        </div>

        <ModalPostMeta source={ team.name } datePublished={ createdAt } />
      </ModalItem>
    );
  }
}

PreviewProjectContent.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object.isRequired,
};

const VIDEO_PROJECT_PREVIEW_QUERY = gql`
  query VideoProjectPreview($id: ID!) {
    project: videoProject(id: $id) {
      id
      projectType
      descPublic
      team {
        id
        name
      }
      thumbnails {
        ...imageDetails
      }
      units {
        ...unitDetails
      }
    }
  }
  ${UNIT_DETAILS_FRAGMENT}
`;

export default graphql( VIDEO_PROJECT_PREVIEW_QUERY, {
  options: props => ( {
    variables: { id: props.id },
  } )
} )( PreviewProjectContent );

export { VIDEO_PROJECT_PREVIEW_QUERY };
