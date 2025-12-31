-- BlueShift Database Schema Migration for Supabase PostgreSQL
-- Generated from drizzle schema

-- Create all enums first
CREATE TYPE role AS ENUM ('worker', 'company_admin', 'sponsor', 'regulator', 'super_admin');
CREATE TYPE nitaqat_status AS ENUM ('platinum', 'green', 'yellow', 'red');
CREATE TYPE subscription_tier AS ENUM ('basic', 'pro', 'enterprise');
CREATE TYPE wps_status AS ENUM ('compliant', 'non_compliant', 'pending');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'filled', 'cancelled', 'completed');
CREATE TYPE wage_type AS ENUM ('hourly', 'daily', 'fixed');
CREATE TYPE assignment_status AS ENUM ('pending_sponsor_approval', 'sponsor_approved', 'sponsor_declined', 'contract_generated', 'active', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'declined');
CREATE TYPE check_type AS ENUM ('worker_eligibility', 'visa_validity', 'company_nitaqat', 'insurance_status', 'ajeer_role_match', 'wps_compliance', 'duration_limits', 'sector_rules');
CREATE TYPE check_status AS ENUM ('passed', 'failed', 'warning');
CREATE TYPE transaction_type AS ENUM ('platform_fee', 'worker_payment', 'company_charge', 'refund');
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM ('approval_request', 'approval_response', 'assignment_update', 'payment_received', 'compliance_alert', 'system_announcement');
CREATE TYPE company_admin_role AS ENUM ('owner', 'admin', 'manager');

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  phone VARCHAR(20),
  "loginMethod" VARCHAR(64),
  role role NOT NULL DEFAULT 'worker',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "lastSignedIn" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX users_role_idx ON users(role);
CREATE INDEX users_email_idx ON users(email);

-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "nameAr" TEXT,
  "crNumber" VARCHAR(50) NOT NULL UNIQUE,
  "qiwaId" VARCHAR(100) UNIQUE,
  "nitaqatStatus" nitaqat_status,
  sector VARCHAR(100),
  industry VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  "contactEmail" VARCHAR(320),
  "contactPhone" VARCHAR(20),
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "subscriptionTier" subscription_tier DEFAULT 'basic',
  "createdById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX companies_qiwa_idx ON companies("qiwaId");
CREATE INDEX companies_sector_idx ON companies(sector);
CREATE INDEX companies_nitaqat_idx ON companies("nitaqatStatus");

-- Workers table
CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL UNIQUE,
  "sponsorCompanyId" INTEGER NOT NULL,
  "nafathId" VARCHAR(100) UNIQUE,
  "iqamaNumber" VARCHAR(50) UNIQUE,
  nationality VARCHAR(50),
  "dateOfBirth" TIMESTAMP,
  "visaType" VARCHAR(50),
  "visaExpiryDate" TIMESTAMP,
  "ajeerRoleId" VARCHAR(100),
  "primarySkill" VARCHAR(100),
  skills JSONB,
  certifications JSONB,
  experience INTEGER,
  "insuranceNumber" VARCHAR(100),
  "insuranceExpiryDate" TIMESTAMP,
  "wpsStatus" wps_status DEFAULT 'pending',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "profileCompleteness" INTEGER DEFAULT 0,
  rating NUMERIC(3, 2) DEFAULT 0.00,
  "totalAssignments" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX workers_user_idx ON workers("userId");
CREATE INDEX workers_sponsor_idx ON workers("sponsorCompanyId");
CREATE INDEX workers_skill_idx ON workers("primarySkill");
CREATE INDEX workers_availability_idx ON workers("isAvailable");

-- Jobs table
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  "companyId" INTEGER NOT NULL,
  title TEXT NOT NULL,
  "titleAr" TEXT,
  description TEXT NOT NULL,
  "descriptionAr" TEXT,
  "requiredSkills" JSONB,
  "requiredCertifications" JSONB,
  sector VARCHAR(100),
  "ajeerRoleRequired" VARCHAR(100),
  "workLocation" TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP NOT NULL,
  "workingHours" VARCHAR(100),
  "numberOfWorkers" INTEGER NOT NULL DEFAULT 1,
  "wageAmount" NUMERIC(10, 2) NOT NULL,
  "wageCurrency" VARCHAR(10) DEFAULT 'SAR',
  "wageType" wage_type DEFAULT 'hourly',
  status job_status NOT NULL DEFAULT 'draft',
  "postedById" INTEGER NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX jobs_company_idx ON jobs("companyId");
CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX jobs_sector_idx ON jobs(sector);
CREATE INDEX jobs_start_date_idx ON jobs("startDate");

-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  "jobId" INTEGER NOT NULL,
  "workerId" INTEGER NOT NULL,
  "companyId" INTEGER NOT NULL,
  "sponsorCompanyId" INTEGER NOT NULL,
  status assignment_status NOT NULL DEFAULT 'pending_sponsor_approval',
  "requestedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "approvedAt" TIMESTAMP,
  "startedAt" TIMESTAMP,
  "completedAt" TIMESTAMP,
  "contractUrl" TEXT,
  "wageAmount" NUMERIC(10, 2) NOT NULL,
  "platformFee" NUMERIC(10, 2) DEFAULT 0.00,
  "totalAmount" NUMERIC(10, 2) NOT NULL,
  "paymentStatus" payment_status DEFAULT 'pending',
  "workerRating" INTEGER,
  "workerReview" TEXT,
  "companyRating" INTEGER,
  "companyReview" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX assignments_job_idx ON assignments("jobId");
