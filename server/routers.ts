import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";

// ============================================================================
// COMPLIANCE ENGINE
// ============================================================================

async function runComplianceChecks(assignmentId: number, workerId: number, companyId: number, jobId: number) {
  const checks = [];

  // Get worker and company details
  const worker = await db.getWorkerById(workerId);
  const company = await db.getCompanyById(companyId);
  const job = await db.getJobById(jobId);

  if (!worker || !company || !job) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Required entities not found" });
  }

  // 1. Worker Eligibility Check
  const eligibilityCheck = {
    assignmentId,
    checkType: "worker_eligibility" as const,
    status: worker.isVerified ? "passed" as const : "failed" as const,
    details: { isVerified: worker.isVerified },
    errorMessage: worker.isVerified ? null : "Worker is not verified",
    checkedAt: new Date(),
  };
  checks.push(eligibilityCheck);
  await db.createComplianceCheck(eligibilityCheck);

  // 2. Visa Validity Check
  const visaValid = worker.visaExpiryDate && new Date(worker.visaExpiryDate) > new Date();
  const visaCheck = {
    assignmentId,
    checkType: "visa_validity" as const,
    status: visaValid ? "passed" as const : "failed" as const,
    details: { visaExpiryDate: worker.visaExpiryDate },
    errorMessage: visaValid ? null : "Worker visa has expired or is invalid",
    checkedAt: new Date(),
  };
  checks.push(visaCheck);
  await db.createComplianceCheck(visaCheck);

  // 3. Company Nitaqat Check
  const nitaqatValid = company.nitaqatStatus && ["platinum", "green"].includes(company.nitaqatStatus);
  const nitaqatCheck = {
    assignmentId,
    checkType: "company_nitaqat" as const,
    status: nitaqatValid ? "passed" as const : (company.nitaqatStatus === "yellow" ? "warning" as const : "failed" as const),
    details: { nitaqatStatus: company.nitaqatStatus },
    errorMessage: nitaqatValid ? null : "Company Nitaqat status is not compliant",
    checkedAt: new Date(),
  };
  checks.push(nitaqatCheck);
  await db.createComplianceCheck(nitaqatCheck);

  // 4. Insurance Status Check
  const insuranceValid = worker.insuranceExpiryDate && new Date(worker.insuranceExpiryDate) > new Date();
  const insuranceCheck = {
    assignmentId,
    checkType: "insurance_status" as const,
    status: insuranceValid ? "passed" as const : "failed" as const,
    details: { insuranceExpiryDate: worker.insuranceExpiryDate },
    errorMessage: insuranceValid ? null : "Worker insurance has expired",
    checkedAt: new Date(),
  };
  checks.push(insuranceCheck);
  await db.createComplianceCheck(insuranceCheck);

  // 5. Ajeer Role Match Check
  const roleMatch = !job.ajeerRoleRequired || worker.ajeerRoleId === job.ajeerRoleRequired;
  const roleCheck = {
    assignmentId,
    checkType: "ajeer_role_match" as const,
    status: roleMatch ? "passed" as const : "failed" as const,
    details: { workerRole: worker.ajeerRoleId, requiredRole: job.ajeerRoleRequired },
    errorMessage: roleMatch ? null : "Worker Ajeer role does not match job requirements",
    checkedAt: new Date(),
  };
  checks.push(roleCheck);
  await db.createComplianceCheck(roleCheck);

  // 6. WPS Compliance Check
  const wpsCheck = {
    assignmentId,
    checkType: "wps_compliance" as const,
    status: worker.wpsStatus === "compliant" ? "passed" as const : "failed" as const,
    details: { wpsStatus: worker.wpsStatus },
    errorMessage: worker.wpsStatus === "compliant" ? null : "Worker is not WPS compliant",
    checkedAt: new Date(),
  };
  checks.push(wpsCheck);
  await db.createComplianceCheck(wpsCheck);

  // 7. Duration Limits Check (max 90 days for temporary assignments)
  const duration = Math.ceil((new Date(job.endDate).getTime() - new Date(job.startDate).getTime()) / (1000 * 60 * 60 * 24));
  const durationCheck = {
    assignmentId,
    checkType: "duration_limits" as const,
    status: duration <= 90 ? "passed" as const : "warning" as const,
    details: { durationDays: duration },
    errorMessage: duration <= 90 ? null : "Assignment duration exceeds recommended 90-day limit",
    checkedAt: new Date(),
  };
  checks.push(durationCheck);
  await db.createComplianceCheck(durationCheck);

  // 8. Sector Rules Check
  const sectorMatch = !job.sector || worker.primarySkill?.toLowerCase().includes(job.sector.toLowerCase());
  const sectorCheck = {
    assignmentId,
    checkType: "sector_rules" as const,
    status: sectorMatch ? "passed" as const : "warning" as const,
    details: { workerSkill: worker.primarySkill, jobSector: job.sector },
    errorMessage: sectorMatch ? null : "Worker skills may not match job sector requirements",
    checkedAt: new Date(),
  };
  checks.push(sectorCheck);
  await db.createComplianceCheck(sectorCheck);

  // Determine overall compliance status
  const hasCriticalFailures = checks.some(c => c.status === "failed");

  return {
    passed: !hasCriticalFailures,
    checks,
    criticalFailures: checks.filter(c => c.status === "failed"),
  };
}

