import { ChatSidebar } from "@/components/chat-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <main className="w-full h-full">{children}</main>
    </SidebarProvider>
  );
}
