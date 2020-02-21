import getConfig from 'next/config';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  const { publicRuntimeConfig } = getConfig();
  console.log( `logged ${url}` );
  window.gtag( 'config', publicRuntimeConfig.REACT_APP_GOOGLE_ANALYTICS_ID, {
    page_path: url,
  } );
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
// export const event = ( { action, category, label, value } ) => {
//   window.gtag( 'event', action, {
//     event_category: category,
//     event_label: label,
//     value: value,
//   } );
// };
