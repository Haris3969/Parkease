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

const PremiumBooking = () => {
    const { toast } = useToast();
    const navigate = useNavigate();

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [bookingSlotId, setBookingSlotId] = useState<number | null>(null);

    const userId = 1;
    const vehicleId = 1;

    const handleSearch = async () => {
        try {
            setLoadingSlots(true);

            const res = await fetch(
                "http://localhost:5000/api/premium-slots/available"
            );

            if (!res.ok) throw new Error("Failed to load premium slots");

            setSlots(await res.json());

        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message,
                variant: "destructive"
            });
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBook = async (slot: Slot) => {
        try {
            setBookingSlotId(slot.SlotID);

            const res = await fetch(
                "http://localhost:5000/api/premium-bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId,
                    vehicleId,
                    slotId: slot.SlotID,
                    startTime,
                    endTime
                })
            }
            );

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast({
                title: "Premium booking confirmed",
                description: `Slot ${slot.SlotCode} booked. Charged PKR ${data.amountCharged}`
            });

            navigate("/dashboard");

        } catch (err: any) {
            toast({
                title: "Booking failed",
                description: err.message,
                variant: "destructive"
            });
        }
        finally {
            setBookingSlotId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-hero">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">
                    Premium Pre-Booking
                </h1>

                <p className="text-muted-foreground mb-6">
                    Reserve VIP or LARGE parking slots at priority rates.
                </p>

                <Card className="shadow-soft mb-8">
                    <CardHeader>
                        <CardTitle>Search Criteria</CardTitle>
                        <CardDescription>
                            Premium slots are available on demand.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label>Start Time</Label>
                                <Input type="datetime-local"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>End Time</Label>
                                <Input type="datetime-local"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            className="mt-4"
                            onClick={handleSearch}
                        >
                            {loadingSlots
                                ? "Searching..."
                                : "Find Premium Slots"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Premium Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {slots.map(slot => (
                            <div
                                key={slot.SlotID}
                                className="flex justify-between border rounded-2xl p-4 mb-3"
                            >
                                <div className="flex items-center gap-3">
                                    <ParkingSquare />
                                    <div>
                                        <p>
                                            {slot.LotName} — Level {slot.LevelNumber}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Slot {slot.SlotCode} ({slot.SlotType})
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    disabled={bookingSlotId === slot.SlotID}
                                    size="sm"
                                    onClick={() => handleBook(slot)}
                                >
                                    {bookingSlotId === slot.SlotID
                                        ? "Booking..."
                                        : "Book Premium"}
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default PremiumBooking;
