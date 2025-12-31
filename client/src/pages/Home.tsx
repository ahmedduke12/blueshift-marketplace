import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import {
  Building2,
  Users,
  CheckCircle2,
  Shield,
  TrendingUp,
  Clock,
  ArrowRight,
  Briefcase,
  UserCheck,
  BarChart3,
  FileCheck
} from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // TODO: Add dashboard links once dashboard pages are created
  // For now, show landing page to all users

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">BlueShift</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Browse Jobs
            </Link>
            <Button asChild size="sm" variant="ghost">
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground">
              After-Hours Worker
              <span className="block text-primary mt-2">Marketplace</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Connect businesses with skilled workers for after-hours jobs — with full digital approval from sponsors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/jobs">
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A compliant marketplace connecting workers and businesses with proper sponsor approval
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Sponsor Approval</CardTitle>
                <CardDescription>
                  Workers can only accept jobs after their sponsor digitally approves the request.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>After-Hours Focus</CardTitle>
                <CardDescription>
                  Jobs are scheduled outside primary working hours to ensure compliance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Skill Matching</CardTitle>
                <CardDescription>
                  Smart matching connects the right workers with the right opportunities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* For Sponsors */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="animate-slide-up">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                For Sponsors
              </div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Business Owners</h2>
              <ul className="space-y-4">
                {[
                  "Manage your sponsored workers",
                  "Approve or decline work requests",
                  "Post jobs and find extra help",
                  "Set conditions for approval",
                  "Track all worker activities"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/signup?tab=company">Join as Sponsor</Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-primary opacity-10 absolute inset-0"></div>
              <div className="relative p-8">
                <Building2 className="w-full h-full text-primary opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Workers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="relative order-2 md:order-1">
              <div className="aspect-square rounded-2xl bg-gradient-primary opacity-10 absolute inset-0"></div>
              <div className="relative p-8">
                <Users className="w-full h-full text-primary opacity-20" />
              </div>
            </div>
            <div className="animate-slide-up order-1 md:order-2">
              <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                For Workers
              </div>
              <h2 className="text-4xl font-bold mb-6 text-foreground">Skilled Professionals</h2>
              <ul className="space-y-4">
                {[
                  "Find after-hours opportunities",
                  "Request sponsor approval easily",
                  "Showcase your skills",
                  "Set your availability",
                  "Earn extra income compliantly"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-lg text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" className="mt-8" asChild>
                <Link href="/signup?tab=worker">Join as Worker</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Built for Compliance</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automated regulatory checks ensure every transaction meets Ajeer and Qiwa requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Shield, title: "Worker Eligibility", desc: "Automated verification" },
              { icon: FileCheck, title: "Visa Validity", desc: "Real-time checks" },
              { icon: BarChart3, title: "Nitaqat Status", desc: "Company compliance" },
              { icon: CheckCircle2, title: "WPS Compliant", desc: "Payroll standards" }
            ].map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join BlueShift today and experience the future of compliant after-hours work.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/signup">
              Create Your Account <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">BlueShift</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 BlueShift. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
