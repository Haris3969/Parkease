import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { DollarSign } from "lucide-react";

type Payment = {
    PaymentID: number;
    BookingID: number;
    Amount: number;
    PaidAt: string | null;
    StatusText: string;
    MethodName: string;
    LotName: string;
    SlotCode: string;
};

const PaymentHistory = () => {
    const { toast } = useToast();
    const [payments, setPayments] = useState<Payment[]>([]);
    const userId = 1; // TODO: replace with logged-in user

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(
                    `http://localhost:5000/api/payments/user/${userId}`
                );
                if (!res.ok) throw new Error("Failed to load payments");
                const data = await res.json();
                setPayments(data);
            } catch (err: any) {
                toast({
                    title: "Error",
                    description: err.message || "Could not load payments.",
                    variant: "destructive",
                });
            }
        };

        load();
    }, [toast, userId]);

    return (
        <div className="min-h-screen bg-gradient-hero">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Payment History</h1>
                <p className="text-muted-foreground mb-6">
                    Track all your completed parking payments.
                </p>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle>Payments</CardTitle>
                        <CardDescription>
                            {payments.length === 0
                                ? "You have no payments recorded yet."
                                : `Total payments: ${payments.length}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {payments.map((p) => (
                                <div
                                    key={p.PaymentID}
                                    className="flex items-center justify-between border rounded-2xl px-4 py-3"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {p.LotName} — {p.SlotCode}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {p.MethodName} · Booking #{p.BookingID}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">
                                            PKR {p.Amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {p.PaidAt
                                                ? new Date(p.PaidAt).toLocaleString()
                                                : "Not paid"}
                                            {" · "}
                                            {p.StatusText}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {payments.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    When you make payments via the booking flow, they will show up
                                    here.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default PaymentHistory;
