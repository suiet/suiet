import {FormState} from "react-hook-form";
import {InputState} from "../components/Input";

export function getPasswordValidation() {
  return {
    required: 'Password should not be empty',
    validate: (val: string) => {
      const result = val.length < 6 ? 'Password should be longer than 6' : true
      console.log('validate', result)
      return result
    }
  }
}

export function getInputStateByFormState(formState: FormState<any>, field: string): InputState {
  console.log('formState.errors', formState.errors)
  console.log('formState.dirtyFields', formState.dirtyFields)
  return formState.errors[field] ? 'error' : (
    formState.dirtyFields[field]
      ? 'success' : 'default'
  )
}