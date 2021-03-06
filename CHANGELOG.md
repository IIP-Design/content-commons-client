# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://github.com/IIP-Design/content-commons-client/compare/v5.5.0...HEAD)

_This sections lists changes committed since most recent release_

**Added**
- `SearchInputRadio` component
- New Relic monitoring
- Tests for `FilterSelectionItem` component
- Tests for `FilterSelections` component
- Tests for `ResultsToggleView` component
- Tests for `ResultsHeader` component
- Tests for `Header` component
- `PolicyPriorityDropdown` component
- Tests for `PolicyPriorityDropdown` component
- Create `PackageForm` component
- Create `ButtonCreatePackage` component
- Create `PackageType` component
- Create `PackageTypeDropdown` component
- Create `Checkbox` component
- Create `TextInput` component
- Playbook query, createPlaybook mutation and associated builders
- Playbook admin route
- Admin and package "catch all" routes
- CKEditor5 and custom editor build directory
- CKEditor5 setup to `TextEditor`
- CKEditor5 custom build file to eslint `ignorePattern`
- Mutation for updating a playbook: `UPDATE_PLAYBOOK_MUTATION`
- `ButtonLink` component for links styled as buttons
- Preview playbook links to `PlaybookEdit`
- Admin preview banner message to `Playbook`


**Changed:**
- Wrap navigation menu items in `li` elements
- Use CSS modules for `SearchInput` component styling
- Use CSS modules for `Priorities` and `Recents` component styling
- Replace Semantic UI Grid in `Priorities` and `Recents` with CSS grid
- Replace Semantic UI Item in `Priorities` and `Recents` with native HTML elements
- Replace Semantic UI Card in `ResultItem` with native HTML elements
- Remove the `tabindex` attribute from the mobile hamburger menu
- Replace Semantic UI Header in `SearchTerm` with native HTML elements
- Create live regions on the search results page for the search term and number of hits so that changes get announced by∏ screen readers
- Use CSS modules for `FilterSelections` component styling
- Replace Semantic UI delete Icon in `FilterSelectionItem` with an SVG
- Replace Semantic UI Label in `FilterSelectionItem` with native HTML elements
- Set dropdowns in `RecentsHeader` to not open on focus
- Use CSS modules for `ResultsHeader` component styling
- Use CSS modules for `ResultsToggleView` component styling
- Implement redesigned recent/relevance dropdown
- Replace Semantic UI Header and Img in `Header` with native HTML elements
- Replace `PlaybookDetailsForm` and `PackageDetailsForm` with `PackageForm`
- Remove initialSchema from `PlaybookDetailsForm` and `PackageDetailsForm` validation schemas
- Route package edit screen to admin/package/guidance
- Move package creation to intermediary create page
- Replace Semantic UI Form, Grid, Input in `PressPackageFile` with native HTML elements
- Use CSS modules for `ProjectHeader` component styling
- Rename `PlaybookTextEditor` to `TextEditor` and move up one level
- Update tests for `TextEditor`
- Replace mock mutation with `updatePlaybook` mutation in `PlaybookEdit`
- Create `admin/package/playbook/preview/[id]` route
- Use `PlaybookPreview` component to fetch playbook data
- Use CSS modules for `PlaybookEdit` component
- Adjust focus styling for `Playbook` header buttons
- Remove media embed functionality from `TextEditor`

