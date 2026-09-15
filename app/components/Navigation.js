import Link from "next/link";
import PixelLogo from "./PixelLogo";

export default function Navigation() {
  return (
    <header className="nav">
      <Link className="logo" href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <PixelLogo size={22} />
        <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.04em" }}>
          WENODES<span style={{ fontSize: "7px", verticalAlign: "top", marginLeft: "2px" }}>®</span>
        </span>
      </Link>
      <nav>
        <Link href="/work">WORK</Link>
        <Link href="/team">TEAM</Link>
        <Link href="/about">ABOUT</Link>
      </nav>
      <Link className="contact" href="/join">JOIN US ↗</Link>
    </header>
  );
}