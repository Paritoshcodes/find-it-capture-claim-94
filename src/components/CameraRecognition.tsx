
import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Search, X } from "lucide-react";
import { toast } from "sonner";

interface CameraRecognitionProps {
  itemToFind: string;
  onObjectDetected?: (detected: boolean) => void;
}

const CameraRecognition: React.FC<CameraRecognitionProps> = ({
  itemToFind,
  onObjectDetected,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setMediaStream(stream);
      }
      
      setStreaming(true);
      toast.info("Camera started. Looking for your item...");
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStreaming(false);
    setDetecting(false);
  };

  const startDetection = () => {
    setDetecting(true);
    
    // Simulate object detection with random objects
    // In a real app, this would connect to a trained model API
    setTimeout(() => {
      const possibleObjects = [
        "smartphone", "wallet", "keys", "backpack", "laptop", 
        "water bottle", "umbrella", "headphones", "glasses", "book"
      ];
      
      // Randomly include the searched item with higher probability if specified
      const shouldIncludeSearchItem = Math.random() > 0.4;
      
      let detectedItems: string[] = [];
      const numObjects = Math.floor(Math.random() * 3) + 1; // 1-3 objects
      
      for (let i = 0; i < numObjects; i++) {
        const randomIndex = Math.floor(Math.random() * possibleObjects.length);
        detectedItems.push(possibleObjects[randomIndex]);
      }
      
      // Add the searched item if probability check passed
      if (shouldIncludeSearchItem && itemToFind) {
        detectedItems = [itemToFind, ...detectedItems];
      }
      
      // Remove duplicates
      detectedItems = [...new Set(detectedItems)];
      
      setDetectedObjects(detectedItems);
      
      // Notify callback if the item was detected
      if (onObjectDetected) {
        onObjectDetected(detectedItems.includes(itemToFind.toLowerCase()));
      }
      
      if (detectedItems.includes(itemToFind.toLowerCase())) {
        toast.success(`Found "${itemToFind}"!`);
      }
      
      // Continue detection or stop
      setTimeout(() => {
        setDetecting(false);
      }, 2000);
      
    }, 2000);
  };

  // Cleanup function
  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [mediaStream]);

  // Draw fake detection rectangle
  useEffect(() => {
    const drawDetectionBoxes = () => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (detecting && detectedObjects.length > 0) {
        detectedObjects.forEach((object, index) => {
          // Create random box position
          const x = Math.random() * (canvasRef.current!.width - 100);
          const y = Math.random() * (canvasRef.current!.height - 50);
          const width = 100 + Math.random() * 100;
          const height = 50 + Math.random() * 50;
          
          // Draw rectangle
          ctx.strokeStyle = object.toLowerCase() === itemToFind.toLowerCase() ? '#9b87f5' : '#F97316';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          
          // Draw label
          ctx.fillStyle = object.toLowerCase() === itemToFind.toLowerCase() ? '#9b87f5' : '#F97316';
          ctx.fillRect(x, y - 20, object.length * 9, 20);
          
          ctx.fillStyle = 'white';
          ctx.font = '14px Arial';
          ctx.fillText(object, x + 5, y - 5);
        });
      }
    };
    
    let animationId: number;
    
    if (streaming) {
      const animate = () => {
        drawDetectionBoxes();
        animationId = requestAnimationFrame(animate);
      };
      
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [streaming, detecting, detectedObjects, itemToFind]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-xl mx-auto">
      <div className="camera-container aspect-video w-full bg-black">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover"
          autoPlay 
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
        />
        
        {detecting && (
          <div className="scanning-animation" />
        )}
        
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button 
              onClick={startCamera}
              className="bg-lost-primary hover:bg-lost-secondary text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Turn on Camera
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4 w-full">
        {streaming && (
          <>
            <Button
              onClick={() => startDetection()}
              disabled={detecting}
              className="bg-lost-primary hover:bg-lost-secondary text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              {detecting ? "Detecting..." : "Detect Objects"}
            </Button>
            
            <Button
              onClick={stopCamera}
              variant="outline"
              className="border-lost-primary text-lost-primary hover:bg-lost-light"
            >
              <X className="w-4 h-4 mr-2" />
              Stop Camera
            </Button>
          </>
        )}
      </div>
      
      {detectedObjects.length > 0 && (
        <div className="w-full bg-white rounded-lg p-4 shadow-md animate-fade-in">
          <h3 className="font-medium text-lg mb-2">Objects Detected</h3>
          <ul className="list-disc pl-5">
            {detectedObjects.map((obj, index) => (
              <li 
                key={index}
                className={obj.toLowerCase() === itemToFind.toLowerCase() ? "text-lost-primary font-semibold" : ""}
              >
                {obj} {obj.toLowerCase() === itemToFind.toLowerCase() && "✓"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraRecognition;
