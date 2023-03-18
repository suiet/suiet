import { ReactComponent as Circle } from './circle.svg';
import { ReactComponent as Line } from './line.svg';
import classnames from 'classnames';

const LoadingSpin = () => {
  return (
    <div className={'w-[56px] h-[56px] relative flex flex-grow-0'}>
      <Circle />
      <Line
        className={classnames(
          ' absolute right-0',
          'animate-spin origin-[3px_28px]'
        )}
      />
    </div>
  );
};

export default LoadingSpin;
