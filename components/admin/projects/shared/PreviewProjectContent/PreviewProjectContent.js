/**
 *
 * PreviewProjectContent
 *
 */

import React from 'react';
import { array, string } from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
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

import Notification from 'components/admin/projects/shared/Notification/Notification';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';

import downloadIcon from 'static/icons/icon_download.svg';
import { getYouTubeId } from 'lib/utils';

import './PreviewProjectContent.scss';

const VIDEO_PROJECT_PREVIEW_QUERY = gql`
  query VideoProject($id: ID!) {
    videoProject(id: $id) {
      projectType
      supportFiles {
        url
        filename
        language {
          languageCode
          displayName
          textDirection
        }
      }
      thumbnails {
        alt
        url
      }
      team {
        name
      }
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
class PreviewProjectContent extends React.PureComponent {
  constructor( props ) {
    super( props );

    const { data } = this.props;

    this.state = {
      dropDownIsOpen: false,
      selectedLanguage: 'English',
      projectItems: this.getProjectItems( data ),
      selectedItem: {},
      languages: this.getLanguages( data )
    };
  }

  componentDidMount = () => {
    this.selectProjectItem();
  }

  getLanguages = data => (
    data.map( item => ( {
      key: item.language.languageCode,
      value: item.language.displayName,
      text: item.language.displayName
    } ) )
  );

  getProjectItems = data => (
    data.reduce( ( acc, item ) => ( {
      ...acc,
      [item.language.displayName]: item
    } ), {} )
  );

  toggleArrow = () => {
    this.setState( prevState => ( {
      dropDownIsOpen: !prevState.dropDownIsOpen
    } ) );
  }

  selectLanguage = language => {
    this.setState(
      () => ( { selectedLanguage: language } ),
      this.selectProjectItem
    );
  }

  selectProjectItem = () => {
    const { projectItems, selectedLanguage } = this.state;
    this.setState( {
      selectedItem: projectItems[selectedLanguage]
    } );
  }

  handleChange = ( e, { value } ) => {
    this.toggleArrow();
    this.selectLanguage( value );
  }

  render() {
    const { data: units } = this.props;
    const {
      dropDownIsOpen,
      selectedLanguage,
      selectedItem,
      languages
    } = this.state;

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
      <Query query={ VIDEO_PROJECT_PREVIEW_QUERY } variables={ { id: this.props.id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return 'Loading the project...';
          if ( error ) return `Error! ${error.message}`;

          const {
            projectType,
            team,
            thumbnails
          } = data.videoProject;
          const { url: thumbnailUrl } = thumbnails[0];

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
                  options={ languages }
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
        } }
      </Query>
    );
  }
}

PreviewProjectContent.propTypes = {
  id: string,
  data: array.isRequired,
};

export default PreviewProjectContent;
