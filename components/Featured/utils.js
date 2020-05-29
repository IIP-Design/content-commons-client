/**
 *
 * @param {Object} item Normalized data for a give content item
 */
export const getCategories = item => {
  const cats = item?.categories?.slice( 0, 3 ).reduce( ( acc, cat, index, arr ) => {
    const c = acc + cat.name.toLowerCase();

    return index < arr.length - 1 && index < 2 ? `${c} · ` : c;
  }, '' );

  return cats;
};
