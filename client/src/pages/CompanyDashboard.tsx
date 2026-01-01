import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Users, Clock, Plus, Search, Building2, Sparkles, TrendingUp, Award, Target } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header userType="company" />

      <div className="container mx-auto px-4 py-8">
        {/* Company Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Company Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {company.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                {company.city} • {company.sector}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Jobs</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">{stats.activeJobs}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Currently hiring</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Active Assignments</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.activeAssignments}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Workers on jobs</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-orange-200 dark:hover:border-orange-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Pending Approvals</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.pendingApprovals}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Awaiting decision</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Workers</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Award className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalWorkers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Under sponsorship</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900">
            <TabsTrigger
              value="jobs"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Job Postings
            </TabsTrigger>
            <TabsTrigger
              value="workers"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
            >
              Workers
              {stats.pendingApprovals > 0 && (
                <Badge className="ml-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Postings & Hiring</h2>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild className="border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                  <Link href="/jobs">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Workers
                  </Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/jobs/post">
                    <Plus className="mr-2 h-4 w-4" />
                    Post New Job
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Active Job Postings</CardTitle>
                </div>
                <CardDescription>
                  Jobs currently open for applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No active job postings</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Start hiring by posting your first job</p>
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Link href="/jobs/post">Post Your First Job</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Recent Applications</CardTitle>
                </div>
                <CardDescription>
                  Workers who applied to your jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No applications yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">Applications will appear here once workers apply</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Management</h2>
              </div>
              <Button variant="outline" asChild className="border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                <Link href="/approvals">
                  <Clock className="mr-2 h-4 w-4" />
                  View All Approvals
                </Link>
              </Button>
            </div>

            {/* Pending Approvals */}
            <Card className="border-2 border-orange-100 dark:border-orange-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Pending Approval Requests
                    {stats.pendingApprovals > 0 && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">{stats.pendingApprovals}</Badge>
                    )}
                  </CardTitle>
                </div>
                <CardDescription>
                  Your workers requesting to work for other companies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No pending approval requests</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">All requests have been processed</p>
                  <Button variant="outline" asChild className="border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                    <Link href="/approvals">View Approval Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Worker Roster */}
            <Card className="border-2 border-green-100 dark:border-green-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Your Workers</CardTitle>
                </div>
                <CardDescription>
                  Workers sponsored by your company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No workers registered yet</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Workers under your sponsorship will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8 border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </div>
            <CardDescription>Common tasks for managing your company</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto py-6 flex-col border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 group">
                <Link href="/jobs/post">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Plus className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Post a Job</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Find workers for your needs</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6 flex-col border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 group">
                <Link href="/jobs">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Browse Workers</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Search available talent</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto py-6 flex-col border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 group">
                <Link href="/approvals">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">Manage Approvals</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Review worker requests</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
