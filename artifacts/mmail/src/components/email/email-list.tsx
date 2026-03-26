import * as React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MoreVertical, Archive, ArchiveRestore, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Email } from "@/lib/mock-data";

interface EmailListProps {
  emails: Email[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleStar: (id: string) => void;
}

export function EmailList({ emails, selectedId, onSelect, onToggleStar }: EmailListProps) {
  
  const formatEmailDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, 'h:mm a');
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d');
  };

  if (emails.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground h-full bg-background/50">
        <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4">
          <ArchiveRestore className="h-10 w-10 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Nothing to see here</h3>
        <p className="text-sm mt-1">Your folder is empty.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full flex-1">
      <div className="flex flex-col p-2 gap-1">
        <AnimatePresence initial={false}>
          {emails.map((email) => {
            const isSelected = selectedId === email.id;
            return (
              <motion.div
                key={email.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => onSelect(email.id)}
                className={`
                  group relative flex flex-col items-start gap-1 rounded-xl p-3 text-left text-sm transition-all cursor-pointer border border-transparent
                  ${isSelected 
                    ? 'bg-primary/5 border-primary/20 shadow-sm' 
                    : 'hover:bg-muted/50 hover:border-border/50'
                  }
                  ${!email.isRead && !isSelected ? 'bg-background' : ''}
                `}
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div 
                        className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-xs shrink-0 shadow-sm"
                        style={{
                          // Generating pseudo-random gradient based on name
                          backgroundImage: `linear-gradient(135deg, hsl(${email.senderName.length * 20}, 70%, 60%), hsl(${email.senderName.length * 30}, 80%, 50%))`
                        }}
                      >
                        {email.senderName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`truncate ${!email.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/80'}`}>
                            {email.senderName}
                          </span>
                          <span className={`ml-auto text-xs whitespace-nowrap ${!email.isRead ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                            {formatEmailDate(email.date)}
                          </span>
                        </div>
                        <div className={`truncate text-sm ${!email.isRead ? 'font-bold text-foreground' : 'text-foreground/70'}`}>
                          {email.subject}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="line-clamp-2 text-xs text-muted-foreground mt-1 pl-10">
                    {email.preview}
                  </div>
                </div>

                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm rounded-md shadow-sm border p-0.5 flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(email.id);
                    }}
                  >
                    <Star className={`h-4 w-4 ${email.isStarred ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm text-muted-foreground">
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>

                {email.isStarred && !isSelected && (
                  <div className="absolute right-3 top-9 group-hover:hidden">
                     <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  </div>
                )}
                
                {email.labels.length > 0 && (
                  <div className="flex items-center gap-1.5 pl-10 mt-2">
                    {email.labels.map(label => (
                      <Badge key={label} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-muted text-muted-foreground font-normal border-none">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ScrollArea>
  );
}
