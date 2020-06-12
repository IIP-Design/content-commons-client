# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/IIP-Design/content-commons-client/compare/v4.0.0...HEAD)

_This sections lists changes committed since most recent release_

**Added:**

- A graphic project page type and preview modal
- Added countries filter to frontend search
- Added SCSS module support to next config
- New Popover component to be used as replacement for SemanticUI popup
- Content type search filter option on the homepage for logged in users
- Support for Cypress end-to-end testing
- Handling for displaying grayed-out localGraphicProject data, i.e., pre-upload of selected graphic files
- Handling for disabled graphic file form fields if localGraphicProject data has been selected for uploading
- Handling of graphic file form values for localGraphicProject data
- Display of graphic files fieldset thumbnail overlay, filesize, trash icon, and title for localGraphicProject data
- A tabIndex property to the Filename tooltip element for keyboard accessibility
- The aria-hidden property to the Filename tooltip element to prevent the filename from being read twice by screen readers
- Unit tests for Filename, GraphicSupportFiles, and GraphicFilesForm
- Functionality to add support and graphic files to exisiting project
- EditGrid component to handle file creation management for both new and exisiting projects
- GraphicProject as the preview node for ActionButtons in GraphicEdit
- Unit tests for ModalDescription, ModalItem, ModalPostTags, ModalText, ModalTranscript, Popover, and Popup
- A recent graphics section to the featured section on the homepage

**Changed:**

- Use component state instead of props for checkboxes in filter menus
- Swap out Airbnb ESLint config for custom GPA/LAB shared config
- Paginate and sort Dashboard on the server and not the client
- Removed subscription data from TableBody & updated test
- Sort packages on the home page by creation date
- Centralize dashboard data management using at context object to store loading/error states, relevant queries, row and column selections, etc.
- Simplify table components, for the most part removing the GraphQL queries therein and instead passing in data
- Consolidate redundant components including table body messages and preview pop-ups
- Move AddFilesSectionHeading to the GraphicEdit component
- Move GraphicSupportFiles to the GraphicEdit directory
- Move Filename component up to components/admin directory for better sharing
- Use Filename component to handle truncated filenames in GraphicSupportFiles and GraphicFilesForm components
- The imageDetails fragment to return dimensions
- The getCount util function to handle strings
- Unit tests for GraphicEdit, PackageDetailsFormContainer, PackageEdit, PressPackageFile, SupportItem, and User components
- Remove LanguageDropdown from GraphicSupportFiles
- Remove the update mutation from GraphicSupportFiles since the LanguageDropdown is no longer needed for editable support files
- Display graphic support and image files by filename
- Display graphic project shell files as editable support files rather than graphic files
- The GraphicSupportFiles delete mutation to handle both graphic and support files since shell files are now listed as editable support files
- Place "twitter" in an array in SocialPlatformDropdown since the dropdown has the multiple prop
- Display information icons next to headings for graphic support files existing projects only
- Display alt helper text next to the label rather under its textarea field
- The validationSchema for GraphicFilesFormContainer to handle empty options
- Display of copyright message, internal description, alt text, social platforms, and file type meta data in social graphics preview
- Hide display of published date for social graphics preview
- Social graphics download placeholder text to display social platform(s)
- Remove unneeded getMutation function in GraphicSupportFiles since the shell file is saved as a SupportFile instead of ImageFile
- Style social graphic preview thumbnail to maintain its aspect ratio
- Use heading elements for internal description & alt titles for better semantics in GraphicProject
- Refactor the filter for Twitter images to support the ImageFile social field array return value
- Refactor ModalContentMeta as functional component
- Adjust modal stylesheets for consistency
- Update unit tests for ActionButtons, GraphicEdit, GraphicProject, and ModalContentMeta
- Move the fetching of featured item results and post types from Redux to Context

**Fixed:**

- Fixed width in files popover menu
- Hide the "saving changes" growl notification upon initial load of the project details form
- The Formik initial save bug for GraphicProjectDetailsFormContainer and GraphicFilesFormContainer
- Copyright dropdown validation for ProjectDetailsForm
- Change way packages are removed from featured data list so that it doesn't have to be the first group listed

# [4.1.1](2020-05-22)

**Added:**

- Added Google Tag Manager Containers

**Changed:**

- Videos with subtitles now display by default if present

**Fixed:**

- Login now properly redirects to CloudFlare on mobile
- Escape special characters when setting AWS S3 key for upload to address issues with download and display
- Added 'name' property to elastic tag to ensure 'Coronavirus' surfaces in search

# [4.1.0](2020-05-05)

**Changed:**

- Packages on landing page now sort by `created` date
- Removed Facebook and Twitter sharing options for video

# [4.0.0](https://github.com/IIP-Design/content-commons-client/compare/v3.1.1...v4.0.0)

**Added:**

