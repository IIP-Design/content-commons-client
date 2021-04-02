import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { Form } from 'semantic-ui-react';
import { Query } from '@apollo/client/react/components';

import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { getDirection } from 'lib/language';
import { titleCase } from 'lib/utils';

const TAG_QUERY = gql`
  query TAG_QUERY( $locale: String!) {
    tags {
      id
      translations( where: {
        language: {
          locale: $locale
        }
      } ) {
        id
        name
      }
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const TagDropdown = props => (
  <Query query={ TAG_QUERY } variables={ { locale: props.locale } }>
    { ( { data, loading, error } ) => {
      if ( error ) return 'Error!';
      if ( loading || !data ) return <p>Loading...</p>;

      let options = [];

      if ( data && data.tags ) {
        options = data.tags.map( tag => ( {
          key: tag.id,
          text: tag.translations.length
            ? titleCase( tag.translations[0].name )
            : '',
          value: tag.id,
        } ) )
          .sort( ( tagA, tagB ) => {
            const textA = tagA.text.toLowerCase();
            const textB = tagB.text.toLowerCase();

            if ( textA < textB ) return -1;
            if ( textA > textB ) return 1;

            return 0;
          } );
      }

      return (
        <Fragment>
          { !props.label && (
            <VisuallyHidden>
              <label htmlFor={ props.id }>{ `${props.id} tag` }</label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            className={ getDirection( props.locale ) === 'right' ? 'rtl' : 'ltr' }
            id={ props.id }
            fluid
            loading={ loading }
            multiple
            name="tags"
            options={ options }
            search
            selection
            { ...props }
          />
        </Fragment>
      );
    } }
  </Query>
);

TagDropdown.defaultProps = {
  id: '',
  locale: 'en-us',
};

TagDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  locale: PropTypes.string,
};

export default React.memo( TagDropdown, areEqual );
export { TAG_QUERY };
