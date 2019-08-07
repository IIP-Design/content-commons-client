# Content Commons Frontend

Handles the public Content Commons as well as the client side adminstative interfaces (Publisher).

### Getting Started

- Clone repository

  ```
  git clone git@github.com:IIP-Design/content-commons-client.git
  ```

- Run `npm install`
- Create an .env file and add the following variables (use .env.tmpl as a guide)

  - **REACT_APP_WEBSITE_NAME**=Content Commons
  - **REACT_APP_PUBLIC_API** : elasticsearch public api endpoint
  - **REACT_APP_CDP_MODULES_URL** : url to content commons modules
  - **REACT_APP_YOUTUBE_API_KEY** : key for YouTube services
  - **REACT_APP_VIMEO_TOKEN** : token for Vimeo services
  - **REACT_APP_GOOGLE_CLIENT_ID** : id used for Google authentication
  - **REACT_APP_GOOGLE_API_KEY** : key to Google services, i.e. language detect
  - **REACT_APP_APOLLO_ENDPOINT** : public api to Content Commons Adminstation Server (graphql server)
  - **REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT** : web socket for apollo subscriptions
  - **REACT_APP_AWS_S3_PUBLISHER_BUCKET**: S3 bucket for authoring uploads
  - **REACT_APP_AWS_S3_PRODUCTION_BUCKET**: S3 bucket for authoring uploads

- Start dev server: `npm run dev`

Client available at [http://localhost:3000/](http://localhost:3000/)

## Running Tests

Tests are executed using [Jest](https://jestjs.io/en/) and [Enzyme](https://airbnb.io/enzyme/)

Ensure that your files following the [component name].test.js naming convention and execute:

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
