import { GetServerSidePropsContext, NextPage } from "next";
import { ReactElement, useContext, useEffect } from "react";
import { DashboardLayout } from "../../../components/layouts/dashboard";
import { fetchGuild } from "../../../utils/api";
import { GuildContext } from "../../../utils/contexts/GuildContext";
import { Guild, NextPageWithLayout } from "../../../utils/types";

type Props = {
  guild: Guild;
};

const SettingsPage: NextPageWithLayout<Props> = ({ guild }) => {
  const { setGuild } = useContext(GuildContext);
  useEffect(() => {
    console.log(guild);
    setGuild(guild);
  });
  return (
    <div className="page">
      Settings Page
      <p>{guild.name}</p>
    </div>
  );
};

SettingsPage.getLayout = function (page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  var guild = await fetchGuild(ctx);
  if (guild == false) return { redirect: { destination: "/" } };
  return { props: { guild } };
}

export default SettingsPage;
