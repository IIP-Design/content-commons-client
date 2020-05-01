import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ApolloError from 'components/errors/ApolloError';
import PreviewLoader from 'components/admin/Previews/PreviewLoader/PreviewLoader';
import { DashboardContext } from 'context/dashboardContext';

const GraphicPreview = ( { data } ) => {
  const { state } = useContext( DashboardContext );

  const { loading, error } = state;

  if ( error ) return <ApolloError error={ error } />;
  if ( loading ) return <PreviewLoader />;

  if ( !data ) return null;

  return <p>{`Placeholder for ${data.projectTitle}`}</p>;
};

GraphicPreview.propTypes = {
  data: PropTypes.object
};

export default GraphicPreview;
