export type EmailFolder = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam';

export interface Email {
  id: string;
  senderName: string;
  senderEmail: string;
  recipientName: string;
  recipientEmail: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  folder: EmailFolder;
  labels: string[];
}

export const mockEmails: Email[] = [
  {
    id: '1',
    senderName: 'Vercel Team',
    senderEmail: 'hello@vercel.com',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: 'Your deployment has successfully completed',
    preview: 'Your project "mmail-frontend" was successfully deployed to production.',
    body: 'Hi Mavandeep,\n\nYour project "mmail-frontend" was successfully deployed to production. It is now live and accessible to your users.\n\nDeployment details:\n- URL: https://mmail-frontend.vercel.app\n- Environment: Production\n- Branch: main\n\nBest regards,\nThe Vercel Team',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    isRead: false,
    isStarred: true,
    folder: 'inbox',
    labels: ['Updates']
  },
  {
    id: '2',
    senderName: 'Sarah Jenkins',
    senderEmail: 'sarah.j@designco.io',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: 'Re: Logo Design Concepts',
    preview: 'I have attached the updated concepts for the new Mmail logo. Let me know what you think.',
    body: 'Hey Mavandeep,\n\nThanks for the feedback on the initial drafts. I have attached the updated concepts for the new Mmail logo based on your suggestions. I really leaned into the deep blue color palette and the 3D aesthetic you mentioned.\n\nLet me know which direction you prefer and we can finalize it this week.\n\nCheers,\nSarah',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    isRead: false,
    isStarred: false,
    folder: 'inbox',
    labels: ['Work', 'Design']
  },
  {
    id: '3',
    senderName: 'GitHub',
    senderEmail: 'noreply@github.com',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: '[mmail-frontend] Pull request #42 approved',
    preview: 'Alex has approved your pull request "Implement composed sidebar layout".',
    body: 'Alex has approved your pull request "Implement composed sidebar layout".\n\nYou can now merge this pull request into the main branch.\n\nView the pull request here: https://github.com/mavan/mmail/pull/42',
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    labels: ['GitHub']
  },
  {
    id: '4',
    senderName: 'Mavandeep',
    senderEmail: 'mavan@mmail.com',
    recipientName: 'James Wilson',
    recipientEmail: 'jwilson@example.com',
    subject: 'Meeting notes from yesterday',
    preview: 'Here are the notes from our sync regarding the Q3 roadmap.',
    body: 'Hi James,\n\nHere are the notes from our sync regarding the Q3 roadmap:\n\n1. Launch the new frontend by end of August.\n2. Hire 2 more design engineers.\n3. Expand marketing budget by 15%.\n\nLet me know if I missed anything.\n\nBest,\nMavandeep',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: true,
    isStarred: true,
    folder: 'sent',
    labels: ['Work']
  },
  {
    id: '5',
    senderName: 'Replit Team',
    senderEmail: 'team@replit.com',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: 'Welcome to the Replit Agent Beta!',
    preview: 'You have been granted access to the new Replit Agent beta features.',
    body: 'Hi Mavandeep,\n\nWe are excited to welcome you to the Replit Agent beta! You can now use AI to generate complete applications right from your workspace.\n\nCheck out the documentation to get started.\n\nHappy coding,\nThe Replit Team',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    labels: ['Productivity']
  },
  {
    id: '6',
    senderName: 'Spotify',
    senderEmail: 'no-reply@spotify.com',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: 'Your Weekly Discover is ready',
    preview: 'Listen to 30 new tracks picked just for you.',
    body: 'Your Discover Weekly is here.\n\nWe have put together a fresh playlist of 30 tracks we think you will love, based on your recent listening history.\n\nOpen the app to start listening.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    isRead: true,
    isStarred: false,
    folder: 'inbox',
    labels: []
  },
  {
    id: '7',
    senderName: 'Mavandeep',
    senderEmail: 'mavan@mmail.com',
    recipientName: '',
    recipientEmail: '',
    subject: 'Draft: Grocery List',
    preview: 'Milk, Eggs, Bread, Avocados, Hot Sauce...',
    body: 'Milk\nEggs\nBread\nAvocados\nHot Sauce\nCoffee Beans\nAlmond Milk',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    isRead: true,
    isStarred: false,
    folder: 'drafts',
    labels: ['Personal']
  },
  {
    id: '8',
    senderName: 'Unknown Sender',
    senderEmail: 'spammy@spam.com',
    recipientName: 'Mavandeep',
    recipientEmail: 'mavan@mmail.com',
    subject: 'You have won a free iPhone 15 Pro!',
    preview: 'Click here to claim your prize immediately before it expires.',
    body: 'CONGRATULATIONS!!!\n\nYou have been selected as the winner of our daily draw. Click the link below to claim your iPhone 15 Pro.\n\n[CLAIM NOW]\n\nHurry, this offer expires in 5 minutes.',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    isRead: false,
    isStarred: false,
    folder: 'spam',
    labels: []
  },
];
