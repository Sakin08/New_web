# Campus HUB Events - Complete Guide

## ✅ Events Have Been Added!

I've just seeded **5 test events** to your database:

1. **Tech Fest 2024** - 7 days from now
2. **Cultural Night** - 3 days from now
3. **Career Fair 2024** - 14 days from now
4. **Sports Day** - 2 days from now
5. **Hackathon 2024** - 10 days from now

## 🎯 How to View Events

1. **Go to Events Page**: Navigate to `/events` or click "Events" in navbar
2. **See Live Countdowns**: Each event shows a real-time countdown timer
3. **Check Status Badges**: Color-coded badges show event urgency

## 📝 How to Create New Events (Admin Only)

### Step 1: Make Yourself Admin

```javascript
// In MongoDB, update your user document:
{
  "role": "admin"  // Change from "student" to "admin"
}
```

### Step 2: Create Event

1. Login to the app
2. Go to Events page
3. Click "+ Create Event" button (only visible to admins)
4. Fill in the form:
   - Event Title
   - Description
   - Date & Time
   - Location
5. Click "Create Event"

## 🎨 Event Card Features

### Live Countdown Timer

- **Starting Soon** (< 1 hour): Red badge, shows minutes & seconds
- **Today**: Green badge, shows hours & minutes
- **Tomorrow**: Blue badge, shows hours & minutes
- **This Week**: Yellow badge, shows days & hours
- **Later**: Purple badge, shows days
- **Past Event**: Gray badge, shows "Event has ended"

### Visual Elements

- **Left Panel**: Date display with gradient background
- **Right Panel**: Event details with countdown
- **Icons**: Location, time indicators
- **Buttons**: "Interested" button for engagement

## 🔄 Re-seed Events Anytime

If you want to reset events or add fresh test data:

```bash
cd backend
npm run seed:events
```

This will:

1. Clear all existing events
2. Add 5 new test events with dates relative to today

## 🛠️ Troubleshooting

### Events Not Showing?

1. Check if backend is running: `http://localhost:5001/api/events`
2. Check browser console for errors
3. Verify MongoDB connection

### Can't Create Events?

1. Make sure you're logged in
2. Verify your user role is "admin" in MongoDB
3. Check backend logs for errors

### Countdown Not Updating?

1. Refresh the page
2. Check browser console for JavaScript errors
3. The countdown updates every second automatically

## 📊 Event Data Structure

```javascript
{
  title: String,        // Event name
  description: String,  // Event details
  date: Date,          // Event date & time
  location: String,    // Event venue
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

## 🎉 Features Implemented

✅ Event creation page with beautiful UI
✅ Live countdown timer (updates every second)
✅ Color-coded status badges
✅ Responsive event cards
✅ Admin-only creation
✅ Form validation
✅ Error handling
✅ Seed script for test data
✅ Real-time updates

## 🚀 Next Steps

1. **View Events**: Go to `/events` to see the 5 test events
2. **Make Admin**: Update your user role in MongoDB
3. **Create Event**: Use the "+ Create Event" button
4. **Watch Countdown**: See the timer update in real-time!

Enjoy your dynamic event system! 🎊
