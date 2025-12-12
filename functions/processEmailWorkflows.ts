import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const workflows = await base44.asServiceRole.entities.EmailWorkflow.filter({ active: true });
    let processed = 0;

    for (const workflow of workflows) {
      try {
        await processWorkflow(base44, workflow);
        processed++;
      } catch (error) {
        console.error(`Workflow ${workflow.id} error:`, error);
      }
    }

    return Response.json({ 
      success: true, 
      processed,
      message: `Processed ${processed} workflows` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function processWorkflow(base44, workflow) {
  const now = new Date();
  
  switch (workflow.type) {
    case 'abandoned_cart':
      await processAbandonedCart(base44, workflow, now);
      break;
    case 'post_purchase':
      await processPostPurchase(base44, workflow, now);
      break;
    case 'promotional':
      await processPromotional(base44, workflow, now);
      break;
    case 're_engagement':
      await processReEngagement(base44, workflow, now);
      break;
    case 'welcome':
      await processWelcome(base44, workflow, now);
      break;
  }
  
  await base44.asServiceRole.entities.EmailWorkflow.update(workflow.id, {
    lastRun: now.toISOString()
  });
}

async function processAbandonedCart(base44, workflow, now) {
  const delayMs = (workflow.trigger?.delayMinutes || 60) * 60 * 1000;
  const cutoffDate = new Date(now.getTime() - delayMs);
  
  const customers = await base44.asServiceRole.entities.Customer.list();
  
  for (const customer of customers) {
    const hasRecentOrder = false;
    
    if (!hasRecentOrder && shouldSendToSegment(customer, workflow.segmentation)) {
      await sendWorkflowEmail(base44, customer.email, workflow);
    }
  }
}

async function processPostPurchase(base44, workflow, now) {
  const delayMs = (workflow.trigger?.delayMinutes || 1440) * 60 * 1000;
  const cutoffDate = new Date(now.getTime() - delayMs);
  
  const orders = await base44.asServiceRole.entities.Order.filter({
    status: 'delivered',
    updated_date: { $gte: cutoffDate.toISOString(), $lt: now.toISOString() }
  });
  
  for (const order of orders) {
    if (shouldSendToSegment({ email: order.customerEmail }, workflow.segmentation)) {
      await sendWorkflowEmail(base44, order.customerEmail, workflow);
    }
  }
}

async function processPromotional(base44, workflow, now) {
  const customers = await base44.asServiceRole.entities.Customer.filter({
    status: 'active'
  });
  
  for (const customer of customers) {
    if (shouldSendToSegment(customer, workflow.segmentation)) {
      await sendWorkflowEmail(base44, customer.email, workflow);
    }
  }
}

async function processReEngagement(base44, workflow, now) {
  const inactiveDays = workflow.segmentation?.lastActivityDays || 30;
  const cutoffDate = new Date(now.getTime() - (inactiveDays * 24 * 60 * 60 * 1000));
  
  const customers = await base44.asServiceRole.entities.Customer.filter({
    lastContactDate: { $lt: cutoffDate.toISOString() }
  });
  
  for (const customer of customers) {
    if (shouldSendToSegment(customer, workflow.segmentation)) {
      await sendWorkflowEmail(base44, customer.email, workflow);
    }
  }
}

async function processWelcome(base44, workflow, now) {
  const delayMs = (workflow.trigger?.delayMinutes || 5) * 60 * 1000;
  const cutoffDate = new Date(now.getTime() - delayMs);
  
  const customers = await base44.asServiceRole.entities.Customer.filter({
    created_date: { $gte: cutoffDate.toISOString(), $lt: now.toISOString() }
  });
  
  for (const customer of customers) {
    await sendWorkflowEmail(base44, customer.email, workflow);
  }
}

function shouldSendToSegment(customer, segmentation) {
  if (!segmentation) return true;
  
  if (segmentation.customerStatus?.length > 0) {
    if (!segmentation.customerStatus.includes(customer.status)) {
      return false;
    }
  }
  
  return true;
}

async function sendWorkflowEmail(base44, toEmail, workflow) {
  try {
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: workflow.emailTemplate?.fromName || 'EzPay America',
      to: toEmail,
      subject: workflow.emailTemplate?.subject || workflow.name,
      body: workflow.emailTemplate?.content || ''
    });
    
    const currentStats = workflow.stats || {};
    await base44.asServiceRole.entities.EmailWorkflow.update(workflow.id, {
      stats: {
        ...currentStats,
        totalSent: (currentStats.totalSent || 0) + 1
      }
    });
  } catch (error) {
    console.error('Send email error:', error);
  }
}