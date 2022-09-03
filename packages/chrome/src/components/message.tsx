import { toast, ToastOptions } from 'react-toastify';
import { ReactComponent as IconSuccess } from '../assets/icons/msg-success.svg';
import { ReactComponent as IconError } from '../assets/icons/msg-error.svg';
import { ReactComponent as IconInfo } from '../assets/icons/msg-info.svg';

function createToast(content: string, options?: ToastOptions) {
  const commonOpts: ToastOptions = {
    position: 'top-center',
    closeButton: false,
    hideProgressBar: true,
    autoClose: 2000,
  };

  return toast(content, {
    ...commonOpts,
    ...options,
  });
}

export const success = (content: string, options?: ToastOptions) => {
  return createToast(content, {
    icon: <IconSuccess />,
    type: 'success',
    ...options,
  });
};

export const error = (content: string, options?: ToastOptions) => {
  return createToast(content, {
    icon: <IconError />,
    type: 'error',
    ...options,
  });
};

export const info = (content: string, options?: ToastOptions) => {
  return createToast(content, {
    icon: <IconInfo />,
    type: 'info',
    ...options,
  });
};

export default {
  success,
  error,
  info,
};
