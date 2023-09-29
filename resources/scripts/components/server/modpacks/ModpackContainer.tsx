import React, { useCallback, useEffect, useState } from 'react';
import ServerContentBlock from "@/components/elements/ServerContentBlock";
import { ServerContext } from '@/state/server';
import getModpacks from '@/api/server/modpacks/getModpacks';
import FlashMessageRender from '@/components/FlashMessageRender';
import tw from 'twin.macro';
import Spinner from '@/components/elements/Spinner';
import { Modpack } from '@/api/server/modpacks/Modpack';
import { PaginatedResult } from '@/api/http';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import getInstalledGame from '@/api/server/modpacks/getInstalledGame';
import { Button } from '@/components/elements/button/index';
import Fade from '@/components/elements/Fade';
import GreyRowBox from '@/components/elements/GreyRowBox';
import Pagination from '@/components/elements/Pagination';
import Select from '@/components/elements/Select';
import ModpackItem from './ModpackItem';
import { set } from 'date-fns';

export enum ModloaderType {
    Any,
    Forge,
    Cauldron,
    LiteLoader,
    Fabric,
    Quilt
}

export interface ModpackSearchFilter {
    modloaderType: ModloaderType;
}

export default() => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const serverData = ServerContext.useStoreState((state) => state.server.data);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [modloaderType, setModloaderType] = useState<ModloaderType>(ModloaderType.Any);
    const [filters, setFilters] = useState<ModpackSearchFilter>({modloaderType: ModloaderType.Any});
    const [isMinecraft, setIsMinecraft] = useState<boolean>(false);
    const [modpacks, setModpacks] = useState<PaginatedResult<Modpack>>();
    const [checkedInstalledGame, setCheckedInstalledGame] = useState<boolean>(false);

    const changePage = (newPage: number) => {
        setPage(newPage);
        setLoading(true);

        let pageIndex = 0;
        if(modpacks?.pagination.perPage != undefined) {
            pageIndex = (modpacks.pagination.perPage * newPage) - modpacks.pagination.perPage;
            console.log(pageIndex, modpacks.pagination.perPage, newPage);
        }

        getModpacks(uuid, pageIndex, filters)
            .then((modpacksResult) => {
                setModpacks({items: modpacksResult[0], pagination: modpacksResult[1]});
                setModloaderType(modpacksResult[2].modloaderType);
                setLoading(false);
            })
    }

    useEffect(() => {
        if(!checkedInstalledGame) {
            getInstalledGame(uuid)
                .then((installedGame) => {
                    if(installedGame == 'Minecraft') {
                        setIsMinecraft(true);
                        setLoading(!modpacks?.items.length);
                        changePage(1);
                    } else {
                        setIsMinecraft(false);
                    }

                    setCheckedInstalledGame(true);
                });
        }
    }, [modloaderType]);

    const updateFilterModloaderType = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setFilters({modloaderType: parseInt(e.target.value)});
            setModloaderType(parseInt(e.target.value));
        },
        [modloaderType],
    );

    const showModpacks = () => {
        setIsMinecraft(true);
        setLoading(!modpacks?.items.length);
        changePage(1);
    }

    return (
        <ServerContentBlock title="Modpacks">
            <FlashMessageRender byKey={'modpacks'} css={tw`mb-4`} />
            {!isMinecraft ? (
                <TitledGreyBox title="Server isn't a Minecraft server, currently Pteropack only supports Minecraft!">
                    <p css={tw`text-sm`}>
                        You can still install modpacks, but you will have to install them manually.
                    </p>
                    <Button.Danger onClick={showModpacks}>Show modpacks anyways</Button.Danger>
                </TitledGreyBox>

            ) : (
                <>
                    {(modpacks == undefined || !modpacks?.items.length) && loading ? (
                        <Spinner size={'large'} centered />
                    ) : (
                        <Fade timeout={150}>
                            <div className='grid grid-cols-3 gap-4'>
                                <TitledGreyBox title='Filters' className='col-span-3'>
                                    <GreyRowBox>
                                        <div className='grid grid-cols-3 gap-4'>
                                            <Select defaultValue={modloaderType} onChange={updateFilterModloaderType}>
                                                <option value={0}>
                                                    Any
                                                </option>
                                                <option value={1}>
                                                    Forge
                                                </option>
                                                <option value={2}>
                                                    Cauldron
                                                </option>
                                                <option value={3}>
                                                    LiteLoader
                                                </option>
                                                <option value={4}>
                                                    Fabric
                                                </option>
                                                <option value={5}>
                                                    Quilt
                                                </option>
                                            </Select>
                                        </div>
                                    </GreyRowBox>
                                </TitledGreyBox>
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
                </>
            )}
        </ServerContentBlock>
    );
}

