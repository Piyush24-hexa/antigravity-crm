// Demo data for Phase 1 — mirrors seed.ts structure
// Used when API is not yet connected

export const demoContacts = [
  { id: '1', firstName: 'Emily', lastName: 'Watson', email: 'emily@techventures.io', company: { name: 'TechVentures Inc' }, status: 'customer', leadScore: 85, relationshipScore: 72, source: 'website', owner: { name: 'Alex Chen' }, createdAt: '2026-04-15T10:00:00Z' },
  { id: '2', firstName: 'Michael', lastName: 'Schmidt', email: 'michael@globaldynamics.com', company: { name: 'Global Dynamics' }, status: 'prospect', leadScore: 72, relationshipScore: 58, source: 'referral', owner: { name: 'Sarah Miller' }, createdAt: '2026-04-18T10:00:00Z' },
  { id: '3', firstName: 'Lisa', lastName: 'Park', email: 'lisa@nexushealth.co', company: { name: 'Nexus Health' }, status: 'lead', leadScore: 45, relationshipScore: 34, source: 'linkedin', owner: { name: 'James Park' }, createdAt: '2026-04-20T10:00:00Z' },
  { id: '4', firstName: 'David', lastName: 'Thompson', email: 'david@quantumfin.com', company: { name: 'Quantum Finance' }, status: 'customer', leadScore: 91, relationshipScore: 85, source: 'conference', owner: { name: 'Alex Chen' }, createdAt: '2026-04-10T10:00:00Z' },
  { id: '5', firstName: 'Rachel', lastName: 'Green', email: 'rachel@ecosmart.io', company: { name: 'EcoSmart Solutions' }, status: 'prospect', leadScore: 68, relationshipScore: 55, source: 'website', owner: { name: 'Sarah Miller' }, createdAt: '2026-04-22T10:00:00Z' },
  { id: '6', firstName: 'Kevin', lastName: 'Liu', email: 'kevin@datastream.ai', company: { name: 'DataStream Analytics' }, status: 'lead', leadScore: 33, relationshipScore: 22, source: 'cold_outreach', owner: { name: 'James Park' }, createdAt: '2026-05-01T10:00:00Z' },
  { id: '7', firstName: 'Amanda', lastName: 'Foster', email: 'amanda@apexretail.com', company: { name: 'Apex Retail Group' }, status: 'customer', leadScore: 94, relationshipScore: 90, source: 'referral', owner: { name: 'Alex Chen' }, createdAt: '2026-03-15T10:00:00Z' },
  { id: '8', firstName: 'Takeshi', lastName: 'Yamamoto', email: 'takeshi@orbital-robotics.com', company: { name: 'Orbital Robotics' }, status: 'prospect', leadScore: 77, relationshipScore: 65, source: 'webinar', owner: { name: 'Sarah Miller' }, createdAt: '2026-04-25T10:00:00Z' },
  { id: '9', firstName: 'Priya', lastName: 'Sharma', email: 'priya@pinnacle-edu.org', company: { name: 'Pinnacle Education' }, status: 'lead', leadScore: 51, relationshipScore: 40, source: 'website', owner: { name: 'James Park' }, createdAt: '2026-05-05T10:00:00Z' },
  { id: '10', firstName: 'Chris', lastName: 'Morgan', email: 'chris@vortexmedia.co', company: { name: 'Vortex Media' }, status: 'prospect', leadScore: 63, relationshipScore: 48, source: 'linkedin', owner: { name: 'Alex Chen' }, createdAt: '2026-05-08T10:00:00Z' },
  { id: '11', firstName: 'Sophie', lastName: 'Laurent', email: 'sophie@techventures.io', company: { name: 'TechVentures Inc' }, status: 'customer', leadScore: 88, relationshipScore: 79, source: 'referral', owner: { name: 'Sarah Miller' }, createdAt: '2026-03-20T10:00:00Z' },
  { id: '12', firstName: 'Hans', lastName: 'Weber', email: 'hans@globaldynamics.com', company: { name: 'Global Dynamics' }, status: 'prospect', leadScore: 56, relationshipScore: 44, source: 'conference', owner: { name: 'James Park' }, createdAt: '2026-04-28T10:00:00Z' },
];