CREATE INDEX assignments_worker_idx ON assignments("workerId");
CREATE INDEX assignments_company_idx ON assignments("companyId");
CREATE INDEX assignments_sponsor_idx ON assignments("sponsorCompanyId");
CREATE INDEX assignments_status_idx ON assignments(status);
CREATE INDEX assignments_payment_idx ON assignments("paymentStatus");

-- Approvals table
CREATE TABLE approvals (
  id SERIAL PRIMARY KEY,
  "assignmentId" INTEGER NOT NULL UNIQUE,
  "sponsorCompanyId" INTEGER NOT NULL,
  "approvedById" INTEGER,
  status approval_status NOT NULL DEFAULT 'pending',
  conditions TEXT,
  notes TEXT,
  "requestedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "respondedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX approvals_assignment_idx ON approvals("assignmentId");
CREATE INDEX approvals_sponsor_idx ON approvals("sponsorCompanyId");
CREATE INDEX approvals_status_idx ON approvals(status);

-- Compliance Checks table
CREATE TABLE "complianceChecks" (
  id SERIAL PRIMARY KEY,
  "assignmentId" INTEGER NOT NULL,
  "checkType" check_type NOT NULL,
  status check_status NOT NULL,
  details JSONB,
  "errorMessage" TEXT,
  "checkedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX compliance_checks_assignment_idx ON "complianceChecks"("assignmentId");
CREATE INDEX compliance_checks_check_type_idx ON "complianceChecks"("checkType");
CREATE INDEX compliance_checks_status_idx ON "complianceChecks"(status);

-- Audit Logs table
CREATE TABLE "auditLogs" (
  id SERIAL PRIMARY KEY,
  "entityType" VARCHAR(50) NOT NULL,
  "entityId" INTEGER NOT NULL,
  action VARCHAR(100) NOT NULL,
  "performedById" INTEGER,
  "performedByRole" VARCHAR(50),
  changes JSONB,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_entity_idx ON "auditLogs"("entityType", "entityId");
CREATE INDEX audit_logs_performed_by_idx ON "auditLogs"("performedById");
CREATE INDEX audit_logs_timestamp_idx ON "auditLogs"(timestamp);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  "assignmentId" INTEGER NOT NULL,
  type transaction_type NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'SAR',
  "fromCompanyId" INTEGER,
  "toWorkerId" INTEGER,
  status transaction_status NOT NULL DEFAULT 'pending',
  "paymentMethod" VARCHAR(50),
  "transactionReference" VARCHAR(100) UNIQUE,
  "wpsReference" VARCHAR(100),
  notes TEXT,
  "processedAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX transactions_assignment_idx ON transactions("assignmentId");
CREATE INDEX transactions_status_idx ON transactions(status);
CREATE INDEX transactions_type_idx ON transactions(type);
CREATE INDEX transactions_from_company_idx ON transactions("fromCompanyId");
CREATE INDEX transactions_to_worker_idx ON transactions("toWorkerId");

-- Notifications table
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  "userId" INTEGER NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  "titleAr" TEXT,
  message TEXT NOT NULL,
  "messageAr" TEXT,
  "relatedEntityType" VARCHAR(50),
  "relatedEntityId" INTEGER,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "readAt" TIMESTAMP,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON notifications("userId");
CREATE INDEX notifications_is_read_idx ON notifications("isRead");
CREATE INDEX notifications_type_idx ON notifications(type);

-- Worker Availability table
CREATE TABLE "workerAvailability" (
  id SERIAL PRIMARY KEY,
  "workerId" INTEGER NOT NULL,
  "dayOfWeek" INTEGER NOT NULL,
  "startTime" VARCHAR(5) NOT NULL,
  "endTime" VARCHAR(5) NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX worker_availability_worker_idx ON "workerAvailability"("workerId");
CREATE INDEX worker_availability_day_idx ON "workerAvailability"("dayOfWeek");

-- Company Admins table
CREATE TABLE "companyAdmins" (
  id SERIAL PRIMARY KEY,
  "companyId" INTEGER NOT NULL,
  "userId" INTEGER NOT NULL,
  role company_admin_role NOT NULL DEFAULT 'admin',
  permissions JSONB,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE("companyId", "userId")
);

CREATE INDEX company_admins_company_idx ON "companyAdmins"("companyId");
CREATE INDEX company_admins_user_idx ON "companyAdmins"("userId");

-- Analytics Snapshots table
CREATE TABLE "analyticsSnapshots" (
  id SERIAL PRIMARY KEY,
  "snapshotDate" TIMESTAMP NOT NULL,
  "metricType" VARCHAR(100) NOT NULL,
  sector VARCHAR(100),
  region VARCHAR(100),
  data JSONB NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX analytics_snapshots_date_idx ON "analyticsSnapshots"("snapshotDate");
CREATE INDEX analytics_snapshots_metric_idx ON "analyticsSnapshots"("metricType");
CREATE INDEX analytics_snapshots_sector_idx ON "analyticsSnapshots"(sector);
