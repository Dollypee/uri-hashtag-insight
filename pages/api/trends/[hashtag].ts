// pages/api/trends/[hashtag].ts

import trendData from '@/mocks/trendData';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { hashtag } = req.query;
  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  if (!hashtag || Array.isArray(hashtag)) {
    return res.status(400).json({ message: 'Invalid hashtag parameter' });
  }
  
  // Remove the '#' if it's included in the URL
  const cleanHashtag = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
  
  // For demo purposes, always return the mock data with the requested hashtag
  const response = {
    ...trendData,
    hashtag: `#${cleanHashtag}`
  };
  
  // Simulate network delay
  setTimeout(() => {
    res.status(200).json(response);
  }, 500);
}