export const demoCompanies = [
  { id: '1', name: 'TechVentures Inc', domain: 'techventures.io', industry: 'SaaS', size: '51-200', revenue: 12000000, country: 'USA', _count: { contacts: 3, deals: 2 }, techStack: ['React', 'AWS', 'PostgreSQL'] },
  { id: '2', name: 'Global Dynamics', domain: 'globaldynamics.com', industry: 'Manufacturing', size: '201-1000', revenue: 85000000, country: 'Germany', _count: { contacts: 3, deals: 2 }, techStack: ['SAP', 'Azure'] },
  { id: '3', name: 'Nexus Health', domain: 'nexushealth.co', industry: 'Healthcare', size: '11-50', revenue: 3500000, country: 'USA', _count: { contacts: 3, deals: 2 }, techStack: ['Next.js', 'GCP'] },
  { id: '4', name: 'Quantum Finance', domain: 'quantumfin.com', industry: 'FinTech', size: '51-200', revenue: 28000000, country: 'UK', _count: { contacts: 2, deals: 2 }, techStack: ['Python', 'Kubernetes'] },
  { id: '5', name: 'EcoSmart Solutions', domain: 'ecosmart.io', industry: 'CleanTech', size: '11-50', revenue: 5200000, country: 'Canada', _count: { contacts: 2, deals: 2 }, techStack: ['Vue', 'AWS'] },
  { id: '6', name: 'DataStream Analytics', domain: 'datastream.ai', industry: 'Analytics', size: '1-10', revenue: 900000, country: 'USA', _count: { contacts: 2, deals: 2 }, techStack: ['Snowflake', 'dbt'] },
  { id: '7', name: 'Apex Retail Group', domain: 'apexretail.com', industry: 'Retail', size: '1000+', revenue: 450000000, country: 'USA', _count: { contacts: 2, deals: 2 }, techStack: ['Shopify', 'AWS'] },
  { id: '8', name: 'Orbital Robotics', domain: 'orbital-robotics.com', industry: 'Robotics', size: '51-200', revenue: 15000000, country: 'Japan', _count: { contacts: 2, deals: 2 }, techStack: ['ROS', 'C++', 'Python'] },
];

