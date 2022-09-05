import { FormState } from 'react-hook-form';
import { InputState } from '../components/Input';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';

export function getPasswordValidation(
  params: {
    previousPassword?: string;
  } = {}
): RegisterOptions {
  return {
    required: 'Password should not be empty',
    validate: (val: string) => {
      if (val.length < 6) return 'Password should be longer than 6';
      if (params?.previousPassword && val !== params.previousPassword) {
        return 'passwords are not the same, please retry';
      }
      return true;
    },
  };
}

export function getConfirmPasswordValidation() {
  return {
    required: 'Password should not be empty',
    validate: (val: string) => {
      return val.length < 6 ? 'Password should be longer than 6' : true;
    },
  };
}

export function getInputStateByFormState(
  formState: FormState<any>,
  field: string
): InputState {
  return formState.errors[field]
    ? 'error'
    : formState.dirtyFields[field]
    ? 'success'
    : 'default';
}

export function getButtonDisabledState(formState: FormState<any>): boolean {
  // if isValid, then set disabled to false
  return !formState.isValid;
}
