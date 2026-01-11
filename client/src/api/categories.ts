export async function getCategories() {
    const token = localStorage.getItem("token");

    const res = await fetch('/api/category', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        },
    
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to fetch categories');
    }
    const data = await res.json();
    return data.data.Categories;
}

export async function addCategory(name: string) {
    const token = localStorage.getItem("token");
    const res = await fetch('/api/category', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({name})
    });

    if(!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? 'Failed to add category');
    }
    return res.json();
}