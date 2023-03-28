import { isNonEmptyArray } from '../../../utils/check';
import Address from '../../../components/Address';
import classnames from 'classnames';

export default function renderAddress(addresses: string[]) {
  if (isNonEmptyArray(addresses)) {
    const address = addresses[0];
    if (addresses.length > 1) {
      return (
        <>
          <Address
            hideCopy={true}
            className={classnames('ml-1')}
            value={address}
            disableCopy={true}
          />
          <span className="ml-1"> and {addresses.length - 1} more</span>
        </>
      );
    }
    return (
      <Address
        hideCopy={true}
        className={classnames('ml-1')}
        value={address}
        disableCopy={true}
      ></Address>
    );
  }
  return null;
}
