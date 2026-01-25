# Nexus | Restful API

A social media platform API for sharing posts, connecting with users, and discovering content.

## Features

- **User Accounts:** Sign up, Login, and Secure Authentication.
- **Posts:** Create, browse, edit, and delete posts.
- **Search:** Find posts easily by title or content.
- **Interactions:** Like and unlike posts.
- **Tags:** Add multiple tags to posts for better categorization.
- **Profiles:** View user profiles.
- **Pagination:** Smooth browsing for large lists of posts.

## Tech Stack

- **Node.js**
- **Express** (TypeScript)
- **PostgreSQL**
- **Zod** (Validation)
- **JWT** (Authentication)

## Prerequisites

- **Node.js** installed.
- **PostgreSQL** database running.
- **NPM**.

## Installation

```bash
# Clone the repository
$ git clone <repo-url>

# Install dependencies
$ npm install
```
## Configuration
Create a .env file in the root folder and add the following:

```bash
PORT=5000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=nexus_db
JWT_SECRET=my_secret_key
```
## Running the App
```bash
# Start the server in development mode
$ npm run dev
```
## 📡 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ![](https://img.shields.io/badge/POST-4682B4?style=flat-square) | `/api/auth/register` | Register a new user |
| ![](https://img.shields.io/badge/POST-4682B4?style=flat-square) | `/api/auth/login` | Login user & get token |

### 📝 Posts
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/posts` | Get all posts (Feed) |
| ![](https://img.shields.io/badge/POST-4682B4?style=flat-square) | `/api/posts` | Create a new post |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/posts/:id` | Get single post details |
| ![](https://img.shields.io/badge/PATCH-E67E22?style=flat-square) | `/api/posts/:id` | Edit a post |
| ![](https://img.shields.io/badge/DELETE-C0392B?style=flat-square) | `/api/posts/:id` | Delete a post |
| ![](https://img.shields.io/badge/POST-4682B4?style=flat-square) | `/api/posts/:postId/like` | Like or Dislike a post |

### 💬 Comments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/comments` | List all comments |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/posts/:postId/comments` | Get comments for a post |
| ![](https://img.shields.io/badge/POST-4682B4?style=flat-square) | `/api/posts/comments` | Add a comment |
| ![](https://img.shields.io/badge/PUT-E67E22?style=flat-square) | `/api/posts/comments/:id` | Edit a comment |
| ![](https://img.shields.io/badge/DELETE-C0392B?style=flat-square) | `/api/posts/comments/:id` | Delete a comment |

### 👤 Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/users` | List all users |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/users/:id` | Get user profile |
| ![](https://img.shields.io/badge/GET-2E86C1?style=flat-square) | `/api/users/:id/posts` | Get specific user's posts |

## 🔍 Search & Pagination

To keep responses efficient, the API supports **Cursor-based Pagination** and **Full-Text Search** on list endpoints (like `/posts`).

### Query Parameters
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | `int` | `1` | The page number to retrieve. |
| `limit` | `int` | `10` | Number of items per page. |
| `search` | `string` | `null` | Keyword to filter posts by Title or Content (Case-insensitive). |

### 💡 Usage Examples

**1. Standard Pagination**
> Get the second page, displaying 5 posts per page.
```http
GET /api/posts?page=2&limit=5
```
**2. Search Filter**

Find all posts containing the word "database".

```http
GET /api/posts?search=database
```
**3. Combined Search & Pagination**

Find "Node.js" posts, limited to 10 items, on page 1.
```http
GET /api/posts?search=Node.js&page=1&limit=10
```

## Currently Working on
[ ] Real-time notifications (Socket.io).

[ ] Frontend integration (React/Next.js).

[ ] Docker support.

