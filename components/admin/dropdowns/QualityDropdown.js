import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { addEmptyOption } from 'lib/utils';

const VIDEO_QUALITY_QUERY = gql`
  query VIDEO_QUALITY_QUERY {
    __type(name: "VideoQuality"){
     enumValues {
       name
     }
    }
  }
 `;

const IMAGE_QUALITY_QUERY = gql`
query IMAGE_QUALITY_QUERY {
  __type(name: "ImageQuality"){
   enumValues {
     name
   }
  }
}
`;

const QualityDropdown = props => (
  <Query query={ props.type === 'video' ? VIDEO_QUALITY_QUERY : IMAGE_QUALITY_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.__type && data.__type.enumValues ) {
        options = data.__type.enumValues.map( quality => {
          const { name } = quality;
          return {
            key: name,
            text: `For ${name.toLowerCase()}`,
            value: name
          };
        } );
      }

      addEmptyOption( options );

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} quality` }
              </label>
            </VisuallyHidden>
          ) }
          <Form.Dropdown
            id={ props.id }
            name="quality"
            options={ options }
            placeholder="–"
            loading={ loading }
            fluid
            selection
            { ...props }
          />
        </Fragment>

      );
    } }
  </Query>

);

QualityDropdown.defaultProps = {
  id: ''
};


QualityDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.object,
  type: PropTypes.string
};


export default QualityDropdown;
export { VIDEO_QUALITY_QUERY };
export { IMAGE_QUALITY_QUERY };
