"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  dark?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  className = "",
  dark = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const data = await api.post<{ url: string }>("/upload", {
            image: base64,
          });
          onChange(data.url);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Upload failed.");
      setUploading(false);
    }

    e.target.value = "";
  };

  return (
    <div className={className}>
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Uploaded"
            className="h-40 w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className={`flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors disabled:opacity-50 ${
            dark
              ? "border-white/10 bg-white/5 hover:border-indigo-400/30 hover:bg-white/[0.07]"
              : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50"
          }`}
        >
          {uploading ? (
            <Loader2 className="size-6 animate-spin text-indigo-500" />
          ) : (
            <ImageIcon className={`size-6 ${dark ? "text-white/30" : "text-gray-400"}`} />
          )}
          <span className={`text-xs ${dark ? "text-white/40" : "text-gray-500"}`}>
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
        </button>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
