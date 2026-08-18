# Firestore Collections

Use these collections in project `quicktaxi-49eea`:

- `bookings`
- `drivers`
- `admin_users`
- `booking_status_history`
- `admin_notifications`
- `site_settings`

## Required admin bootstrap

1. Create an auth user in Firebase Authentication (email/password).
2. Use the user's UID as document ID in `admin_users`.
3. Create doc with fields:

```json
{
  "role": "super_admin",
  "active": true,
  "email": "admin@quicktaxi.ie"
}
```

## Notes

- `bookings.quoted_fare` is private admin-only data.
- Public website must never display prices.
- Session cookie name is `qt_admin_session`.
