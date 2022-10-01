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
import SettingOneLayout from '../../../layouts/SettingOneLayout';
import { resetAppContext } from '../../../store/app-context';
import { useApiClient } from '../../../hooks/useApiClient';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import classNames from 'classnames';

export type ForgetPasswordProps = {
  titles?: string[];
  desc?: string;
};

type FormData = {
  reset: string;
};

const ForgetPassword = (props: ForgetPasswordProps) => {
  const RESET_KEYWORD = 'RESET';
  const apiClient = useApiClient();
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      reset: '',
    },
  });
  const {
    titles = ['Forget', 'Password'],
    desc = 'You need to reset the Suiet app.',
  } = props;

  return (
    <SettingOneLayout titles={titles} desc={desc}>
      <section className={'mt-[24px] w-full'}>
        <Form
          form={form}
          onSubmit={async () => {
            await apiClient.callFunc<null, undefined>(
              'root.resetAppData',
              null
            );
            await dispatch(resetAppContext()).unwrap();
          }}
        >
          <div>
            <Typo.Normal className={styles['reset-title']}>
              Reset Suiet App
            </Typo.Normal>
            <Typo.Hints
              className={classNames('mt-[8px]', styles['reset-desc'])}
            >
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
    </SettingOneLayout>
  );
};

export default ForgetPassword;
