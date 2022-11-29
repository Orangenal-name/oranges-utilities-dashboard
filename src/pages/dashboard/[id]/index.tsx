import { GetServerSidePropsContext } from "next";
import {
  ChangeEventHandler,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { DashboardLayout } from "../../../components/layouts/dashboard";
import { fetchGuild, fetchGuildFeatures, fetchGuildMembers } from "../../../utils/api";
import { GuildContext } from "../../../utils/contexts/GuildContext";
import { Guild, NextPageWithLayout } from "../../../utils/types";
import { SlQuestion } from "react-icons/sl";
import { MdClose } from "react-icons/md";
import styles from "./index.module.scss";
import axios from "axios";
import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type Props = {
  guild: Guild;
  members: string[];
  features: { order: boolean, time: boolean, timezones: { [user: string]: string }};
};

const DashboardPage: NextPageWithLayout<Props> = ({ guild, members, features }) => {
  const { setGuild } = useContext(GuildContext);
  useEffect(() => {
    setGuild(guild);
    if (features["time"]) {
      var text = document.getElementById("tz-state");
      text!.textContent = "On"
      document.getElementById("times")!.style.display = "";
      changeSelects(Object.keys(features["timezones"]).length)
    }
    if (features["order"]) {
      var text = document.getElementById("order-state");
      text!.textContent = "On"
    }
  }, [setGuild,guild,features]);

  const [users, setUsers] = React.useState(["none"]);
  const [tzValues, setTzs] = React.useState(["none"]);
  const [selects, changeSelects] = useState(1);
  const [modal, setModal] = useState(false);

  const handleChangeUser = (event: SelectChangeEvent, i: number) => {
    var tempUsers = [...users];
    if (tempUsers[i] == undefined) {
      tempUsers.push(event.target.value);
    } else {
      tempUsers[i] = event.target.value;
    }
    setUsers(tempUsers);
  };

  const handleChangeTz = (event: SelectChangeEvent, i: number) => {
    var tempTz = [...tzValues];
    if (tempTz[i] == undefined) {
      tempTz.push(event.target.value);
    } else {
      tempTz[i] = event.target.value;
    }
    setTzs(tempTz);
  };

  const order: ChangeEventHandler<HTMLInputElement> = (e) => {
    var text = document.getElementById("order-state");
    text!.textContent = e.target.checked ? "On" : "Off";
  };

  const tz: ChangeEventHandler<HTMLInputElement> = (e) => {
    var text = document.getElementById("tz-state");
    text!.textContent = e.target.checked ? "On" : "Off";
    if (e.target.checked) document.getElementById("times")!.style.display = "";
    else document.getElementById("times")!.style.display = "none";
  };

  const submit = (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    var tz = event.target.tz.checked ? true : false;
    var order = event.target.order.checked ? true : false;

    var selected: { [user: string]: string } = {};

    for (let i = 0; i < selects; i++) {
      var sUser = users[i];
      var time = tzValues[i];

      if (sUser == "none" || time == "none") {
        setModal(true);
        return false;
      }

      selected[sUser] = time;
    }

    // Get data from the form.
    const data = {
      tz: tz,
      order: order,
      guild: guild.id,
      timezones: selected
    };

    // API endpoint where we send form data.
    const endpoint = `http://localhost:3000/api/guilds/${guild.id}/features`;

    // Send the form data to our forms API on Vercel and get a response.
    axios.post(endpoint, data, { withCredentials: true });
  };
  
  var options = members;

  var selectedOptions: string[] = []

  var i = 0

  for (const user in features["timezones"]) {
    selectedOptions[i] = user
    i++;
  }

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const addSelect = function () {
    let tempTz = [...tzValues];
    tempTz.push("none");
    setTzs(tempTz);
    let tempUsers = [...users];
    tempUsers.push("none");
    setUsers(tempUsers);
    changeSelects(selects + 1);
  };

  const removeSelect = function (i: number) {
    let tempTz = [...tzValues];
    tempTz.splice(i, 1);
    setTzs(tempTz);
    let tempUsers = [...users];
    tempUsers.splice(i, 1);
    setUsers(tempUsers);
    changeSelects(selects - 1);
  };

  return (
    <div className="page">
      <form onSubmit={submit} className={styles.stuff}>
        <div>
          <h1>Feature toggles</h1>
          <label className={styles.switch} id="tz-switch">
            <input
              type="checkbox"
              id="tz-check"
              onChange={tz}
              name="tz"
              defaultChecked={features["time"]}
            />
            <span className={styles.slider}></span>
            <div>
              <p id="tz-state" className={styles.state}>
                Off
              </p>
              <p className={styles.name}>
                Timezones&nbsp;
                <span
                  data-text="The /timezone command tells you the current time of members of the server if the timezone is provided"
                  className={styles.tooltip}
                >
                  <SlQuestion />
                </span>
              </p>
            </div>
          </label>
          <br />
          <br />
          <label className={styles.switch} id="order-switch">
            <input
              type="checkbox"
              id="order-check"
              onChange={(e) => order(e)}
              name="order"
              defaultChecked={features["order"]}
            />
            <span className={styles.slider}></span>
            <div>
              <p id="order-state" className={styles.state}>
                Off
              </p>
              <p className={styles.name}>
                Join order&nbsp;
                <span
                  data-text="The /joinorder command shows you the order members of the server joined in, and the time they joined at."
                  className={styles.tooltip}
                >
                  <SlQuestion />
                </span>
              </p>
            </div>
          </label>
        </div>
        <br />
        <br />
        <div className={styles.times} id="times" style={{ display: "none" }}>
          <ThemeProvider theme={darkTheme}>
            {[...Array(selects)].map((e, i) => (
              <div
                key={i}
                className={styles.selectContainer}
                style={i == 0 ? { position: "relative", left: "22px" } : {}}
              >
                {i > 0 ? (
                  <Button
                    style={{
                      maxWidth: "45px",
                      maxHeight: "45px",
                      minWidth: "45px",
                      minHeight: "45px",
                      borderRadius: "100%",
                      color: "#d0d0d0",
                    }}
                    onClick={(event) => removeSelect(i)}
                  >
                    <MdClose size={20} />
                  </Button>
                ) : (
                  <></>
                )}
                <FormControl sx={{ m: 1, minWidth: 80 }}>
                  <Select
                    id={"selectUser" + i}
                    value={users[i] || "none"}
                    onChange={(event) => handleChangeUser(event, i)}
                    autoWidth
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                    name={"user" + i}
                  >
                    <MenuItem value="none" selected>
                      <em>None</em>
                    </MenuItem>
                    {options.map((option) => (
                      <MenuItem value={option} key={Math.random()}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 80 }}>
                  <Select
                    id={"selectZone" + i}
                    value={tzValues[i] || "none"}
                    onChange={(event) => handleChangeTz(event, i)}
                    autoWidth
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                    name={"time" + i}
                  >
                    <MenuItem value="none" selected>
                      <em>None</em>
                    </MenuItem>
                    {[
                      "-12",
                      "-11",
                      "-10",
                      "-9",
                      "-8",
                      "-7",
                      "-6",
                      "-5",
                      "-4",
                      "-3",
                      "-2",
                      "-1",
                      "+0",
                      "+1",
                      "+2",
                      "+3",
                      "+4",
                      "+5",
                      "+6",
                      "+7",
                      "+8",
                      "+9",
                      "+10",
                      "+11",
                      "+12",
                    ].map((option) => (
                      <MenuItem value={option} key={Math.random()}>
                        GMT{option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <button
                  type="button"
                  className={styles.addtz}
                  onClick={addSelect}
                >
                  +
                </button>
                <br />
              </div>
            ))}
            <Dialog
              open={modal}
              onClose={() => setModal(false)}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Missing values for select boxes."}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  One or more users or timezones have not been selected. Please
                  select one option for each before saving.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setModal(false)} autoFocus>
                  Ok
                </Button>
              </DialogActions>
            </Dialog>
          </ThemeProvider>
        </div>
        <div>
          <button className={styles.save}>Save</button>
        </div>
      </form>
    </div>
  );
};

DashboardPage.getLayout = function (page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  var guild = await fetchGuild(ctx);
  if (guild == false) return { redirect: { destination: "/" } };
  var members = await fetchGuildMembers(ctx);
  if (members == false) return { redirect: { destination: "/menu" } };
  var features = await fetchGuildFeatures(ctx);
  if (features == false) return { props: { guild,members } }
  return { props: { guild, members, features } };
}

export default DashboardPage;
