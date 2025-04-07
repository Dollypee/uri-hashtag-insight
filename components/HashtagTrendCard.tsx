import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Chip, 
  Skeleton, 
  ToggleButtonGroup, 
  ToggleButton,
  useTheme,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GitHubIcon from '@mui/icons-material/GitHub';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import ShareIcon from '@mui/icons-material/Share';
import dynamic from 'next/dynamic';

// Lazy-load the chart component
const SentimentChart = dynamic(
  () => import('./SentimentChart'),
  { 
    loading: () => (
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={350} 
        animation="wave" 
        sx={{ borderRadius: 2 }}
      />
    ),
    ssr: false
  }
);

interface TrendData {
  date: string;
  sentiment: number;
}

interface HashtagTrendCardProps {
  hashtag: string;
  dateRange: string;
  isLoading: boolean;
  trend: { isPositive: boolean; difference: number } | null;
  data?: TrendData[];
}

const HashtagTrendCard = React.memo(({ 
  hashtag, 
  dateRange, 
  isLoading, 
  trend,
  data
}: HashtagTrendCardProps) => {
  const theme = useTheme();
  const [chartView, setChartView] = useState<string>('line');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  
  const handleChartViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    if (newView !== null) {
      setChartView(newView);
    }
  };
  
  const handleFullscreenToggle = () => {
    setIsFullscreen(prev => !prev);
  };
  
  const handleShare = (platform: 'twitter' | 'facebook' | 'github') => {
    // Create shareUrl based on hashtag and platform
    let shareUrl = '';
    let shareText = `Check out the sentiment trend for ${hashtag}`;
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=${hashtag.replace('#', '')}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'github':
        shareUrl = 'https://github.com/Dollypee/uri-hashtag-insight';
        break;
    }
    
    // Open share dialog in a new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };
  
  const renderTrendIndicator = () => {
    if (!trend) return null;
    
    const { isPositive, difference } = trend;
    const trendValue = Math.abs(difference).toFixed(2);
    
    if (Math.abs(difference) < 0.05) {
      return (
        <Chip
          icon={<TrendingFlatIcon />}
          label={`Stable (${trendValue})`}
          variant="filled"
          color="default"
          size="medium"
          sx={{ 
            borderRadius: 2,
            fontWeight: 500,
            px: 1,
            '& .MuiChip-icon': {
              color: 'inherit'
            }
          }}
        />
      );
    }
    
    return isPositive ? (
      <Chip
        icon={<TrendingUpIcon />}
        label={`Positive (+${trendValue})`}
        variant="filled"
        color="success"
        size="medium"
        sx={{ 
          borderRadius: 2,
          fontWeight: 500,
          px: 1,
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
    ) : (
      <Chip
        icon={<TrendingDownIcon />}
        label={`Negative (${trendValue})`}
        variant="filled"
        color="error"
        size="medium"
        sx={{ 
          borderRadius: 2,
          fontWeight: 500, 
          px: 1,
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
    );
  };
  
  const renderCardContent = () => (
    <>
      {/* Header section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          justifyContent: 'space-between',
          mb: 2,
          gap: 2
        }}>
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2
            }}
          >
            {hashtag}
            {!isLoading && renderTrendIndicator()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title={isFullscreen ? "Exit fullscreen" : "Toggle fullscreen"}>
              <IconButton 
                size="small" 
                sx={{ color: '#718096' }}
                onClick={handleFullscreenToggle}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ color: '#718096', fontSize: 18 }} />
            <Typography 
              variant="subtitle1" 
              color="text.secondary" 
              sx={{ fontWeight: 500 }}
            >
              {dateRange}
            </Typography>
          </Box>
          
          {/* Chart view toggle buttons - commented out per original code */}
          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <ToggleButtonGroup
              value={chartView}
              exclusive
              onChange={handleChartViewChange}
              size="small"
              sx={{ 
                '& .MuiToggleButton-root': {
                  borderRadius: 1,
                  px: 2
                }
              }}
            >
              <ToggleButton value="line">Line</ToggleButton>
              <ToggleButton value="area">Area</ToggleButton>
              <ToggleButton value="bar">Bar</ToggleButton>
            </ToggleButtonGroup>
          </Box> */}
        </Box>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {/* Chart section */}
      <Box sx={{ 
        width: '100%', 
        height: '100%', 
        minHeight: isFullscreen ? 500 : 350 
      }}>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={350} animation="wave" />
        ) : data ? (
          <SentimentChart data={data} chartType={chartView} />
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: 350,
              borderRadius: 2,
              backgroundColor: '#f7fafc'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No data available
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Footer section */}
      <Box sx={{ mt: 3, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Data refreshed on {new Date().toLocaleDateString()}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Share on Twitter">
            <IconButton 
              size="small" 
              sx={{ color: '#1DA1F2' }}
              onClick={() => handleShare('twitter')}
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Share on Facebook">
            <IconButton 
              size="small" 
              sx={{ color: '#4267B2' }}
              onClick={() => handleShare('facebook')}
            >
              <FacebookIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View code on GitHub">
            <IconButton 
              size="small" 
              sx={{ color: '#333' }}
              onClick={() => handleShare('github')}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
  
  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' 
                    ? `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.default, 0.9)})`
                    : `linear-gradient(145deg, ${alpha('#fff', 0.9)}, ${alpha(theme.palette.background.default, 0.1)})`,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.12)',
            transform: 'translateY(-4px)'
          }
        }}
      >
        {renderCardContent()}
      </Paper>
      
      {/* Fullscreen Dialog */}
      <Dialog 
        open={isFullscreen}
        onClose={handleFullscreenToggle}
        fullScreen
        PaperProps={{
          sx: {
            background: theme.palette.mode === 'dark' 
              ? theme.palette.background.default
              : '#fff',
            backgroundImage: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            {hashtag} {!isLoading && renderTrendIndicator()}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Share">
              <IconButton edge="end" color="inherit" aria-label="share">
                <ShareIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close fullscreen">
              <IconButton edge="end" color="inherit" aria-label="close" onClick={handleFullscreenToggle}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarTodayIcon sx={{ color: '#718096', fontSize: 18 }} />
              <Typography 
                variant="subtitle1" 
                color="text.secondary" 
                sx={{ fontWeight: 500 }}
              >
                {dateRange}
              </Typography>
            </Box>
          </Box>
          
          {/* Enlarged Chart */}
          <Box sx={{ 
            width: '100%', 
            height: 'calc(100vh - 300px)', 
            minHeight: 500 
          }}>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" height="100%" animation="wave" />
            ) : data ? (
              <SentimentChart data={data} chartType={chartView} />
            ) : (
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.default, 0.5)
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No data available
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          p: 3, 
          justifyContent: 'space-between',
          borderTop: `1px solid ${theme.palette.divider}` 
        }}>
          <Typography variant="body2" color="text.secondary">
            Data refreshed on {new Date().toLocaleDateString()}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Share on Twitter">
              <IconButton 
                size="small" 
                sx={{ color: '#1DA1F2' }}
                onClick={() => handleShare('twitter')}
              >
                <TwitterIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share on Facebook">
              <IconButton 
                size="small" 
                sx={{ color: '#4267B2' }}
                onClick={() => handleShare('facebook')}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="View code on GitHub">
              <IconButton 
                size="small" 
                sx={{ color: '#333' }}
                onClick={() => handleShare('github')}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
});

HashtagTrendCard.displayName = 'HashtagTrendCard';

export default HashtagTrendCard;