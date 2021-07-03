export const getProcessStartDate = (): Date => {
  const uptimeMilliseconds = process.uptime() * 1000;
  const roundedUptime = Math.round(uptimeMilliseconds);
  return new Date(Date.now() - roundedUptime);
}
