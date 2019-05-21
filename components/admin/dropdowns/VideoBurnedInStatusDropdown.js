import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
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

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

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
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} subtitles` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="videoBurnedInStatus"
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


VideoBurnedInStatusDropdown.defaultProps = {
  id: ''
};

VideoBurnedInStatusDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( VideoBurnedInStatusDropdown, areEqual );
export { VIDEO_BURNED_IN_STATUS_QUERY };
