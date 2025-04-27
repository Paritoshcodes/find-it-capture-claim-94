
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLostFound } from "@/context/LostFoundContext";
import { Search, Check } from "lucide-react";

interface ItemsListProps {
  itemType?: "lost" | "found" | "all";
  userId?: string;
  onSearchItem?: (itemName: string) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({ itemType = "all", userId, onSearchItem }) => {
  const { lostItems, getUserById, updateItemStatus, currentUser } = useLostFound();
  
  // Filter items based on props
  const filteredItems = lostItems.filter((item) => {
    if (userId && item.ownerId !== userId) {
      return false;
    }
    
    if (itemType !== "all" && item.status !== itemType) {
      return false;
    }
    
    return true;
  });

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No items found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredItems.map((item) => {
        const owner = getUserById(item.ownerId);
        
        return (
          <Card key={item.id} className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {item.name}
                <span className={`ml-2 inline-block px-2 py-0.5 text-xs rounded-full ${
                  item.status === "found" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                }`}>
                  {item.status.toUpperCase()}
                </span>
              </CardTitle>
              <CardDescription>
                Reported by {owner?.name || "Unknown"} on {item.dateReported}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between pt-0">
              {onSearchItem && (
                <Button 
                  onClick={() => onSearchItem(item.name)}
                  size="sm"
                  className="bg-lost-primary hover:bg-lost-secondary text-white"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Button>
              )}
              
              {currentUser?.id === item.ownerId && item.status === "lost" && (
                <Button 
                  onClick={() => updateItemStatus(item.id, "found")}
                  size="sm"
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Mark as Found
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ItemsList;