**Fixed:**
- Skip to content link for improved accessibility
- Default link color and hover styling for improved accessibility
- Focus outline color to meet accessibility contrast requirement
- Add accessible names to `SearchInput` form elements
- Missing image alt attribute values
- Accessible label for the "Browse All" links in each home page featured `section` so that additional context can be conveyed to screen reader software
- Missing accessible label for each featured home page `section`
- Featured section heading levels so there's only one `h1` on the home page
- Missing landmark roles for the `header`, `main`, and `footer` wider compatibility with screen readers' rotor/element list
- Priority and recent items' heading level to expose their titles to screen readers
- Keyboard accessibility of priority and recent items on the home page
- Keyboard accessibility of logged in navigation menu icons
- Keyboard accessibility of video and document cards
- Visually hidden, but accessible content name, for the mobile hamburger menu
- Visually hidden text content for video and document card meta data items
- Heading on the search results page so that its content is "search results" rather than the search term and number of hits, which are dynamic
- Clearing of search filters when the "CLEAR ALL" button loses focus
- Keyboard accessibility of applied filters on the search results page
- Keyboard accessibility of gallery/list view on search results page
- Accessible label to the recent/relevance dropdown on the search results page
- Prevent opening of recent/relevance dropdown when focused
- Accessible label to the results per page dropdown on the search results page
- Prevent opening of results per page dropdown when focused
- Live region for the results per page dropdown that gets announced by screen readers when changed
- Add image dimensions to the DoS seal in the `Header`
- Use `upsert` for the `TextEditor` `updateMutation` to prevent `the relation has no node...` GraphQL error
- PropType for `policy` in `PlaybookDetailsFormContainer`
# [5.5.0](https://github.com/IIP-Design/content-commons-client/compare/v5.4.8...v5.5.0)(2021-07-01)

**Changed:**

- Replace queries dependant on introspection with dedicated enum queries

# [5.4.8](https://github.com/IIP-Design/content-commons-client/compare/v5.4.7...v5.4.8)(2021-04-29)
**Fixed:**
- Images that extend beyond their parent container for Document cards and content

# [5.4.7](https://github.com/IIP-Design/content-commons-client/compare/v5.4.6...5.4.7)(2021-04-19)
**Added:**
- OES to graphic edit screen source dropdown

**Changed:**
- A unique title for press guidance is no longer a required
- Remove document content type from priority search query when user is logged out

# [5.4.6](https://github.com/IIP-Design/content-commons-client/compare/v5.4.5...v5.4.6)(2021-03-24)
**Fixed:**
- Press documents appearing in the search results when the Articles, Graphics & Video radio button selected
- Article page repeatedly re-rendering to infinity

# [5.4.5](https://github.com/IIP-Design/content-commons-client/compare/v5.4.4...v5.4.5)(2021-03-16)
**Fixed:**
- Duplicate packages appearing on landing page for a pinned recent package
- [object Object] display on dashboard for teams with no assigned contentTypes

**Added:**
- Additional search fields to priority query
- Press documents to Priorities section
- Bureau of African Affairs (A/F) to source dropdown on GraphicEdit screen

**Changed**
- Priorities query on landing page to return results no older than 90 days
- Manually tracking mount status to useIsMounted hook

# [5.4.4](https://github.com/IIP-Design/content-commons-client/compare/v5.4.3...v5.4.4)(2021-03-08)

**Fixed:**

- Properly load the review video component on the video project page

# [5.4.3](https://github.com/IIP-Design/content-commons-client/compare/v5.4.2...v5.4.3)(2021-03-05)

**Added:**

- Pinned packages to landing page

**Changed:**

- Move landing page configuration to an external file that loads from a S3 bucket

# [5.4.2](https://github.com/IIP-Design/content-commons-client/compare/v5.4.1...v5.4.2)(2021-02-25)

**Changed:**

- Priority sections on the landing page

**Added:**

- `REACT_APP_UI_CONFIG` configuration environmental variable

# [5.4.1](https://github.com/IIP-Design/content-commons-client/compare/v5.4.0...v5.4.1)(2021-02-01)

**Added:**

- Support for login from Okta dashboard

# [5.4.0](https://github.com/IIP-Design/content-commons-client/compare/v5.3.1...v5.4.0)(2021-01-25)

**Added:**

- Text box to display background information to the PackageDetailsForm component on the backend and to the Package component on the frontend
- Utility functions to replace '\n' characters with applicable html tags

# [5.3.1](https://github.com/IIP-Design/content-commons-client/compare/v5.3.0...v5.3.1)(2021-01-22)

**Changed:**

- Login link on nav no longer needs to use the `<a>` tag as CloudFlare no longer initiating the login

# [5.3.0](https://github.com/IIP-Design/content-commons-client/compare/v5.2.1...v5.2.2)(2021-01-07)

**Added:**

