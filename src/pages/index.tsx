import type { GetServerSidePropsContext, NextPage } from "next";
import styles from "../utils/styles/home.module.scss";
import { FaDiscord } from "react-icons/fa";
import { BsGearFill } from "react-icons/bs";
import { getLoginStatus } from "../utils/api";

type Props = {
  loggedIn: Boolean;
};

const Home: NextPage<Props> = ({ loggedIn }) => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/discord";
  };

  return (
    <div className="page">
      <div className="aligned-left">
        <h1>Orange&apos;s utilities</h1>
      </div>
      <div className={styles.box + " aligned-center"}><p>Bingus</p></div>
      <div className="aligned-center">
        <div>
          {loggedIn == true ? (
            <button className={styles.button} onClick={()=>{window.location.href = "/menu"}}>
              <BsGearFill size={50} />
              <span>Manage servers</span>
            </button>
          ) : (
            <button className={styles.button} onClick={handleLogin}>
              <FaDiscord size={50} />
              <span>Login with Discord</span>
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return getLoginStatus(ctx);
}

export default Home;
