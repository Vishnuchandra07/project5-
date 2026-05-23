import Activity from '../models/Activity.js';

export const logActivity = async ({
  type,
  message,
  performedBy,
  organizationOwner,
  lead = null,
  teamMember = null,
  metadata = {},
}) => {
  try {
    await Activity.create({
      type,
      message,
      performedBy,
      organizationOwner,
      lead,
      teamMember,
      metadata,
    });
  } catch (error) {
    console.error('Activity log failed:', error.message);
  }
};
