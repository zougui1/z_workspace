import { Selector, SelectorProps } from './Selector';
import { SelectProvider } from './SelectContext';
import { Option } from './compounds/Option';

export const Select = ({ defaultSelected, label, value, onChange, ...props }: SelectProps) => {
  return (
    <SelectProvider children defaultValue={{
      options: [],
      selectedOption: defaultSelected ?? 0,
      picked: false,
      label,
      onChange,
    }}>
      <Selector {...props} value={value} label={label} />
    </SelectProvider>
  );
}

interface ISelectProps {
  label?: string;
  children: React.ReactNode;
  defaultSelected?: number;
  onChange?: (value: any) => void;
}

export type SelectProps = SelectorProps & ISelectProps;

Select.Option = Option;
