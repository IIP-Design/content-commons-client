import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { getCount } from 'lib/utils';

const PressPackageFile = props => {
  const {
    id, fileName, releaseType, alt, thumbnails
  } = props.unit;

  return (
    <div key={ id } className="package-file">
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={ 4 } className="thumbnail">
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
          <Grid.Column mobile={ 12 } className="meta">
            <p><b className="label">File Name:</b> { fileName }</p>
            <p><b className="label">Release Type:</b> { releaseType }</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

PressPackageFile.propTypes = {
  unit: PropTypes.object
};

export default PressPackageFile;
