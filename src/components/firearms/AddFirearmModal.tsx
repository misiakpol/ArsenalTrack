"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Plus, Loader2, UploadCloud } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AddFirearmModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NEW: Prevent Background Scrolling ---
  useEffect(() => {
    if (isOpen) {
      // Lock the scroll
      document.body.style.overflow = "hidden";
    } else {
      // Unlock the scroll
      document.body.style.overflow = "unset";
    }

    // Cleanup function: safely unlock if the component ever unmounts abruptly
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // --- NEW: Image Upload State ---
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    caliber: "",
    purchase_date: new Date().toISOString().split("T")[0],
    price: "",
    vendor: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalImageUrl = null;

    // --- NEW: 1. Upload Image to Supabase Storage ---
    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("firearm_images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setIsSubmitting(false);
        return;
      }

      // Get the direct public URL for the image
      const { data: publicUrlData } = supabase.storage
        .from("firearm_images")
        .getPublicUrl(fileName);

      finalImageUrl = publicUrlData.publicUrl;
    }

    // 2. Insert the Firearm
    const { data: newFirearm, error: firearmError } = await supabase
      .from("firearms")
      .insert([
        {
          name: formData.name,
          caliber: formData.caliber,
          purchase_date: formData.purchase_date,
          image_url: finalImageUrl, // OVERWRITE old dropbox logic: save the new Supabase URL directly
        },
      ])
      .select()
      .single();

    if (firearmError) {
      alert("Failed to add firearm: " + firearmError.message);
      setIsSubmitting(false);
      return;
    }

    // 3. Insert Expense
    if (formData.price && Number(formData.price) > 0) {
      const { error: expenseError } = await supabase.from("expenses").insert([
        {
          firearm_id: newFirearm.id,
          category: "Firearm",
          item_name: formData.name,
          vendor: formData.vendor || "Unknown",
          date: formData.purchase_date,
          total_cost: Number(formData.price),
          quantity: 1,
        },
      ]);

      if (expenseError) {
        console.error("Firearm added, but expense failed:", expenseError);
      }
    }

    setIsSubmitting(false);
    setIsOpen(false);
    setImageFile(null); // Clear the image
    setFormData({
      name: "",
      caliber: "",
      purchase_date: new Date().toISOString().split("T")[0],
      price: "",
      vendor: "",
    });
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
      >
        <Plus className="h-4 w-4" />
        Add Firearm
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                Add New Firearm
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 transition-colors hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto p-5"
            >
              {/* --- NEW: IMAGE UPLOAD BOX --- */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Firearm Image
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-purple-400 hover:bg-gray-50 hover:text-purple-600"
                >
                  <UploadCloud className="mb-1 h-6 w-6" />
                  <span className="px-2 text-center text-xs font-medium">
                    {imageFile ? imageFile.name : "Click to upload image"}
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
                  placeholder="e.g. Beretta 92XI SAO"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
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
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none ${formData.caliber === "" ? "text-gray-500" : "text-gray-900"}`}
                >
                  <option value="" disabled>
                    Select caliber...
                  </option>
                  <option value="9x19mm">9x19mm</option>
                  <option value=".22LR">.22 LR</option>
                  <option value=".223 Rem / 5.56 NATO">
                    .223 Rem / 5.56 NATO
                  </option>
                  <option value="7.62x39">7.62x39mm</option>
                  <option value=".45 ACP">.45 ACP</option>
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
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Price (PLN)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="e.g. 4500.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Store / Vendor
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Garand"
                    value={formData.vendor}
                    onChange={(e) =>
                      setFormData({ ...formData, vendor: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700 disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Saving..." : "Save Firearm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
