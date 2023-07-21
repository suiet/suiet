import Drawer from '../../components/Drawer';
import { useState } from 'react';
import Button from '../../components/Button';

export type TestPageProps = {};

export const TestPage = (props: TestPageProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={'w-full min-h-[100vh]'}>
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </Button>
      <Drawer
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
};
