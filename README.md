# Hashtag Sentiment Insight Page

A Next.js application that displays sentiment analysis for social media hashtags through interactive charts.

## 📋 Overview

This project implements a dynamic page for viewing sentiment trends of specific hashtags over time. Users can access detailed sentiment insights by navigating to `/insights/[hashtag]`, where data is fetched from a mock backend API and displayed in an interactive chart.

- **Link to deployed site**: (https://uri-hashtag-insights-mu.vercel.app/)

## ✨ Features

- **Dynamic routing** for individual hashtag analysis
- **Interactive line charts** displaying sentiment trends over time
- **Responsive design** for optimal viewing on mobile and desktop
- **Performance optimizations** using React.memo, useMemo, and useCallback
- **Loading and error states** for improved user experience
- **Visual indicators** showing trend direction

## 🖼️ Screenshots

![Hashtag Sentiment Dashboard](https://i.ibb.co/Z6cVYF6V/Screenshot-2025-04-07-061509.png)
![Insights Dark Mode](https://i.ibb.co/6cbjLCJh/Screenshot-2025-04-07-060315.png)
![Insights Dark Mode](https://i.ibb.co/BVYJVx8S/Screenshot-2025-04-07-060342.png)
![Insights Dark Mode Bar Chart](https://i.ibb.co/FkbkL7Xb/Screenshot-2025-04-07-061847.png)
![Insights Light Mode](https://i.ibb.co/PZp08DJ7/Screenshot-2025-04-07-060406.png)
![Mobile Dark Mode](https://i.ibb.co/kg9FKC8D/Screenshot-2025-04-07-063541.png)

## 🏗️ Project Structure

```
/pages
  /insights/[hashtag].tsx  # Dynamic route for hashtag insights
  /api/trends/[hashtag].ts # API endpoint for hashtag data
/components
  HashtagTrendCard.tsx     # Card container for hashtag info
  SentimentChart.tsx       # Line chart visualization component
/hooks
  useHashtagTrend.ts       # Custom hook for data fetching
/mocks
  trendData.ts             # Mock data for development
```

## 🛠️ Technical Implementation

### Tech Stack

- **Next.js** - React framework for server-rendered applications
- **TypeScript** - Static typing for improved development experience
- **@mui/x-charts** - For interactive data visualization
- **React Query** - For data fetching, caching, and state management

### Key Components

1. **HashtagTrendCard**
   - Container component for displaying hashtag information
   - Shows title, date range, and trend direction indicator
   - Handles responsive layout adjustments

2. **SentimentChart**
   - Implements the interactive line chart using @mui/x-charts
   - Memoized rendering for performance optimization
   - Handles different data states (loading, error, success)

3. **useHashtagTrend Hook**
   - Custom hook for fetching and managing hashtag trend data
   - Implements React Query for data fetching with caching
   - Provides loading, error, and data states

### Performance Optimizations

- **React.memo** on components to prevent unnecessary re-renders
- **useMemo** for expensive calculations and derived data
- **useCallback** for stable function references
- **Next.js dynamic imports** for code splitting
- **React Query caching** for efficient data fetching

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Dollypee/uri-hashtag-insight.git
   cd uri-hashtag-insight
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000/insights/uri](http://localhost:3000/insights/uri) in your browser

### API Endpoints

The application uses the following API endpoint:

- `GET /api/trends/[hashtag]` - Returns sentiment data for a specific hashtag

Example response:
```json
{
  "hashtag": "#uri",
  "range": "Apr 1 - Apr 7, 2025",
  "trend": [
    { "date": "2025-04-01", "sentiment": -0.2 },
    { "date": "2025-04-02", "sentiment": 0.0 },
    { "date": "2025-04-03", "sentiment": 0.1 },
    { "date": "2025-04-04", "sentiment": 0.3 },
    { "date": "2025-04-05", "sentiment": 0.2 },
    { "date": "2025-04-06", "sentiment": 0.4 },
    { "date": "2025-04-07", "sentiment": 0.5 }
  ]
}
```

## 🔍 Development Approach

I approached this project with a focus on component reusability, performance optimization, and user experience. Here's how I tackled the key requirements:

1. **Dynamic Routing**
   - Implemented Next.js dynamic routes with the `[hashtag]` parameter
   - Created a clean URL structure for easy access to different hashtags

2. **Data Fetching**
   - Used React Query for efficient data fetching with built-in caching
   - Created a custom hook to encapsulate fetching logic
   - Implemented loading and error states for a smooth user experience

3. **Chart Visualization**
   - Used @mui/x-charts LineChart for interactive data visualization
   - Applied custom styling to match the application theme
   - Implemented responsive design for mobile compatibility

4. **Performance**
   - Applied memoization techniques to prevent unnecessary renders
   - Optimized component trees to minimize re-renders
   - Used code splitting where appropriate

## ⚠️ Challenges and Solutions

1. **Challenge**: Ensuring responsive chart rendering on various screen sizes
   **Solution**: Implemented dynamic width calculations and breakpoint-based adjustments using CSS media queries and ResizeObserver

2. **Challenge**: Preventing unnecessary re-renders in the chart component
   **Solution**: Used React memo and carefully structured component hierarchy to minimize render cycles

3. **Challenge**: Handling loading and error states gracefully
   **Solution**: Created dedicated UI components for loading and error states with appropriate feedback and retry mechanisms


## ⏱️ Time Spent

Total development time: Approximately 2 hours

- Planning and setup: 20 minutes
- Component implementation: 30 minutes
- Styling and responsiveness: 15 minutes
- Testing and refinement: 55 minutes

