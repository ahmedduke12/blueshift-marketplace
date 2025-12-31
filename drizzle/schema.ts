import { serial, pgEnum, pgTable, text, timestamp, varchar, numeric, boolean, json, index, unique, integer } from "drizzle-orm/pg-core";

/**
 * Blue Collar Marketplace Database Schema
 * Qiwa-powered B2B marketplace for compliant temporary labor mobility
 * PostgreSQL version for Supabase
 */

// ============================================================================
// ENUMS
// ============================================================================

export const roleEnum = pgEnum("role", ["worker", "company_admin", "sponsor", "regulator", "super_admin"]);
export const nitaqatStatusEnum = pgEnum("nitaqat_status", ["platinum", "green", "yellow", "red"]);
export const subscriptionTierEnum = pgEnum("subscription_tier", ["basic", "pro", "enterprise"]);
export const wpsStatusEnum = pgEnum("wps_status", ["compliant", "non_compliant", "pending"]);
export const jobStatusEnum = pgEnum("job_status", ["draft", "active", "filled", "cancelled", "completed"]);
export const wageTypeEnum = pgEnum("wage_type", ["hourly", "daily", "fixed"]);
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "pending_sponsor_approval",
  "sponsor_approved",
  "sponsor_declined",
  "contract_generated",
  "active",
  "completed",
  "cancelled"
]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "processing", "completed", "failed"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "declined"]);
export const checkTypeEnum = pgEnum("check_type", [
  "worker_eligibility",
  "visa_validity",
  "company_nitaqat",
  "insurance_status",
  "ajeer_role_match",
  "wps_compliance",
  "duration_limits",
  "sector_rules"
]);
export const checkStatusEnum = pgEnum("check_status", ["passed", "failed", "warning"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["platform_fee", "worker_payment", "company_charge", "refund"]);
export const transactionStatusEnum = pgEnum("transaction_status", ["pending", "processing", "completed", "failed", "refunded"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "approval_request",
  "approval_response",
  "assignment_update",
  "payment_received",
  "compliance_alert",
  "system_announcement"
]);
export const companyAdminRoleEnum = pgEnum("company_admin_role", ["owner", "admin", "manager"]);

// ============================================================================
// USERS & AUTHENTICATION
// ============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("worker").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("users_role_idx").on(table.role),
  emailIdx: index("users_email_idx").on(table.email),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================================
// COMPANIES (Demand Side)
// ============================================================================

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("nameAr"),
  crNumber: varchar("crNumber", { length: 50 }).notNull().unique(),
  qiwaId: varchar("qiwaId", { length: 100 }).unique(),
  nitaqatStatus: nitaqatStatusEnum("nitaqatStatus"),
  sector: varchar("sector", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 20 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  subscriptionTier: subscriptionTierEnum("subscriptionTier").default("basic"),
  createdById: integer("createdById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  qiwaIdx: index("companies_qiwa_idx").on(table.qiwaId),
  sectorIdx: index("companies_sector_idx").on(table.sector),
  nitaqatIdx: index("companies_nitaqat_idx").on(table.nitaqatStatus),
}));

export type Company = typeof companies.$inferSelect;
export type InsertCompany = typeof companies.$inferInsert;

// ============================================================================
// WORKERS (Supply Side)
// ============================================================================

export const workers = pgTable("workers", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull().unique(),
  sponsorCompanyId: integer("sponsorCompanyId").notNull(),
  nafathId: varchar("nafathId", { length: 100 }).unique(),
  iqamaNumber: varchar("iqamaNumber", { length: 50 }).unique(),
  nationality: varchar("nationality", { length: 50 }),
  dateOfBirth: timestamp("dateOfBirth"),
  visaType: varchar("visaType", { length: 50 }),
  visaExpiryDate: timestamp("visaExpiryDate"),
  ajeerRoleId: varchar("ajeerRoleId", { length: 100 }),
  primarySkill: varchar("primarySkill", { length: 100 }),
  skills: json("skills").$type<string[]>(),
  certifications: json("certifications").$type<{ name: string; issuer: string; expiryDate: string | null }[]>(),
  experience: integer("experience"),
  insuranceNumber: varchar("insuranceNumber", { length: 100 }),
  insuranceExpiryDate: timestamp("insuranceExpiryDate"),
  wpsStatus: wpsStatusEnum("wpsStatus").default("pending"),
  isVerified: boolean("isVerified").default(false).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  profileCompleteness: integer("profileCompleteness").default(0),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("0.00"),
  totalAssignments: integer("totalAssignments").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("workers_user_idx").on(table.userId),
  sponsorIdx: index("workers_sponsor_idx").on(table.sponsorCompanyId),
  skillIdx: index("workers_skill_idx").on(table.primarySkill),
  availabilityIdx: index("workers_availability_idx").on(table.isAvailable),
}));

