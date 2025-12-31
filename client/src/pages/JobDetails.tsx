import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Briefcase, MapPin, DollarSign, Calendar, Clock, Users,
    ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

export default function JobDetails() {
    const [, params] = useRoute("/jobs/:id");
    const jobId = params?.id ? parseInt(params.id) : 0;
    const { user } = useAuth();
    const [isApplying, setIsApplying] = useState(false);

    const { data: job, isLoading } = trpc.job.getById.useQuery(
        { id: jobId },
        { enabled: jobId > 0 }
    );

    const { data: worker } = trpc.worker.getProfile.useQuery(undefined, {
        enabled: !!user
    });

    const createAssignment = trpc.assignment.create.useMutation({
        onSuccess: () => {
            toast.success("Application submitted! Waiting for sponsor approval.");
            setIsApplying(false);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to apply for job");
            setIsApplying(false);
        }
    });

    const handleApply = async () => {
        if (!worker || !job) return;

        setIsApplying(true);
        createAssignment.mutate({
            jobId: job.id,
            workerId: worker.id
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Job Not Found</CardTitle>
                        <CardDescription>The job you're looking for doesn't exist</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/jobs">Back to Job Listings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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
                            <Link href="/jobs">
                                <Button variant="ghost">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Jobs
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Job Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                {job.city && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {job.city}{job.region && `, ${job.region}`}
                                    </span>
                                )}
                                <Badge variant="secondary">{job.status}</Badge>
                            </div>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Wage</p>
                                        <p className="font-semibold">{job.wageAmount} SAR / {job.wageType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Start Date</p>
                                        <p className="font-semibold">{new Date(job.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Users className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Positions</p>
                                        <p className="font-semibold">{job.numberOfWorkers} needed</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Description */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Job Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Job Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {job.sector && (
                            <div>
                                <p className="text-sm font-medium mb-1">Sector</p>
                                <Badge variant="outline">{job.sector}</Badge>
                            </div>
                        )}

                        {job.workingHours && (
                            <div>
                                <p className="text-sm font-medium mb-1">Working Hours</p>
                                <p className="text-muted-foreground flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {job.workingHours}
                                </p>
                            </div>
                        )}

                        {job.workLocation && (
                            <div>
                                <p className="text-sm font-medium mb-1">Work Location</p>
                                <p className="text-muted-foreground">{job.workLocation}</p>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <p className="text-sm font-medium mb-1">Duration</p>
                            <p className="text-muted-foreground">
                                {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Apply Button */}
                {user && worker && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold mb-1">Ready to apply?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Your sponsor will need to approve this request
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={handleApply}
                                    disabled={isApplying}
                                >
                                    {isApplying ? "Applying..." : "Apply Now"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!user && (
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <p className="text-muted-foreground mb-4">Sign in to apply for this job</p>
                            <Button asChild>
                                <Link href="/">Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
