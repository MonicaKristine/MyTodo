import TodoNavbar from "../components/navbar";
import TodoList from "../components/todoList";
import AddTodo from "../components/addTodo";
import "../App.css";

function Todo() {
  return (
    <>
      <TodoNavbar />
      <div className="todo-page">
        <h1>My Todos</h1>
        <AddTodo />
        <TodoList />
      </div>
    </>
  );
}

export default Todo;
