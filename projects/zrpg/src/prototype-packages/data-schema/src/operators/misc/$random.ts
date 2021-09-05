export const $random = (): number => {
  return Math.random();
}

export interface RandomOperator {
  $random: {};
}
