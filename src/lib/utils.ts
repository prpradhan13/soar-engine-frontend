import type { cloudAlertType, firewallIncidentType } from "@/types";
import axios from "axios";

export const fetchCloudAlerts = async (): Promise<cloudAlertType[]> => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/cloud-alerts/allAlerts');
    return response.data.data || [];
    } catch (error) {
      console.error('Error fetching cloud alerts:', error);
      return [];
    }
};

export const fetchFirewallLiveIncidentData = async (): Promise<firewallIncidentType[]> => {
  try{
    const response = await axios.get('http://localhost:8080/api/v1/alerts/webhook');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching firewall live data:', error);
    return [];
  }
}