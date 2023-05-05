import classNames from 'classnames';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import styles from './index.module.scss';
import { compareCoinAmount } from '../../utils/check';
import formatInputCoinAmount from './formatInputCoinAmount';

export interface InputAmountProps {
  coinSymbol?: string;
  maxCoinAmount: string;
  initCoinAmount?: string;
  decimals?: number;
  isValid?: boolean;
  className?: string;
  onInput: (val: string) => void;
}

/**
 * all amounts here are with decimals
 * @param coinSymbol
 * @param initCoinAmount
 * @param maxCoinAmount
 * @param decimals
 * @param onInput
 * @param className
 * @constructor
 */
function InputAmount({
  coinSymbol,
  initCoinAmount = '0',
  maxCoinAmount = '0',
  decimals = 0,
  isValid,
  onInput,
  className,
}: InputAmountProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [amountWithDecimals, setAmountWithDecimals] =
    useState<string>(initCoinAmount);

  const handleInputValue = (value: string) => {
    if (!textareaRef.current) return;

    const formattedValue = formatInputCoinAmount(value, decimals);
    setAmountWithDecimals(formattedValue);
    onInput(formattedValue);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight - 6
      }px`;
      // console.dir(textareaRef.current);
    }
  });

  return (
    <div className={classNames(className, styles['balance-container'])}>
      <div
        className={classNames(
          'w-full',
          'flex',
          'items-center',
          'justify-between',
          isValid ? styles['fit'] : styles['excess']
        )}
        onClick={() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
      >
        <div className={classNames(styles['balance-amount-box'], 'flex-1')}>
          <textarea
            ref={textareaRef}
            className={classNames(styles['balance-amount'], 'no-scrollbar')}
            value={amountWithDecimals}
            rows={1}
            onChange={(e) => {
              handleInputValue(e.target.value);
            }}
          />
        </div>
        <div className={classNames('flex', 'flex-col')}>
          <span className={styles['balance-name']}>{coinSymbol}</span>
          <button
            className={classNames(
              'text-zinc-600',
              'mt-2',
              'px-3',
              'py-1',
              'w-fit',
              'mx-auto',
              'rounded-2xl',
              'font-medium',
              'bg-zinc-100',
              'transition',
              'hover:bg-zinc-200',
              'active:bg-zinc-300',
              'flex',
              'justify-center',
              'items-center'
            )}
            onClick={() => {
              handleInputValue(maxCoinAmount);
            }}
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputAmount;