export const demoPipelineStages = [
  { id: 's1', name: 'Lead', color: '#6366f1', displayOrder: 0, winProbability: 0.1, deals: [
    { id: 'd3', title: 'Nexus Health Starter Plan', value: 12000, contact: { firstName: 'Lisa', lastName: 'Park' }, company: { name: 'Nexus Health' }, owner: { name: 'James Park' } },
    { id: 'd6', title: 'DataStream Analytics POC', value: 8500, contact: { firstName: 'Kevin', lastName: 'Liu' }, company: { name: 'DataStream Analytics' }, owner: { name: 'James Park' } },
    { id: 'd9', title: 'Pinnacle Education Pilot', value: 6000, contact: { firstName: 'Priya', lastName: 'Sharma' }, company: { name: 'Pinnacle Education' }, owner: { name: 'Alex Chen' } },
    { id: 'd15', title: 'EcoSmart Enterprise Eval', value: 55000, contact: { firstName: 'Julia', lastName: 'Brooks' }, company: { name: 'EcoSmart Solutions' }, owner: { name: 'Sarah Miller' } },
  ]},
  { id: 's2', name: 'Qualified', color: '#8b5cf6', displayOrder: 1, winProbability: 0.25, deals: [
    { id: 'd5', title: 'EcoSmart Growth Plan', value: 24000, contact: { firstName: 'Rachel', lastName: 'Green' }, company: { name: 'EcoSmart Solutions' }, owner: { name: 'Sarah Miller' } },
    { id: 'd12', title: 'Global Dynamics Phase 2', value: 180000, contact: { firstName: 'Hans', lastName: 'Weber' }, company: { name: 'Global Dynamics' }, owner: { name: 'Alex Chen' } },
    { id: 'd16', title: 'DataStream Premium', value: 18000, contact: { firstName: 'Nathan', lastName: 'Cole' }, company: { name: 'DataStream Analytics' }, owner: { name: 'Sarah Miller' } },
    { id: 'd18', title: 'Orbital Robotics Support', value: 42000, contact: { firstName: 'Yuki', lastName: 'Tanaka' }, company: { name: 'Orbital Robotics' }, owner: { name: 'James Park' } },
  ]},
  { id: 's3', name: 'Proposal', color: '#a855f7', displayOrder: 2, winProbability: 0.5, deals: [
    { id: 'd2', title: 'Global Dynamics ERP Integration', value: 125000, contact: { firstName: 'Michael', lastName: 'Schmidt' }, company: { name: 'Global Dynamics' }, owner: { name: 'Sarah Miller' } },
    { id: 'd8', title: 'Orbital Robotics Custom Build', value: 95000, contact: { firstName: 'Takeshi', lastName: 'Yamamoto' }, company: { name: 'Orbital Robotics' }, owner: { name: 'Alex Chen' } },
    { id: 'd13', title: 'Nexus Health Pro Upgrade', value: 28000, contact: { firstName: 'Maria', lastName: 'Garcia' }, company: { name: 'Nexus Health' }, owner: { name: 'James Park' } },
    { id: 'd20', title: 'Vortex Media Suite', value: 62000, contact: { firstName: 'Olivia', lastName: 'Turner' }, company: { name: 'Vortex Media' }, owner: { name: 'Alex Chen' } },
  ]},
  { id: 's4', name: 'Negotiation', color: '#d946ef', displayOrder: 3, winProbability: 0.75, deals: [
    { id: 'd1', title: 'TechVentures Platform License', value: 48000, contact: { firstName: 'Emily', lastName: 'Watson' }, company: { name: 'TechVentures Inc' }, owner: { name: 'Alex Chen' } },
    { id: 'd11', title: 'TechVentures Expansion', value: 72000, contact: { firstName: 'Sophie', lastName: 'Laurent' }, company: { name: 'TechVentures Inc' }, owner: { name: 'Sarah Miller' } },
    { id: 'd14', title: 'Quantum Finance Add-on', value: 45000, contact: { firstName: 'Robert', lastName: 'King' }, company: { name: 'Quantum Finance' }, owner: { name: 'James Park' } },
  ]},
  { id: 's5', name: 'Closed Won', color: '#22c55e', displayOrder: 4, winProbability: 1.0, deals: [
    { id: 'd4', title: 'Quantum Finance Enterprise', value: 250000, contact: { firstName: 'David', lastName: 'Thompson' }, company: { name: 'Quantum Finance' }, owner: { name: 'Alex Chen' } },
    { id: 'd7', title: 'Apex Retail Full Suite', value: 380000, contact: { firstName: 'Amanda', lastName: 'Foster' }, company: { name: 'Apex Retail Group' }, owner: { name: 'Sarah Miller' } },
    { id: 'd17', title: 'Apex Retail Renewal', value: 395000, contact: { firstName: 'Victoria', lastName: 'Hayes' }, company: { name: 'Apex Retail Group' }, owner: { name: 'James Park' } },
  ]},
];

