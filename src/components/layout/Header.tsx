import {
  Box,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ProfileButton from './ProfileButton';

export default function Header() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: theme.palette.primary.main,
        position: 'sticky',
        top: 0,
        zIndex: 2,
      }}
    >
      <Stack
        sx={{
          flexFlow: 'row wrap',
          width: '80%',
          mx: 'auto',
          p: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography color="accent.text" variant="h5" fontWeight="bold">
          {process.env.APP_NAME}
        </Typography>
        <Box>
          <ProfileButton />
        </Box>
      </Stack>
    </Box>
  );
}
