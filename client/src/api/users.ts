export async function login(email: string, password: string) {
    const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password })
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Login failed');
    }
    return res.json();
}

export async function signup(firstName: string, lastName: string, email: string, password: string) {
    const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ firstName, lastName, email, password })
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Signup failed');
    }
    return res.json();
}