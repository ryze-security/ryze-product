
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, File, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useToast } from "@/hooks/use-toast";

const DocumentUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} files have been added successfully.`
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      toast({
        title: "Files added",
        description: `${newFiles.length} files have been added successfully.`
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    toast({
      title: "File removed",
      description: "The file has been removed from the upload list."
    });
  };

  const handleUpload = () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select files to upload.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      toast({
        title: "Upload successful",
        description: `${files.length} files have been uploaded.`
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <Navbar />
      <div className="container mx-auto max-w-2xl mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Upload Security Policies</h1>
          <p className="text-gray-400">Upload the documents you want to evaluate</p>
        </div>

        <div 
          className={`glass-card p-8 border-2 border-dashed ${
            dragging ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700'
          } rounded-lg flex flex-col items-center justify-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-4 inline-flex mb-4">
              <Upload className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Drag files here or click to upload</h3>
            <p className="text-gray-400 text-sm mb-4">
              Support for PDF, DOCX, DOC, and TXT files
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Browse Files
              </Button>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 glass-card p-4">
            <h3 className="text-lg font-medium mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    <File className="h-5 w-5 mr-2 text-blue-400" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600" 
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-8">
          <Link to="/evaluation/start">
            <Button 
              className="bg-white hover:bg-gray-200 text-black" 
              disabled={files.length === 0}
            >
              Continue
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
