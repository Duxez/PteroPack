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
import Spinner from '@/components/elements/Spinner';
import installModpack from '@/api/server/modpacks/installModpack';
import getFileExists from '@/api/server/files/getFileExists';

interface Props {
    modpack: Modpack;
}

interface ModpackManifest {
    author: string;
    files: ModpackFile[]
    manifestType: string;
    manifestVersion: number;
    minecraft: {};
    name: string;
    overrides: string;
    version: string;
}

interface ModpackFile {
    projectID: number;
    fileID: number;
    required: boolean;
}

const timer = (ms: number) => new Promise(res => setTimeout(res, ms))

export default ({ modpack }: Props) => {
    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);
    const [visible, setVisible] = React.useState(false);
    const [installVisible, setInstallVisible] = React.useState(false);
    const [installed, setInstalled] = React.useState(false);
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

        await installModpack(uuid, modpack.id, latestFile.id);

        let uninstallableExists = false;
        while (!uninstallableExists) {
            uninstallableExists = await getFileExists(uuid, 'uninstallable.txt') as unknown as boolean;
            await timer(6500);
        }

        setInstalling(false);
        setInstalled(true);
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
                                <p>Installing... This can take a while, sit back, grab a drink and relax</p>
                                <Spinner centered size='base' />
                            </div>
                        ) : (<>{installed ? (
                            <p>Modpack insatlled, if any mods couldn't be manually installed you can find them in the file 'uninstallable.txt', install them manually before playing.</p>
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
                                ))
                            )}
                        </>
                        )}
                    </div>
            </ModpackModal>
        </div>
    );
};
