import { ReactElement, useContext } from "react";
import { Appbar } from "../misc/Appbar";
import { Navbar } from "../misc/Navbar";
import styles from '../misc/index.module.scss'
import { GuildContext } from "../../utils/contexts/GuildContext";

export function DashboardLayout({children}: {children: ReactElement}) {

    const {guild} = useContext(GuildContext);

    return (
        <>
            <Navbar guild={guild}/>
            <div className={styles.layout}>
                <Appbar guild={guild}/>
                <>{children}</>
            </div>
        </>
    )
}