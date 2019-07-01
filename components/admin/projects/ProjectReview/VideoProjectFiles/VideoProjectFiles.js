/**
 *
 * VideoProjectFiles
 *
 */
import React from 'react';
import { object, string } from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import { Button, Grid, Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { VIDEO_PROJECT_PREVIEW_QUERY } from 'components/admin/projects/ProjectEdit/PreviewProjectContent/PreviewProjectContent';
import { getPluralStringOrNot } from 'lib/utils';
import VideoProjectFile from './VideoProjectFile/VideoProjectFile';

import './VideoProjectFiles.scss';


const VideoProjectFiles = props => {
  const { error, loading, project } = props.data;

  if ( loading ) {
    return (
      <div style={ {
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
          content="Loading project file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { units } = project;

  if ( !units || ( units && units.length === 0 ) ) return null;

  const getTag = ( tag, unit ) => {
    const translation = tag.translations.find( t => (
      t.language.locale === unit.language.locale
    ) );

    if ( translation && translation.name ) {
      return translation.name;
    }
  };

  const getTags = ( tags, unit ) => (
    tags.reduce( ( acc, curr ) => (
      `${acc ? `${acc}, ` : ''}${getTag( curr, unit )}`
    ), '' )
  );

  const handleEdit = () => {
    const { id } = props;
    Router.push( {
      pathname: '/admin/project',
      query: {
        id,
        content: 'video',
        action: 'edit'
      }
    }, `/admin/project/video/${id}/edit` );
  };

  return (
    <section className="section section--project_units project_units layout">
      <h3 className="project_units_headline uppercase">
        { `${getPluralStringOrNot( units, 'Video' )} in Project` }
      </h3>
      { units.map( unit => {
        const {
          files, language, tags, thumbnails
        } = unit;

        return (
          <div key={ unit.id } className="project_unit">
            <Grid>
              <Grid.Row
                className={
                  `project_unit_header ${unit.language.textDirection}`
                }
              >
                <Grid.Column floated="left" mobile={ 8 }>
                  <h4 className="title">{ unit.title }</h4>
                </Grid.Column>
                <Grid.Column floated="right" mobile={ 8 } className="project_unit_edit">
                  <Button
                    className="project_button project_button--edit"
                    content="Edit"
                    onClick={ handleEdit }
                  />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_unit_meta language">
                <Grid.Column width={ 16 }>
                  <p><b className="label">Language:</b> { language.displayName }</p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_unit_meta description">
                <Grid.Column computer={ 8 }>
                  <p className="public_description">
                    <b className="label">Public Description:</b>
                    <span
                      className={
                        `content ${language.textDirection}`
                      }
                      style={
                        language.textDirection === 'RTL'
                          ? { display: 'block' }
                          : {}
                      }
                    >
                      { ' ' }
                      { unit.descPublic || project.descPublic }
                    </span>
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_unit_meta tags">
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 }>
                  <p><b className="label">Additional Keywords:</b>
                    { ` ${( tags && tags.length > 0 )
                      ? getTags( tags, unit )
                      : ''}` }
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="project_unit_meta file-count">
                <Grid.Column width={ 16 }>
                  <p><b className="label">Files:</b> { ( files && files.length ) || 0 } </p>
                </Grid.Column>
              </Grid.Row>

              { files && files.length > 0 && files.map( file => (
                <VideoProjectFile
                  key={ file.id }
                  file={ file }
                  thumbnail={
                    thumbnails && thumbnails.length > 0 && thumbnails[0]
                  }
                />
              ) ) }
            </Grid>
          </div>
        );
      } ) }
    </section>
  );
};

VideoProjectFiles.propTypes = {
  id: string,
  data: object
};

export default graphql( VIDEO_PROJECT_PREVIEW_QUERY, {
  options: props => ( {
    variables: { id: props.id },
  } )
} )( VideoProjectFiles );
