import Dexie, { EntityTable } from 'dexie';

export const db = new Dexie('MyDatabase') as Dexie & {
  todos: EntityTable<Todo, "id">;
  settings: EntityTable<Settings, "id">;
};

interface Todo {
    id: number;
    title: string;
    description: string;
    date: number;
    month: number;
    year: number;
    completed: boolean;
}

interface Settings{
  id: number;
  shouldSaveHistory: boolean;
  preferredColorScheme: string;
}

db.version(1).stores({
  todos: '++id, title, date, completed',
  settings:'id'
});

