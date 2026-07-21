import { Scholarship, University, Task, InboxMessage } from "./types";

export const USER_AVATAR = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200";

export const SCHOLARSHIPS: Scholarship[] = [

  {
    id: "stanford-leaders",
    title: "Global Leaders Fellowship",
    university: "Stanford University",
    country: "USA",
    amount: "Full Tuition + Stipend",
    level: "Postgraduate",
    summary: "Premier fellowship for transformative leadership.",
    tags: ["Leadership", "Full Funding", "USA"],
    deadline: "Dec 1, 2026",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Disciplines",
    degreeLevel: "Master's / PhD",
    studentStatus: "International / USA",
    category: "General",
    isFullFunding: true,
    detailedDescription: "The Stanford Global Leaders Fellowship provides exceptional students with full tuition, a generous stipend, and exclusive leadership training. It aims to develop global citizens who will make a significant positive impact on the world.",
    requiredDocuments: [
      { title: "Transcripts", desc: "Official academic records." },
      { title: "Leadership Essay", desc: "1000 words on your leadership vision." }
    ],
    timeline: [
      { label: "Application Open", date: "Sep 2026", description: "Submit via portal.", current: true }
    ]
  },
  {
    id: "oxford-excellence",
    title: "Clarendon Fund Scholarships",
    university: "University of Oxford",
    country: "UK",
    amount: "Full Tuition + Living Costs",
    level: "Postgraduate",
    summary: "Oxford's flagship scholarship scheme for academic excellence.",
    tags: ["Merit-based", "UK", "All Subjects"],
    deadline: "Jan 10, 2027",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Disciplines",
    degreeLevel: "Master's / PhD",
    studentStatus: "International / UK",
    category: "General",
    isFullFunding: true,
    detailedDescription: "The Clarendon Fund offers over 200 fully-funded scholarships each year to outstanding graduate scholars. Clarendon scholars are selected based on outstanding academic merit and potential, regardless of nationality.",
    requiredDocuments: [
      { title: "Academic CV", desc: "Comprehensive resume." },
      { title: "Research Proposal", desc: "For PhD applicants." }
    ],
    timeline: [
      { label: "Application Deadline", date: "Jan 2027", description: "Deadline for most courses.", current: true }
    ]
  },
  {
    id: "mit-presidential",
    title: "MIT Presidential Fellowships",
    university: "Massachusetts Institute of Technology",
    country: "USA",
    amount: "Full Tuition + Stipend",
    level: "PhD",
    summary: "Recruiting the most outstanding graduate students worldwide.",
    tags: ["STEM", "PhD", "USA"],
    deadline: "Dec 15, 2026",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "STEM Disciplines",
    degreeLevel: "PhD",
    studentStatus: "International / USA",
    category: "STEM",
    isFullFunding: true,
    detailedDescription: "The MIT Presidential Fellowship program provides full support to the most promising incoming graduate students. Fellows receive tuition, a stipend, and join an elite cohort of innovators.",
    requiredDocuments: [
      { title: "GRE Scores", desc: "If required by department." },
      { title: "Statement of Objectives", desc: "Academic and research goals." }
    ],
    timeline: [
      { label: "Department Deadline", date: "Dec 2026", description: "Varies by department.", current: true }
    ]
  },


  {
    id: "mandela-rhodes",
    title: "Mandela Rhodes Scholarship",
    university: "University of Cape Town",
    country: "South Africa",
    amount: "Full Tuition + Stipend",
    level: "Postgraduate",
    summary: "Building exceptional leadership capacity in Africa.",
    tags: ["Leadership", "Postgraduate", "Africa"],
    deadline: "April 21, 2027",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Disciplines",
    degreeLevel: "Honours / Master's",
    studentStatus: "African Citizens",
    category: "Africa",
    isFullFunding: true,
    detailedDescription: "The Mandela Rhodes Scholarship offers comprehensive funding for postgraduate study in South Africa, alongside a highly competitive leadership development program. It seeks young Africans who demonstrate academic excellence, leadership potential, entrepreneurial spirit, and a commitment to reconciliation.",
    requiredDocuments: [
      { title: "Academic Transcript", desc: "Full academic record." },
      { title: "Three Letters of Reference", desc: "Character and academic references." },
      { title: "Essays", desc: "Addressing the four founding principles." }
    ],
    timeline: [
      { label: "Applications Open", date: "Mar 2027", description: "Online portal opens.", current: true }
    ]
  },
  {
    id: "mastercard-scholars",
    title: "Mastercard Foundation Scholars",
    university: "Makerere University",
    country: "Uganda",
    amount: "Full Scholarship",
    level: "Undergraduate / Postgraduate",
    summary: "Developing Africa's next generation of transformative leaders.",
    tags: ["Full Funding", "Leadership", "Africa"],
    deadline: "Feb 15, 2027",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "Agriculture, Health Sciences, STEM",
    degreeLevel: "Undergrad / Master's",
    studentStatus: "African Citizens",
    category: "Africa",
    isFullFunding: true,
    detailedDescription: "The Mastercard Foundation Scholars Program at Makerere University provides comprehensive scholarships to academically talented yet economically disadvantaged young people in Africa. The program aims to educate and empower the next generation of leaders who will contribute to social and economic transformation.",
    requiredDocuments: [
      { title: "Proof of Need", desc: "Financial background documentation." },
      { title: "Academic Records", desc: "Previous academic certificates." }
    ],
    timeline: [
      { label: "Apply Online", date: "Jan 2027", description: "Submit application form.", current: true }
    ]
  },

  {
    id: "global-tech-excellence",
    title: "Global Tech Excellence Scholarship",
    university: "Silicon Valley Tech Foundation",
    country: "USA",
    amount: "$50,000",
    level: "Undergraduate / STEM",
    summary: "Empowering the next generation of technological innovators across the globe.",
    tags: ["STEM Priority", "Open", "Deadline: Oct 15"],
    deadline: "Oct 15, 2026",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "STEM Disciplines",
    degreeLevel: "Undergraduate / Master's",
    studentStatus: "International",
    category: "STEM",
    isFullFunding: true,
    detailedDescription: "The Global Tech Excellence Scholarship is designed to identify and support the next generation of technology leaders. We are looking for innovative thinkers, problem solvers, and dedicated students who are committed to using technology to address global challenges. This comprehensive award covers tuition, provides a technology stipend, and includes a guaranteed summer internship at a leading Silicon Valley firm.",
    requiredDocuments: [
      { title: "Official Transcript", desc: "Most recent semester required." },
      { title: "Personal Essay", desc: "500 words on 'Tech for Good'." },
      { title: "Letters of Recommendation", desc: "Two academic or professional references." }
    ],
    timeline: [
      { label: "Application Open", date: "Current Phase", description: "Submit all required documents before the deadline.", current: true },
      { label: "Initial Review", date: "Nov 1 - Nov 15", description: "Committee reviews applications for eligibility." },
      { label: "Interviews", date: "Early Dec", description: "Selected finalists will be contacted for virtual interviews." },
      { label: "Award Announcement", date: "Jan 15, 2027", description: "Recipients are notified via email." }
    ]
  },
  {
    id: "global-leaders-fellowship",
    title: "Global Leaders Fellowship",
    university: "Stanford University",
    country: "USA",
    amount: "$85,000",
    level: "Graduate / Full Tuition",
    summary: "A highly competitive fellowship for international students demonstrating exceptional leadership potential and academic excellence in graduate studies.",
    tags: ["Actively Reviewing", "Due Oct 15", "Full Tuition & Stipend"],
    deadline: "Oct 15, 2026",
    status: "Actively Reviewing",
    logoUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "Multidisciplinary",
    degreeLevel: "Master's / PhD",
    studentStatus: "International / USA",
    category: "Full Funding",
    isFullFunding: true,
    detailedDescription: "The Stanford Global Leaders Fellowship offers high-achieving leaders a fully funded opportunity to study at Stanford. It provides a unique leadership curriculum, funding for graduate tuition, associated fees, travel costs, and a comprehensive living stipend.",
    requiredDocuments: [
      { title: "Statement of Purpose", desc: "Max 1000 words detailing your academic and career goals." },
      { title: "Official Transcripts", desc: "Sourced from all attended institutions." },
      { title: "Two Recommendation Letters", desc: "Focusing on academic excellence and leadership." }
    ],
    timeline: [
      { label: "Application Submission", date: "Oct 15, 2026", description: "Submit form, fee, transcripts, and essay.", current: true },
      { label: "Selection & Review", date: "Nov - Dec 2026", description: "Committee evaluates academic and leadership metrics." },
      { label: "Interview Round", date: "Jan 2027", description: "Virtual interactive interviews." },
      { label: "Final Notification", date: "Mar 2027", description: "Scholars are publicly announced." }
    ]
  },
  {
    id: "clarendon-fund",
    title: "Clarendon Fund",
    university: "Oxford University",
    country: "UK",
    amount: "Full Tuition",
    level: "Graduate / All Subjects",
    summary: "Oxford's flagship scholarship scheme offering fully-funded scholarships to graduate students of outstanding academic merit.",
    tags: ["Merit Based", "All Subjects", "Full Funding"],
    deadline: "Jan 05, 2027",
    status: "Due Soon",
    logoUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Fields of Study",
    degreeLevel: "Master's / DPhil",
    studentStatus: "International",
    category: "Europe",
    isFullFunding: true,
    detailedDescription: "Clarendon Scholarships are awarded on outstanding academic merit and potential to graduate students from all around the world, regardless of nationality. They cover tuition and college fees in full, as well as a generous stipend for living expenses.",
    requiredDocuments: [
      { title: "Graduate Application", desc: "No separate application form is needed; all eligible applicants are automatically considered." },
      { title: "Research Proposal", desc: "For research degrees, detailing scope and impact." },
      { title: "Academic References", desc: "Usually three references are required." }
    ],
    timeline: [
      { label: "Course Application", date: "Jan 2027 Deadline", description: "Apply to your graduate course at Oxford to be considered.", current: true },
      { label: "Selection Panel", date: "Feb - Mar 2027", description: "Academic division committees review profiles." },
      { label: "Offers Sent", date: "Apr 2027", description: "Clarendon offers are released via email." }
    ]
  },
  {
    id: "daad-excellence",
    title: "DAAD Excellence Scholarship",
    university: "Technical University of Munich (TUM)",
    country: "Germany",
    amount: "€24,000",
    level: "Annual Stipend / STEM Only",
    summary: "Highly prestigious scholarship for outstanding international students pursuing Master's degrees in engineering and science disciplines in Germany.",
    tags: ["STEM Only", "Due Soon", "Annual Stipend"],
    deadline: "Oct 31, 2026",
    status: "Due Soon",
    logoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "Engineering and Science (STEM)",
    degreeLevel: "Master's Program",
    studentStatus: "International",
    category: "Europe",
    isFullFunding: false,
    detailedDescription: "The DAAD Excellence Scholarship supports top-performing international students who wish to complete a full-time Master's degree at TUM. It offers financial security and access to Germany's extensive scientific and professional networks.",
    requiredDocuments: [
      { title: "DAAD Form", desc: "Completed DAAD online scholarship portal application form." },
      { title: "Letter of Motivation", desc: "Detailing academic goals and motivation for studying in Germany." },
      { title: "Curriculum Vitae (CV)", desc: "Structured europass CV with professional milestones." }
    ],
    timeline: [
      { label: "Portal Submission", date: "Oct 31, 2026", description: "Apply via DAAD and TUM portal channels.", current: true },
      { label: "Review & Shortlist", date: "Nov - Dec 2026", description: "Selected candidates are invited for evaluation." },
      { label: "Approval", date: "Feb 2027", description: "Scholarship allocation completed." }
    ]
  },
  {
    id: "stanford-fund",
    title: "Stanford Fund Scholarship",
    university: "Stanford University",
    country: "USA",
    amount: "$15,000",
    level: "Undergraduate / Need Based",
    summary: "Need-based grant awarded to undergraduate students demonstrating significant financial need.",
    tags: ["Accepting Apps", "Due: Jan 15", "Undergrad Priority"],
    deadline: "Jan 15, 2027",
    status: "Accepting Apps",
    logoUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Fields of Study",
    degreeLevel: "Bachelors",
    studentStatus: "All Students",
    category: "Undergrad",
    isFullFunding: false,
    detailedDescription: "The Stanford Fund is a scholarship program that directly supports undergraduate financial aid. Over 70% of Stanford undergraduates receive some form of financial aid, and this fund enables high-quality education to remain accessible to all talented students.",
    requiredDocuments: [
      { title: "CSS Profile", desc: "Completed CSS Profile detailing household income metrics." },
      { title: "Fafsa (US Citizens)", desc: "Federal application for student aid." },
      { title: "Tax Returns", desc: "Parent and student tax documents for verification." }
    ],
    timeline: [
      { label: "Financial Aid App", date: "Jan 15, 2027", description: "Submit CSS Profile and supporting financials.", current: true },
      { label: "Analysis Phase", date: "Feb - Mar 2027", description: "Stanford Office of Financial Aid reviews application." },
      { label: "Award Package", date: "Apr 2027", description: "Provided alongside admissions decision." }
    ]
  },
  {
    id: "knight-hennessy",
    title: "Knight-Hennessy Scholars",
    university: "Stanford University",
    country: "USA",
    amount: "Full Ride",
    level: "Graduate Fellowship",
    summary: "Multidisciplinary graduate fellowship program building a community of future global leaders.",
    tags: ["Deadline Nearing", "Due: Oct 11", "Full Ride"],
    deadline: "Oct 11, 2026",
    status: "Due Soon",
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "All Graduate Degrees",
    degreeLevel: "Master's / PhD / JD / MD",
    studentStatus: "International",
    category: "Full Funding",
    isFullFunding: true,
    detailedDescription: "Knight-Hennessy Scholars is a highly selective graduate fellowship program that educates and prepares a community of diverse, multidisciplinary leaders to address the complex challenges facing our world. Scholars receive up to three years of financial funding to pursue graduate studies at Stanford.",
    requiredDocuments: [
      { title: "Online Application", desc: "Submit transcript, resume, essay, and short answers." },
      { title: "Video Presentation", desc: "Two-minute video introduction sharing your story." },
      { title: "Two Recommendations", desc: "Evaluating leadership, integrity, and intellect." }
    ],
    timeline: [
      { label: "Online Submission", date: "Oct 11, 2026", description: "Submit online file and documents.", current: true },
      { label: "Video Introduction", date: "Nov 2026", description: "Provide short video introduction." },
      { label: "Interviews & Selection", date: "Jan 2027", description: "Immersion weekend and interviews." }
    ]
  },
  {
    id: "women-in-stem",
    title: "Women in STEM Fellowship",
    university: "MIT",
    country: "USA",
    amount: "Full Tuition",
    level: "PhD / STEM Only",
    summary: "Elite fellowship aiming to bridge the gender gap in engineering and scientific research domains, offering full funding and corporate advisory.",
    tags: ["Ends Soon", "PhD Priority", "Full Tuition"],
    deadline: "Nov 30, 2026",
    status: "Due Soon",
    logoUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "STEM / Advanced Computation",
    degreeLevel: "PhD Program",
    studentStatus: "International / USA",
    category: "STEM",
    isFullFunding: true,
    detailedDescription: "MIT's Women in STEM Fellowship is committed to fostering academic leadership in computational, mechanical, and biological research. Successful candidates receive full tuition coverage, a monthly research stipend, and a personal career advisor from top silicon valley laboratories.",
    requiredDocuments: [
      { title: "Research Statement", desc: "Detailed breakdown of proposed PhD focus area." },
      { title: "Letters of Reference", desc: "Three reference letters addressing scientific aptitude." }
    ],
    timeline: [
      { label: "Initial Submission", date: "Nov 30, 2026", description: "Complete online form and research statements.", current: true },
      { label: "Technical Panel", date: "Jan 2027", description: "Review of proposed dissertation draft." }
    ]
  },
  {
    id: "european-excellence",
    title: "European Excellence Grant",
    university: "ETH Zurich",
    country: "Switzerland",
    amount: "€20,000/yr",
    level: "Undergrad / Engineering",
    summary: "Premier engineering award for exceptional undergraduate applicants studying modern systems engineering and artificial intelligence in Europe.",
    tags: ["High Match", "Undergrad Priority", "Europe"],
    deadline: "Jan 15, 2027",
    status: "Open",
    logoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
    fieldOfStudy: "Engineering / Computer Science",
    degreeLevel: "Bachelors",
    studentStatus: "International",
    category: "Europe",
    isFullFunding: false,
    detailedDescription: "The European Excellence Grant at ETH Zurich supports outstanding young minds who wish to pursue a Bachelor's degree in engineering or computation sciences. Awardees participate in summer exchange programs and custom entrepreneurial masterclasses.",
    requiredDocuments: [
      { title: "Academic Resume", desc: "Comprehensive CV detailing olympiad or scientific milestones." },
      { title: "Personal Statement", desc: "Focusing on innovation goals." }
    ],
    timeline: [
      { label: "Application Submission", date: "Jan 15, 2027", description: "Submit standard profile on ETH Zurich scholarship portal.", current: true }
    ]
  }
];

