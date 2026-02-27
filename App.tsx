import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// NEW PAGES
import FindSlot from "./pages/FindSlot";
import MyBookings from "./pages/MyBookings";
import ManageVehicles from "./pages/ManageVehicles";
import PaymentHistory from "./pages/PaymentHistory";

import PremiumBooking from "./pages/PremiumBooking";



const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Quick Actions targets */}
                    <Route path="/find-slot" element={<FindSlot />} />
                    <Route path="/bookings" element={<MyBookings />} />
                    <Route path="/vehicles" element={<ManageVehicles />} />
                    <Route path="/payments" element={<PaymentHistory />} />
                    <Route path="/premium-booking" element={<PremiumBooking />} />

                    {/* Catch-all */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
