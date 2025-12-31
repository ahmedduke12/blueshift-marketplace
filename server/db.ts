import { eq, and, desc, sql, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  InsertUser,
  users,
  companies,
  InsertCompany,
  workers,
  InsertWorker,
  jobs,
  InsertJob,
  assignments,
  InsertAssignment,
  approvals,
  InsertApproval,
  complianceChecks,
  InsertComplianceCheck,
  auditLogs,
  InsertAuditLog,
  transactions,
  InsertTransaction,
  notifications,
  InsertNotification,
  workerAvailability,
  InsertWorkerAvailability,
  companyAdmins,
  InsertCompanyAdmin,
  analyticsSnapshots,
  InsertAnalyticsSnapshot,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER QUERIES
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'super_admin';
      updateSet.role = 'super_admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(userId: number, role: "worker" | "company_admin" | "regulator" | "super_admin") {
  const db = await getDb();
  if (!db) return;

  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
}

// ============================================================================
// COMPANY QUERIES
// ============================================================================

export async function createCompany(company: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(companies).values(company);
  return result;
}

export async function getCompanyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(companies).where(eq(companies.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCompaniesByCreator(creatorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(companies).where(eq(companies.createdById, creatorId));
}

export async function updateCompany(id: number, updates: Partial<InsertCompany>) {
  const db = await getDb();
  if (!db) return;

  await db.update(companies).set({ ...updates, updatedAt: new Date() }).where(eq(companies.id, id));
}

export async function getCompaniesForAdmin(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const adminCompanies = await db
    .select({ companyId: companyAdmins.companyId })
    .from(companyAdmins)
    .where(eq(companyAdmins.userId, userId));

  if (adminCompanies.length === 0) return [];

  const companyIds = adminCompanies.map(ac => ac.companyId);
  return await db.select().from(companies).where(inArray(companies.id, companyIds));
}

// ============================================================================
// WORKER QUERIES
// ============================================================================

export async function createWorker(worker: InsertWorker) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(workers).values(worker);
  return result;
}

export async function getWorkerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(workers).where(eq(workers.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getWorkerByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(workers).where(eq(workers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getWorkersBySponsor(sponsorCompanyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(workers).where(eq(workers.sponsorCompanyId, sponsorCompanyId));
}

export async function updateWorker(id: number, updates: Partial<InsertWorker>) {
  const db = await getDb();
  if (!db) return;

  await db.update(workers).set({ ...updates, updatedAt: new Date() }).where(eq(workers.id, id));
}

export async function searchAvailableWorkers(filters: {
  skills?: string[];
  sector?: string;
  isAvailable?: boolean;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(workers);

  const conditions = [];
  if (filters.isAvailable !== undefined) {
    conditions.push(eq(workers.isAvailable, filters.isAvailable));
  }

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }

  return await query.limit(filters.limit || 50);
}

// ============================================================================
// JOB QUERIES
// ============================================================================

export async function createJob(job: InsertJob) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(jobs).values(job);
  return result;
}

export async function getJobById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getJobsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(jobs).where(eq(jobs.companyId, companyId)).orderBy(desc(jobs.createdAt));
}

export async function getActiveJobs(filters?: { sector?: string; city?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(jobs.status, "active")];

  if (filters?.sector) {
    conditions.push(eq(jobs.sector, filters.sector));
  }
  if (filters?.city) {
    conditions.push(eq(jobs.city, filters.city));
  }

  return await db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.createdAt))
    .limit(filters?.limit || 50);
}

export async function updateJob(id: number, updates: Partial<InsertJob>) {
  const db = await getDb();
  if (!db) return;

  await db.update(jobs).set({ ...updates, updatedAt: new Date() }).where(eq(jobs.id, id));
}

// ============================================================================
// ASSIGNMENT QUERIES
// ============================================================================

export async function createAssignment(assignment: InsertAssignment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(assignments).values(assignment).returning();
  return result[0];
}

export async function getAssignmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAssignmentsByWorker(workerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assignments).where(eq(assignments.workerId, workerId)).orderBy(desc(assignments.createdAt));
}

export async function getAssignmentsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assignments).where(eq(assignments.companyId, companyId)).orderBy(desc(assignments.createdAt));
}

export async function getAssignmentsBySponsor(sponsorCompanyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(assignments).where(eq(assignments.sponsorCompanyId, sponsorCompanyId)).orderBy(desc(assignments.createdAt));
}

export async function getPendingApprovals(sponsorCompanyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(assignments)
    .where(
      and(
        eq(assignments.sponsorCompanyId, sponsorCompanyId),
        eq(assignments.status, "pending_sponsor_approval")
      )
    )
    .orderBy(desc(assignments.requestedAt));
}

export async function updateAssignment(id: number, updates: Partial<InsertAssignment>) {
  const db = await getDb();
  if (!db) return;

  await db.update(assignments).set({ ...updates, updatedAt: new Date() }).where(eq(assignments.id, id));
}

// ============================================================================
// APPROVAL QUERIES
// ============================================================================

