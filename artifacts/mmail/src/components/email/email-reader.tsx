import * as React from "react";
import { format } from "date-fns";
import { 
  Archive, 
  Trash2, 
  Reply, 
  Forward, 
  MoreVertical, 
  Star, 
  MailWarning,
  Printer,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Email } from "@/lib/mock-data";

interface EmailReaderProps {
  email: Email | null;
  onClose?: () => void;
  onToggleStar: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmailReader({ email, onClose, onToggleStar, onDelete }: EmailReaderProps) {
  if (!email) {
    return (
      <div className="flex h-full items-center justify-center bg-muted/20">
        <div className="flex flex-col items-center gap-4 text-muted-foreground opacity-60">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center shadow-inner">
            <img 
              src={`${import.meta.env.BASE_URL}images/mmail-logo.png`} 
              alt="Mmail" 
              className="h-12 w-12 opacity-50 grayscale"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
          <p className="text-sm font-medium">Select an email to read</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background relative">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-background/95 backdrop-blur z-10 sticky top-0">
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden -ml-2 mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-elevate text-muted-foreground hover:text-foreground">
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="hover-elevate text-muted-foreground hover:text-foreground">
                <MailWarning className="h-4 w-4" />
                <span className="sr-only">Move to spam</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Report spam</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(email.id)}
                className="hover-elevate text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          <Button variant="ghost" size="icon" className="hover-elevate text-muted-foreground hover:text-foreground">
            <Clock className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-3xl p-6 md:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl font-display">
              {email.subject}
            </h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onToggleStar(email.id)}
              className="mt-1 shrink-0"
            >
              <Star className={`h-5 w-5 ${email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
            </Button>
          </div>

          {email.labels.length > 0 && (
            <div className="flex gap-2 mb-6">
              {email.labels.map(label => (
                <Badge key={label} variant="secondary" className="bg-muted hover:bg-muted font-medium text-xs rounded-md">
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border shadow-sm">
                <AvatarFallback 
                  className="bg-primary/10 text-primary font-bold text-lg"
                  style={{
                    backgroundImage: `linear-gradient(135deg, hsl(${email.senderName.length * 20}, 70%, 60%), hsl(${email.senderName.length * 30}, 80%, 50%))`,
                    color: 'white'
                  }}
                >
                  {email.senderName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <div className="font-semibold text-base text-foreground">
                  {email.senderName}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <span>to</span>
                  <span className="text-foreground/80 font-medium">me</span>
                  <span className="text-xs opacity-50">&lt;{email.recipientEmail}&gt;</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {format(new Date(email.date), "MMM d, yyyy, h:mm a")}
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="prose prose-sm md:prose-base prose-slate dark:prose-invert max-w-none">
            {email.body.split('\n').map((paragraph, index) => (
              <p key={index} className={paragraph.trim() === '' ? 'h-4' : 'text-foreground/90 leading-relaxed'}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex items-center gap-3 pt-6 border-t border-border/40">
            <Button variant="outline" className="gap-2 rounded-full font-medium hover-elevate bg-background border-border shadow-sm">
              <Reply className="h-4 w-4 text-muted-foreground" />
              Reply
            </Button>
            <Button variant="outline" className="gap-2 rounded-full font-medium hover-elevate bg-background border-border shadow-sm">
              <Forward className="h-4 w-4 text-muted-foreground" />
              Forward
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
