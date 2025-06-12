import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  testCaseId?: string;
  executionId?: string;
  onUploadComplete?: (urls: string[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const FileUpload = ({ 
  testCaseId, 
  executionId, 
  onUploadComplete, 
  maxFiles = 5,
  acceptedTypes = ['image/*', '.pdf', '.doc', '.docx']
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `Maximum ${maxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${testCaseId || executionId || 'general'}/${Date.now()}_${i}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('test-screenshots')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('test-screenshots')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        setUploadProgress(((i + 1) / files.length) * 100);
      }

      // If this is for a test execution, update the execution record
      if (executionId) {
        const { error } = await supabase
          .from('test_executions')
          .update({ 
            screenshots: uploadedUrls.map(url => ({ url, uploaded_at: new Date().toISOString() }))
          })
          .eq('id', executionId);

        if (error) throw error;
      }

      toast({
        title: "Upload Successful",
        description: `${files.length} file(s) uploaded successfully`,
      });

      onUploadComplete?.(uploadedUrls);
      setFiles([]);
      setUploadProgress(0);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          File Upload
        </CardTitle>
        <CardDescription>
          Upload screenshots, documents, or other files related to test execution
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="file-upload">Select Files</Label>
          <Input
            id="file-upload"
            type="file"
            ref={fileInputRef}
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <p className="text-xs text-muted-foreground">
            Maximum {maxFiles} files. Accepted types: {acceptedTypes.join(', ')}
          </p>
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {getFileIcon(file)}
                  <span className="flex-1 text-sm truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <Label>Upload Progress</Label>
            <Progress value={uploadProgress} />
            <p className="text-xs text-muted-foreground">
              Uploading {files.length} file(s)... {Math.round(uploadProgress)}%
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </>
            )}
          </Button>
          
          {files.length > 0 && !uploading && (
            <Button
              variant="outline"
              onClick={() => {
                setFiles([]);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Clear All
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
