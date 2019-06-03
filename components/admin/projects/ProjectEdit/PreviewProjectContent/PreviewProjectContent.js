/**
 *
 * PreviewProjectContent
 *
 */
import React from 'react';
import { object } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Dropdown, Embed } from 'semantic-ui-react';

import DownloadVideo from 'components/Video/DownloadVideo';
import DownloadSrt from 'components/Video/DownloadSrt';
import DownloadThumbnail from 'components/Video/DownloadThumbnail';
import DownloadOtherFiles from 'components/Video/DownloadOtherFiles';
import DownloadHelp from 'components/Video/DownloadHelp';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';

import Notification from 'components/Notification/Notification';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';

import downloadIcon from 'static/icons/icon_download.svg';
import { getYouTubeId } from 'lib/utils';
import './PreviewProjectContent.scss';

/* eslint-disable react/prefer-stateless-function */
class PreviewProjectContent extends React.PureComponent {
  constructor( props ) {
    super( props );

    this.state = {
      dropDownIsOpen: false,
      selectedLanguage: 'English'
    };
  }

  getLanguages = units => (
    units.map( unit => ( {
      key: unit.language.languageCode,
      value: unit.language.displayName,
      text: unit.language.displayName
    } ) )
  )

  getProjectItems = units => (
    units.reduce( ( acc, unit ) => ( {
      ...acc,
      [unit.language.displayName]: unit
    } ), {} )
  );

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
    const {
      error,
      loading,
      project
    } = this.props.data;

    if ( loading ) return 'Loading the project...';
    if ( error ) return `Error! ${error.message}`;

    const { projectType, team, units } = project;
    const { dropDownIsOpen, selectedLanguage } = this.state;

    const projectItems = this.getProjectItems( units );
    const selectedItem = projectItems[this.state.selectedLanguage];

    if ( !selectedItem || !Object.keys( selectedItem ).length ) return null;

    const {
      title,
      language,
      descPublic,
      updated, // currently undefined, need updatedAt from Prisma
      uploaded, // currently undefined, need createdAt from Prisma
      files
    } = selectedItem;

    const currentUnit = files[0];
    const youTubeUrl = currentUnit.stream.embedUrl;
    const { videoBurnedInStatus } = currentUnit;

    let thumbnailUrl = '';
    if ( selectedItem.thumbnails && selectedItem.thumbnails.length ) {
      thumbnailUrl = selectedItem.thumbnails[0].image.url;
    } else if ( project.thumbnails && project.thumbnails.length ) {
      thumbnailUrl = project.thumbnails[0].url;
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
          customStyles={ previewMsgStyles }
          msg={ `This is a preview of your ${projectType} project on Content Commons.` }
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
            <PopupTrigger
              toolTip="Download video"
              icon={ { img: downloadIcon, dim: 18 } }
              position="right"
              show={ projectType === 'video' }
              content={ (
                <PopupTabbed
                  title="Download this video."
                  panes={ [
                    {
                      title: 'Video File',
                      component: (
                        <DownloadVideo
                          selectedLanguageUnit={ selectedItem }
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
                          instructions="Download SRTs"
                          units={ units }
                        />
                      )
                    },
                    {
                      title: 'Thumbnail',
                      component: (
                        <DownloadThumbnail
                          instructions="Download Thumbnail(s)"
                          units={ units }
                        />
                      )
                    },
                    {
                      title: 'Other',
                      component: (
                        <DownloadOtherFiles
                          instructions="Download Other File(s)"
                          units={ units }
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
          { /* @todo getYouTubeId may not be necessary depending
            on how the YouTube URL is stored in data */ }
          { youTubeUrl
            && (
              <Embed
                id={ getYouTubeId( youTubeUrl ) }
                placeholder={ thumbnailUrl }
                source="youtube"
              />
            ) }

          <ModalContentMeta type={ projectType } dateUpdated={ updated || uploaded } />

          <ModalDescription description={ descPublic } />
        </div>

        <ModalPostMeta source={ team.name } datePublished={ uploaded } />
      </ModalItem>
    );
  }
}

PreviewProjectContent.propTypes = {
  data: object.isRequired,
};

const VIDEO_PROJECT_PREVIEW_QUERY = gql`
  query VideoProject($id: ID!) {
    project: videoProject(id: $id) {
      id
      projectType
      thumbnails {
        id
        alt
        url
      }
      team {
        id
        name
      }
      units {
        id
        title
        descPublic
        thumbnails {
          id
          image {
            id
            alt
            url
          }
        }
        language {
          id
          languageCode
          displayName
          textDirection
        }
        files {
          id
          createdAt
          duration
          filename
          createdAt
          duration
          url
          use {
            id
            name
          }
          filesize
          videoBurnedInStatus
          language {
            id
            displayName
          }
          dimensions {
            id
            width
            height
          }
          stream {
            id
            site
            embedUrl
          }
          use {
            id
            name
          language {
            id
            textDirection
          }
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_PREVIEW_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( PreviewProjectContent );
export { VIDEO_PROJECT_PREVIEW_QUERY };
