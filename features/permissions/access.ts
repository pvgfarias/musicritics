import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

const statement = {
  ...defaultStatements,
  album: ['create', 'update', 'delete', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'], // delete any?
  artist: ['create', 'update', 'delete'],
  // Only create/delete — no update yet, since createLabel/deleteLabel are
  // the only label actions that exist so far (see label-actions.ts).
  label: ['create', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  album: [],
  rating: ['create', 'update:own', 'delete:own'],
});

export const moderator = ac.newRole({
  album: ['create', 'update', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'],
  artist: ['create', 'update'],
  // Same tier as artist: moderators can add labels while cataloging
  // albums, but deleting one (which un-labels every album using it) is
  // admin-only, matching how artist delete is admin-only below.
  label: ['create'],
});

export const admin = ac.newRole({
  ...adminAc.statements,
  album: ['create', 'update', 'delete', 'finalize', 'manageRotation'],
  rating: ['create', 'update:own', 'delete:own', 'delete:any'],
  artist: ['create', 'update', 'delete'],
  label: ['create', 'delete'],
});
