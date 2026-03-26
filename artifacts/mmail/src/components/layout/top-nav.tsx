import * as React from "react";
import { Search, Menu, Settings, HelpCircle, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TopNavProps {
  onSearch: (query: string) => void;
}

export function TopNav({ onSearch }: TopNavProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-background/95 px-4 backdrop-blur z-20">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="hover:bg-muted text-muted-foreground hover:text-foreground" />
      </div>

      <div className="flex-1 max-w-2xl px-4 lg:px-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search in mail" 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary/30 focus-visible:ring-4 focus-visible:ring-primary/10 rounded-full pl-10 pr-4 h-11 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-foreground">
          <LayoutGrid className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full ml-2 border border-border/50 shadow-sm hover-elevate">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`${import.meta.env.BASE_URL}images/avatar.png`} alt="Mavandeep" className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold font-display">M</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mt-2 p-2 rounded-xl shadow-xl" align="end">
            <div className="flex flex-col items-center justify-center p-4 pb-2">
              <Avatar className="h-20 w-20 mb-3 border-4 border-background shadow-md">
                <AvatarImage src={`${import.meta.env.BASE_URL}images/avatar.png`} alt="Mavandeep" className="object-cover" />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-2xl font-display">M</AvatarFallback>
              </Avatar>
              <div className="font-bold text-lg font-display tracking-tight">Mavandeep</div>
              <div className="text-sm text-muted-foreground">mavan@mmail.com</div>
              <Button variant="outline" className="mt-4 rounded-full w-full font-medium hover-elevate">
                Manage your Mmail Account
              </Button>
            </div>
            <DropdownMenuSeparator className="my-2" />
            <DropdownMenuItem className="cursor-pointer rounded-lg p-3">
              Add another account
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-lg p-3">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
