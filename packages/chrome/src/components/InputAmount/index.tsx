import classNames from 'classnames';
import React, { useRef, useState, useEffect } from 'react';
import styles from './index.module.scss';

interface InputAmountProps {
  onInput: (val: number) => void;
  initAmount?: number;
  max: number;
  symbol?: string;
  className?: string;
}

function InputAmount({
  onInput,
  initAmount,
  max,
  symbol = 'SUI',
  className,
}: InputAmountProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [val, setVal] = useState(initAmount || '0');

  const setInputVal = (value: string) => {
    if (!textareaRef.current) return;
    const tmpVal = Number(value);
    if (Number.isNaN(tmpVal) || tmpVal < 0) {
      return;
    }
    if (value === '') value = '0';
    if (tmpVal > 0 && value.startsWith('0')) {
      setVal(tmpVal.toString());
      onInput(Number(tmpVal));
    } else {
      setVal(value.toString());
      onInput(Number(value));
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight - 8
      }px`;
      // console.dir(textareaRef.current);
    }
  });

  return (
    <div className={classNames(className, styles['balance-container'])}>
      <div
        className={classNames('flex items-center', {
          [styles['fit']]: Number(val) > 0 && Number(val) <= max,
          [styles['excess']]: Number(val) > max,
        })}
        onClick={() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }}
      >
        <div className={styles['balance-amount-box']}>
          <textarea
            ref={textareaRef}
            className={classNames(styles['balance-amount'], 'no-scrollbar')}
            value={val}
            rows={1}
            onChange={(e) => {
              setInputVal(e.target.value);
            }}
          />
          {/* <div
            className={styles['balance-amount-placeholder']}
            style={{
              visibility: 'hidden',
              width: `${val.toString().length * 23}px`,
            }}
          >
            {val}
          </div> */}
        </div>

        <span className={styles['balance-name']}>{symbol}</span>
      </div>
      <div
        className={styles['balance-max-btn']}
        onClick={() => {
          setInputVal(max.toString());
        }}
      >
        MAX
      </div>
    </div>
  );
}

export default InputAmount;
