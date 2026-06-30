export const APP_NAME = 'DisasterPrep EDU'
export const APP_DESCRIPTION = 'Disaster Preparedness and Response Education System for Schools and Colleges'

export const DISASTER_TYPES = [
  { type: 'EARTHQUAKE', label: 'Earthquake', emoji: '🌍', color: '#EF4444', id: 'module-earthquake' },
  { type: 'FLOOD', label: 'Flood', emoji: '🌊', color: '#3B82F6', id: 'module-flood' },
  { type: 'FIRE', label: 'Fire', emoji: '🔥', color: '#F97316', id: 'module-fire' },
  { type: 'CYCLONE', label: 'Cyclone', emoji: '🌀', color: '#8B5CF6', id: 'module-cyclone' },
  { type: 'LANDSLIDE', label: 'Landslide', emoji: '⛰️', color: '#92400E', id: 'module-landslide' },
  { type: 'HEAT_WAVE', label: 'Heat Wave', emoji: '☀️', color: '#F59E0B', id: 'module-heat_wave' },
  { type: 'LIGHTNING', label: 'Lightning', emoji: '⚡', color: '#EAB308', id: 'module-lightning' },
  { type: 'PANDEMIC', label: 'Pandemic', emoji: '🦠', color: '#10B981', id: 'module-pandemic' },
] as const

export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const

export const XP_REWARDS = {
  QUIZ_PASS: 50,
  QUIZ_PERFECT: 150,
  MODULE_COMPLETE: 100,
  SIMULATION_COMPLETE: 75,
  DAILY_STREAK: 20,
  FIRST_LOGIN: 10,
} as const

export const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice',
  2: 'Learner',
  3: 'Explorer',
  4: 'Aware',
  5: 'Prepared',
  6: 'Defender',
  7: 'Guardian',
  8: 'Expert',
  9: 'Master',
  10: 'Legend',
}

export const ALERT_PRIORITY_LABELS: Record<string, string> = {
  LOW: 'Low Priority',
  MEDIUM: 'Medium Priority',
  HIGH: 'High Priority',
  CRITICAL: 'Critical',
}

export const ALERT_CATEGORY_LABELS: Record<string, string> = {
  EARTHQUAKE: 'Earthquake',
  FLOOD: 'Flood',
  FIRE: 'Fire',
  CYCLONE: 'Cyclone',
  LANDSLIDE: 'Landslide',
  HEAT_WAVE: 'Heat Wave',
  LIGHTNING: 'Lightning',
  PANDEMIC: 'Pandemic',
  GENERAL: 'General',
  DRILL: 'Drill',
}
