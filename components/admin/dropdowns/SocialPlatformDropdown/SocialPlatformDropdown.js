import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';

import '../dropdown.scss';

const SOCIAL_PLATFORMS_QUERY = gql`
  query SOCIAL_PLATFORMS_QUERY {
    socialPlatforms {
      id
      name
    }
  }
`;


const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const SocialPlatformDropdown = props => (
  <Query query={ SOCIAL_PLATFORMS_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];

      if ( data && data.socialPlatforms ) {
        options = sortBy( data.socialPlatforms, platform => platform.name ).map( platform => ( {
          key: platform.id,
          text: platform.name,
          value: platform.id
        } ) );
      }

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} social platforms` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="platform"
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


SocialPlatformDropdown.defaultProps = {
  id: ''
};

SocialPlatformDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default React.memo( SocialPlatformDropdown, areEqual );
export { SOCIAL_PLATFORMS_QUERY };
