"use client";

import React, { useState, useRef, useEffect } from "react";
import { Pencil, Trash2, X, Loader2, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function FirearmActions({ firearm }: { firearm: any }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-fill form with existing data
  const [formData, setFormData] = useState({
    name: firearm.name,
    caliber: firearm.caliber || "",
    purchase_date: firearm.purchase_date || "",
  });

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isEditOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEditOpen]);

  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${firearm.name}? This will also delete related expenses and logs.`
      )
    )
      return;

    setIsDeleting(true);
    const { error } = await supabase
      .from("firearms")
      .delete()
      .eq("id", firearm.id);

    if (error) {
      alert("Failed to delete: " + error.message);
      setIsDeleting(false);
    } else {
      router.refresh();
    }
  };

  // --- EDIT LOGIC ---
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = firearm.image_url; // Keep old image by default

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("firearm_images")
        .upload(fileName, imageFile);

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("firearm_images")
          .getPublicUrl(fileName);
        finalImageUrl = publicUrlData.publicUrl;
      }
    }

    const { error } = await supabase
      .from("firearms")
      .update({
        name: formData.name,
        caliber: formData.caliber,
        purchase_date: formData.purchase_date,
        image_url: finalImageUrl,
      })
      .eq("id", firearm.id);

    setIsSubmitting(false);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      setIsEditOpen(false);
      setImageFile(null);
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Action Buttons */}
      <button
        onClick={() => setIsEditOpen(true)}
        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
        title="Edit Firearm"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        title="Delete Firearm"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                Edit {firearm.name}
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-5"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Update Image (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:bg-gray-50 hover:text-purple-600"
                >
                  <UploadCloud className="mb-1 h-6 w-6" />
                  <span className="px-2 text-xs font-medium">
                    {imageFile ? imageFile.name : "Click to replace image"}
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setImageFile(e.target.files ? e.target.files[0] : null)
                  }
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Producer & Model
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Caliber
                </label>
                <select
                  required
                  value={formData.caliber}
                  onChange={(e) =>
                    setFormData({ ...formData, caliber: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="" disabled>
                    Select caliber...
                  </option>
                  <option value="9x19mm">9x19mm</option>
                  <option value=".22 LR">.22 LR</option>
                  <option value=".223 Rem / 5.56 NATO">
                    .223 Rem / 5.56 NATO
                  </option>
                  <option value="7.62x39mm">7.62x39mm</option>
                  <option value="12 Gauge">12 Gauge</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Acquisition Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_date: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Update Firearm"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