export const demoDeals = [
  { id: 'd1', title: 'TechVentures Platform License', value: 48000, status: 'open', stage: { name: 'Negotiation', color: '#d946ef' }, contact: { firstName: 'Emily', lastName: 'Watson' }, company: { name: 'TechVentures Inc' }, owner: { name: 'Alex Chen' }, closeDate: '2026-06-15', winProbability: 0.75 },
  { id: 'd2', title: 'Global Dynamics ERP Integration', value: 125000, status: 'open', stage: { name: 'Proposal', color: '#a855f7' }, contact: { firstName: 'Michael', lastName: 'Schmidt' }, company: { name: 'Global Dynamics' }, owner: { name: 'Sarah Miller' }, closeDate: '2026-07-01', winProbability: 0.5 },
  { id: 'd3', title: 'Nexus Health Starter Plan', value: 12000, status: 'open', stage: { name: 'Lead', color: '#6366f1' }, contact: { firstName: 'Lisa', lastName: 'Park' }, company: { name: 'Nexus Health' }, owner: { name: 'James Park' }, closeDate: '2026-06-30', winProbability: 0.1 },
  { id: 'd4', title: 'Quantum Finance Enterprise', value: 250000, status: 'won', stage: { name: 'Closed Won', color: '#22c55e' }, contact: { firstName: 'David', lastName: 'Thompson' }, company: { name: 'Quantum Finance' }, owner: { name: 'Alex Chen' }, closeDate: '2026-05-10', winProbability: 1.0 },
  { id: 'd5', title: 'EcoSmart Growth Plan', value: 24000, status: 'open', stage: { name: 'Qualified', color: '#8b5cf6' }, contact: { firstName: 'Rachel', lastName: 'Green' }, company: { name: 'EcoSmart Solutions' }, owner: { name: 'Sarah Miller' }, closeDate: '2026-07-15', winProbability: 0.25 },
  { id: 'd7', title: 'Apex Retail Full Suite', value: 380000, status: 'won', stage: { name: 'Closed Won', color: '#22c55e' }, contact: { firstName: 'Amanda', lastName: 'Foster' }, company: { name: 'Apex Retail Group' }, owner: { name: 'Sarah Miller' }, closeDate: '2026-04-20', winProbability: 1.0 },
  { id: 'd8', title: 'Orbital Robotics Custom Build', value: 95000, status: 'open', stage: { name: 'Proposal', color: '#a855f7' }, contact: { firstName: 'Takeshi', lastName: 'Yamamoto' }, company: { name: 'Orbital Robotics' }, owner: { name: 'Alex Chen' }, closeDate: '2026-07-30', winProbability: 0.5 },
  { id: 'd10', title: 'Vortex Media Campaign Tool', value: 35000, status: 'lost', stage: { name: 'Closed Lost', color: '#ef4444' }, contact: { firstName: 'Chris', lastName: 'Morgan' }, company: { name: 'Vortex Media' }, owner: { name: 'Alex Chen' }, closeDate: '2026-05-01', winProbability: 0 },
];

export const demoActivities = [
  { id: 'a1', type: 'email', direction: 'outbound', subject: 'Follow up on proposal', body: 'Sent proposal details for the platform license', contact: { firstName: 'Emily', lastName: 'Watson' }, user: { name: 'Alex Chen' }, sentiment: 'positive', createdAt: '2026-05-23T14:30:00Z' },
  { id: 'a2', type: 'call', direction: 'inbound', subject: 'Discovery call with Michael', body: 'Discussed integration requirements and timeline', contact: { firstName: 'Michael', lastName: 'Schmidt' }, user: { name: 'Sarah Miller' }, sentiment: 'neutral', durationSeconds: 1800, createdAt: '2026-05-23T11:00:00Z' },
  { id: 'a3', type: 'note', subject: 'Meeting notes', body: 'Lisa mentioned they are evaluating 3 vendors. Budget approval expected by end of June.', contact: { firstName: 'Lisa', lastName: 'Park' }, user: { name: 'James Park' }, sentiment: 'neutral', createdAt: '2026-05-22T16:00:00Z' },
  { id: 'a4', type: 'meeting', subject: 'Quarterly review', body: 'Reviewed account health and expansion opportunities', contact: { firstName: 'David', lastName: 'Thompson' }, user: { name: 'Alex Chen' }, sentiment: 'positive', durationSeconds: 3600, createdAt: '2026-05-22T10:00:00Z' },
  { id: 'a5', type: 'email', direction: 'inbound', subject: 'Re: Pricing question', body: 'Rachel asked about volume discounts for 50+ seats', contact: { firstName: 'Rachel', lastName: 'Green' }, user: { name: 'Sarah Miller' }, sentiment: 'positive', createdAt: '2026-05-21T15:00:00Z' },
  { id: 'a6', type: 'task', subject: 'Send case study to Kevin', body: 'Kevin requested case studies from similar analytics companies', contact: { firstName: 'Kevin', lastName: 'Liu' }, user: { name: 'James Park' }, sentiment: 'neutral', createdAt: '2026-05-21T09:00:00Z' },
];

