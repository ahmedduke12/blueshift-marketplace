import { useState } from "react";
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

// Mock approval requests
const mockRequests = [
    {
        id: 1,
        workerName: "Ahmed Mohammed",
        workerPhone: "+966 50 123 4567",
        jobTitle: "Construction Helper",
        companyName: "ABC Construction Co.",
        wageAmount: 2500,
        wageType: "daily",
        startDate: "2024-02-01",
        endDate: "2024-03-01",
        workLocation: "Riyadh Construction Site",
        status: "pending",
        requestedAt: "2024-01-25T10:30:00"
    },
    {
        id: 2,
        workerName: "Mohammed Ali",
        workerPhone: "+966 55 987 6543",
        jobTitle: "Warehouse Assistant",
        companyName: "Logistics Plus",
        wageAmount: 2000,
        wageType: "daily",
        startDate: "2024-02-05",
        endDate: "2024-04-05",
        workLocation: "Dammam Warehouse",
        status: "pending",
        requestedAt: "2024-01-26T14:15:00"
    }
];

const mockHistory = [
    {
        id: 3,
        workerName: "Khalid Hassan",
        jobTitle: "Delivery Driver",
        companyName: "Fast Delivery Services",
        wageAmount: 180,
        wageType: "hourly",
        status: "approved",
        decidedAt: "2024-01-20T09:00:00",
        notes: "Approved for weekend work only"
    },
    {
        id: 4,
        workerName: "Salem Ahmed",
        jobTitle: "Security Guard",
        companyName: "SecureGuard Inc.",
        wageAmount: 3000,
        wageType: "fixed",
        status: "declined",
        decidedAt: "2024-01-18T16:30:00",
        notes: "Conflicts with primary employment hours"
    }
];

export default function ApprovalDashboard() {
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [notes, setNotes] = useState("");
    const [requests, setRequests] = useState(mockRequests);

    const handleApprove = (requestId: number) => {
        setRequests(requests.filter(r => r.id !== requestId));
        toast.success("Request approved successfully!");
        setSelectedRequest(null);
        setNotes("");
    };

    const handleDecline = (requestId: number) => {
        setRequests(requests.filter(r => r.id !== requestId));
        toast.success("Request declined");
        setSelectedRequest(null);
        setNotes("");
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
                            <div className="text-2xl font-bold">{requests.length}</div>
                            <p className="text-xs text-muted-foreground">Awaiting your decision</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">+2 from last month</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Declined This Month</CardTitle>
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">2</div>
                            <p className="text-xs text-muted-foreground">-1 from last month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="pending" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="pending">
                            Pending ({requests.length})
                        </TabsTrigger>
                        <TabsTrigger value="history">
                            History
                        </TabsTrigger>
                    </TabsList>

                    {/* Pending Requests */}
                    <TabsContent value="pending" className="space-y-4">
                        {requests.length > 0 ? (
                            requests.map((request) => (
                                <Card key={request.id}>
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-lg">{request.workerName}</CardTitle>
                                                <CardDescription>
                                                    Requested {new Date(request.requestedAt).toLocaleDateString()}
                                                </CardDescription>
                                            </div>
                                            <Badge variant="outline">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Pending
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">{request.jobTitle}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                    <span>{request.companyName}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{request.workLocation}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">{request.wageAmount} SAR / {request.wageType}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="default"
                                                        className="flex-1"
                                                        onClick={() => setSelectedRequest(request)}
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Approve Request</DialogTitle>
                                                        <DialogDescription>
                                                            Approve {request.workerName}'s request to work at {request.companyName}
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
                                                                onClick={() => handleApprove(request.id)}
                                                                className="flex-1"
                                                            >
                                                                Confirm Approval
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
                                                        onClick={() => setSelectedRequest(request)}
                                                    >
                                                        <XCircle className="w-4 h-4 mr-2" />
                                                        Decline
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Decline Request</DialogTitle>
                                                        <DialogDescription>
                                                            Decline {request.workerName}'s request to work at {request.companyName}
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
                                                                onClick={() => handleDecline(request.id)}
                                                                className="flex-1"
                                                            >
                                                                Confirm Decline
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
                        {mockHistory.map((item) => (
                            <Card key={item.id}>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{item.workerName}</CardTitle>
                                            <CardDescription>
                                                Decided {new Date(item.decidedAt).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <Badge variant={item.status === 'approved' ? 'default' : 'destructive'}>
                                            {item.status === 'approved' ? (
                                                <><CheckCircle2 className="w-3 h-3 mr-1" /> Approved</>
                                            ) : (
                                                <><XCircle className="w-3 h-3 mr-1" /> Declined</>
                                            )}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            <span className="font-medium">{item.jobTitle}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <User className="w-4 h-4" />
                                            <span>{item.companyName}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                                            <span>{item.wageAmount} SAR / {item.wageType}</span>
                                        </div>
                                    </div>

                                    {item.notes && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm font-medium mb-1">Notes:</p>
                                            <p className="text-sm text-muted-foreground">{item.notes}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
