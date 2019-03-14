/**
 *
 * PreviewProjectContent
 *
 */

import React from 'react';
import { object, string } from 'prop-types';
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


/* eslint-disable react/prefer-stateless-function */
class PreviewProjectContent extends React.PureComponent {
  constructor( props ) {
    super( props );

    const { data, projecttype } = this.props;

    this.state = {
      dropDownIsOpen: false,
      selectedLanguage: 'English',
      projectItems: this.getProjectItems( data, projecttype ),
      selectedItem: {},
      languages: this.getLanguages( data, projecttype )
    };
  }

  componentDidMount = () => {
    this.selectProjectItem();
  }

  getLanguages = ( obj, str ) => (
    obj[str].map( item => ( {
      key: item.language.language_code,
      value: item.language.display_name,
      text: item.language.display_name
    } ) )
  );

  getProjectItems = ( obj, str ) => (
    obj[str].reduce( ( acc, item ) => ( {
      ...acc,
      [item.language.display_name]: item
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
    const {
      projectType,
      projectData,
      updated,
      videos
    } = this.props.data;
    const { team } = projectData;

    const {
      dropDownIsOpen,
      selectedLanguage,
      selectedItem,
      languages
    } = this.state;

    if ( !selectedItem || !Object.keys( selectedItem ).length ) return null;

    const {
      title,
      thumbnail,
      language,
      desc,
      uploaded,
      source
    } = selectedItem;

    const youTubeUrl = source[0].streamUrl[0].url;
    const { burnedInCaptions } = source[0];

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
        textDirection={ language.text_direction }
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
                          burnedInCaptions={ burnedInCaptions === 'true' }
                        />
                      )
                    },
                    {
                      title: 'SRT',
                      component: (
                        <DownloadSrt
                          instructions="Download SRTs"
                          units={ videos }
                        />
                      )
                    },
                    {
                      title: 'Thumbnail',
                      component: (
                        <DownloadThumbnail
                          instructions="Download Thumbnail(s)"
                          units={ videos }
                        />
                      )
                    },
                    {
                      title: 'Other',
                      component: (
                        <DownloadOtherFiles
                          instructions="Download Other File(s)"
                          units={ videos }
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
                placeholder={ thumbnail }
                source="youtube"
              />
            ) }

          <ModalContentMeta type={ projectType } dateUpdated={ updated || uploaded } />

          <ModalDescription description={ desc } />
        </div>

        <ModalPostMeta source={ team } datePublished={ uploaded } />
      </ModalItem>
    );
  }
}

PreviewProjectContent.propTypes = {
  data: object.isRequired,
  projecttype: string
};

export default PreviewProjectContent;
