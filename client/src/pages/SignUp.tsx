import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building2, User, Mail, Lock, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SignUp() {
    const [, setLocation] = useLocation();
    const [activeTab, setActiveTab] = useState("worker");

    // Check URL parameter for tab
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "company" || tab === "worker") {
            setActiveTab(tab);
        }
    }, []);

    const [workerData, setWorkerData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [companyData, setCompanyData] = useState({
        companyName: "",
        email: "",
        phone: "",
        crNumber: "",
        password: "",
        confirmPassword: ""
    });

    const handleWorkerSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (workerData.password !== workerData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        toast.success("Worker account created! Redirecting...");
        setTimeout(() => setLocation("/worker/dashboard"), 1500);
    };

    const handleCompanySignUp = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyData.password !== companyData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        toast.success("Company account created! Redirecting...");
        setTimeout(() => setLocation("/company/dashboard"), 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header with clickable logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <div className="flex items-center justify-center space-x-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold">BlueShift</span>
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                    <p className="text-muted-foreground">Choose your account type to get started</p>
                </div>

                {/* Back to Home Button - More Visible */}
                <div className="mb-6">
                    <Button variant="outline" asChild className="w-full">
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Sign Up Forms */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="worker" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Worker
                        </TabsTrigger>
                        <TabsTrigger value="company" className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            Company
                        </TabsTrigger>
                    </TabsList>

                    {/* Worker Sign Up */}
                    <TabsContent value="worker">
                        <Card>
                            <CardHeader>
                                <CardTitle>Worker Sign Up</CardTitle>
                                <CardDescription>Create your worker account to find jobs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleWorkerSignUp} className="space-y-4">
                                    <div>
                                        <Label htmlFor="worker-name">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="worker-name"
                                                placeholder="Ahmed Mohammed"
                                                className="pl-9"
                                                value={workerData.name}
                                                onChange={(e) => setWorkerData({ ...workerData, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="worker-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="worker-email"
                                                type="email"
                                                placeholder="ahmed@example.com"
                                                className="pl-9"
                                                value={workerData.email}
                                                onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="worker-phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="worker-phone"
                                                type="tel"
                                                placeholder="+966 50 123 4567"
                                                className="pl-9"
                                                value={workerData.phone}
                                                onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="worker-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="worker-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                                value={workerData.password}
                                                onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="worker-confirm-password">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="worker-confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                                value={workerData.confirmPassword}
                                                onChange={(e) => setWorkerData({ ...workerData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Create Worker Account <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Company Sign Up */}
                    <TabsContent value="company">
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Sign Up</CardTitle>
                                <CardDescription>Register your company to post jobs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCompanySignUp} className="space-y-4">
                                    <div>
                                        <Label htmlFor="company-name">Company Name</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company-name"
                                                placeholder="ABC Construction Co."
                                                className="pl-9"
                                                value={companyData.companyName}
                                                onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-cr">CR Number</Label>
                                        <Input
                                            id="company-cr"
                                            placeholder="1234567890"
                                            value={companyData.crNumber}
                                            onChange={(e) => setCompanyData({ ...companyData, crNumber: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company-email"
                                                type="email"
                                                placeholder="contact@company.com"
                                                className="pl-9"
                                                value={companyData.email}
                                                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company-phone"
                                                type="tel"
                                                placeholder="+966 11 123 4567"
                                                className="pl-9"
                                                value={companyData.phone}
                                                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                                value={companyData.password}
                                                onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="company-confirm-password">Confirm Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="company-confirm-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-9"
                                                value={companyData.confirmPassword}
                                                onChange={(e) => setCompanyData({ ...companyData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Create Company Account <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Sign In Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/signin" className="text-primary hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
