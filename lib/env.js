import getConfig from 'next/config';

/**
 * XXX Next.js FORCES the NODE_ENV to be either "development" or "production" at build time.
 * Because of this, we have a difference between the process.env.NODE_ENV given by Express and the on given by Next
 * In order to avoid this huge issue, we stored the real NODE_ENV in next.runtimeConfig.js:NODE_ENV
 * And this function must be used to get the NODE_ENV instead of process.env.NODE_ENV
 *
 * This function is compatible with Express/Next, and can be used anywhere, on the client and server.
 *
 * @returns {string}
 * @see XXX https://github.com/zeit/next.js/issues/3605#issuecomment-370255754
 */
export const getNodeEnv = () => {
  const { publicRuntimeConfig } = getConfig();

  const realNodeEnv = publicRuntimeConfig.NODE_ENV;

  return realNodeEnv || process.env.NODE_ENV;
};
