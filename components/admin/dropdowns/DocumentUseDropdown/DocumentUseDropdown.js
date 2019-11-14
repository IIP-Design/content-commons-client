import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Form, Loader } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import sortBy from 'lodash/sortBy';
import { addEmptyOption } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import '../dropdown.scss';

const DOCUMENT_USES_QUERY = gql`
  query {
    documentUses {
      id
      name
    }
  }
`;

const DocumentUseDropdown = props => {
  const { id, onChange } = props;

  return (
    <Query query={ DOCUMENT_USES_QUERY }>
      { ( { data, loading, error } ) => {
        if ( error ) return <ApolloError error={ error } />;

        if ( loading ) {
          return (
            <div style={ {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '200px'
            } }
            >
              <Loader
                active
                inline="centered"
                style={ { marginBottom: '1em' } }
                content="Loading project file(s)..."
              />
            </div>
          );
        }

        let options = [];
        if ( data && data.documentUses ) {
          const { documentUses } = data;
          options = sortBy( documentUses, documentUse => documentUse.name )
            .map( documentUse => ( {
              key: documentUse.id,
              text: documentUse.name,
              value: documentUse.id
            } ) );
          addEmptyOption( options );
        }

        return (
          <Fragment>
            <VisuallyHidden>
              <label htmlFor={ id }>Select Release Type For Document File</label>
            </VisuallyHidden>
            <Form.Dropdown
              name="use"
              id={ id }
              options={ options }
              fluid
              selection
              placeholder="-"
              onChange={ onChange }
            />
          </Fragment>
        );
      } }
    </Query>
  );
};

DocumentUseDropdown.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
};

export default DocumentUseDropdown;