- CSS modules documentation
- AWS Congito integration via amplify

**Removed**

- CloudFlare integration

# [5.2.2](https://github.com/IIP-Design/content-commons-client/compare/v5.2.1...v5.2.2)(2020-12-11)

**Added:**

- ECA PASC option to source dropdown

# [5.2.1](https://github.com/IIP-Design/content-commons-client/compare/v5.2.0...v5.2.1)(2020-09-23)

**Fixed:**

- Query on Home page to return public video projects when user is not logged in.
- Issue with non English projects appearing on home page.
- Title text wrapping on result item thumbnail.

# [5.2.0](https://github.com/IIP-Design/content-commons-client/compare/v5.1.1...v5.2.0)(2020-09-14)

**Changed:**

- Check for a logged in user before calling `getItemRequest` on graphic and video project pages

**Added:**

- 'For Translation' tab with 'Clean' use videos to the video download popup on commons and publisher
- 'Other' tab to the video download popup on commons
- `DownloadThumbnailsAndOtherFiles` component
- Internal option to visibility dropdown on video details project form
- 'INTERNAL USE ONLY' display on video result card and project if project is internal

**Changed:**

- Remove English from the language dropdown in the video preview modal and commons page when the English unit consists of _only_ 'Clean' use videos
- 'GPA Editorial & Design' team name to 'GPA Design & Editorial'
- Include thumbnails in the 'Other' tab in the video download popup
- Download instructions text to match mockup changes
- Remove Transcripts tab in the video download popup on Commons
- Disable the Publish Changes button on the video review screen if there are _only_ 'Clean' use videos and the project has already been published
- Adjust publish message on the video review screen to instruct the user to upload at least one non-clean video before publishing changes

**Fixed:**

- Bug where a video unit's thumbnail was not being assigned to `unit.thumbnail` on the results page; This was preventing a video unit's thumbnails from being listed in its download popup.
- Bug where deleting a video file from a published video's details page would not display the Publish Changes button. Fixed by calling the `updateVideoProject` mutation and passing the `projectTile` as the updated data when a video file is removed.
- Bug where changing a video file's language would not display the Publish Changes button. Fixed by calling the `updateVideoProject` mutation and passing the `projectTile` as the updated data when a video file's language is changed.
- Bug where changing a video file's type would not display the Publish Changes button. Fixed by calling the `updateVideoProject` mutation and passing the `projectTile` as the updated data when a video file's dropdown value is changed.

# [5.1.1](https://github.com/IIP-Design/content-commons-client/compare/v5.1.0...v5.1.1)(2020-07-29)

**Fixed:**

- Issue causing some video downloads to fail. Use filename and not title for download filename

# [5.1.0](https://github.com/IIP-Design/content-commons-client/compare/v5.0.0...v5.1.0)(2020-07-15)

**Added:**

- A reminder to the Home page to prompt the user to login to see internal content
- 'Regional Media Hubs' to graphic details form source dropdown and dashboard graphic queries

**Changed:**

- Package 'Browse All' link sorts packages by created date
- Lists of Documents within a Package are displayed in the order of releases, guidances, transcripts
- Delete button is disabled for published graphic projects
- Display DoS logo and 'Regional Media Hubs' as the source in the graphics card and preview modal

