import { Briefcase, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface HeaderProps {
    /** User type: 'worker', 'company', or undefined for not logged in */
    userType?: "worker" | "company";
    /** Show navigation links */
    showNav?: boolean;
    /** Custom navigation items */
    navItems?: Array<{ label: string; href: string; variant?: "default" | "ghost" | "outline" }>;
}

export default function Header({ userType: propUserType, showNav = true, navItems }: HeaderProps) {
    const [detectedUserType, setDetectedUserType] = useState<"worker" | "company" | undefined>(propUserType);
    const [, setLocation] = useLocation();

    useEffect(() => {
        // If userType is not provided as prop, detect from localStorage
        if (!propUserType) {
            const demoUserStr = localStorage.getItem("demo-user");
            if (demoUserStr) {
                try {
                    const demoUser = JSON.parse(demoUserStr);
                    if (demoUser.role === "worker") {
                        setDetectedUserType("worker");
                    } else if (demoUser.role === "company_admin") {
                        setDetectedUserType("company");
                    }
                } catch (e) {
                    console.error("Error parsing demo user:", e);
                }
            }
        } else {
            setDetectedUserType(propUserType);
        }
    }, [propUserType]);

    const userType = detectedUserType;

    const handleLogout = () => {
        localStorage.removeItem("demo-user");
        setLocation("/");
    };

    // Determine home link based on user type
    const homeLink = userType === "worker"
        ? "/worker/dashboard"
        : userType === "company"
            ? "/company/dashboard"
            : "/";

    // Default navigation items based on user type
    const defaultNavItems = userType === "worker"
        ? [
            { label: "Dashboard", href: "/worker/dashboard", variant: "ghost" as const },
            { label: "Browse Jobs", href: "/jobs", variant: "ghost" as const },
            { label: "Profile", href: "/worker/profile", variant: "default" as const },
        ]
        : userType === "company"
            ? [
                { label: "Dashboard", href: "/company/dashboard", variant: "ghost" as const },
                { label: "Post Job", href: "/jobs/post", variant: "default" as const },
                { label: "Approvals", href: "/approvals", variant: "outline" as const },
            ]
            : [
                { label: "Browse Jobs", href: "/jobs", variant: "ghost" as const },
                { label: "Sign In", href: "/signin", variant: "ghost" as const },
                { label: "Sign Up", href: "/signup", variant: "default" as const },
            ];

    const displayNavItems = navItems || defaultNavItems;

    return (
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href={homeLink}>
                        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold">BlueShift</span>
                        </div>
                    </Link>

                    {/* Navigation */}
                    {showNav && (
                        <div className="flex items-center space-x-4">
                            {displayNavItems.map((item, index) => (
                                <Button
                                    key={index}
                                    asChild
                                    size="sm"
                                    variant={item.variant || "ghost"}
                                >
                                    <Link href={item.href}>{item.label}</Link>
                                </Button>
                            ))}

                            {/* Sign Out button for logged-in users */}
                            {userType && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
