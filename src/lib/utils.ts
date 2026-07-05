import type { cloudAlertType, firewallIncidentType, remediationType } from "@/types";
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

export const fetchFirewallIncidentData = async (): Promise<firewallIncidentType[]> => {
  try{
    const response = await axios.get('http://localhost:8080/api/v1/firewall/allIncidents');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching firewall live data:', error);
    return [];
  }
};

export const fetchLiveRemediationData = async (): Promise<remediationType[]> => {
  try{
    const response = await axios.get('http://localhost:8080/api/v1/firewall/allRemediation');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching live remediation data:', error);
    return [];
  } 
};