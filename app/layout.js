import "./globals.css";
import localFont from "next/font/local";
import LoadingScreen from "./components/LoadingScreen";

const whyteInktrap = localFont({
  src: [
    {
      path: "../public/fonts/ABCWhyteInktrap-Extralight-Trial.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Book-Trial.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Regular-Trial.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ABCWhyteInktrap-Bold-Trial.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-whyte",
  display: "swap",
  preload: true,
});

const pixelFont = localFont({
  src: "../public/fonts/CoFoSansPixel-Regular-Trial.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-pixel",
  display: "swap",
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