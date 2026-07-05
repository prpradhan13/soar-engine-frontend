export type cloudAlertType = {
  _id: string;
  src_ip: string;
  target_user: string;
  event_level: string;
  event_level_name: string;
  event_log: string;
  dest_port: string;
  protocol: string;
  interface: string;
  source_system: string;
  raw_log: string;
  timestamp: string;
};

type AIAnalysis = {
  action: "BLOCK" | "IGNORE";
  confidence: number;
  reason: string;
};

export type firewallIncidentType = {
  _id: string;
  src_ip: string;
  dest_port: string;
  protocol: string;
  interface: string;
  ai_analysis: AIAnalysis;
  status: string;
  timestamp: string;
};
