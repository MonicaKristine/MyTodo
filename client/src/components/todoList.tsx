import { useEffect, useState } from "react";
import { ButtonGroup, ListGroup, Button } from "react-bootstrap";
import { activeTodos, allTodos, deletedTodos, deleteTodo } from "../api/todos";
import { addCategory } from "../api/categories";
import EditTodoModal from "./editTodo";
import type { EditTodoType } from "./editTodo";

export type Todo = {
  id: number;
  name: string;
  description: string;
  UserId: number;
  Status: { status: string; id: number };
  Category: { name: string; id: number };
};

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<EditTodoType | null>(null);

  useEffect(() => {
    fetchTodos(activeTodos);
  }, []);

  const fetchTodos = async (fn: () => Promise<Todo[]>) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fn();
      setTodos(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategoryClick = async () => {
    const name = prompt("Enter the name of the new category");
    if (!name) return;

    try {
      await addCategory(name);
      alert(
        `Category ${name} added successfully! Please refresh the page to find it under Category-dropdown`,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const editTodoClick = async (
    id: number,
    name: string,
    description: string,
    status: string,
    category: string,
  ) => {
    setEditingTodo({ id, name, description, status, category });
  };

  const deleteTodoClick = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this todo?");
    if (!confirmed) return;
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <div className="d-flex mb-3">
        <ButtonGroup>
          <Button
            className="pink-black-btn"
            onClick={() => fetchTodos(activeTodos)}
          >
            Todos
          </Button>
          <Button
            className="pink-black-btn"
            onClick={() => fetchTodos(allTodos)}
          >
            All todos
          </Button>
          <Button
            className="pink-black-btn"
            onClick={() => fetchTodos(deletedTodos)}
          >
            Deleted todos
          </Button>
        </ButtonGroup>
        <Button
          className="ms-auto"
          variant="secondary"
          onClick={addCategoryClick}
        >
          Add Category
        </Button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <ListGroup className="todo-table">
        {todos.map((todo) => (
          <ListGroup.Item variant="secondary" key={todo.id}>
            <strong>{todo.name}</strong>
            <div>{todo.description}</div>
            <small>
              {todo.Status.status} · {todo.Category.name}
            </small>
            <div className="todo-btn-div">
              <Button
                className="pink-btn todo-btn"
                onClick={() =>
                  editTodoClick(
                    todo.id,
                    todo.name,
                    todo.description,
                    todo.Status.status,
                    todo.Category.name,
                  )
                }
              >
                Edit
              </Button>
              {todo.Status.status !== "Deleted" && (
                <Button
                  className="pink-btn todo-btn"
                  onClick={() => deleteTodoClick(todo.id)}
                >
                  Delete
                </Button>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {editingTodo && (
        <EditTodoModal
          show={!!editingTodo}
          todo={editingTodo}
          onClose={() => setEditingTodo(null)}
          onSaved={() => fetchTodos(activeTodos)}
        />
      )}
    </>
  );
}

export default TodoList;
