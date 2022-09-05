import commonStyles from '../common.module.scss';
import styles from './index.module.scss';
import Typo from '../../../components/Typo';
import Input from '../../../components/Input';
import { useForm } from 'react-hook-form';
import {
  getButtonDisabledState,
  getInputStateByFormState,
} from '../../../utils/form';
import Form from '../../../components/form/Form';
import FormControl from '../../../components/form/FormControl';
import Button from '../../../components/Button';

export type ForgetPasswordProps = {
  onConfirmReset: () => void;
};

type FormData = {
  reset: string;
};

const ForgetPassword = (props: ForgetPasswordProps) => {
  const RESET_KEYWORD = 'RESET';
  const form = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      reset: '',
    },
  });

  return (
    <div className={commonStyles['container']}>
      <Typo.Title className={commonStyles['step-title']}>
        Forget <br /> Password
      </Typo.Title>
      <Typo.Normal className={commonStyles['step-desc']}>
        You need to reset the Suiet app.
      </Typo.Normal>

      <section className={'mt-[24px] w-full'}>
        <Form
          form={form}
          onSubmit={() => {
            props.onConfirmReset();
          }}
        >
          <div>
            <Typo.Normal className={styles['reset-title']}>
              Reset Suiet App
            </Typo.Normal>
            <Typo.Hints className={'mt-[8px]'}>
              Suiet will clear all the data and you need to re-import wallets.
              Input “RESET” to confirm and reset.
            </Typo.Hints>
            <FormControl
              name={'reset'}
              registerOptions={{
                required: 'input should not be empty',
                validate: (val) =>
                  val !== RESET_KEYWORD
                    ? 'Please enter RESET to confirm'
                    : true,
              }}
            >
              <Input
                state={getInputStateByFormState(form.formState, 'reset')}
                className={'mt-[16px]'}
                placeholder={'Please enter RESET to confirm'}
              />
            </FormControl>
          </div>

          <Button
            type={'submit'}
            state={'danger'}
            disabled={getButtonDisabledState(form.formState)}
            className={'mt-[28px]'}
          >
            Reset Suiet
          </Button>
        </Form>
      </section>
    </div>
  );
};

export default ForgetPassword;
