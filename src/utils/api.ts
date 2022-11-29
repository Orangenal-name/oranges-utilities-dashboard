import { GetServerSidePropsContext } from "next";
import axios from "axios";
import { validateCookies } from "./helpers";
import { Guild } from "./types";

const API_URL = "http://localhost:3000/api";

export const getLoginStatus = async (context: GetServerSidePropsContext) => {
    const headers = validateCookies(context);
    if (!headers) return {props:{loggedIn:false}}

    try {
        const {data} = await axios.get(`${API_URL}/auth/status`, { headers, });
        if (data) return {props:{loggedIn:true}}
        else return {props:{loggedIn:false}}
    } catch (err) {
        console.log(err)
        return {props:{loggedIn:false}}
    }
}

export const fetchMutualGuilds = async (context: GetServerSidePropsContext) => {
  const headers = validateCookies(context);
  if (!headers) return { redirect: { destination: "/" } };

  try {
    const { data: guilds } = await axios.get<Guild[]>(`${API_URL}/guilds`, {
      headers,
    });
    return { props: { guilds } };
  } catch (err) {
    console.log(err);
    return { redirect: { destination: "/" } };
  }
};

export const fetchGuild = async (ctx: GetServerSidePropsContext) => {
  const headers = validateCookies(ctx);
  if (!headers) return false;
  try {
    const { data: guild } = await axios.get<Guild>(
      `${API_URL}/guilds/${ctx.query.id}`,
      {
        headers,
      }
    );
    return guild;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchValidGuild = async (headers: HeadersInit, id: string) => {
  const response = await fetch(`${API_URL}/guilds/${id}/permissions`, {
    headers,
  });
  return response;
};

export const fetchGuildMembers = async (ctx: GetServerSidePropsContext) => {
  const headers = validateCookies(ctx);
  if (!headers) return false
  try {
    const {data} = await axios.get(`${API_URL}/guilds/${ctx.query.id}/members`, {headers});
    return data
  } catch (err) {
    console.log(err)
    return false
  }
}

export const fetchGuildFeatures = async (ctx: GetServerSidePropsContext) => {
  const headers = validateCookies(ctx);
  if (!headers) return false
  try {
    const {data} = await axios.get(`${API_URL}/guilds/${ctx.query.id}/features`, {headers})
    return data
  } catch (err) {
    console.log(err)
    return false
  }
}