# [5.0.0](https://github.com/IIP-Design/content-commons-client/compare/v4.2.0...v5.0.0)(2020-07-10)

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
- Functionality to add support and graphic files to existing project
- EditGrid component to handle file creation management for both new and existing projects
- GraphicProject as the preview node for ActionButtons in GraphicEdit
- Unit tests for ModalDescription, ModalItem, ModalPostTags, ModalText, ModalTranscript, Popover, and Popup
- A recent graphics section to the featured section on the homepage
- Tests for alt text display to GraphicProject
- Bottom buttons (i.e., Preview, Publish, Publish Changes, Unpublish) to GraphicEdit
- The editable field to the supportFileDetails fragment
- .gif & .otf to the allowed upload file types for graphic projects
- A refetch of the GRAPHIC_PROJECT_QUERY in GraphicEdit after adding new support files to an existing project to update the support files UI
- Additional tests to GraphicProject for users not logged in and the display of editable files and internal description
- GIF to the list of accepted graphic file types on the initial upload page
- A msg prop to IncludeRequiredFileMsg (previously named IncludeVideoFileMsg)
- IncludeRequiredFileMsg to GraphicUpload to display a required file message if no graphic files have been selected for upload
- Unit tests for IncludeRequiredFileMsg and GraphicUpload
- A TeamDropdown component
- Add getFileNameFromUrl utility function
- Internal visibility for Graphic projects

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
- Update unit tests and mock data to address console messages
- Refactor collating of graphic project files in GraphicEdit to address clean shell files being displayed in the wrong column
- Refactor tests for GraphicEdit and add additional mock data
- The footer questions and feedback link to "gpadigitalhelp@state.gov" from "design@america.gov"
- Enable delete button on GraphicEdit before project creation
- Update unit tests for Upload component
- The conditional check in GraphicProject for user logged in status
- Rename to IncludeRequiredFileMsg from IncludeVideoFileMsg for reusability
- Use TeamDropdown instead of an input field in ProjectDetailsForm for graphic projects
- Connect team.id in the graphic buildFormTree function to allow graphic users to change a graphic project's team
- Adjust the graphic project team queries to handle GPA Editorial & Design or ShareAmerica, i.e., the two TeamDropdown options for graphic
- Use updateGraphicProject mutation to handle deletion of graphic support files
- Update test data for GraphicSupportFiles to use updateGraphicProject
- Remove the Social Media Share functionality for Graphics
- Use API URL to download video caption files
- Display the ShareAmerica logo in the graphic project preview and graphic project results card if the project's owner is ShareAmerica
- Disable unpublish button on graphic project details page if there are no graphic files
- Set disableBtns state based on the presence of graphic files
- Adjust the no files message to instruct the user to upload at least one graphic file (for an existing project)
- Return the graphic project type when updateGraphicProject is called to delete a graphic file
- Display "Internal Use Only" message in graphic project previews and card if project visibility is INTERNAL
- Update tests for GraphicProject and GraphicCard
- Display press guidance package documents in the order of releases, guidances, and transcripts
- Use editable field to collate graphic project support files

**Fixed:**

- Fixed width in files popover menu
- Hide the "saving changes" growl notification upon initial load of the project details form
- The Formik initial save bug for GraphicProjectDetailsFormContainer and GraphicFilesFormContainer
- Copyright dropdown validation for ProjectDetailsForm
- Change way packages are removed from featured data list so that it doesn't have to be the first group listed
- Display of alt text on GraphicProject
- Rename useFileStateManager hook to correct spelling
- Check for public user.id before displaying press archive footer link
- Remove duplicate Venezuela priorities object from home page

# [4.2.0](https://github.com/IIP-Design/content-commons-client/compare/v4.1.1...v4.2.0)(2020-06-11)

**Added:**

- Functionality to download all documents in a package to a zip file

**Changed:**

- Documents Format filter label to "Press Releases and Guidance”
- Package search to include documents so Package search returns results

**Removed:**

- Guidance Packages as an option in Format filter options

# [4.1.1](https://github.com/IIP-Design/content-commons-client/compare/v4.1.0...v4.1.1)(2020-05-22)

**Added:**

- Added Google Tag Manager Containers

**Changed:**

- Videos with subtitles now display by default if present

**Fixed:**

- Login now properly redirects to CloudFlare on mobile
- Escape special characters when setting AWS S3 key for upload to address issues with download and display
- Added 'name' property to elastic tag to ensure 'Coronavirus' surfaces in search

# [4.1.0](https://github.com/IIP-Design/content-commons-client/compare/v4.0.0...v4.1.0)(2020-05-05)

**Changed:**

- Packages on landing page now sort by `created` date
- Removed Facebook and Twitter sharing options for video

# [4.0.0](https://github.com/IIP-Design/content-commons-client/compare/v3.1.5...v4.0.0)

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

# [3.1.5](https://github.com/IIP-Design/content-commons-client/compare/v3.1.4...v3.1.5)(2020-03-25)

