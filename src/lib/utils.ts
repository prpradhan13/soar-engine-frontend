import type { cloudAlertType } from "@/types";
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