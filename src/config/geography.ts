/**
 * Mozambique geography constants.
 *
 * This is intentionally a simple static list for Milestone 1. A future
 * milestone can migrate this into a proper Province / City database table
 * (e.g. for marketplace filtering by location) without changing the shape
 * consumers rely on: { value, label }.
 */

export const MOZAMBIQUE_PROVINCES = [
  { value: 'MAPUTO_CIDADE', label: 'Maputo Cidade' },
  { value: 'MAPUTO_PROVINCIA', label: 'Maputo Província' },
  { value: 'GAZA', label: 'Gaza' },
  { value: 'INHAMBANE', label: 'Inhambane' },
  { value: 'SOFALA', label: 'Sofala' },
  { value: 'MANICA', label: 'Manica' },
  { value: 'TETE', label: 'Tete' },
  { value: 'ZAMBEZIA', label: 'Zambézia' },
  { value: 'NAMPULA', label: 'Nampula' },
  { value: 'CABO_DELGADO', label: 'Cabo Delgado' },
  { value: 'NIASSA', label: 'Niassa' },
] as const;

export type ProvinceValue = (typeof MOZAMBIQUE_PROVINCES)[number]['value'];
