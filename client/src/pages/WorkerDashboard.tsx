import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Clock, DollarSign, CheckCircle2, AlertCircle, Calendar, History, Sparkles, TrendingUp, Award } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function WorkerDashboard() {
    const { user, loading } = useAuth();
    const [allAssignments, setAllAssignments] = useState<any[]>([]);
    const [allJobs, setAllJobs] = useState<any[]>([]);

    // Fetch worker data
    const { data: worker } = trpc.worker.getProfile.useQuery(undefined, {
        enabled: !!user
    });

    const { data: apiAssignments } = trpc.assignment.list.useQuery(
        { workerId: worker?.id },
        { enabled: !!worker?.id }
    );

    const { data: availableJobs } = trpc.job.list.useQuery({
        status: "active"
    });

    // Merge API assignments with demo assignments from localStorage
    useEffect(() => {
        const demoAssignments = JSON.parse(localStorage.getItem("demo-assignments") || "[]");
        const merged = [...(apiAssignments || []), ...demoAssignments];
        setAllAssignments(merged);
    }, [apiAssignments]);

    // Merge API jobs with demo jobs from localStorage
    useEffect(() => {
        const demoJobs = JSON.parse(localStorage.getItem("demo-jobs") || "[]");
        const merged = [...(availableJobs || []), ...demoJobs];
        setAllJobs(merged);
    }, [availableJobs]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                </div>
            </div>
        );
    }

    const activeAssignments = allAssignments?.filter(a => a.status === 'active') || [];
    const pendingAssignments = allAssignments?.filter(a => a.status === 'pending_sponsor_approval') || [];
    const completedAssignments = allAssignments?.filter(a => a.status === 'completed') || [];

    const stats = {
        activeJobs: activeAssignments.length,
        pendingApprovals: pendingAssignments.length,
        completedJobs: completedAssignments.length,
        totalEarnings: allAssignments?.reduce((sum, a) => sum + (Number(a.wageAmount) || 0), 0) || 0
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header userType="worker" />

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Worker Dashboard</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome back{user?.name ? `, ${user.name}` : ''}!
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">{user ? "Here's your activity overview" : "Demo Mode - Viewing sample data"}</p>
                </div>

                {/* Stats Grid */}
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
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Currently working</p>
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
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Awaiting sponsor</p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Completed Jobs</CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                <CheckCircle2 className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.completedJobs}</div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total finished</p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total Earnings</CardTitle>
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                <DollarSign className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.totalEarnings.toLocaleString()} <span className="text-lg">SAR</span></div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">All time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Current and History */}
                <Tabs defaultValue="current" className="space-y-6">
                    <TabsList className="p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900">
                        <TabsTrigger
                            value="current"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                        >
                            Current Activity
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                        >
                            <History className="w-4 h-4" />
                            Job History
                        </TabsTrigger>
                    </TabsList>

                    {/* Current Activity Tab */}
                    <TabsContent value="current" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Assignments */}
                            <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">Recent Assignments</CardTitle>
                                    </div>
                                    <CardDescription>Your latest job assignments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {allAssignments && allAssignments.length > 0 ? (
                                        <div className="space-y-3">
                                            {allAssignments.slice(0, 5).map((assignment: any) => (
                                                <div key={assignment.id} className="flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-md">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-white">Assignment #{assignment.id}</p>
                                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                                                            {assignment.wageAmount} SAR
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        className={
                                                            assignment.status === 'active' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0' :
                                                                assignment.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0' :
                                                                    assignment.status === 'pending_sponsor_approval' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-0' :
                                                                        'bg-gray-500 text-white border-0'
                                                        }
                                                    >
                                                        {assignment.status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                                                <AlertCircle className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4">No assignments yet</p>
                                            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                                <Link href="/jobs">Browse Available Jobs</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Available Jobs */}
                            <Card className="border-2 border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <Briefcase className="w-5 h-5 text-white" />
                                        </div>
                                        <CardTitle className="text-xl">Available Jobs</CardTitle>
                                    </div>
                                    <CardDescription>New opportunities for you</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {allJobs && allJobs.length > 0 ? (
                                        <div className="space-y-3">
                                            {allJobs.slice(0, 3).map((job: any) => (
                                                <div key={job.id} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-md">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                        <span className="flex items-center gap-1 font-medium text-green-600 dark:text-green-400">
                                                            <DollarSign className="w-4 h-4" />
                                                            {job.wageAmount} SAR/{job.wageType}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(job.startDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <Button asChild size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all duration-300">
                                                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button asChild variant="outline" className="w-full border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                                <Link href="/jobs">View All Jobs</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
                                                <Briefcase className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mb-2">No jobs available right now</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-500">Check back soon for new opportunities</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Job History Tab */}
                    <TabsContent value="history">
                        <Card className="border-2 border-green-100 dark:border-green-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <CardTitle className="text-xl">Completed Jobs</CardTitle>
                                </div>
                                <CardDescription>Your work history and earnings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {completedAssignments.length > 0 ? (
                                    <div className="space-y-4">
                                        {completedAssignments.map((assignment) => (
                                            <div key={assignment.id} className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-md">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-gray-900 dark:text-white">Assignment #{assignment.id}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                            Completed Job
                                                        </p>
                                                    </div>
                                                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm mt-3">
                                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                                                        <DollarSign className="w-4 h-4" />
                                                        {assignment.wageAmount} SAR
                                                    </span>
                                                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(assignment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">Total Earnings from Completed Jobs:</span>
                                                <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                    {completedAssignments.reduce((sum, a) => sum + (Number(a.wageAmount) || 0), 0).toLocaleString()} SAR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-4">
                                            <History className="w-12 h-12 text-green-600 dark:text-green-400" />
                                        </div>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No completed jobs yet</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Your completed jobs will appear here</p>
                                        <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                            <Link href="/jobs">Browse Available Jobs</Link>
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
