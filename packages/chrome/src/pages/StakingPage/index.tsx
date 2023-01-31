import Input from '../../components/Input';
import AppLayout from '../../layouts/AppLayout';
import Button from '../../components/Button';
export default function StackingPage() {
  return (
    <AppLayout>
      <div className="px-2">
        <div className="rounded-2xl validator-info p-4 flex items-center justify-between m-2 bg-sky-50 ">
          <div className="flex items-center gap-2">
            <img className="w-[24px] h-[24px] rounded-full "></img>
            <div className="text-sky-800 text-md font-medium">
              Ankr Validator
            </div>
          </div>

          <div className="text-zinc-400 font-medium">Validator</div>
        </div>
      </div>

      <div className="px-6 py-24 text-3xl flex items-center gap-2 w-full max-w-[362px]">
        <input
          className="flex-grow w-[200px] outline-none text-zinc-500"
          placeholder="0"
        />{' '}
        <div className="font-bold text-zinc-300">SUI</div>
        <button className="text-lg py-1 px-3 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition font-medium rounded-2xl">
          Max
        </button>
      </div>
      <div className="fixed b-0 w-full bottom-0 bg-white">
        <div className="border-t border-t-zinc-100 p-4 mx-4">
          <div className="flex flex-col ">
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Staking APY</div>
              <div className="text-zinc-400">11523.9673%</div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Staking Rewards Start</div>
              <div className="text-zinc-400">Epoch #38</div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <div className="text-zinc-700">Gas Fee</div>
              <div className="text-zinc-400">0.000015 SUI</div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-t-zinc-100">
          <Button type={'submit'} state={'primary'}>
            Confirm
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
