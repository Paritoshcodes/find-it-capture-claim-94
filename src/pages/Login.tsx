
import React, { useEffect } from "react";
import LoginForm from "@/components/LoginForm";
import { useLostFound } from "@/context/LostFoundContext";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const { currentUser } = useLostFound();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Login or Register</h1>
          <p className="text-gray-600">
            Enter your details to access your dashboard and report lost items
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <LoginForm />
        </div>
        
        <div className="mt-8 text-center">
          <h2 className="text-lg font-medium mb-4">Why Create an Account?</h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4">
              <h3 className="font-medium mb-1">Report Lost Items</h3>
              <p className="text-sm text-gray-500">Keep track of all your lost belongings</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1">Use Camera Search</h3>
              <p className="text-sm text-gray-500">Access advanced object recognition</p>
            </div>
            
            <div className="p-4">
              <h3 className="font-medium mb-1">Get Notifications</h3>
              <p className="text-sm text-gray-500">Be alerted when your items are found</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