export const UNIVERSITIES: University[] = [

  {
    id: "uct",
    name: "University of Cape Town",
    location: "Cape Town, South Africa",
    rank: "#1 in Africa",
    tuition: "$5K",
    gradRate: "85%",
    students: "29,000",
    about: "The University of Cape Town is South Africa's oldest university and is one of Africa's leading teaching and research institutions. Located at the foot of Table Mountain, UCT is renowned for its diverse student body and commitment to addressing the continent's key challenges.",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    tags: ["Public Research", "Top in Africa"],
    programs: [
      { name: "Commerce", school: "Faculty of Commerce", icon: "business_center" },
      { name: "Health Sciences", school: "Faculty of Health Sciences", icon: "medical" },
      { name: "Humanities", school: "Faculty of Humanities", icon: "history" }
    ]
  },
  {
    id: "makerere",
    name: "Makerere University",
    location: "Kampala, Uganda",
    rank: "#5 in Africa",
    tuition: "$2K",
    gradRate: "80%",
    students: "35,000",
    about: "Established in 1922, Makerere University is one of the oldest and most prestigious English universities in Africa. It is a major research institution that has played a vital role in shaping the political and social landscape of East Africa.",
    bannerUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1200",
    tags: ["East Africa", "Research Hub"],
    programs: [
      { name: "Agricultural Sciences", school: "CAES", icon: "biotech" },
      { name: "Computing", school: "School of Computing", icon: "laptop" },
      { name: "Social Sciences", school: "CHUSS", icon: "public" }
    ]
  },
  {
    id: "cairo",
    name: "Cairo University",
    location: "Giza, Egypt",
    rank: "#3 in Africa",
    tuition: "$3K",
    gradRate: "88%",
    students: "250,000",
    about: "Cairo University is Egypt's premier public university. With a massive student population and a comprehensive range of academic disciplines, it stands as a pillar of higher education in the Middle East and North Africa.",
    bannerUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    tags: ["MENA Region", "Massive Campus"],
    programs: [
      { name: "Medicine", school: "Kasr Al Ainy", icon: "medical" },
      { name: "Engineering", school: "Faculty of Engineering", icon: "settings" },
      { name: "Law", school: "Faculty of Law", icon: "gavel" }
    ]
  },

  {
    id: "stanford",
    name: "Stanford University",
    location: "Stanford, California",
    rank: "#2 National Ranking",
    tuition: "$57K",
    gradRate: "94%",
    students: "17,326",
    about: "Located in the heart of Silicon Valley, Stanford University is renowned for its entrepreneurial spirit, cutting-edge research facilities, and profound impact on global technology and innovation. It offers a deeply collaborative academic environment where students are encouraged to cross disciplinary boundaries and tackle the world's most complex challenges.",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    tags: ["Private Research", "Silicon Valley", "Quarter System"],
    programs: [
      { name: "Computer Science", school: "School of Engineering", icon: "laptop" },
      { name: "Bioengineering", school: "School of Medicine & Engineering", icon: "biotech" },
      { name: "Business Administration", school: "Graduate School of Business", icon: "business_center" }
    ]
  },
  {
    id: "oxford",
    name: "University of Oxford",
    location: "Oxford, United Kingdom",
    rank: "#1 Global Ranking",
    tuition: "£42K",
    gradRate: "96%",
    students: "24,000",
    about: "The University of Oxford is the oldest university in the English-speaking world, offering an iconic collegiate learning model, world-class research facilities, and an unmatched history of academic prestige. Oxford scholars are chosen for exceptional intellectual ambition and research potential.",
    bannerUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200",
    tags: ["Collegiate Model", "Oldest English University", "Trimester System"],
    programs: [
      { name: "Humanities & History", school: "Faculty of History", icon: "history" },
      { name: "Medicine & Clinical Sciences", school: "Medical Sciences Division", icon: "medical" },
      { name: "Mathematical Sciences", school: "Mathematical, Physical and Life Sciences", icon: "math" }
    ]
  },
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts",
    rank: "#1 Global Ranking (QS)",
    tuition: "$59K",
    gradRate: "93%",
    students: "11,934",
    about: "MIT is a world-class research university dedicated to advancing knowledge in science, technology, engineering, and mathematics. It is known for its rigorous academic programs, cutting-edge laboratories, and a culture of 'Mens et Manus' (mind and hand).",
    bannerUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200",
    tags: ["STEM Hub", "Private Research", "Innovation"],
    programs: [
      { name: "Computer Science", school: "EECS", icon: "laptop" },
      { name: "Mechanical Engineering", school: "School of Engineering", icon: "settings" },
      { name: "Physics", school: "School of Science", icon: "science" }
    ]
  },
  {
    id: "harvard",
    name: "Harvard University",
    location: "Cambridge, Massachusetts",
    rank: "#3 National Ranking",
    tuition: "$54K",
    gradRate: "98%",
    students: "23,731",
    about: "Harvard is the oldest institution of higher education in the United States, celebrated for its global influence, historic campus, and unmatched alumni network. It offers a liberal arts curriculum that encourages exploration and critical thinking.",
    bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200",
    tags: ["Ivy League", "Oldest US University", "Liberal Arts"],
    programs: [
      { name: "Law", school: "Harvard Law School", icon: "gavel" },
      { name: "Government", school: "Faculty of Arts and Sciences", icon: "public" },
      { name: "Medicine", school: "Harvard Medical School", icon: "medical" }
    ]
  }
];

