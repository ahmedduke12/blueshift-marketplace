import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Briefcase, Users, Clock, CheckCircle, XCircle, Plus, Search } from "lucide-react";
import { useLocation } from "wouter";

export default function CompanyDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  // Fetch company data
  const { data: companies, isLoading: companiesLoading } = trpc.company.list.useQuery();
  const myCompany = companies?.[0]; // Assuming user is admin of first company

  // Fetch dashboard stats
  const { data: stats } = trpc.company.getDashboard.useQuery(
    { companyId: myCompany?.id || 0 },
    { enabled: !!myCompany }
  );

  // Fetch pending approvals for workers
  const { data: pendingApprovals } = trpc.company.getPendingApprovals.useQuery(
    { sponsorCompanyId: myCompany?.id || 0 },
    { enabled: !!myCompany }
  );

  if (authLoading || companiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "company_admin") {
    navigate("/");
    return null;
  }

  if (!myCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>No Company Found</CardTitle>
            <CardDescription>
              You need to register your company first to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/company/register")} className="w-full">
              Register Company
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{myCompany.name}</h1>
              <p className="text-sm text-muted-foreground">
                {myCompany.city} • {myCompany.sector}
                {myCompany.nitaqatStatus && (
                  <Badge variant="outline" className="ml-2">
                    Nitaqat: {myCompany.nitaqatStatus}
                  </Badge>
                )}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeAssignments || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingApprovals || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="demand" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="demand">Hire Workers</TabsTrigger>
            <TabsTrigger value="supply">
              Manage Workers
              {pendingApprovals && pendingApprovals.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingApprovals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Demand Side: Hire Workers */}
          <TabsContent value="demand" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Job Postings & Hiring</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate("/company/workers/search")}>
                  <Search className="mr-2 h-4 w-4" />
                  Search Workers
                </Button>
                <Button onClick={() => navigate("/company/jobs/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Job
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Job Postings</CardTitle>
                <CardDescription>
                  Jobs currently open for applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No active job postings</p>
                  <Button variant="link" onClick={() => navigate("/company/jobs/new")}>
                    Post your first job
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>
                  Workers who applied to your jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No applications yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supply Side: Manage Workers */}
          <TabsContent value="supply" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Worker Management</h2>
              <Button variant="outline" onClick={() => navigate("/company/workers")}>
                <Users className="mr-2 h-4 w-4" />
                View All Workers
              </Button>
            </div>

            {/* Pending Approval Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pending Approval Requests
                  {pendingApprovals && pendingApprovals.length > 0 && (
                    <Badge variant="destructive">{pendingApprovals.length}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Your workers requesting to work for other companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!pendingApprovals || pendingApprovals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending approval requests</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((assignment: any) => (
                      <ApprovalRequestCard
                        key={assignment.id}
                        assignment={assignment}
                        companyId={myCompany.id}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Worker Roster */}
            <Card>
              <CardHeader>
                <CardTitle>Your Workers</CardTitle>
                <CardDescription>
                  Workers sponsored by your company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No workers registered yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Approval Request Card Component
function ApprovalRequestCard({ assignment, companyId }: { assignment: any; companyId: number }) {
  const utils = trpc.useUtils();

  const approveMutation = trpc.company.approveAssignment.useMutation({
    onSuccess: () => {
      utils.company.getPendingApprovals.invalidate();
      utils.company.getDashboard.invalidate();
    },
  });

  const declineMutation = trpc.company.declineAssignment.useMutation({
    onSuccess: () => {
      utils.company.getPendingApprovals.invalidate();
      utils.company.getDashboard.invalidate();
    },
  });

  const handleApprove = () => {
    if (confirm("Approve this assignment request?")) {
      approveMutation.mutate({ assignmentId: assignment.id });
    }
  };

  const handleDecline = () => {
    const notes = prompt("Reason for declining (optional):");
    if (notes !== null) {
      declineMutation.mutate({ assignmentId: assignment.id, notes: notes || undefined });
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold">Worker Assignment Request</h4>
          <p className="text-sm text-muted-foreground">
            Requested {new Date(assignment.requestedAt).toLocaleDateString()}
          </p>
        </div>
        <Badge variant="outline">Pending</Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Job:</span>
          <span className="font-medium">Job #{assignment.jobId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Worker:</span>
          <span className="font-medium">Worker #{assignment.workerId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Company:</span>
          <span className="font-medium">Company #{assignment.companyId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Wage:</span>
          <span className="font-medium">{assignment.wageAmount} SAR</span>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={approveMutation.isPending}
          className="flex-1"
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecline}
          disabled={declineMutation.isPending}
          className="flex-1"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Decline
        </Button>
      </div>
    </div>
  );
}
