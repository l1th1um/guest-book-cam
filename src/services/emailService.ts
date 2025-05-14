import { GuestEntry } from '../types';

// This is a simulated email queue service
// In a real application, this would connect to a backend service

interface QueuedEmail {
  to: string;
  subject: string;
  body: string;
  attachments: Array<{
    filename: string;
    content: string;
    contentType: string;
  }>;
  status: 'queued' | 'sent' | 'failed';
  timestamp: number;
}

// Simulate a queue in memory
const emailQueue: QueuedEmail[] = [];

export const queueEmail = async (guestEntry: GuestEntry): Promise<void> => {
  // Validate the guest entry
  if (!guestEntry.name || !guestEntry.email || !guestEntry.photo) {
    throw new Error('Invalid guest entry data');
  }

  // Create an email object
  const email: QueuedEmail = {
    to: 'admin@guestbook.example.com', // In a real app, this would be configured
    subject: `New Guest Book Entry: ${guestEntry.name}`,
    body: `
      New guest book entry:

      Name: ${guestEntry.name}
      Graduation Year: ${guestEntry.tahun_lulus}
      Email: ${guestEntry.email}

      A photo has been attached to this email.
    `,
    attachments: [
      {
        filename: `${guestEntry.name.replace(/\s+/g, '_')}_photo.jpg`,
        content: guestEntry.photo,
        contentType: 'image/jpeg',
      },
    ],
    status: 'queued',
    timestamp: Date.now(),
  };

  // Add to queue
  emailQueue.push(email);

  // In a real application, a background process or worker would process this queue
  // For this demo, we'll just log it and simulate a delay
  console.log('Email added to queue:', email);

  // Simulate sending delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful sending
      const emailIndex = emailQueue.findIndex(e => e.timestamp === email.timestamp);
      if (emailIndex !== -1) {
        emailQueue[emailIndex].status = 'sent';
      }

      console.log('Email sent:', email);
      resolve();
    }, 1500); // Simulate 1.5 second delay
  });
};

// For demonstration purposes - get the current queue
export const getEmailQueue = (): QueuedEmail[] => {
  return [...emailQueue];
};