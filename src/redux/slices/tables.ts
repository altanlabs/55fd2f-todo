import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axios from '@/utils/axios';

export interface Todo {
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
  schema: any | null;
  schemaLoading: boolean;
}

const initialState: TablesState = {
  todos: {
    items: [],
    loading: false,
    error: null,
  },
  schema: null,
  schemaLoading: false,
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
    setSchema: (state, action: PayloadAction<any>) => {
      state.schema = action.payload;
    },
    setSchemaLoading: (state, action: PayloadAction<boolean>) => {
      state.schemaLoading = action.payload;
    },
  },
});

// Async action creators
export const fetchTableSchema = (tableId: string) => async (dispatch: any) => {
  dispatch(setSchemaLoading(true));
  try {
    const response = await axios.get(`/table/${tableId}`);
    dispatch(setSchema(response.data));
  } catch (error) {
    console.error('Failed to fetch schema:', error);
  } finally {
    dispatch(setSchemaLoading(false));
  }
};

export const createRecord = (tableId: string, data: Partial<Todo>) => async (dispatch: any) => {
  try {
    const response = await axios.post(`/table/${tableId}/record`, {
      records: [{
        title: data.title,
        completed: data.completed,
        created_at: data.created_at
      }]
    });
    dispatch(addTodo(response.data.records[0]));
    return response.data.records[0];
  } catch (error) {
    console.error('Failed to create record:', error);
    throw error;
  }
};

export const updateRecord = (tableId: string, recordId: number, data: Partial<Todo>) => async (dispatch: any) => {
  try {
    const response = await axios.patch(`/table/${tableId}/record/${recordId}`, {
      fields: data
    });
    dispatch(updateTodo(response.data.record));
    return response.data.record;
  } catch (error) {
    console.error('Failed to update record:', error);
    throw error;
  }
};

export const deleteRecord = (tableId: string, recordId: number) => async (dispatch: any) => {
  try {
    await axios.delete(`/table/${tableId}/record/${recordId}`);
    dispatch(deleteTodo(recordId));
  } catch (error) {
    console.error('Failed to delete record:', error);
    throw error;
  }
};

export const {
  setTodos,
  setTodosLoading,
  setTodosError,
  addTodo,
  updateTodo,
  deleteTodo,
  setSchema,
  setSchemaLoading,
} = tablesSlice.actions;

// Selectors
export const selectTableRecords = (state: RootState) => state.tables.todos.items;
export const selectIsLoading = (state: RootState) => state.tables.todos.loading;
export const selectTableSchema = (state: RootState) => state.tables.schema;
export const selectSchemaLoading = (state: RootState) => state.tables.schemaLoading;

export default tablesSlice.reducer;