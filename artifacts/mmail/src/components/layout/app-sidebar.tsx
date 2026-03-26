import * as React from "react";
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Star, 
  AlertOctagon,
  Plus,
  MoreVertical
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { EmailFolder } from "@/lib/mock-data";

interface AppSidebarProps {
  currentFolder: EmailFolder | 'starred';
  onFolderSelect: (folder: EmailFolder | 'starred') => void;
  onComposeClick: () => void;
  unreadCounts: Record<string, number>;
}

export function AppSidebar({ currentFolder, onFolderSelect, onComposeClick, unreadCounts }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainFolders = [
    { title: "Inbox", id: "inbox" as const, icon: Inbox },
    { title: "Starred", id: "starred" as const, icon: Star },
    { title: "Sent", id: "sent" as const, icon: Send },
    { title: "Drafts", id: "drafts" as const, icon: FileText },
  ];

  const secondaryFolders = [
    { title: "Spam", id: "spam" as const, icon: AlertOctagon },
    { title: "Trash", id: "trash" as const, icon: Trash2 },
  ];

  return (
    <Sidebar className="border-r border-border/40 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader className="p-4 pt-6">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-md">
            <img 
              src={`${import.meta.env.BASE_URL}images/mmail-logo.png`} 
              alt="Mmail Logo" 
              className="h-5 w-5 object-contain"
              onError={(e) => {
                // Fallback if image not generated yet
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-white font-display font-bold text-lg">M</span>';
              }}
            />
          </div>
          {!isCollapsed && (
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Mmail
            </span>
          )}
        </div>

        <Button 
          onClick={onComposeClick}
          className="w-full justify-start gap-2 h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all no-default-hover-elevate"
        >
          <Plus className="h-5 w-5" />
          {!isCollapsed && <span className="font-medium text-base">Compose</span>}
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainFolders.map((item) => {
                const count = unreadCounts[item.id] || 0;
                const isActive = currentFolder === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      onClick={(e) => { e.preventDefault(); onFolderSelect(item.id); }}
                      className={`
                        cursor-pointer rounded-lg h-10 transition-colors
                        ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                      `}
                    >
                      <a href={`#${item.id}`}>
                        <item.icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''}`} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {count > 0 && !isCollapsed && (
                      <SidebarMenuBadge className={isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}>
                        {count}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">More</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryFolders.map((item) => {
                const isActive = currentFolder === item.id;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      onClick={(e) => { e.preventDefault(); onFolderSelect(item.id); }}
                      className={`
                        cursor-pointer rounded-lg h-10 transition-colors
                        ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                      `}
                    >
                      <a href={`#${item.id}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
