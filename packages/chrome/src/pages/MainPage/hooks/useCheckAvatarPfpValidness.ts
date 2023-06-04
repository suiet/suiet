import { useWallet } from '../../../hooks/useWallet';
import { NftGqlDto, useNftListLazyQuery } from '../../../hooks/useNftList';
import { useAsyncEffect } from 'ahooks';
import Message from '../../../components/message';

export default function useCheckAvatarPfpValidness(
  walletId: string,
  accountAddress: string
) {
  const {
    data: wallet,
    setPfpAvatar,
    unsetPfpAvatar,
    refetch,
  } = useWallet(walletId);
  const [queryNftList] = useNftListLazyQuery();

  useAsyncEffect(async () => {
    if (!wallet || !wallet?.avatarPfp?.objectId || !accountAddress) {
      return;
    }
    if (wallet.avatarPfp.expiresAt > Date.now()) return;

    const res = await queryNftList({
      variables: {
        address: accountAddress,
      },
    });
    if (!Array.isArray(res.data?.nfts)) return;

    const nfts = (res.data as any).nfts as NftGqlDto[];
    const nft = nfts.find(
      (nft: NftGqlDto) => nft?.object?.objectID === wallet.avatarPfp?.objectId
    );
    if (!nft) {
      // unset nft avatar if there is no such nft owned by the user
      await unsetPfpAvatar();
      await refetch();
      Message.info('Nft avatar expired', {
        autoClose: 3000,
      });
    } else {
      // extend the expiration time if nft is still owned by user
      const dataWithoutExpiresAt = {
        ...wallet.avatarPfp,
      };
      Reflect.deleteProperty(dataWithoutExpiresAt, 'expiresAt');
      await setPfpAvatar(dataWithoutExpiresAt);
    }
  }, [accountAddress]);
}
