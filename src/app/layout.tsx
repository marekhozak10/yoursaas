import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { currentUser } from "@/lib/person";
import { getStore } from "@/lib/store";
import { TopBar } from "@/components/shell/TopBar";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your SaaS",
  description: "HR platforma Your SaaS",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const store = await getStore().read();
  const pendingApprovals = store.requests.filter(
    (r) => r.approval?.decision === "pending" && r.status === "awaiting_approval"
  ).length;

  return (
    <html
      lang="cs"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-canvas">
        <TopBar
          pendingApprovals={pendingApprovals}
          currentUser={{ name: user.name, initials: user.initials }}
          scripted={process.env.DEMO_MODE === 'scripted'}
        />
        {children}
      </body>
    </html>
  );
}
