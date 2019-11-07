import React from 'react';
import PropTypes from 'prop-types';
// import { graphql } from 'react-apollo';
import { Grid, Loader } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { getCount, getPluralStringOrNot } from 'lib/utils';

const PackageFiles = props => {
  const { error, loading, package: pkg } = props.data;

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
          content="Loading package file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !pkg || !getCount( pkg ) ) return null;

  const { files: units } = pkg;
  if ( !units || getCount( units ) === 0 ) return null;

  return (
    <section className="section section--package-files package-files layout">
      <h2 className="headline uppercase">
        { `Uploaded ${getPluralStringOrNot( units, 'File' )}` }
      </h2>
      { units.map( unit => {
        const {
          id, fileName, releaseType, alt, thumbnails
        } = unit;
        return (
          <div key={ id } className="package-file">
            <Grid>
              <Grid.Row>
                <Grid.Column mobile={ 4 }>
                  { getCount( thumbnails ) && thumbnails[0].url
                    ? (
                      <img
                        src={ thumbnails[0].url }
                        alt={ alt }
                        style={ {
                          height: 'auto',
                          width: '100%',
                          maxWidth: '100%'
                        } }
                      />
                    )
                    : (
                      <div style={ {
                        height: 290,
                        width: '100%',
                        maxWidth: '100%',
                        backgroundColor: '#e1e1e1'
                      } }
                      />
                    )
                  }
                </Grid.Column>
                <Grid.Column mobile={ 12 }>
                  <p><b>File Name:</b> { fileName }</p>
                  <p><b>Release Type:</b> { releaseType }</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        );
      } ) }
    </section>
  );
};

PackageFiles.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object
};

export default PackageFiles;
