
import React, { useState } from 'react';
import { File, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRun = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      toast({
        title: "Analysis complete",
        description: "Your policy has been successfully analyzed",
      });
      setIsUploading(false);
      window.location.href = '/dashboard';
    }, 2000);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Input 
          type="file" 
          className="hidden" 
          id="file-upload" 
          onChange={handleFileChange}
          accept=".pdf,.docx,.doc,.txt" 
        />
        <label 
          htmlFor="file-upload" 
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
        >
          <File className="h-6 w-6" />
        </label>
      </div>
      <div className="flex-1">
        <Input 
          type="text" 
          placeholder="Choose Policies, SOC 2, etc."
          value={selectedFile ? selectedFile.name : ''} 
          readOnly
          className="bg-gray-800 border-0 text-white rounded-full"
        />
      </div>
      <Button 
        className="rounded-full bg-white hover:bg-gray-200 text-black" 
        onClick={handleRun}
        disabled={isUploading || !selectedFile}
      >
        {isUploading ? "Analyzing..." : "Run"}
        {!isUploading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

export default FileUploader;