export const INITIAL_TASKS: Task[] = [
  { id: "task-1", title: "Submit FAFSA Application", dueDate: "Due in 2 days", completed: false, warning: true },
  { id: "task-2", title: "Send SAT Scores to MIT", dueDate: "Due Nov 30", completed: false },
  { id: "task-3", title: "Upload Recommendation Letter", dueDate: "Due next week", completed: true }
];

export const INITIAL_INBOX: InboxMessage[] = [
  {
    id: "msg-1",
    sender: "Stanford Admissions",
    subject: "Additional Information Required",
    preview: "Please upload your final transcript by...",
    body: "Dear Applicant,\n\nWe require an official, signed copy of your final spring semester transcripts to complete our evaluation for the Global Leaders Fellowship. Please log into the portal and upload this document in PDF format under 'Additional Materials' by your respective deadline.\n\nWarm regards,\nStanford Admissions Office",
    unread: true,
    date: "Dec 12"
  },
  {
    id: "msg-2",
    sender: "MIT Admissions",
    subject: "Application Received",
    preview: "Thank you for submitting your application to...",
    body: "Hello,\n\nThis is to confirm that we have successfully received your PhD Application in Computer Science, along with all requested reference letters. Your file has been sent to the Graduate Admissions Committee for official review.\n\nBest of luck,\nMIT Admissions",
    unread: false,
    date: "Nov 28"
  }
];

