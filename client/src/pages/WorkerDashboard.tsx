import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, DollarSign, CheckCircle2, AlertCircle, Calendar } from "lucide-react";
import { Link } from "wouter";

// Mock data
const mockStats = {
    activeJobs: 2,
    pendingApprovals: 1,
    completedJobs: 5,
    totalEarnings: 12500
};

const mockAssignments = [
    { id: 1, title: "Construction Helper", wageAmount: 2500, status: "active" },
    { id: 2, title: "Warehouse Assistant", wageAmount: 2000, status: "pending_sponsor_approval" },
    { id: 3, title: "Delivery Driver", wageAmount: 3000, status: "completed" },
];

const mockJobs = [
    {
        id: 1,
        title: "Retail Sales Associate",
        wageAmount: 2200,
        wageType: "daily",
        startDate: "2024-02-01",
        city: "Riyadh"
    },
    {
        id: 2,
        title: "Restaurant Server",
        wageAmount: 150,
        wageType: "hourly",
        startDate: "2024-02-05",
        city: "Jeddah"
    },
    {
        id: 3,
        title: "Security Guard",
        wageAmount: 3000,
        wageType: "fixed",
        startDate: "2024-02-10",
        city: "Dammam"
    },
];

export default function WorkerDashboard() {
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
                    <h1 className="text-3xl font-bold mb-2">Welcome back, Worker!</h1>
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
                            <div className="text-2xl font-bold">{mockStats.activeJobs}</div>
                            <p className="text-xs text-muted-foreground">Currently working</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.pendingApprovals}</div>
                            <p className="text-xs text-muted-foreground">Awaiting sponsor</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.completedJobs}</div>
                            <p className="text-xs text-muted-foreground">Total finished</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockStats.totalEarnings.toLocaleString()} SAR</div>
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
                            <div className="space-y-4">
                                {mockAssignments.map((assignment) => (
                                    <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium">{assignment.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {assignment.wageAmount} SAR
                                            </p>
                                        </div>
                                        <Badge variant={
                                            assignment.status === 'active' ? 'default' :
                                                assignment.status === 'completed' ? 'secondary' :
                                                    'outline'
                                        }>
                                            {assignment.status.replace(/_/g, ' ')}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Available Jobs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Jobs</CardTitle>
                            <CardDescription>New opportunities for you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {mockJobs.map((job) => (
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
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
