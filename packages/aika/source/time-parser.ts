export type Time = { h?: number; m?: number };

export const parseTime = (time: string): Time =>
  Object.fromEntries(
    Object.entries({
      ...time.match(/(?<h>\d+)h/)?.groups,
      ...time.match(/(?<m>\d+)m/)?.groups,
    }).map(([key, n]) => [key, Number(n)])
  );

export const sumTime = (times: Time[]) =>
  times.reduce((acc, time) => {
    return acc + (time.h ?? 0) + (time.m ? Math.floor(time.m / 60) : 0);
  }, 0);