**Added:**

- Coronavirus (COVID-19) priorities section to homepage

# [3.1.4](https://github.com/IIP-Design/content-commons-client/compare/v3.1.3...v3.1.4)(2020-03-20)

**Fixed:**

- Hide internal-only visibility option for videos until that view is made available.

# [3.1.3](https://github.com/IIP-Design/content-commons-client/compare/v3.1.2...v3.1.3)(2020-02-11)

**Fixed:**

- Re-order priorities section on homepage

# [3.1.2](https://github.com/IIP-Design/content-commons-client/compare/v3.1.1...v3.1.2)(2020-02-03)

**Added:**

- Venezuela priorities section to homepage

**Fixed:**

- Registration issue throwing a type error on form submission
- Twitter share did not take user to the applicable video or post

# [3.1.1](https://github.com/IIP-Design/content-commons-client/compare/v3.1.0...v3.1.1)(2020-01-13)

**Fixed:**

- Suppress mock data

# [3.1.0](https://github.com/IIP-Design/content-commons-client/compare/v3.0.0...v3.1.0)(2020-01-13)

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

# [3.0.0](https://github.com/IIP-Design/content-commons-client/compare/v1.8.4...v3.0.0)(2019-12-02)

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

# [1.8.4](https://github.com/IIP-Design/content-commons-client/compare/v1.8.3...v1.8.4)(2019-10-31)

**Added:**

- Added a '5G' department priority section to the front page

# [1.8.3](https://github.com/IIP-Design/content-commons-client/compare/v1.8.2...v1.8.3)(2019-10-02)

**Added:**

- Added a logo for VOA Editorials

**Changed:**

- Updated IIP properties to GPA

# [1.8.2](https://github.com/IIP-Design/content-commons-client/compare/v1.8.1...v1.8.2)(2019-8-21)

**Fixed:**

- Limited categories to three items in the Latest and Priority sections to resolve a display issue

# [1.8.1](https://github.com/IIP-Design/content-commons-client/compare/v1.8.0...v1.8.1)(2019-7-24)

**Fixed:**

- Resolved bug with Recents section

# [1.8.0](https://github.com/IIP-Design/content-commons-client/compare/v1.7.1...v1.8.0)(2019-7-24)

**Added:**

- Added a Department Priority section to the front page
- Configured Department Priority section to display the topic of Iran

**Changed:**

- Style updates to accommodate the Department Priority section
- Text updates in the Recents section to maintain consistency with the Department Priority section

# [1.7.1](https://github.com/IIP-Design/content-commons-client/compare/v1.7.0...v1.7.1)(2019-6-26)

**Changed:**

- Updated IIP language to GPA in the footer

# [1.7.0](https://github.com/IIP-Design/content-commons-client/compare/v1.6.8...v1.7.0)(2019-5-24)

**Added:**

- Articles now have a direct page in Commons similar to videos
- The article display will utilize this direct link if the original source is content.america.gov

# [1.6.8](https://github.com/IIP-Design/content-commons-client/compare/v1.6.7...v1.6.8)(2019-3-11)

**Fixed:**

- Resolved an issue wherein languages were not being loaded for the search bar menu on certain pages

# [1.6.7](https://github.com/IIP-Design/content-commons-client/compare/v1.6.6...v1.6.7)(2019-3-08)

**Changed:**

- Category and Source filters will update based on the search
- Search language is now set via a dropdown on the search bar
- VOA has been renamed to VOA Editorials

**Added:**

- Open Graph tags have been added
- A logo has been added for DoS properties

# [1.6.6](https://github.com/IIP-Design/content-commons-client/compare/v1.6.5...v1.6.6)(2019-1-30)

**Changed:**

- Update filename convention for Transcripts like Video and SRT

# [1.6.5](https://github.com/IIP-Design/content-commons-client/compare/v1.6.4...v1.6.5)(2019-1-18)

**Added:**

- Adds a data-action attribute to various elements that users might interact with. This provides an attribute that Google Tag Manager can cue on to record a specific user action.

**Changed:**

- Update Slack logo in footer
- Filenames for SRT and Videos will always be the English title or 'commons-video' if not available

