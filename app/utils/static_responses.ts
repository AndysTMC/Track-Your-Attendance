const invalidCredentialsResponse = () => {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const noRefetchResponse = () => {
    return new Response(JSON.stringify({ error: 'Refetch not possible' }), {
        status: 400,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const errorResponse = (error: string) => {
    return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export { invalidCredentialsResponse, noRefetchResponse, errorResponse };