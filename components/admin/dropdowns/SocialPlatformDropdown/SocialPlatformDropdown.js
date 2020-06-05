/* eslint-disable no-bitwise */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import sortBy from 'lodash/sortBy';
import gql from 'graphql-tag';
import { addEmptyOption } from 'lib/utils';
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

const getSocialPlatformId = ( platforms = [], selected ) => {
  const _platforms = selected.map( _selected => {
    const _platform = platforms.find( platform => platform.name.toLowerCase() === _selected );

    return _platform?.id;
  } );

  return _platforms.length ? _platforms : [];
};

const getSocialPlatform = filename => {
  let social = [];

  if ( ~filename.indexOf( 'Twitter' ) || ~filename.indexOf( 'twitter' ) || ~filename.indexOf( 'TW' ) ) {
    social = ['twitter'];
  }

  if ( ~filename.indexOf( 'Facebook' ) || ~filename.indexOf( 'facebook' ) || ~filename.indexOf( 'FB' ) ) {
    social = ['facebook', 'instagram'];
  }

  return {
    social,
    ids: platforms => getSocialPlatformId( platforms, social ),
  };
};


const SocialPlatformDropdown = props => {
  const { filename, onChange } = props;

  return (
    <Query
      query={ SOCIAL_PLATFORMS_QUERY }
      onCompleted={ data => {
        // if filename present, attempt to autoselect based on filename
        if ( filename ) {
          const value = getSocialPlatform( filename ).ids( data.socialPlatforms );

          // select the value
          if ( typeof onChange === 'function' ) {
            onChange( null, { id: props.id, name: 'social', value } );
          }
        }
      } }
    >
      {( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;

        let options = [];

        if ( data && data.socialPlatforms ) {
          options = sortBy( data.socialPlatforms, platform => platform.name ).map( platform => ( {
            key: platform.id,
            text: platform.name,
            value: platform.id,
          } ) );
        }

        addEmptyOption( options );

        return (
          <Fragment>
            {!props.label && (
              <VisuallyHidden>
                <label htmlFor={ props.id }>{`${props.id} social platforms`}</label>
              </VisuallyHidden>
            )}

            <Form.Dropdown
              id={ props.id }
              name="social"
              options={ options }
              placeholder="–"
              loading={ loading }
              fluid
              selection
              multiple  // hardocded here as facebook selection returns both fb and instagram
              { ...props }
            />
          </Fragment>
        );
      }}
    </Query>
  );
};


SocialPlatformDropdown.defaultProps = {
  id: '',
};

SocialPlatformDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  filename: PropTypes.string,
};

export default React.memo( SocialPlatformDropdown, areEqual );
export { SOCIAL_PLATFORMS_QUERY };
