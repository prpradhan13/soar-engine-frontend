import { useState } from "react";
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

const HomePage = () => {
    const navigate = useNavigate();
  const [activeBlocks, setActiveBlocks] = useState([
    {
      id: "1",
      ip: "192.168.2.10",
      port: "445",
      time: "2 mins ago",
      reason:
        "Unauthorized SMB probe indicating potential ransomware reconnaissance.",
      confidence: 95,
    },
  ]);

  const [auditLogs] = useState([
    {
      id: "101",
      ip: "192.168.2.10",
      protocol: "TCP",
      port: "445",
      decision: "BLOCK",
      reason:
        "Unauthorized SMB probe indicating potential ransomware reconnaissance.",
      time: "11:08 AM",
    },
    {
      id: "102",
      ip: "192.168.2.10",
      protocol: "ICMP",
      port: "Any",
      decision: "IGNORE",
      reason:
        "ICMP traffic is standard background noise. Throttled 19 duplicate logs.",
      time: "11:05 AM",
    },
    {
      id: "103",
      ip: "34.107.221.82",
      protocol: "TCP",
      port: "80",
      decision: "IGNORE",
      reason:
        "External web crawler signature detected. Dropped by default WAN rules.",
      time: "10:42 AM",
    },
  ]);

  const handleUnblock = (id: string, ip: string) => {
    // In your real app, this will call: POST /api/firewall/unblock { ip }
    setActiveBlocks(activeBlocks.filter((block) => block.id !== id));
    alert(`[MOCK API] Sent pfctl unlock command for ${ip}`);
  };

  const handleCloudAlertClick = () => {
    navigate("/cloud-alerts");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              SOAR Engine
            </h1>
            <p className="text-sm text-slate-400">
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

            <button onClick={handleCloudAlertClick} className="cursor-pointer flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-sm font-medium border border-emerald-500/20">
              Cloud Alerts
            </button>
          </div>
        </header>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <ShieldAlert size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Active Containments</p>
              <p className="text-2xl font-bold text-white">
                {activeBlocks.length}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">Events Analyzed (24h)</p>
              <p className="text-2xl font-bold text-white">1,248</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <BrainCircuit size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-400">AI Confidence Avg</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column: Active Blocks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Shield size={18} className="text-slate-400" />
              Active Firewall Blocks
            </h2>

            {activeBlocks.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
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
                    key={block.id}
                    className="bg-slate-900 border border-red-500/30 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-4 transition-all hover:border-red-500/50 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-mono font-bold text-red-400">
                          {block.ip}
                        </span>
                        <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          Port {block.port}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={12} /> {block.time}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{block.reason}</p>
                      <p className="text-xs text-purple-400 mt-2 font-medium">
                        AI Confidence: {block.confidence}%
                      </p>
                    </div>
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleUnblock(block.id, block.ip)}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
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
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={18} className="text-slate-400" />
              Live AI Audit Log
            </h2>
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-800/50 max-h-125 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-slate-800/30 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm text-slate-300">
                        {log.ip}
                      </span>
                      <span className="text-xs text-slate-500">{log.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      {log.decision === "BLOCK" ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">
                          <XCircle size={12} /> BLOCK
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          <CheckCircle2 size={12} /> IGNORE
                        </span>
                      )}
                      <span className="text-xs text-slate-500 font-mono">
                        {log.protocol}:{log.port}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">
                      {log.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
