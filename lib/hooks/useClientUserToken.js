import cookie from 'js-cookie';
import { useAuth } from 'context/authContext';

/**
 * Return the user object and client ES authentication token
 *
 */
const useClientUserToken = () => {
  const { user } = useAuth();
  if ( user ) {
    const { ES_TOKEN } = cookie.get();
    return { ...user, esToken: ES_TOKEN };
  }
  return null;
};

export default useClientUserToken;
