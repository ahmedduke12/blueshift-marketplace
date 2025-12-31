import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Briefcase, User, Award, Save, Plus } from "lucide-react";
import { Link } from "wouter";

export default function WorkerProfile() {
    const [isEditing, setIsEditing] = useState(true); // Start in edit mode for new users
    const [newSkill, setNewSkill] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        primarySkill: "",
        skills: [] as string[],
        experience: 0,
        nationality: "",
        phone: "",
    });

    const handleSave = () => {
        if (!formData.primarySkill) {
            toast.error("Please enter your primary skill");
            return;
        }
        toast.success("Profile saved successfully!");
        setIsEditing(false);
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

    const completedJobs = 0;
    const rating = 0;

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
                            {formData.primarySkill ? "Manage your personal information and skills" : "Create your worker profile"}
                        </p>
                    </div>
                    {formData.primarySkill && !isEditing ? (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    ) : formData.primarySkill && isEditing ? (
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
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
                                <p className="text-3xl font-bold">{rating > 0 ? `${rating} ⭐` : "No ratings yet"}</p>
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
                            {formData.primarySkill ? "Your basic information" : "Complete your profile to get started"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Ahmed Mohammed"
                                />
                            </div>
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Saudi Arabia"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="+966 50 123 4567"
                                />
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
                        <CardDescription>Showcase your expertise and experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="primarySkill">Primary Skill *</Label>
                            <Input
                                id="primarySkill"
                                value={formData.primarySkill}
                                onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                                disabled={!isEditing}
                                placeholder="e.g., Construction, Carpentry, Plumbing"
                                className="mt-2"
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label>Additional Skills</Label>
                            {isEditing && (
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
                                        className={isEditing ? "cursor-pointer" : ""}
                                        onClick={() => isEditing && handleRemoveSkill(skill)}
                                    >
                                        {skill}
                                        {isEditing && <span className="ml-1">×</span>}
                                    </Badge>
                                ))}
                                {formData.skills.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        {isEditing ? "Add skills to showcase your expertise" : "No additional skills listed"}
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
                                disabled={!isEditing}
                                className="mt-2"
                            />
                        </div>

                        {!formData.primarySkill && (
                            <div className="pt-4">
                                <Button onClick={handleSave} className="w-full" disabled={!formData.primarySkill}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Profile
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {formData.primarySkill && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Getting Started</CardTitle>
                            <CardDescription>Next steps to find work</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Your profile is ready! Here's what you can do next:
                            </p>
                            <div className="space-y-2">
                                <Button asChild className="w-full">
                                    <Link href="/jobs">Browse Available Jobs</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href="/worker/dashboard">Go to Dashboard</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
