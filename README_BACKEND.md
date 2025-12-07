# CalmLYF Backend Documentation

## Setup Instructions

### 1. Database Setup

1. **Create Database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

2. **Or manually:**
   - Open phpMyAdmin or MySQL command line
   - Import `database/schema.sql`
   - Database name: `calmlyf_db`

### 2. Configuration

Edit `config/database.php` with your database credentials:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');
define('DB_NAME', 'calmlyf_db');
```

### 3. Server Setup

#### Using XAMPP/WAMP:
1. Copy all files to `htdocs` or `www` folder
2. Access via: `http://localhost/calmlyf/api/auth.php?action=login`

#### Using PHP Built-in Server:
```bash
cd calmlyf
php -S localhost:8000
```

## API Endpoints

### Authentication (`api/auth.php`)

#### Login
```
POST /api/auth.php?action=login
Body: {
    "email": "user@example.com",
    "password": "password123"
}
```

#### Signup
```
POST /api/auth.php?action=signup
Body: {
    "name": "John Doe",
    "email": "user@example.com",
    "password": "password123",
    "userType": "client",
    "phone": "+1234567890"
}
```

#### Check Auth
```
GET /api/auth.php?action=check
```

#### Logout
```
GET /api/auth.php?action=logout
```

### Bookings (`api/bookings.php`)

#### Create Booking
```
POST /api/bookings.php?action=create
Body: {
    "therapistId": 1,
    "therapistName": "Dr. John",
    "name": "Client Name",
    "email": "client@example.com",
    "phone": "+1234567890",
    "date": "2024-12-25",
    "time": "10:00",
    "duration": 60,
    "method": "video",
    "notes": "Session notes",
    "emergencyContact": "Emergency contact",
    "reminders": {
        "email24h": true,
        "sms2h": true,
        "emailDay": false
    }
}
```

#### List Bookings
```
GET /api/bookings.php?action=list
```

#### Get Booking
```
GET /api/bookings.php?action=get&id=1
```

#### Reschedule Booking
```
POST /api/bookings.php?action=reschedule
Body: {
    "bookingId": 1,
    "newDate": "2024-12-26",
    "newTime": "11:00",
    "reason": "Schedule conflict"
}
```

#### Cancel Booking
```
POST /api/bookings.php?action=cancel
Body: {
    "bookingId": 1
}
```

### Therapists (`api/therapists.php`)

#### List All Therapists
```
GET /api/therapists.php?action=list
```

#### Match Therapists
```
POST /api/therapists.php?action=match
Body: {
    "answers": {
        "q1": "video",
        "q2": "anxiety",
        "q3": "female",
        "q4": "26-35"
    }
}
```

#### Get Therapist
```
GET /api/therapists.php?action=get&id=1
```

### Notifications (`api/notifications.php`)

#### List Notifications
```
GET /api/notifications.php?action=list
GET /api/notifications.php?action=list&unread=true
```

#### Get Unread Count
```
GET /api/notifications.php?action=unread
```

#### Mark as Read
```
PUT /api/notifications.php?action=mark_read
Body: {
    "id": 1
}
```

#### Mark All as Read
```
PUT /api/notifications.php?action=mark_all_read
```

## Database Tables

### Main Tables:
- `users` - Client and doctor accounts
- `therapists` - Therapist profiles
- `session_bookings` - Therapy session bookings
- `mood_entries` - User mood tracking
- `journal_entries` - User journal entries
- `community_posts` - Community forum posts
- `community_comments` - Comments on posts
- `notifications` - User notifications
- `gift_memberships` - Gift membership purchases
- `user_stats` - User statistics
- `user_preferences` - User preferences
- `session_reminders` - Session reminder scheduling
- `therapist_matching_answers` - Therapist matching questionnaire answers

## Security Notes

1. **Password Hashing:** Currently using `password_hash()`. Ensure all passwords are hashed before storage.

2. **SQL Injection:** All queries use prepared statements to prevent SQL injection.

3. **XSS Protection:** Input is sanitized using `sanitizeInput()` function.

4. **Session Management:** Sessions are used for authentication. Implement proper session timeout in production.

5. **CORS:** Currently allows all origins. Restrict in production:
   ```php
   header('Access-Control-Allow-Origin: https://yourdomain.com');
   ```

## Frontend Integration

Update your JavaScript to use these API endpoints:

```javascript
// Example: Login
async function login(email, password) {
    const response = await fetch('api/auth.php?action=login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    return await response.json();
}

// Example: Create Booking
async function createBooking(bookingData) {
    const response = await fetch('api/bookings.php?action=create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    });
    return await response.json();
}
```

## Testing

Use tools like Postman or curl to test endpoints:

```bash
# Test login
curl -X POST http://localhost/api/auth.php?action=login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Production Considerations

1. **HTTPS:** Always use HTTPS in production
2. **Error Handling:** Implement comprehensive error logging
3. **Rate Limiting:** Add rate limiting to prevent abuse
4. **Input Validation:** Add more robust input validation
5. **Database Indexing:** Ensure proper indexes for performance
6. **Backup:** Implement regular database backups
7. **Environment Variables:** Use environment variables for sensitive data

