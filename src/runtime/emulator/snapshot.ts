import { get, set } from 'idb-keyval';

export async function saveSnapshot(state: any, name: string = 'v86-save-state') {
  await set(name, state);
  return true;
}

export async function loadSnapshot(name: string = 'v86-save-state') {
  return await get(name);
}
