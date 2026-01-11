export async function todoList(endpoint: string) {
    const token = localStorage.getItem("token");

    const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Log in to make your own todo list');
    }
    
    const data = await res.json();
    return data.data.Todos;
}

export const activeTodos = () => todoList('/api/todos');
export const allTodos = () => todoList('/api/todos/all');
export const deletedTodos = () => todoList('/api/todos/deleted');

export async function getStatuses() {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/todos/statuses', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        },
    
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to fetch statuses');
    }
    const data = await res.json();
    return data.data.Statuses;
}

export async function addTodo(name: string, description: string, StatusId: number, CategoryId: number) {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({name, description, StatusId, CategoryId})
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to add todo');
    }
    return res.json();
}

export async function deleteTodo(id: number) {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        }
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to add todo');
    }
    return res.json();
}
