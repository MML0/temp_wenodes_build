import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact">
      <span>WENODES® — 2024</span>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <Link href="/join" style={{ transition: "opacity .25s ease" }}>JOIN US ↗</Link>
        <a href="https://www.instagram.com/wenodes/" target="_blank" rel="noreferrer" style={{ transition: "opacity .25s ease" }}>INSTAGRAM ↗</a>
        <a href="https://t.me/wenodes_fam" target="_blank" rel="noreferrer" style={{ transition: "opacity .25s ease" }}>TELEGRAM ↗</a>
      </div>
    </footer>
  );
}