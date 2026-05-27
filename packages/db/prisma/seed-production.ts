/**
 * Production Module Demo Seed
 * Run with: npx tsx prisma/seed-production.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const daysFromNow = (d: number) => new Date(Date.now() + d * 86_400_000);
const daysAgo     = (d: number) => new Date(Date.now() - d * 86_400_000);

async function main() {
  console.log('\n🏭 Seeding Production Module Demo Data...\n');

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) throw new Error('No workspace found — run the main seed first.');

  // ─── Clean previous production data ──────────────────────────
  await prisma.workOrderLog.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.workOrder.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.bOMLine.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.bOM.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.salesOrderLine.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.salesOrder.deleteMany({ where: { workspaceId: workspace.id } });
  await prisma.product.deleteMany({ where: { workspaceId: workspace.id } });
  console.log('  ✓ Cleared old production data');

  // ─── Products (only schema-valid fields) ─────────────────────
  const products = await Promise.all([
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Precision Valve Assembly V2',    sku: 'PVA-002', description: 'High-pressure hydraulic valve assembly for industrial pipelines.' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Industrial Control Panel ICP-400', sku: 'ICP-400', description: 'SCADA-compatible 400V control panel with HMI touchscreen.' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'CNC Machined Bracket BR-78',      sku: 'BR-078',  description: 'Precision-machined structural mounting bracket, 304 stainless.' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Heat Exchanger HX-1200',          sku: 'HX-1200', description: 'Shell-and-tube heat exchanger, 1200 kW rated capacity.' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Pneumatic Actuator PA-55',         sku: 'PA-055',  description: 'Double-acting pneumatic linear actuator, 550N force.' } }),
    prisma.product.create({ data: { workspaceId: workspace.id, name: 'Steel Coupling Flange SCF-3',      sku: 'SCF-003', description: 'ANSI 150# slip-on flange, carbon steel, DN80.' } }),
  ]);
  console.log(`  ✓ Products: ${products.length}`);

  // ─── Need existing deals to create SalesOrders ───────────────
  const deals = await prisma.deal.findMany({ where: { workspaceId: workspace.id }, take: 5 });
  if (deals.length < 5) throw new Error('Run the main seed first to create deals.');

  // ─── Sales Orders ─────────────────────────────────────────────
  const salesOrders = await Promise.all([
    prisma.salesOrder.create({ data: {
      workspaceId: workspace.id, dealId: deals[0]!.id,
      orderNumber: 'SO-2025-001', status: 'in_production',
      subtotal: 43500.00, taxAmount: 3915.00, totalAmount: 47415.00, currency: 'USD',
      notes: 'Urgent — customer needs delivery by end of month.',
    }}),
    prisma.salesOrder.create({ data: {
      workspaceId: workspace.id, dealId: deals[1]!.id,
      orderNumber: 'SO-2025-002', status: 'in_production',
      subtotal: 76000.00, taxAmount: 6840.00, totalAmount: 82840.00, currency: 'USD',
      notes: 'Repeat order. Standard terms apply.',
    }}),
    prisma.salesOrder.create({ data: {
      workspaceId: workspace.id, dealId: deals[2]!.id,
      orderNumber: 'SO-2025-003', status: 'confirmed',
      subtotal: 12400.00, taxAmount: 1116.00, totalAmount: 13516.00, currency: 'USD',
    }}),
    prisma.salesOrder.create({ data: {
      workspaceId: workspace.id, dealId: deals[3]!.id,
      orderNumber: 'SO-2025-004', status: 'confirmed',
      subtotal: 18600.00, taxAmount: 1674.00, totalAmount: 20274.00, currency: 'USD',
    }}),
    prisma.salesOrder.create({ data: {
      workspaceId: workspace.id, dealId: deals[4]!.id,
      orderNumber: 'SO-2025-005', status: 'shipped',
      subtotal: 24000.00, taxAmount: 2160.00, totalAmount: 26160.00, currency: 'USD',
    }}),
  ]);
  console.log(`  ✓ Sales Orders: ${salesOrders.length}`);

  // ─── Work Orders (all 6 statuses + real date ranges) ─────────
  const workOrderData = [
    { woNumber:'WO-2025-001', salesOrderId: salesOrders[0]!.id, productId: products[0]!.id, status:'completed',   plannedQty:30,  completedQty:30,  rejectedQty:1, plannedStart:daysAgo(14),  plannedEnd:daysAgo(4),   actualStart:daysAgo(14),  actualEnd:daysAgo(5) },
    { woNumber:'WO-2025-002', salesOrderId: salesOrders[1]!.id, productId: products[1]!.id, status:'in_progress', plannedQty:20,  completedQty:12,  rejectedQty:0, plannedStart:daysAgo(8),   plannedEnd:daysFromNow(4), actualStart:daysAgo(7), actualEnd:null },
    { woNumber:'WO-2025-003', salesOrderId: salesOrders[1]!.id, productId: products[2]!.id, status:'qc',          plannedQty:150, completedQty:150, rejectedQty:3, plannedStart:daysAgo(6),   plannedEnd:daysFromNow(1), actualStart:daysAgo(6), actualEnd:null },
    { woNumber:'WO-2025-004', salesOrderId: salesOrders[2]!.id, productId: products[4]!.id, status:'released',    plannedQty:40,  completedQty:0,   rejectedQty:0, plannedStart:daysFromNow(1),plannedEnd:daysFromNow(8),  actualStart:null, actualEnd:null },
    { woNumber:'WO-2025-005', salesOrderId: salesOrders[3]!.id, productId: products[3]!.id, status:'pending',     plannedQty:5,   completedQty:0,   rejectedQty:0, plannedStart:daysFromNow(5),plannedEnd:daysFromNow(18), actualStart:null, actualEnd:null },
    { woNumber:'WO-2025-006', salesOrderId: salesOrders[4]!.id, productId: products[0]!.id, status:'completed',   plannedQty:15,  completedQty:15,  rejectedQty:0, plannedStart:daysAgo(35),  plannedEnd:daysAgo(22),  actualStart:daysAgo(35),  actualEnd:daysAgo(23) },
    { woNumber:'WO-2025-007', salesOrderId: salesOrders[0]!.id, productId: products[2]!.id, status:'in_progress', plannedQty:200, completedQty:80,  rejectedQty:5, plannedStart:daysAgo(3),   plannedEnd:daysFromNow(6), actualStart:daysAgo(3), actualEnd:null },
    { woNumber:'WO-2025-008', salesOrderId: salesOrders[2]!.id, productId: products[5]!.id, status:'cancelled',   plannedQty:500, completedQty:0,   rejectedQty:0, plannedStart:daysAgo(5),   plannedEnd:daysFromNow(2),  actualStart:null, actualEnd:null },
    { woNumber:'WO-2025-009', salesOrderId: salesOrders[3]!.id, productId: products[1]!.id, status:'released',    plannedQty:8,   completedQty:0,   rejectedQty:0, plannedStart:daysFromNow(3),plannedEnd:daysFromNow(14), actualStart:null, actualEnd:null },
    { woNumber:'WO-2025-010', salesOrderId: salesOrders[1]!.id, productId: products[4]!.id, status:'qc',          plannedQty:60,  completedQty:60,  rejectedQty:2, plannedStart:daysAgo(10),  plannedEnd:daysFromNow(2), actualStart:daysAgo(10), actualEnd:null },
    { woNumber:'WO-2025-011', salesOrderId: salesOrders[0]!.id, productId: products[3]!.id, status:'pending',     plannedQty:3,   completedQty:0,   rejectedQty:0, plannedStart:daysFromNow(8),plannedEnd:daysFromNow(20), actualStart:null, actualEnd:null },
    { woNumber:'WO-2025-012', salesOrderId: salesOrders[4]!.id, productId: products[2]!.id, status:'completed',   plannedQty:100, completedQty:100, rejectedQty:0, plannedStart:daysAgo(40),  plannedEnd:daysAgo(30),  actualStart:daysAgo(39),  actualEnd:daysAgo(31) },
  ];

  const workOrders = await Promise.all(
    workOrderData.map(wo => prisma.workOrder.create({ data: { workspaceId: workspace.id, ...wo } }))
  );
  console.log(`  ✓ Work Orders: ${workOrders.length} (covering all 6 statuses)`);

  // ─── Activity Logs ────────────────────────────────────────────
  const logs: { workOrderId: string; type: string; notes: string; daysAgo: number }[] = [
    { workOrderId: workOrders[0]!.id,  type:'status_change', notes:'Work order released to shop floor.',                                      daysAgo:14 },
    { workOrderId: workOrders[0]!.id,  type:'qty_update',    notes:'Batch 1 complete: 15 units produced.',                                    daysAgo:10 },
    { workOrderId: workOrders[0]!.id,  type:'qty_update',    notes:'Batch 2 complete: 15 units produced. 1 unit rejected (dimensional OOT).', daysAgo:6  },
    { workOrderId: workOrders[0]!.id,  type:'status_change', notes:'QC passed. Order marked Completed.',                                      daysAgo:5  },

    { workOrderId: workOrders[1]!.id,  type:'status_change', notes:'Released to manufacturing floor.',                                        daysAgo:8 },
    { workOrderId: workOrders[1]!.id,  type:'qty_update',    notes:'6 panels assembled. Wiring phase in progress.',                           daysAgo:4 },
    { workOrderId: workOrders[1]!.id,  type:'qty_update',    notes:'Additional 6 units complete — 12 of 20 total.',                           daysAgo:1 },
    { workOrderId: workOrders[1]!.id,  type:'note',          notes:'Customer requested UL certification markings. Confirmed with engineering.',daysAgo:0 },

    { workOrderId: workOrders[2]!.id,  type:'status_change', notes:'Production complete. Moved to QC inspection.',                            daysAgo:2 },
    { workOrderId: workOrders[2]!.id,  type:'qc_check',      notes:'3 brackets rejected — surface finish below Ra 1.6 spec. Re-polishing.',   daysAgo:1 },
    { workOrderId: workOrders[2]!.id,  type:'note',          notes:'Re-polished units back in QC queue. Expected sign-off tomorrow.',          daysAgo:0 },

    { workOrderId: workOrders[6]!.id,  type:'status_change', notes:'Released. CNC machining started.',                                        daysAgo:3 },
    { workOrderId: workOrders[6]!.id,  type:'qty_update',    notes:'40 brackets machined. Setting up next run.',                              daysAgo:2 },
    { workOrderId: workOrders[6]!.id,  type:'qty_update',    notes:'80 units complete. 5 rejected for tool marks.',                           daysAgo:0 },
    { workOrderId: workOrders[6]!.id,  type:'qc_check',      notes:'Tool #4 wear flagged. Replaced. Inspection ongoing.',                     daysAgo:0 },

    { workOrderId: workOrders[9]!.id,  type:'status_change', notes:'Full batch of 60 actuators assembled and tested.',                        daysAgo:3 },
    { workOrderId: workOrders[9]!.id,  type:'qc_check',      notes:'2 units failed pressure test at 12 bar. Returned for re-seal.',           daysAgo:1 },
    { workOrderId: workOrders[9]!.id,  type:'note',          notes:'Awaiting final QC sign-off from supervisor.',                             daysAgo:0 },

    { workOrderId: workOrders[7]!.id,  type:'status_change', notes:'Order cancelled — customer PO withdrawn.',                                daysAgo:5 },

    { workOrderId: workOrders[5]!.id,  type:'status_change', notes:'WO-2025-006 completed on schedule. Shipped with SO-2025-005.',            daysAgo:23 },
    { workOrderId: workOrders[11]!.id, type:'status_change', notes:'WO-2025-012 completed 1 day ahead of schedule.',                          daysAgo:31 },
  ];

  for (const log of logs) {
    await prisma.workOrderLog.create({
      data: {
        workspaceId: workspace.id,
        workOrderId: log.workOrderId,
        type: log.type,
        notes: log.notes,
        createdAt: new Date(Date.now() - log.daysAgo * 86_400_000),
      },
    });
  }
  console.log(`  ✓ Work Order Logs: ${logs.length}`);

  // ─── BOM (Bill of Materials) ──────────────────────────────────
  const bom1 = await prisma.bOM.create({ data: { workspaceId: workspace.id, productId: products[0]!.id, version: '2.1' } });
  await prisma.bOMLine.create({ data: { workspaceId: workspace.id, bomId: bom1.id, componentProductId: products[5]!.id, quantity: 2.0, unit: 'pcs', scrapPercent: 2 } });

  const bom2 = await prisma.bOM.create({ data: { workspaceId: workspace.id, productId: products[2]!.id, version: '1.0' } });
  await prisma.bOMLine.create({ data: { workspaceId: workspace.id, bomId: bom2.id, componentProductId: products[5]!.id, quantity: 1.0, unit: 'pcs', scrapPercent: 1 } });

  console.log('  ✓ BOMs: 2');

  console.log('\n✅ Production seed complete!\n');
  console.log('   Breakdown:');
  console.log(`   • 6  Products  (valve, panel, bracket, heat exchanger, actuator, flange)`);
  console.log(`   • 5  Sales Orders  (SO-2025-001 → 005)`);
  console.log(`   • 12 Work Orders  (pending × 2, released × 2, in_progress × 2, qc × 2, completed × 2, cancelled × 1)`);
  console.log(`   • ${logs.length} Activity Logs`);
  console.log('   • 2  BOMs with BOM lines\n');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
