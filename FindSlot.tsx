import { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ParkingSquare, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Slot = {
    SlotID: number;
    SlotCode: string;
    SlotType: string;
    LevelNumber: number;
    LotName: string;
};

const FindSlot = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);

    // TEMP: demo user & vehicle (MSSQL IDs)
    const userId = 1;
    const vehicleId = 1;

    const handleSearch = async () => {
        if (!startTime || !endTime) {
            toast({
                title: "Missing values",
                description: "Please select both start and end time.",
                variant: "destructive",
            });
            return;
        }

        try {
            setLoadingSlots(true);
            const params = new URLSearchParams({
                startTime,
                endTime,
            });

            const res = await fetch(
                `http://localhost:5000/api/slots/available?${params.toString()}`
            );

            if (!res.ok) {
                throw new Error("Failed to load available slots");
            }

            const data = await res.json();
            setSlots(data);
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Could not load slots.",
                variant: "destructive",
            });
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBook = async (slot: Slot) => {
        if (!startTime || !endTime) {
            toast({
                title: "Missing values",
                description:
                    "Please select start and end time before booking a slot.",
                variant: "destructive",
            });
            return;
        }

        try {
            setBookingSlotId(slot.SlotID);

            const res = await fetch("http://localhost:5000/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    vehicleId,
                    slotId: slot.SlotID,
                    startTime,
                    endTime,
                    // payment info is auto-handled in backend (Cash + amount by duration)
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to create booking");
            }

            toast({
                title: "Booking created",
                description: `Your booking for slot ${slot.SlotCode} has been created with payment.`,
            });

            // Refresh slots list (optional)
            await handleSearch();

            // Go back to dashboard so updated stats are visible
            navigate("/dashboard");
        } catch (err: any) {
            toast({
                title: "Booking failed",
                description:
                    err.message ||
                    "An error occurred while creating the booking.",
                variant: "destructive",
            });
        } finally {
            setBookingSlotId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Find Available Slot</h1>
                <p className="text-muted-foreground mb-6">
                    Choose your time window to see all free parking slots and book one.
                </p>

                {/* Search criteria */}
                <Card className="shadow-soft mb-8">
                    <CardHeader>
                        <CardTitle>Search Criteria</CardTitle>
                        <CardDescription>
                            Start with a simple date &amp; time range.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start time</Label>
                                <Input
                                    id="startTime"
                                    type="datetime-local"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End time</Label>
                                <Input
                                    id="endTime"
                                    type="datetime-local"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button onClick={handleSearch} disabled={loadingSlots} className="mt-2">
                            {loadingSlots ? "Searching..." : "Find Available Slots"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results + booking */}
                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Available Slots</CardTitle>
                        <CardDescription>
                            {slots.length === 0
                                ? "No results yet. Run a search to see available slots."
                                : `Found ${slots.length} available slot(s). Click 'Book' to reserve with payment.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {slots.map((slot) => (
                                <div
                                    key={slot.SlotID}
                                    className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-2xl px-4 py-3"
                                >
                                    <div className="flex items-center space-x-3 mb-3 md:mb-0">
                                        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                                            <ParkingSquare className="w-5 h-5 text-success" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {slot.LotName} — Level {slot.LevelNumber}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Slot {slot.SlotCode} · {slot.SlotType}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" />
                                            <span>Available</span>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleBook(slot)}
                                            disabled={bookingSlotId === slot.SlotID}
                                        >
                                            {bookingSlotId === slot.SlotID ? "Booking..." : "Book"}
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {slots.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    Once the backend and database have some data, results and
                                    booking options will appear here.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default FindSlot;
