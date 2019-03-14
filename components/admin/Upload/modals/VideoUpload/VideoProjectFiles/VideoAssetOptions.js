import React from 'react';
import { Select } from 'semantic-ui-react';

const languageOptions = [
  { key: 'Arabic', value: 'Arabic', text: 'Arabic' },
  { key: 'Bahasa', value: 'Bahasa', text: 'Bahasa' },
  { key: 'Indonesia', value: 'Indonesia', text: 'Indonesia' },
  { key: 'Chinese-simplified', value: 'chinese-simplified', text: 'Chinese (Simplified)' },
  { key: 'English', value: 'English', text: 'English' },
  { key: 'French', value: 'French', text: 'French' },
  { key: 'Japanese', value: 'Japanese', text: 'Japanese' },
  { key: 'Korean', value: 'Korean', text: 'Korean' },
  { key: 'Persian', value: 'Persian', text: 'Persian' },
  { key: 'Portuguese-Brazil', value: 'portuguese-brazil', text: 'Portuguese (Brazil)' },
  { key: 'Russian', value: 'Russian', text: 'Russian' },
  { key: 'Spanish', value: 'Spanish', text: 'Spanish' },
  { key: 'Urdu', value: 'Urdu', text: 'Urdu' },
  { key: 'Vietnamese', value: 'Vietnamese', text: 'Vietnamese' },
  { key: 'text-free', value: 'text-free', text: 'Text-free' },
  { key: 'no-language', value: `no-language`, text: `I don't see my language, add` }
];

const subtitleOptions = [
  { key: 'clean', value: 'clean-no-captions', text: 'Clean - No captions' },
  { key: 'subtitled', value: 'subtitled', text: 'Subtitled' }
];

const typeUseOptionsImages = [
  { key: 'thumbnail-cover-image', value: 'thumbnail-cover-image', text: 'Thumbnail/Cover Image' },
  { key: 'blank', value: 'blank', text: '–' },
  { key: 'social-media-graphic', value: 'social-media-graphic', text: 'Social Media Graphic' },
  { key: 'email-graphic', value: 'email-graphic', text: 'Email Graphic' },
  { key: 'website-hero-image', value: 'website-hero-image', text: 'Website Hero Image' }
];

const typeUseOptionsVideo = [
  { key: 'full-video', value: 'full-video', text: 'Full Video' },
  { key: 'promotional-teaser', value: 'promotional-teaser', text: 'Promotional Teaser' },
  { key: 'video-assets', value: 'video-assets', text: 'Video Assets' },
];

const qualityOptions = [
  { key: 'web', value: 'web', text: 'For Web' },
  { key: 'broadcast', value: 'broadcast', text: 'For Broadcast' },
];

export const SelectLangaugeOptions = () => (
  <Select
    options={ languageOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--language"
    placeholder="-"
  />
);

export const SelectTypeUseOptionsImages = () => (
  <Select
    options={ typeUseOptionsImages }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
    placeholder="-"
  />
);

export const SelectTypeUseOptionsVideo = () => (
  <Select
    options={ typeUseOptionsVideo }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--typeUse"
    placeholder="-"
  />
);

export const SelectSubtitleOptions = () => (
  <Select
    options={ subtitleOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--subtitles"
    placeholder="-"
  />
);

export const SelectQualityOptions = () => (
  <Select
    options={ qualityOptions }
    className="videoProjectFiles_asset_options videoProjectFiles_asset_options--quality"
    placeholder="-"
  />
);
