import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Lock, RotateCcw } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Number Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Efficiently manage, track, and organize your numbers with automatic
            daily resets and secure user authentication
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="shadow-hover"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
            <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
            <p className="text-muted-foreground">
              Protected login system with user roles and admin panel for
              complete control
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
            <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Number Management</h3>
            <p className="text-muted-foreground">
              Upload via text or file, one-click copy moves numbers from
              Available to Used instantly
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-card hover:shadow-hover transition-shadow">
            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <RotateCcw className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Automatic Daily Reset</h3>
            <p className="text-muted-foreground">
              All used numbers automatically return to available at 5:00 AM
              Pakistan Time
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Ready to streamline your number management?
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
          >
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
