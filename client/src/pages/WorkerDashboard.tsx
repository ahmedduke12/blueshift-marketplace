import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Clock, DollarSign, CheckCircle2, AlertCircle, Calendar, History } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

export default function WorkerDashboard() {
    const { user, loading } = useAuth();

    // Fetch worker data
    const { data: worker } = trpc.worker.getProfile.useQuery(undefined, {
        enabled: !!user
    });

    const { data: assignments } = trpc.assignment.list.useQuery(
        { workerId: worker?.id },
        { enabled: !!worker?.id }
    );

    const { data: availableJobs } = trpc.job.list.useQuery({
        status: "active"
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const activeAssignments = assignments?.filter(a => a.status === 'active') || [];
    const pendingAssignments = assignments?.filter(a => a.status === 'pending_sponsor_approval') || [];
    const completedAssignments = assignments?.filter(a => a.status === 'completed') || [];

    const stats = {
        activeJobs: activeAssignments.length,
        pendingApprovals: pendingAssignments.length,
        completedJobs: completedAssignments.length,
        totalEarnings: assignments?.reduce((sum, a) => sum + (Number(a.wageAmount) || 0), 0) || 0
    };

    return (
        <div className="min-h-screen bg-background">
            <Header userType="worker" />

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back{user?.name ? `, ${user.name}` : ''}!</h1>
                    <p className="text-muted-foreground">{user ? "Here's your activity overview" : "Demo Mode - Viewing sample data"}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeJobs}</div>
                            <p className="text-xs text-muted-foreground">Currently working</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
                            <p className="text-xs text-muted-foreground">Awaiting sponsor</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.completedJobs}</div>
                            <p className="text-xs text-muted-foreground">Total finished</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalEarnings.toLocaleString()} SAR</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Current and History */}
                <Tabs defaultValue="current" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="current">Current Activity</TabsTrigger>
                        <TabsTrigger value="history" className="flex items-center gap-2">
                            <History className="w-4 h-4" />
                            Job History
                        </TabsTrigger>
                    </TabsList>

                    {/* Current Activity Tab */}
                    <TabsContent value="current" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Assignments */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Assignments</CardTitle>
                                    <CardDescription>Your latest job assignments</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {assignments && assignments.length > 0 ? (
                                        <div className="space-y-4">
                                            {assignments.slice(0, 5).map((assignment) => (
                                                <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div className="flex-1">
                                                        <p className="font-medium">Assignment #{assignment.id}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {assignment.wageAmount} SAR
                                                        </p>
                                                    </div>
                                                    <Badge variant={
                                                        assignment.status === 'active' ? 'default' :
                                                            assignment.status === 'completed' ? 'secondary' :
                                                                assignment.status === 'pending_sponsor_approval' ? 'outline' :
                                                                    'destructive'
                                                    }>
                                                        {assignment.status.replace(/_/g, ' ')}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No assignments yet</p>
                                            <Button asChild className="mt-4">
                                                <Link href="/jobs">Browse Available Jobs</Link>
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Available Jobs */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Available Jobs</CardTitle>
                                    <CardDescription>New opportunities for you</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {availableJobs && availableJobs.length > 0 ? (
                                        <div className="space-y-4">
                                            {availableJobs.slice(0, 3).map((job) => (
                                                <div key={job.id} className="p-4 border rounded-lg hover:border-primary transition-colors">
                                                    <h3 className="font-medium mb-2">{job.title}</h3>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                                        <span className="flex items-center gap-1">
                                                            <DollarSign className="w-4 h-4" />
                                                            {job.wageAmount} SAR/{job.wageType}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(job.startDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <Button asChild size="sm" className="w-full">
                                                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button asChild variant="outline" className="w-full">
                                                <Link href="/jobs">View All Jobs</Link>
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No jobs available right now</p>
                                            <p className="text-sm mt-2">Check back soon for new opportunities</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Job History Tab */}
                    <TabsContent value="history">
                        <Card>
                            <CardHeader>
                                <CardTitle>Completed Jobs</CardTitle>
                                <CardDescription>Your work history and earnings</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {completedAssignments.length > 0 ? (
                                    <div className="space-y-4">
                                        {completedAssignments.map((assignment) => (
                                            <div key={assignment.id} className="p-4 border rounded-lg">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium">Assignment #{assignment.id}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Completed Job
                                                        </p>
                                                    </div>
                                                    <Badge variant="secondary">
                                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm mt-3">
                                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                                                        <DollarSign className="w-4 h-4" />
                                                        {assignment.wageAmount} SAR
                                                    </span>
                                                    <span className="flex items-center gap-1 text-muted-foreground">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(assignment.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium">Total Earnings from Completed Jobs:</span>
                                                <span className="text-2xl font-bold text-green-600">
                                                    {completedAssignments.reduce((sum, a) => sum + (Number(a.wageAmount) || 0), 0).toLocaleString()} SAR
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg font-medium mb-2">No completed jobs yet</p>
                                        <p className="text-sm mb-4">Your completed jobs will appear here</p>
                                        <Button asChild>
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
