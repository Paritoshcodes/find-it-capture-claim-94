
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLostFound } from "@/context/LostFoundContext";
import LostItemForm from "@/components/LostItemForm";
import ItemsList from "@/components/ItemsList";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Mail, User } from "lucide-react";

const Dashboard: React.FC = () => {
  const { currentUser, getUserItems } = useLostFound();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Will redirect in the useEffect
  }
  
  const userItems = getUserItems(currentUser.id);
  const lostItems = userItems.filter(item => item.status === "lost");
  const foundItems = userItems.filter(item => item.status === "found");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Profile</CardDescription>
            <CardTitle className="text-lg">{currentUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">{currentUser.email}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">DoB: {currentUser.dob}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lost Items</CardDescription>
            <CardTitle className="text-2xl">{lostItems.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Items you've reported as lost
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Found Items</CardDescription>
            <CardTitle className="text-2xl">{foundItems.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Items that have been found
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Report a Lost Item</CardTitle>
            <CardDescription>
              Enter details about the item you've lost
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LostItemForm />
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Tabs defaultValue="lost" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="lost">Lost Items</TabsTrigger>
              <TabsTrigger value="found">Found Items</TabsTrigger>
              <TabsTrigger value="all">All Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="lost">
              <h2 className="text-xl font-semibold mb-4">Your Lost Items</h2>
              <ItemsList itemType="lost" userId={currentUser.id} onSearchItem={(itemName) => {
                navigate(`/search?item=${encodeURIComponent(itemName)}`);
              }} />
            </TabsContent>
            
            <TabsContent value="found">
              <h2 className="text-xl font-semibold mb-4">Found Items</h2>
              <ItemsList itemType="found" userId={currentUser.id} />
            </TabsContent>
            
            <TabsContent value="all">
              <h2 className="text-xl font-semibold mb-4">All Your Items</h2>
              <ItemsList userId={currentUser.id} onSearchItem={(itemName) => {
                navigate(`/search?item=${encodeURIComponent(itemName)}`);
              }} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
