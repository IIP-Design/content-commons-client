import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react';
import { getCount, getFileExt } from 'lib/utils';
import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown/CategoryDropdown';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
import './PressPackageFile.scss';

const PressPackageFile = props => {
  const {
    id, filename, filetype, image
  } = props.unit;

  const fileExtension = getFileExt( filename );
  const fileNameNoExt = ( filename && filename.replace( fileExtension, '' ) ) || '';

  return (
    <div id={ id } className="package-file">
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={ 16 } tablet={ 4 } computer={ 4 } className="thumbnail">
            { getCount( image ) && image[0].signedUrl
              ? <img src={ image[0].signedUrl } alt={ image[0].alt } />
              : <div className="placeholder" /> }
          </Grid.Column>
          <Grid.Column mobile={ 16 } tablet={ 12 } computer={ 12 } className="meta">
            <div className="data">
              <dl>
                <div>
                  <dt id="file-name"><b className="label">File Name:</b></dt>
                  <dd role="definition" aria-labelledby="file-name">
                    { fileNameNoExt || filename }
                  </dd>
                </div>

                <div>
                  <dt id="release-type"><b className="label">Release Type:</b></dt>
                  <dd role="definition" aria-labelledby="release-type">
                    { filetype }
                  </dd>
                </div>

                <div>
                  <dt id="page-count"><b className="label">Pages:</b></dt>
                  <dd role="definition" aria-labelledby="page-count">TBD</dd>
                </div>
              </dl>
            </div>

            <Form>
              <Form.Group widths="equal">
                <Form.Field>
                  <VisibilityDropdown
                    id="visibility"
                    name="visibility"
                    label="Visibility Setting"
                    value="INTERNAL"
                    onChange={ () => {} }
                    // error={ touched.visibility && !!errors.visibility }
                  />
                </Form.Field>

                <Form.Field>
                  <CategoryDropdown
                    id="categories"
                    name="categories"
                    label="Categories"
                    // value={ values.categories }
                    onChange={ () => {} }
                    // error={ touched.categories && !!errors.categories }
                    multiple
                    search
                    closeOnBlur
                    closeOnChange
                    required
                    style={ { marginBottom: '1em' } }
                  />
                  <p className="field__helper-text">Select up to 2.</p>
                </Form.Field>
              </Form.Group>

              <Form.Group>
                <Form.Field width={ 8 }>
                  <p>Author Bureaus/Offices (to be added)</p>
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
                </Form.Field>

                <Form.Field width={ 8 }>
                  <TagDropdown
                    id="tags"
                    label="Tags"
                    name="tags"
                    // value={ values.tags }
                    onChange={ () => {} }
                    style={ { marginBottom: '1em' } }
                  />
                  <p className="field__helper-text">Enter keywords separated by commas.</p>
                </Form.Field>
              </Form.Group>
            </Form>
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
