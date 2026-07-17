import { apiClient } from "@/services/api/client";
import type { Member } from "@/services/api/types/member";
import type { UpdateMemberBody } from "@/app/api/admin/members/[id]/schema";
import type { InviteMemberBody } from "@/app/api/admin/members/invite/schema";
import type { ListMembersParams } from "@/app/api/admin/members/schema";
import type { PaginationData } from "@/app/api/response";

export const membersApi = {
  listMembers(params?: ListMembersParams): Promise<{ data: Member[]; pagination: PaginationData }> {
    return apiClient.getPaginated<Member>("/admin/members", params);
  },

  getMember(id: string): Promise<Member> {
    return apiClient.get<Member>(`/admin/members/${id}`);
  },

  updateMember(id: string, body: UpdateMemberBody): Promise<Member> {
    return apiClient.patch<Member>(`/admin/members/${id}`, body);
  },

  changeRole(id: string, platformRole: "admin" | "user"): Promise<Member> {
    return apiClient.patch<Member>(`/admin/members/${id}/role`, { platformRole });
  },

  inviteMember(body: InviteMemberBody) {
    return apiClient.post("/admin/members/invite", body);
  },
};