export type Worker = typeof workers.$inferSelect;
export type InsertWorker = typeof workers.$inferInsert;

// ============================================================================
// JOBS (Demand Postings)
// ============================================================================

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  title: text("title").notNull(),
  titleAr: text("titleAr"),
  description: text("description").notNull(),
  descriptionAr: text("descriptionAr"),
  requiredSkills: json("requiredSkills").$type<string[]>(),
  requiredCertifications: json("requiredCertifications").$type<string[]>(),
  sector: varchar("sector", { length: 100 }),
  ajeerRoleRequired: varchar("ajeerRoleRequired", { length: 100 }),
  workLocation: text("workLocation"),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  workingHours: varchar("workingHours", { length: 100 }),
  numberOfWorkers: integer("numberOfWorkers").default(1).notNull(),
  wageAmount: numeric("wageAmount", { precision: 10, scale: 2 }).notNull(),
  wageCurrency: varchar("wageCurrency", { length: 10 }).default("SAR"),
  wageType: wageTypeEnum("wageType").default("hourly"),
  status: jobStatusEnum("status").default("draft").notNull(),
  postedById: integer("postedById").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  companyIdx: index("jobs_company_idx").on(table.companyId),
  statusIdx: index("jobs_status_idx").on(table.status),
  sectorIdx: index("jobs_sector_idx").on(table.sector),
  startDateIdx: index("jobs_start_date_idx").on(table.startDate),
}));

export type Job = typeof jobs.$inferSelect;
export type InsertJob = typeof jobs.$inferInsert;

// ============================================================================
// ASSIGNMENTS (Worker-Job Matching)
// ============================================================================

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  jobId: integer("jobId").notNull(),
  workerId: integer("workerId").notNull(),
  companyId: integer("companyId").notNull(),
  sponsorCompanyId: integer("sponsorCompanyId").notNull(),
  status: assignmentStatusEnum("status").default("pending_sponsor_approval").notNull(),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  approvedAt: timestamp("approvedAt"),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  contractUrl: text("contractUrl"),
  wageAmount: numeric("wageAmount", { precision: 10, scale: 2 }).notNull(),
  platformFee: numeric("platformFee", { precision: 10, scale: 2 }).default("0.00"),
  totalAmount: numeric("totalAmount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum("paymentStatus").default("pending"),
  workerRating: integer("workerRating"),
  workerReview: text("workerReview"),
  companyRating: integer("companyRating"),
  companyReview: text("companyReview"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  jobIdx: index("assignments_job_idx").on(table.jobId),
  workerIdx: index("assignments_worker_idx").on(table.workerId),
  companyIdx: index("assignments_company_idx").on(table.companyId),
  sponsorIdx: index("assignments_sponsor_idx").on(table.sponsorCompanyId),
  statusIdx: index("assignments_status_idx").on(table.status),
  paymentIdx: index("assignments_payment_idx").on(table.paymentStatus),
}));

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = typeof assignments.$inferInsert;

// ============================================================================
// APPROVALS (Sponsor Approval Workflow)
// ============================================================================

export const approvals = pgTable("approvals", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignmentId").notNull().unique(),
  sponsorCompanyId: integer("sponsorCompanyId").notNull(),
  approvedById: integer("approvedById"),
  status: approvalStatusEnum("status").default("pending").notNull(),
  conditions: text("conditions"),
  notes: text("notes"),
  requestedAt: timestamp("requestedAt").defaultNow().notNull(),
  respondedAt: timestamp("respondedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  assignmentIdx: index("approvals_assignment_idx").on(table.assignmentId),
  sponsorIdx: index("approvals_sponsor_idx").on(table.sponsorCompanyId),
  statusIdx: index("approvals_status_idx").on(table.status),
}));

export type Approval = typeof approvals.$inferSelect;
export type InsertApproval = typeof approvals.$inferInsert;

// ============================================================================
// COMPLIANCE CHECKS (Automated Validation)
// ============================================================================

export const complianceChecks = pgTable("complianceChecks", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignmentId").notNull(),
  checkType: checkTypeEnum("checkType").notNull(),
  status: checkStatusEnum("status").notNull(),
  details: json("details").$type<Record<string, any>>(),
  errorMessage: text("errorMessage"),
  checkedAt: timestamp("checkedAt").defaultNow().notNull(),
}, (table) => ({
  assignmentIdx: index("compliance_checks_assignment_idx").on(table.assignmentId),
  checkTypeIdx: index("compliance_checks_check_type_idx").on(table.checkType),
  statusIdx: index("compliance_checks_status_idx").on(table.status),
}));