// ============================================================================
// ROUTERS
// ============================================================================

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============================================================================
  // COMPANY MANAGEMENT
  // ============================================================================

  company: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        nameAr: z.string().optional(),
        crNumber: z.string(),
        sector: z.string().optional(),
        industry: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createCompany({
          ...input,
          createdById: ctx.user.id,
        });

        await db.createAuditLog({
          entityType: "company",
          entityId: 0, // Will be updated with actual ID
          action: "created",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: input,
          timestamp: new Date(),
        });

        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "super_admin" || ctx.user.role === "regulator") {
        // Admins and regulators see all companies
        const db_instance = await db.getDb();
        if (!db_instance) return [];
        const { companies } = await import("../drizzle/schema");
        return await db_instance.select().from(companies);
      }

      // Regular users see only companies they created or admin
      const created = await db.getCompaniesByCreator(ctx.user.id);
      const adminOf = await db.getCompaniesForAdmin(ctx.user.id);

      // Merge and deduplicate
      const allCompanies = [...created, ...adminOf];
      const uniqueCompanies = Array.from(new Map(allCompanies.map(c => [c.id, c])).values());
      return uniqueCompanies;
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const company = await db.getCompanyById(input.id);
        if (!company) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Company not found" });
        }
        return company;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        nameAr: z.string().optional(),
        sector: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateCompany(id, updates);

        await db.createAuditLog({
          entityType: "company",
          entityId: id,
          action: "updated",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: updates,
          timestamp: new Date(),
        });

        return { success: true };
      }),

    getDashboard: protectedProcedure
      .input(z.object({ companyId: z.number() }))
      .query(async ({ input }) => {
        const stats = await db.getDashboardStats(input.companyId);
        return stats;
      }),

    getPendingApprovals: protectedProcedure
      .input(z.object({ sponsorCompanyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPendingApprovals(input.sponsorCompanyId);
      }),

    approveAssignment: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        conditions: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assignment = await db.getAssignmentById(input.assignmentId);
        if (!assignment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found" });
        }

        await db.updateAssignment(input.assignmentId, {
          status: "sponsor_approved",
          approvedAt: new Date(),
        });

        const approval = await db.getApprovalByAssignment(input.assignmentId);
        if (approval) {
          await db.updateApproval(approval.id, {
            status: "approved",
            approvedById: ctx.user.id,
            conditions: input.conditions,
            notes: input.notes,
            respondedAt: new Date(),
          });
        }

        const worker = await db.getWorkerById(assignment.workerId);
        if (worker) {
          await db.createNotification({
            userId: worker.userId,
            type: "approval_response",
            title: "Assignment Approved",
            titleAr: "تمت الموافقة على التعيين",
            message: "Your assignment request has been approved by your sponsoring company",
            messageAr: "تمت الموافقة على طلب التعيين الخاص بك من قبل شركتك الكفيلة",
            relatedEntityType: "assignment",
            relatedEntityId: input.assignmentId,
          });
        }

        await db.createAuditLog({
          entityType: "assignment",
          entityId: input.assignmentId,
          action: "approved",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: { status: "sponsor_approved" },
          timestamp: new Date(),
        });

        return { success: true };
      }),

    declineAssignment: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assignment = await db.getAssignmentById(input.assignmentId);
        if (!assignment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found" });
        }

        await db.updateAssignment(input.assignmentId, {
          status: "sponsor_declined",
        });

        const approval = await db.getApprovalByAssignment(input.assignmentId);
        if (approval) {
          await db.updateApproval(approval.id, {
            status: "declined",
            approvedById: ctx.user.id,
            notes: input.notes,
            respondedAt: new Date(),
          });
        }

        const worker = await db.getWorkerById(assignment.workerId);
        if (worker) {
          await db.createNotification({
            userId: worker.userId,
            type: "approval_response",
            title: "Assignment Declined",
            titleAr: "تم رفض التعيين",
            message: "Your assignment request has been declined by your sponsoring company",
            messageAr: "تم رفض طلب التعيين الخاص بك من قبل شركتك الكفيلة",
            relatedEntityType: "assignment",
            relatedEntityId: input.assignmentId,
          });
        }

        await db.createAuditLog({
          entityType: "assignment",
          entityId: input.assignmentId,
          action: "declined",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: { status: "sponsor_declined", notes: input.notes },
          timestamp: new Date(),
        });

        return { success: true };
      }),
  }),

  // ============================================================================
  // WORKER MANAGEMENT
  // ============================================================================

  worker: router({
    create: protectedProcedure
      .input(z.object({
        sponsorCompanyId: z.number(),
        iqamaNumber: z.string(),
        nationality: z.string(),
        dateOfBirth: z.string(),
        visaType: z.string(),
        visaExpiryDate: z.string(),
        primarySkill: z.string(),
        skills: z.array(z.string()).optional(),
        experience: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { dateOfBirth, visaExpiryDate, ...rest } = input;

        await db.createWorker({
          ...rest,
          userId: ctx.user.id,
          dateOfBirth: new Date(dateOfBirth),
          visaExpiryDate: new Date(visaExpiryDate),
        });

        // Update user role to worker
        await db.updateUserRole(ctx.user.id, "worker");

        return { success: true };
      }),

    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const worker = await db.getWorkerByUserId(ctx.user.id);
      return worker;
    }),

    update: protectedProcedure
      .input(z.object({
        primarySkill: z.string().optional(),
        skills: z.array(z.string()).optional(),
        experience: z.number().optional(),
        isAvailable: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const worker = await db.getWorkerByUserId(ctx.user.id);
        if (!worker) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Worker profile not found" });
        }

        await db.updateWorker(worker.id, input);
        return { success: true };
      }),

    search: protectedProcedure
      .input(z.object({
        skills: z.array(z.string()).optional(),
        sector: z.string().optional(),
        limit: z.number().optional(),
      }))
      .query(async ({ input }) => {
        const workers = await db.searchAvailableWorkers({
          ...input,
          isAvailable: true,
        });
        return workers;
      }),

    getDashboard: protectedProcedure.query(async ({ ctx }) => {
      const worker = await db.getWorkerByUserId(ctx.user.id);
      if (!worker) {
        return null;
      }

      const stats = await db.getWorkerDashboardStats(worker.id);
      return stats;
    }),
  }),

  // ============================================================================
  // JOB MANAGEMENT
  // ============================================================================

  job: router({
    create: protectedProcedure
      .input(z.object({
        companyId: z.number(),
        title: z.string(),
        titleAr: z.string().optional(),
        description: z.string(),
        descriptionAr: z.string().optional(),
        requiredSkills: z.array(z.string()).optional(),
        sector: z.string().optional(),
        workLocation: z.string(),
        city: z.string().optional(),
        startDate: z.string(),
        endDate: z.string(),
        workingHours: z.string(),
        numberOfWorkers: z.number().default(1),
        wageAmount: z.string(),
        wageType: z.enum(["hourly", "daily", "fixed"]).default("hourly"),
      }))
      .mutation(async ({ ctx, input }) => {
        const { startDate, endDate, wageAmount, ...rest } = input;

        await db.createJob({
          ...rest,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          wageAmount,
          postedById: ctx.user.id,
          status: "active",
        });

        return { success: true };
      }),

    list: protectedProcedure
      .input(z.object({
        companyId: z.number().optional(),
        status: z.enum(["draft", "active", "filled", "cancelled", "completed"]).optional(),
      }))
      .query(async ({ input }) => {
        if (input.companyId) {
          return await db.getJobsByCompany(input.companyId);
        }
        return await db.getActiveJobs();
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const job = await db.getJobById(input.id);
        if (!job) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job not found" });
        }
        return job;
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["draft", "active", "filled", "cancelled", "completed"]).optional(),
        numberOfWorkers: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        await db.updateJob(id, updates);

        await db.createAuditLog({
          entityType: "job",
          entityId: id,
          action: "updated",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: updates,
          timestamp: new Date(),
        });

        return { success: true };
      }),
  }),

  // ============================================================================
  // ASSIGNMENT WORKFLOW
  // ============================================================================

  assignment: router({
    create: protectedProcedure
      .input(z.object({
        jobId: z.number(),
        workerId: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get job and worker details
        const job = await db.getJobById(input.jobId);
        const worker = await db.getWorkerById(input.workerId);

        if (!job || !worker) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Job or worker not found" });
        }

        // Create assignment
        const result = await db.createAssignment({
          jobId: input.jobId,
          workerId: input.workerId,
          companyId: job.companyId,
          sponsorCompanyId: worker.sponsorCompanyId,
          wageAmount: job.wageAmount,
          totalAmount: job.wageAmount,
          status: "pending_sponsor_approval",
        });

        const assignmentId = result.id;

        // Run compliance checks
        const complianceResult = await runComplianceChecks(
          assignmentId,
          input.workerId,
          job.companyId,
          input.jobId
        );

        // If compliance fails, cancel assignment
        if (!complianceResult.passed) {
          await db.updateAssignment(assignmentId, { status: "cancelled" });
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Compliance checks failed: ${complianceResult.criticalFailures.map(c => c.errorMessage).join(", ")}`,
          });
        }

        // Create approval request
        await db.createApproval({
          assignmentId,
          sponsorCompanyId: worker.sponsorCompanyId,
          status: "pending",
        });

        // Create notification for sponsoring company admins
        const sponsorAdmins = await db.getCompanyAdmins(worker.sponsorCompanyId);
        for (const admin of sponsorAdmins) {
          await db.createNotification({
            userId: admin.userId,
            type: "approval_request",
            title: "New Assignment Approval Request",
            titleAr: "طلب موافقة تعيين جديد",
            message: `Worker ${worker.userId} has requested approval for a new assignment`,
            messageAr: `طلب العامل ${worker.userId} الموافقة على تعيين جديد`,
            relatedEntityType: "assignment",
            relatedEntityId: assignmentId,
          });
        }

        await db.createAuditLog({
          entityType: "assignment",
          entityId: assignmentId,
          action: "created",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: input,
          timestamp: new Date(),
        });

        return { success: true, assignmentId };
      }),

    list: protectedProcedure
      .input(z.object({
        workerId: z.number().optional(),
        companyId: z.number().optional(),
        sponsorCompanyId: z.number().optional(),
      }))
      .query(async ({ input }) => {
        if (input.workerId) {
          return await db.getAssignmentsByWorker(input.workerId);
        }
        if (input.companyId) {
          return await db.getAssignmentsByCompany(input.companyId);
        }
        if (input.sponsorCompanyId) {
          return await db.getAssignmentsBySponsor(input.sponsorCompanyId);
        }
        return [];
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const assignment = await db.getAssignmentById(input.id);
        if (!assignment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found" });
        }

        // Get compliance checks
        const checks = await db.getComplianceChecksByAssignment(input.id);

        return { assignment, complianceChecks: checks };
      }),

    approve: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        conditions: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assignment = await db.getAssignmentById(input.assignmentId);
        if (!assignment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found" });
        }

        // Update assignment status
        await db.updateAssignment(input.assignmentId, {
          status: "sponsor_approved",
          approvedAt: new Date(),
        });

        // Update approval record
        const approval = await db.getApprovalByAssignment(input.assignmentId);
        if (approval) {
          await db.updateApproval(approval.id, {
            status: "approved",
            approvedById: ctx.user.id,
            conditions: input.conditions,
            notes: input.notes,
            respondedAt: new Date(),
          });
        }

        // Notify worker
        const worker = await db.getWorkerById(assignment.workerId);
        if (worker) {
          await db.createNotification({
            userId: worker.userId,
            type: "approval_response",
            title: "Assignment Approved",
            titleAr: "تمت الموافقة على التعيين",
            message: "Your assignment request has been approved by your sponsoring company",
            messageAr: "تمت الموافقة على طلب التعيين الخاص بك من قبل شركتك الكفيلة",
            relatedEntityType: "assignment",
            relatedEntityId: input.assignmentId,
          });
        }

        await db.createAuditLog({
          entityType: "assignment",
          entityId: input.assignmentId,
          action: "approved",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: { status: "sponsor_approved" },
          timestamp: new Date(),
        });

        return { success: true };
      }),

    decline: protectedProcedure
      .input(z.object({
        assignmentId: z.number(),
        notes: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const assignment = await db.getAssignmentById(input.assignmentId);
        if (!assignment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assignment not found" });
        }

        // Update assignment status
        await db.updateAssignment(input.assignmentId, {
          status: "sponsor_declined",
        });

        // Update approval record
        const approval = await db.getApprovalByAssignment(input.assignmentId);
        if (approval) {
          await db.updateApproval(approval.id, {
            status: "declined",
            approvedById: ctx.user.id,
            notes: input.notes,
            respondedAt: new Date(),
          });
        }

        // Notify worker
        const worker = await db.getWorkerById(assignment.workerId);
        if (worker) {
          await db.createNotification({
            userId: worker.userId,
            type: "approval_response",
            title: "Assignment Declined",
            titleAr: "تم رفض التعيين",
            message: "Your assignment request has been declined by your sponsoring company",
            messageAr: "تم رفض طلب التعيين الخاص بك من قبل شركتك الكفيلة",
            relatedEntityType: "assignment",
            relatedEntityId: input.assignmentId,
          });
        }

        await db.createAuditLog({
          entityType: "assignment",
          entityId: input.assignmentId,
          action: "declined",
          performedById: ctx.user.id,
          performedByRole: ctx.user.role,
          changes: { status: "sponsor_declined", notes: input.notes },
          timestamp: new Date(),
        });

        return { success: true };
      }),

    getPendingApprovals: protectedProcedure
      .input(z.object({ sponsorCompanyId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPendingApprovals(input.sponsorCompanyId);
      }),
  }),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================

  notification: router({
    list: protectedProcedure
      .input(z.object({ unreadOnly: z.boolean().optional() }))
      .query(async ({ ctx, input }) => {
        return await db.getNotificationsByUser(ctx.user.id, input.unreadOnly);
      }),

    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.id);
        return { success: true };
      }),

    markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
      await db.markAllNotificationsAsRead(ctx.user.id);
      return { success: true };
    }),
  }),

  // ============================================================================
  // REGULATOR DASHBOARD
  // ============================================================================

  regulator: router({
    getAuditLogs: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "regulator" && ctx.user.role !== "super_admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return await db.getRecentAuditLogs(input.limit || 100);
      }),

    getAllAssignments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "regulator" && ctx.user.role !== "super_admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
      }

      const db_instance = await db.getDb();
      if (!db_instance) return [];

      const { assignments } = await import("../drizzle/schema");
      return await db_instance.select().from(assignments);
    }),
  }),
});

export type AppRouter = typeof appRouter;
