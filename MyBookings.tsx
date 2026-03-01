import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

type Booking = {
    BookingID: number;
    LotName: string;
    SlotCode: string;
    SlotType: string;
    StartTime: string;
    EndTime: string;
    BookingStatus: string;
};

const MyBookings = () => {
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);

    // TEMP: hard-coded user id for now, later you can replace with logged-in user
    const userId = 1;

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/bookings/user/${userId}`
                );
                if (!res.ok) throw new Error("Failed to load bookings");
                const data = await res.json();
                setBookings(data);
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err.message || "Could not load bookings.",
                    variant: "destructive",
                });
            }
        };

        load();
    }, [toast, userId]);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
                <p className="text-muted-foreground mb-6">
                    See all your current and past parking bookings.
                </p>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Bookings</CardTitle>
                        <CardDescription>
                            {bookings.length === 0
                                ? "You have no bookings yet."
                                : `Total bookings: ${bookings.length}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {bookings.map((b) => (
                                <div
                                    key={b.BookingID}
                                    className="flex items-center justify-between border rounded-2xl px-4 py-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {b.LotName} — {b.SlotCode} ({b.SlotType})
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(b.StartTime).toLocaleString()} →{" "}
                                                {new Date(b.EndTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {b.BookingStatus}
                                    </span>
                                </div>
                            ))}
                            {bookings.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Once you create bookings, they will appear here.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default MyBookings;
