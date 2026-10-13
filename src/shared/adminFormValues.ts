import type { TeamMember, TeamMemberRequest } from "../api/types";
import type { MemberFormState } from "../components/admin/types";

export function buildMemberPayload(form: MemberFormState): TeamMemberRequest {
  return {
    role: form.role as TeamMember["role"],
    name: form.name.trim(),
    title: form.title.trim(),
    education: "",
    career: form.career.trim(),
    order: Number(form.order || "0"),
  };
}
