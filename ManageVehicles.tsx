import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Car } from "lucide-react";

type Vehicle = {
    VehicleID: number;
    PlateNumber: string;
    Make: string | null;
    Model: string | null;
};

const ManageVehicles = () => {
    const { toast } = useToast();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const userId = 1; // TODO: replace with logged-in user

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/vehicles/user/${userId}`
                );
                if (!res.ok) throw new Error("Failed to load vehicles");
                const data = await res.json();
                setVehicles(data);
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err.message || "Could not load vehicles.",
                    variant: "destructive",
                });
            }
        };

        load();
    }, [toast, userId]);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Manage Vehicles</h1>
                <p className="text-muted-foreground mb-6">
                    View and manage your registered vehicles.
                </p>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>My Vehicles</CardTitle>
                        <CardDescription>
                            {vehicles.length === 0
                                ? "No vehicles registered yet."
                                : `Total vehicles: ${vehicles.length}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {vehicles.map((v) => (
                                <div
                                    key={v.VehicleID}
                                    className="flex items-center justify-between border rounded-2xl px-4 py-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                                            <Car className="w-5 h-5 text-warning" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{v.PlateNumber}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {v.Make ?? "Unknown"} {v.Model ?? ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {vehicles.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Later you can add a form here to register new vehicles.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default ManageVehicles;
