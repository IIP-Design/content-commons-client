import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import ApolloError from 'components/errors/ApolloError';
import { Dropdown, Embed, Loader } from 'semantic-ui-react';

import downloadIcon from 'static/icons/icon_download.svg';
import { getStreamData, getVimeoId, getYouTubeId } from 'lib/utils';

import DownloadVideo from 'components/admin/download/DownloadVideo/DownloadVideo';
import DownloadSrt from 'components/admin/download/DownloadSrt/DownloadSrt';
import DownloadThumbnail from 'components/admin/download/DownloadThumbnail/DownloadThumbnail';
import DownloadOtherFiles from 'components/admin/download/DownloadOtherFiles/DownloadOtherFiles';
import DownloadHelp from 'components/Video/DownloadHelp';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';

import Notification from 'components/Notification/Notification';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';

import 'components/Video/Video.scss';
import 'components/Video/DownloadHelp.scss';
import './PreviewProjectItem.scss';

const VIDEO_PROJECT_UNITS_QUERY = gql`
  query VideoProjectUnits( $id: ID! ){
    videoProject( id: $id ) {
      id
      createdAt
      updatedAt
      projectType
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
          url
          filename          
          filesize
          filetype
          videoBurnedInStatus
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
          language {
            id
            displayName
            textDirection
          }
        }
      }
    }
  }
`;

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

class PreviewProjectItem extends React.Component {
  state = {
    dropDownIsOpen: false,
    selectedLanguage: 'English'
  }

  getLanguages = units => (
    units.map( unit => ( {
      key: unit.language.languageCode,
      value: unit.language.displayName,
      text: unit.language.displayName
    } ) )
  );

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
  };

  selectLanguage = language => this.setState( { selectedLanguage: language } );

  handleChange = ( e, { value } ) => {
    this.toggleArrow();
    this.selectLanguage( value );
  };

  render() {
    const { dropDownIsOpen, selectedLanguage } = this.state;
    const { id } = this.props;
    return (
      <Query
        query={ VIDEO_PROJECT_UNITS_QUERY }
        variables={ { id } }
      >
        { ( { loading, error, data } ) => {
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

          const {
            // projectType,
            createdAt,
            updatedAt,
            team,
            units
          } = data.videoProject;

          // TEMP - UNTIL DATA MODEL EDIT
          const projectType = 'video';

          const projectItems = this.getProjectItems( units );
          const selectedItem = projectItems[String( selectedLanguage )];

          if ( !selectedItem || !Object.keys( selectedItem ).length ) {
            return (
              <p style={ { fontSize: '1rem' } }>
                This project does not have any videos yet. <Link href={ `/admin/project/video/${id}/edit` }><a>Add videos &raquo;</a></Link>
              </p>
            );
          }

          const {
            title,
            descPublic,
            language,
            files
          } = selectedItem;

          const currentUnit = files[0];
          const youTubeUrl = getStreamData( currentUnit.stream, 'youtube', 'embedUrl' );
          const vimeoUrl = getStreamData( currentUnit.stream, 'vimeo', 'embedUrl' );
          const { videoBurnedInStatus } = currentUnit;

          let thumbnailUrl = '';
          if ( selectedItem.thumbnails && selectedItem.thumbnails.length ) {
            thumbnailUrl = selectedItem.thumbnails[0].image.url;
          } else if ( data.videoProject.thumbnails && data.videoProject.thumbnails.length ) {
            thumbnailUrl = data.videoProject.thumbnails[0].url;
          }

          return (
            <ModalItem
              className="videoProjectPreview"
              headline={ title }
              textDirection={ language.textDirection }
            >
              <Notification
                el="p"
                show
                customStyles={ previewMsgStyles }
                msg={ `This is a preview of your ${projectType} project on Content Commons.` }
              />

              <div className="modal_options">
                <Dropdown
                  className="modal_languages"
                  icon={ dropDownIsOpen ? 'chevron up' : 'chevron down' }
                  options={ this.getLanguages( units ) }
                  defaultValue={ selectedLanguage }
                  onClick={ this.toggleArrow }
                  onChange={ this.handleChange }
                />
                <div className="trigger-container">
                  <PopupTrigger
                    tooltip="Download video"
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
                                instructions={ `Download the video file in ${selectedLanguage}.
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
                <ModalContentMeta type={ data.videoProject.projectType } dateUpdated={ updatedAt } />
                <ModalDescription description={ descPublic } />
              </div>
              <ModalPostMeta source={ team.name } datePublished={ createdAt } />
            </ModalItem>
          );
        } }
      </Query>
    );
  }
}

PreviewProjectItem.propTypes = {
  id: PropTypes.string
};

export default PreviewProjectItem;
export { VIDEO_PROJECT_UNITS_QUERY };
