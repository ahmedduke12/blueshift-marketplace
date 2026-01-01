import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    MapPin, DollarSign, Calendar, Clock, Users,
    ArrowLeft, Sparkles, Briefcase, CheckCircle2, AlertCircle
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

export default function JobDetails() {
    const [, params] = useRoute("/jobs/:id");
    const jobId = params?.id ? parseInt(params.id) : 0;
    const { user } = useAuth();
    const [isApplying, setIsApplying] = useState(false);
    const [demoJob, setDemoJob] = useState<any>(null);
    const [applicationStatus, setApplicationStatus] = useState<string | null>(null);

    const { data: apiJob, isLoading } = trpc.job.getById.useQuery(
        { id: jobId },
        { enabled: jobId > 0 }
    );

    // Check localStorage for demo jobs
    useEffect(() => {
        if (!apiJob && jobId > 0) {
            const demoJobs = JSON.parse(localStorage.getItem("demo-jobs") || "[]");
            const foundJob = demoJobs.find((j: any) => j.id === jobId);
            if (foundJob) {
                setDemoJob(foundJob);
            }
        }
    }, [apiJob, jobId]);

    // Check if user has already applied for this job
    useEffect(() => {
        if (user && jobId > 0) {
            const demoAssignments = JSON.parse(localStorage.getItem("demo-assignments") || "[]");
            const existingApplication = demoAssignments.find((a: any) => a.jobId === jobId);
            if (existingApplication) {
                setApplicationStatus(existingApplication.status);
            }
        }
    }, [user, jobId]);

    // Use API job if available, otherwise use demo job
    const job = apiJob || demoJob;

    const { data: worker } = trpc.worker.getProfile.useQuery(undefined, {
        enabled: !!user
    });

    const createAssignment = trpc.assignment.create.useMutation({
        onSuccess: () => {
            toast.success("Application submitted! Waiting for sponsor approval.");
            setIsApplying(false);
            setApplicationStatus("pending_sponsor_approval");
        },
        onError: (error: unknown) => {
            // Fallback to demo mode
            console.log("API failed, using demo mode for application:", error);
            handleDemoModeApply();
        }
    });

    const handleDemoModeApply = () => {
        if (!job || !user) return;

        // Create a demo assignment
        const newAssignment = {
            id: Date.now(),
            jobId: job.id,
            workerId: 1, // Demo worker ID
            status: "pending_sponsor_approval",
            wageAmount: job.wageAmount,
            wageType: job.wageType,
            createdAt: new Date().toISOString(),
            jobTitle: job.title,
            jobSector: job.sector,
            hiringCompanyId: job.companyId
        };

        // Store in localStorage
        const existingAssignments = JSON.parse(localStorage.getItem("demo-assignments") || "[]");
        existingAssignments.push(newAssignment);
        localStorage.setItem("demo-assignments", JSON.stringify(existingAssignments));

        toast.success("Application submitted! Waiting for sponsor approval. (Demo Mode)");
        setIsApplying(false);
        setApplicationStatus("pending_sponsor_approval");
    };

    const handleApply = async () => {
        if (!user || !job) {
            toast.error("Please sign in to apply for this job");
            return;
        }

        setIsApplying(true);

        // Try API first, will fall back to demo mode on error
        createAssignment.mutate({
            jobId: job.id,
            workerId: 1 // Demo worker ID
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                    <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Card className="max-w-md border-2 border-red-200 dark:border-red-800 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-center text-2xl">Job Not Found</CardTitle>
                        <CardDescription className="text-center">The job you're looking for doesn't exist</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            <Link href="/jobs">Back to Job Listings</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Link href="/jobs">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Jobs
                    </Link>
                </Button>

                {/* Job Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Job Opportunity</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {job.title}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                                {job.city && (
                                    <span className="flex items-center gap-2 text-lg">
                                        <MapPin className="w-5 h-5 text-blue-600" />
                                        {job.city}{job.region && `, ${job.region}`}
                                    </span>
                                )}
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-sm px-3 py-1">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    {job.status}
                                </Badge>
                            </div>
                        </div>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-xl flex-shrink-0 ml-4">
                            <Briefcase className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                        <DollarSign className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Wage</p>
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">{job.wageAmount} SAR</p>
                                        <p className="text-xs text-gray-500">per {job.wageType}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Start Date</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{new Date(job.startDate).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Positions</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{job.numberOfWorkers} needed</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Job Description */}
                <Card className="mb-6 border-2 border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-xl">Job Description</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                    </CardContent>
                </Card>

                {/* Job Details */}
                <Card className="mb-6 border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                            </div>
                            <CardTitle className="text-xl">Job Details</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {job.sector && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sector</p>
                                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0 text-sm px-3 py-1">
                                    {job.sector}
                                </Badge>
                            </div>
                        )}

                        {job.workingHours && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Working Hours</p>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                    {job.workingHours}
                                </p>
                            </div>
                        )}

                        {job.workLocation && (
                            <div>
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Work Location</p>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    {job.workLocation}
                                </p>
                            </div>
                        )}

                        <Separator />

                        <div>
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Duration</p>
                            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Apply Button - Only for Workers */}
                {user && user.userType === 'worker' && (
                    <Card className={`border-2 shadow-xl ${applicationStatus
                        ? 'border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20'
                        : 'border-green-200 dark:border-green-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
                        }`}>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {applicationStatus ? 'Application Status' : 'Ready to apply?'}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        {applicationStatus ? (
                                            <>
                                                <Clock className="w-4 h-4 text-orange-600" />
                                                {applicationStatus === 'pending_sponsor_approval' && 'Waiting for sponsor approval'}
                                                {applicationStatus === 'approved' && 'Approved by sponsor - awaiting hiring company'}
                                                {applicationStatus === 'active' && 'Application approved - job active'}
                                                {applicationStatus === 'declined' && 'Application declined'}
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                Your sponsor will need to approve this request
                                            </>
                                        )}
                                    </p>
                                </div>
                                <Button
                                    size="lg"
                                    onClick={handleApply}
                                    disabled={isApplying || !!applicationStatus}
                                    className={`shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 ${applicationStatus
                                        ? 'bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 cursor-not-allowed opacity-75'
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                                        }`}
                                >
                                    {isApplying ? "Applying..." :
                                        applicationStatus === 'pending_sponsor_approval' ? "Pending Sponsor Approval" :
                                            applicationStatus === 'approved' ? "Pending Hiring Approval" :
                                                applicationStatus === 'active' ? "Application Active" :
                                                    applicationStatus === 'declined' ? "Application Declined" :
                                                        "Apply Now"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {!user && (
                    <Card className="border-2 border-blue-200 dark:border-blue-800 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                        <CardContent className="pt-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 text-lg">Sign in to apply for this job</p>
                            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                <Link href="/signin">Sign In</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
