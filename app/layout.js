import "./globals.css";
import localFont from "next/font/local";
import LoadingScreen from "./components/LoadingScreen";

const whyteInktrap = localFont({
  src: [
    {
      path: "../public/fonts/ABCWhyteInktrap-Extralight-Trial.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Book-Trial.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Regular-Trial.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Bold-Trial.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-whyte",
  display: "block",
  preload: true,
});

const pixelFont = localFont({
  src: "../public/fonts/CoFoSansPixel-Regular-Trial.otf",
  weight: "400",
  style: "normal",
  variable: "--font-pixel",
  display: "block",
  preload: true,
});

export const metadata = {
  title: "WENODES — Creative Technology",
  description:
    "WENODES — interactive systems, creative technology and digital experiences.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${whyteInktrap.variable} ${pixelFont.variable}`}
    >
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}