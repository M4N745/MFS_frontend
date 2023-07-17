import { Box, Typography, useTheme } from '@mui/material';
import { Dict, StateSetter } from '@custom_types/utils';

type InputType = {
  type: string;
  value: string;
  onChange: StateSetter<Dict>;
  inputName: string;
  placeholder: string;
  sx?: Dict;
  error: string;
};

export default function Input(props: InputType) {
  const {
    type,
    value,
    onChange,
    inputName,
    placeholder,
    sx = {},
    error = '',
  } = props;
  const theme = useTheme();
  return (
    <Box>
      <Box
        component="input"
        type={type}
        value={value}
        onChange={({ target }) => {
          onChange((prev: Dict) => ({ ...prev, [inputName]: target.value }));
        }}
        placeholder={placeholder}
        sx={{
          width: '100%',
          py: 1.5,
          pl: 1,
          pr: 7,
          borderRadius: 0,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.grey[400],
          border: 'solid 2px',
          borderColor: error === '' ? theme.palette.primary.main : theme.palette.error.main,
          fontSize: 17,
          '&:focus, &:focus-visible': {
            outline: 0,
            borderColor: theme.palette.accent.text,
          },
          ...sx,
        }}
      />
      {error !== '' && (
        <Typography fontSize={12} color="error" textAlign="left">{error}</Typography>
      )}
    </Box>
  );
}
