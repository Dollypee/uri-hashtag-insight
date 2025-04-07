// hooks/useHashtagTrend.ts
import { useQuery } from 'react-query';

interface TrendData {
  date: string;
  sentiment: number;
}

interface HashtagTrendResponse {
  hashtag: string;
  range: string;
  trend: TrendData[];
}

async function fetchHashtagTrend(hashtag: string): Promise<HashtagTrendResponse> {
  if (!hashtag) {
    throw new Error('Hashtag is required');
  }
  
  const response = await fetch(`/api/trends/${hashtag}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch data for ${hashtag}`);
  }
  
  return response.json();
}

export default function useHashtagTrend(hashtag: string | undefined) {
  return useQuery<HashtagTrendResponse, Error>(
    ['hashtagTrend', hashtag],
    () => fetchHashtagTrend(hashtag as string),
    {
      enabled: !!hashtag,
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
}