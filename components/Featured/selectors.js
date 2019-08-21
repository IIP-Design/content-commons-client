import { createSelector } from 'reselect';

/**
 * Direct selectors
 */
const selectFeatured = state => state.featured;
const selectFeaturedLoading = state => state.featured.loading;
const selectFeaturedError = state => state.featured.error;

/**
 * Selector factories: returns selector instances
 */
const makeFeatured = () => createSelector( selectFeatured, featured => featured );
const makeFeaturedLoading = () => createSelector( selectFeaturedLoading, loading => loading );
const makeFeaturedError = () => createSelector( selectFeaturedError, error => error );

export {
  makeFeatured,
  makeFeaturedLoading,
  makeFeaturedError
};
