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

const GRAPHIC_STYLES_QUERY = gql`
  query GRAPHIC_STYLES_QUERY {
    graphicStyles {
      id
      name
    }
  }
`;

const areEqual = ( prevProps, nextProps ) => prevProps.value === nextProps.value;

const getIds = ( styles, selected ) => {
  const _styles = selected.map( _selected => {
    const _style = styles.find( sty => sty.name.toLowerCase() === _selected );

    return _style?.id;
  } );

  return _styles.length ? _styles : [];
};

const getGraphicStyleId = ( styles = [], style ) => {
  if ( Array.isArray( style ) ) {
    return getIds( styles, style );
  }

  const _style = styles.find( sty => sty.name.toLowerCase() === style );

  return _style ? _style.id : '';
};

const GraphicStyleDropdown = props => {
  const { filename, onChange, multiple } = props;


  const getGraphicStyle = fn => {
    const file = fn.toLowerCase();
    let style = multiple ? [] : '';

    if ( ~file.indexOf( 'clean' ) || ~file.indexOf( 'shell' ) ) {
      if ( multiple ) {
        style.push( 'clean' );
      } else {
        style = 'clean';
      }
    }

    return {
      style,
      id: styles => getGraphicStyleId( styles, style ),
    };
  };

  return (
    <Query
      query={ GRAPHIC_STYLES_QUERY }
      onCompleted={ data => {
        // if filename present, attempt to autoselect based on filename
        if ( filename ) {
          const value = getGraphicStyle( filename ).id( data.graphicStyles );

          // select the value
          if ( typeof onChange === 'function' ) {
            onChange( null, { id: props.id, name: 'style', value } );
          }
        }
      } }
    >
      {( { data, loading, error } ) => {
        if ( error ) return `Error! ${error.message}`;

        let options = [];

        if ( data && data.graphicStyles ) {
          options = sortBy( data.graphicStyles, style => style.name ).filter(s=>s.name.toLowerCase()!=='clean').map( style => ( {
            key: style.id,
            text: style.name,
            value: style.id,
          } ) );
        }

        addEmptyOption( options );

        return (
          <Fragment>
            {!props.label && (
              <VisuallyHidden>
                <label htmlFor={ props.id }>{`${props.id} graphic styles`}</label>
              </VisuallyHidden>
            )}

            <Form.Dropdown
              id={ props.id }
              name="style"
              options={ options }
              placeholder="–"
              loading={ loading }
              fluid
              selection
              { ...props }
            />
          </Fragment>
        );
      }}
    </Query>
  );
};


GraphicStyleDropdown.defaultProps = {
  id: '',
};

GraphicStyleDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  multiple: PropTypes.bool,
  filename: PropTypes.string,
};

export default React.memo( GraphicStyleDropdown, areEqual );
export { GRAPHIC_STYLES_QUERY };
