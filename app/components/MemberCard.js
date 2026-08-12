import Link from "next/link";

export default function MemberCard({ member }) {
  return (
    <Link href={`/team/${member.id}`} className="member-card">
      <div className="member-avatar">
        <div className="member-placeholder" />
        <div className="member-overlay">
          <span>VIEW PROFILE →</span>
        </div>
      </div>
      <div className="member-info">
        <h3>{member.nickname}</h3>
        <span className="member-role">{member.role}</span>
        <p>{member.bio}</p>
      </div>
    </Link>
  );
}