- Add redirect to previous url on successful login.
- Add ability for subscriber to see restricted content.
- Add uploading documentation for press guidance.
- Add Document content type.
- Add Press Guidance Package content type.
- Add Press Guidance upload capability.
- Logged in users can access Press Guidance.
- Add link to the press guidance archive at the bottom of the featured packages box and conditionally add a similar link to the footer while only displaying the link if the user is logged in.
- Add Countries dropdown
- Add Bureaus dropdown
- Add Packages to priorities section
- Add country filter search for documents

**Changed:**

- Replaced h1 elements in the footer with divs in the interest of improved accessibility
- Replaced GTM implementation with React app
- Google authentication thru CloudFlare access
- State.gov authentication thru CloudFlare access using one time pin

**Fixed:**

- Fixed the broken feedback link in the user profile dropdown and added feedback link as variable in config file.

# [3.1.5](2020-03-25)

**Added:**

- Coronavirus (COVID-19) priorities section to homepage

# [3.1.4](2020-03-20)

**Fixed:**

- Hide internal-only visibility option for videos until that view is made available.

# [3.1.3](2020-02-11)

**Fixed:**

- Re-order priorities section on homepage

# [3.1.2](2020-02-03)

**Added:**

- Venezuela priorities section to homepage

**Fixed:**

- Registration issue throwing a type error on form submission
- Twitter share did not take user to the applicable video or post

# [3.1.1](2020-01-13)

**Fixed:**

- Suppress mock data

# [3.1.0](2020-01-13)

**Added:**

- Add "Create New Package" button to upload screen
- Activate content type buttons on upload screen based on user's team permissions
- Update Dashboard component to support Press Office packages
- Created UserAdmin component to allow team switching for testing purposes
- Allow upload of caption .vtt files
- Set visibility flag on each asset to track internal only assets

**Changed:**

- Code libraries were updated:

  - react: 16.11
  - react-apollo: 3.13
  - graphql: 14.5.8
  - next.js: 9.12

- Store full path to elastic search asset to accommodate sharing on external sites
- Update help text on project details screen

**Fixed:**

- Bulk project unpublish now removes assets for S3
- SRT filename adjusted to support Facebook upload
- Turned server side render off for user queries to fix cache issue

# [3.0.0](2019-12-02)

Version 3 is a complete rewrite with focus on the authoring platform. A jump is made to version 3 from 1.8.4 as v2 was an extension of v1 that did not include SSR.

**Added:**

- Next.js integration and code restructure for Server Side rendering (SSR)
- React apollo integration for communication with the server and database
- AWS integration for secure uploads to S3 via signed urls
- Websocket integration for automatic page updates
- Authentication, login and logout
- User account creation and registration
- Authoring interface to create, update, delete, publish and unpublish video projects
- Formik form validation
- Ability to share search results
- Numerous test files for various functionality
- Documentation updated to include help with video upload and publishing

**Changed:**

- Copy and share link for a particular video now must be done via the 'Share' tab in the modal window and not directly from the browser url

**Removed:**

- Language detection on search keystroke

# [1.8.4](2019-10-31)

**Added:**

- Added a '5G' department priority section to the front page

# [1.8.3](2019-10-02)

**Added:**

- Added a logo for VOA Editorials

**Changed:**

- Updated IIP properties to GPA

# [1.8.2](2019-8-21)

**Fixed:**

- Limited categories to three items in the Latest and Priority sections to resolve a display issue

# [1.8.1](2019-7-24)

**Fixed:**

- Resolved bug with Recents section

# [1.8.0](2019-7-24)

**Added:**

- Added a Department Priority section to the front page
- Configured Department Priority section to display the topic of Iran

**Changed:**

- Style updates to accommodate the Department Priority section
- Text updates in the Recents section to maintain consistency with the Department Priority section

# [1.7.1](2019-6-26)

**Changed:**

- Updated IIP language to GPA in the footer

# [1.7.0](2019-5-24)

**Added:**

- Articles now have a direct page in Commons similar to videos
- The article display will utilize this direct link if the original source is content.america.gov

# [1.6.8](2019-3-11)

**Fixed:**

- Resolved an issue wherein languages were not being loaded for the search bar menu on certain pages

# [1.6.7](2019-3-08)

**Changed:**

- Category and Source filters will update based on the search
- Search language is now set via a dropdown on the search bar
- VOA has been renamed to VOA Editorials

**Added:**

- Open Graph tags have been added
- A logo has been added for DoS properties

# [1.6.6](2019-1-30)

**Changed:**

- Update filename convention for Transcripts like Video and SRT

# [1.6.5](2019-1-18)

**Added:**

- Adds a data-action attribute to various elements that users might interact with. This provides an attribute that Google Tag Manager can cue on to record a specific user action.

**Changed:**

- Update Slack logo in footer
- Filenames for SRT and Videos will always be the English title or 'commons-video' if not available

# [1.6.4](2019-1-08)

**Fixed:**

- Resolved error that was thrown when typing in odd number of double quotations in the search field.

**Added:**

- Display a notification to OpenNet users on Internet Explorer recommending they use Chrome

**Changed:**

