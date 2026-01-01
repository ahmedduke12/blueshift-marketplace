import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, Building2, User, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
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

        // Store demo user in localStorage
        const demoUser = {
            id: 1,
            name: "Demo Worker",
            email: workerData.email,
            role: "worker"
        };
        localStorage.setItem("demo-user", JSON.stringify(demoUser));

        toast.success("Welcome back! Redirecting...");
        setTimeout(() => setLocation("/worker/dashboard"), 1500);
    };

    const handleCompanySignIn = (e: React.FormEvent) => {
        e.preventDefault();

        // Store demo user in localStorage
        const demoUser = {
            id: 1,
            name: "Demo Company",
            email: companyData.email,
            role: "company_admin"
        };
        localStorage.setItem("demo-user", JSON.stringify(demoUser));

        toast.success("Welcome back! Redirecting...");
        setTimeout(() => setLocation("/company/dashboard"), 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link href="/">
                        <div className="flex items-center justify-center space-x-3 mb-6 group cursor-pointer">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                                <Briefcase className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                BlueShift
                            </span>
                        </div>
                    </Link>
                    <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        Sign in to your account
                    </p>
                </div>

                {/* Sign In Forms */}
                <Tabs defaultValue="worker" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-2 border-blue-100 dark:border-blue-900">
                        <TabsTrigger
                            value="worker"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                        >
                            <User className="w-4 h-4" />
                            Worker
                        </TabsTrigger>
                        <TabsTrigger
                            value="company"
                            className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                        >
                            <Building2 className="w-4 h-4" />
                            Company
                        </TabsTrigger>
                    </TabsList>

                    {/* Worker Sign In */}
                    <TabsContent value="worker" className="animate-fade-in">
                        <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Worker Sign In
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Access your worker dashboard
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleWorkerSignIn} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="worker-email" className="text-sm font-semibold">Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="worker-email"
                                                type="email"
                                                placeholder="ahmed@example.com"
                                                className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                                                value={workerData.email}
                                                onChange={(e) => setWorkerData({ ...workerData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="worker-password" className="text-sm font-semibold">Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="worker-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                                                value={workerData.password}
                                                onChange={(e) => setWorkerData({ ...workerData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                                    >
                                        Sign In
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Company Sign In */}
                    <TabsContent value="company" className="animate-fade-in">
                        <Card className="border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                            <CardHeader className="space-y-1 pb-4">
                                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Company Sign In
                                </CardTitle>
                                <CardDescription className="text-base">
                                    Access your company dashboard
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCompanySignIn} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="company-email" className="text-sm font-semibold">Email</Label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="company-email"
                                                type="email"
                                                placeholder="contact@company.com"
                                                className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                                                value={companyData.email}
                                                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="company-password" className="text-sm font-semibold">Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                            <Input
                                                id="company-password"
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                                                value={companyData.password}
                                                onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                                    >
                                        Sign In
                                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Sign Up Link */}
                <div className="text-center mt-6 animate-fade-in-delay">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-4 animate-fade-in-delay-2">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 inline-flex items-center gap-2 hover:gap-3 transition-all">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
