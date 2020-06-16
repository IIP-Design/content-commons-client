import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import ApolloError from 'components/errors/ApolloError';
import GraphicProject from 'components/GraphicProject/GraphicProject';
import PreviewLoader from 'components/admin/Previews/PreviewLoader/PreviewLoader';
import { DashboardContext } from 'context/dashboardContext';

const GraphicPreview = ( { data } ) => {
  const { state } = useContext( DashboardContext );

  const { loading, error } = state;

  if ( error ) return <ApolloError error={ error } />;
  if ( loading ) return <PreviewLoader />;

  if ( !data ) return null;

  // Convert the team value from a string to an object to facilitate data normalization
  const graphicItem = {
    ...data,
    team: { name: data.team },
  };

  return <GraphicProject displayAsModal isAdminPreview item={ graphicItem } useGraphQl />;
};

GraphicPreview.propTypes = {
  data: PropTypes.object,
};

export default GraphicPreview;
