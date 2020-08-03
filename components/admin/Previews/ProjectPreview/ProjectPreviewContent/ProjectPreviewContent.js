/**
 *
 * PreviewProjectContent
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Dropdown, Embed } from 'semantic-ui-react';

import ApolloError from 'components/errors/ApolloError';

import DownloadVideo from 'components/admin/download/DownloadVideo/DownloadVideo';
import DownloadCaption from 'components/admin/download/DownloadCaption/DownloadCaption';
import DownloadThumbnail from 'components/admin/download/DownloadThumbnail/DownloadThumbnail';
import DownloadOtherFiles from 'components/admin/download/DownloadOtherFiles/DownloadOtherFiles';
import DownloadHelp from 'components/Video/Download/DownloadHelp';

import EmbedVideo from 'components/Embed';
import EmbedHelp from 'components/Video/Download/EmbedHelp';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';
import ModalPostTags from 'components/modals/ModalPostTags/ModalPostTags';

import Notification from 'components/Notification/Notification';
import Popover from 'components/popups/Popover/Popover';
import DownloadItem from 'components/download/DownloadItem/DownloadItem';
import TabLayout from 'components/TabLayout/TabLayout';
import PreviewLoader from 'components/admin/Previews/PreviewLoader/PreviewLoader';
import Share from 'components/Share/Share';

import downloadIcon from 'static/icons/icon_download.svg';
import embedIcon from 'static/icons/icon_embed.svg';
import shareIcon from 'static/icons/icon_share.svg';
import {
  getPreviewNotificationStyles, getStreamData, getVimeoId,
  getYouTubeId, getHasSomeNonCleanVideos, getUnitsWithNonCleanVideos,
} from 'lib/utils';
import { displayDOSLogo } from 'lib/sourceLogoUtils';
import { UNIT_DETAILS_FRAGMENT } from 'lib/graphql/queries/video';

import './ProjectPreviewContent.scss';

/* eslint-disable react/prefer-stateless-function */
class ProjectPreviewContent extends React.PureComponent {
  constructor( props ) {
    super( props );

    this.state = {
      dropDownIsOpen: false,
      selectedLanguage: '',
    };
  }

  componentDidMount = () => {
    if ( this.props.data.project ) {
      const { units } = this.props.data.project;

      if ( !units || units.length === 0 ) return;

      const unitsWithNonCleanVideos = getUnitsWithNonCleanVideos( units );
      const language = this.getUnitLanguage( unitsWithNonCleanVideos );

      if ( !language && !Object.keys( language ).length ) {
        return;
      }

      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState( prevState => {
        if ( !prevState.selectedLanguage ) {
          return { selectedLanguage: language.displayName };
        }
      } );
    }
  };

  componentDidUpdate = ( _, prevState ) => {
    if ( this.props.data.project ) {
      const { units } = this.props.data.project;

      if ( !units || units.length === 0 ) return;

      const unitsWithNonCleanVideos = getUnitsWithNonCleanVideos( units );
      const language = this.getUnitLanguage( unitsWithNonCleanVideos );

      if ( !language || !Object.keys( language ).length ) {
        return;
      }

      if ( !prevState.selectedLanguage ) {
        this.selectLanguage( language.displayName );
      }
    }
  };

  getLanguages = units => units.reduce( ( acc, unit ) => {
    const hasSomeNonCleanVideos = getHasSomeNonCleanVideos( unit );

    if ( hasSomeNonCleanVideos ) {
      acc.push( {
        key: unit.language.languageCode,
        value: unit.language.displayName,
        text: unit.language.displayName,
      } );
    }

    return acc;
  }, [] );

  getProjectUnits = units => units.reduce( ( acc, unit ) => {
    const hasSomeNonCleanVideos = getHasSomeNonCleanVideos( unit );

    if ( hasSomeNonCleanVideos ) {
      acc[unit.language.displayName] = unit;
    }

    return acc;
  }, {} );

  getUnitsWithFiles = units => units.filter( u => {
    const { files } = u;
    const hasSomeNonCleanVideos = getHasSomeNonCleanVideos( u );

    return files.length > 0 && hasSomeNonCleanVideos;
  } );

