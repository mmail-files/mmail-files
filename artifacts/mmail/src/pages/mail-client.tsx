import * as React from "react";
import { useState, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { EmailList } from "@/components/email/email-list";
import { EmailReader } from "@/components/email/email-reader";
import { ComposeDialog } from "@/components/email/compose-dialog";
import { mockEmails, type Email, type EmailFolder } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function MailClient() {
  const { toast } = useToast();
  
  // State
  const [emails, setEmails] = useState<Email[]>(mockEmails);
  const [currentFolder, setCurrentFolder] = useState<EmailFolder | 'starred'>('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Derived state
  const filteredEmails = useMemo(() => {
    let result = emails;

    // Filter by folder/starred
    if (currentFolder === 'starred') {
      result = result.filter(e => e.isStarred && e.folder !== 'trash');
    } else {
      result = result.filter(e => e.folder === currentFolder);
    }

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.subject.toLowerCase().includes(q) || 
        e.senderName.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q)
      );
    }

    // Sort by date (newest first)
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [emails, currentFolder, searchQuery]);

  const selectedEmail = useMemo(() => {
    return emails.find(e => e.id === selectedEmailId) || null;
  }, [emails, selectedEmailId]);

  const unreadCounts = useMemo(() => {
    return emails.reduce((acc, email) => {
      if (!email.isRead) {
        acc[email.folder] = (acc[email.folder] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [emails]);

  // Actions
  const handleSelectEmail = (id: string) => {
    setSelectedEmailId(id);
    // Mark as read
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isRead: true } : e));
  };

  const handleToggleStar = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e));
  };

  const handleDelete = (id: string) => {
    const email = emails.find(e => e.id === id);
    if (!email) return;

    if (email.folder === 'trash') {
      // Hard delete
      setEmails(prev => prev.filter(e => e.id !== id));
      toast({ description: "Conversation deleted forever." });
    } else {
      // Move to trash
      setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'trash' } : e));
      toast({ description: "Conversation moved to Trash." });
    }
    
    if (selectedEmailId === id) {
      setSelectedEmailId(null);
    }
  };

  const handleSendEmail = (data: { to: string; subject: string; body: string }) => {
    const newEmail: Email = {
      id: Math.random().toString(36).substring(7),
      senderName: "Mavandeep",
      senderEmail: "mavan@mmail.com",
      recipientName: data.to.split('@')[0],
      recipientEmail: data.to,
      subject: data.subject,
      preview: data.body.substring(0, 50) + "...",
      body: data.body,
      date: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      folder: 'sent',
      labels: []
    };
    setEmails(prev => [newEmail, ...prev]);
  };

  // Layout styling
  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar 
          currentFolder={currentFolder} 
          onFolderSelect={(folder) => {
            setCurrentFolder(folder);
            setSelectedEmailId(null);
          }}
          onComposeClick={() => setIsComposeOpen(true)}
          unreadCounts={unreadCounts}
        />
        
        <div className="flex flex-col flex-1 min-w-0">
          <TopNav onSearch={setSearchQuery} />
          
          <main className="flex-1 flex overflow-hidden">
            {/* List Pane - hidden on small screens if an email is selected */}
            <div className={`
              flex-col w-full md:w-[350px] lg:w-[400px] border-r border-border/40 shrink-0 bg-background
              ${selectedEmailId ? 'hidden md:flex' : 'flex'}
            `}>
              <div className="p-3 border-b flex items-center justify-between shrink-0 bg-muted/10">
                <h2 className="text-lg font-semibold tracking-tight capitalize text-foreground/90">
                  {currentFolder}
                </h2>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {filteredEmails.length} messages
                </span>
              </div>
              <EmailList 
                emails={filteredEmails}
                selectedId={selectedEmailId}
                onSelect={handleSelectEmail}
                onToggleStar={handleToggleStar}
              />
            </div>
            
            {/* Reading Pane - hidden on small screens if NO email is selected */}
            <div className={`
              flex-1 min-w-0 bg-background
              ${!selectedEmailId ? 'hidden md:block' : 'block'}
            `}>
              <EmailReader 
                email={selectedEmail}
                onClose={() => setSelectedEmailId(null)}
                onToggleStar={handleToggleStar}
                onDelete={handleDelete}
              />
            </div>
          </main>
        </div>
      </div>

      <ComposeDialog 
        open={isComposeOpen} 
        onOpenChange={setIsComposeOpen}
        onSend={handleSendEmail}
      />
    </SidebarProvider>
  );
}
