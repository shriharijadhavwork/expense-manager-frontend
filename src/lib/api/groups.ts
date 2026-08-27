import { apiRequest } from "@/lib/api/client";
import type {
  CreateGroupThreadInput,
  Group,
  GroupInvite,
  LeaveGroupResult,
  ResolveGroupInput,
  ResolveGroupResult,
  Thread,
} from "@/types/api";

export const groupsApi = {
  list(): Promise<Group[]> {
    return apiRequest<Group[]>("/groups");
  },

  getById(id: string): Promise<Group> {
    return apiRequest<Group>(`/groups/${id}`);
  },

  resolve(input: ResolveGroupInput): Promise<ResolveGroupResult> {
    return apiRequest<ResolveGroupResult>("/groups/resolve", {
      method: "POST",
      body: input,
    });
  },

  listThreads(groupId: string): Promise<Thread[]> {
    return apiRequest<Thread[]>(`/groups/${groupId}/threads`);
  },

  createThread(
    groupId: string,
    input: CreateGroupThreadInput = {},
  ): Promise<Thread> {
    return apiRequest<Thread>(`/groups/${groupId}/threads`, {
      method: "POST",
      body: input,
    });
  },

  addMember(groupId: string, email: string): Promise<Group> {
    return apiRequest<Group>(`/groups/${groupId}/members`, {
      method: "POST",
      body: { email },
    });
  },

  removeMember(groupId: string, userId: string): Promise<Group> {
    return apiRequest<Group>(`/groups/${groupId}/members/${userId}`, {
      method: "DELETE",
    });
  },

  leave(groupId: string): Promise<LeaveGroupResult> {
    return apiRequest<LeaveGroupResult>(`/groups/${groupId}/leave`, {
      method: "POST",
    });
  },

  transferOwnership(groupId: string, userId: string): Promise<Group> {
    return apiRequest<Group>(`/groups/${groupId}/transfer`, {
      method: "POST",
      body: { userId },
    });
  },

  listInvites(groupId: string): Promise<GroupInvite[]> {
    return apiRequest<GroupInvite[]>(`/groups/${groupId}/invites`);
  },

  createInvite(groupId: string, email: string): Promise<GroupInvite> {
    return apiRequest<GroupInvite>(`/groups/${groupId}/invites`, {
      method: "POST",
      body: { email },
    });
  },

  revokeInvite(groupId: string, inviteId: string): Promise<GroupInvite> {
    return apiRequest<GroupInvite>(
      `/groups/${groupId}/invites/${inviteId}`,
      {
        method: "DELETE",
      },
    );
  },

  acceptInvite(token: string): Promise<Group> {
    return apiRequest<Group>(`/invites/${token}/accept`, {
      method: "POST",
    });
  },
};
