import React, { useContext } from 'react';
import Typo from '../../Typo';
import { ErrorMessage } from '@hookform/error-message';
import { Extendable } from '../../../types';
import { FormContext } from '../Form';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

export type FormControlProps = Extendable<JSX.Element> & {
  name: string;
  registerOptions?: RegisterOptions;
  hintsClassName?: string;
};

/**
 * wrap form control component
 * add hints message after errors appear in formContext
 * @param props
 * @constructor
 */
const FormControl = (props: FormControlProps) => {
  const formContext = useContext(FormContext);
  const { hintsClassName = 'mt-[6px]' } = props;

  if (!props.children) return null;
  return (
    <div className={props.className} style={props.style}>
      {React.cloneElement(props.children, {
        ...formContext?.register(props.name, props.registerOptions),
      })}
      <ErrorMessage
        errors={formContext?.formState.errors}
        name={props.name}
        render={(error) => (
          <Typo.Hints state={'error'} className={hintsClassName}>
            {error.message}
          </Typo.Hints>
        )}
      />
    </div>
  );
};

export default FormControl;
