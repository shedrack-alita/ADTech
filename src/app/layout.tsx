import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Amplify Digital Technologies",
    template: "%s | Amplify Digital Technologies",
  },
  description:
    "Learn today. Lead tomorrow. Hybrid coding & digital skills training, coaching, and a learning platform that gets you certified and job-ready.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-brand-navy">
        {children}
      </body>
    </html>
  );
}
