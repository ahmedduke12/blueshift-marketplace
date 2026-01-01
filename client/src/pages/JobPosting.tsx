import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Sparkles, Briefcase, MapPin, Calendar, DollarSign } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";

const steps = [
    { id: 1, name: "Basic Info", description: "Job title and description", icon: Briefcase },
    { id: 2, name: "Requirements", description: "Skills and qualifications", icon: MapPin },
    { id: 3, name: "Schedule", description: "Dates and working hours", icon: Calendar },
    { id: 4, name: "Compensation", description: "Wage and benefits", icon: DollarSign },
];

export default function JobPosting() {
    const [, setLocation] = useLocation();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        sector: "",
        workLocation: "",
        city: "",
        region: "",
        numberOfWorkers: 1,
        startDate: "",
        endDate: "",
        workingHours: "",
        wageAmount: "",
        wageType: "daily" as "hourly" | "daily" | "fixed",
        requirements: ""
    });

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Mock IDs for demo
    const mockCompanyId = 1;
    const mockUserId = 1;

    const createJob = trpc.job.create.useMutation({
        onSuccess: () => {
            toast.success("Job posted successfully!");
            setTimeout(() => {
                setLocation("/company/dashboard");
            }, 1500);
        },
        onError: (error: unknown) => {
            // Fallback to localStorage for demo mode
            console.log("API failed, using demo mode:", error);
            handleDemoModeSubmit();
        }
    });

    const handleDemoModeSubmit = () => {
        const newJob = {
            id: Date.now(),
            companyId: mockCompanyId,
            title: formData.title,
            description: formData.description,
            sector: formData.sector,
            workLocation: formData.workLocation,
            city: formData.city,
            region: formData.region,
            startDate: formData.startDate,
            endDate: formData.endDate,
            workingHours: formData.workingHours,
            numberOfWorkers: formData.numberOfWorkers,
            wageAmount: formData.wageAmount,
            wageType: formData.wageType,
            postedById: mockUserId,
            status: "active",
            createdAt: new Date().toISOString()
        };

        const existingJobs = JSON.parse(localStorage.getItem("demo-jobs") || "[]");
        existingJobs.push(newJob);
        localStorage.setItem("demo-jobs", JSON.stringify(existingJobs));

        toast.success("Job posted successfully! (Demo Mode)");
        setTimeout(() => {
            setLocation("/company/dashboard");
        }, 1500);
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.title || !formData.description || !formData.sector) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Save job to database
        createJob.mutate({
            companyId: mockCompanyId,
            title: formData.title,
            description: formData.description,
            sector: formData.sector || undefined,
            workLocation: formData.workLocation || undefined,
            city: formData.city || undefined,
            region: formData.region || undefined,
            startDate: formData.startDate,
            endDate: formData.endDate,
            workingHours: formData.workingHours || undefined,
            numberOfWorkers: formData.numberOfWorkers,
            wageAmount: formData.wageAmount,
            wageType: formData.wageType,
            postedById: mockUserId
        });
    };

    const isStepValid = () => {
        switch (currentStep) {
            case 1:
                return formData.title && formData.description && formData.sector;
            case 2:
                return true; // Location is optional
            case 3:
                return formData.startDate && formData.endDate;
            case 4:
                return formData.wageAmount && formData.wageType;
            default:
                return false;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header userType="company" />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Header */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Link href="/company/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Create Job Posting</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Post a New Job
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Fill in the details to create a job posting</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${currentStep > step.id
                                                ? 'bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg scale-110'
                                                : currentStep === step.id
                                                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl scale-110'
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                            }`}>
                                            {currentStep > step.id ? (
                                                <Check className="w-7 h-7 text-white" />
                                            ) : (
                                                <StepIcon className={`w-7 h-7 ${currentStep === step.id ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                                            )}
                                        </div>
                                        <div className="text-center mt-3">
                                            <p className={`text-sm font-semibold ${currentStep >= step.id ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {step.name}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block mt-1">{step.description}</p>
                                        </div>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-300 ${currentStep > step.id ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                                            }`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Form Steps */}
                <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                                {(() => {
                                    const StepIcon = steps[currentStep - 1].icon;
                                    return <StepIcon className="w-6 h-6 text-white" />;
                                })()}
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{steps[currentStep - 1].name}</CardTitle>
                                <CardDescription className="text-base">{steps[currentStep - 1].description}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="title" className="text-sm font-semibold">Job Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Construction Helper"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sector" className="text-sm font-semibold">Sector *</Label>
                                    <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                                        <SelectTrigger className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                                            <SelectValue placeholder="Select a sector" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="construction">Construction</SelectItem>
                                            <SelectItem value="hospitality">Hospitality</SelectItem>
                                            <SelectItem value="retail">Retail</SelectItem>
                                            <SelectItem value="logistics">Logistics</SelectItem>
                                            <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-sm font-semibold">Job Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the job responsibilities, requirements, and expectations..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={6}
                                        className="mt-2 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Requirements */}
                        {currentStep === 2 && (
                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="city" className="text-sm font-semibold">City</Label>
                                    <Input
                                        id="city"
                                        placeholder="e.g., Riyadh"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="region" className="text-sm font-semibold">Region</Label>
                                    <Input
                                        id="region"
                                        placeholder="e.g., Central Region"
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="workLocation" className="text-sm font-semibold">Work Location</Label>
                                    <Input
                                        id="workLocation"
                                        placeholder="e.g., Construction Site, Downtown"
                                        value={formData.workLocation}
                                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="numberOfWorkers" className="text-sm font-semibold">Number of Workers Needed</Label>
                                    <Input
                                        id="numberOfWorkers"
                                        type="number"
                                        min="1"
                                        value={formData.numberOfWorkers}
                                        onChange={(e) => setFormData({ ...formData, numberOfWorkers: parseInt(e.target.value) || 1 })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Schedule */}
                        {currentStep === 3 && (
                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="startDate" className="text-sm font-semibold">Start Date *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="endDate" className="text-sm font-semibold">End Date *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="workingHours" className="text-sm font-semibold">Working Hours</Label>
                                    <Input
                                        id="workingHours"
                                        placeholder="e.g., 8:00 AM - 5:00 PM"
                                        value={formData.workingHours}
                                        onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Compensation */}
                        {currentStep === 4 && (
                            <div className="space-y-5">
                                <div>
                                    <Label htmlFor="wageAmount" className="text-sm font-semibold">Wage Amount (SAR) *</Label>
                                    <Input
                                        id="wageAmount"
                                        type="number"
                                        placeholder="e.g., 150"
                                        value={formData.wageAmount}
                                        onChange={(e) => setFormData({ ...formData, wageAmount: e.target.value })}
                                        className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="wageType" className="text-sm font-semibold">Wage Type *</Label>
                                    <Select value={formData.wageType} onValueChange={(value: "hourly" | "daily" | "fixed") => setFormData({ ...formData, wageType: value })}>
                                        <SelectTrigger className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="fixed">Fixed (Total Project)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Compensation Summary</h3>
                                    </div>
                                    <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <p><span className="font-semibold">Amount:</span> {formData.wageAmount || "—"} SAR</p>
                                        <p><span className="font-semibold">Type:</span> {formData.wageType ? formData.wageType.charAt(0).toUpperCase() + formData.wageType.slice(1) : "—"}</p>
                                        <p><span className="font-semibold">Workers:</span> {formData.numberOfWorkers}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700">
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Previous
                            </Button>

                            {currentStep < 4 ? (
                                <Button
                                    onClick={handleNext}
                                    disabled={!isStepValid()}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Next
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!isStepValid() || createJob.isPending}
                                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    {createJob.isPending ? "Posting..." : "Post Job"}
                                    <Check className="ml-2 h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
