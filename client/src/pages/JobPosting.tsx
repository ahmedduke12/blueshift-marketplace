import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";

const steps = [
    { id: 1, name: "Basic Info", description: "Job title and description" },
    { id: 2, name: "Requirements", description: "Skills and qualifications" },
    { id: 3, name: "Schedule", description: "Dates and working hours" },
    { id: 4, name: "Compensation", description: "Wage and benefits" },
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
        onError: (error) => {
            toast.error(error.message || "Failed to post job");
        }
    });

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
        <div className="min-h-screen bg-background">
            <Header userType="company" />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
                    <p className="text-muted-foreground">Fill in the details to create a job posting</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${currentStep > step.id ? 'bg-primary border-primary text-primary-foreground' :
                                        currentStep === step.id ? 'border-primary text-primary' :
                                            'border-muted text-muted-foreground'
                                        }`}>
                                        {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                                    </div>
                                    <div className="text-center mt-2">
                                        <p className="text-sm font-medium">{step.name}</p>
                                        <p className="text-xs text-muted-foreground hidden md:block">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`h-0.5 flex-1 mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-muted'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Steps */}
                <Card>
                    <CardHeader>
                        <CardTitle>{steps[currentStep - 1].name}</CardTitle>
                        <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="title">Job Title *</Label>
                                    <Input
                                        id="title"
                                        placeholder="e.g., Construction Helper"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="sector">Sector *</Label>
                                    <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select sector" />
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
                                    <Label htmlFor="description">Job Description *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={6}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Requirements */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="workLocation">Work Location *</Label>
                                    <Input
                                        id="workLocation"
                                        placeholder="e.g., Construction Site, Downtown Office"
                                        value={formData.workLocation}
                                        onChange={(e) => setFormData({ ...formData, workLocation: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            placeholder="e.g., Riyadh"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="region">Region</Label>
                                        <Input
                                            id="region"
                                            placeholder="e.g., Central"
                                            value={formData.region}
                                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="numberOfWorkers">Number of Workers Needed</Label>
                                    <Input
                                        id="numberOfWorkers"
                                        type="number"
                                        min="1"
                                        value={formData.numberOfWorkers}
                                        onChange={(e) => setFormData({ ...formData, numberOfWorkers: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="requirements">Skills & Requirements</Label>
                                    <Textarea
                                        id="requirements"
                                        placeholder="List any specific skills, certifications, or experience required..."
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                        rows={4}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Schedule */}
                        {currentStep === 3 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate">Start Date *</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate">End Date *</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="workingHours">Working Hours *</Label>
                                    <Input
                                        id="workingHours"
                                        placeholder="e.g., 8:00 AM - 4:00 PM"
                                        value={formData.workingHours}
                                        onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                                    />
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Specify the daily working hours for this job
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Compensation */}
                        {currentStep === 4 && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="wageAmount">Wage Amount (SAR) *</Label>
                                        <Input
                                            id="wageAmount"
                                            type="number"
                                            placeholder="e.g., 2500"
                                            value={formData.wageAmount}
                                            onChange={(e) => setFormData({ ...formData, wageAmount: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="wageType">Wage Type *</Label>
                                        <Select value={formData.wageType} onValueChange={(value) => setFormData({ ...formData, wageType: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="hourly">Hourly</SelectItem>
                                                <SelectItem value="daily">Daily</SelectItem>
                                                <SelectItem value="fixed">Fixed (Total)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="p-4 bg-muted rounded-lg">
                                    <h3 className="font-medium mb-2">Job Summary</h3>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="text-muted-foreground">Title:</span> {formData.title || "Not set"}</p>
                                        <p><span className="text-muted-foreground">Sector:</span> {formData.sector || "Not set"}</p>
                                        <p><span className="text-muted-foreground">Location:</span> {formData.city || "Not set"}</p>
                                        <p><span className="text-muted-foreground">Duration:</span> {formData.startDate && formData.endDate ? `${formData.startDate} to ${formData.endDate}` : "Not set"}</p>
                                        <p><span className="text-muted-foreground">Wage:</span> {formData.wageAmount ? `${formData.wageAmount} SAR / ${formData.wageType}` : "Not set"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-6">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {currentStep < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={!isStepValid()}
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!isStepValid()}
                        >
                            <Check className="w-4 h-4 mr-2" />
                            Post Job
                        </Button>
                    )}
                </div>
            </main>
        </div>
    );
}
