# Fix all duplicate index names in schema.ts
$file = "drizzle/schema.ts"
$content = Get-Content $file -Raw

# Assignments table indexes
$content = $content -replace '(?<=export const assignments = pgTable.*?)jobIdx: index\("job_idx"\)', 'jobIdx: index("assignments_job_idx")'
$content = $content -replace '(?<=export const assignments = pgTable.*?)workerIdx: index\("worker_idx"\)', 'workerIdx: index("assignments_worker_idx")'
$content = $content -replace '(?<=export const assignments = pgTable.*?)companyIdx: index\("company_idx"\)', 'companyIdx: index("assignments_company_idx")'
$content = $content -replace '(?<=export const assignments = pgTable.*?)sponsorIdx: index\("sponsor_idx"\)', 'sponsorIdx: index("assignments_sponsor_idx")'
$content = $content -replace '(?<=export const assignments = pgTable.*?)statusIdx: index\("status_idx"\)', 'statusIdx: index("assignments_status_idx")'
$content = $content -replace '(?<=export const assignments = pgTable.*?)paymentIdx: index\("payment_idx"\)', 'paymentIdx: index("assignments_payment_idx")'

# Approvals table indexes
$content = $content -replace '(?<=export const approvals = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', 'assignmentIdx: index("approvals_assignment_idx")'
$content = $content -replace '(?<=export const approvals = pgTable.*?)sponsorIdx: index\("sponsor_idx"\)', 'sponsorIdx: index("approvals_sponsor_idx")'
$content = $content -replace '(?<=export const approvals = pgTable.*?)statusIdx: index\("status_idx"\)', 'statusIdx: index("approvals_status_idx")'

# ComplianceChecks table indexes
$content = $content -replace '(?<=export const complianceChecks = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', 'assignmentIdx: index("compliance_checks_assignment_idx")'
$content = $content -replace '(?<=export const complianceChecks = pgTable.*?)checkTypeIdx: index\("check_type_idx"\)', 'checkTypeIdx: index("compliance_checks_check_type_idx")'
$content = $content -replace '(?<=export const complianceChecks = pgTable.*?)statusIdx: index\("status_idx"\)', 'statusIdx: index("compliance_checks_status_idx")'

# AuditLogs table indexes
$content = $content -replace '(?<=export const auditLogs = pgTable.*?)entityIdx: index\("entity_idx"\)', 'entityIdx: index("audit_logs_entity_idx")'
$content = $content -replace '(?<=export const auditLogs = pgTable.*?)performedByIdx: index\("performed_by_idx"\)', 'performedByIdx: index("audit_logs_performed_by_idx")'
$content = $content -replace '(?<=export const auditLogs = pgTable.*?)timestampIdx: index\("timestamp_idx"\)', 'timestampIdx: index("audit_logs_timestamp_idx")'

# Transactions table indexes
$content = $content -replace '(?<=export const transactions = pgTable.*?)assignmentIdx: index\("assignment_idx"\)', 'assignmentIdx: index("transactions_assignment_idx")'
$content = $content -replace '(?<=export const transactions = pgTable.*?)statusIdx: index\("status_idx"\)', 'statusIdx: index("transactions_status_idx")'
$content = $content -replace '(?<=export const transactions = pgTable.*?)typeIdx: index\("type_idx"\)', 'typeIdx: index("transactions_type_idx")'
$content = $content -replace '(?<=export const transactions = pgTable.*?)fromCompanyIdx: index\("from_company_idx"\)', 'fromCompanyIdx: index("transactions_from_company_idx")'
$content = $content -replace '(?<=export const transactions = pgTable.*?)toWorkerIdx: index\("to_worker_idx"\)', 'toWorkerIdx: index("transactions_to_worker_idx")'

# Notifications table indexes
$content = $content -replace '(?<=export const notifications = pgTable.*?)userIdx: index\("user_idx"\)', 'userIdx: index("notifications_user_idx")'
$content = $content -replace '(?<=export const notifications = pgTable.*?)isReadIdx: index\("is_read_idx"\)', 'isReadIdx: index("notifications_is_read_idx")'
$content = $content -replace '(?<=export const notifications = pgTable.*?)typeIdx: index\("type_idx"\)', 'typeIdx: index("notifications_type_idx")'

# WorkerAvailability table indexes
$content = $content -replace '(?<=export const workerAvailability = pgTable.*?)workerIdx: index\("worker_idx"\)', 'workerIdx: index("worker_availability_worker_idx")'
$content = $content -replace '(?<=export const workerAvailability = pgTable.*?)dayIdx: index\("day_idx"\)', 'dayIdx: index("worker_availability_day_idx")'

# CompanyAdmins table indexes
$content = $content -replace '(?<=export const companyAdmins = pgTable.*?)companyIdx: index\("company_idx"\)', 'companyIdx: index("company_admins_company_idx")'
$content = $content -replace '(?<=export const companyAdmins = pgTable.*?)userIdx: index\("user_idx"\)', 'userIdx: index("company_admins_user_idx")'

# AnalyticsSnapshots table indexes
$content = $content -replace '(?<=export const analyticsSnapshots = pgTable.*?)dateIdx: index\("date_idx"\)', 'dateIdx: index("analytics_snapshots_date_idx")'
$content = $content -replace '(?<=export const analyticsSnapshots = pgTable.*?)metricIdx: index\("metric_idx"\)', 'metricIdx: index("analytics_snapshots_metric_idx")'
$content = $content -replace '(?<=export const analyticsSnapshots = pgTable.*?)sectorIdx: index\("sector_idx"\)', 'sectorIdx: index("analytics_snapshots_sector_idx")'

$content | Set-Content $file
Write-Host "Fixed all duplicate index names!"
