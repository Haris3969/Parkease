import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    LogOut,
    ParkingSquare,
    Car,
    MapPin,
    DollarSign,
    Calendar,
} from "lucide-react";

const API_BASE = "http://localhost:5000/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalSlots: 0,
        availableSlots: 0,
        myBookings: 0,
        myVehicles: 0,
    });

    /* ===========================
       LOAD DASHBOARD DATA
    ============================ */
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/auth");
            return;
        }

        fetch(`${API_BASE}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                const contentType = res.headers.get("content-type") || "";
                if (!contentType.includes("application/json")) {
                    const text = await res.text();
                    throw new Error("Invalid API response: " + text.slice(0, 80));
                }

                const data = await res.json();

                if (!res.ok) throw new Error(data.message || "Failed to load dashboard");

                setStats({
                    totalSlots: data.stats?.slots || 0,
                    availableSlots: data.stats?.available || 0,
                    myBookings: data.stats?.bookings || 0,
                    myVehicles: data.stats?.vehicles || 0,
                });
            })
            .catch((err: any) => {
                toast({
                    title: "Dashboard Error",
                    description: err.message,
                    variant: "destructive",
                });

                localStorage.removeItem("token");
                navigate("/auth");
            })
            .finally(() => setLoading(false));
    }, [navigate, toast]);

    /* ===========================
       LOGOUT
    ============================ */
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/auth");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-xl text-muted-foreground">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <ParkingSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">ParkEase</h1>
                            <p className="text-sm text-muted-foreground">
                                Smart Parking Management
                            </p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
                    <p className="text-muted-foreground">
                        Here's your parking overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="shadow-soft hover:shadow-medium transition-shadow">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                            <CardTitle className="text-sm font-medium">
                                Total Slots
                            </CardTitle>
                            <ParkingSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {stats.totalSlots}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Across all lots
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft hover:shadow-medium transition-shadow">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                            <CardTitle className="text-sm font-medium">
                                Available Now
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-success">
                                {stats.availableSlots}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ready to book
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft hover:shadow-medium transition-shadow">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                            <CardTitle className="text-sm font-medium">
                                My Bookings
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent">
                                {stats.myBookings}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Active & completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-soft hover:shadow-medium transition-shadow">
                        <CardHeader
                            className="flex flex-row items-center justify-between space-y-0 pb-2"
                        >
                            <CardTitle className="text-sm font-medium">
                                My Vehicles
                            </CardTitle>
                            <Car className="h-4 w-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-warning">
                                {stats.myVehicles}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Registered vehicles
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Get started with common tasks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate("/find-slot")}
                            >
                                <ParkingSquare className="mr-2 h-4 w-4" />
                                Find Available Slot
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate("/bookings")}
                            >
                                <Calendar className="mr-2 h-4 w-4" />
                                View My Bookings
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate("/vehicles")}
                            >
                                <Car className="mr-2 h-4 w-4" />
                                Manage Vehicles
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate("/payments")}
                            >
                                <DollarSign className="mr-2 h-4 w-4" />
                                Payment History
                            </Button>
                            <Button
                                className="w-full justify-start"
                                variant="outline"
                                onClick={() => navigate("/premium-booking")}
                            >
                                <ParkingSquare className="mr-2 h-4 w-4 text-warning" />
                                Premium Pre-Booking
                            </Button>

                        </CardContent>
                    </Card>

                    <Card className="shadow-soft">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Your latest parking activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                                            <ParkingSquare className="w-4 h-4 text-success" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                No recent activity
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Book your first slot!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
