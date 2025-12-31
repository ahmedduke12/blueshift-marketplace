import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Briefcase, User, Award, Save, Plus } from "lucide-react";
import { Link } from "wouter";

export default function WorkerProfile() {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState("");

    // Use mock worker ID for demo
    const mockWorkerId = 1;

    const { data: worker, refetch } = trpc.worker.getById.useQuery(
        { id: mockWorkerId },
        { enabled: true }
    );

    const [formData, setFormData] = useState({
        primarySkill: "",
        skills: [] as string[],
        experience: 0,
        nationality: "",
        phone: "",
    });

    // Update form data when worker data loads
    useEffect(() => {
        if (worker) {
            setFormData({
                primarySkill: worker.primarySkill || "",
                skills: worker.skills || [],
                experience: worker.experience || 0,
                nationality: worker.nationality || "",
                phone: "",
            });
        }
    }, [worker]);

    const updateWorker = trpc.worker.update.useMutation({
        onSuccess: () => {
            toast.success("Profile updated successfully!");
            setIsEditing(false);
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update profile");
        }
    });

    const handleSave = () => {
        if (!worker) {
            toast.error("Please fill in all required fields");
            return;
        }
        updateWorker.mutate({
            id: worker.id,
            primarySkill: formData.primarySkill,
            experience: formData.experience,
        });
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData({
                ...formData,
                skills: [...formData.skills, newSkill.trim()]
            });
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToRemove)
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Calculate stats from assignments
    const { data: assignments } = trpc.assignment.list.useQuery(
        { workerId: worker?.id || mockWorkerId },
        { enabled: true }
    );

    const completedJobs = assignments?.filter(a => a.status === 'completed').length || 0;
    const rating = 4.8; // TODO: Calculate from reviews when implemented

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
                            <Link href="/worker/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                            <Link href="/jobs">
                                <Button variant="ghost">Browse Jobs</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Worker Profile</h1>
                        <p className="text-muted-foreground">
                            {worker ? "Manage your personal information and skills" : "Create your worker profile"}
                        </p>
                    </div>
                    {worker && !isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    ) : worker && isEditing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={updateWorker.isPending}>
                                <Save className="w-4 h-4 mr-2" />
                                {updateWorker.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    ) : null}
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{completedJobs}</p>
                                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{rating} ⭐</p>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{formData.skills.length}</p>
                                <p className="text-sm text-muted-foreground">Skills</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Personal Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>
                            {worker ? "Your basic information" : "Complete your profile to get started"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={isEditing || !worker ? formData.nationality : worker.nationality || "N/A"}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    disabled={!isEditing && !!worker}
                                    placeholder="e.g., Saudi Arabia"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing && !!worker}
                                    placeholder="+966 50 123 4567"
                                />
                            </div>
                        </div>
                        {!worker && (
                            <p className="text-sm text-muted-foreground">
                                Additional information like Iqama number and visa details can be added later
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Skills & Experience */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Skills & Experience
                        </CardTitle>
                        <CardDescription>Showcase your expertise and experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="primarySkill">Primary Skill *</Label>
                            <Input
                                id="primarySkill"
                                value={formData.primarySkill}
                                onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                                disabled={!isEditing && !!worker}
                                placeholder="e.g., Construction, Carpentry, Plumbing"
                                className="mt-2"
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label>Additional Skills</Label>
                            {(isEditing || !worker) && (
                                <div className="flex gap-2 mt-2 mb-3">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                    />
                                    <Button type="button" onClick={handleAddSkill} size="sm">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="cursor-pointer"
                                        onClick={() => (isEditing || !worker) && handleRemoveSkill(skill)}
                                    >
                                        {skill}
                                        {(isEditing || !worker) && <span className="ml-1">×</span>}
                                    </Badge>
                                ))}
                                {formData.skills.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {isEditing || !worker ? "Add skills to showcase your expertise" : "No additional skills listed"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label htmlFor="experience">Years of Experience *</Label>
                            <Input
                                id="experience"
                                type="number"
                                min="0"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                disabled={!isEditing && !!worker}
                                className="mt-2"
                            />
                        </div>

                        {!worker && (
                            <div className="pt-4">
                                <Button onClick={handleSave} className="w-full" disabled={!formData.primarySkill || updateWorker.isPending}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {updateWorker.isPending ? "Creating Profile..." : "Create Profile"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {worker && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Visa Information</CardTitle>
                            <CardDescription>Your visa and work permit details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Visa Type</Label>
                                    <p className="text-sm mt-1">{worker.visaType || "Not specified"}</p>
                                </div>
                                <div>
                                    <Label>Visa Expiry Date</Label>
                                    <p className="text-sm mt-1">
                                        {worker.visaExpiryDate
                                            ? new Date(worker.visaExpiryDate).toLocaleDateString()
                                            : "Not specified"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