export const SPOTLIGHTS = [
  {
    name: "University of Cape Town",
    location: "South Africa",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&q=80&w=1200",
    tag: "Top in Africa"
  },
  {
    name: "Harvard University",
    location: "Massachusetts, USA",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "University of Manchester",
    location: "United Kingdom",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200",
    tag: "Featured"
  },
  {
    name: "MIT",
    location: "Massachusetts, USA",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200"
  },
  {
    name: "University of Tokyo",
    location: "Tokyo, Japan",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1200"
  }
];
export const NEW_UNIS = [
  {
    id: "mit",
    name: "Massachusetts Institute of Technology",
    location: "Cambridge, Massachusetts",
    rank: "#1 Global Ranking (QS)",
    tuition: "$59K",
    gradRate: "93%",
    students: "11,934",
    about: "MIT is a world-class research university dedicated to advancing knowledge in science, technology, engineering, and mathematics. It is known for its rigorous academic programs, cutting-edge laboratories, and a culture of 'Mens et Manus' (mind and hand).",
    bannerUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200",
    tags: ["STEM Hub", "Private Research", "Innovation"],
    programs: [
      { name: "Computer Science", school: "EECS", icon: "laptop" },
      { name: "Mechanical Engineering", school: "School of Engineering", icon: "settings" },
      { name: "Physics", school: "School of Science", icon: "science" }
    ]
  },
  {
    id: "harvard",
    name: "Harvard University",
    location: "Cambridge, Massachusetts",
    rank: "#3 National Ranking",
    tuition: "$54K",
    gradRate: "98%",
    students: "23,731",
    about: "Harvard is the oldest institution of higher education in the United States, celebrated for its global influence, historic campus, and unmatched alumni network. It offers a liberal arts curriculum that encourages exploration and critical thinking.",
    bannerUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200",
    tags: ["Ivy League", "Oldest US University", "Liberal Arts"],
    programs: [
      { name: "Law", school: "Harvard Law School", icon: "gavel" },
      { name: "Government", school: "Faculty of Arts and Sciences", icon: "public" },
      { name: "Medicine", school: "Harvard Medical School", icon: "medical" }
    ]
  }
];
