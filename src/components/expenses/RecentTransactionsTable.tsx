"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { List, Edit, Trash2, Loader2, Save, X } from "lucide-react";

// Using the same colors for category badges
const COLORS = [
  "#9333ea", // purple-600
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#06b6d4", // cyan-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
];

export default function RecentTransactionsTable() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    expense_date: "",
    product: "",
    category_id: "",
    total_cost: "",
    store: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [expRes, catRes] = await Promise.all([
      supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false }),
      supabase.from("expense_categories").select("id, name"),
    ]);

    if (expRes.data) setTransactions(expRes.data);
    if (catRes.data) setCategories(catRes.data);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("expenseAdded", fetchData);
    return () => window.removeEventListener("expenseAdded", fetchData);
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this transaction?"))
      return;

    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (!error) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      window.dispatchEvent(new Event("expenseAdded")); // Triggers updates on other widgets
    } else {
      alert("Error deleting transaction");
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingId(transaction.id);
    setEditForm({
      expense_date: transaction.expense_date,
      product: transaction.product,
      category_id: transaction.category_id,
      total_cost:
        transaction.total_cost ||
        (transaction.unit_cost * transaction.quantity).toString(),
      store: transaction.store,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;

    // total_cost is a generated column in the DB, we can only update unit_cost and quantity
    const tx = transactions.find((t) => t.id === editingId);
    const quantity = tx ? tx.quantity || 1 : 1;
    const unitCost = Number(editForm.total_cost) / quantity;

    const { error } = await supabase
      .from("expenses")
      .update({
        product: editForm.product,
        category_id: editForm.category_id || null, // Convert empty string back to null
        store: editForm.store,
        expense_date: editForm.expense_date,
        unit_cost: unitCost,
      })
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      fetchData();
      window.dispatchEvent(new Event("expenseAdded"));
    } else {
      console.error("Update error:", error);
      alert("Error updating transaction: " + error.message);
    }
  };

  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, 10);

  const getCategoryDetails = (catId: string) => {
    const index = categories.findIndex((c) => c.id === catId);
    const category = categories[index];
    return {
      name: category ? category.name : "Unknown",
      color: index >= 0 ? COLORS[index % COLORS.length] : "#9ca3af", // default gray
    };
  };

  // Helper to convert hex to rgba for the badge background
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="relative col-span-1 flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm md:col-span-2 lg:col-span-3">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl border border-transparent bg-white/60 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-2 border-b border-gray-100 p-5">
        <List className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-bold tracking-tight text-gray-900">
          Recent Transactions
        </h3>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Description</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 text-right font-semibold">Amount</th>
              <th className="px-6 py-4 font-semibold">Store</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            ) : (
              displayedTransactions.map((tx) => {
                const isEditing = editingId === tx.id;
                const cat = getCategoryDetails(tx.category_id);
                const amount = tx.total_cost || tx.unit_cost * tx.quantity;

                if (isEditing) {
                  return (
                    <tr key={tx.id} className="bg-purple-50/30">
                      <td className="px-6 py-3">
                        <input
                          type="date"
                          value={editForm.expense_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              expense_date: e.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.product}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              product: e.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <select
                          value={editForm.category_id}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category_id: e.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={editForm.total_cost}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              total_cost: e.target.value,
                            })
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-right text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3">
                        <input
                          type="text"
                          value={editForm.store}
                          onChange={(e) =>
                            setEditForm({ ...editForm, store: e.target.value })
                          }
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="rounded-lg p-1.5 text-green-600 transition-colors hover:bg-green-50"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100"
                            title="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Normal row
                return (
                  <tr
                    key={tx.id}
                    className="group transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-700">
                      {new Date(tx.expense_date).toLocaleDateString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {tx.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: hexToRgba(cat.color, 0.1),
                          color: cat.color,
                          borderColor: hexToRgba(cat.color, 0.2),
                        }}
                      >
                        {cat.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold whitespace-nowrap text-red-600">
                      -
                      {Number(amount).toLocaleString("pl-PL", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      zł
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        {/* Fake icon for store/method matching design */}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-[10px] font-bold text-gray-500">
                            {tx.store ? tx.store.charAt(0).toUpperCase() : "?"}
                          </span>
                        </div>
                        <span className="max-w-[120px] truncate">
                          {tx.store || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="rounded-lg p-1.5 text-blue-600 transition-colors hover:bg-blue-50"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          className="rounded-lg p-1.5 text-red-600 transition-colors hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER BUTTON */}
      {transactions.length > 10 && (
        <div className="flex justify-center rounded-b-xl border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-semibold text-purple-600 transition-all hover:text-purple-700 hover:underline"
          >
            {showAll ? "Show less" : "View all transactions"}
          </button>
        </div>
      )}
    </div>
  );
}
