import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RootState } from '@/redux/store';
import {
  setTodos,
  setTodosLoading,
  setTodosError,
  addTodo,
  updateTodo,
  deleteTodo,
  TODOS_TABLE_ID,
} from '@/redux/slices/tables';
import axios from '@/utils/axios';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  created_time: string;
  last_modified_time: string;
  last_modified_by: string;
}

export default function TodoPage() {
  const dispatch = useDispatch();
  const { items: todos, loading, error } = useSelector((state: RootState) => state.tables.todos);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        dispatch(setTodosLoading(true));
        const response = await axios.post(`/table/${TODOS_TABLE_ID}/record/query`, {
          filters: [],
          sort: [{ field: "created_at", direction: "desc" }],
          amount: "all"
        });
        dispatch(setTodos(response.data.records));
      } catch (error) {
        dispatch(setTodosError(error instanceof Error ? error.message : 'Failed to fetch todos'));
      } finally {
        dispatch(setTodosLoading(false));
      }
    };

    fetchTodos();
  }, [dispatch]);

  const addTodoHandler = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post(`/table/${TODOS_TABLE_ID}/record`, {
          records: [{
            title: newTask,
            completed: false,
            created_at: new Date().toISOString()
          }]
        });
        dispatch(addTodo(response.data.records[0]));
        setNewTask('');
      } catch (error) {
        console.error('Failed to add todo:', error);
      }
    }
  };

  const toggleTodo = async (todo: Todo) => {
    try {
      const response = await axios.patch(`/table/${TODOS_TABLE_ID}/record/${todo.id}`, {
        fields: {
          completed: !todo.completed
        }
      });
      dispatch(updateTodo(response.data.record));
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const deleteTodoHandler = async (id: number) => {
    try {
      await axios.delete(`/table/${TODOS_TABLE_ID}/record/${id}`);
      dispatch(deleteTodo(id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  const todosList = Array.isArray(todos) ? todos : [];
  const completedCount = todosList.filter(todo => todo.completed).length;

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Clear completed</DropdownMenuItem>
              <DropdownMenuItem>Sort by date</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Add a task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodoHandler()}
            className="flex-1"
          />
          <Button onClick={addTodoHandler} size="icon">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {todosList.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo)}
                />
                <span
                  className={`flex-1 ${
                    todo.completed ? 'text-muted-foreground line-through' : ''
                  }`}
                >
                  {todo.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTodoHandler(todo.id)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t">
          <button
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
            onClick={() => {}}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>
    </Card>
  );
}