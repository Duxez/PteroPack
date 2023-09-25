import { Modpack } from "@/api/server/modpacks/Modpack";
import PortaledModal, { ModalProps } from "@/components/elements/Modal";
import React, { PropsWithChildren } from "react";

export interface ModpackModalProps extends ModalProps {
    modpack: Modpack;
}

export default(props: PropsWithChildren<ModpackModalProps>) => {

    return (
        <PortaledModal visible={props.visible} onDismissed={props.onDismissed} appear={props.appear} top={props.top}>
            {props.children}
        </PortaledModal>
    )
}
