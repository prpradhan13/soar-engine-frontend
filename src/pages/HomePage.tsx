import { useState, useEffect } from "react";
import {
  Shield,
  ShieldAlert,
  Activity,
  BrainCircuit,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { firewallIncidentType } from "@/types";
import { fetchFirewallLiveIncidentData } from "@/lib/utils";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const HomePage = () => {
  const navigate = useNavigate();
  const [activeBlocks, setActiveBlocks] = useState<firewallIncidentType[]>([]);
  const [incidentLogs, setIncidentLogs] = useState<firewallIncidentType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const incidents = await fetchFirewallLiveIncidentData();
      setActiveBlocks(
        incidents.filter((incident) => incident.status === "BLOCK"),
      );
      setIncidentLogs(incidents);
    };

    fetchData();

    // Listen for new firewall incidents via WebSocket
    socket.on("new_incident", (incidentData) => {
      setIncidentLogs((prevLogs) => {
        const safePrev = Array.isArray(prevLogs) ? prevLogs : [];
        return [incidentData, ...safePrev];
      });
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("new_incident");
    };
  }, []);

  const handleUnblock = (id: string, ip: string) => {
    setActiveBlocks(activeBlocks.filter((block) => block._id !== id));
    alert(`[MOCK API] Sent pfctl unlock command for ${ip}`);
  };

  const handleCloudAlertClick = () => {
    navigate("/cloud-alerts");
  };

  return (
    <div className="min-h-screen bg-mainBG p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex justify-between items-center pb-4 border-b border-[#f8f9fa]/10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f8f9fa]">
              SOAR Engine
            </h1>
            <p className="text-sm text-[#ced4da]">
              Automated Threat Containment Dashboard
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Engine Active
            </div>

            <button
              onClick={handleCloudAlertClick}
              className="cursor-pointer flex items-center gap-2 bg-[#f8f9fa] hover:bg-[#dee2e6] px-3 py-1.5 rounded-full text-sm font-medium border border-[#6c757d]"
            >
              Cloud Alerts
            </button>
          </div>
        </header>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondaryBG p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm">Active Containments</p>
              <p className="text-2xl font-bold">{activeBlocks.length}</p>
            </div>
          </div>

          <div className="bg-secondaryBG border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm">Events Analyzed (24h)</p>
              <p className="text-2xl font-bold">1,248</p>
            </div>
          </div>

          <div className="bg-secondaryBG p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <BrainCircuit size={24} />
            </div>
            <div>
              <p className="text-sm">AI Confidence Avg</p>
              <p className="text-2xl font-bold">94%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Active Blocks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-[#f8f9fa]">
              <Shield size={18} />
              Active Firewall Blocks
            </h2>

            {activeBlocks.length !== 0 ? (
              <div className="bg-[#343a40] rounded-xl p-8 text-center text-[#f8f9fa]">
                <CheckCircle2
                  size={48}
                  className="mx-auto mb-3 text-emerald-500 opacity-50"
                />
                <p>No active threats. Network is secure.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeBlocks.map((block) => (
                  <div
                    key={block._id}
                    className="bg-[#343a40] rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 transition-all hover:border-red-500/50 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-mono font-bold text-red-400">
                          {block.src_ip}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          Port {block.dest_port}
                        </span>
                        <span className="text-xs text-[#f8f9fa] flex items-center gap-1">
                          <Clock size={12} />{" "}
                          {block.timestamp
                            ? new Date(block.timestamp).toLocaleTimeString()
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{block.status}</p>
                      <p className="text-xs text-purple-400 mt-2 font-medium">
                        AI Confidence: %
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleUnblock(block._id, block.src_ip)}
                        className="flex items-center gap-2 bg-secondaryBG hover:bg-[#ced4da] px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
                      >
                        <Unlock size={16} />
                        Unblock IP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Column: Audit Log */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-[#f8f9fa]">
              <Activity size={18} />
              Live AI Audit Log
            </h2>
            <div className="bg-[#343a40] rounded-xl overflow-hidden">
              <div className="divide-y divide-[#495057] max-h-125 overflow-y-auto">
                {incidentLogs.length === 0 ? (
                  <div className="p-4 text-center text-[#f8f9fa]">
                    No incidents logged yet.
                  </div>
                ) : (
                  incidentLogs.map((log) => (
                    <div
                      key={log._id}
                      className="p-4 hover:bg-[#495057] transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-sm text-[#f8f9fa] font-semibold">
                          {log.src_ip}
                        </span>
                        <span className="text-xs text-[#f8f9fa]">
                          {log.timestamp
                            ? new Date(log.timestamp).toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        {log.ai_analysis.action === "BLOCK" ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                            <XCircle size={12} /> BLOCK
                          </span>
                        ) : log.ai_analysis.action === "IGNORE" ? (
                          <span className="flex items-center gap-1 text-xs font-bold bg-[#6c757d] text-mainBG px-2 py-0.5 rounded">
                            <CheckCircle2 size={12} /> IGNORE
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-bold bg-[#6c757d] text-mainBG px-2 py-0.5 rounded">
                            <CheckCircle2 size={12} /> UNKNOWN
                          </span>
                        )}
                        <span className="text-xs text-[#adb5bd] font-mono">
                          {log.protocol}:{log.dest_port}
                        </span>
                      </div>
                      <p className="text-xs text-[#dee2e6] line-clamp-2">
                        {log.ai_analysis.reason}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
