/**
 *
 * ProjectUnits
 *
 */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, graphql } from 'react-apollo';
import { Card } from 'semantic-ui-react';
import { getFileExt } from 'lib/utils';
import isEmpty from 'lodash/isEmpty';

import { LANGUAGES_QUERY } from 'components/admin/dropdowns/LanguageDropdown';
import { VIDEO_PROJECT_UNITS_QUERY } from 'lib/graphql/queries/video';

import ProjectUnitItem from '../ProjectUnitItem/ProjectUnitItem';
import './ProjectUnits.scss';

const ProjectUnits = props => {
  const {
    data,
    projectId,
    filesToUpload,
    heading,
    extensions,
    setDisableBtns
  } = props;

  const hasProjectUnits = () => ( !isEmpty( data ) && data.projectUnits && data.projectUnits.units );

  // only allow files contiained in the extensions array
  const allowedFiles = filesToUpload.filter( file => extensions.includes( getFileExt( file.input.name ) ) );

  const getUnitsForNewProject = () => {
    // add this to unit state so titles update on upload
    const newUnits = {};

    // 1. Separate files by language
    allowedFiles.forEach( file => {
      if ( !newUnits[file.language] ) {
        newUnits[file.language] = [];
      }
      newUnits[file.language].push( file );
    } );

    // 2. Normalize data structure for consistent ui rendering (same structure as graphql unit)
    const entries = Object.entries( newUnits );
    return entries.map( entry => {
      const [language, fileObjs] = entry;
      return ( {
        files: fileObjs, // spread may break connection
        language: {
          id: language,
          displayName: props.languageList.languages.find( l => l.id === language ).displayName
        }
      } );
    } );
  };

  const fetchUnits = () => {
    if ( hasProjectUnits() ) {
      return data.projectUnits.units;
    }

    if ( filesToUpload.length ) {
      return getUnitsForNewProject();
    }

    return [];
  };

  const [units, setUnits] = useState( [] );

  useEffect( () => {
    setUnits( fetchUnits( data ) );
  }, [] );


  useEffect( () => {
    if ( hasProjectUnits() ) {
      const { projectUnits } = data;
      if ( projectUnits.units && projectUnits.units.length ) {
        setUnits( fetchUnits( data ) );
      } else {
        setDisableBtns( true );
      }
    }
  }, [data] );

  const renderUnits = () => (
    <Card.Group>
      { units.map( unit => (
        <ProjectUnitItem
          key={ unit.language.id }
          unit={ unit }
          projectId={ projectId }
          filesToUpload={ allowedFiles }
        />
      ) ) }
    </Card.Group>
  );

  return (
    <div className="project-units">
      <h2 className="list-heading" style={ { marginBottom: '1rem' } }>{ heading }</h2>
      { units && units.length
        ? renderUnits( units )
        : 'No units available'
       }
    </div>
  );
};


ProjectUnits.propTypes = {
  languageList: PropTypes.object,
  projectId: PropTypes.string,
  heading: PropTypes.string,
  extensions: PropTypes.array,
  data: PropTypes.object,
  filesToUpload: PropTypes.array, // from redux
  setDisableBtns: PropTypes.func
};


const mapStateToProps = state => ( {
  filesToUpload: state.upload.filesToUpload
} );


export default compose(
  connect( mapStateToProps ),
  graphql( LANGUAGES_QUERY, { name: 'languageList' } ),
  graphql( VIDEO_PROJECT_UNITS_QUERY, {
    options: props => ( {
      partialRefetch: true,
      variables: {
        id: props.projectId
      }
    } ),
    skip: props => !props.projectId
  } )
)( ProjectUnits );
