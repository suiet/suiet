import { Extendable } from '../../types';
import classNames from 'classnames';
import Nav, { NavProps } from '../../components/Nav';
import { safe } from '@suiet/core';

export type PageWithNavLayoutProps = Extendable & {
  navProps?: NavProps;
};

const PageWithNavLayout = (props: PageWithNavLayoutProps) => {
  return (
    <div
      className={classNames(
        'w-full h-full overflow-y-auto bg-white no-scrollbar',
        props.className
      )}
      style={props.style}
    >
      <Nav
        position={'sticky'}
        {...safe(props.navProps, {})}
        className={classNames('bg-white top-0', props.navProps?.className)}
      />
      {props.children}
    </div>
  );
};

export default PageWithNavLayout;
