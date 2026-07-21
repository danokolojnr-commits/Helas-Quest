export interface Scholarship {
  id: string;
  title: string;
  university: string;
  country: string;
  amount: string;
  level: string;
  summary: string;
  tags: string[];
  deadline: string;
  status: "Actively Reviewing" | "Due Soon" | "Open" | "Closed" | "Submitted" | "Under Review" | "Interview Scheduled" | "Accepting Apps";
  logoUrl: string;
  fieldOfStudy: string;
  degreeLevel: string;
  studentStatus: string;
  detailedDescription: string;
  requiredDocuments: Array<{ title: string; desc: string }>;
  timeline: Array<{ label: string; date: string; description: string; current?: boolean }>;
  category: string; // e.g. "STEM", "Full Funding", "Europe", "Undergrad"
  isFullFunding: boolean;
}

export interface University {
  id: string;
  name: string;
  location: string;
  rank: string;
  tuition: string;
  gradRate: string;
  students: string;
  about: string;
  bannerUrl: string;
  tags: string[];
  programs: Array<{ name: string; school: string; icon: string }>;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  warning?: boolean;
}

export interface InboxMessage {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  unread: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}