export const demoRevenueData = [
  { month: '2026-01', revenue: 145000 },
  { month: '2026-02', revenue: 210000 },
  { month: '2026-03', revenue: 185000 },
  { month: '2026-04', revenue: 380000 },
  { month: '2026-05', revenue: 645000 },
];

export const demoLeaderboard = [
  { id: '1', name: 'Alex Chen', deals: 8, revenue: 743000 },
  { id: '2', name: 'Sarah Miller', deals: 6, revenue: 584000 },
  { id: '3', name: 'James Park', deals: 4, revenue: 437000 },
];

export const demoDailyReports = [
  {
    id: 'r1',
    employeeId: '1',
    employeeName: 'Alex Chen',
    date: '2026-05-24',
    description: 'Contacted TechVentures regarding their platform license expansion. Sent over the new pricing sheet. Also followed up with David from Quantum Finance.',
    linkedContacts: [{ id: '1', name: 'Emily Watson' }, { id: '4', name: 'David Thompson' }],
    linkedLeads: [],
    mediaAttachments: [
      { id: 'm1', name: 'pricing_sheet.pdf', type: 'application/pdf', url: '#' }
    ],
    timeEntries: [
      { id: 't1', title: 'TechVentures Sync', startHour: 9, endHour: 10 },
      { id: 't2', title: 'Proposal Drafting', startHour: 11, endHour: 13 }
    ]
  },
  {
    id: 'r2',
    employeeId: '2',
    employeeName: 'Sarah Miller',
    date: '2026-05-24',
    description: 'Met with Global Dynamics team to discuss ERP integration timeline. Uploaded the rough sketch of the architecture. Started prospecting new leads in the manufacturing sector.',
    linkedContacts: [{ id: '2', name: 'Michael Schmidt' }],
    linkedLeads: [{ id: 'l1', name: 'New Manufacturing Lead' }],
    mediaAttachments: [
      { id: 'm2', name: 'architecture_sketch.png', type: 'image/png', url: '#' }
    ],
    timeEntries: [
      { id: 't3', title: 'Global Dynamics Meeting', startHour: 10, endHour: 11.5 },
      { id: 't4', title: 'Prospecting', startHour: 14, endHour: 16 }
    ]
  },
  {
    id: 'r3',
    employeeId: '3',
    employeeName: 'James Park',
    date: '2026-05-24',
    description: 'Resolved onboarding issues for Nexus Health. Uploaded a short screencast of the solution. Touched base with Kevin on DataStream Analytics POC.',
    linkedContacts: [{ id: '3', name: 'Lisa Park' }, { id: '6', name: 'Kevin Liu' }],
    linkedLeads: [],
    mediaAttachments: [
      { id: 'm3', name: 'onboarding_fix.mp4', type: 'video/mp4', url: '#' }
    ],
    timeEntries: [
      { id: 't5', title: 'Nexus Support', startHour: 8, endHour: 10 },
      { id: 't6', title: 'DataStream Sync', startHour: 13, endHour: 14.5 }
    ]
  }
];
