"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Loader2, Receipt } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AddExpenseModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pastExpenses, setPastExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [uniqueProducts, setUniqueProducts] = useState<string[]>([]);
  const [uniqueStores, setUniqueStores] = useState<string[]>([]);

  // Fetch past expenses & categories when modal opens
  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      const [expensesResponse, categoriesResponse] = await Promise.all([
        supabase
          .from("expenses")
          .select("category_id, product, store, expense_date")
          .order("expense_date", { ascending: false }),
        supabase
          .from("expense_categories")
          .select("id, name")
          .order("sort_order", { ascending: true }),
      ]);

      if (expensesResponse.data) {
        setPastExpenses(expensesResponse.data);

        // Extract unique lists for datalist suggestions
        const products = new Set<string>();
        const stores = new Set<string>();
        expensesResponse.data.forEach((d) => {
          if (d.product) products.add(d.product);
          if (d.store) stores.add(d.store);
        });

        setUniqueProducts(Array.from(products));
        setUniqueStores(Array.from(stores));
      }

      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
    }

    fetchData();
  }, [isOpen]);

  // Prevent Background Scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Form State
  const [formData, setFormData] = useState({
    product: "",
    category_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    total_cost: "",
    quantity: 1,
    store: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error: expenseError } = await supabase.from("expenses").insert([
      {
        product: formData.product,
        category_id: formData.category_id,
        store: formData.store || "Unknown",
        expense_date: formData.expense_date,
        unit_cost: Number(formData.total_cost) / Number(formData.quantity),
        quantity: Number(formData.quantity),
      },
    ]);

    if (expenseError) {
      alert("Failed to add expense: " + expenseError.message);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsOpen(false);
    setFormData({
      product: "",
      category_id: "",
      expense_date: new Date().toISOString().split("T")[0],
      total_cost: "",
      quantity: 1,
      store: "",
    });
    router.refresh();
    window.dispatchEvent(new Event("expenseAdded"));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
      >
        <Plus className="h-4 w-4" />
        Add Expense
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in-95 w-full max-w-md overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl duration-200">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Add New Expense
                </h3>
              </div>
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
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Item / Product Name
                </label>
                <input
                  required
                  type="text"
                  list="products-list"
                  placeholder="e.g. 1000rds 9mm S&B"
                  value={formData.product}
                  onChange={(e) =>
                    setFormData({ ...formData, product: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Category
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => {
                    const newCategoryId = e.target.value;
                    const lastOfCategory = pastExpenses.find(
                      (exp) => exp.category_id === newCategoryId
                    );
                    setFormData((prev) => ({
                      ...prev,
                      category_id: newCategoryId,
                      // Only auto-fill if the user hasn't already typed something
                      product:
                        prev.product.trim() === ""
                          ? lastOfCategory?.product || prev.product
                          : prev.product,
                      store:
                        prev.store.trim() === ""
                          ? lastOfCategory?.store || prev.store
                          : prev.store,
                    }));
                  }}
                  className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none ${formData.category_id === "" ? "text-gray-500" : "text-gray-900"}`}
                >
                  <option value="" disabled>
                    Select category...
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Date
                </label>
                <input
                  required
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expense_date: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Total Price (PLN)
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    placeholder="e.g. 1200.00"
                    value={formData.total_cost}
                    onChange={(e) =>
                      setFormData({ ...formData, total_cost: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div className="flex w-1/2 flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Quantity
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-gray-700">
                  Store / Vendor
                </label>
                <input
                  required
                  type="text"
                  list="stores-list"
                  placeholder="e.g. Local Gun Store"
                  value={formData.store}
                  onChange={(e) =>
                    setFormData({ ...formData, store: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
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
                  {isSubmitting ? "Saving..." : "Save Expense"}
                </button>
              </div>
              <datalist id="products-list">
                {uniqueProducts.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
              <datalist id="stores-list">
                {uniqueStores.map((storeName, i) => (
                  <option key={i} value={storeName} />
                ))}
              </datalist>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
