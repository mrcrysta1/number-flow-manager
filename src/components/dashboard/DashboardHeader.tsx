import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
}

const DashboardHeader = ({ user, isAdmin, onLogout }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Number Manager</h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin")}
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;