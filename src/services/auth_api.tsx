
export async function login(usernameOrEmail: string, password: string) {
    const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
}