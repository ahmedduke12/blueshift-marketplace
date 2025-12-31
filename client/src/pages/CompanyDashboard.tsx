import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Clock, Plus, Search, Building2 } from "lucide-react";
import { Link } from "wouter";

export default function CompanyDashboard() {
  // Mock company data for demo
  const company = {
    name: "Demo Construction Co.",
    city: "Riyadh",
    sector: "Construction"
  };

  const stats = {
    activeJobs: 0,
    activeAssignments: 0,
    pendingApprovals: 0,
    totalWorkers: 0
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">BlueShift</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/jobs/post">
                <Button>Post Job</Button>
              </Link>
              <Link href="/approvals">
                <Button variant="outline">Approvals</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Company Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{company.name}</h1>
              <p className="text-muted-foreground">
                {company.city} • {company.sector}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
              <p className="text-xs text-muted-foreground">Currently hiring</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAssignments}</div>
              <p className="text-xs text-muted-foreground">Workers on jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWorkers}</div>
              <p className="text-xs text-muted-foreground">Under sponsorship</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="workers">
              Workers
              {stats.pendingApprovals > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Job Postings & Hiring</h2>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/jobs">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Workers
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/jobs/post">
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Link>
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
                <div className="text-center py-12 text-muted-foreground">
                  <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No active job postings</p>
                  <p className="text-sm mb-4">Start hiring by posting your first job</p>
                  <Button asChild>
                    <Link href="/jobs/post">Post Your First Job</Link>
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
                  <p className="text-sm mt-2">Applications will appear here once workers apply</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Worker Management</h2>
              <Button variant="outline" asChild>
                <Link href="/approvals">
                  <Clock className="mr-2 h-4 w-4" />
                  View All Approvals
                </Link>
              </Button>
            </div>

            {/* Pending Approvals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Pending Approval Requests
                  {stats.pendingApprovals > 0 && (
                    <Badge variant="destructive">{stats.pendingApprovals}</Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Your workers requesting to work for other companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No pending approval requests</p>
                  <p className="text-sm mb-4">All requests have been processed</p>
                  <Button variant="outline" asChild>
                    <Link href="/approvals">View Approval Dashboard</Link>
                  </Button>
                </div>
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
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No workers registered yet</p>
                  <p className="text-sm">Workers under your sponsorship will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for managing your company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto py-4 flex-col">
                <Link href="/jobs/post">
                  <Plus className="h-6 w-6 mb-2" />
                  <span className="font-medium">Post a Job</span>
                  <span className="text-xs text-muted-foreground mt-1">Find workers for your needs</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col">
                <Link href="/jobs">
                  <Search className="h-6 w-6 mb-2" />
                  <span className="font-medium">Browse Workers</span>
                  <span className="text-xs text-muted-foreground mt-1">Search available talent</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-4 flex-col">
                <Link href="/approvals">
                  <Clock className="h-6 w-6 mb-2" />
                  <span className="font-medium">Manage Approvals</span>
                  <span className="text-xs text-muted-foreground mt-1">Review worker requests</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
