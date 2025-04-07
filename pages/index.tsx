// pages/index.tsx
import type { NextPage } from 'next';
import Link from 'next/link';
import { 
  Grid, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
  Box,
  Paper,
  Stack,
  Chip,
  useTheme
} from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import TagIcon from '@mui/icons-material/Tag';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import SearchIcon from '@mui/icons-material/Search';

// Mock data for dashboard
const popularHashtags = [
  { tag: 'uri', sentiment: 0.72, volume: 2854 },
  { tag: 'tech', sentiment: 0.56, volume: 1947 },
  { tag: 'ai', sentiment: 0.83, volume: 3219 },
  { tag: 'programming', sentiment: 0.61, volume: 1203 },
];

const Home: NextPage = () => {
  const theme = useTheme();
  
  return (
    <DashboardLayout title="Dashboard">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Hashtag Sentiment Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track and analyze sentiment across social media hashtags in real-time.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, sm:6, lg:3}}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              width: '100%',
              flexDirection: 'column',
              bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light',
              color: theme.palette.mode === 'dark' ? 'primary.contrastText' : 'inherit'
            }}
          >
            <Typography variant="h6" component="div">Total Hashtags</Typography>
            <Typography variant="h3" component="div">47</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Tracked hashtags</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm:6, lg:3}}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.mode === 'dark' ? 'secondary.dark' : 'secondary.light',
              color: theme.palette.mode === 'dark' ? 'secondary.contrastText' : 'inherit'
            }}
          >
            <Typography variant="h6" component="div">Avg Sentiment</Typography>
            <Typography variant="h3" component="div">0.64</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Positive trending</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm:6, lg:3}}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.mode === 'dark' ? 'info.dark' : 'info.light',
              color: theme.palette.mode === 'dark' ? 'info.contrastText' : 'inherit'
            }}
          >
            <Typography variant="h6" component="div">Posts Analyzed</Typography>
            <Typography variant="h3" component="div">14.3K</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Last 30 days</Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm:6, lg:3}}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column',
              bgcolor: theme.palette.mode === 'dark' ? 'success.dark' : 'success.light',
              color: theme.palette.mode === 'dark' ? 'success.contrastText' : 'inherit'
            }}
          >
            <Typography variant="h6" component="div">Active Topics</Typography>
            <Typography variant="h3" component="div">8</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>Trending now</Typography>
          </Paper>
        </Grid>

       
      </Grid>
      
      
      
      <Grid container spacing={3} sx={{ mt: 4 }}>
             {/* Popular Hashtags */}
        <Grid size={{ xs: 12, md:6}}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TagIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component="div">
                  Popular Hashtags
                </Typography>
              </Box>
              <Stack spacing={2}>
                {popularHashtags.map((hashtag) => (
                  <Paper 
                    key={hashtag.tag} 
                    variant="outlined" 
                    sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
                        #{hashtag.tag}
                      </Typography>
                      <Chip 
                        label={`${(hashtag.sentiment * 100).toFixed()}% Positive`}
                        size="small"
                        color={hashtag.sentiment > 0.7 ? "success" : hashtag.sentiment > 0.5 ? "info" : "warning"}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {hashtag.volume.toLocaleString()} posts
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
            <CardActions>
              <Link href="/" passHref legacyBehavior>
                <Button size="small" component="a">View All Hashtags</Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md:6}}>
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm:6}}>
                  <Link href="/insights/uri" passHref legacyBehavior>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      startIcon={<TimelineIcon />}
                      sx={{ py: 2, justifyContent: 'flex-start' }}
                      component="a"
                    >
                      #uri Insights
                    </Button>
                  </Link>
                </Grid>
                <Grid size={{ xs: 12, sm:6}}>
                  <Link href="/" passHref legacyBehavior>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<SearchIcon />}
                      sx={{ py: 2, justifyContent: 'flex-start' }}
                      component="a"
                    >
                      Explore Data
                    </Button>
                  </Link>
                </Grid>
                <Grid size={{ xs: 12, sm:6}}>
                  <Link href="/insights/uri" passHref legacyBehavior>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<TrendingUpIcon />}
                      sx={{ py: 2, justifyContent: 'flex-start' }}
                      component="a"
                    >
                      Trending Analysis
                    </Button>
                  </Link>
                </Grid>
                <Grid size={{ xs: 12, sm:6}}>
                  <Link href="/" passHref legacyBehavior>
                    <Button 
                      variant="outlined" 
                      fullWidth 
                      startIcon={<TagIcon />}
                      sx={{ py: 2, justifyContent: 'flex-start' }}
                      component="a"
                    >
                      Add New Hashtag
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card elevation={2} sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2">Sentiment analysis updated</Typography>
                  <Typography variant="caption" color="text.secondary">5 mins ago</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2">New hashtag #tech added</Typography>
                  <Typography variant="caption" color="text.secondary">2 hours ago</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                  <Typography variant="body2">Weekly report generated</Typography>
                  <Typography variant="caption" color="text.secondary">Yesterday</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Home;