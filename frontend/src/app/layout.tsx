import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { ClientLayout } from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "CampusPrep AI - Complete Full-Stack SaaS Application",
  description: "CampusPrep AI is a world-class academic study platform featuring an AI syllabus analyzer, smart timetable generator, interactive AI tutor, mock test engine, and PYQ analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppProvider>
      </body>
    </html>
  );
}

