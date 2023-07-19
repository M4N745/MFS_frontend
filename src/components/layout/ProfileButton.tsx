import Input from '@components/reusable/Input';
import { UserResponse } from '@custom_types/api';
import {
  useTheme,
  IconButton,
  Icon,
  Box,
  Popover,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Divider,
  Stack,
  DialogTitle,
  DialogContent,
  Dialog,
  Button,
} from '@mui/material';
import { Requests, ApiList } from '@settings';
import { t } from 'i18next';
import { useState, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { Dict } from '@custom_types/utils';
import Cookie from 'universal-cookie';
import { useUser } from '@hooks';

const cookies = new Cookie();

function RegisterForm() {
  const [values, setValues] = useState<Dict>({});
  const { enqueueSnackbar } = useSnackbar();
  const [errors, setErrors] = useState<Dict>({});

  const onSubmit = async () => {
    try {
      const request = await Requests.post<UserResponse>(ApiList.register, values);
      if (request.username) {
        setErrors({});
        enqueueSnackbar(t('registration_successfully', { ns: 'common' }), { variant: 'success' });
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        enqueueSnackbar(t(err.response.data.message, { ns: 'common' }), { variant: 'error' });
      }
    }
  };
  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Stack rowGap={2}>
          <Input
            type="text"
            value={values.username}
            placeholder={t('username', { ns: 'common' })}
            onChange={setValues}
            inputName="username"
            error={errors.username}
          />
          <Input
            type="password"
            value={values.password}
            placeholder={t('password', { ns: 'common' })}
            onChange={setValues}
            inputName="password"
            error={errors.password}
          />
          <Input
            type="password"
            value={values.repeat_password}
            placeholder={t('repeat_password', { ns: 'common' })}
            onChange={setValues}
            inputName="repeat_password"
            error={errors.repeat_password}
          />
        </Stack>
        <Button
          variant="contained"
          color="info"
          fullWidth={false}
          sx={{ mt: 3, borderRadius: 0 }}
          disableElevation
          size="large"
          type="submit"
        >
          {t('register', { ns: 'common' })}
        </Button>
      </form>
    </Box>
  );
}

function LoginForm({ closeModal }: { closeModal: () => void }) {
  const [values, setValues] = useState<Dict>({});
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = useUser();
  const [errors, setErrors] = useState<Dict>({});

  const onSubmit = async () => {
    try {
      const request = await Requests.post<UserResponse>(ApiList.auth, values);
      if (request.token) {
        enqueueSnackbar(t('login_successfully', { ns: 'common' }), { variant: 'success' });
        cookies.set('token', request.token);
        mutate();
        closeModal();
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors(err.response.data);
      } else {
        enqueueSnackbar(t(err.response.data.message, { ns: 'common' }), { variant: 'error' });
      }
    }
  };

  return (
    <Box>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <Stack rowGap={2}>
          <Input
            type="text"
            value={values.username}
            placeholder={t('username', { ns: 'common' })}
            onChange={setValues}
            inputName="username"
            error={errors.username}
          />
          <Input
            type="password"
            value={values.password}
            placeholder={t('password', { ns: 'common' })}
            onChange={setValues}
            inputName="password"
            error={errors.password}
          />
        </Stack>
        <Button
          variant="contained"
          color="info"
          fullWidth={false}
          sx={{ mt: 3, borderRadius: 0 }}
          disableElevation
          size="large"
          type="submit"
        >
          {t('login', { ns: 'common' })}
        </Button>
      </form>
    </Box>
  );
}

export default function ProfileButton() {
  const theme = useTheme();
  const [openPopover, setOpenPopover] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const { userInfo, mutate } = useUser();
  const ref = useRef(null);

  return (
    <Box>
      <IconButton
        ref={ref}
        sx={{
          color: theme.palette.accent.text,
          p: 0,
        }}
        size="small"
        onClick={() => setOpenPopover(true)}
      >
        <Icon sx={{ fontSize: 35 }}>account_circle</Icon>
      </IconButton>
      <Popover
        open={openPopover}
        anchorEl={ref.current}
        onClose={() => setOpenPopover(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& > .MuiPaper-root': {
            backgroundColor: theme.palette.primary.main,
            py: 1,
          },
        }}
      >
        <Box sx={{ px: 1.5 }}>
          <Stack direction="row" columnGap={2}>
            <Typography>
              {t('current_user', { ns: 'common' })}
            </Typography>
            <Typography fontWeight={600}>
              {userInfo?.username ?? t('guest', { ns: 'common' })}
            </Typography>
          </Stack>
        </Box>
        <Divider sx={{ my: 1 }} />
        {!userInfo
          ? (
            <MenuItem sx={{ color: 'white', minWidth: '150px' }} onClick={() => setOpenDialog(true)}>
              <ListItemIcon sx={{ color: 'currentcolor' }}>
                <Icon>logout</Icon>
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  {t('login', { ns: 'common' })}
                </Typography>
              </ListItemText>
            </MenuItem>
          ) : (
            <MenuItem
              sx={{ color: 'white', minWidth: '150px' }}
              onClick={() => {
                cookies.remove('token');
                mutate();
              }}
            >
              <ListItemIcon sx={{ color: 'currentcolor' }}>
                <Icon>logout</Icon>
              </ListItemIcon>
              <ListItemText>
                <Typography>
                  {t('logout', { ns: 'common' })}
                </Typography>
              </ListItemText>
            </MenuItem>
          )}
      </Popover>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            color: theme.palette.accent.text,
            borderBottom: 'solid 1px',
            borderColor: theme.palette.common.white,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{t(formType, { ns: 'common' })}</Typography>
            <IconButton
              sx={{ color: 'currentcolor' }}
              onClick={() => setOpenDialog(false)}
            >
              <Icon sx={{ color: 'currentcolor' }}>
                close
              </Icon>
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              textAlign: 'center',
              pt: 3,
              pb: 1.5,
            }}
          >
            {formType === 'login'
              ? (
                <LoginForm
                  closeModal={() => {
                    setOpenDialog(false);
                    setOpenPopover(false);
                  }}
                />
              ) : <RegisterForm />}
            <Box sx={{ pt: 2 }}>
              <Typography>{t(formType === 'login' ? 'register_text' : 'login_text', { ns: 'common' })}</Typography>
              <Button
                fullWidth={false}
                color="info"
                onClick={() => setFormType((prev: string) => (prev === 'login' ? 'register' : 'login'))}
              >
                {t(formType === 'login' ? 'register' : 'login', { ns: 'common' })}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
