import "./globals.css";
import LoadingScreen from "./components/LoadingScreen";

export const metadata = {
  title: "WENODES — Creative Technology",
  description: "WENODES — interactive systems, creative technology and digital experiences.",
  icons: {
    icon: "/favicon.ico",
  }, 
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}