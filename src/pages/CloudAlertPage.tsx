import { fetchCloudAlerts } from '@/lib/utils';
import type { cloudAlertType } from '@/types';
import { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import { Cloud, Shield, Clock, AlertTriangle, Activity } from 'lucide-react';

const socket = io("http://localhost:8080");

const CloudAlertPage = () => {
  const [cloudAlerts, setCloudAlerts] = useState<cloudAlertType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial cloud alerts from the backend
    const getInitialCloudAlerts = async () => {
      const alerts = await fetchCloudAlerts();
      setCloudAlerts(alerts);
      setIsLoading(false);
    };

    getInitialCloudAlerts();

    // Listen for new cloud alerts via WebSocket
    socket.on("new_cloud_alert", (alertData) => {
      setCloudAlerts((prevAlerts) => {
        // Fail-safe: If prevAlerts isn't an array for some reason, default to an empty array
        const safePrev = Array.isArray(prevAlerts) ? prevAlerts : [];
        return [alertData, ...safePrev];
      });
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("new_cloud_alert");
    };
  }, []);

  console.log("Current Cloud Alerts:", cloudAlerts);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cloud className="text-blue-500" />
              Cloud Threat Intel
            </h1>
            <p className="text-sm text-slate-400 mt-1">Live monitoring for Azure Infrastructure</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Azure Sync Active
          </div>
        </header>

        {/* Alerts Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50">
            <Activity size={18} className="text-slate-400" />
            <h2 className="font-semibold text-slate-200">Recent Cloud Ingestions</h2>
            <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">
              Total: {cloudAlerts.length}
            </span>
          </div>

          <div className="divide-y divide-slate-800/50">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500">Loading secure logs...</div>
            ) : cloudAlerts.length === 0 ? (
              <div className="p-8 text-center text-slate-500 flex flex-col items-center">
                <Shield size={32} className="mb-2 opacity-20" />
                No cloud alerts found.
              </div>
            ) : (
              cloudAlerts.map((alert) => (
                <div key={alert._id} className="p-4 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row gap-4 justify-between items-start">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-red-400 flex items-center gap-1 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
                        <AlertTriangle size={14} />
                        {alert.src_ip}
                      </span>
                      <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                        Port {alert.dest_port}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-mono">
                        {alert.protocol}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 font-mono bg-slate-950 p-2 rounded border border-slate-800/50">
                      {alert.raw_log}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Just now'}
                    </span>
                    <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-md border border-blue-500/20 font-medium">
                      {alert.source_system}
                    </span>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default CloudAlertPage