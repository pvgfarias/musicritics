import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  album: ['create', 'update', 'delete', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'], // delete any?
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  album: [],
  rating: ['create', 'update:own', 'delete:own'],
});

export const moderator = ac.newRole({
  album: ['create', 'update', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  album: ['create', 'update', 'delete', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'],
});
