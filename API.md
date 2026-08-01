# PasteBin REST API Documentation

The PasteBin platform provides a complete RESTful API to programmatically create, retrieve, search, and manage code and text snippets.

## Base URL
```
http://localhost:4000/api
```

---

## 1. Create a Paste
**Endpoint:** `POST /api/pastes`  
**Content-Type:** `application/json`

### Request Body
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | **Yes** | The snippet text or code (Max 500KB) |
| `title` | `string` | No | Snippet title (Default: `"Untitled Snippet"`) |
| `language` | `string` | No | Syntax highlighting: `"plaintext"`, `"cpp"`, `"python"`, `"java"`, `"javascript"`, `"html"`, `"sql"` |
| `ttl` | `string` | No | Expiration period: `"10m"`, `"1h"`, `"1d"`, `"1w"`, `"1m"`, `"never"` |
| `burn_after_reading` | `boolean` | No | If `true`, deletes paste immediately after 1 view |
| `is_private` | `boolean` | No | If `true`, hides paste from public Explore listing |
| `password` | `string` | No | Protect paste with a password (hashed with bcrypt) |
| `custom_id` | `string` | No | Custom short URL slug (3-32 alphanumeric characters, hyphens, underscores) |

### Sample Response (`201 Created`)
```json
{
  "success": true,
  "paste": {
    "id": "a7x9q2",
    "title": "Notes Snippet",
    "content": "console.log('Hello World');",
    "language": "javascript",
    "is_private": false,
    "burn_after_reading": false,
    "is_password_protected": false,
    "expires_at": "2026-08-02T16:00:00.000Z",
    "delete_token": "f9a8b7c6d5e4f3a2b1c0d9e8",
    "url": "http://localhost:4000/paste/a7x9q2",
    "raw_url": "http://localhost:4000/api/pastes/a7x9q2/raw"
  }
}
```

---

## 2. Retrieve Paste Metadata & Content
**Endpoint:** `GET /api/pastes/:id`

### Request Headers / Query Params
| Header / Query Param | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `x-paste-password` (Header) or `password` (Query) | `string` | Optional | Required only if paste is password protected |

### Sample Response (`200 OK`)
```json
{
  "success": true,
  "paste": {
    "id": "a7x9q2",
    "title": "Notes Snippet",
    "content": "console.log('Hello World');",
    "language": "javascript",
    "views": 1,
    "is_private": false,
    "burn_after_reading": false,
    "is_password_protected": false,
    "expires_at": null,
    "created_at": "2026-08-01T12:00:00.000Z"
  }
}
```

---

## 3. Retrieve Raw Text Content
**Endpoint:** `GET /api/pastes/:id/raw`  
**Response Format:** `text/plain; charset=utf-8`

Ideal for command line tools (`curl`, `wget`) and shell piping:
```bash
curl http://localhost:4000/api/pastes/a7x9q2/raw
```

---

## 4. List Public Snippets
**Endpoint:** `GET /api/pastes`

### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `page` | `number` | No | Page number (Default: `1`) |
| `limit` | `number` | No | Items per page (Default: `100`, Max: `500`) |
| `search` | `string` | No | Filter pastes by title or content substring |

### Sample Response (`200 OK`)
```json
{
  "success": true,
  "pastes": [
    {
      "id": "a7x9q2",
      "title": "Notes Snippet",
      "language": "javascript",
      "views": 1,
      "created_at": "2026-08-01T12:00:00.000Z",
      "expires_at": null,
      "char_count": 27
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 100,
    "total": 1,
    "total_pages": 1
  }
}
```

---

## 5. Delete Paste
**Endpoint:** `DELETE /api/pastes/:id`

### Request Headers / Query Params / Body
| Header / Query / Body Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `x-delete-token` (Header) or `delete_token` | `string` | **Yes** | Secret deletion token provided at paste creation |

### Sample Response (`200 OK`)
```json
{
  "success": true,
  "message": "Paste deleted successfully"
}
```

---

## 6. Health Check
**Endpoint:** `GET /api/health`

### Sample Response (`200 OK`)
```json
{
  "status": "ok",
  "timestamp": "2026-08-01T12:00:00.000Z"
}
```
