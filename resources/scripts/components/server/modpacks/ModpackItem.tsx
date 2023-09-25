import { File, Modpack } from '@/api/server/modpacks/Modpack';
import GreyRowBox from '@/components/elements/GreyRowBox';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import React from 'react';
import ModpackModal from './ModpackModal';
import Button from '@/components/elements/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faGamepad } from '@fortawesome/free-solid-svg-icons';
import getModpackDescription from '@/api/server/modpacks/getModpackDescription';
import { ServerContext } from '@/state/server';
import { get } from 'http';
import pullFile from '@/api/server/files/pullFile';
import getFileExists from '@/api/server/files/getFileExists';
import Spinner from '@/components/elements/Spinner';
import decompressFiles from '@/api/server/files/decompressFiles';

interface Props {
    modpack: Modpack;
}

export default ({ modpack }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [visible, setVisible] = React.useState(false);
    const [installVisible, setInstallVisible] = React.useState(false);
    const [modpackDesc, setModpackDesc] = React.useState<string>('');
    const [installing, setInstalling] = React.useState(false);

    const openModal = (): void => {
        setVisible(true);
    };

    const openInstallModal = (): void => {
        setInstallVisible(true);
    };

    const install = async (latestFile: File): Promise<void> => {
        setInstalling(true);
        pullFile(uuid, {
            url: latestFile.downloadUrl,
            directory: '/home/container',
            filename: 'modpack.zip',
            use_header: true,
            foreground: true,
        });

        let modpackDownloaded = await getFileExists(uuid, '/home/container/modpack.zip');
        while (!modpackDownloaded) {
            modpackDownloaded = await getFileExists(uuid, '/home/container/modpack.zip');
        }

        decompressFiles(uuid, '/home/container/modpack', '/home/container/modpack.zip');

        setInstalling(false);
    };

    const getDescription = (): void => {
        getModpackDescription(uuid, modpack.id).then((description) => setModpackDesc(description));
    };

    const openSite = (): void => {
        throw new Error('Function not implemented.');
    };

    return (
        <div>
            <TitledGreyBox title={modpack.name}>
                <GreyRowBox onClick={openModal}>
                    <img style={{ width: '50px', marginRight: '10px' }} src={modpack.logo.url} />
                    <p>{modpack.summary}</p>
                </GreyRowBox>
            </TitledGreyBox>

            <ModpackModal visible={visible} onDismissed={() => setVisible(false)} modpack={modpack}>
                <div className='grid grid-cols-3 gap-2' style={{ maxHeight: '70vh' }}>
                    <img src={modpack.logo.url} style={{ width: '150px' }} />
                    <h1 style={{ fontSize: '1.5em' }}>{modpack.name}</h1>
                    <Button style={{ height: '50px' }} onClick={openInstallModal}>
                        Install
                    </Button>
                    <p className='col-span-3'>{modpack.summary}</p>
                    {modpack.screenshots.map((screenshot) => (
                        <img src={screenshot.url} />
                    ))}
                    <div className='flex items-center'>
                        <FontAwesomeIcon icon={faDownload} style={{ marginRight: '10px' }} />
                        {modpack.downloadCount}
                    </div>
                    <div className='flex items-center'></div>
                    <Button onClick={openSite}>Website</Button>
                </div>
            </ModpackModal>

            <ModpackModal visible={installVisible} onDismissed={() => setInstallVisible(false)} modpack={modpack}>
                    <div style={{ maxHeight: '50vh' }}>
                        {installing ? (
                            <div>
                                <p>Installing...</p>
                                <Spinner centered size='base' />
                            </div>
                        ) : (
                            modpack.latestFiles.map((file) => (
                            <div className='grid grid-cols-3 gap-4'>
                                <p>{file.displayName}</p>
                                <div className='flex items-center'>
                                    <FontAwesomeIcon icon={faGamepad} style={{ marginRight: '10px' }} />
                                    {file.gameVersions[0]}
                                </div>
                                <Button
                                    onClick={() => {
                                        install(file);
                                    }}
                                >
                                    Install
                                </Button>
                            </div>
                        )))}
                    </div>
            </ModpackModal>
        </div>
    );
};
