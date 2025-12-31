import { useState } from "react";
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
import { Briefcase, User, MapPin, Phone, Mail, Calendar, Award, Save } from "lucide-react";
import { Link } from "wouter";

export default function WorkerProfile() {
    const { user, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    const { data: worker, refetch } = trpc.worker.getProfile.useQuery(undefined, {
        enabled: !!user
    });

    const [formData, setFormData] = useState({
        primarySkill: worker?.primarySkill || "",
        skills: worker?.skills || [],
        experience: worker?.experience || 0,
        isAvailable: worker?.isAvailable ?? true,
    });

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
        updateWorker.mutate(formData);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user || !worker) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Worker Profile Not Found</CardTitle>
                        <CardDescription>Please create a worker profile first</CardDescription>
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

    // Calculate stats from assignments
    const { data: assignments } = trpc.assignment.list.useQuery(
        { workerId: worker.id },
        { enabled: !!worker.id }
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
                        <p className="text-muted-foreground">Manage your personal information and skills</p>
                    </div>
                    {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave} disabled={updateWorker.isPending}>
                                <Save className="w-4 h-4 mr-2" />
                                {updateWorker.isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    )}
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
                                <p className="text-3xl font-bold">{worker.skills?.length || 0}</p>
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Iqama Number</Label>
                                <Input value={worker.iqamaNumber || "N/A"} disabled />
                            </div>
                            <div>
                                <Label>Nationality</Label>
                                <Input value={worker.nationality || "N/A"} disabled />
                            </div>
                            <div>
                                <Label>Date of Birth</Label>
                                <Input
                                    type="date"
                                    value={worker.dateOfBirth ? new Date(worker.dateOfBirth).toISOString().split('T')[0] : ""}
                                    disabled
                                />
                            </div>
                            <div>
                                <Label>Visa Type</Label>
                                <Input value={worker.visaType || "N/A"} disabled />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills & Experience */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Skills & Experience
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="primarySkill">Primary Skill</Label>
                            <Input
                                id="primarySkill"
                                value={isEditing ? formData.primarySkill : worker.primarySkill || "N/A"}
                                onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                                disabled={!isEditing}
                                className="mt-2"
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label>Additional Skills</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {worker.skills?.map((skill, index) => (
                                    <Badge key={index} variant="secondary">{skill}</Badge>
                                ))}
                                {(!worker.skills || worker.skills.length === 0) && (
                                    <p className="text-sm text-muted-foreground">No additional skills listed</p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label htmlFor="experience">Years of Experience</Label>
                            <Input
                                id="experience"
                                type="number"
                                value={isEditing ? formData.experience : worker.experience || 0}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                                disabled={!isEditing}
                                className="mt-2"
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div>
                                <Label>Availability Status</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {worker.isAvailable ? "Available for work" : "Not available"}
                                </p>
                            </div>
                            <Badge variant={worker.isAvailable ? "default" : "secondary"}>
                                {worker.isAvailable ? "Available" : "Unavailable"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Visa Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Visa Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Visa Type</Label>
                                <p className="text-sm mt-1">{worker.visaType || "N/A"}</p>
                            </div>
                            <div>
                                <Label>Visa Expiry Date</Label>
                                <p className="text-sm mt-1">
                                    {worker.visaExpiryDate
                                        ? new Date(worker.visaExpiryDate).toLocaleDateString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