  getEnglishIndex = units => units.findIndex( unit => unit.language.displayName === 'English' );

  getFilesCount = ( units, i ) => {
    if ( units[i] && units[i].files ) {
      return units[i].files.length;
    }

    return 0;
  };

  getCurrUnitIndex = ( i, count = 0 ) => {
    if ( i > -1 && count > 0 ) return i;

    return 0;
  };

  getUnitLanguage = units => {
    /**
     * Look for an English language unit first.
     * Otherwise, get the first available unit.
     */
    const englishIndex = this.getEnglishIndex( units );
    const englishFilesCount = this.getFilesCount( units, englishIndex );
    const i = this.getCurrUnitIndex( englishIndex, englishFilesCount );

    return units[i] ? units[i].language : {};
  };

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
  };

  getEmbedUrl = url => {
    if ( !url.includes( 'youtu' ) && !url.includes( 'vimeo' ) ) {
      return '';
    }

    let embedSrc = '';

    if ( url.includes( 'youtu' ) ) {
      embedSrc = `https://www.youtube.com/embed/${getYouTubeId( url )}`;
    } else if ( url.includes( 'vimeo' ) ) {
      embedSrc = `https://player.vimeo.com/video/${getVimeoId( url )}`;
    }

    return `<iframe src="${embedSrc}" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>`;
  };

  getTag = ( tag, unit ) => {
    const translation = tag.translations.find( t => t.language.locale === unit.language.locale );

    if ( translation && translation.name ) {
      return translation.name;
    }
  };

  getTags = ( tags, unit ) => tags.reduce( ( acc, curr ) => [
    ...acc,
    { name: this.getTag( curr, unit ) },
  ], [] );

  toggleArrow = () => {
    this.setState( prevState => ( {
      dropDownIsOpen: !prevState.dropDownIsOpen,
    } ) );
  };

  selectLanguage = language => this.setState( { selectedLanguage: language } );

  handleChange = ( e, { value } ) => {
    this.toggleArrow();
    this.selectLanguage( value );
  };

  render() {
    const { id } = this.props;
    const { error, loading, project } = this.props.data;

    if ( error ) return <ApolloError error={ error } />;
    if ( loading ) return <PreviewLoader />;

    if ( !project || !Object.keys( project ).length ) return null;

    const {
      __typename, team, author, units,
    } = project;
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
      title, language, descPublic, files, categories,
    } = selectedUnit;
    const contentType = this.getContentType( __typename );

    if ( files && files.length === 0 ) {
      return (
        <p style={ { fontSize: '1rem' } }>
          { `This ${language.displayName} language unit does not have any files to preview.` }
        </p>
      );
    }

    const {
      createdAt, updatedAt, stream, videoBurnedInStatus,
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
      thumbnailUrl = selectedUnit.thumbnails[0].image.signedUrl;
      thumbnailAlt = selectedUnit.thumbnails[0].image.alt;
    } else if ( project.thumbnails && project.thumbnails.length > 0 ) {
      thumbnailUrl = project.thumbnails[0].signedUrl;
      thumbnailAlt = project.thumbnails[0].alt;
    }

    return (
      <ModalItem
        className="project-preview"
        headline={ title }
        textDirection={ language.textDirection }
      >
        <Notification
          el="p"
          show
          customStyles={ getPreviewNotificationStyles() }
          msg={ `This is a preview of your ${contentType} project on Content Commons.` }
        />

        <div className="modal_options">
          { units && this.getUnitsWithFiles( units ).length === 1
            // use units since they're defined by language
            ? (
              <div className="modal_languages_single">
                { selectedLanguage }
              </div>
            )
            : (
              <Dropdown
                className="modal_languages"
                value={ selectedLanguage }
                icon={ dropDownIsOpen ? 'chevron up' : 'chevron down' }
                options={ this.getLanguages( units ) }
                onClick={ this.toggleArrow }
                onChange={ this.handleChange }
              />
            ) }

          <div className="trigger-container">
            { contentType === 'video' && embedItem && (
              <Popover
                toolTip="Embed video"
                id={ `${id}_video-embed` }
                className="video-project__popover video-project__popover--embed"
                expandFromRight
                trigger={ (
                  <img
                    src={ embedIcon }
                    style={ { width: '20px', height: '20px' } }
                    alt="embed icon"
                  />
                ) }
              >
                <TabLayout
                  headline="Download this video."
                  tabs={ [
                    {
                      title: 'Copy Embed Code',
                      content: (
                        <EmbedVideo
                          instructions="Copy and paste the code below to embed video on your site"
                          embedItem="The video embed code will appear here."
                          isPreview
                        />
                      ),
                    },
                    {
                      title: 'Help',
                      content: <EmbedHelp />,
                    },
                  ] }
                />
              </Popover>
            ) }

            <Popover
              toolTip="Share video"
              id={ `${id}_video-share` }
              className="video-project__popover video-project__popover--share"
              trigger={ (
                <img
                  src={ shareIcon }
                  style={ { width: '20px', height: '20px' } }
                  alt="share icon"
                />
              ) }
              expandFromRight
            >
              <div className="popup_share">
                <h2 className="ui header">Share this video.</h2>
                <Share
                  id={ id }
                  isPreview
                  language={ selectedUnit.language.locale }
                  link="The direct link to the project will appear here."
                  site=""
                  title={ title }
                  type={ contentType }
                />
              </div>
            </Popover>

            <Popover
              toolTip="Download video"
              id={ `${id}_video-download` }
              className="video-project__popover video-project__popover--download"
              trigger={ <img src={ downloadIcon } style={ { width: '18px', height: '18px' } } alt="download icon" /> }
              expandFromRight
            >
              <TabLayout
                headline="Download this video."
                tabs={ [
                  {
                    title: 'Video File',
                    content: (
                      <DownloadItem
                        instructions={ `Download the video and caption files in ${selectedLanguage}.
                        This download option is best for uploading this video to web pages.` }
                      >
                        <DownloadVideo
                          selectedLanguageUnit={ selectedUnit }
                          burnedInCaptions={ videoBurnedInStatus === 'CAPTIONED' }
                          isPreview
                        />
                      </DownloadItem>
                    ),
                  },
                  {
                    title: 'Caption File',
                    content: (
                      <DownloadItem
                        instructions="Download caption file(s) for this video."
                      >
                        <DownloadCaption
                          id={ id }
                          isPreview
                        />
                      </DownloadItem>
                    ),
                  },
                  {
                    title: 'Thumbnail',
                    content: (
                      <DownloadItem
                        instructions="Download Transcripts"
                      >
                        <DownloadThumbnail
                          id={ id }
                          isPreview
                        />
                      </DownloadItem>
                    ),
                  },
                  {
                    title: 'Other',
                    content: (
                      <DownloadItem
                        instructions="Download Other File(s)"
                      >
                        <DownloadOtherFiles
                          id={ id }
                          isPreview
                        />
                      </DownloadItem>
                    ),
                  },
                  {
                    title: 'Help',
                    content: <DownloadHelp />,
                  },
                ] }
              />
            </Popover>
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
          { !youTubeUrl && vimeoUrl && (
            <Embed
              id={ getVimeoId( vimeoUrl ) }
              placeholder={ thumbnailUrl }
              source="vimeo"
            />
          ) }
          { !youTubeUrl && !vimeoUrl && (
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

        <ModalPostMeta
          textDirection={ language.textDirection }
          author={ author }
          logo={ displayDOSLogo( team.name ) }
          source={ team.name }
          datePublished={ createdAt }
        />

        { categories && categories.length > 0
          && <ModalPostTags tags={ this.getTags( categories, selectedUnit ) } />}
      </ModalItem>
    );
  }
}

ProjectPreviewContent.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object.isRequired,
};

const VIDEO_PROJECT_PREVIEW_QUERY = gql`
  query VideoProjectPreview($id: ID!) {
    project: videoProject(id: $id) {
      id
      projectType
      descPublic
      author {
        id
        firstName
        lastName
      }
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
  } ),
} )( ProjectPreviewContent );

export { VIDEO_PROJECT_PREVIEW_QUERY };
