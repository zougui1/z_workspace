const consoles = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
  count: console.count,
  time: console.time,
  timeEnd: console.log,
  dir: console.dir,
  table: console.table,
  group: console.group,
  groupEnd: console.groupEnd,
  groupCollapsed: console.groupCollapsed,
};

for (const [type, log] of Object.entries(consoles)) {
  const anyConsole = console as any;
  const anylog = log as ((...args: any[]) => any);

  anyConsole[type] = (...args: any[]) => {
    const originalStackTraceLimit = Error.stackTraceLimit;

    Error.stackTraceLimit = 1;
    const error = new Error();
    Error.captureStackTrace(error, anyConsole[type]);
    Error.stackTraceLimit = originalStackTraceLimit;

    anylog(...args, `\n${error.stack}`);
  }
}
