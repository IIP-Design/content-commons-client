const INITIAL_STATE = {
  list: [
    { key: 'recent', display_name: 'Any Time' },
    {
      key: 'now-1d',
      display_name: 'Past 24 Hours',
    },
    {
      key: 'now-1w',
      display_name: 'Past Week',
    },
    {
      key: 'now-1M',
      display_name: 'Past Month',
    },
    {
      key: 'now-1y',
      display_name: 'Past Year',
    },
  ],
};

const dates = ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    default:
      return state;
  }
};

export default dates;
