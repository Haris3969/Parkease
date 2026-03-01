import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ParkingSquare } from "lucide-react";

const API_BASE = "http://localhost:5000/api";

export default function Auth() {
    const nav = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const [signup, setSignup] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    /* ===== REGISTER ===== */
    const handleSignup = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signup)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast({ title: "Success", description: "Account created ✅" });

            setLogin({ email: signup.email, password: signup.password });

        } catch (err: any) {
            toast({ title: "Signup failed", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    /* ===== LOGIN ===== */
    const handleLogin = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(login)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            localStorage.setItem("token", data.token);

            toast({ title: "Welcome!", description: "Login successful ✅" });

            nav("/dashboard");

        } catch (err: any) {
            toast({ title: "Login failed", description: err.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-hero p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <ParkingSquare className="w-10 h-10 text-blue-600" />
                    </div>
                    <CardTitle>ParkEase</CardTitle>
                    <CardDescription>Smart Parking Management</CardDescription>
                </CardHeader>

                <CardContent>
                    <Tabs defaultValue="login">

                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-3">
                                <Label>Email</Label>
                                <Input type="email" value={login.email}
                                    onChange={e => setLogin({ ...login, email: e.target.value })} required />

                                <Label>Password</Label>
                                <Input type="password" value={login.password}
                                    onChange={e => setLogin({ ...login, password: e.target.value })} required />

                                <Button className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="animate-spin mr-2" />}
                                    Login
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignup} className="space-y-3">

                                <Label>Full Name</Label>
                                <Input value={signup.fullName}
                                    onChange={e => setSignup({ ...signup, fullName: e.target.value })} required />

                                <Label>Email</Label>
                                <Input type="email" value={signup.email}
                                    onChange={e => setSignup({ ...signup, email: e.target.value })} required />

                                <Label>Phone (11 digits)</Label>
                                <Input value={signup.phone}
                                    onChange={e => setSignup({ ...signup, phone: e.target.value })} />

                                <Label>Password</Label>
                                <Input type="password" minLength={8} value={signup.password}
                                    onChange={e => setSignup({ ...signup, password: e.target.value })} required />

                                <Button className="w-full" disabled={loading}>
                                    {loading && <Loader2 className="animate-spin mr-2" />}
                                    Create Account
                                </Button>
                            </form>
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
