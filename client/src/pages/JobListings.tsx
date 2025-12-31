import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter } from "lucide-react";
import { Link } from "wouter";

export default function JobListings() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sectorFilter, setSectorFilter] = useState<string>("all");
    const [wageTypeFilter, setWageTypeFilter] = useState<string>("all");

    const { data: jobs, isLoading } = trpc.job.list.useQuery({
        status: "active"
    });

    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = sectorFilter === "all" || job.sector === sectorFilter;
        const matchesWageType = wageTypeFilter === "all" || job.wageType === wageTypeFilter;

        return matchesSearch && matchesSector && matchesWageType;
    });

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
                            <Link href="/">
                                <Button variant="ghost">Home</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Available Jobs</h1>
                    <p className="text-muted-foreground">Find your next opportunity</p>
                </div>

                {/* Filters */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Filters
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search jobs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <Select value={sectorFilter} onValueChange={setSectorFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Sectors" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sectors</SelectItem>
                                    <SelectItem value="construction">Construction</SelectItem>
                                    <SelectItem value="hospitality">Hospitality</SelectItem>
                                    <SelectItem value="retail">Retail</SelectItem>
                                    <SelectItem value="logistics">Logistics</SelectItem>
                                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={wageTypeFilter} onValueChange={setWageTypeFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Wage Types" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Wage Types</SelectItem>
                                    <SelectItem value="hourly">Hourly</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Job Listings */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : filteredJobs && filteredJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => (
                            <Card key={job.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <CardTitle className="text-lg">{job.title}</CardTitle>
                                        <Badge variant="secondary">{job.status}</Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {job.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <DollarSign className="w-4 h-4" />
                                            <span className="font-medium text-foreground">
                                                {job.wageAmount} SAR
                                            </span>
                                            <span>/ {job.wageType}</span>
                                        </div>

                                        {job.city && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.city}{job.region && `, ${job.region}`}</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(job.startDate).toLocaleDateString()}</span>
                                        </div>

                                        {job.sector && (
                                            <Badge variant="outline" className="mt-2">
                                                {job.sector}
                                            </Badge>
                                        )}
                                    </div>

                                    <Button asChild className="w-full">
                                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm || sectorFilter !== "all" || wageTypeFilter !== "all"
                                    ? "Try adjusting your filters"
                                    : "No jobs are currently available"}
                            </p>
                            {(searchTerm || sectorFilter !== "all" || wageTypeFilter !== "all") && (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSectorFilter("all");
                                        setWageTypeFilter("all");
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
