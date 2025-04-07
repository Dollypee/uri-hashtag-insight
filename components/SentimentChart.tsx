// // components/SentimentChart.tsx
// import React, { useMemo, useState } from 'react';
// import { LineChart, BarChart } from '@mui/x-charts';
// import { 
//   useTheme, 
//   Box, 
//   Paper, 
//   ToggleButtonGroup, 
//   ToggleButton, 
//   Typography, 
//   Chip,
//   useMediaQuery,
//   IconButton,
//   Tooltip,
//   alpha,
//   Card,
//   Stack,
//   Slider,
//   CardContent
// } from '@mui/material';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import TrendingDownIcon from '@mui/icons-material/TrendingDown';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import ZoomInIcon from '@mui/icons-material/ZoomIn';
// import ZoomOutIcon from '@mui/icons-material/ZoomOut';
// import RestoreIcon from '@mui/icons-material/Restore';

// interface SentimentData {
//   date: string;
//   sentiment: number;
// }

// interface SentimentChartProps {
//   data: SentimentData[];
//   chartType?: string;
// }

// // Color constants for different sentiment ranges
// const SENTIMENT_COLORS = {
//   veryPositive: '#00C853', // bright green
//   positive: '#64DD17',     // lime green
//   neutral: '#FFD600',      // yellow
//   negative: '#FF9100',     // orange
//   veryNegative: '#DD2C00'  // deep orange/red
// };

// // Function to get color based on sentiment value
// const getSentimentColor = (value: number): string => {
//   if (value >= 0.5) return SENTIMENT_COLORS.veryPositive;
//   if (value >= 0.2) return SENTIMENT_COLORS.positive;
//   if (value >= -0.2) return SENTIMENT_COLORS.neutral;
//   if (value >= -0.5) return SENTIMENT_COLORS.negative;
//   return SENTIMENT_COLORS.veryNegative;
// };

// const SentimentChart = React.memo(({ data, chartType = 'line' }: SentimentChartProps) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [timeRange, setTimeRange] = useState<number[]>([0, 100]); // percentage of visible range
//   const [highlightExtreme, setHighlightExtreme] = useState<boolean>(true);
//   const [viewMode, setViewMode] = useState<string>(chartType);
  
//   // Process data for the chart
//   const { 
//     xLabels, 
//     sentimentValues, 
//     formattedDates, 
//     minSentiment, 
//     maxSentiment,
//     visibleData,
//     sentimentColors
//   } = useMemo(() => {
//     // Apply range filter if not showing all data
//     const startIdx = Math.floor(data.length * (timeRange[0] / 100));
//     const endIdx = Math.ceil(data.length * (timeRange[1] / 100));
//     const visibleData = data.slice(startIdx, endIdx);
    
//     const xLabels = visibleData.map(item => new Date(item.date));
//     const sentimentValues = visibleData.map(item => item.sentiment);
//     const formattedDates = visibleData.map(item => {
//       const date = new Date(item.date);
//       return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//     });
    
//     // For min/max highlights
//     const allValues = data.map(item => item.sentiment);
//     const minSentiment = {
//       value: Math.min(...allValues),
//       date: data[allValues.indexOf(Math.min(...allValues))].date,
//       formatted: new Date(data[allValues.indexOf(Math.min(...allValues))].date)
//         .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//     };
    
//     const maxSentiment = {
//       value: Math.max(...allValues),
//       date: data[allValues.indexOf(Math.max(...allValues))].date,
//       formatted: new Date(data[allValues.indexOf(Math.max(...allValues))].date)
//         .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
//     };
    
//     // Generate colors for bar chart
//     const sentimentColors = sentimentValues.map(getSentimentColor);
    
//     return { 
//       xLabels, 
//       sentimentValues, 
//       formattedDates,
//       minSentiment,
//       maxSentiment,
//       visibleData,
//       sentimentColors
//     };
//   }, [data, timeRange]);

//   // Reset zoom to show all data
//   const handleResetZoom = () => {
//     setTimeRange([0, 100]);
//   };
  
//   // Zoom in (reduce visible range)
//   const handleZoomIn = () => {
//     const currentRange = timeRange[1] - timeRange[0];
//     if (currentRange <= 20) return; // Minimum zoom level
    
//     const midpoint = (timeRange[0] + timeRange[1]) / 2;
//     const newHalfRange = currentRange * 0.4; // Zoom in by 20%
    
