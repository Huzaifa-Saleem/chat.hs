import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Sidebar as Icon } from "lucide-react";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarTrigger>
        <Icon />
      </SidebarTrigger>
      <main className="w-full h-full">{children}</main>
    </SidebarProvider>
  );
}
