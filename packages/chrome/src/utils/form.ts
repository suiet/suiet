import { FormState } from 'react-hook-form';
import { InputState } from '../components/Input';
import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';

export function getPasswordValidation(
  params: {
    previousPassword?: string;
  } = {}
): RegisterOptions {
  return {
    required: 'Password should not be empty',
    validate: (val: string) => {
      const options = {
        translations: zxcvbnEnPackage.translations,
        graphs: zxcvbnCommonPackage.adjacencyGraphs,
        dictionary: {
          ...zxcvbnCommonPackage.dictionary,
          ...zxcvbnEnPackage.dictionary,
        },
      };
      zxcvbnOptions.setOptions(options);

      const strethDetectResult = zxcvbn(val);
      if (strethDetectResult.score < 3) {
        return strethDetectResult.feedback.warning.length > 0
          ? strethDetectResult.feedback.warning
          : 'password is too weak';
      }

      if (val.length < 8) return 'Password should be longer than 8';
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
      return val.length < 8 ? 'Password should be longer than 8' : true;
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
