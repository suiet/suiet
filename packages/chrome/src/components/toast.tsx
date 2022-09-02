import React from 'react';
import { toast, ToastOptions } from 'react-toastify';
import { ReactComponent as IconSuccess } from '../assets/icons/toast-success.svg';

export const success = (content: string, options?: ToastOptions) => {
  return toast.success(content, {
    position: 'top-center',
    closeButton: false,
    icon: <IconSuccess />,
    hideProgressBar: true,
    autoClose: 2000,
    ...options,
  });
};

export default {
  success,
};
