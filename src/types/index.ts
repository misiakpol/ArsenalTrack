export type ShootingLog = {
  id: string;
  firearm_id: string;
  session_date: string;
  rounds_fired: number;
  created_at: string;
  firearms?: {
    name: string;
  };
};

export type TrainingLog = {
  id: string;
  firearm_id: string;
  session_date: string;
  shooter_name: string;
  distance_m: number;
  drill_type: string;
  score: number;
  max_score: number;
  created_at: string;
  firearms?: {
    name: string;
  };
};

