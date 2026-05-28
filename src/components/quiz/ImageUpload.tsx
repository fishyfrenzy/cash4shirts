"use client";

import { useState, useRef } from "react";
import { Upload, X, Camera, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  compact?: boolean; // small one-tap button instead of a large drop zone
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5,
  compact = false,
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
          console.error("Supabase Storage Upload Error:", uploadError);
          setError(`Upload failed: ${uploadError.message || "Unknown error"}. Please check your bucket configuration.`);
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

  const canAddMore = images.length < maxImages;
  const triggerPicker = () => !uploading && fileInputRef.current?.click();

  // Hidden file input shared by both modes
  const input = (
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      multiple
      onChange={handleFileSelect}
      className="hidden"
      disabled={uploading}
    />
  );

  // Thumbnails grid (used in both modes when there are images)
  const thumbs = images.length > 0 && (
    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
      {images.map((url, index) => (
        <div key={index} className="relative group aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={`Uploaded shirt ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow hover:bg-red-600"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );

  // ── Compact mode: small inline button instead of a giant drop zone ──
  if (compact) {
    return (
      <div className="space-y-3">
        {input}
        {canAddMore && (
          <button
            type="button"
            onClick={triggerPicker}
            disabled={uploading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-money/50 rounded-lg text-base font-semibold text-navy/80 hover:border-money hover:bg-money/5 disabled:cursor-wait transition-colors"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-money border-t-transparent rounded-full animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                {images.length === 0 ? <Camera size={20} className="text-money" /> : <Plus size={20} className="text-money" />}
                {images.length === 0 ? "Add photos (up to 5)" : `Add more (${images.length}/${maxImages})`}
              </>
            )}
          </button>
        )}
        {thumbs}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>
    );
  }

  // ── Default (large drop zone) mode ──
  return (
    <div className="space-y-4">
      <div
        onClick={triggerPicker}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${uploading ? "border-gray-300 bg-gray-50 cursor-wait" : "border-money/50 hover:border-money hover:bg-money/5"}
        `}
      >
        {input}
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
              <p className="text-xl font-semibold text-navy">Click to Upload Photos</p>
              <p className="text-base text-navy/50">Up to {maxImages} images, 10MB each (JPG, PNG)</p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-lg">
          {error}
        </div>
      )}

      {thumbs}

      <p className="text-base text-navy/60 text-center">
        {images.length} of {maxImages} images uploaded
      </p>
    </div>
  );
}
