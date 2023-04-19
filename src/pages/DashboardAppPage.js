import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { Link } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Accueil </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h2" sx={{ mb: 7 }}>
          Hi, Welcome back !
        </Typography>

        <Grid container spacing={3}>
          
            <Grid item xs={12} sm={6} md={6} >
              <Link to="/dashboard/url" style={{ textDecoration: 'none' }}>
                <AppWidgetSummary title="URL 1" total={714000} icon={'ant-design:link-outlined'} />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={6} >
              <Link to="/dashboard/url" style={{ textDecoration: 'none' }}>
                <AppWidgetSummary title="URL 2" total={714000} color='info' icon={'ant-design:link-outlined'} />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={6} >
              <Link to="/dashboard/url" style={{ textDecoration: 'none' }}>
                <AppWidgetSummary title="URL 3" total={714000} color='warning' icon={'ant-design:link-outlined'} />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={6} >
              <Link to="/dashboard/url" style={{ textDecoration: 'none' }}>
                <AppWidgetSummary title="URL 4" total={714000} color='error' icon={'ant-design:link-outlined'} />
              </Link>
            </Grid>
        </Grid>
      </Container>
    </>
  );
}
