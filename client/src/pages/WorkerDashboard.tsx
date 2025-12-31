import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, DollarSign, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Link } from "wouter";

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

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>Please sign in to access your dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/">Go to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const stats = {
        activeJobs: assignments?.filter(a => a.status === 'active').length || 0,
        pendingApprovals: assignments?.filter(a => a.status === 'pending_sponsor_approval').length || 0,
        completedJobs: assignments?.filter(a => a.status === 'completed').length || 0,
        totalEarnings: assignments?.reduce((sum, a) => sum + (Number(a.wageAmount) || 0), 0) || 0
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
                            <Link href="/worker/profile">
                                <Button variant="ghost">Profile</Button>
                            </Link>
                            <Link href="/jobs">
                                <Button>Browse Jobs</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || 'Worker'}!</h1>
                    <p className="text-muted-foreground">Here's your activity overview</p>
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
            </main>
        </div>
    );
}
