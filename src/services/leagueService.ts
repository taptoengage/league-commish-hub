// The Commissioner - League API Service
// Adapter service that can switch between mock data and Sleeper API

import { LeagueDashboardDTO, ChatPreviewData } from '@/types/league';
import { mockLeagueService } from './mockLeagueService';

const SUPABASE_PROJECT_ID = 'qeczfwvdthkiqorirjae';
const EDGE_FUNCTION_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/league-dashboard`;

export class LeagueService {
  private useMockData: boolean;

  constructor(useMockData = true) {
    this.useMockData = useMockData;
  }

  async getLeagueDashboard(leagueId: string, week: number = 1, force = false): Promise<LeagueDashboardDTO> {
    if (this.useMockData) {
      console.log('Using mock data for league dashboard');
      return mockLeagueService.getLeagueDashboard(leagueId, week);
    }

    try {
      console.log(`Fetching league dashboard from API: ${leagueId}, week ${week}, force: ${force}`);
      
      const url = new URL(`${EDGE_FUNCTION_URL}/api/league/${leagueId}/dashboard`);
      url.searchParams.set('week', week.toString());
      if (force) {
        url.searchParams.set('force', 'true');
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API response received, cache status: ${response.headers.get('X-Cache') || 'UNKNOWN'}`);
      
      return data;
    } catch (error) {
      console.error('League API error, falling back to mock data:', error);
      // Fallback to mock data if API fails
      return mockLeagueService.getLeagueDashboard(leagueId, week);
    }
  }

  async getChatPreview(leagueId: string): Promise<ChatPreviewData> {
    // Chat is always mock for now
    return mockLeagueService.getChatPreview(leagueId);
  }

  // Method to toggle between mock and real API
  setUseMockData(useMock: boolean) {
    this.useMockData = useMock;
    console.log(`League service mode: ${useMock ? 'MOCK' : 'API'}`);
  }

  // Static method to check if API is available
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/api/league/test/dashboard?week=1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance (using mock by default as requested)
export const leagueService = new LeagueService(true);

// Export the class for custom instances
export default LeagueService;