- Downloaded files now follow the - [filename]‌.[language code]‌\_[country code].[ext] naming convention
- Search results are now displayed by relevancy when a search term is used. Title field is given precedence and a boost is given to newer items
- Alter sub-heading text in the site header

# [1.6.3](2018-11-07)

**Fixed:**

- Disable service worker due to caching issues.

# [1.6.2](2018-11-07)

**Fixed:**

- Resolved an issue with transcript text not displaying

# [1.6.1](2018-11-01)

**Fixed:**

- Resolved an issue with right-to-left languages after latest update

# [1.6.0](2018-11-01)

**Added:**

- Integrate Google Translate API for language detection. Search results will now reflect search term in language
- Redirect to 404 page when a route is not found
- Help content added to embed article and video modal windows
- Message will be shown when no videos are available for download
- Message will be shown when search does not return any results

**Changed:**

- Change favicon to DoS Seal
- Remove "Connecting people with content." from the subheading on the homepage
- Enhance search query
  - Boost the title, desc fields
  - Search by 'Relevance' when text is entered in the search field
  - Ensure that 'Recent' is used in the Browse links and when search field is empty

**Fixed:**

- Search fails if only blank spaces/characters are entered
- Searching on various special characters throws a 400 bad request error
- Selecting 'Browse all [type]' from Landing page and then the 'Back' would not clear type selections
- Search input drops to new line at certain screen widths
- Tooltips expanding Header outside of viewport on Mobile
- Fix iPhone 6,6s,7 issues:
  - Oversized Arrow Icon on Click of Video and SRT Tabs
  - Share, Embed, and Download Links Shifted to the Left Corner of Screen
  - Browse all Video link displays on the left hand corner of the screen instead of the right
  - Copy button is partially visible on share video page and download page
  - Download arrow icon is not visible when you click on video file and SRT tabs.
  - When downloaded, local video is closed, the homepage does not reload
- Edge [v40] and IE[11]: Close Icon Missing from Modals for Articles and Videos
- Edge [v40][9] Copy Button is outside image area on share of video/article
- IE [v11] Win10[7] Articles and Video Pages have Copy Button Partially Displayed and Scroll Bar Displayed
- Edge [v40][9] Copy Button is Outside Image Area on Share of Video/Article
- FF [Win10][15] Copy Button Partially Displayed and Scroll Bar Displayed on Articles and Videos

# [1.5.2](2018-10-18)

**Changed:**

- DOS seal now using svg; removed multiple png instances

# [1.5.1](2018-10-17)

**Added:**

- Make search icon clickable
- Remove BETA tag and add DOS Seal

# [1.5.0]

**Added:**

- Add captions and alt text to images in the search results modal

**Fixed:**

- Define image figures to a maximum width of 100% to prevent them from overflowing the embed container

**Changed:**

- Use locale rather than language code to maintain project-wide consistency

# [1.4.3](2018-09-20)

**Changed:**

- Set single article module portion of embed URL to an environmental variable

# [1.4.2](2018-09-12)

**Fixed:**

- Languages will only be displayed in the video language dropdown if a source exists in the language unit

# [1.4.1](2018-09-10)

**Fixed:**

- Fixed difficulty selecting icon links in popups

# [1.4.0](2018-09-08)

**Added:**

- Enhanced footer to include additional links and information
- Added embed code generation to enable sharing off posts
- Updated direct link for posts to point to original source

**Fixed:**

- Fixed tabbed underline on video popups

# [1.3.0](2018-08-08)

**Added:**

- Embed code to display to embed both YouTube and vimeo videos now active
- Share windows now are either a popup for desktop or a new page for mobile

**Fixed:**

- Caption toggle now operates correctly and loads correct video based on caption selection
- Fixed direct link UI display

# [1.2.0](2018-07-18)

**Added:**

- Added Vimeo support
- Provided a Vimeo/CloudFlare fallback option when YouTube is not available
- Provided a sharable, direct link to the video page
- Updated UI to provide "web" and "broadcast" video quality display
- Updated various UI styles

**Fixed:**

- Sources dropdown now sorted alphabetically

# [1.1.0](2018-06-15)

**Added:**

- Added Contact Us page
- Added Browse all [type] link above each Recents section on Landing page
- Updated help text for video downloads
- Source action creator now accepts an array of owners and not a string as it's search key
- Created owners mappings in source action to (1) support inconsistent owner names and (2) assign a custom name

# [1.0.0](2018-05-29)

**Added:**

- Global search bar
- Feedback form
- About, Help, Privacy Policy pages
- Filter search by Date, Format, Source, Language and Category
- Display search results in either gallery or list formats
- Closable filter selections bubbles
- Contextual number of results
- Video and Article content types search
- Modal window that houses selected item
- Video modal:
  - YouTube or CloudFlare video player
  - Language dropdown to view video in other languages
  - Download icon opens popup to download selected video in various sizes, SRT, Transcript and Help
  - Video meta data
- Article modal:
  - Source content
  - Source Logo
  - Link to original source
  - Article meta data
- Result pagination
