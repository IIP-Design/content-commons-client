import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import capitalize from 'lodash/capitalize';
import ApolloError from 'components/errors/ApolloError';
import { Dropdown, Embed, Loader } from 'semantic-ui-react';

import downloadIcon from 'static/icons/icon_download.svg';
import { getStreamData, getYouTubeId } from 'lib/utils';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import ModalContentMeta from 'components/modals/ModalContentMeta/ModalContentMeta';
import ModalDescription from 'components/modals/ModalDescription/ModalDescription';
import ModalPostMeta from 'components/modals/ModalPostMeta/ModalPostMeta';

import Notification from 'components/Notification/Notification';
import PopupTrigger from 'components/popups/PopupTrigger';
import PopupTabbed from 'components/popups/PopupTabbed';

import './PreviewProjectItem.scss';

const VIDEO_PROJECT_UNITS_QUERY = gql`
  query VideoProjectUnits( $id: ID! ){
    videoProject( id: $id ) {
      id
      createdAt
      updatedAt
      projectType
      team {
        name
      }
      units {
        id
        title
        descPublic
        thumbnails {
          id
          image {
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

class PreviewProjectItem extends React.PureComponent {
  state = {
    dropDownIsOpen: false,
    selectedLangauge: 'english'
  }

  getLanguages = units => (
    units.map( unit => ( {
      key: unit.language.languageCode,
      value: unit.language.displayName,
      text: capitalize( unit.language.displayName )
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

  // selectLanguage = language => (
  //   this.setState( { selectedLanguage: language } )
  // );

  handleChange = ( e, { value } ) => {
    this.toggleArrow();
    this.selectLanguage( value );
  };

  render() {
    /* eslint-disable react/prop-types */
    const { id } = this.props;
    return (
      <Query query={ VIDEO_PROJECT_UNITS_QUERY } variables={ { id } }>
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

          console.log( data );

          const {
            projectType,
            createdAt,
            updatedAt,
            team,
            units
          } = data.videoProject;

          const {
            title,
            descPublic,
            language
          } = data.videoProject.units[0];

          const { dropDownIsOpen, selectedLangauge } = this.state;

          // const projectItems = this.getProjectItems( units );
          // const selectedItem = projectItems[String( selectedLangauge )];

          return (
            <ModalItem
              className="videoProjectPreview"
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
                  icon={ dropDownIsOpen ? 'chevron up' : 'chevron down' }
                  options={ this.getLanguages( units ) }
                  defaultValue={ selectedLangauge }
                  onClick={ this.toggleArrow }
                  onChange={ this.handleChange }
                />
              </div>

              <ModalContentMeta type={ data.videoProject.projectType } dateUpdated={ updatedAt } />
              <ModalDescription description={ descPublic } />
              <ModalPostMeta source={ team.name } datePublished={ createdAt } />
            </ModalItem>
          );
        } }
      </Query>
    );
  }
}

PreviewProjectItem.propType = {
  id: PropTypes.string
};

export default PreviewProjectItem;
export { VIDEO_PROJECT_UNITS_QUERY };
