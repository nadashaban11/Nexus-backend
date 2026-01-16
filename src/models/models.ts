export interface User {
    id: number;
    first_name: string;
    last_name: string;
    user_name: string;
    email: string;
    password: string; 
    created_at: Date;
}

export interface Post {
    id: number;
    title: string;
    content: string | null; 
    url: string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
    user_name?: string; 
}

export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    user_name?: string; 
}

export interface TokenPayload {
    id: number;
    email: string;
}