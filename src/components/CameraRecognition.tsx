import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Search, X } from "lucide-react";
import { toast } from "sonner";
import { detectObjects } from "@/utils/objectDetection";
import { sendFoundItemEmail } from "@/services/emailService";
import { useCamera } from "@/hooks/useCamera";

interface CameraRecognitionProps {
  itemToFind: string;
  userEmail?: string;
  onObjectDetected?: (detected: boolean) => void;
}

const CameraRecognition: React.FC<CameraRecognitionProps> = ({
  itemToFind,
  userEmail,
  onObjectDetected,
}) => {
  const { videoRef, canvasRef, streaming, cameraError, startCamera, stopCamera } = useCamera();
  const [detecting, setDetecting] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);

  // Start camera automatically when component mounts
  useEffect(() => {
    startCamera();
  }, []);

  const startDetection = async () => {
    setDetecting(true);
    
    try {
      const objects = await detectObjects(itemToFind);
      setDetectedObjects(objects);
      
      const isItemFound = objects.includes(itemToFind.toLowerCase());
      
      if (isItemFound) {
        toast.success(`Found "${itemToFind}"!`);
        
        if (userEmail) {
          await sendFoundItemEmail(itemToFind, userEmail);
          toast.success("Email notification sent!");
        }
      }
      
      if (onObjectDetected) {
        onObjectDetected(isItemFound);
      }
    } catch (error) {
      console.error("Detection error:", error);
      toast.error("Error during object detection");
    } finally {
      setTimeout(() => {
        setDetecting(false);
      }, 1000);
    }
  };

  // Draw detection boxes
  useEffect(() => {
    const drawDetectionBoxes = () => {
      if (!canvasRef.current || !videoRef.current || !videoRef.current.videoWidth) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      if (detecting && detectedObjects.length > 0) {
        detectedObjects.forEach((object, index) => {
          const x = Math.random() * (canvasRef.current!.width - 100);
          const y = Math.random() * (canvasRef.current!.height - 50);
          const width = 100 + Math.random() * 100;
          const height = 50 + Math.random() * 50;
          
          ctx.strokeStyle = object.toLowerCase() === itemToFind.toLowerCase() ? '#9b87f5' : '#F97316';
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, width, height);
          
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
      <div className="camera-container relative aspect-video w-full bg-black rounded-md overflow-hidden">
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
          <div className="scanning-animation absolute top-0 left-0 w-full h-full border-2 border-lost-primary animate-scan" />
        )}
        
        {!streaming && !cameraError && (
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
        
        {cameraError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-red-500 mb-2">{cameraError}</p>
            <Button 
              onClick={startCamera}
              className="bg-lost-primary hover:bg-lost-secondary text-white"
            >
              <Camera className="w-4 h-4 mr-2" />
              Try Again
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
