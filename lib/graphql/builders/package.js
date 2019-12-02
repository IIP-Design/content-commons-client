export const buildCreatePackageTree = ( user, values ) => {
  const tree = {
    ...values,
    author: {
      connect: {
        id: user.id
      }
    },
    // makes the assumptiom that the user is on the team
    // allowed to generated specific packages =
    team: {
      connect: {
        id: user.team.id
      }
    }
  };

  return tree;
};
