import { levelCondition } from './levelCondition';

export const friendshipCondition = { ...levelCondition } as const;
export type FriendshipCondition = typeof friendshipCondition[keyof typeof friendshipCondition];
