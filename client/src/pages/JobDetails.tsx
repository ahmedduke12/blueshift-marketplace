import { useState } from "react";
import { useRoute } from "wouter";
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

// Mock job data
const mockJobs: Record<string, any> = {
    "1": {
        id: 1,
        title: "Construction Helper",
        description: "We are looking for a reliable construction helper to assist with various tasks on our construction sites. Responsibilities include material handling, site cleanup, assisting skilled workers, and following safety protocols. This is a great opportunity for someone looking to gain experience in the construction industry.",
        wageAmount: 2500,
        wageType: "daily",
        city: "Riyadh",
        region: "Central",
        startDate: "2024-02-01",
        endDate: "2024-03-01",
        sector: "construction",
        workLocation: "Various construction sites in Riyadh",
        workingHours: "7:00 AM - 3:00 PM",
        numberOfWorkers: 3,
        status: "active",
        companyId: 1
    },
    "2": {
        id: 2,
        title: "Restaurant Server",
        description: "Join our team as a restaurant server in a busy dining establishment. You'll be responsible for taking orders, serving food and beverages, ensuring customer satisfaction, and maintaining a clean dining area. Previous experience in hospitality is preferred but not required.",
        wageAmount: 150,
        wageType: "hourly",
        city: "Jeddah",
        region: "Western",
        startDate: "2024-02-05",
        endDate: "2024-04-05",
        sector: "hospitality",
        workLocation: "Downtown Jeddah Restaurant",
        workingHours: "5:00 PM - 11:00 PM",
        numberOfWorkers: 2,
        status: "active",
        companyId: 2
    },
    "3": {
        id: 3,
        title: "Warehouse Assistant",
        description: "We need a warehouse assistant to help with inventory management, order picking, packing, and shipping. You'll work in a fast-paced environment and need to be comfortable with physical work. Training will be provided for warehouse management systems.",
        wageAmount: 2000,
        wageType: "daily",
        city: "Dammam",
        region: "Eastern",
        startDate: "2024-02-10",
        endDate: "2024-05-10",
        sector: "logistics",
        workLocation: "Industrial Area Warehouse",
        workingHours: "8:00 AM - 4:00 PM",
        numberOfWorkers: 5,
        status: "active",
        companyId: 3
    }
};

export default function JobDetails() {
    const [, params] = useRoute("/jobs/:id");
    const jobId = params?.id || "1";
    const [isApplying, setIsApplying] = useState(false);

    const job = mockJobs[jobId];

    const handleApply = async () => {
        setIsApplying(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Application submitted! Waiting for sponsor approval.");
            setIsApplying(false);
        }, 1000);
    };

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
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {job.city}, {job.region}
                                </span>
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
                        <div>
                            <p className="text-sm font-medium mb-1">Sector</p>
                            <Badge variant="outline">{job.sector}</Badge>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">Working Hours</p>
                            <p className="text-muted-foreground flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {job.workingHours}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm font-medium mb-1">Work Location</p>
                            <p className="text-muted-foreground">{job.workLocation}</p>
                        </div>

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
            </main>
        </div>
    );
}
