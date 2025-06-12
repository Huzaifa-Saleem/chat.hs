import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { LogIn, Search } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export async function ChatSidebar() {
  const user = await currentUser();

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex items-center justify-center w-full">
          <h1 className="text-xl font-bold text-[#1e293b]">Chat.HS</h1>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-4">
        <SidebarGroup>
          <Button>New Chat</Button>
        </SidebarGroup>
        <SidebarGroup className="relative">
          <Search
            className="size-4 absolute left-2 top-1/2 -translate-y-1/2"
            color="#1e293b"
          />
          <Input
            placeholder="Search"
            className="border-x-0 border-t-0 border-b rounded-none outline-0 focus:ring-0 focus-visible:ring-0 ring-y-2 shadow-none pl-6"
          />
        </SidebarGroup>
        <SidebarGroup>
          <p className="text-xs text-[#3a3c42]">Today</p>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-6">
        <Button
          variant="ghost"
          size="lg"
          className="flex items-center justify-start gap-4 h-12"
        >
          <SignedIn>
            <UserButton />
            <p className="text-sm text-[#3a3c42]">{user?.fullName}</p>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <div className="flex items-center gap-2">
                <LogIn className="size-4 mr-2" />
                <p className="text-sm text-[#3a3c42]">Log In</p>
              </div>
            </SignInButton>
          </SignedOut>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
