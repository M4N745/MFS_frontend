import { Dict } from '@custom_types/utils';

export default interface ResponseBody<T> {
  [x: string]: any;
  meta?: Dict;
  data: T | null;
}
