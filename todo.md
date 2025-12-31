# Blue Collar Marketplace - Development TODO

## Phase 1: Database Schema & Core Models
- [x] Design and implement users table with role-based access (worker, company_admin, sponsor, regulator, super_admin)
- [x] Create companies table with Qiwa/Ajeer integration fields
- [x] Create workers table with profile, skills, verification status
- [x] Create jobs table with requirements, scheduling, compliance fields
- [x] Create assignments table linking workers to jobs with approval workflow
- [x] Create approvals table for sponsor approval tracking
- [x] Create compliance_checks table for automated validation logs
- [x] Create transactions table for payroll and settlement tracking
- [x] Create audit_logs table for immutable regulatory records
- [x] Create notifications table for alerts and communications

## Phase 2: Authentication & Authorization
- [x] Extend user authentication with role-based access control
- [x] Implement company admin role and permissions
- [x] Implement worker role and permissions
- [x] Implement sponsor role and permissions
- [x] Implement regulator role and permissions
- [x] Implement super admin role and permissions
- [x] Create middleware for role-based route protection

## Phase 3: Company Management Features
- [x] Company registration and profile management
- [ ] Company dashboard with overview statistics
- [ ] Job posting interface with compliance requirements
- [ ] Worker search and discovery marketplace
- [ ] Assignment request workflow
- [ ] Contract generation and digital signing
- [ ] Payroll management interface
- [ ] Transaction history and reporting

## Phase 4: Worker Management Features
- [x] Worker registration and profile setup
- [ ] Skills and certifications management
- [ ] Availability calendar management
- [ ] Job browsing and search
- [ ] Assignment request submission
- [ ] Sponsor approval request workflow
- [ ] Active assignments dashboard
- [ ] Earnings and payment history

## Phase 5: Sponsor Features
- [ ] Sponsor dashboard with pending approvals
- [ ] Worker roster management
- [x] Approval/decline workflow for assignment requests
- [ ] Conditions and restrictions management
- [ ] Worker activity monitoring
- [ ] Compliance status overview

## Phase 6: Compliance Engine
- [x] Worker eligibility validation (Ajeer rules)
- [x] Visa validity verification
- [x] Company Nitaqat status check
- [x] Insurance status validation
- [x] Ajeer role matching logic
- [x] WPS compliance verification
- [x] Duration limits enforcement
- [x] Sector-specific rules validation
- [x] Block-first logic implementation at API level
- [x] Immutable audit logging for all transactions

## Phase 7: Regulator Dashboard
- [ ] Real-time monitoring dashboard
- [x] Active assignments overview with filters
- [ ] Compliance status analytics
- [ ] Suspicious pattern detection alerts
- [x] Full audit trail viewer
- [ ] Data export functionality
- [ ] Geographic heatmaps for workforce distribution
- [ ] Sector-wise analytics and trends

## Phase 8: Admin Panel
- [ ] Super admin dashboard
- [ ] User management (CRUD operations)
- [ ] Company verification and approval
- [ ] Worker verification and approval
- [ ] System configuration management
- [ ] Compliance rules configuration
- [ ] Analytics and reporting tools
- [ ] Notification management

## Phase 9: Payment & Settlement
- [ ] Wallet system implementation
- [ ] Payment processing integration
- [ ] Payroll calculation engine
- [ ] WPS-compliant settlement flows
- [x] Transaction fee calculation
- [ ] Invoice generation
- [x] Payment history and reconciliation

## Phase 10: Notifications & Alerts
- [x] Real-time notification system
- [ ] Email notifications
- [ ] SMS notifications (future)
- [ ] In-app notification center
- [x] Approval request alerts
- [x] Assignment status updates
- [ ] Compliance violation alerts
- [ ] Payment notifications

## Phase 11: Analytics & Reporting
- [ ] Company analytics dashboard
- [ ] Worker performance metrics
- [ ] Market trends and insights
- [ ] Supply-demand heatmaps
- [ ] Wage benchmarking reports
- [ ] Compliance statistics
- [ ] Revenue analytics for platform

## Phase 12: UI/UX & Design
- [x] Design system and color palette (professional blue theme)
- [ ] Bilingual support (Arabic/English) setup
- [ ] Responsive mobile-first design
- [ ] Company dashboard layout
- [ ] Worker dashboard layout
- [ ] Sponsor dashboard layout
- [ ] Regulator dashboard layout
- [ ] Admin panel layout
- [x] Landing page with value proposition
- [x] Authentication pages (login/register)
- [x] Fix landing page redirect issue

## Phase 13: Testing & Quality Assurance
- [ ] Unit tests for compliance engine
- [ ] Integration tests for assignment workflow
- [ ] API endpoint tests
- [ ] Role-based access control tests
- [ ] Payment processing tests
- [ ] Audit logging tests
- [ ] Performance testing
- [ ] Security testing

## Phase 14: Documentation
- [ ] API documentation
- [ ] User guides for each role
- [ ] Admin documentation
- [ ] Compliance rules documentation
- [ ] Deployment guide
- [ ] Database schema documentation

## Phase 15: Production Readiness
- [ ] Environment configuration
- [ ] Database optimization and indexing
- [ ] Caching strategy implementation
- [ ] Error handling and logging
- [ ] Security hardening
- [ ] Performance optimization
- [ ] Backup and recovery procedures
- [ ] Monitoring and alerting setup

## CRITICAL ARCHITECTURE CHANGE: Merge Sponsor + Company Roles
- [x] Update database schema to remove separate sponsor role
- [x] Merge sponsor and company_admin into unified company_admin role
- [x] Update all backend procedures to reflect unified role
- [x] Rebuild Company dashboard with dual functionality (post jobs + approve worker requests)
- [ ] Update worker approval workflow to request from company directly
- [ ] Revise user flows documentation
- [ ] Update all UI components to reflect new role structure
