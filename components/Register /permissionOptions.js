
// The permissions values map to the 'Permission' enum in data model on the server
export const permissionOptions = [
  {
    key: 1,
    value: 'SUBSCRIBER',
    label: 'Browse and collect only (standard)',
    content: 'Browse, download, and share published and draft material on Content Commons, create personal collections of materials, and save searches.'
  },
  {
    key: 2,
    value: 'EDITOR',
    label: 'Edit and publish content',
    content: 'In addition to standard access, upload, manage, and publish new content to the Content Commons.'
  },
  {
    key: 3,
    value: 'TEAM_ADMIN',
    label: 'Team Admin',
    content: 'Full access to the content commons. This role can create and manage teams.'
  }
];
