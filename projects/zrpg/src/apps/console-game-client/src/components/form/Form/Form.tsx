import { useRef, ClassAttributes } from 'react';
import { Widgets } from 'blessed';
import { BlessedIntrinsicElements } from 'react-blessed';

import { useKey } from '../../../hooks';
import { mergeRefs } from '../../../utils';

export const Form = ({ ...props }: FormProps) => {
  const form = useRef<Widgets.FormElement<any> | null>(null);
  mergeRefs(form, props.ref);

  useKey('enter', () => {
    form.current?.submit();
  }, []);

  return (
    <form
      ref={props.ref || form}
      {...props}
    />
  );
}

interface IFormProps {
  formRef?: ClassAttributes<Widgets.FormElement<any>>['ref'];
  onSubmit?: (formData: any) => void;
}

export type FormProps = IFormProps & BlessedIntrinsicElements['form'];
