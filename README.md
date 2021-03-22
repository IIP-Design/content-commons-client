# Content Commons Frontend

Handles the public Content Commons as well as the client side administrative interfaces (Publisher).

### Getting Started

- Clone repository

  ```
  git clone git@github.com:IIP-Design/content-commons-client.git
  ```

- Run `npm install`
- Create an .env file and add the following variables (use .env.tmpl as a guide)

  - **REACT_APP_WEBSITE_NAME** : Content Commons
  - **REACT_APP_PUBLIC_API** : elasticsearch public api endpoint
  - **REACT_APP_UI_CONFIG**: Url to load landing page configuration
 
  - **REACT_APP_CDP_MODULES_URL** : url to content commons modules
  - **REACT_APP_SINGLE_ARTICLE_MODULE** : url to content commons single article module

  - **REACT_APP_YOUTUBE_API_KEY** : key for YouTube services
  - **REACT_APP_VIMEO_TOKEN** : token for Vimeo services
  
  - **REACT_APP_GOOGLE_CLIENT_ID** : id used for Google authentication
  - **REACT_APP_GOOGLE_ANALYTICS_ID**: Google Analytics Tracking ID

  - **REACT_APP_APOLLO_ENDPOINT** : public api to Content Commons Adminstation Server (graphql server)
  - **REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT** : web socket for apollo subscriptions
    
  - **REACT_APP_AWS_S3_AUTHORING_BUCKET**: S3 bucket for authoring uploads
  - **REACT_APP_AWS_S3_PRODUCTION_BUCKET**: S3 bucket for storing production assets
   
  - **REACT_APP_AWS_COGNITO_REGION**: AWS Cognito region
  - **REACT_APP_AWS_COGNITO_USER_POOLS_ID** :  AWS Cognito user pool id
  - **REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID** : AWS Cognito identity pool id
  - **REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID** : AWS Cognito web client id
  - **REACT_APP_AWS_COGNITO_CLIENT_DOMAIN** :  AWS Cognito client domain
  - **REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNIN** : url to redirect to after signin
  - **REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNOUT** : url to redirect to after signout
  - **REACT_APP_AWS_COGNITO_OKTA_PROVIDER_NAME** : AWS Cognito okta provider name

- Start dev server: `npm run dev`

Client available at [http://localhost:3000/](http://localhost:3000/)

## CSS Modules

Some components use [CSS Modules](https://github.com/css-modules/css-modules) to scope styles their styles locally.

To convert other components to CSS modules, rename its SCSS file:

```
// to
[ComponentName].module.scss
 
// from
[ComponentName].scss
```

Then change the `import` of the component's SCSS file:

```
// to
import styles from './[ComponentName].module.scss';

// from
import './[ComponentName].scss';
```

To apply CSS module styles, add a `className` value that matches the relevant `className` value from the `styles` object imported from the stylesheet, e.g., `<div className={ styles.someClassName }>...</div>`.

## Running Tests

Tests are executed using [Jest](https://jestjs.io/en/) and [Enzyme](https://airbnb.io/enzyme/)

Ensure that your files following the [ComponentName].test.js naming convention and execute:

```
npm run test
```

## Built With

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Semantic UI React](https://react.semantic-ui.com/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/IIP-Design/content-commons-client/tags).
