
// This simulates an improved object detection model with higher accuracy
export const detectObjects = (itemToFind: string): Promise<string[]> => {
  return new Promise((resolve) => {
    // Simulate more accurate object detection with common lost items
    const commonLostItems = [
      "wallet", "keys", "phone", "backpack", "laptop", 
      "umbrella", "water bottle", "glasses", "headphones",
      "smartphone", "tablet", "id card", "purse"
    ];
    
    // Higher probability (70%) to detect the actual searched item
    const shouldIncludeSearchItem = Math.random() < 0.7;
    
    // Generate 1-3 detected objects
    const numObjects = Math.floor(Math.random() * 2) + 1;
    const detectedItems = new Set<string>();
    
    // Add the searched item with higher probability
    if (shouldIncludeSearchItem) {
      detectedItems.add(itemToFind.toLowerCase());
    }
    
    // Add other random items
    while (detectedItems.size < numObjects) {
      const randomItem = commonLostItems[Math.floor(Math.random() * commonLostItems.length)];
      detectedItems.add(randomItem);
    }
    
    // Simulate detection delay
    setTimeout(() => {
      resolve(Array.from(detectedItems));
    }, 1500);
  });
};
