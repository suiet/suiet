import React from 'react';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { Extendable } from '../../../types';

export const FormContext = React.createContext<UseFormReturn<any> | null>(null);

export type FormProps<TFieldValues> = Extendable & {
  form: UseFormReturn<any>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
};

function Form<TFieldValues = any>(props: FormProps<TFieldValues>) {
  return (
    <FormContext.Provider value={props.form}>
      <form onSubmit={props.form.handleSubmit(props.onSubmit)}>
        {props.children}
      </form>
    </FormContext.Provider>
  );
}

export default Form;
