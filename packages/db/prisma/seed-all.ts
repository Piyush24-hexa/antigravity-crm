/**
 * Mega Seed Script
 * Clears the database and seeds realistic dummy data for ALL modules.
 * Run with: npx tsx prisma/seed-all.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const day = (offset: number) => new Date(Date.now() + offset * 86_400_000);

async function main() {
  console.log('🌱 Starting full database seed for ALL modules...');

  // 1. CLEAR DATA IN REVERSE DEPENDENCY ORDER
  console.log('🧹 Cleaning existing data...');
  await prisma.auditLog.deleteMany();
  await prisma.dealStageHistory.deleteMany();
  await prisma.workOrderLog.deleteMany();
  await prisma.workOrder.deleteMany();
  await prisma.deliveryOrder.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceLine.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.salesOrderLine.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.priceBookEntry.deleteMany();
  await prisma.priceBook.deleteMany();
  await prisma.bOMLine.deleteMany();
  await prisma.bOM.deleteMany();
  await prisma.product.deleteMany();
  await prisma.campaignMember.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.dealContact.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.quota.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.pipeline.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  // 2. WORKSPACE & USERS
  console.log('🏢 Seeding Workspace & Users...');
  const workspace = await prisma.workspace.create({
    data: { name: 'Acme Corp', slug: 'acme-corp', plan: 'pro', seatsUsed: 4, seatsLimit: 10, aiTokensLimit: BigInt(500000) },
  });

  const users = await Promise.all([
    prisma.user.create({ data: { workspaceId: workspace.id, clerkUserId: 'user_demo_owner', email: 'alex@acme.com', name: 'Alex Chen', role: 'owner' } }),
    prisma.user.create({ data: { workspaceId: workspace.id, clerkUserId: 'user_demo_admin', email: 'sarah@acme.com', name: 'Sarah Miller', role: 'admin' } }),
    prisma.user.create({ data: { workspaceId: workspace.id, clerkUserId: 'user_demo_member', email: 'james@acme.com', name: 'James Park', role: 'member' } }),
    prisma.user.create({ data: { workspaceId: workspace.id, clerkUserId: 'user_demo_prod', email: 'david@acme.com', name: 'David Wong', role: 'production_manager' } }),
  ]);

  // 3. COMPANIES & CONTACTS
  console.log('🤝 Seeding Companies & Contacts...');
  const companies = await Promise.all([
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'TechVentures Inc', domain: 'techventures.io', industry: 'SaaS' } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Global Dynamics', domain: 'globaldynamics.com', industry: 'Manufacturing' } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Nexus Health', domain: 'nexushealth.co', industry: 'Healthcare' } }),
    prisma.company.create({ data: { workspaceId: workspace.id, name: 'Quantum Finance', domain: 'quantumfin.com', industry: 'FinTech' } }),
  ]);

  const contacts = await Promise.all([
    prisma.contact.create({ data: { workspaceId: workspace.id, ownerId: users[0].id, firstName: 'Emily', lastName: 'Watson', email: 'emily@techventures.io', companyId: companies[0].id, status: 'customer' } }),
    prisma.contact.create({ data: { workspaceId: workspace.id, ownerId: users[1].id, firstName: 'Michael', lastName: 'Schmidt', email: 'michael@globaldynamics.com', companyId: companies[1].id, status: 'prospect' } }),
    prisma.contact.create({ data: { workspaceId: workspace.id, ownerId: users[2].id, firstName: 'Lisa', lastName: 'Park', email: 'lisa@nexushealth.co', companyId: companies[2].id, status: 'lead' } }),
    prisma.contact.create({ data: { workspaceId: workspace.id, ownerId: users[0].id, firstName: 'David', lastName: 'Thompson', email: 'david@quantumfin.com', companyId: companies[3].id, status: 'customer' } }),
  ]);

  // 4. PIPELINES & DEALS
  console.log('📊 Seeding Pipelines & Deals...');
  const pipeline = await prisma.pipeline.create({
    data: { workspaceId: workspace.id, name: 'Sales Pipeline', isDefault: true },
  });

  const stages = await Promise.all([
    prisma.stage.create({ data: { pipelineId: pipeline.id, workspaceId: workspace.id, name: 'Lead', displayOrder: 0, winProbability: 0.1, color: '#6366f1' } }),
    prisma.stage.create({ data: { pipelineId: pipeline.id, workspaceId: workspace.id, name: 'Qualified', displayOrder: 1, winProbability: 0.25, color: '#8b5cf6' } }),
    prisma.stage.create({ data: { pipelineId: pipeline.id, workspaceId: workspace.id, name: 'Proposal', displayOrder: 2, winProbability: 0.5, color: '#a855f7' } }),
    prisma.stage.create({ data: { pipelineId: pipeline.id, workspaceId: workspace.id, name: 'Negotiation', displayOrder: 3, winProbability: 0.75, color: '#d946ef' } }),
    prisma.stage.create({ data: { pipelineId: pipeline.id, workspaceId: workspace.id, name: 'Closed Won', displayOrder: 4, winProbability: 1.0, color: '#22c55e' } }),
  ]);

  const deals = await Promise.all([
    prisma.deal.create({ data: { workspaceId: workspace.id, ownerId: users[0].id, title: 'TechVentures Platform', contactId: contacts[0].id, companyId: companies[0].id, stageId: stages[3].id, value: 48000, status: 'open' } }),
    prisma.deal.create({ data: { workspaceId: workspace.id, ownerId: users[1].id, title: 'Global Dynamics ERP', contactId: contacts[1].id, companyId: companies[1].id, stageId: stages[2].id, value: 125000, status: 'open' } }),
    prisma.deal.create({ data: { workspaceId: workspace.id, ownerId: users[2].id, title: 'Nexus Health Plan', contactId: contacts[2].id, companyId: companies[2].id, stageId: stages[0].id, value: 12000, status: 'open' } }),
    prisma.deal.create({ data: { workspaceId: workspace.id, ownerId: users[0].id, title: 'Quantum Finance Enterprise', contactId: contacts[3].id, companyId: companies[3].id, stageId: stages[4].id, value: 250000, status: 'won' } }),
  ]);

  // 5. PRODUCTS & PRICEBOOKS
  console.log('📦 Seeding Products & Pricebooks...');
  const products = await Promise.all([
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Precision Valve Assembly V2', sku: 'PVA-002', description: 'High-pressure hydraulic valve' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Industrial Control Panel ICP-400', sku: 'ICP-400', description: 'SCADA panel' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Steel Coupling Flange', sku: 'SCF-003', description: 'ANSI 150# flange' } }),
  ]);

  const standardPricebook = await prisma.priceBook.create({
    data: { workspaceId: workspace.id, name: 'Standard Pricebook', isStandard: true },
  });

  const pricebookEntries = await Promise.all([
    prisma.priceBookEntry.create({ data: { workspaceId: workspace.id, priceBookId: standardPricebook.id, productId: products[0].id, unitPrice: 1450.00 } }),
    prisma.priceBookEntry.create({ data: { workspaceId: workspace.id, priceBookId: standardPricebook.id, productId: products[1].id, unitPrice: 3800.00 } }),
    prisma.priceBookEntry.create({ data: { workspaceId: workspace.id, priceBookId: standardPricebook.id, productId: products[2].id, unitPrice: 48.00 } }),
  ]);

  // 6. QUOTES
  console.log('📝 Seeding Quotes...');
  const quote = await prisma.quote.create({
    data: { workspaceId: workspace.id, dealId: deals[1].id, quoteNumber: 'QT-2025-001', status: 'Sent', validUntil: day(15) }
  });
  await prisma.quoteLineItem.create({
    data: { workspaceId: workspace.id, quoteId: quote.id, priceBookEntryId: pricebookEntries[1].id, quantity: 10, unitPrice: 3800.00, discount: 5.0 }
  });

  // 7. CAMPAIGNS
  console.log('🎯 Seeding Campaigns...');
  const campaign = await prisma.campaign.create({
    data: { workspaceId: workspace.id, name: 'Q3 Enterprise Outreach', type: 'Email', status: 'Active', budget: 5000.00, startDate: day(-10), endDate: day(20) }
  });
  await prisma.campaignMember.create({
    data: { workspaceId: workspace.id, campaignId: campaign.id, contactId: contacts[1].id, status: 'Sent' }
  });

  // 8. QUOTAS
  console.log('🎯 Seeding Quotas...');
  await prisma.quota.create({
    data: { workspaceId: workspace.id, userId: users[0].id, period: 'Q3-2025', target: 500000.00 }
  });

  // 9. BOM
  console.log('⚙️ Seeding BOMs...');
  const bom = await prisma.bOM.create({ data: { workspaceId: workspace.id, productId: products[0].id, version: '1.0' } });
  await prisma.bOMLine.create({ data: { workspaceId: workspace.id, bomId: bom.id, componentProductId: products[2].id, quantity: 2, unit: 'pcs', scrapPercent: 1.5 } });

  // 10. SALES ORDERS & PRODUCTION FLOW
  console.log('🏭 Seeding End-to-End Orders (Sales, Work Orders, Delivery, Invoices)...');
  
  // Order 1: Completed & Paid (Quantum Finance)
  const so1 = await prisma.salesOrder.create({ data: { workspaceId: workspace.id, dealId: deals[3].id, orderNumber: 'SO-2025-001', status: 'invoiced', subtotal: 38000, taxAmount: 3420, totalAmount: 41420 }});
  await prisma.salesOrderLine.create({ data: { workspaceId: workspace.id, salesOrderId: so1.id, productId: products[1].id, quantity: 10, unitPrice: 3800, lineTotal: 38000 }});
  
  const wo1 = await prisma.workOrder.create({ data: { workspaceId: workspace.id, woNumber: 'WO-2025-001', salesOrderId: so1.id, productId: products[1].id, status: 'completed', plannedQty: 10, completedQty: 10, plannedStart: day(-20), actualStart: day(-19), actualEnd: day(-10) }});
  await prisma.workOrderLog.create({ data: { workspaceId: workspace.id, workOrderId: wo1.id, type: 'status_change', notes: 'Completed manufacturing.', createdAt: day(-10) }});

  const inv1 = await prisma.invoice.create({ data: { workspaceId: workspace.id, salesOrderId: so1.id, companyId: companies[3].id, invoiceNumber: 'INV-2025-001', status: 'paid', issueDate: day(-9), dueDate: day(21), subtotal: 38000, taxAmount: 3420, totalAmount: 41420, amountPaid: 41420, balanceDue: 0 }});
  await prisma.invoiceLine.create({ data: { workspaceId: workspace.id, invoiceId: inv1.id, productId: products[1].id, description: 'Control Panels', quantity: 10, unitPrice: 3800, lineTotal: 38000 }});
  await prisma.payment.create({ data: { workspaceId: workspace.id, invoiceId: inv1.id, amount: 41420, method: 'bank_transfer', status: 'cleared', paidAt: day(-2) }});
  
  await prisma.deliveryOrder.create({ data: { workspaceId: workspace.id, salesOrderId: so1.id, trackingNumber: 'TRK-9988', carrierName: 'FedEx', status: 'delivered', shippedAt: day(-8), deliveredAt: day(-5) }});

  // Order 2: In Production (Global Dynamics)
  const so2 = await prisma.salesOrder.create({ data: { workspaceId: workspace.id, dealId: deals[1].id, orderNumber: 'SO-2025-002', status: 'in_production', subtotal: 72500, taxAmount: 6525, totalAmount: 79025 }});
  await prisma.salesOrderLine.create({ data: { workspaceId: workspace.id, salesOrderId: so2.id, productId: products[0].id, quantity: 50, unitPrice: 1450, lineTotal: 72500 }});
  
  const wo2 = await prisma.workOrder.create({ data: { workspaceId: workspace.id, woNumber: 'WO-2025-002', salesOrderId: so2.id, productId: products[0].id, status: 'in_progress', plannedQty: 50, completedQty: 25, plannedStart: day(-5), actualStart: day(-4) }});
  await prisma.workOrderLog.create({ data: { workspaceId: workspace.id, workOrderId: wo2.id, type: 'qty_update', notes: '25 units assembled.', createdAt: day(-1) }});

  console.log('✅ ALL SEEDS COMPLETED SUCCESSFULLY!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
