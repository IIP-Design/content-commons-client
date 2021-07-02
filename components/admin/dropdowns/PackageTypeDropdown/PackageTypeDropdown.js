import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { gql, useQuery } from '@apollo/client';
import { titleCase } from 'lib/utils';

const PACKAGE_TYPE_QUERY = gql`
  query PACKAGE_TYPE_QUERY {
    packageTypeEnum
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const PackageTypeDropdown = ( {
  id,
  label,
  name,
  contentTypes,
  ...rest
} ) => {
  const { data, loading, error } = useQuery( PACKAGE_TYPE_QUERY );

  if ( error ) return `Error! ${error.message}`;

  let options = [];

  if ( data?.packageTypeEnum?.__type?.enumValues ) {
    options = data.packageTypeEnum.__type.enumValues
      .filter( enumValue => {
        const type = enumValue.name === 'DAILY_GUIDANCE' ? 'PACKAGE' : enumValue.name;

        return contentTypes.includes( type );
      } )
      .map( enumValue => {
        const text = enumValue.name === 'DAILY_GUIDANCE' ? 'Guidance' : enumValue.name;

        return {
          key: enumValue.name,
          text: titleCase( text ),
          value: enumValue.name,
        };
      } );
  }

  return (
    <Fragment>
      { !label && (

        <VisuallyHidden>
          <label htmlFor={ id }>
            { `${id} type` }
          </label>
        </VisuallyHidden>
      ) }

      <Form.Dropdown
        id={ id }
        name={ name }
        { ...( label && { label } ) }
        options={ options }
        placeholder="–"
        loading={ loading }
        fluid
        selection
        { ...rest }
      />
    </Fragment>
  );
};


PackageTypeDropdown.defaultProps = {
  id: '',
};

PackageTypeDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  contentTypes: PropTypes.array,
};

export default React.memo( PackageTypeDropdown, areEqual );
export { PACKAGE_TYPE_QUERY };
