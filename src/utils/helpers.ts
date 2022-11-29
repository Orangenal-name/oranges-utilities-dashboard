import { createCanvas } from "canvas";
import { GetServerSidePropsContext } from "next";
import { Guild } from "./types";

export const validateCookies = (ctx: GetServerSidePropsContext) => {
    const sessionID = ctx.req.cookies['connect.sid'];
    return sessionID ? ({Cookie: `connect.sid=${sessionID}`}) : false
}

export const getIcon = (guild?:Guild) => {
    if (!guild) return '/OU.png';
    if (!guild.icon) {
        const canvas = createCanvas(100, 100);
        var ctx = canvas.getContext('2d');
        var text = guild.name.split(/\s*\b\s*/).reduce((response, word) => (response += word.slice(0, 1)), "")
        ctx.font = `${ 45-(text.length*2) < 20 ? 20 : 45-(text.length*2) }px Helvetica`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = "#36393f";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillText(text, 50, 50);
        
        var URL = canvas.toDataURL()

        return URL;
    }
    return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
}