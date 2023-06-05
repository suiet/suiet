import FormControl from '../form/FormControl';
import { isValidSuiAddress } from '@mysten/sui.js';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { getInputStateByFormState } from '../../utils/form';
import { isValidDomainOrAddress, isValidDomain } from '../../utils/address';
import Textarea from '../Textarea';
import React from 'react';

interface AddressInputProps {
  form: UseFormReturn<any>;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function AddressInput({ form, className, onChange }: AddressInputProps) {
  return (
    <FormControl
      name={'address'}
      registerOptions={{
        required: 'address should not be empty',
        validate: (val) => {
          return isValidDomainOrAddress(val) || 'this is not a valid address';
        },
      }}
      className={className}
    >
      <Textarea
        placeholder="Enter SUI address or domain"
        onInput={onChange}
        state={getInputStateByFormState(form.formState, 'address')}
      />
    </FormControl>
  );
}

export default AddressInput;
