import React, { useEffect, useState } from 'react';
import ServerContentBlock from "@/components/elements/ServerContentBlock";
import GreyRowBox from '@/components/elements/GreyRowBox';
import ModpackItem from './ModpackItem';
import { ServerContext } from '@/state/server';
import { useDeepMemoize } from '@/plugins/useDeepMemoize';
import { use } from 'i18next';
import getModpacks from '@/api/server/modpacks/getModpacks';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import databases from '@/state/server/databases';
import Spinner from '@/components/elements/Spinner';
import Fade from '@/components/elements/Fade';
import { Modpack } from '@/api/server/modpacks/Modpack';

export default() => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [loading, setLoading] = useState(true);

    const [modpacks, setModpacks] = useState<Modpack[]>([]);

    useEffect(() => {
        setLoading(!modpacks.length);

        getModpacks(uuid)
            .then((modpacks) => setModpacks(modpacks))
    }, []);

    return (
        <ServerContentBlock title="Modpacks">
            <FlashMessageRender byKey={'modpacks'} css={tw`mb-4`} />
            {!modpacks.length && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <Fade timeout={150}>
                    <div className='grid grid-cols-3 gap-4'>
                        {modpacks.length > 0 ? (
                            modpacks.map((modpack, index) => (
                                <ModpackItem
                                    key={modpack.id}
                                    modpack={modpack}
                                />
                            ))
                        ) : (
                            <p css={tw`text-center text-sm text-neutral-300`}>
                                Couldn't fetch modpacks.
                            </p>
                        )}
                    </div>
                </Fade>
            )}
        </ServerContentBlock>
    );
}
