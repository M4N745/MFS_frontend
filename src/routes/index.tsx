import {
  Box,
  useTheme,
} from '@mui/material';
import {
  AppFooter,
  AppHeader,
  SearchSection,
} from '@components';
import MoviesList from '@components/layout/MoviesList';

export default function Template() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.common.white,
        width: '100%',
      }}
    >
      <AppHeader />
      <SearchSection />
      <MoviesList />
      <AppFooter />
    </Box>
  );
}
