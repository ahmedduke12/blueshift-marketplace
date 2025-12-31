import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building2, User, Mail, Lock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function SignIn() {
    const [, setLocation] = useLocation();
    const [workerData, setWorkerData] = useState({
        email: "",
        password: ""
    });

    const [companyData, setCompanyData] = useState({
        email: "",
        password: ""
    });

    const handleWorkerSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual sign in logic
        toast.success("Welcome back! Redirecting...");
        setTimeout(() => setLocation("/worker/dashboard"), 1500);
    };

    const handleCompanySignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual sign in logic
        toast.success("Welcome back! Redirecting...");
        setTimeout(() => setLocation("/company/dashboard"), 1500);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <span className="text-2xl font-bold">BlueShift</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to your account</p>
                </div>

                {/* Sign In Forms */}
                <Tabs defaultValue="worker" className="w-full">
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

                    {/* Worker Sign In */}
                    <TabsContent value="worker">
                        <Card>
                            <CardHeader>
                                <CardTitle>Worker Sign In</CardTitle>
                                <CardDescription>Access your worker dashboard</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleWorkerSignIn} className="space-y-4">
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

                                    <div className="flex items-center justify-between">
                                        <a href="#" className="text-sm text-primary hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Sign In <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Company Sign In */}
                    <TabsContent value="company">
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Sign In</CardTitle>
                                <CardDescription>Access your company dashboard</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCompanySignIn} className="space-y-4">
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

                                    <div className="flex items-center justify-between">
                                        <a href="#" className="text-sm text-primary hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <Button type="submit" className="w-full">
                                        Sign In <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-4">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
