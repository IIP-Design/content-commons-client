import React from 'react';
import PropTypes from 'prop-types';

const MetaTerm = props => {
  const { className, terms, unitId } = props;

  return (
    <dl className={ className }>
      { terms.map( term => {
        const { definition, displayName, name } = term;
        return (
          <div key={ `${name}-${unitId}` }>
            <dt id={ `${name}-${unitId}` }>{ displayName }</dt>
            <dd role="definition" aria-labelledby={ `${name}-${unitId}` }>
              { definition }
            </dd>
          </div>
        );
      } ) }
    </dl>
  );
};

MetaTerm.defaultProps = {
  className: ''
};

MetaTerm.propTypes = {
  className: PropTypes.string,
  terms: PropTypes.array,
  unitId: PropTypes.string
};

export default MetaTerm;
