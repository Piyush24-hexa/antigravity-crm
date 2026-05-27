/**
 * ═══════════════════════════════════════════════════════════════
 *  END-TO-END ORDER LIFECYCLE SIMULATION SEED
 * ═══════════════════════════════════════════════════════════════
 *
 *  Simulates a complete order flowing through every department:
 *
 *    1. EMPLOYEE receives a customer order → creates Sales Order
 *    2. PRODUCTION MANAGER reviews & plans → creates Work Order
 *    3. RESEARCH TEAM investigates materials/specs
 *    4. DESIGN TEAM confirms BOM & engineering drawings
 *    5. MANUFACTURING TEAM builds the product
 *    6. QC checks → completes manufacturing
 *    7. BILLING → Invoice generated & Payment recorded
 *    8. DELIVERY → Shipped to customer
 *
 *  Run with: npx tsx prisma/seed-e2e-simulation.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000);

async function main() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🔄 END-TO-END ORDER LIFECYCLE SIMULATION');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');

  // ─── Prerequisites ─────────────────────────────────────────
  const workspace = await prisma.workspace.findFirst();
  if (!workspace) throw new Error('No workspace found. Run main seed first.');

  const companies = await prisma.company.findMany({ where: { workspaceId: workspace.id }, take: 3 });
  const deals     = await prisma.deal.findMany({ where: { workspaceId: workspace.id }, take: 3 });
  if (deals.length < 3) throw new Error('Need at least 3 deals. Run main seed first.');

  // Get existing products (from production seed)
  let products = await prisma.product.findMany({ where: { workspaceId: workspace.id }, take: 4 });
  if (products.length < 4) {
    // Create minimal products if production seed wasn't run
    products = await Promise.all([
      prisma.product.create({ data: { workspaceId: workspace.id, name: 'Precision Valve Assembly V2', sku: 'PVA-002', description: 'High-pressure hydraulic valve assembly.' } }),
      prisma.product.create({ data: { workspaceId: workspace.id, name: 'Industrial Control Panel ICP-400', sku: 'ICP-400', description: 'SCADA-compatible control panel.' } }),
      prisma.product.create({ data: { workspaceId: workspace.id, name: 'CNC Machined Bracket BR-78', sku: 'BR-078', description: 'Precision-machined structural bracket.' } }),
      prisma.product.create({ data: { workspaceId: workspace.id, name: 'Pneumatic Actuator PA-55', sku: 'PA-055', description: 'Double-acting pneumatic actuator.' } }),
    ]);
  }

  console.log('  ✓ Prerequisites loaded\n');

  // ═══════════════════════════════════════════════════════════
  //  SIMULATION 1: "Global Dynamics — 20x Control Panels"
  //  STATUS: FULLY COMPLETED (past tense, all billing done)
  // ═══════════════════════════════════════════════════════════
  console.log('  ┌──────────────────────────────────────────────────');
  console.log('  │ SIM 1: Global Dynamics — 20x Control Panels');
  console.log('  │ STATUS: ✅ FULLY COMPLETED + INVOICED + PAID');
  console.log('  └──────────────────────────────────────────────────');

  // Step 1: Employee receives order, creates Sales Order
  const so1 = await prisma.salesOrder.create({ data: {
    workspaceId: workspace.id,
    dealId: deals[0]!.id,
    orderNumber: 'SO-SIM-001',
    status: 'invoiced',
    subtotal: 76000.00,
    taxAmount: 6840.00,
    totalAmount: 82840.00,
    currency: 'USD',
    notes: '[Employee: James Park] Customer Global Dynamics ordered 20x ICP-400 control panels. Rush delivery requested.',
    createdAt: day(-30),
  }});
  await prisma.salesOrderLine.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so1.id,
    productId: products[1]!.id,
    quantity: 20,
    unitPrice: 3800.00,
    discount: 0,
    taxRate: 9.00,
    lineTotal: 76000.00,
  }});
  console.log('    ✓ Step 1: Employee created SO-SIM-001 (20x ICP-400)');

  // Step 2: Production Manager creates Work Order
  const wo1 = await prisma.workOrder.create({ data: {
    workspaceId: workspace.id,
    woNumber: 'WO-SIM-001',
    salesOrderId: so1.id,
    productId: products[1]!.id,
    status: 'completed',
    plannedQty: 20,
    completedQty: 20,
    rejectedQty: 1,
    plannedStart: day(-28),
    plannedEnd: day(-14),
    actualStart: day(-27),
    actualEnd: day(-13),
    createdAt: day(-28),
  }});

  // Work Order Logs — the full journey through departments
  const wo1Logs = [
    { type: 'status_change', notes: '[Production Manager] Work order WO-SIM-001 created for SO-SIM-001. Assigned to Research Team for material verification.', daysAgo: 28 },
    { type: 'note',          notes: '[Research Team] Material check complete. All SCADA components (PLC, HMI screens, contactors) are in stock. Approved for design.', daysAgo: 26 },
    { type: 'note',          notes: '[Design Team] Engineering drawing ICP-400-R3 reviewed. BOM verified — 47 components per unit. Wiring schematic confirmed. Cleared for manufacturing.', daysAgo: 24 },
    { type: 'status_change', notes: '[Production Manager] Released to Manufacturing Team. Priority: HIGH. Target: 5 units/day.', daysAgo: 22 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 1: 5 panels assembled, wired, and bench-tested. All passed.', daysAgo: 21 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 2: 5 more units complete. Running total: 10/20. Solder joint quality excellent.', daysAgo: 20 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 3: 5 units complete. Total: 15/20. One unit showed intermittent HMI fault — set aside for rework.', daysAgo: 19 },
    { type: 'qc_check',      notes: '[QC Inspector] Unit #13 HMI fault traced to loose ribbon cable. Reworked and passed re-test.', daysAgo: 18 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 4: Final 5 units assembled. 20/20 complete. 1 unit rejected (cracked housing).', daysAgo: 17 },
    { type: 'qc_check',      notes: '[QC Inspector] Full lot inspection: 19/20 pass. 1 rejected unit (cracked housing) — replaced from spare stock.', daysAgo: 16 },
    { type: 'note',          notes: '[Manufacturing Team] Replacement unit #21 assembled and passed QC. Final count: 20 good units.', daysAgo: 15 },
    { type: 'status_change', notes: '[Production Manager] All 20 units passed final QC. Work order COMPLETED. Ready for dispatch.', daysAgo: 13 },
  ];

  for (const log of wo1Logs) {
    await prisma.workOrderLog.create({ data: {
      workspaceId: workspace.id, workOrderId: wo1.id,
      type: log.type, notes: log.notes,
      createdAt: day(-log.daysAgo),
    }});
  }
  console.log('    ✓ Step 2-6: Full production lifecycle (Research → Design → Manufacturing → QC)');

  // Step 7: Invoice generated
  const inv1 = await prisma.invoice.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so1.id,
    companyId: companies[1]?.id ?? companies[0]!.id,
    invoiceNumber: 'INV-SIM-001',
    status: 'paid',
    issueDate: day(-12),
    dueDate: day(18),
    paidAt: day(-5),
    subtotal: 76000.00,
    taxAmount: 6840.00,
    totalAmount: 82840.00,
    amountPaid: 82840.00,
    balanceDue: 0,
    currency: 'USD',
    notes: 'Payment received via bank wire transfer.',
    createdAt: day(-12),
  }});
  await prisma.invoiceLine.create({ data: {
    workspaceId: workspace.id,
    invoiceId: inv1.id,
    productId: products[1]!.id,
    description: 'Industrial Control Panel ICP-400 × 20 units',
    quantity: 20,
    unitPrice: 3800.00,
    discount: 0,
    taxRate: 9.00,
    lineTotal: 76000.00,
  }});
  console.log('    ✓ Step 7: Invoice INV-SIM-001 — $82,840 (PAID)');

  // Step 8: Payment recorded
  await prisma.payment.create({ data: {
    workspaceId: workspace.id,
    invoiceId: inv1.id,
    amount: 82840.00,
    method: 'bank_transfer',
    referenceNumber: 'WIRE-GD-2025-4418',
    status: 'cleared',
    paidAt: day(-5),
    notes: 'Global Dynamics — wire transfer cleared.',
    createdAt: day(-5),
  }});
  console.log('    ✓ Step 8: Payment $82,840 received (bank wire)');

  // Step 9: Delivery
  await prisma.deliveryOrder.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so1.id,
    trackingNumber: 'FDX-8847291033',
    carrierName: 'FedEx Freight',
    shippedAt: day(-10),
    deliveredAt: day(-7),
    status: 'delivered',
    createdAt: day(-10),
  }});
  console.log('    ✓ Step 9: Delivered via FedEx Freight\n');


  // ═══════════════════════════════════════════════════════════
  //  SIMULATION 2: "TechVentures — 50x Valve Assemblies"
  //  STATUS: IN PROGRESS (currently in Manufacturing)
  // ═══════════════════════════════════════════════════════════
  console.log('  ┌──────────────────────────────────────────────────');
  console.log('  │ SIM 2: TechVentures — 50x Valve Assemblies');
  console.log('  │ STATUS: 🔨 IN MANUFACTURING (28/50 complete)');
  console.log('  └──────────────────────────────────────────────────');

  const so2 = await prisma.salesOrder.create({ data: {
    workspaceId: workspace.id,
    dealId: deals[1]!.id,
    orderNumber: 'SO-SIM-002',
    status: 'in_production',
    subtotal: 72500.00,
    taxAmount: 6525.00,
    totalAmount: 79025.00,
    currency: 'USD',
    notes: '[Employee: Sarah Miller] TechVentures order for 50x PVA-002 valve assemblies. Standard 30-day lead time.',
    createdAt: day(-15),
  }});
  await prisma.salesOrderLine.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so2.id,
    productId: products[0]!.id,
    quantity: 50,
    unitPrice: 1450.00,
    discount: 0,
    taxRate: 9.00,
    lineTotal: 72500.00,
  }});
  console.log('    ✓ Step 1: Employee created SO-SIM-002 (50x PVA-002)');

  const wo2 = await prisma.workOrder.create({ data: {
    workspaceId: workspace.id,
    woNumber: 'WO-SIM-002',
    salesOrderId: so2.id,
    productId: products[0]!.id,
    status: 'in_progress',
    plannedQty: 50,
    completedQty: 28,
    rejectedQty: 2,
    plannedStart: day(-12),
    plannedEnd: day(8),
    actualStart: day(-11),
    actualEnd: null,
    createdAt: day(-13),
  }});

  const wo2Logs = [
    { type: 'status_change', notes: '[Production Manager] WO-SIM-002 created. Sent to Research for material availability check.', daysAgo: 13 },
    { type: 'note',          notes: '[Research Team] Checked inventory: 120 coupling flanges (SCF-003) in stock, 100 seals in stock, 60 valve bodies. Sufficient for 50-unit run. APPROVED.', daysAgo: 12 },
    { type: 'note',          notes: '[Design Team] BOM version 2.1 confirmed. Assembly drawing PVA-002-R2 released. Torque specs: 45 Nm ±5%. CLEARED for manufacturing.', daysAgo: 11 },
    { type: 'status_change', notes: '[Production Manager] Released to Manufacturing. Batch plan: 10 units/day × 5 days.', daysAgo: 10 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 1 complete: 10 valve bodies machined, 10 assemblies started. 10/50.', daysAgo: 9 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 2: 10 more complete. Running total: 20/50. Pressure test all PASS at 350 bar.', daysAgo: 7 },
    { type: 'qc_check',      notes: '[QC] Spot check on batch 2: 2 units have micro-leak at seal interface. Flagged for rework.', daysAgo: 5 },
    { type: 'note',          notes: '[Manufacturing Team] 2 flagged units re-sealed and retested. Both now pass at 350 bar.', daysAgo: 4 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Day 3: 8 more assembled and tested. Total: 28/50. On track for deadline.', daysAgo: 2 },
    { type: 'note',          notes: '[Production Manager] Progress review: 28/50 (56%). Schedule on track. Manufacturing continues.', daysAgo: 0 },
  ];

  for (const log of wo2Logs) {
    await prisma.workOrderLog.create({ data: {
      workspaceId: workspace.id, workOrderId: wo2.id,
      type: log.type, notes: log.notes,
      createdAt: day(-log.daysAgo),
    }});
  }
  console.log('    ✓ Step 2-5: Research ✓ → Design ✓ → Manufacturing (in progress, 28/50)\n');


  // ═══════════════════════════════════════════════════════════
  //  SIMULATION 3: "Nexus Health — 5x Heat Exchangers"
  //  STATUS: JUST RECEIVED (pending, in Research review)
  // ═══════════════════════════════════════════════════════════
  console.log('  ┌──────────────────────────────────────────────────');
  console.log('  │ SIM 3: Nexus Health — 5x Heat Exchangers');
  console.log('  │ STATUS: 🔬 IN RESEARCH REVIEW (new order)');
  console.log('  └──────────────────────────────────────────────────');

  const so3 = await prisma.salesOrder.create({ data: {
    workspaceId: workspace.id,
    dealId: deals[2]!.id,
    orderNumber: 'SO-SIM-003',
    status: 'confirmed',
    subtotal: 31000.00,
    taxAmount: 2790.00,
    totalAmount: 33790.00,
    currency: 'USD',
    notes: '[Employee: Alex Chen] Nexus Health needs 5x HX-1200 heat exchangers for their new facility. Custom pressure rating requested: 25 bar (standard is 16 bar).',
    createdAt: day(-2),
  }});
  await prisma.salesOrderLine.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so3.id,
    productId: products[3]!.id,
    quantity: 5,
    unitPrice: 6200.00,
    discount: 0,
    taxRate: 9.00,
    lineTotal: 31000.00,
  }});
  console.log('    ✓ Step 1: Employee created SO-SIM-003 (5x HX-1200)');

  const wo3 = await prisma.workOrder.create({ data: {
    workspaceId: workspace.id,
    woNumber: 'WO-SIM-003',
    salesOrderId: so3.id,
    productId: products[3]!.id,
    status: 'pending',
    plannedQty: 5,
    completedQty: 0,
    rejectedQty: 0,
    plannedStart: day(3),
    plannedEnd: day(24),
    actualStart: null,
    actualEnd: null,
    createdAt: day(-1),
  }});

  const wo3Logs = [
    { type: 'status_change', notes: '[Production Manager] WO-SIM-003 created for SO-SIM-003. NOTE: Customer requested non-standard 25 bar pressure rating. Sent to Research Team for feasibility study.', daysAgo: 1 },
    { type: 'note',          notes: '[Research Team] Analyzing 25 bar requirement. Standard HX-1200 rated for 16 bar. Options: (A) thicker tube walls 2.5mm → 3.5mm, (B) switch to Inconel 625 alloy. Running cost analysis...', daysAgo: 0 },
  ];

  for (const log of wo3Logs) {
    await prisma.workOrderLog.create({ data: {
      workspaceId: workspace.id, workOrderId: wo3.id,
      type: log.type, notes: log.notes,
      createdAt: day(-log.daysAgo),
    }});
  }
  console.log('    ✓ Step 2: Production Manager assigned to Research');
  console.log('    ✓ Step 3: Research Team reviewing (awaiting feasibility)\n');


  // ═══════════════════════════════════════════════════════════
  //  SIMULATION 4: "Quantum Finance — 100x Brackets"
  //  STATUS: QC PHASE (manufacturing done, awaiting sign-off)
  // ═══════════════════════════════════════════════════════════
  console.log('  ┌──────────────────────────────────────────────────');
  console.log('  │ SIM 4: Quantum Finance — 100x CNC Brackets');
  console.log('  │ STATUS: 🧪 QC INSPECTION (100/100 built)');
  console.log('  └──────────────────────────────────────────────────');

  const so4 = await prisma.salesOrder.create({ data: {
    workspaceId: workspace.id,
    dealId: deals[0]!.id,
    orderNumber: 'SO-SIM-004',
    status: 'in_production',
    subtotal: 29000.00,
    taxAmount: 2610.00,
    totalAmount: 31610.00,
    currency: 'USD',
    notes: '[Employee: James Park] Quantum Finance order for 100x BR-078 brackets for their server rack installation.',
    createdAt: day(-18),
  }});
  await prisma.salesOrderLine.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so4.id,
    productId: products[2]!.id,
    quantity: 100,
    unitPrice: 290.00,
    discount: 0,
    taxRate: 9.00,
    lineTotal: 29000.00,
  }});

  const wo4 = await prisma.workOrder.create({ data: {
    workspaceId: workspace.id,
    woNumber: 'WO-SIM-004',
    salesOrderId: so4.id,
    productId: products[2]!.id,
    status: 'qc',
    plannedQty: 100,
    completedQty: 100,
    rejectedQty: 4,
    plannedStart: day(-14),
    plannedEnd: day(-2),
    actualStart: day(-14),
    actualEnd: null,
    createdAt: day(-16),
  }});

  const wo4Logs = [
    { type: 'status_change', notes: '[Production Manager] WO-SIM-004 created. Standard bracket order — sent directly to Design for BOM confirmation.', daysAgo: 16 },
    { type: 'note',          notes: '[Research Team] Standard material (304 SS). No special requirements. Skipped to Design.', daysAgo: 15 },
    { type: 'note',          notes: '[Design Team] BOM v1.0 confirmed. Drawing BR-078-R1. Tolerances: ±0.05mm. CLEARED.', daysAgo: 14 },
    { type: 'status_change', notes: '[Production Manager] Released to Manufacturing. CNC Program: BR78-PROG-3. Batch: 25/run.', daysAgo: 13 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Batch 1: 25 brackets machined. First-article inspection PASSED.', daysAgo: 11 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Batch 2: 25 more done. Total: 50/100.', daysAgo: 9 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Batch 3: 25 more. Total: 75/100. Tool change on spindle 2 — normal wear.', daysAgo: 6 },
    { type: 'qty_update',    notes: '[Manufacturing Team] Batch 4: Final 25 machined. Total: 100/100 manufactured.', daysAgo: 4 },
    { type: 'status_change', notes: '[Manufacturing Team] All 100 units manufactured. Moved to QC inspection.', daysAgo: 3 },
    { type: 'qc_check',      notes: '[QC Inspector] CMM measurement: 4 units out of tolerance on hole pattern (+0.08mm vs ±0.05mm spec). Rejected.', daysAgo: 2 },
    { type: 'note',          notes: '[QC Inspector] 96 units PASS. 4 rejected units set aside. Awaiting Production Manager approval to ship 96 or produce 4 replacements.', daysAgo: 1 },
    { type: 'note',          notes: '[Production Manager] Decision: Ship 96 units now + manufacture 4 replacement brackets as follow-up. Awaiting final QC sign-off for the 96.', daysAgo: 0 },
  ];

  for (const log of wo4Logs) {
    await prisma.workOrderLog.create({ data: {
      workspaceId: workspace.id, workOrderId: wo4.id,
      type: log.type, notes: log.notes,
      createdAt: day(-log.daysAgo),
    }});
  }

  // Pre-create the invoice as draft (billing is next step after QC)
  await prisma.invoice.create({ data: {
    workspaceId: workspace.id,
    salesOrderId: so4.id,
    companyId: companies[0]!.id,
    invoiceNumber: 'INV-SIM-004',
    status: 'draft',
    issueDate: day(0),
    dueDate: day(30),
    subtotal: 29000.00,
    taxAmount: 2610.00,
    totalAmount: 31610.00,
    amountPaid: 0,
    balanceDue: 31610.00,
    currency: 'USD',
    notes: 'Draft — pending QC approval before sending to customer.',
  }});

  console.log('    ✓ Steps 1-6: Full cycle through Research → Design → Manufacturing');
  console.log('    ✓ Step 6b: QC found 4 defects, awaiting sign-off');
  console.log('    ✓ Step 7: Draft invoice INV-SIM-004 prepared ($31,610)\n');


  // ═══════════════════════════════════════════════════════════
  //  SUMMARY
  // ═══════════════════════════════════════════════════════════
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ✅ SIMULATION SEED COMPLETE');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  console.log('  ┌─────────────────────────────────────────────────────────────┐');
  console.log('  │ SIM  │ Customer          │ Product     │ Status             │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │  1   │ Global Dynamics    │ 20x ICP-400 │ ✅ PAID + DELIVERED │');
  console.log('  │  2   │ TechVentures       │ 50x PVA-002 │ 🔨 IN MFG (28/50)  │');
  console.log('  │  3   │ Nexus Health       │ 5x HX-1200  │ 🔬 RESEARCH REVIEW │');
  console.log('  │  4   │ Quantum Finance    │ 100x BR-078 │ 🧪 QC INSPECTION   │');
  console.log('  └─────────────────────────────────────────────────────────────┘');
  console.log('');
  console.log('  Data created:');
  console.log('    • 4 Sales Orders  (SO-SIM-001 → 004)');
  console.log('    • 4 Work Orders   (WO-SIM-001 → 004)');
  console.log('    • 46 Activity Logs (full department-by-department trail)');
  console.log('    • 2 Invoices      (1 paid, 1 draft)');
  console.log('    • 1 Payment       ($82,840 cleared)');
  console.log('    • 1 Delivery      (FedEx shipped + delivered)');
  console.log('');
}

main()
  .catch((e) => { console.error('❌ Simulation seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
