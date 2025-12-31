import re

# Read the schema file
with open('drizzle/schema.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements for each table
replacements = [
    # Workers table
    (r'(export const workers = pgTable.*?)userIdx: index\("user_idx"\)', r'\1userIdx: index("workers_user_idx")'),
    (r'(export const workers = pgTable.*?)sponsorIdx: index\("sponsor_idx"\)', r'\1sponsorIdx: index("workers_sponsor_idx")'),
    (r'(export const workers = pgTable.*?)skillIdx: index\("skill_idx"\)', r'\1skillIdx: index("workers_skill_idx")'),
    (r'(export const workers = pgTable.*?)availabilityIdx: index\("availability_idx"\)', r'\1availabilityIdx: index("workers_availability_idx")'),
    
    # Jobs table
    (r'(export const jobs = pgTable.*?)companyIdx: index\("company_idx"\)', r'\1companyIdx: index("jobs_company_idx")'),
    (r'(export const jobs = pgTable.*?)statusIdx: index\("status_idx"\)', r'\1statusIdx: index("jobs_status_idx")'),
    (r'(export const jobs = pgTable.*?)sectorIdx: index\("sector_idx"\)', r'\1sectorIdx: index("jobs_sector_idx")'),
    (r'(export const jobs = pgTable.*?)startDateIdx: index\("start_date_idx"\)', r'\1startDateIdx: index("jobs_start_date_idx")'),
    
    # Assignments table
    (r'(export const assignments = pgTable.*?)jobIdx: index\("job_idx"\)', r'\1jobIdx: index("assignments_job_idx")'),
    (r'(export const assignments = pgTable.*?)workerIdx: index\("worker_idx"\)', r'\1workerIdx: index("assignments_worker_idx")'),
    (r'(export const assignments = pgTable.*?)companyIdx: index\("company_idx"\)', r'\1companyIdx: index("assignments_company_idx")'),
    (r'(export const assignments = pgTable.*?)sponsorIdx: index\("sponsor_idx"\)', r'\1sponsorIdx: index("assignments_sponsor_idx")'),
    (r'(export const assignments = pgTable.*?)statusIdx: index\("status_idx"\)', r'\1statusIdx: index("assignments_status_idx")'),
    (r'(export const assignments = pgTable.*?)paymentIdx: index\("payment_idx"\)', r'\1paymentIdx: index("assignments_payment_idx")'),
    
    # Approvals table
    (r'(export const approvals = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', r'\1assignmentIdx: index("approvals_assignment_idx")'),
    (r'(export const approvals = pgTable.*?)sponsorIdx: index\("sponsor_idx"\)', r'\1sponsorIdx: index("approvals_sponsor_idx")'),
    (r'(export const approvals = pgTable.*?)statusIdx: index\("status_idx"\)', r'\1statusIdx: index("approvals_status_idx")'),
    
    # ComplianceChecks table
    (r'(export const complianceChecks = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', r'\1assignmentIdx: index("compliance_checks_assignment_idx")'),
    (r'(export const complianceChecks = pgTable.*?)checkTypeIdx: index\("check_type_idx"\)', r'\1checkTypeIdx: index("compliance_checks_check_type_idx")'),
    (r'(export const complianceChecks = pgTable.*?)statusIdx: index\("status_idx"\)', r'\1statusIdx: index("compliance_checks_status_idx")'),
    
    # AuditLogs table
    (r'(export const auditLogs = pgTable.*?)entityIdx: index\("entity_idx"\)', r'\1entityIdx: index("audit_logs_entity_idx")'),
    (r'(export const auditLogs = pgTable.*?)performedByIdx: index\("performed_by_idx"\)', r'\1performedByIdx: index("audit_logs_performed_by_idx")'),
    (r'(export const auditLogs = pgTable.*?)timestampIdx: index\("timestamp_idx"\)', r'\1timestampIdx: index("audit_logs_timestamp_idx")'),
    
    # Transactions table
    (r'(export const transactions = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', r'\1assignmentIdx: index("transactions_assignment_idx")'),
    (r'(export const transactions = pgTable.*?)statusIdx: index\("status_idx"\)', r'\1statusIdx: index("transactions_status_idx")'),
    (r'(export const transactions = pgTable.*?)typeIdx: index\("type_idx"\)', r'\1typeIdx: index("transactions_type_idx")'),
    (r'(export const transactions = pgTable.*?)fromCompanyIdx: index\("from_company_idx"\)', r'\1fromCompanyIdx: index("transactions_from_company_idx")'),
    (r'(export const transactions = pgTable.*?)toWorkerIdx: index\("to_worker_idx"\)', r'\1toWorkerIdx: index("transactions_to_worker_idx")'),
    
    # Notifications table
    (r'(export const notifications = pgTable.*?)userIdx: index\("user_idx"\)', r'\1userIdx: index("notifications_user_idx")'),
    (r'(export const notifications = pgTable.*?)isReadIdx: index\("is_read_idx"\)', r'\1isReadIdx: index("notifications_is_read_idx")'),
    (r'(export const notifications = pgTable.*?)typeIdx: index\("type_idx"\)', r'\1typeIdx: index("notifications_type_idx")'),
    
    # WorkerAvailability table
    (r'(export const workerAvailability = pgTable.*?)workerIdx: index\("worker_idx"\)', r'\1workerIdx: index("worker_availability_worker_idx")'),
    (r'(export const workerAvailability = pgTable.*?)dayIdx: index\("day_idx"\)', r'\1dayIdx: index("worker_availability_day_idx")'),
    
    # CompanyAdmins table
    (r'(export const companyAdmins = pgTable.*?)companyIdx: index\("company_idx"\)', r'\1companyIdx: index("company_admins_company_idx")'),
    (r'(export const companyAdmins = pgTable.*?)userIdx: index\("user_idx"\)', r'\1userIdx: index("company_admins_user_idx")'),
    
    # AnalyticsSnapshots table
    (r'(export const analyticsSnapshots = pgTable.*?)dateIdx: index\("date_idx"\)', r'\1dateIdx: index("analytics_snapshots_date_idx")'),
    (r'(export const analyticsSnapshots = pgTable.*?)metricIdx: index\("metric_idx"\)', r'\1metricIdx: index("analytics_snapshots_metric_idx")'),
    (r'(export const analyticsSnapshots = pgTable.*?)sectorIdx: index\("sector_idx"\)', r'\1sectorIdx: index("analytics_snapshots_sector_idx")'),
]

# Apply all replacements
for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# Write back
with open('drizzle/schema.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed all duplicate index names!")
print("All indexes now have table-specific prefixes.")
