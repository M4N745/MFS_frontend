import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Icon,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ApiList } from '@settings';
import useSWR from 'swr';
import { useState } from 'react';
import { moviesFetcher } from '@utils/fetchers';

const PAGE_SIZE = 10;
export default function MoviesList() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [sort, setSort] = useState<string | null>('title');
  const { data: list, isLoading, isValidating } = useSWR(
    [
      ApiList.movies,
      {
        page: 1,
        page_size: PAGE_SIZE,
        ...(sort !== null && { sort }),
      },
    ],
    moviesFetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      loadingTimeout: 5000,
    },
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.secondary.main,
        py: 3,
      }}
    >
      <Box
        sx={{
          width: '80%',
          mx: 'auto',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h4"
            sx={{ color: theme.palette.accent.text }}
            fontWeight={600}
          >
            {t('movies_list', { ns: 'common' })}
          </Typography>
          <Box>
            <ButtonGroup variant="contained" color="info">
              <Button
                onClick={() => setSort('-title')}
                sx={{ backgroundColor: sort === '-title' && theme.palette.accent.text }}
              >
                <Icon>sort</Icon>
              </Button>
              <Button
                onClick={() => setSort('title')}
                sx={{ backgroundColor: sort === 'title' && theme.palette.accent.text }}
              >
                <Icon sx={{ transform: 'rotate(180deg)' }}>sort</Icon>
              </Button>
            </ButtonGroup>
          </Box>
        </Stack>
        <Box sx={{ mt: 2 }}>
          {!isLoading || (!isValidating && list)
            ? (
              <Box>
                <Grid container gap={2} justifyContent="center">
                  {list && list.items.map((item, index) => (
                    <Grid
                      item
                      md={5.5}
                      xs={12}
                      key={index}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        pr: 2,
                        [theme.breakpoints.down('md')]: {
                          pl: 2,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        columnGap={2}
                        sx={{
                          [theme.breakpoints.down('md')]: {
                            flexFlow: 'column',
                          },
                        }}
                      >
                        <Box
                          component="img"
                          src={item.url}
                          sx={{
                            height: '150px',
                            [theme.breakpoints.down('md')]: {
                              display: 'none',
                            },
                          }}
                        />
                        <Box sx={{ py: 2 }}>
                          <Typography variant="h4">
                            {item.title}
                          </Typography>
                          <Typography sx={{ height: 70, overflowY: 'hidden' }}>
                            {item.description}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Grid container gap={2} justifyContent="center">
                {Array(PAGE_SIZE).fill('').map((_v, index) => (
                  <Grid item md={5.5} xs={12} key={index}>
                    <Skeleton
                      sx={{
                        width: '100%',
                        height: 150,
                      }}
                      variant="rectangular"
                    />
                  </Grid>
                ))}
              </Grid>
            )}
        </Box>
      </Box>
    </Box>
  );
}
