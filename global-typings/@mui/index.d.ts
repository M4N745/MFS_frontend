import { Dict } from '@custom_types/utils';

interface CustomPaletteColors {
  accent: Dict;
}

declare module '@mui/material/styles' {
  interface Palette extends CustomPaletteColors {}
  interface PaletteOptions extends CustomPaletteColors {}
}
