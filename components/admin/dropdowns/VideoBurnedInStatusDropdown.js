import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { titleCase } from 'lib/utils';

const VIDEO_BURNED_IN_STATUS_QUERY = gql`
  query VIDEO_BURNED_IN_STATUS_QUERY {
    __type(name: "VideoBurnedInStatus"){
     enumValues {
       name
     }
    }
  }
 `;


const VideoBurnedInStatusDropdown = props => (
  <Query query={ VIDEO_BURNED_IN_STATUS_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.__type && data.__type.enumValues ) {
        options = data.__type.enumValues
          .filter( enumValue => enumValue.name !== 'CAPTIONED' ) // currently not using CAPTIONED
          .map( enumValue => {
            let text = titleCase( enumValue.name );
            text = ( text === 'Clean' ) ? `${text} - No captions` : text;

            return {
              key: enumValue.name,
              text,
              value: enumValue.name
            };
          } );
      }

      return (
        <Dropdown
          id={ props.id }
          name="videoBurnedInStatus"
          onChange={ props.onChange }
          options={ options }
          placeholder="–"
          value={ props.selected }
          // error={ !selectedLanguage }
          fluid
          required={ props.required }
          selection
          loading={ loading }
        />
      );
    } }
  </Query>

);

VideoBurnedInStatusDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default VideoBurnedInStatusDropdown;
export { VIDEO_BURNED_IN_STATUS_QUERY };