//     setTimeRange([
//       Math.max(0, midpoint - newHalfRange),
//       Math.min(100, midpoint + newHalfRange)
//     ]);
//   };
  
//   // Zoom out (increase visible range)
//   const handleZoomOut = () => {
//     const currentRange = timeRange[1] - timeRange[0];
//     const midpoint = (timeRange[0] + timeRange[1]) / 2;
//     const newHalfRange = currentRange * 0.6; // Zoom out by 20%
    
//     setTimeRange([
//       Math.max(0, midpoint - newHalfRange),
//       Math.min(100, midpoint + newHalfRange)
//     ]);
//   };
  
//   // Handle slider change
//   const handleRangeChange = (event: Event, newValue: number | number[]) => {
//     setTimeRange(newValue as number[]);
//   };

//   // Handle chart type change
//   const handleViewModeChange = (
//     event: React.MouseEvent<HTMLElement>,
//     newViewMode: string,
//   ) => {
    
//     if (newViewMode !== null) {
//       setViewMode(newViewMode);
//     }
//   };

//   // Handle toggle for extreme value highlights
//   const handleToggleExtreme = () => {
//     setHighlightExtreme(!highlightExtreme);
//   };

//   // Render Area/Line chart
//   const renderLineChart = () => (
//     <LineChart
//       xAxis={[
//         {
//           data: xLabels,
//           scaleType: 'time',
//           valueFormatter: (date) => {
//             if (!(date instanceof Date)) return '';
//             return date.toLocaleDateString('en-US', { 
//               month: 'short', 
//               day: 'numeric' 
//             });
//           },
//           tickNumber: isMobile ? 3 : visibleData.length > 10 ? 8 : visibleData.length,
//         },
//       ]}
//       series={[
//         {
//           data: sentimentValues,
//           label: 'Sentiment',
//           area: viewMode === 'area',
//           showMark: visibleData.length < 15,
//           color: theme.palette.primary.main,
//           valueFormatter: (value) => `${value?.toFixed(2)}`,
//           connectNulls: true,
//         },
//       ]}
//       tooltip={{ 
//         trigger: 'item',
//       }}
//       height={350}
//       margin={{
//         left: 40,
//         right: 20,
//         top: highlightExtreme ? 30 : 20,
//         bottom: 30,
//       }}
//       slotProps={{
//         legend: {
//           hidden: true,
//         },
//       }}
//       sx={{
//         '.MuiLineElement-root': {
//           strokeWidth: 3,
//         },
//         '.MuiMarkElement-root': {
//           stroke: theme.palette.background.paper,
//           scale: '0.6',
//           strokeWidth: 2,
//         },
//         '.MuiAreaElement-root': {
//           fillOpacity: 0.3,
//         },
//       }}
//     />
//   );
  
//   // Render Bar chart
//   const renderBarChart = () => (
//     <BarChart
//       xAxis={[
//         {
//           data: formattedDates,
//           scaleType: 'band',          
//           tickNumber: isMobile ? 3 : visibleData.length > 10 ? 8 : visibleData.length,
//         },
//       ]}
//       series={[
//         {
//           data: sentimentValues,
//           label: 'Sentiment',
//           valueFormatter: (value) => `${value?.toFixed(2)}`,
//           color: (_, index) => sentimentColors[index],
//         },
//       ]}
//       tooltip={{ 
//         trigger: 'item',
//       }}
//       height={350}
//       margin={{
//         left: 40,
//         right: 20,
//         top: highlightExtreme ? 30 : 20,
//         bottom: 30,
//       }}
//       slotProps={{
//         legend: {
//           hidden: true,
//         },
//       }}
//     />
//   );

//   return (
//     <Card elevation={1} sx={{ overflow: 'visible' }}>
//       <CardContent sx={{ pb: 1 }}>
//         {/* Chart controls */}
//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'space-between', 
//           alignItems: 'center', 
//           mb: 2,
//           flexWrap: 'wrap',
//           gap: 1
//         }}>
//           <Typography variant="h6" component="h2">
//             Sentiment Analysis
//           </Typography>
          
