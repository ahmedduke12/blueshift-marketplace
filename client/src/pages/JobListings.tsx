import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, MapPin, DollarSign, Calendar, Search, Filter, Sparkles, TrendingUp, X } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";

export default function JobListings() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sectorFilter, setSectorFilter] = useState<string>("all");
    const [wageTypeFilter, setWageTypeFilter] = useState<string>("all");
    const [cityFilter, setCityFilter] = useState<string>("all");

    const { data: apiJobs, isLoading } = trpc.job.list.useQuery({
        status: "active"
    });

    // Merge API jobs with localStorage demo jobs
    const demoJobs = JSON.parse(localStorage.getItem("demo-jobs") || "[]");
    const jobs = [...(apiJobs || []), ...demoJobs];

    const filteredJobs = jobs?.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSector = sectorFilter === "all" || job.sector === sectorFilter;
        const matchesWageType = wageTypeFilter === "all" || job.wageType === wageTypeFilter;
        const matchesCity = cityFilter === "all" || job.city === cityFilter;

        return matchesSearch && matchesSector && matchesWageType && matchesCity;
    });

    // Extract unique cities from jobs for filter
    const cities = Array.from(new Set(jobs?.map(job => job.city).filter(Boolean))) as string[];

    const hasActiveFilters = searchTerm || sectorFilter !== "all" || wageTypeFilter !== "all" || cityFilter !== "all";

    const clearFilters = () => {
        setSearchTerm("");
        setSectorFilter("all");
        setWageTypeFilter("all");
        setCityFilter("all");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Discover Opportunities</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        Available Jobs
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Find your next opportunity</p>
                </div>

                {/* Filters */}
                <Card className="mb-8 border-2 border-blue-100 dark:border-blue-900 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <Filter className="w-5 h-5 text-white" />
                                </div>
                                <CardTitle className="text-xl">Filter Jobs</CardTitle>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <X className="w-4 h-4 mr-1" />
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Search</label>
                                <div className="relative group">
                                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                    <Input
                                        placeholder="Search jobs..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            {/* Sector Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sector</label>
                                <Select value={sectorFilter} onValueChange={setSectorFilter}>
                                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                                        <SelectValue placeholder="All Sectors" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sectors</SelectItem>
                                        <SelectItem value="construction">Construction</SelectItem>
                                        <SelectItem value="hospitality">Hospitality</SelectItem>
                                        <SelectItem value="retail">Retail</SelectItem>
                                        <SelectItem value="logistics">Logistics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* City Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">City</label>
                                <Select value={cityFilter} onValueChange={setCityFilter}>
                                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                                        <SelectValue placeholder="All Cities" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Cities</SelectItem>
                                        <SelectItem value="Riyadh">Riyadh</SelectItem>
                                        <SelectItem value="Jeddah">Jeddah</SelectItem>
                                        <SelectItem value="Dammam">Dammam</SelectItem>
                                        <SelectItem value="Mecca">Mecca</SelectItem>
                                        <SelectItem value="Medina">Medina</SelectItem>
                                        {cities.map(city => (
                                            !["Riyadh", "Jeddah", "Dammam", "Mecca", "Medina"].includes(city) && (
                                                <SelectItem key={city} value={city}>{city}</SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Wage Type Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Wage Type</label>
                                <Select value={wageTypeFilter} onValueChange={setWageTypeFilter}>
                                    <SelectTrigger className="h-12 border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="daily">Daily</SelectItem>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs?.length || 0}</span> jobs found
                    </p>
                </div>

                {/* Job Listings */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
                            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                    </div>
                ) : filteredJobs && filteredJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredJobs.map((job) => (
                            <Card
                                key={job.id}
                                className="group hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800 hover:-translate-y-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm cursor-pointer"
                            >
                                <Link href={`/jobs/${job.id}`}>
                                    <CardHeader className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                                    {job.title}
                                                </CardTitle>
                                                <CardDescription className="mt-2 line-clamp-2">
                                                    {job.description}
                                                </CardDescription>
                                            </div>
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0 ml-3">
                                                <Briefcase className="w-6 h-6 text-white" />
                                            </div>
                                        </div>

                                        {job.sector && (
                                            <Badge className="w-fit bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 border-0">
                                                {job.sector}
                                            </Badge>
                                        )}
                                    </CardHeader>

                                    <CardContent className="space-y-3">
                                        {job.city && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                                {job.city}
                                            </div>
                                        )}

                                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                SAR {job.wageAmount}
                                            </span>
                                            <span className="ml-1">/ {job.wageType}</span>
                                        </div>

                                        {job.startDate && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                                                {new Date(job.startDate).toLocaleDateString()}
                                            </div>
                                        )}

                                        <Button
                                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                                            asChild
                                        >
                                            <Link href={`/jobs/${job.id}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center mb-4">
                                <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">No jobs found</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                                Try adjusting your filters or check back later for new opportunities
                            </p>
                            {hasActiveFilters && (
                                <Button
                                    onClick={clearFilters}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                >
                                    Clear All Filters
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
