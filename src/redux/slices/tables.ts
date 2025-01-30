import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  created_time: string;
  last_modified_time: string;
  last_modified_by: string;
}

interface TablesState {
  todos: {
    items: Todo[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: TablesState = {
  todos: {
    items: [],
    loading: false,
    error: null,
  },
};

export const TODOS_TABLE_ID = 'c56a4e25-b868-4acb-a697-584445fb631f';

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos.items = action.payload;
    },
    setTodosLoading: (state, action: PayloadAction<boolean>) => {
      state.todos.loading = action.payload;
    },
    setTodosError: (state, action: PayloadAction<string | null>) => {
      state.todos.error = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.items.push(action.payload);
    },
    updateTodo: (state, action: PayloadAction<Todo>) => {
      const index = state.todos.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.todos.items[index] = action.payload;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos.items = state.todos.items.filter(todo => todo.id !== action.payload);
    },
  },
});

// Selectors
export const selectTableRecords = (state: RootState) => state.tables.todos.items;
export const selectIsLoading = (state: RootState) => state.tables.todos.loading;
export const selectTableSchema = (state: RootState) => null; // Add proper schema if needed
export const selectSchemaLoading = (state: RootState) => false;

export const {
  setTodos,
  setTodosLoading,
  setTodosError,
  addTodo,
  updateTodo,
  deleteTodo,
} = tablesSlice.actions;

export default tablesSlice.reducer;