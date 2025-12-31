import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Briefcase, CheckCircle2, XCircle, Clock, User, MapPin, DollarSign, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function ApprovalDashboard() {
    const { user, loading } = useAuth();
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [notes, setNotes] = useState("");

    // Get company for current user (assuming they're a company admin)
    const { data: companies } = trpc.company.list.useQuery(undefined, {
        enabled: !!user
    });
    const sponsorCompanyId = companies?.[0]?.id;

    // Fetch pending approvals
    const { data: pendingApprovals, refetch } = trpc.approval.getPendingApprovals.useQuery(
        { sponsorCompanyId: sponsorCompanyId! },
        { enabled: !!sponsorCompanyId }
    );

    const approveAssignment = trpc.approval.approve.useMutation({
        onSuccess: () => {
            toast.success("Request approved successfully!");
            setSelectedRequest(null);
            setNotes("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to approve request");
        }
    });

    const declineAssignment = trpc.approval.decline.useMutation({
        onSuccess: () => {
            toast.success("Request declined");
            setSelectedRequest(null);
            setNotes("");
            refetch();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to decline request");
        }
    });

    const handleApprove = (assignmentId: number) => {
        approveAssignment.mutate({
            assignmentId,
            notes: notes || undefined
        });
    };

    const handleDecline = (assignmentId: number) => {
        declineAssignment.mutate({
            assignmentId,
            notes: notes || undefined
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>Please sign in to access the approval dashboard</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/">Go to Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const pendingCount = pendingApprovals?.length || 0;

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
                            <Link href="/company/dashboard">
                                <Button variant="ghost">Dashboard</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Approval Dashboard</h1>
                    <p className="text-muted-foreground">Review and manage worker assignment requests</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">Awaiting your decision</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">Coming soon</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Declined This Month</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">Coming soon</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="pending" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending ({pendingCount})
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Requests */}
                    <TabsContent value="pending" className="space-y-4">
                        {pendingApprovals && pendingApprovals.length > 0 ? (
                            pendingApprovals.map((approval: any) => (
                                <Card key={approval.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">Assignment Request #{approval.assignmentId}</CardTitle>
                                                <CardDescription>
                                                    Requested {new Date(approval.createdAt || Date.now()).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                <span className="font-medium">Assignment ID: {approval.assignmentId}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                <span>Sponsor Company ID: {approval.sponsorCompanyId}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="default"
                                                        className="flex-1"
                                                        onClick={() => setSelectedRequest(approval)}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Approve Request</DialogTitle>
                                                        <DialogDescription>
                                                            Approve assignment request #{approval.assignmentId}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="approvalNotes">Notes (Optional)</Label>
                                                            <Textarea
                                                                id="approvalNotes"
                                                                placeholder="Add any conditions or notes..."
                                                                value={notes}
                                                                onChange={(e) => setNotes(e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => handleApprove(approval.assignmentId)}
                                                                className="flex-1"
                                                                disabled={approveAssignment.isPending}
                                                            >
                                                                {approveAssignment.isPending ? "Approving..." : "Confirm Approval"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => setSelectedRequest(approval)}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Decline
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Decline Request</DialogTitle>
                                                        <DialogDescription>
                                                            Decline assignment request #{approval.assignmentId}
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label htmlFor="declineReason">Reason (Optional)</Label>
                                                            <Textarea
                                                                id="declineReason"
                                                                placeholder="Explain why you're declining this request..."
                                                                value={notes}
                                                                onChange={(e) => setNotes(e.target.value)}
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="destructive"
                                                                onClick={() => handleDecline(approval.assignmentId)}
                                                                className="flex-1"
                                                                disabled={declineAssignment.isPending}
                                                            >
                                                                {declineAssignment.isPending ? "Declining..." : "Confirm Decline"}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                                    <p className="text-muted-foreground">
                                        All approval requests have been processed
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* History */}
                    <TabsContent value="history" className="space-y-4">
                        <Card>
                            <CardContent className="text-center py-12">
                                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                <h3 className="text-lg font-medium mb-2">History coming soon</h3>
                                <p className="text-muted-foreground">
                                    View your past approval decisions here
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
