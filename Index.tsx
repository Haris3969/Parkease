import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ParkingSquare, CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";

const Index = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Real-Time Availability",
            description: "See available parking spots instantly with live sensor data",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Secure Bookings",
            description: "Book your spot in advance with secure payment processing",
        },
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Smart Analytics",
            description: "Track your parking history and expenses effortlessly",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-hero">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center shadow-medium">
                            <ParkingSquare className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
                        Welcome to ParkEase
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Smart parking management system that makes finding and booking parking spots easier than ever.
                        Join thousands of satisfied users today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="text-lg px-8"
                            onClick={() => navigate("/auth")}
                        >
                            Get Started
                            <CheckCircle2 className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8"
                            onClick={() => navigate("/auth")}
                        >
                            Sign In
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Why Choose ParkEase?</h2>
                    <p className="text-muted-foreground">Everything you need for hassle-free parking</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center text-white mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="bg-gradient-primary rounded-3xl p-12 text-center text-white shadow-medium">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Park Smarter?
                    </h2>
                    <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                        Join ParkEase today and experience the future of parking management
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        className="text-lg px-8"
                        onClick={() => navigate("/auth")}
                    >
                        Create Free Account
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background/95 backdrop-blur">
                <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
                    <p>© 2025 ParkEase. Built by Haris Hassaan, Zuraiz Anjum, Zoraiz Rizwan</p>
                </div>
            </footer>
        </div>
    );
};

export default Index;