import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid } from 'semantic-ui-react';
import { getCount } from 'lib/utils';
import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown/CategoryDropdown';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';

const PressPackageFile = props => {
  const {
    id, filename, filetype, image
  } = props.unit;

  return (
    <div key={ id } className="package-file">
      <Grid>
        <Grid.Row>
          <Grid.Column mobile={ 4 } className="thumbnail">
            { getCount( image ) && image[0].signedUrl
              ? (
                <img
                  src={ image[0].signedUrl }
                  alt={ image[0].alt }
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
            <p><b className="label">File Name:</b> { filename }</p>
            <p><b className="label">Release Type:</b> { filetype }</p>
            <Form>
              <Form.Group>
                <Form.Field width={ 8 }>
                  <VisibilityDropdown
                    id="visibility"
                    name="visibility"
                    label="Visibility Setting"
                    value="INTERNAL"
                    onChange={ () => {} }
                    // error={ touched.visibility && !!errors.visibility }
                  />
                </Form.Field>

                <Form.Field width={ 8 }>
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
