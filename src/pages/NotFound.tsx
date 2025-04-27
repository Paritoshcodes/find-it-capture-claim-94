
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-lost-primary mb-4">404</h1>
        <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved to another URL.
        </p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-lost-primary hover:bg-lost-secondary text-white"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
