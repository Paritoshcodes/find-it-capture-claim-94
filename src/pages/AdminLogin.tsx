
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLostFound } from "@/context/LostFoundContext";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("admin@lostfound.com");
  const [password, setPassword] = useState("");
  const { adminLogin, currentUser, isAdmin } = useLostFound();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (currentUser && isAdmin()) {
      navigate("/admin/dashboard");
    }
  }, [currentUser, navigate, isAdmin]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }
    
    // Try to login as admin
    const success = adminLogin(email, password);
    if (success) {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Shield size={32} className="text-lost-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-gray-600">
            Enter your admin credentials to access the dashboard
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter admin email"
                className="form-input"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="form-input"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-lost-primary hover:bg-lost-secondary text-white"
            >
              Login as Admin
            </Button>
          </form>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Not an admin? <a href="/login" className="text-lost-primary hover:underline">Login as User</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