# [1.6.4](https://github.com/IIP-Design/content-commons-client/compare/v1.6.3...v1.6.4)(2019-1-08)

**Fixed:**

- Resolved error that was thrown when typing in odd number of double quotations in the search field.

**Added:**

- Display a notification to OpenNet users on Internet Explorer recommending they use Chrome

**Changed:**

- Downloaded files now follow the - [filename]‌.[language code]‌\_[country code].[ext] naming convention
- Search results are now displayed by relevancy when a search term is used. Title field is given precedence and a boost is given to newer items
- Alter sub-heading text in the site header

# [1.6.3](https://github.com/IIP-Design/content-commons-client/compare/v1.6.2...v1.6.3)(2018-11-07)

**Fixed:**

- Disable service worker due to caching issues.

# [1.6.2](https://github.com/IIP-Design/content-commons-client/compare/v1.6.1...v1.6.2)(2018-11-07)

**Fixed:**

- Resolved an issue with transcript text not displaying

# [1.6.1](https://github.com/IIP-Design/content-commons-client/compare/v1.6.0...v1.6.1)(2018-11-01)

**Fixed:**

- Resolved an issue with right-to-left languages after latest update

# [1.6.0](https://github.com/IIP-Design/content-commons-client/compare/v1.5.2...v1.6.0)(2018-11-01)

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

# [1.5.2](https://github.com/IIP-Design/content-commons-client/compare/v1.5.1...v1.5.2)(2018-10-18)

**Changed:**

- DOS seal now using svg; removed multiple png instances

# [1.5.1](https://github.com/IIP-Design/content-commons-client/compare/v1.5.0...v1.5.1)(2018-10-17)

**Added:**

- Make search icon clickable
- Remove BETA tag and add DOS Seal

# [1.5.0](https://github.com/IIP-Design/content-commons-client/compare/v1.4.3...v1.5.0)(2018-10-05)

**Added:**

- Add captions and alt text to images in the search results modal

**Fixed:**

- Define image figures to a maximum width of 100% to prevent them from overflowing the embed container

**Changed:**

- Use locale rather than language code to maintain project-wide consistency

# [1.4.3](https://github.com/IIP-Design/content-commons-client/compare/v1.4.2...v1.4.3)(2018-09-20)

**Changed:**

- Set single article module portion of embed URL to an environmental variable

# [1.4.2](https://github.com/IIP-Design/content-commons-client/compare/v1.4.1...v1.4.2)(2018-09-12)

**Fixed:**

- Languages will only be displayed in the video language dropdown if a source exists in the language unit

# [1.4.1](https://github.com/IIP-Design/content-commons-client/compare/v1.4.0...v1.4.1)(2018-09-10)

**Fixed:**

- Fixed difficulty selecting icon links in popups

# [1.4.0](https://github.com/IIP-Design/content-commons-client/compare/v1.3.0...v1.4.0)(2018-09-08)

**Added:**

- Enhanced footer to include additional links and information
- Added embed code generation to enable sharing off posts
- Updated direct link for posts to point to original source

**Fixed:**

- Fixed tabbed underline on video popups

# [1.3.0](https://github.com/IIP-Design/content-commons-client/compare/v1.2.0...v1.3.0)(2018-08-08)

**Added:**

- Embed code to display to embed both YouTube and vimeo videos now active
- Share windows now are either a popup for desktop or a new page for mobile

**Fixed:**

- Caption toggle now operates correctly and loads correct video based on caption selection
- Fixed direct link UI display

# [1.2.0](https://github.com/IIP-Design/content-commons-client/compare/v1.1.0...v1.2.0)(2018-07-18)

**Added:**

- Added Vimeo support
- Provided a Vimeo/CloudFlare fallback option when YouTube is not available
- Provided a sharable, direct link to the video page
- Updated UI to provide "web" and "broadcast" video quality display
- Updated various UI styles

**Fixed:**

- Sources dropdown now sorted alphabetically

# [1.1.0](https://github.com/IIP-Design/content-commons-client/compare/v1.0.0...v1.1.0)(2018-06-15)

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
