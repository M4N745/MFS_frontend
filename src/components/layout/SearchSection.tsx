import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import bcImage from '@assets/images/wallpaper.jpg';
import debounce from 'lodash.debounce';
import { Requests, ApiList } from '@settings';
import AutocompleteInput from '@components/misc/AutocompleteInput';
import useSWR from 'swr';
import { useTranslation } from 'react-i18next';
import { specificMovieFetcher } from '@utils/fetchers';
import MovieType from '@custom_types/api/MovieType';

const optionsFetcher = async (url: string) => {
  const data: MovieType = await Requests.get(url);
  return data;
};

export default function SearchSection() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [focus, setFocus] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debSearchKeyword, setDebSearchKeyword] = useState('');
  const { data, isValidating } = useSWR(
    `${ApiList.movies}${debSearchKeyword !== '' ? `?search=${debSearchKeyword}` : ''}`,
    optionsFetcher,
  );
  const [specificItem, setSpecificItem] = useState<number | null>(null);
  const { data: specificMovie } = useSWR(specificItem !== null ? `${ApiList.movies}/${specificItem}` : null, specificMovieFetcher);
  const debouncedHandleSearchRef = useRef(debounce((search: string) => {
    setDebSearchKeyword(search);
  }, 1000));

  const options = [...(data ?? [])];

  useEffect(() => () => {
    debouncedHandleSearchRef.current.cancel();
  }, []);
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 67px)',
      }}
    >
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSpecificItem(null);
          setSearchKeyword('');
          setDebSearchKeyword('');
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography>{t('view_movie', { ns: 'common' })}</Typography>
            <IconButton
              size="small"
              onClick={() => {
                setOpenDialog(false);
                setSpecificItem(null);
                setSearchKeyword('');
                setDebSearchKeyword('');
              }}
            >
              <Icon>close</Icon>
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box>
            {specificMovie && (
              <Stack direction="row" columnGap={2}>
                <Box
                  component="img"
                  src={specificMovie?.url ?? ''}
                  sx={{
                    height: '150px',
                  }}
                />
                <Box sx={{ py: 2 }}>
                  <Typography variant="h4">
                    {specificMovie.title}
                  </Typography>
                  <Typography>
                    {specificMovie.description}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </DialogContent>
      </Dialog>
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: `url(${bcImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          color: 'blue',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <AutocompleteInput
            open={open}
            sx={{
              maxWidth: '500px',
              width: '95%',
            }}
            options={options ?? []}
            loading={isValidating}
            inputValue={searchKeyword}
            onInputChange={(_ev, val) => {
              setSearchKeyword(val);
              debouncedHandleSearchRef.current(val);
              if (val !== '') setOpen(true);
            }}
            onChange={(_e, value) => {
              setOpen(false);
              setSpecificItem(value as number);
              if (value != null) {
                setOpenDialog(true);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                hiddenLabel
                placeholder={t('search', { ns: 'common' })}
                size="small"
                name="search_input"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <InputAdornment position="start"><Icon>search</Icon></InputAdornment>,
                  endAdornment: null,
                }}
                onFocus={() => setFocus(true)}
                onBlur={() => {
                  setFocus(false);
                  setOpen(false);
                }}
                sx={{
                  '& > div > fieldset, & > div > fieldset:hover': {
                    border: 'none',
                  },
                  '& > div > input': {
                    p: '6px !important',
                  },
                  boxShadow: theme.shadows[8],
                  maxWidth: '500px',
                  width: '95%',
                  pl: 1,
                  borderRadius: 0,
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.grey[400],
                  border: 'solid 2px',
                  borderColor: !focus ? theme.palette.primary.main : theme.palette.accent.text,
                  fontSize: 17,
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
}
