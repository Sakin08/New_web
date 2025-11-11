# How to Create Test Events

## Option 1: Using the UI (Recommended)

1. **Make yourself an admin:**
   - Go to MongoDB and find your user
   - Change `role` field from `"student"` to `"admin"`
2. **Create Event:**
   - Login to the app
   - Go to Events page
   - Click "+ Create Event" button
   - Fill in the form
   - Submit

## Option 2: Using MongoDB Directly

Insert this document into the `events` collection:

```json
{
  "title": "Tech Fest 2024",
  "description": "Join us for an exciting day of technology, innovation, and networking. Featuring keynote speakers, workshops, and competitions!",
  "date": "2024-12-25T10:00:00.000Z",
  "location": "SUST Auditorium",
  "createdAt": "2024-11-12T10:00:00.000Z",
  "updatedAt": "2024-11-12T10:00:00.000Z"
}
```

## Option 3: Using API (Postman/cURL)

```bash
curl -X POST http://localhost:5001/api/events \
  -H "Content-Type: application/json" \
  -H "Cookie: refreshToken=YOUR_TOKEN_HERE" \
  -d '{
    "title": "Tech Fest 2024",
    "description": "Join us for an exciting technology event!",
    "date": "2024-12-25T10:00:00.000Z",
    "location": "SUST Auditorium"
  }'
```

## Troubleshooting

### "Create Event" button not showing?

- Make sure you're logged in
- Check if your user role is "admin" in MongoDB

### Events not appearing?

- Check browser console for errors
- Verify backend is running on port 5001
- Check MongoDB connection

### Can't create event?

- Verify you're an admin user
- Check backend logs for errors
- Make sure all form fields are filled
