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
import Pagination from '@/components/elements/Pagination';
import { PaginatedResult } from '@/api/http';

export default() => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [modpacks, setModpacks] = useState<PaginatedResult<Modpack>>();

    const changePage = (newPage: number) => {
        setPage(newPage);
        setLoading(true);

        let pageIndex = 0;
        if(modpacks?.pagination.perPage != undefined) {
            pageIndex = (modpacks.pagination.perPage * newPage) - modpacks.pagination.perPage;
            console.log(pageIndex, modpacks.pagination.perPage, newPage);
        }

        getModpacks(uuid, pageIndex)
            .then((modpacksResult) => {
                setModpacks({items: modpacksResult[0], pagination: modpacksResult[1]});
                setLoading(false);
            })
    }

    useEffect(() => {
        setLoading(!modpacks?.items.length);

        getModpacks(uuid)
            .then((modpacksResult) => {
                setModpacks({items: modpacksResult[0], pagination: modpacksResult[1]});
            });
    }, []);

    return (
        <ServerContentBlock title="Modpacks">
            <FlashMessageRender byKey={'modpacks'} css={tw`mb-4`} />
            {(modpacks == undefined || !modpacks?.items.length) && loading ? (
                <Spinner size={'large'} centered />
            ) : (
                <Fade timeout={150}>
                    <div className='grid grid-cols-3 gap-4'>
                        <Pagination data={modpacks as PaginatedResult<Modpack>} onPageSelect={changePage} paginationButtonsClassNames='col-span-3'>
                            {({ items }) => (
                                items.length > 0 ? (
                                modpacks?.items.map((modpack, index) => (
                                    <ModpackItem
                                        key={modpack.id}
                                        modpack={modpack}
                                    />
                                ))
                            ) : (
                                <p css={tw`text-center text-sm text-neutral-300`}>
                                    Couldn't fetch modpacks.
                                </p>
                            ))}
                        </Pagination>
                    </div>
                </Fade>
            )}
        </ServerContentBlock>
    );
}
