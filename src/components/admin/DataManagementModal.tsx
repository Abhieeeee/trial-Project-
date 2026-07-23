"use client";

import React, { useState } from "react";
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  AlertTriangle,
  X,
  Database,
  Lock,
  ArrowRight,
  RefreshCw,
  Eye,
  FileUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Order, Profile } from "@/types/database";

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "staff" | "admin" | "super_admin";
  onSuccess?: () => void;
}

export function DataManagementModal({
  isOpen,
  onClose,
  role,
  onSuccess,
}: DataManagementModalProps) {
  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("csv");
  const [exportDataType, setExportDataType] = useState<"products" | "orders" | "customers" | "all">("products");
  
  // Import states
  const [importTarget, setImportTarget] = useState<"products" | "orders">("products");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isUnauthorized = role === "staff";
  const isSuperAdmin = role === "super_admin";
  const supabase = createClient();

  if (!isOpen) return null;

  // Accent styles by role
  const accentColorClass = isSuperAdmin ? "text-red-500" : "text-[#00d2ff]";
  const accentBorderClass = isSuperAdmin ? "border-red-500/30" : "border-[#00d2ff]/30";
  const accentBgClass = isSuperAdmin ? "bg-red-500/10" : "bg-[#00d2ff]/10";
  const accentBtnClass = isSuperAdmin
    ? "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    : "bg-[#00d2ff] hover:bg-[#00b5dc] text-black font-bold shadow-[0_0_20px_rgba(0,210,255,0.3)]";

  // Helper to trigger download
  const triggerDownload = (filename: string, content: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Convert array of objects to CSV
  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map((header) => {
        const val = row[header];
        if (val === null || val === undefined) return '""';
        if (typeof val === "object") return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        return `"${String(val).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }
    return csvRows.join("\n");
  };

  // Handle Export
  const handleExport = async () => {
    if (isUnauthorized) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      let dataToExport: any = null;
      let filename = `aura_street_${exportDataType}_${new Date().toISOString().split("T")[0]}`;

      if (exportDataType === "products") {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        dataToExport = data;
      } else if (exportDataType === "orders") {
        const { data, error } = await supabase.from("orders").select("*");
        if (error) throw error;
        dataToExport = data;
      } else if (exportDataType === "customers") {
        const { data, error } = await supabase.from("profiles").select("id, name, email, role, created_at");
        if (error) throw error;
        dataToExport = data;
      } else if (exportDataType === "all") {
        const [prodRes, ordRes, profRes] = await Promise.all([
          supabase.from("products").select("*"),
          supabase.from("orders").select("*"),
          supabase.from("profiles").select("id, name, email, role, created_at"),
        ]);
        dataToExport = {
          metadata: { exported_at: new Date().toISOString(), system: "AURA STREET OS" },
          products: prodRes.data || [],
          orders: ordRes.data || [],
          customers: profRes.data || [],
        };
      }

      if (exportFormat === "json" || exportDataType === "all") {
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        triggerDownload(`${filename}.json`, jsonContent, "application/json");
      } else {
        const csvContent = convertToCSV(dataToExport);
        triggerDownload(`${filename}.csv`, csvContent, "text/csv");
      }

      setStatusMessage({
        type: "success",
        text: `Data successfully exported as ${exportFormat.toUpperCase()}!`,
      });
    } catch (err: any) {
      console.error("Export error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to export data." });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle File Upload & Parse
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setParseError(null);
    setParsedData([]);
    setPreviewing(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith(".json")) {
          const json = JSON.parse(content);
          const rows = Array.isArray(json) ? json : json.products || json.orders || [];
          if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("JSON file must contain an array of valid records.");
          }
          setParsedData(rows);
        } else if (file.name.endsWith(".csv")) {
          const lines = content.split("\n").filter((l) => l.trim().length > 0);
          if (lines.length < 2) throw new Error("CSV file is empty or missing headers.");

          const headers = lines[0].split(",").map((h) => h.replace(/^"(.*)"$/, "$1").trim());
          const records: any[] = [];

          for (let i = 1; i < lines.length; i++) {
            // Basic CSV parser splitting on comma outside quotes
            const rowValues = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(",");
            const rowObj: any = {};
            headers.forEach((h, idx) => {
              let val = rowValues[idx] ? rowValues[idx].trim().replace(/^"(.*)"$/, "$1") : "";
              // Try parsing JSON if field is serialized
              if ((val.startsWith("{") && val.endsWith("}")) || (val.startsWith("[") && val.endsWith("]"))) {
                try { val = JSON.parse(val.replace(/""/g, '"')); } catch {}
              }
              rowObj[h] = val;
            });
            records.push(rowObj);
          }
          setParsedData(records);
        } else {
          throw new Error("Unsupported format. Please upload a .csv or .json file.");
        }
        setPreviewing(true);
      } catch (err: any) {
        setParseError(err.message || "Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  // Handle Commit Import to Database
  const handleCommitImport = async () => {
    if (isUnauthorized || parsedData.length === 0) return;
    setIsProcessing(true);
    setStatusMessage(null);

    try {
      if (importTarget === "products") {
        // Sanitize product entries
        const sanitizedProducts = parsedData.map((item) => ({
          name: item.name || "Imported Apparel Item",
          description: item.description || "Techwear fashion piece.",
          price: parseFloat(item.price) || 120,
          category: item.category || "Hoodies",
          stock: parseInt(item.stock) || 10,
          images: Array.isArray(item.images) ? item.images : ["/hero-editorial.png"],
          material: item.material || "Tech Weave",
          colorways: parseInt(item.colorways) || 1,
          is_active: item.is_active !== undefined ? Boolean(item.is_active) : true,
        }));

        const { error } = await supabase.from("products").insert(sanitizedProducts);
        if (error) throw error;
      } else if (importTarget === "orders") {
        const sanitizedOrders = parsedData.map((item) => ({
          order_code: item.order_code || `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_name: item.customer_name || "Guest Customer",
          customer_email: item.customer_email || "customer@aurastreet.com",
          status: item.status || "Pending",
          total: parseFloat(item.total) || 150,
          items: Array.isArray(item.items) ? item.items : [{ product_name: "Imported Item", quantity: 1, unit_price: 150 }],
          shipping_address: item.shipping_address || "Standard Transit Hub",
          notes: item.notes || "Batch imported record",
        }));

        const { error } = await supabase.from("orders").insert(sanitizedOrders);
        if (error) throw error;
      }

      setStatusMessage({
        type: "success",
        text: `Successfully imported ${parsedData.length} ${importTarget} into database!`,
      });
      setParsedData([]);
      setImportFile(null);
      setPreviewing(false);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Import commit error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to commit import records." });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-neutral-900 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 border ${accentBorderClass} ${accentBgClass}`}>
              <Database className={`h-5 w-5 ${accentColorClass}`} />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
                Data Import & Export Suite
              </h2>
              <p className="text-[9px] font-mono uppercase tracking-[0.14em] text-neutral-500">
                Authorized role: <span className={accentColorClass}>{role.toUpperCase().replace("_", " ")}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white p-2 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Security Guard Notice for Staff */}
        {isUnauthorized ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">RESTRICTED AUTHORITY PROTOCOL</h3>
            <p className="text-xs text-neutral-400 max-w-md font-mono">
              Staff accounts have read-only telemetry permissions. Data export and database batch insertion privileges are strictly granted to Admin and Super Admin accounts.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 border border-neutral-800 text-xs uppercase tracking-widest text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
            >
              Return to Telemetry Feed
            </button>
          </div>
        ) : (
          <>
            {/* Tab Controls */}
            <div className="flex border-b border-neutral-900 bg-black/30">
              <button
                onClick={() => { setActiveTab("export"); setStatusMessage(null); }}
                className={`flex-1 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === "export"
                    ? `${accentColorClass} ${isSuperAdmin ? "border-red-500" : "border-[#00d2ff]"} bg-white/[0.02]`
                    : "text-neutral-500 border-transparent hover:text-white"
                }`}
              >
                <Download className="h-4 w-4" /> Export Store Telemetry
              </button>
              <button
                onClick={() => { setActiveTab("import"); setStatusMessage(null); }}
                className={`flex-1 py-3.5 text-xs font-mono font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === "import"
                    ? `${accentColorClass} ${isSuperAdmin ? "border-red-500" : "border-[#00d2ff]"} bg-white/[0.02]`
                    : "text-neutral-500 border-transparent hover:text-white"
                }`}
              >
                <Upload className="h-4 w-4" /> Batch Import Data
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Status Toast Banner */}
              {statusMessage && (
                <div className={`p-4 border text-xs font-mono flex items-center gap-3 ${
                  statusMessage.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                  {statusMessage.type === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                  )}
                  <span>{statusMessage.text}</span>
                </div>
              )}

              {activeTab === "export" ? (
                <div className="space-y-6">
                  {/* Export Options */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
                      1. Select Target Data Category
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: "products", label: "Catalog Products" },
                        { id: "orders", label: "Customer Orders" },
                        { id: "customers", label: "User Profiles" },
                        { id: "all", label: "Master Archive" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setExportDataType(item.id as any)}
                          className={`p-3 text-left border font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                            exportDataType === item.id
                              ? `${accentBorderClass} ${accentBgClass} ${accentColorClass} font-bold`
                              : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
                      2. Select Export Format
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setExportFormat("csv")}
                        disabled={exportDataType === "all"}
                        className={`p-4 border flex items-center justify-between font-mono text-xs uppercase tracking-wider cursor-pointer ${
                          exportFormat === "csv" && exportDataType !== "all"
                            ? `${accentBorderClass} ${accentBgClass} ${accentColorClass} font-bold`
                            : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700"
                        } ${exportDataType === "all" ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <span className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" /> CSV Format (.csv)
                        </span>
                        {exportFormat === "csv" && <CheckCircle2 className="h-4 w-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExportFormat("json")}
                        className={`p-4 border flex items-center justify-between font-mono text-xs uppercase tracking-wider cursor-pointer ${
                          exportFormat === "json" || exportDataType === "all"
                            ? `${accentBorderClass} ${accentBgClass} ${accentColorClass} font-bold`
                            : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FileJson className="h-4 w-4" /> JSON Object (.json)
                        </span>
                        {(exportFormat === "json" || exportDataType === "all") && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-900 flex justify-end">
                    <button
                      onClick={handleExport}
                      disabled={isProcessing}
                      className={`px-6 py-3 text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 transition-all cursor-pointer ${accentBtnClass}`}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Compiling Data...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" /> Download Telemetry Export
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* Import Tab */
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
                      1. Select Destination Database Table
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "products", label: "Catalog Products Table" },
                        { id: "orders", label: "Customer Orders Table" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setImportTarget(item.id as any)}
                          className={`p-3 text-left border font-mono text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                            importTarget === item.id
                              ? `${accentBorderClass} ${accentBgClass} ${accentColorClass} font-bold`
                              : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
                      2. Upload Source File (.csv or .json)
                    </label>
                    <div className="border-2 border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-900/30 p-8 text-center relative transition-colors">
                      <input
                        type="file"
                        accept=".csv, .json"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                      />
                      <FileUp className={`h-8 w-8 mx-auto mb-3 ${accentColorClass}`} />
                      <p className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                        {importFile ? importFile.name : "Drag & Drop or Click to Upload"}
                      </p>
                      <p className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
                        Supports valid JSON structure or header-first CSV formatting
                      </p>
                    </div>
                  </div>

                  {parseError && (
                    <div className="p-3 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{parseError}</span>
                    </div>
                  )}

                  {/* Preview Table */}
                  {previewing && parsedData.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-white uppercase tracking-wider flex items-center gap-2">
                          <Eye className="h-4 w-4 text-emerald-400" /> Parsed Preview ({parsedData.length} records ready)
                        </span>
                        <span className="text-neutral-500 text-[9px] uppercase">
                          Target: {importTarget.toUpperCase()}
                        </span>
                      </div>
                      <div className="max-h-48 overflow-auto border border-neutral-800 bg-black/60 font-mono text-[9px]">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-neutral-900 text-neutral-400 uppercase border-b border-neutral-800">
                            <tr>
                              {Object.keys(parsedData[0]).slice(0, 5).map((col) => (
                                <th key={col} className="p-2">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-800 text-neutral-300">
                            {parsedData.slice(0, 5).map((row, idx) => (
                              <tr key={idx}>
                                {Object.keys(parsedData[0]).slice(0, 5).map((col) => (
                                  <td key={col} className="p-2 truncate max-w-[120px]">
                                    {typeof row[col] === "object" ? JSON.stringify(row[col]) : String(row[col])}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3">
                    <button
                      onClick={onClose}
                      className="px-5 py-2.5 border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCommitImport}
                      disabled={isProcessing || !previewing || parsedData.length === 0}
                      className={`px-6 py-2.5 text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-2 transition-all cursor-pointer ${
                        previewing && parsedData.length > 0
                          ? accentBtnClass
                          : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Inserting Database Records...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" /> Commit Batch Import ({parsedData.length})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
