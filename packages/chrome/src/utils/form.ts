import {FormState} from "react-hook-form";
import {InputState} from "../components/Input";

export function getPasswordValidation() {
  return {
    required: 'Password should not be empty',
    validate: (val: string) => val.length < 6 ? 'Password should be longer than 6' : true
  }
}

export function getInputStateByFormState(formState: FormState<any>, field: string): InputState {
  return formState.errors[field] ? 'error' : (
    formState.dirtyFields[field]
      ? 'success' : 'default'
  )
}