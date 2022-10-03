import FormControl from '../form/FormControl';
import { isValidSuiAddress } from '@mysten/sui.js';
import { UseFormReturn } from 'react-hook-form/dist/types';
import { getInputStateByFormState } from '../../utils/form';
import Textarea from '../Textarea';

interface AddressInputProps {
  form: UseFormReturn<any>;
}

function AddressInput({ form }: AddressInputProps) {
  return (
    <FormControl
      name={'address'}
      registerOptions={{
        required: 'address should not be empty',
        validate: (val) => {
          return isValidSuiAddress(val) || 'this is not a valid address';
        },
      }}
      className={'mt-[6px]'}
    >
      <Textarea
        placeholder="Enter SUI address"
        state={getInputStateByFormState(form.formState, 'address')}
      />
    </FormControl>
  );
}

export default AddressInput;
