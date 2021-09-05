export interface Entity {
  id: string;
  name: string;
  stats: {
    health: number;
    mana: number;
    strength: number;
    resistance: number;
    magicalMight: number;
    magicalMending: number;
    agility: number;
    deftness: number;
  };
}
