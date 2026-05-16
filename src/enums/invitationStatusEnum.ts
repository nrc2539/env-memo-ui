export const InvitationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
} as const;

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];
