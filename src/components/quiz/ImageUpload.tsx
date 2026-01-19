"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Camera } from "lucide-react";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          setError("Please upload only image files");
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError("Images must be under 10MB");
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `leads/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("shirt-images")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          setError("Failed to upload image. Please try again.");
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from("shirt-images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      if (uploadedUrls.length > 0) {
        onImagesChange([...images, ...uploadedUrls]);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    onImagesChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${uploading ? "border-gray-300 bg-gray-50 cursor-wait" : "border-money/50 hover:border-money hover:bg-money/5"}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        <div className="flex flex-col items-center gap-3">
          {uploading ? (
            <>
              <div className="w-12 h-12 border-4 border-money border-t-transparent rounded-full animate-spin" />
              <p className="text-lg text-navy/70">Uploading...</p>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Upload size={32} className="text-money" />
                <Camera size={32} className="text-money" />
              </div>
              <p className="text-xl font-semibold text-navy">
                Click to Upload Photos
              </p>
              <p className="text-lg text-navy/60">
                or drag and drop your shirt images here
              </p>
              <p className="text-base text-navy/50">
                Up to {maxImages} images, 10MB each (JPG, PNG)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-lg">
          {error}
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Uploaded shirt ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Remove image"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Count */}
      <p className="text-base text-navy/60 text-center">
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