//           <Stack direction="row" spacing={1}>
//             <ToggleButtonGroup
//               value={viewMode}
//               exclusive
//               onChange={handleViewModeChange}
//               size="small"
//               aria-label="chart view mode"
//             >
//               <ToggleButton value="line" aria-label="line chart">
//                 Line
//               </ToggleButton>
//               <ToggleButton value="area" aria-label="area chart">
//                 Area
//               </ToggleButton>
//               <ToggleButton value="bar" aria-label="bar chart">
//                 Bar
//               </ToggleButton>
//             </ToggleButtonGroup>
            
//             <Tooltip title="Toggle min/max highlights">
//               <IconButton 
//                 onClick={handleToggleExtreme} 
//                 color={highlightExtreme ? "primary" : "default"}
//                 size="small"
//               >
//                 <VisibilityIcon />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Box>

//         {/* Main chart */}
//         <Box sx={{ width: '100%', position: 'relative' }}>
//           {/* Min/Max labels */}
//           {highlightExtreme && (
//             <>
//               <Box 
//                 sx={{ 
//                   position: 'absolute', 
//                   top: 5, 
//                   left: 0,
//                   display: 'flex',
//                   gap: 2,
//                   flexWrap: 'wrap'
//                 }}
//               >
//                 <Box 
//                   sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center', 
//                     backgroundColor: alpha(SENTIMENT_COLORS.veryPositive, 0.1),
//                     px: 1,
//                     py: 0.5,
//                     borderRadius: 1
//                   }}
//                 >
//                   <TrendingUpIcon sx={{ color: SENTIMENT_COLORS.veryPositive, fontSize: 16, mr: 0.5 }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500, color: SENTIMENT_COLORS.veryPositive }}>
//                     High: {maxSentiment.value.toFixed(2)} on {maxSentiment.formatted}
//                   </Typography>
//                 </Box>
                
//                 <Box 
//                   sx={{ 
//                     display: 'flex', 
//                     alignItems: 'center',
//                     backgroundColor: alpha(SENTIMENT_COLORS.veryNegative, 0.1),
//                     px: 1,
//                     py: 0.5,
//                     borderRadius: 1
//                   }}
//                 >
//                   <TrendingDownIcon sx={{ color: SENTIMENT_COLORS.veryNegative, fontSize: 16, mr: 0.5 }} />
//                   <Typography variant="caption" sx={{ fontWeight: 500, color: SENTIMENT_COLORS.veryNegative }}>
//                     Low: {minSentiment.value.toFixed(2)} on {minSentiment.formatted}
//                   </Typography>
//                 </Box>
//               </Box>
//             </>
//           )}

//           {/* Chart */}
//           {viewMode === 'bar' ? renderBarChart() : renderLineChart()}
          
//           {/* Time range controls */}
//           <Box sx={{ px: 4, mt: 1 }}>
//             <Slider
//               value={timeRange}
//               onChange={handleRangeChange}
//               valueLabelDisplay="auto"
//               valueLabelFormat={(value) => `${value}%`}
//               disableSwap
//             />
//           </Box>
          
//           {/* Zoom controls */}
//           <Stack 
//             direction="row" 
//             spacing={1} 
//             justifyContent="center" 
//             mt={1}
//           >
//             <Tooltip title="Zoom in">
//               <IconButton onClick={handleZoomIn} size="small">
//                 <ZoomInIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Reset zoom">
//               <IconButton onClick={handleResetZoom} size="small">
//                 <RestoreIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//             <Tooltip title="Zoom out">
//               <IconButton onClick={handleZoomOut} size="small">
//                 <ZoomOutIcon fontSize="small" />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Box>

//         {/* Legend */}
//         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
//           <Chip 
//             size="small" 
//             label="Very Positive (≥0.5)" 
//             sx={{ bgcolor: alpha(SENTIMENT_COLORS.veryPositive, 0.2), color: SENTIMENT_COLORS.veryPositive, fontWeight: 500 }} 
//           />
//           <Chip 
//             size="small" 
//             label="Positive (0.2 to 0.5)" 
//             sx={{ bgcolor: alpha(SENTIMENT_COLORS.positive, 0.2), color: SENTIMENT_COLORS.positive, fontWeight: 500 }} 
//           />
//           <Chip 
//             size="small" 
//             label="Neutral (-0.2 to 0.2)" 
//             sx={{ bgcolor: alpha(SENTIMENT_COLORS.neutral, 0.2), color: theme.palette.text.primary, fontWeight: 500 }} 
//           />
//           <Chip 
//             size="small" 
//             label="Negative (-0.5 to -0.2)" 
//             sx={{ bgcolor: alpha(SENTIMENT_COLORS.negative, 0.2), color: SENTIMENT_COLORS.negative, fontWeight: 500 }} 
//           />
//           <Chip 
//             size="small" 
//             label="Very Negative (<-0.5)" 
//             sx={{ bgcolor: alpha(SENTIMENT_COLORS.veryNegative, 0.2), color: SENTIMENT_COLORS.veryNegative, fontWeight: 500 }} 
//           />
//         </Box>
//       </CardContent>
//     </Card>
//   );
// });

