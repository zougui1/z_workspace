export interface ClassStats {
  health: number;
  mana: number;
  strength: number;
  resistance: number;
  magicalMight: number;
  magicalMending: number;
  agility: number;
  deftness: number;
}

export interface ClassAvailableObject {
  type: 'quest';
  id: number;
}

export interface Class {
  id: string;
  className: string;
  branch: string;
  stats: ClassStats;
  available: string | ClassAvailableObject;
  equipables: string[];
}

export interface ClassesData {
  data: (Class | { status: 'todo' })[];
}
