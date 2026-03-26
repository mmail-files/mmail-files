import * as React from "react";
import { X, Minus, Maximize2, Paperclip, Image as ImageIcon, Smile, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ComposeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (email: any) => void;
}

export function ComposeDialog({ open, onOpenChange, onSend }: ComposeDialogProps) {
  const { toast } = useToast();
  const [to, setTo] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const handleSend = () => {
    if (!to || !subject) {
      toast({
        title: "Missing fields",
        description: "Please fill out the recipient and subject fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    
    // Simulate network delay
    setTimeout(() => {
      onSend({
        to,
        subject,
        body,
      });
      setIsSending(false);
      setTo("");
      setSubject("");
      setBody("");
      onOpenChange(false);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl border border-border/50 shadow-2xl flex flex-col gap-0 gap-y-0">
        <DialogTitle className="sr-only">New Message</DialogTitle>
        
        {/* Header */}
        <div className="bg-muted px-4 py-2.5 flex items-center justify-between border-b">
          <span className="font-semibold text-sm text-foreground tracking-tight">New Message</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:bg-black/5 dark:hover:bg-white/10">
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-6 w-6 rounded-md hover:bg-black/5 dark:hover:bg-white/10 hover:text-destructive">
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col flex-1 bg-background">
          <div className="border-b px-4 py-2 flex items-center">
            <span className="text-muted-foreground text-sm w-12 shrink-0">To</span>
            <Input 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none p-0 h-auto text-sm" 
              placeholder="recipient@example.com"
            />
          </div>
          <div className="border-b px-4 py-2 flex items-center">
            <Input 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none p-0 h-auto text-sm font-semibold placeholder:font-normal" 
              placeholder="Subject"
            />
          </div>
          
          <Textarea 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="flex-1 min-h-[300px] border-0 focus-visible:ring-0 shadow-none resize-none p-4 text-sm"
            placeholder="Write your message here..."
          />
        </div>

        {/* Toolbar */}
        <div className="p-3 border-t bg-background flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSend} 
              disabled={isSending}
              className="rounded-full px-6 font-semibold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground hover-elevate"
            >
              {isSending ? "Sending..." : "Send"}
            </Button>
            
            <div className="flex items-center gap-1 ml-2 text-muted-foreground">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-foreground">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-foreground">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:text-foreground">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
              <Clock className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
