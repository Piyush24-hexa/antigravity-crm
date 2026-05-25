import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Antigravity CRM...');

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Acme Corp',
      slug: 'acme-corp',
      plan: 'pro',
      seatsUsed: 3,
      seatsLimit: 10,
      aiTokensLimit: BigInt(500000),
    },
  });

  console.log(`  ✓ Workspace: ${workspace.name}`);

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        workspaceId: workspace.id,
        clerkUserId: 'user_demo_owner',
        email: 'alex@acme.com',
        name: 'Alex Chen',
        role: 'owner',
      },
    }),
    prisma.user.create({
      data: {
        workspaceId: workspace.id,
        clerkUserId: 'user_demo_admin',
        email: 'sarah@acme.com',
        name: 'Sarah Miller',
        role: 'admin',
      },
    }),
    prisma.user.create({
      data: {
        workspaceId: workspace.id,
        clerkUserId: 'user_demo_member',
        email: 'james@acme.com',
        name: 'James Park',
        role: 'member',
      },
    }),
  ]);

  console.log(`  ✓ Users: ${users.length}`);

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'TechVentures Inc', domain: 'techventures.io', industry: 'SaaS', size: '51-200', revenue: BigInt(12000000), country: 'USA', techStack: ['React', 'AWS', 'PostgreSQL'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Global Dynamics', domain: 'globaldynamics.com', industry: 'Manufacturing', size: '201-1000', revenue: BigInt(85000000), country: 'Germany', techStack: ['SAP', 'Azure'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Nexus Health', domain: 'nexushealth.co', industry: 'Healthcare', size: '11-50', revenue: BigInt(3500000), country: 'USA', techStack: ['Next.js', 'GCP'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Quantum Finance', domain: 'quantumfin.com', industry: 'FinTech', size: '51-200', revenue: BigInt(28000000), country: 'UK', techStack: ['Python', 'Kubernetes'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'EcoSmart Solutions', domain: 'ecosmart.io', industry: 'CleanTech', size: '11-50', revenue: BigInt(5200000), country: 'Canada', techStack: ['Vue', 'AWS'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'DataStream Analytics', domain: 'datastream.ai', industry: 'Analytics', size: '1-10', revenue: BigInt(900000), country: 'USA', techStack: ['Snowflake', 'dbt'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Apex Retail Group', domain: 'apexretail.com', industry: 'Retail', size: '1000+', revenue: BigInt(450000000), country: 'USA', techStack: ['Shopify', 'AWS'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Orbital Robotics', domain: 'orbital-robotics.com', industry: 'Robotics', size: '51-200', revenue: BigInt(15000000), country: 'Japan', techStack: ['ROS', 'C++', 'Python'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Pinnacle Education', domain: 'pinnacle-edu.org', industry: 'EdTech', size: '11-50', revenue: BigInt(2100000), country: 'India', techStack: ['React', 'Node.js'] } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Vortex Media', domain: 'vortexmedia.co', industry: 'Media', size: '51-200', revenue: BigInt(9800000), country: 'Australia', techStack: ['WordPress', 'AWS'] } }),
  ]);

  console.log(`  ✓ Companies: ${companies.length}`);

  // Create contacts
  const contactData = [
    { firstName: 'Emily', lastName: 'Watson', email: 'emily@techventures.io', companyId: companies[0]!.id, status: 'customer', leadScore: 85, source: 'website' },
    { firstName: 'Michael', lastName: 'Schmidt', email: 'michael@globaldynamics.com', companyId: companies[1]!.id, status: 'prospect', leadScore: 72, source: 'referral' },
    { firstName: 'Lisa', lastName: 'Park', email: 'lisa@nexushealth.co', companyId: companies[2]!.id, status: 'lead', leadScore: 45, source: 'linkedin' },
    { firstName: 'David', lastName: 'Thompson', email: 'david@quantumfin.com', companyId: companies[3]!.id, status: 'customer', leadScore: 91, source: 'conference' },
    { firstName: 'Rachel', lastName: 'Green', email: 'rachel@ecosmart.io', companyId: companies[4]!.id, status: 'prospect', leadScore: 68, source: 'website' },
    { firstName: 'Kevin', lastName: 'Liu', email: 'kevin@datastream.ai', companyId: companies[5]!.id, status: 'lead', leadScore: 33, source: 'cold_outreach' },
    { firstName: 'Amanda', lastName: 'Foster', email: 'amanda@apexretail.com', companyId: companies[6]!.id, status: 'customer', leadScore: 94, source: 'referral' },
    { firstName: 'Takeshi', lastName: 'Yamamoto', email: 'takeshi@orbital-robotics.com', companyId: companies[7]!.id, status: 'prospect', leadScore: 77, source: 'webinar' },
    { firstName: 'Priya', lastName: 'Sharma', email: 'priya@pinnacle-edu.org', companyId: companies[8]!.id, status: 'lead', leadScore: 51, source: 'website' },
    { firstName: 'Chris', lastName: 'Morgan', email: 'chris@vortexmedia.co', companyId: companies[9]!.id, status: 'prospect', leadScore: 63, source: 'linkedin' },
    { firstName: 'Sophie', lastName: 'Laurent', email: 'sophie@techventures.io', companyId: companies[0]!.id, status: 'customer', leadScore: 88, source: 'referral' },
    { firstName: 'Hans', lastName: 'Weber', email: 'hans@globaldynamics.com', companyId: companies[1]!.id, status: 'prospect', leadScore: 56, source: 'conference' },
    { firstName: 'Maria', lastName: 'Garcia', email: 'maria@nexushealth.co', companyId: companies[2]!.id, status: 'lead', leadScore: 29, source: 'cold_outreach' },
    { firstName: 'Robert', lastName: 'King', email: 'robert@quantumfin.com', companyId: companies[3]!.id, status: 'customer', leadScore: 82, source: 'website' },
    { firstName: 'Julia', lastName: 'Brooks', email: 'julia@ecosmart.io', companyId: companies[4]!.id, status: 'prospect', leadScore: 71, source: 'webinar' },
    { firstName: 'Nathan', lastName: 'Cole', email: 'nathan@datastream.ai', companyId: companies[5]!.id, status: 'lead', leadScore: 38, source: 'linkedin' },
    { firstName: 'Victoria', lastName: 'Hayes', email: 'victoria@apexretail.com', companyId: companies[6]!.id, status: 'customer', leadScore: 96, source: 'referral' },
    { firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki@orbital-robotics.com', companyId: companies[7]!.id, status: 'prospect', leadScore: 74, source: 'conference' },
    { firstName: 'Arjun', lastName: 'Patel', email: 'arjun@pinnacle-edu.org', companyId: companies[8]!.id, status: 'lead', leadScore: 42, source: 'cold_outreach' },
    { firstName: 'Olivia', lastName: 'Turner', email: 'olivia@vortexmedia.co', companyId: companies[9]!.id, status: 'customer', leadScore: 87, source: 'website' },
    { firstName: 'Daniel', lastName: 'Reed', email: 'daniel@techventures.io', companyId: companies[0]!.id, status: 'prospect', leadScore: 65, source: 'webinar' },
    { firstName: 'Nina', lastName: 'Fischer', email: 'nina@globaldynamics.com', companyId: companies[1]!.id, status: 'lead', leadScore: 48, source: 'website' },
    { firstName: 'Sam', lastName: 'Wright', email: 'sam@nexushealth.co', companyId: companies[2]!.id, status: 'customer', leadScore: 79, source: 'referral' },
    { firstName: 'Catherine', lastName: 'Bell', email: 'catherine@quantumfin.com', companyId: companies[3]!.id, status: 'prospect', leadScore: 69, source: 'linkedin' },
    { firstName: 'Marcus', lastName: 'Lee', email: 'marcus@ecosmart.io', companyId: companies[4]!.id, status: 'lead', leadScore: 35, source: 'cold_outreach' },
  ];

  const contacts = await Promise.all(
    contactData.map((c, i) =>
      prisma.contact.create({
        data: {
          workspaceId: workspace.id,
          ownerId: users[i % 3]!.id,
          relationshipScore: Math.floor(Math.random() * 60) + 20,
          tags: [],
          ...c,
        },
      })
    )
  );

  console.log(`  ✓ Contacts: ${contacts.length}`);

  // Create pipeline with stages
  const pipeline = await prisma.pipeline.create({
    data: {
      workspaceId: workspace.id,
      name: 'Sales Pipeline',
      isDefault: true,
    },
  });

  const stageData = [
    { name: 'Lead', displayOrder: 0, winProbability: 0.1, color: '#6366f1' },
    { name: 'Qualified', displayOrder: 1, winProbability: 0.25, color: '#8b5cf6' },
    { name: 'Proposal', displayOrder: 2, winProbability: 0.5, color: '#a855f7' },
    { name: 'Negotiation', displayOrder: 3, winProbability: 0.75, color: '#d946ef' },
    { name: 'Closed Won', displayOrder: 4, winProbability: 1.0, color: '#22c55e' },
    { name: 'Closed Lost', displayOrder: 5, winProbability: 0.0, color: '#ef4444' },
  ];

  const stages = await Promise.all(
    stageData.map((s) =>
      prisma.stage.create({
        data: { pipelineId: pipeline.id, workspaceId: workspace.id, ...s },
      })
    )
  );

  console.log(`  ✓ Pipeline: ${pipeline.name} (${stages.length} stages)`);

  // Second pipeline
  const pipeline2 = await prisma.pipeline.create({
    data: {
      workspaceId: workspace.id,
      name: 'Enterprise Pipeline',
      isDefault: false,
    },
  });

  await Promise.all([
    prisma.stage.create({ data: { pipelineId: pipeline2.id, workspaceId: workspace.id, name: 'Discovery', displayOrder: 0, winProbability: 0.1, color: '#0ea5e9' } }),
    prisma.stage.create({ data: { pipelineId: pipeline2.id, workspaceId: workspace.id, name: 'Technical Review', displayOrder: 1, winProbability: 0.3, color: '#06b6d4' } }),
    prisma.stage.create({ data: { pipelineId: pipeline2.id, workspaceId: workspace.id, name: 'Procurement', displayOrder: 2, winProbability: 0.6, color: '#14b8a6' } }),
    prisma.stage.create({ data: { pipelineId: pipeline2.id, workspaceId: workspace.id, name: 'Legal', displayOrder: 3, winProbability: 0.8, color: '#10b981' } }),
    prisma.stage.create({ data: { pipelineId: pipeline2.id, workspaceId: workspace.id, name: 'Signed', displayOrder: 4, winProbability: 1.0, color: '#22c55e' } }),
  ]);

  // Create deals
  const dealData = [
    { title: 'TechVentures Platform License', contactId: contacts[0]!.id, companyId: companies[0]!.id, stageId: stages[3]!.id, value: 48000, status: 'open' },
    { title: 'Global Dynamics ERP Integration', contactId: contacts[1]!.id, companyId: companies[1]!.id, stageId: stages[2]!.id, value: 125000, status: 'open' },
    { title: 'Nexus Health Starter Plan', contactId: contacts[2]!.id, companyId: companies[2]!.id, stageId: stages[0]!.id, value: 12000, status: 'open' },
    { title: 'Quantum Finance Enterprise', contactId: contacts[3]!.id, companyId: companies[3]!.id, stageId: stages[4]!.id, value: 250000, status: 'won' },
    { title: 'EcoSmart Growth Plan', contactId: contacts[4]!.id, companyId: companies[4]!.id, stageId: stages[1]!.id, value: 24000, status: 'open' },
    { title: 'DataStream Analytics POC', contactId: contacts[5]!.id, companyId: companies[5]!.id, stageId: stages[0]!.id, value: 8500, status: 'open' },
    { title: 'Apex Retail Full Suite', contactId: contacts[6]!.id, companyId: companies[6]!.id, stageId: stages[4]!.id, value: 380000, status: 'won' },
    { title: 'Orbital Robotics Custom Build', contactId: contacts[7]!.id, companyId: companies[7]!.id, stageId: stages[2]!.id, value: 95000, status: 'open' },
    { title: 'Pinnacle Education Pilot', contactId: contacts[8]!.id, companyId: companies[8]!.id, stageId: stages[0]!.id, value: 6000, status: 'open' },
    { title: 'Vortex Media Campaign Tool', contactId: contacts[9]!.id, companyId: companies[9]!.id, stageId: stages[5]!.id, value: 35000, status: 'lost', },
    { title: 'TechVentures Expansion', contactId: contacts[10]!.id, companyId: companies[0]!.id, stageId: stages[3]!.id, value: 72000, status: 'open' },
    { title: 'Global Dynamics Phase 2', contactId: contacts[11]!.id, companyId: companies[1]!.id, stageId: stages[1]!.id, value: 180000, status: 'open' },
    { title: 'Nexus Health Pro Upgrade', contactId: contacts[12]!.id, companyId: companies[2]!.id, stageId: stages[2]!.id, value: 28000, status: 'open' },
    { title: 'Quantum Finance Add-on', contactId: contacts[13]!.id, companyId: companies[3]!.id, stageId: stages[3]!.id, value: 45000, status: 'open' },
    { title: 'EcoSmart Enterprise Eval', contactId: contacts[14]!.id, companyId: companies[4]!.id, stageId: stages[0]!.id, value: 55000, status: 'open' },
    { title: 'DataStream Premium', contactId: contacts[15]!.id, companyId: companies[5]!.id, stageId: stages[1]!.id, value: 18000, status: 'open' },
    { title: 'Apex Retail Renewal', contactId: contacts[16]!.id, companyId: companies[6]!.id, stageId: stages[4]!.id, value: 395000, status: 'won' },
    { title: 'Orbital Robotics Support', contactId: contacts[17]!.id, companyId: companies[7]!.id, stageId: stages[1]!.id, value: 42000, status: 'open' },
    { title: 'Pinnacle Education Full', contactId: contacts[18]!.id, companyId: companies[8]!.id, stageId: stages[5]!.id, value: 15000, status: 'lost' },
    { title: 'Vortex Media Suite', contactId: contacts[19]!.id, companyId: companies[9]!.id, stageId: stages[2]!.id, value: 62000, status: 'open' },
  ];

  const deals = await Promise.all(
    dealData.map((d, i) =>
      prisma.deal.create({
        data: {
          workspaceId: workspace.id,
          ownerId: users[i % 3]!.id,
          currency: 'USD',
          closeDate: new Date(Date.now() + (i * 7 + 14) * 86400000),
          winProbability: stages.find((s) => s.id === d.stageId)?.winProbability ?? 0,
          lostReason: d.status === 'lost' ? 'Budget constraints' : null,
          value: d.value,
          title: d.title,
          contactId: d.contactId,
          companyId: d.companyId,
          stageId: d.stageId,
          status: d.status,
        },
      })
    )
  );

  console.log(`  ✓ Deals: ${deals.length}`);

  // Create activities
  const activityTypes = ['email', 'call', 'note', 'task', 'meeting'] as const;
  const sentiments = ['positive', 'neutral', 'negative'] as const;

  for (let i = 0; i < 40; i++) {
    const type = activityTypes[i % activityTypes.length]!;
    const contact = contacts[i % contacts.length]!;
    const deal = deals[i % deals.length]!;
    const user = users[i % users.length]!;

    await prisma.activity.create({
      data: {
        workspaceId: workspace.id,
        contactId: contact.id,
        dealId: deal.id,
        userId: user.id,
        type,
        direction: type === 'email' || type === 'call' ? (i % 2 === 0 ? 'inbound' : 'outbound') : null,
        subject: `${type === 'email' ? 'Re: ' : ''}${deal.title} — ${type}`,
        body: `Activity ${i + 1}: ${type} regarding ${deal.title} with ${contact.firstName} ${contact.lastName}.`,
        sentiment: sentiments[i % sentiments.length],
        durationSeconds: type === 'call' ? 300 + i * 60 : null,
        createdAt: new Date(Date.now() - i * 86400000),
      },
    });
  }

  console.log('  ✓ Activities: 40');

  console.log('\n✅ Seed complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
