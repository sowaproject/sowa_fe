interface MemberCareerFields {
  education?: string | null;
  career?: string | null;
}

export function getMemberCareer(member: MemberCareerFields): string {
  const education = member.education?.trim() ?? "";
  const career = member.career?.trim() ?? "";
  if (education === career) return career;
  return [education, career].filter(Boolean).join("\n\n");
}
