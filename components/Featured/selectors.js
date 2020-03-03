import { createSelector } from 'reselect';

/**
 * Direct selectors
 */
const selectFeatured = state => state.featured;
const selectFeaturedLoading = state => state.featured.loading;
const selectFeaturedError = state => state.featured.error;
const selectAuthentication = state => state.authentication;

/**
 * Selector factories: returns selector instances
 */
const makeFeatured = () => createSelector( selectFeatured, featured => featured );
const makeFeaturedLoading = () => createSelector( selectFeaturedLoading, loading => loading );
const makeFeaturedError = () => createSelector( selectFeaturedError, error => error );
const makeAuthentication = () => createSelector( selectAuthentication, authentication => authentication );

export {
  makeFeatured,
  makeFeaturedLoading,
  makeFeaturedError,
  makeAuthentication
};
