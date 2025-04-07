// pages/insights/[hashtag].tsx
import { useRouter } from 'next/router';
import { useState, useMemo, useCallback, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import useHashtagTrend from '../../hooks/useHashtagTrend';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Skeleton, 
  Button, 
  Alert, 
  TextField,
  MenuItem,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Divider,
  Chip,
  Stack
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Lazy-load the chart component
const HashtagTrendCard = dynamic(
  () => import('../../components/HashtagTrendCard'),
  { 
    loading: () => <LoadingCard />,
    ssr: false
  }
);

// Popular hashtags for the dropdown
const POPULAR_HASHTAGS = [
  'uri', 'javascript', 'nextjs', 'react', 'vite', 'design', 'tech', 'ai'
];

// Loading skeleton component
const LoadingCard = () => (
  <Paper 
    elevation={3} 
    sx={{ 
      p: { xs: 2, md: 4 }, 
      borderRadius: 4,
      background: 'linear-gradient(145deg, #f5f7fa 0%, #e4e8eb 100%)'
    }}
  >
    <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
    <Skeleton variant="text" height={30} sx={{ mb: 3, width: '60%' }} />
    <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 2 }} />
    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
      <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1, mr: 2 }} />
      <Skeleton variant="rectangular" width={120} height={36} sx={{ borderRadius: 1 }} />
    </Box>
  </Paper>
);

const HashtagInsightPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { hashtag } = router.query;
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');
  
  useEffect(() => {
    if (hashtag && typeof hashtag === 'string') {
      setSelectedHashtag(hashtag);
    }
  }, [hashtag]);
  
  const { data, isLoading, isError, error, refetch } = useHashtagTrend(
    selectedHashtag
  );
  
  // Calculate if sentiment trend is positive
  const sentimentTrend = useMemo(() => {
    if (!data?.trend || data?.trend?.length < 2) return null;
    
    const firstValue = data?.trend[0].sentiment;
    const lastValue = data?.trend[data?.trend?.length - 1].sentiment;
    
    return {
      isPositive: lastValue > firstValue,
      difference: lastValue - firstValue
    };
  }, [data?.trend]);
  
  // Handle hashtag change
  const handleHashtagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHashtag = event.target.value;
    setSelectedHashtag(newHashtag);
    router.push(`/insights/${newHashtag}`, undefined, { shallow: true });
  };
  
  // Handle retry when error occurs
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);
  
  // Handle share (stub implementation)
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `${data?.hashtag || '#' + selectedHashtag} Sentiment Insights`,
        text: `Check out the sentiment trend for ${data?.hashtag || '#' + selectedHashtag}`,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, [data?.hashtag, selectedHashtag]);
  
  // If page is not yet ready due to dynamic routing
  if (router.isFallback) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LoadingCard />
      </Container>
    );
  }
  
  return (
    <DashboardLayout title="Hashtag Sentiment Insights">
      <Head>
        <title>{hashtag ? `${hashtag} Sentiment Insights` : 'Hashtag Insights'}</title>
        <meta name="description" content={`Sentiment analysis for ${hashtag}`} />
      </Head>
      
      <Box 
        sx={{ 
          // minHeight: '100vh',
          // background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          pt: 2, 
          pb: 6 
        }}
      >
        <Container maxWidth="lg">
          {/* Header with navigation */}
          {/* <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 4, 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}
          >
            <Link href="/" passHref>
              <Button 
                startIcon={<ArrowBackIcon />} 
                sx={{ 
                  mr: { xs: 0, sm: 2 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Back to Home
              </Button>
            </Link>
            
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(90deg, #2c3e50 0%, #4c6b8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                flexGrow: 1,
                textAlign: { xs: 'center', sm: 'left' }
              }}
            >
              Hashtag Sentiment Insights
            </Typography>
          </Box>
           */}
          {/* Hashtag selector */}
          <Box 
            sx={{ 
              mb: 3, 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 2 
            }}
          >
            <TextField
              select
              label="Select Hashtag"
              value={selectedHashtag}
              onChange={handleHashtagChange}
              sx={{
                minWidth: 200,
                maxWidth: { xs: '100%', sm: 300 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            >
              {POPULAR_HASHTAGS.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  #{tag}
                </MenuItem>
              ))}
            </TextField>
            
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'center',
                justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                flexGrow: 1
              }}
            >
              <IconButton 
                onClick={() => refetch()} 
                color="primary" 
                sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}
              >
                <RefreshIcon />
              </IconButton>
              
              <IconButton 
                onClick={handleShare} 
                color="primary"
                sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}
              >
                <ShareIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Error alert */}
          {isError && (
            <Fade in={isError}>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={handleRetry}
                    sx={{ fontWeight: 500 }}
                  >
                    Retry
                  </Button>
                }
              >
                {error instanceof Error ? error.message : 'Failed to load hashtag data'}
              </Alert>
            </Fade>
          )}
          
          {/* Quick stats */}
          {data && !isLoading && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 3,
                justifyContent: { xs: 'center', sm: 'flex-start' }
              }}
            >
              <Chip 
                label={`${data?.trend?.length} days of data`} 
                color="primary" 
                variant="outlined"
                sx={{ borderRadius: 2, fontWeight: 500 }}
              />
              
              {sentimentTrend && (
                <Chip 
                  label={`${sentimentTrend.isPositive ? 'Positive' : 'Negative'} trend (${Math.abs(sentimentTrend.difference).toFixed(2)})`} 
                  color={sentimentTrend.isPositive ? "success" : "error"} 
                  variant="outlined"
                  sx={{ borderRadius: 2, fontWeight: 500 }}
                />
              )}
            </Box>
          )}
          
          {/* Main card */}
          <HashtagTrendCard
            hashtag={data?.hashtag || `#${selectedHashtag}`}
            dateRange={data?.range || 'Loading...'}
            isLoading={isLoading}
            trend={sentimentTrend}
            data={data?.trend}
          />
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default HashtagInsightPage;