import Image from 'next/image'
import { FC } from "react";
import { getIcon } from '../../utils/helpers';
import { Guild } from "../../utils/types";
import styles from './index.module.scss';
const { createCanvas, registerFont } = require('canvas');

if (typeof(registerFont) == "function") registerFont("./Helvetica.ttf", {family:"Helvetica"})

type Props = {
    guild: Guild;
}

function createAcronym(str: string) {
    return str.split(/\s*\b\s*/).reduce((response, word) => (response += word.slice(0, 1)), "");
}

function CreateImage(text: string): string {
    const canvas = createCanvas(55, 55);
    var ctx = canvas.getContext('2d');
    ctx.font = `${ 25-(text.length*2) < 10 ? 10 : 25-(text.length*2) }px Helvetica`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillStyle = "#36393f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, 27, 27);
    
    var URL = canvas.toDataURL()

    return URL;
}



export const GuildMenuItem: FC<Props> = ({guild}) => {
    var acronym = createAcronym(guild.name)
    return <div className={styles.container}>
            <Image
                src={getIcon(guild)}
                height={55}
                width={55}
                className={styles.image}
                alt={guild.name}
            />
        <p>{guild.name}</p>
    </div>
}