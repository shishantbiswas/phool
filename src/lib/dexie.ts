import Dexie, { EntityTable } from 'dexie';


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

interface History {
  id: number;
  query: string;
  date: Date;
}

interface Shabangs {
  id: number;
  icon:string,
  shabang:string,
  fullname:string,
  url: string
  searchUrl: string

}

export const db = new Dexie('MyDatabase') as Dexie & {
  todos: EntityTable<Todo, "id">;
  settings: EntityTable<Settings, "id">;
  history: EntityTable<History, "id">;
  shabangs: EntityTable<Shabangs, "id">
};

    
db.version(1).stores({
  todos: '++id, title, date, completed',
  history:'++id, query, date',
  shabangs: '++id',
  settings:'id',
});