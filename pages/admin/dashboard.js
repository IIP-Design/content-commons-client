import React from 'react';
import User from 'components/User/User';
import Dashboard from 'components/admin/Dashboard/Dashboard';

const DashboardPage = props => (
  <User>
    {
      ( { data } ) => {
        const user = data ? data.authenticatedUser : null;
        return <Dashboard user={ user } />;
      }
    }
  </User>
);

export default DashboardPage;
