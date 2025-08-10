import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/tokens.css";
import "@/styles/utilities.css";
import "@/styles/components.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ToastProvider } from "@/components/ui/Toast";
import { MenuProvider } from "@/context/MenuContext";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "In-Flight Menu Assistant",
  description: "Scan the printed menu and chat with AI about your meal options",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ToastProvider>
            <MenuProvider>
              <ChatProvider>{children}</ChatProvider>
            </MenuProvider>
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