export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type InsertComplianceCheck = typeof complianceChecks.$inferInsert;

// ============================================================================
// AUDIT LOGS (Immutable Regulatory Records)
// ============================================================================

export const auditLogs = pgTable("auditLogs", {
  id: serial("id").primaryKey(),
  entityType: varchar("entityType", { length: 50 }).notNull(),
  entityId: integer("entityId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  performedById: integer("performedById"),
  performedByRole: varchar("performedByRole", { length: 50 }),
  changes: json("changes").$type<Record<string, any>>(),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
}, (table) => ({
  entityIdx: index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  performedByIdx: index("audit_logs_performed_by_idx").on(table.performedById),
  timestampIdx: index("audit_logs_timestamp_idx").on(table.timestamp),
}));

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// ============================================================================
// TRANSACTIONS (Payroll & Settlement)
// ============================================================================

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignmentId").notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  fromCompanyId: integer("fromCompanyId"),
  toWorkerId: integer("toWorkerId"),
  status: transactionStatusEnum("status").default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionReference: varchar("transactionReference", { length: 100 }).unique(),
  wpsReference: varchar("wpsReference", { length: 100 }),
  notes: text("notes"),
  processedAt: timestamp("processedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  assignmentIdx: index("transactions_assignment_idx").on(table.assignmentId),
  statusIdx: index("transactions_status_idx").on(table.status),
  typeIdx: index("transactions_type_idx").on(table.type),
  fromCompanyIdx: index("transactions_from_company_idx").on(table.fromCompanyId),
  toWorkerIdx: index("transactions_to_worker_idx").on(table.toWorkerId),
}));

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  titleAr: text("titleAr"),
  message: text("message").notNull(),
  messageAr: text("messageAr"),
  relatedEntityType: varchar("relatedEntityType", { length: 50 }),
  relatedEntityId: integer("relatedEntityId"),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("notifications_user_idx").on(table.userId),
  isReadIdx: index("notifications_is_read_idx").on(table.isRead),
  typeIdx: index("notifications_type_idx").on(table.type),
}));

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ============================================================================
// WORKER AVAILABILITY
// ============================================================================

export const workerAvailability = pgTable("workerAvailability", {
  id: serial("id").primaryKey(),
  workerId: integer("workerId").notNull(),
  dayOfWeek: integer("dayOfWeek").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  endTime: varchar("endTime", { length: 5 }).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  workerIdx: index("worker_availability_worker_idx").on(table.workerId),
  dayIdx: index("worker_availability_day_idx").on(table.dayOfWeek),
}));

export type WorkerAvailability = typeof workerAvailability.$inferSelect;
export type InsertWorkerAvailability = typeof workerAvailability.$inferInsert;

// ============================================================================
// COMPANY ADMINS (Many-to-Many)
// ============================================================================

export const companyAdmins = pgTable("companyAdmins", {
  id: serial("id").primaryKey(),
  companyId: integer("companyId").notNull(),
  userId: integer("userId").notNull(),
  role: companyAdminRoleEnum("role").default("admin").notNull(),
  permissions: json("permissions").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  companyUserUnique: unique("company_user_unique").on(table.companyId, table.userId),
  companyIdx: index("company_admins_company_idx").on(table.companyId),
  userIdx: index("company_admins_user_idx").on(table.userId),
}));

export type CompanyAdmin = typeof companyAdmins.$inferSelect;
export type InsertCompanyAdmin = typeof companyAdmins.$inferInsert;

// ============================================================================
// ANALYTICS SNAPSHOTS
// ============================================================================

export const analyticsSnapshots = pgTable("analyticsSnapshots", {
  id: serial("id").primaryKey(),
  snapshotDate: timestamp("snapshotDate").notNull(),
  metricType: varchar("metricType", { length: 100 }).notNull(),
  sector: varchar("sector", { length: 100 }),
  region: varchar("region", { length: 100 }),
  data: json("data").$type<Record<string, any>>().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  dateIdx: index("analytics_snapshots_date_idx").on(table.snapshotDate),
  metricIdx: index("analytics_snapshots_metric_idx").on(table.metricType),
  sectorIdx: index("analytics_snapshots_sector_idx").on(table.sector),
}));

export type AnalyticsSnapshot = typeof analyticsSnapshots.$inferSelect;
export type InsertAnalyticsSnapshot = typeof analyticsSnapshots.$inferInsert;


