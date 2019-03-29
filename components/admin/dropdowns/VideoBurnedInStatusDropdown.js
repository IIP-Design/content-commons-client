import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
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


const VideoBurnedInStatusDropdown = props => {
  const handleChange = ( e, data ) => {
    props.onChange( e, data, 'videoBurnedinStatus' );
  };

  return (
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
          <Fragment>
            { /* eslint-disable jsx-a11y/label-has-for */ }
            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.forFn} subtitle` }
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

VideoBurnedInStatusDropdown.propTypes = {
  id: PropTypes.string,
  selected: PropTypes.string,
  onChange: PropTypes.func,
  forFn: PropTypes.string,
  required: PropTypes.bool,
};

export default VideoBurnedInStatusDropdown;
export { VIDEO_BURNED_IN_STATUS_QUERY };
