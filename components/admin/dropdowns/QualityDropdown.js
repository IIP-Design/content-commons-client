import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

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

const QualityDropdown = props => {
  const handleChange = ( e, data ) => {
    props.onChange( e, data, 'quality' );
  };

  return (
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

        return (
          <Fragment>
            { /* eslint-disable jsx-a11y/label-has-for */ }
            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.forFn} quality` }
              </label>
            </VisuallyHidden>

            <Dropdown
              id={ props.id }
              onChange={ handleChange }
              options={ options }
              placeholder="–"
              value={ props.selected }
              // error={ !selectedLanguage }
              fluid
              required={ props.required }
              selection
              loading={ loading }
            />
          </Fragment>
        );
      } }
    </Query>

  );
};

QualityDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  forFn: PropTypes.string,
  required: PropTypes.bool,
  type: PropTypes.string,
};

export default QualityDropdown;
export { VIDEO_QUALITY_QUERY };
export { IMAGE_QUALITY_QUERY };