export async function createApproval(approval: InsertApproval) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(approvals).values(approval);
  return result;
}

export async function getApprovalByAssignment(assignmentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(approvals).where(eq(approvals.assignmentId, assignmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateApproval(id: number, updates: Partial<InsertApproval>) {
  const db = await getDb();
  if (!db) return;

  await db.update(approvals).set({ ...updates, updatedAt: new Date() }).where(eq(approvals.id, id));
}

// ============================================================================
// COMPLIANCE CHECK QUERIES
// ============================================================================

export async function createComplianceCheck(check: InsertComplianceCheck) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(complianceChecks).values(check);
  return result;
}

export async function getComplianceChecksByAssignment(assignmentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(complianceChecks).where(eq(complianceChecks.assignmentId, assignmentId));
}

// ============================================================================
// AUDIT LOG QUERIES
// ============================================================================

export async function createAuditLog(log: InsertAuditLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(auditLogs).values(log);
  return result;
}

export async function getAuditLogsByEntity(entityType: string, entityId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(auditLogs)
    .where(and(eq(auditLogs.entityType, entityType), eq(auditLogs.entityId, entityId)))
    .orderBy(desc(auditLogs.timestamp));
}

export async function getRecentAuditLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
}

// ============================================================================
// TRANSACTION QUERIES
// ============================================================================

export async function createTransaction(transaction: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(transactions).values(transaction);
  return result;
}

export async function getTransactionsByAssignment(assignmentId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(transactions).where(eq(transactions.assignmentId, assignmentId));
}

export async function getTransactionsByCompany(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(transactions).where(eq(transactions.fromCompanyId, companyId)).orderBy(desc(transactions.createdAt));
}

export async function getTransactionsByWorker(workerId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(transactions).where(eq(transactions.toWorkerId, workerId)).orderBy(desc(transactions.createdAt));
}

// ============================================================================
// NOTIFICATION QUERIES
// ============================================================================

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notifications).values(notification);
  return result;
}

export async function getNotificationsByUser(userId: number, unreadOnly: boolean = false) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(notifications.userId, userId)];
  if (unreadOnly) {
    conditions.push(eq(notifications.isRead, false));
  }

  return await db
    .select()
    .from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function markNotificationAsRead(id: number) {
  const db = await getDb();
  if (!db) return;

  await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(userId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(notifications)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

// ============================================================================
// COMPANY ADMIN QUERIES
// ============================================================================

export async function addCompanyAdmin(admin: InsertCompanyAdmin) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(companyAdmins).values(admin);
  return result;
}

export async function getCompanyAdmins(companyId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(companyAdmins).where(eq(companyAdmins.companyId, companyId));
}

export async function isUserCompanyAdmin(userId: number, companyId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(companyAdmins)
    .where(and(eq(companyAdmins.userId, userId), eq(companyAdmins.companyId, companyId)))
    .limit(1);

  return result.length > 0;
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export async function createAnalyticsSnapshot(snapshot: InsertAnalyticsSnapshot) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(analyticsSnapshots).values(snapshot);
  return result;
}

export async function getAnalyticsSnapshots(metricType: string, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(analyticsSnapshots)
    .where(
      and(
        eq(analyticsSnapshots.metricType, metricType),
        gte(analyticsSnapshots.snapshotDate, startDate),
        lte(analyticsSnapshots.snapshotDate, endDate)
      )
    )
    .orderBy(desc(analyticsSnapshots.snapshotDate));
}

// ============================================================================
// DASHBOARD STATISTICS
// ============================================================================

export async function getDashboardStats(companyId: number) {
  const db = await getDb();
  if (!db) return null;

  const [activeJobsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(jobs)
    .where(and(eq(jobs.companyId, companyId), eq(jobs.status, "active")));

  const [activeAssignmentsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(assignments)
    .where(and(eq(assignments.companyId, companyId), eq(assignments.status, "active")));

  const [pendingApprovalsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(assignments)
    .where(and(eq(assignments.sponsorCompanyId, companyId), eq(assignments.status, "pending_sponsor_approval")));

  return {
    activeJobs: activeJobsCount?.count || 0,
    activeAssignments: activeAssignmentsCount?.count || 0,
    pendingApprovals: pendingApprovalsCount?.count || 0,
  };
}

export async function getWorkerDashboardStats(workerId: number) {
  const db = await getDb();
  if (!db) return null;

  const [activeAssignmentsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(assignments)
    .where(and(eq(assignments.workerId, workerId), eq(assignments.status, "active")));

  const [completedAssignmentsCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(assignments)
    .where(and(eq(assignments.workerId, workerId), eq(assignments.status, "completed")));

  const [totalEarnings] = await db
    .select({ total: sql<number>`sum(${transactions.amount})` })
    .from(transactions)
    .where(and(eq(transactions.toWorkerId, workerId), eq(transactions.status, "completed")));

  return {
    activeAssignments: activeAssignmentsCount?.count || 0,
    completedAssignments: completedAssignmentsCount?.count || 0,
    totalEarnings: totalEarnings?.total || 0,
  };
}
