"use client";

import { ShieldAlert, Key } from "lucide-react";

export default function SuperAdminSettings() {
  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold uppercase tracking-widest text-white mb-2">
          System Settings
        </h1>
        <p className="text-xs text-red-500 uppercase tracking-widest font-bold">
          Warning: Destructive actions available.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 max-w-3xl">
        
        {/* API Keys */}
        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-neutral-800 pb-4">
            <Key className="w-5 h-5 text-white" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-white">API Keys</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Stripe Secret Key</label>
              <input type="password" value="sk_test_1234567890abcdef" readOnly className="w-full mt-2 bg-black border border-neutral-800 rounded py-2 px-3 text-white font-mono text-xs" />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Vercel Deploy Hook</label>
              <input type="password" value="https://api.vercel.com/v1/integrations/deploy/..." readOnly className="w-full mt-2 bg-black border border-neutral-800 rounded py-2 px-3 text-white font-mono text-xs" />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="p-6 bg-red-950/10 border border-red-900/50 rounded-xl">
          <div className="flex items-center gap-3 mb-6 border-b border-red-900/30 pb-4">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-red-500">Danger Zone</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-bold text-white">Purge All Mock Data</h4>
                <p className="text-xs text-neutral-500 mt-1">Permanently remove all test orders and users.</p>
              </div>
              <button className="px-4 py-2 bg-black border border-red-500/50 text-red-500 text-[10px] uppercase tracking-widest font-bold rounded hover:bg-red-500 hover:text-white transition-colors">
                Purge Data
              </button>
            </div>
            <div className="flex justify-between items-center border-t border-red-900/30 pt-6">
              <div>
                <h4 className="text-sm font-bold text-white">Maintenance Mode</h4>
                <p className="text-xs text-neutral-500 mt-1">Take the storefront offline.</p>
              </div>
              <button className="px-4 py-2 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded hover:bg-neutral-200 transition-colors">
                Enable
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
