export interface Move {
  name: string;
  type: { name: string };
  power: number;
  accuracy: number;
  effect_entries: { effect: string; language: { name: string } }[];
}
