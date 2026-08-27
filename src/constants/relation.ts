export const USER_RELATIONS = [
  "friend",
  "family",
  "partner",
  "roommate",
  "colleague",
  "other",
] as const;

export type UserRelation = (typeof USER_RELATIONS)[number];

export const USER_RELATION_LABELS: Record<UserRelation, string> = {
  friend: "Friend",
  family: "Family",
  partner: "Partner",
  roommate: "Roommate",
  colleague: "Colleague",
  other: "Other",
};

export const USER_RELATION_OPTIONS = USER_RELATIONS.map((value) => ({
  value,
  label: USER_RELATION_LABELS[value],
}));
