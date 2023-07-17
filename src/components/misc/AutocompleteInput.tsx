import { Dict } from '@custom_types/utils';
import {
  Autocomplete,
  AutocompleteChangeDetails, AutocompleteChangeReason, AutocompleteFreeSoloValueMapping, AutocompleteProps, AutocompleteValue, ChipTypeMap, TextField,
} from '@mui/material';
import {
  forwardRef, ForwardedRef, useEffect, useRef, SyntheticEvent, ElementType, useState,
} from 'react';

export type AutocompleteInputLiteralValue = string | number;

export type AutocompleteInputValue<Multiple, DisableClearable, FreeSolo> = Multiple extends true
  ? Array<AutocompleteInputLiteralValue | AutocompleteFreeSoloValueMapping<FreeSolo>>
  : DisableClearable extends true
    ? NonNullable<AutocompleteInputLiteralValue | AutocompleteFreeSoloValueMapping<FreeSolo>>
    : AutocompleteInputLiteralValue | null | AutocompleteFreeSoloValueMapping<FreeSolo>;

export type AutocompleteInputProps<
T extends Dict,
Multiple extends boolean | undefined,
DisableClearable extends boolean | undefined,
FreeSolo extends boolean | undefined,
ChipComponent extends ElementType = ChipTypeMap['defaultComponent'],
> = Omit<AutocompleteProps<
T, Multiple, DisableClearable, FreeSolo, ChipComponent>, 'value' | 'onChange' | 'getOptionLabel' | 'isOptionEqualToValue'
> & {
  labelKey?: string;
  valueKey?: string;
  value?: AutocompleteInputValue<Multiple, DisableClearable, FreeSolo>;
  onChange?: (
    event: SyntheticEvent,
    value: AutocompleteInputValue<Multiple, DisableClearable, FreeSolo>,
    reason: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<T>,
    option?: AutocompleteInputValue<Multiple, DisableClearable, FreeSolo>
  ) => void;
};

function AutocompleteInputWithRef<
  T extends Dict,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
>(props: AutocompleteInputProps<T, Multiple, DisableClearable, FreeSolo>, ref: ForwardedRef<HTMLElement>) {
  const {
    value,
    onChange,
    labelKey = 'title',
    valueKey = 'id',
    options,
    multiple,
    freeSolo,
    // @ts-ignore: we need to destruct this to prevent passing it to component
    getOptionLabel,
    // @ts-ignore: we need to destruct this to prevent passing it to component
    isOptionEqualToValue,
    renderInput,
    ...rest
  } = props;
  const [currentOption, setCurrentOption] = useState<any | any[] | null>(null);
  const initialLoad = useRef(true);

  useEffect(() => {
    if (
      initialLoad.current
        && currentOption == null
        && options?.length
        && value != null
        && value !== ''
    ) {
      if (freeSolo) {
        setCurrentOption(value);
      } else if (multiple && Array.isArray(value)) {
        setCurrentOption(options.filter((opt) => value.some((v) => v === opt[valueKey])));
      } else {
        setCurrentOption(options.find((opt) => value === opt[valueKey]));
      }
      initialLoad.current = false;
    }
  }, [value, options]);

  const handleChange = (
    ev: SyntheticEvent,
    val: AutocompleteValue<T, Multiple, DisableClearable, FreeSolo>,
    r: AutocompleteChangeReason,
    d?: AutocompleteChangeDetails<T>,
  ) => {
    let v = null;
    if (val != null) {
      v = (multiple && Array.isArray(val))
        ? val.map((it) => it[valueKey])
        : (val as T)[valueKey as keyof T];
    }
    setCurrentOption(val);
    onChange?.(ev, v as any, r, d, currentOption);
  };

  return (
    <Autocomplete
      ref={ref}
      options={options}
      multiple={multiple}
      freeSolo={freeSolo}
      onChange={handleChange}
      value={currentOption as any}
      getOptionLabel={(opt) => opt[labelKey as keyof typeof opt] as string}
      isOptionEqualToValue={(opt, val) => opt[valueKey] === val[valueKey]}
      renderInput={renderInput ?? ((params) => <TextField {...params} />)}
      {...rest}
    />
  );
}

const AutocompleteInput = forwardRef(AutocompleteInputWithRef) as <
T extends Dict,
Multiple extends boolean | undefined,
DisableClearable extends boolean | undefined,
FreeSolo extends boolean | undefined,
>(props: AutocompleteInputProps<T, Multiple, DisableClearable, FreeSolo>) => ReturnType<typeof AutocompleteInputWithRef>;

export default AutocompleteInput;
