import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { User, Award, Save, Plus, Sparkles, Star, Briefcase, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header userType="worker" />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Page Header */}
                <div className="mb-8">
                    <Button variant="ghost" asChild className="mb-4 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        <Link href="/worker/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Worker Profile</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                {formData.primarySkill ? "Your Profile" : "Create Your Profile"}
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-400">
                                {formData.primarySkill ? "Manage your personal information and skills" : "Complete your profile to get started"}
                            </p>
                        </div>
                        {formData.primarySkill && !isEditing ? (
                            <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                Edit Profile
                            </Button>
                        ) : formData.primarySkill && isEditing ? (
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsEditing(false)} className="border-2 border-gray-200 dark:border-gray-700">
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-200 dark:hover:border-green-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <Briefcase className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{completedJobs}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Completed Jobs</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-yellow-200 dark:hover:border-yellow-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <Star className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                                    {rating > 0 ? `${rating}` : "—"}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Average Rating</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-purple-200 dark:hover:border-purple-800 hover:-translate-y-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formData.skills.length}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Skills</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Personal Information */}
                <Card className="mb-6 border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Personal Information</CardTitle>
                                <CardDescription className="text-base">
                                    {formData.primarySkill ? "Your basic information" : "Complete your profile to get started"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Ahmed Mohammed"
                                    className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="nationality" className="text-sm font-semibold">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="e.g., Saudi Arabia"
                                    className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                    placeholder="+966 50 123 4567"
                                    className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Skills & Experience */}
                <Card className="mb-6 border-2 border-purple-100 dark:border-purple-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">Skills & Experience</CardTitle>
                                <CardDescription className="text-base">Showcase your expertise and experience</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div>
                            <Label htmlFor="primarySkill" className="text-sm font-semibold">Primary Skill *</Label>
                            <Input
                                id="primarySkill"
                                value={formData.primarySkill}
                                onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                                disabled={!isEditing}
                                placeholder="e.g., Construction, Carpentry, Plumbing"
                                className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500"
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label className="text-sm font-semibold">Additional Skills</Label>
                            {isEditing && (
                                <div className="flex gap-2 mt-3 mb-4">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                        className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
                                    />
                                    <Button type="button" onClick={handleAddSkill} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        className={`text-sm px-3 py-1 ${isEditing
                                                ? "cursor-pointer bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-0 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/40 dark:hover:to-pink-800/40"
                                                : "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 border-0"
                                            }`}
                                        onClick={() => isEditing && handleRemoveSkill(skill)}
                                    >
                                        {skill}
                                        {isEditing && <span className="ml-2 font-bold">×</span>}
                                    </Badge>
                                ))}
                                {formData.skills.length === 0 && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {isEditing ? "Add skills to showcase your expertise" : "No additional skills listed"}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <Label htmlFor="experience" className="text-sm font-semibold">Years of Experience *</Label>
                            <Input
                                id="experience"
                                type="number"
                                min="0"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                                disabled={!isEditing}
                                className="mt-2 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500 dark:focus:border-purple-500"
                            />
                        </div>

                        {!formData.primarySkill && (
                            <div className="pt-4">
                                <Button onClick={handleSave} className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300" disabled={!formData.primarySkill}>
                                    <Save className="w-5 h-5 mr-2" />
                                    Create Profile
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {formData.primarySkill && (
                    <Card className="border-2 border-green-100 dark:border-green-900 shadow-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">Getting Started</CardTitle>
                                    <CardDescription className="text-base">Next steps to find work</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Your profile is ready! Here's what you can do next:
                            </p>
                            <div className="space-y-3">
                                <Button asChild className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <Link href="/jobs">Browse Available Jobs</Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full h-12 text-base border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20">
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
