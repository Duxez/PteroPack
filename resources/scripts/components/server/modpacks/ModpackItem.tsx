import { Modpack } from '@/api/server/modpacks/Modpack';
import GreyRowBox from '@/components/elements/GreyRowBox';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import React from 'react';

interface Props {
    modpack: Modpack;
}

export default({modpack}: Props) => {
  return (
    <div>
      <TitledGreyBox title={modpack.name}>
        <GreyRowBox>
            <img style={{width: '50px', marginRight: '10px'}} src={modpack.logo.url} />
            <p>{modpack.summary}</p>
        </GreyRowBox>
      </TitledGreyBox>
    </div>
  );
}
