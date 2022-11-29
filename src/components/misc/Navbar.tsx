import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { BsTerminal, BsGearFill } from "react-icons/bs";
import { FaWrench } from "react-icons/fa";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { Guild } from "../../utils/types";
import { FC } from "react";
import { getIcon } from "../../utils/helpers";

const routes = [
  {
    name: "dashboard",
    getPath: (id: string) => `/dashboard/${id}`,
    icon: <BsGearFill size={48} />,
  },
  {
    name: "commands",
    getPath: (id: string) => `/dashboard/${id}/commands`,
    icon: <BsTerminal size={48} />,
  },
  {
    name: "settings",
    getPath: (id: string) => `/dashboard/${id}/settings`,
    icon: <FaWrench size={48} />,
  },
  {
    name: "logout",
    getPath: () => `http://localhost:3000/api/auth/logout`,
    icon: <MdLogout size={48} />,
    style: {color:"red"}
  }
];

type Props = {
  guild?: Guild;
};

export const Navbar: FC<Props> = ({ guild }) => {
  const router = useRouter();
  return (
    <div className={styles.navbar}>
      <Image
        className={styles.avatar}
        src={getIcon(guild)}
        height={80}
        width={80}
        alt="guild_avatar"
      />
      {routes.map((route) => (
        <div
          key={route.name}
          className={styles.icon}
          style={route.style}
          onClick={() =>
            router.push(route.getPath(router.query?.id!.toString()))
          }
        >
          {route.icon}
        </div>
      ))}
      {/* <div className={styles.icons}>
                <div>
                    <MdSpaceDashboard size={48} />
                </div>
                <div>
                    <BsTerminal size={48} />
                </div>
                <div>
                    <FaWrench size={48} />
                </div>
            </div> */}
    </div>
  );
};
