export interface ShuttleClass {
  id: number | string;
  name: string;
  type: string;
  capacity: number | string;
  armor: string | null;
  required_skill: string | null;
  required_skill_id: number | string | null;
}

export class Shuttle {
  id: string;
  name: string;
  serial_number: string;
  class: string;
  class_id?: string;
  type?: string;
  capacity?: string;
  armor?: string | null;
  base?: string;
  state?: string;
  operable?: string;
  status_name?: string;
  status?: string;
  assigned_to_name?: string;
  assigned_to_id?: string;
  required_skill?: string;
  required_skill_id?: string;
}
