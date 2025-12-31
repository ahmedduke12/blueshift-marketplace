import { useState } from "react";
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

// Mock worker data
const mockWorker = {
    name: "Ahmed Mohammed",
    email: "ahmed.mohammed@example.com",
    phone: "+966 50 123 4567",
    nationality: "Saudi Arabia",
    city: "Riyadh",
    region: "Central",
    dateOfBirth: "1990-05-15",
    iqamaNumber: "2123456789",
    skills: ["Construction", "Carpentry", "Electrical Work"],
    experience: "5 years in construction industry",
    availability: "Weekends and after 5 PM on weekdays",
    certifications: ["Safety Training Certificate", "Forklift Operator License"],
    completedJobs: 12,
    rating: 4.8
};

export default function WorkerProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(mockWorker);

    const handleSave = () => {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
    };

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
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    )}
                </div>

                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{mockWorker.completedJobs}</p>
                                <p className="text-sm text-muted-foreground">Completed Jobs</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{mockWorker.rating} ⭐</p>
                                <p className="text-sm text-muted-foreground">Average Rating</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{mockWorker.skills.length}</p>
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
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="nationality">Nationality</Label>
                                <Input
                                    id="nationality"
                                    value={formData.nationality}
                                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="iqama">Iqama Number</Label>
                                <Input
                                    id="iqama"
                                    value={formData.iqamaNumber}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="w-5 h-5" />
                            Contact Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div>
                                <Label htmlFor="region">Region</Label>
                                <Input
                                    id="region"
                                    value={formData.region}
                                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                    disabled={!isEditing}
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
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="skills">Skills</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.skills.map((skill, index) => (
                                    <Badge key={index} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                            {isEditing && (
                                <p className="text-sm text-muted-foreground mt-2">
                                    Click to add or remove skills
                                </p>
                            )}
                        </div>

                        <Separator />

                        <div>
                            <Label htmlFor="experience">Work Experience</Label>
                            <Textarea
                                id="experience"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                disabled={!isEditing}
                                rows={4}
                                className="mt-2"
                            />
                        </div>

                        <Separator />

                        <div>
                            <Label htmlFor="availability">Availability</Label>
                            <Textarea
                                id="availability"
                                value={formData.availability}
                                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                                disabled={!isEditing}
                                rows={3}
                                className="mt-2"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Certifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            Certifications
                        </CardTitle>
                        <CardDescription>Your professional certifications and licenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {formData.certifications.map((cert, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                                    <Award className="w-4 h-4 text-primary" />
                                    <span>{cert}</span>
                                </div>
                            ))}
                        </div>
                        {isEditing && (
                            <Button variant="outline" className="w-full mt-4">
                                Add Certification
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
