export const errorStrings = [
  'A GraphQLError1',
  'A GraphQLError2',
  'A NetworkError',
  'An OtherError',
];

export const apolloError = {
  graphQLErrors: [
    { message: errorStrings[0] },
    { message: errorStrings[1] },
  ],
  networkError: errorStrings[2],
  otherError: errorStrings[3]
};

export const failure = {
  project: {
    id: 'abc123',
    projectTitle: 'ABC',
  },
  action: 'delete',
  error: apolloError
};