// export default SentimentChart;

import React, { useMemo, useState, useEffect } from 'react';
import { LineChart, BarChart } from '@mui/x-charts';
import { 
  useTheme, 
  Box, 
  Paper, 
  ToggleButtonGroup, 
  ToggleButton, 
  Typography, 
  Chip,
  useMediaQuery,
  IconButton,
  Tooltip,
  alpha,
  Card,
  Stack,
  Slider,
  CardContent,
  Badge,
  LinearProgress,
  Fade,
  Divider
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestoreIcon from '@mui/icons-material/Restore';
import InsightsIcon from '@mui/icons-material/Insights';
import MoodIcon from '@mui/icons-material/Mood';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { motion } from 'framer-motion';

// Define interfaces
interface SentimentData {
  date: string;
  sentiment: number;
}

interface SentimentChartProps {
  data: SentimentData[];
  chartType?: string;
}

// Color constants with enhanced palette
const SENTIMENT_COLORS = {
  veryPositive: '#00C853', // bright green
  positive: '#64DD17',     // lime green
  neutral: '#FFD600',      // yellow
  negative: '#FF9100',     // orange
  veryNegative: '#DD2C00'  // deep orange/red
};

// Trend calculation threshold - consider this many recent points for trend
const TREND_WINDOW_SIZE = 7;

// Function to get color based on sentiment value
const getSentimentColor = (value: number): string => {
  if (value >= 0.5) return SENTIMENT_COLORS.veryPositive;
  if (value >= 0.2) return SENTIMENT_COLORS.positive;
  if (value >= -0.2) return SENTIMENT_COLORS.neutral;
  if (value >= -0.5) return SENTIMENT_COLORS.negative;
  return SENTIMENT_COLORS.veryNegative;
};

// Calculate least squares regression for trend line
const calculateTrendLine = (data: SentimentData[]): { slope: number; intercept: number } => {
  if (data.length < 2) return { slope: 0, intercept: 0 };

  const xValues = data.map((_, i) => i);
  const yValues = data.map(d => d.sentiment);
  
  const n = data.length;
  const sumX = xValues.reduce((sum, val) => sum + val, 0);
  const sumY = yValues.reduce((sum, val) => sum + val, 0);
  const sumXY = xValues.reduce((sum, val, i) => sum + val * yValues[i], 0);
  const sumXX = xValues.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return { slope, intercept };
};

const SentimentChart = React.memo(({ data, chartType = 'line' }: SentimentChartProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [timeRange, setTimeRange] = useState<number[]>([0, 100]); // percentage of visible range
  const [highlightExtreme, setHighlightExtreme] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<string>(chartType);
  const [showTrendLine, setShowTrendLine] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Simulate loading effect
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [data, viewMode]);
  
  // Process data for the chart
  const { 
    xLabels, 
    sentimentValues, 
    formattedDates, 
    minSentiment, 
    maxSentiment,
    visibleData,
    sentimentColors,
    currentTrend,
    trendLineData,
    overallSentiment
  } = useMemo(() => {
    // Apply range filter if not showing all data
    const startIdx = Math.floor(data.length * (timeRange[0] / 100));
    const endIdx = Math.ceil(data.length * (timeRange[1] / 100));
    const visibleData = data.slice(startIdx, endIdx);
    
    const xLabels = visibleData.map(item => new Date(item.date));
    const sentimentValues = visibleData.map(item => item.sentiment);
    const formattedDates = visibleData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    // For min/max highlights
    const allValues = data.map(item => item.sentiment);
    const minSentiment = {
      value: Math.min(...allValues),
      date: data[allValues.indexOf(Math.min(...allValues))].date,
      formatted: new Date(data[allValues.indexOf(Math.min(...allValues))].date)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    const maxSentiment = {
      value: Math.max(...allValues),
      date: data[allValues.indexOf(Math.max(...allValues))].date,
      formatted: new Date(data[allValues.indexOf(Math.max(...allValues))].date)
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
    
    // Generate colors for bar chart
    const sentimentColors = sentimentValues.map(getSentimentColor);
    
    // Calculate trend direction (recent window)
    let currentTrend = { direction: 'neutral', value: 0, emoji: '➡️' };
    if (visibleData.length >= 2) {
      // Focus on most recent trend points
      const recentData = visibleData.slice(Math.max(0, visibleData.length - TREND_WINDOW_SIZE));
      const firstValue = recentData[0].sentiment;
      const lastValue = recentData[recentData.length - 1].sentiment;
      const trendChange = lastValue - firstValue;
      
      currentTrend.value = trendChange;
      
      if (trendChange > 0.1) {
        currentTrend.direction = 'up';
        currentTrend.emoji = '📈';
      } else if (trendChange < -0.1) {
        currentTrend.direction = 'down';
        currentTrend.emoji = '📉';
      }
    }
    
    // Calculate trend line for visible data
    const trend = calculateTrendLine(visibleData);
    const trendLineData = visibleData.map((_, i) => trend.intercept + trend.slope * i);
    
    // Calculate overall sentiment average
    const overallSentiment = sentimentValues.reduce((sum, val) => sum + val, 0) / sentimentValues.length;
    
    return { 
      xLabels, 
      sentimentValues, 
      formattedDates,
      minSentiment,
      maxSentiment,
      visibleData,
      sentimentColors,
      currentTrend,
      trendLineData,
      overallSentiment
    };
  }, [data, timeRange]);

  // Reset zoom to show all data
  const handleResetZoom = () => {
    setTimeRange([0, 100]);
  };
  
  // Zoom in (reduce visible range)
  const handleZoomIn = () => {
    const currentRange = timeRange[1] - timeRange[0];
    if (currentRange <= 20) return; // Minimum zoom level
    
    const midpoint = (timeRange[0] + timeRange[1]) / 2;
    const newHalfRange = currentRange * 0.4; // Zoom in by 20%
    
    setTimeRange([
      Math.max(0, midpoint - newHalfRange),
      Math.min(100, midpoint + newHalfRange)
    ]);
  };
  
  // Zoom out (increase visible range)
  const handleZoomOut = () => {
    const currentRange = timeRange[1] - timeRange[0];
    const midpoint = (timeRange[0] + timeRange[1]) / 2;
    const newHalfRange = currentRange * 0.6; // Zoom out by 20%
    
    setTimeRange([
      Math.max(0, midpoint - newHalfRange),
      Math.min(100, midpoint + newHalfRange)
    ]);
  };
  
  // Handle slider change
  const handleRangeChange = (event: Event, newValue: number | number[]) => {
    setTimeRange(newValue as number[]);
  };

  // Handle chart type change
  const handleViewModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newViewMode: string,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  // Handle toggle for extreme value highlights
  const handleToggleExtreme = () => {
    setHighlightExtreme(!highlightExtreme);
  };
  
  // Handle toggle for trend line
  const handleToggleTrendLine = () => {
    setShowTrendLine(!showTrendLine);
  };

  // Get sentiment meter status color
  const getSentimentMeterColor = (value: number) => {
    return {
      color: getSentimentColor(value),
      label: value >= 0.5 ? 'Very Positive' : 
             value >= 0.2 ? 'Positive' : 
             value >= -0.2 ? 'Neutral' : 
             value >= -0.5 ? 'Negative' : 'Very Negative'
    };
  };

  // Render Area/Line chart
  const renderLineChart = () => (
    <LineChart
      xAxis={[
        {
          data: xLabels,
          scaleType: 'time',
          valueFormatter: (date) => {
            if (!(date instanceof Date)) return '';
            return date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            });
          },
          tickNumber: isMobile ? 3 : visibleData.length > 10 ? 8 : visibleData.length,
        },
      ]}
      series={[
        {
          data: sentimentValues,
          label: 'Sentiment',
          area: viewMode === 'area',
          showMark: visibleData.length < 15,
          color: theme.palette.primary.main,
          valueFormatter: (value) => `${value?.toFixed(2)}`,
          connectNulls: true,
        },
        ...(showTrendLine ? [{
          data: trendLineData,
          label: 'Trend',
          // curve: '',
          showMark: false,
                  
          color: theme.palette.secondary.main,
          valueFormatter: (value: any) => `${value?.toFixed(2)}`,
        }] : []),
      ]}
      tooltip={{ 
        trigger: 'item',
        slots: {
          
        }
      }}

      slotProps={{
        legend: {
          // hidden: true,
        },
      }}
      height={350}
      margin={{
        left: 40,
        right: 20,
        top: highlightExtreme ? 30 : 20,
        bottom: 30,
      }}

      sx={{
        '.MuiLineElement-root': {
          strokeWidth: 3,
        },
        '.MuiMarkElement-root': {
          stroke: theme.palette.background.paper,
          scale: '0.6',
          strokeWidth: 2,
        },
        '.MuiAreaElement-root': {
          fillOpacity: 0.3,
        },
      }}
    />
  );
  
  // Render Bar chart
  const renderBarChart = () => (
    <BarChart
      xAxis={[
        {
          data: formattedDates,
          scaleType: 'band',          
          tickNumber: isMobile ? 3 : visibleData.length > 10 ? 8 : visibleData.length,
        },
      ]}
      series={[
        {
          data: sentimentValues,
          label: 'Sentiment',
          valueFormatter: (value) => `${value?.toFixed(2)}`,
          // color: sentimentColors[index],
          color: theme.palette.primary.light,

        },
      ]}
      tooltip={{ 
        trigger: 'item',
      }}
      height={350}
      margin={{
        left: 40,
        right: 20,
        top: highlightExtreme ? 30 : 20,
        bottom: 30,
      }}
      slotProps={{
        legend: {
          hidden: true,
        },
      }}
    />
  );

  // // Get sentiment summary icon
  const getSentimentIcon = (value: number) => {
    if (value >= 0) {
      return <MoodIcon sx={{ color: getSentimentColor(value) }} />;
    }
    return <SentimentVeryDissatisfiedIcon sx={{ color: getSentimentColor(value) }} />;
  };

  // Get trend icon/badge
  const getTrendBadge = () => {
    if (currentTrend.direction === 'up') {
      return (
        <Chip
          icon={<ArrowUpwardIcon />}
          label={`Improving (${currentTrend.value.toFixed(2)})`}
          color="success"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    } else if (currentTrend.direction === 'down') {
      return (
        <Chip
          icon={<ArrowDownwardIcon />}
          label={`Declining (${currentTrend.value.toFixed(2)})`}
          color="error"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      );
    }
    return (
      <Chip
        label="Stable"
        color="info"
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const sentimentMeter = getSentimentMeterColor(overallSentiment);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        elevation={2} 
        sx={{ 
          overflow: 'visible',
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`
            : `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          backdropFilter: 'blur(8px)',
          boxShadow: theme.shadows[5]
        }}
      >
        <CardContent sx={{ pb: 1 }}>
          {/* Header with title and meter */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="h5" 
                component="h2" 
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Sentiment Analysis
              </Typography>
              <Tooltip title={`Current trend: ${currentTrend.direction}`}>
                <Typography 
                  variant="h5" 
                  component="span"
                  sx={{ ml: 1, verticalAlign: 'middle' }}
                >
                  {currentTrend.emoji}
                </Typography>
              </Tooltip>
            </Box>
            
            <Stack direction="row" spacing={1}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                size="small"
                aria-label="chart view mode"
              >
                <ToggleButton value="line" aria-label="line chart">
                  Line
                </ToggleButton>
                <ToggleButton value="area" aria-label="area chart">
                  Area
                </ToggleButton>
                <ToggleButton value="bar" aria-label="bar chart">
                  Bar
                </ToggleButton>
              </ToggleButtonGroup>
              
              <Tooltip title="Toggle min/max highlights">
                <IconButton 
                  onClick={handleToggleExtreme} 
                  color={highlightExtreme ? "primary" : "default"}
                  size="small"
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>

              {viewMode !== 'bar' && (
                <Tooltip title="Toggle trend line">
                  <IconButton 
                    onClick={handleToggleTrendLine} 
                    color={showTrendLine ? "secondary" : "default"}
                    size="small"
                  >
                    <InsightsIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Box>

          {/* Summary metrics */}
          <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                flex: '1 1 auto',
                minWidth: { xs: '100%', sm: '280px' },
                background: alpha(theme.palette.background.paper, 0.6)
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">Overall Sentiment</Typography>
                {getSentimentIcon(overallSentiment)}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ mb: 1, fontWeight: 600, color: sentimentMeter.color }}
              >
                {sentimentMeter.label} ({overallSentiment.toFixed(2)})
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(overallSentiment + 1) * 50} 
                sx={{ 
                  height: 8, 
                  borderRadius: 1,
                  backgroundColor: alpha(theme.palette.grey[300], 0.5),
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: sentimentMeter.color
                  }
                }} 
              />
            </Paper>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5, 
                borderRadius: 2, 
                flex: '1 1 auto',
                minWidth: { xs: '100%', sm: '280px' },
                background: alpha(theme.palette.background.paper, 0.6)
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Recent Trend</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  {getTrendBadge()}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Last {Math.min(TREND_WINDOW_SIZE, visibleData.length)} data points
                </Typography>
              </Box>
            </Paper>
          </Box>

          {/* Main chart with loading state */}
          <Box sx={{ width: '100%', position: 'relative' }}>
            {isLoading ? (
              <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <LinearProgress sx={{ width: '50%', mb: 2 }} />
                <Typography variant="caption" color="text.secondary">Loading chart data...</Typography>
              </Box>
            ) : (
              <Fade in={!isLoading} timeout={500}>
                <Box>
                  {/* Min/Max labels */}
                  {highlightExtreme && (
                    <>
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          left: 10,
                          display: 'flex',
                          gap: 2,
                          flexWrap: 'wrap'
                        }}
                      >
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            backgroundColor: alpha(SENTIMENT_COLORS.veryPositive, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          <TrendingUpIcon sx={{ color: SENTIMENT_COLORS.veryPositive, fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption" sx={{ fontWeight: 500, color: SENTIMENT_COLORS.veryPositive }}>
                            High: {maxSentiment.value.toFixed(2)} on {maxSentiment.formatted}
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            backgroundColor: alpha(SENTIMENT_COLORS.veryNegative, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          <TrendingDownIcon sx={{ color: SENTIMENT_COLORS.veryNegative, fontSize: 16, mr: 0.5 }} />
                          <Typography variant="caption" sx={{ fontWeight: 500, color: SENTIMENT_COLORS.veryNegative }}>
                            Low: {minSentiment.value.toFixed(2)} on {minSentiment.formatted}
                          </Typography>
                        </Box>
                      </Box>
                    </>
                  )}

                  {/* Chart */}
                  {viewMode === 'bar' ? renderBarChart() : renderLineChart()}
                </Box>
              </Fade>
            )}
            
            {/* Time range controls */}
            <Box sx={{ px: 4, mt: 1 }}>
              <Slider
                value={timeRange}
                onChange={handleRangeChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                disableSwap
              />
            </Box>
            
            {/* Zoom controls */}
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center" 
              mt={1}
            >
              <Tooltip title="Zoom in">
                <IconButton onClick={handleZoomIn} size="small">
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset zoom">
                <IconButton onClick={handleResetZoom} size="small">
                  <RestoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom out">
                <IconButton onClick={handleZoomOut} size="small">
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Legend */}
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              size="small" 
              label="Very Positive (≥0.5)" 
              sx={{ bgcolor: alpha(SENTIMENT_COLORS.veryPositive, 0.2), color: SENTIMENT_COLORS.veryPositive, fontWeight: 500 }} 
            />
            <Chip 
              size="small" 
              label="Positive (0.2 to 0.5)" 
              sx={{ bgcolor: alpha(SENTIMENT_COLORS.positive, 0.2), color: SENTIMENT_COLORS.positive, fontWeight: 500 }} 
            />
            <Chip 
              size="small" 
              label="Neutral (-0.2 to 0.2)" 
              sx={{ bgcolor: alpha(SENTIMENT_COLORS.neutral, 0.2), color: theme.palette.text.primary, fontWeight: 500 }} 
            />
            <Chip 
              size="small" 
              label="Negative (-0.5 to -0.2)" 
              sx={{ bgcolor: alpha(SENTIMENT_COLORS.negative, 0.2), color: SENTIMENT_COLORS.negative, fontWeight: 500 }} 
            />
            <Chip 
              size="small" 
              label="Very Negative (<-0.5)" 
              sx={{ bgcolor: alpha(SENTIMENT_COLORS.veryNegative, 0.2), color: SENTIMENT_COLORS.veryNegative, fontWeight: 500 }} 
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SentimentChart;