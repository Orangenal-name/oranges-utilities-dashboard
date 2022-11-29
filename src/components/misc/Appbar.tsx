import styles from './index.module.scss'
import {BiArrowBack} from 'react-icons/bi'
import { useRouter } from 'next/router'
import { Guild } from '../../utils/types'
import { FC } from 'react'

type Props = {
    guild?:Guild
}

export const Appbar: FC<Props> = ({guild}) => {
    const router = useRouter();
    return(
        <div className = {styles.appbar}>
            <div className={styles.menu} onClick={() => router.push("/menu")}>
                <BiArrowBack size={32}/>
                <p>Menu</p>
            </div>
            <div className={styles.guildName}>
                <p>{guild?.name}</p>
            </div>
        </div>
)}