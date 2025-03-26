import autoTimeZone from "./autoTimeZone";
import getTzOffsetMs from "./getTzOffsetMs";
import userTimeZone from "./userTimeZone";

const now = () => {
  const userTz = userTimeZone();
  const autoTz = autoTimeZone();
  const userOffset = getTzOffsetMs(userTz.key);
  const autoOffset = getTzOffsetMs(autoTz.key);
  const userNow = new Date(new Date().getTime() - autoOffset + userOffset);

  return userNow;
};

export default now;
