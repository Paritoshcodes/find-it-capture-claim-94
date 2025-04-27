import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useLostFound } from "@/context/LostFoundContext";
import CameraRecognition from "@/components/CameraRecognition";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Search: React.FC = () => {
  const [itemToFind, setItemToFind] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const { currentUser } = useLostFound();
  const navigate = useNavigate();

  const handleStartSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Please login to use the camera search feature");
      navigate("/login");
      return;
    }
    
    if (!itemToFind.trim()) {
      toast.error("Please enter an item name to search for");
      return;
    }
    
    setShowCamera(true);
  };

  const handleObjectDetected = (detected: boolean) => {
    if (detected) {
      toast.success(`"${itemToFind}" has been detected!`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Search for Lost Items</h1>
      
      {!showCamera ? (
        <>
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <form onSubmit={handleStartSearch} className="space-y-4">
              <div>
                <Label htmlFor="item-search">What are you looking for?</Label>
                <Input
                  id="item-search"
                  value={itemToFind}
                  onChange={(e) => setItemToFind(e.target.value)}
                  required
                  placeholder="Enter item name (e.g. wallet, keys, smartphone)"
                  className="form-input"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-lost-primary hover:bg-lost-secondary text-white"
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                Start Camera Search
              </Button>
            </form>
          </div>
          
          <div className="text-center max-w-lg mx-auto">
            <h2 className="text-xl font-medium mb-4">How it works:</h2>
            
            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="p-4">
                <div className="w-10 h-10 bg-lost-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lost-primary font-medium">1</span>
                </div>
                <p className="text-gray-600">Enter the name of the item you're looking for</p>
              </div>
              
              <div className="p-4">
                <div className="w-10 h-10 bg-lost-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lost-primary font-medium">2</span>
                </div>
                <p className="text-gray-600">Point your camera at objects around you</p>
              </div>
              
              <div className="p-4">
                <div className="w-10 h-10 bg-lost-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-lost-primary font-medium">3</span>
                </div>
                <p className="text-gray-600">Our system will recognize your lost item</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Note: For privacy and security reasons, you need to login before using the camera search.
            </p>
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium">
                Searching for: <span className="text-lost-primary">{itemToFind}</span>
              </h2>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCamera(false)}
                className="border-lost-primary text-lost-primary hover:bg-lost-light"
              >
                New Search
              </Button>
            </div>
            
            <CameraRecognition 
              itemToFind={itemToFind}
              userEmail={currentUser?.email}
              onObjectDetected={handleObjectDetected}
            />
          </div>
          
          <p className="text-center text-sm text-gray-500">
            Point your camera at different areas to scan for your lost item.
            When found, the system will highlight it and notify you.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
