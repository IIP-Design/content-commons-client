import React from 'react';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Query } from 'react-apollo';

import Carousel from 'components/admin/projects/ProjectEdit/EditVideoModal/Carousel/Carousel';
import './VideoUnitCarousel.scss';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    project: videoProject( id: $id ) {
      id
      units {
        id
        title
        files {
          id
        }
        language {
          id
          displayName
        }
        thumbnails {
          image {
            id
            alt
            url
          }
        }
      }
    }
  }
`;

const VideoUnitCarousel = ( { callback, projectId, unitId } ) => (
  <section className="video-carousel-section">
    <h3 className="video-carousel-section-header">Videos in this Project</h3>
    <Query query={ VIDEO_PROJECT_QUERY } variables={ { id: projectId } }>
      {
        ( { loading, error, data } ) => {
          if ( loading || !data ) return <p>Loading...</p>;
          if ( error ) return <p>{ `Error: ${error.message}` }</p>;

          const { project } = data;
          const { units } = project;

          return (
            <Carousel callback={ callback } selectedItem={ unitId }>
              { units && (
                units.map( unit => {
                  const { image } = unit.thumbnails[0];
                  const selected = unit.id === unitId ? 'selected' : '';

                  return (
                    <div
                      className={ `video-carousel-item ${selected}` }
                      id={ unit.id }
                      key={ unit.id }
                      onClick={ () => callback( unit.id ) }
                      onKeyUp={ () => callback( unit.id ) }
                      role="button"
                      selected={ selected }
                      tabIndex="0"
                    >
                      <img className={ `video-carousel-item-image ${selected}` } src={ image.url } alt={ image.alt } />
                      <div className="video-carousel-item-heading">
                        { `${unit.title} | ${unit.language.displayName}` }
                      </div>
                      <div className="video-carousel-item-meta">
                        { `${unit.files.length} files` }
                      </div>
                    </div>
                  );
                } )
              ) }
            </Carousel>
          );
        }
      }
    </Query>
  </section>
);

VideoUnitCarousel.propTypes = {
  callback: propTypes.func,
  projectId: propTypes.string,
  unitId: propTypes.string
};

export default VideoUnitCarousel;
