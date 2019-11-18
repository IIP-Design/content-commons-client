import React from 'react';
import PropTypes from 'prop-types';

const MetaTerm = props => {
  const { unitId } = props;
  const { definition, displayName, name } = props.term;
  return (
    <div>
      <dt id={ `${name}-${unitId}` }>{ displayName }</dt>
      <dd role="definition" aria-labelledby={ `${name}-${unitId}` }>
        { definition }
      </dd>
    </div>
  );
};

MetaTerm.propTypes = {
  unitId: PropTypes.string,
  term: PropTypes.shape( {
    definition: PropTypes.string,
    displayName: PropTypes.string,
    name: PropTypes.string,
  } )
};

export default MetaTerm;
