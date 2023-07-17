import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        width: '80%',
        mx: 'auto',
        pt: 5,
        pb: 2,
      }}
    >
      <Typography textAlign="center" color="grey">
        {t('copyright', { ns: 'common', name: 'ababa.tech' })}
      </Typography>
    </Box>
  );
}
