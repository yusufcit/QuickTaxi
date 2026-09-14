# Google Tag Manager Setup Guide

This guide explains how to set up Google Tag Manager (GTM) with your QuickTaxi website and connect it to Google Analytics 4 (GA4).

## Why Google Tag Manager?

- **Easier management** - No code changes needed to add/remove tracking
- **Multiple tags** - Manage GA4, Google Ads, and other integrations from one place
- **Version control** - Easy rollback if something breaks
- **Better security** - Sensitive data stays in GTM

## Step 1: Create a Google Tag Manager Account

1. Go to https://tagmanager.google.com
2. Click **"Create Account"**
3. Fill in:
   - **Account name:** Quick Taxi
   - **Container name:** quick-taxi-web
   - **Target platform:** Web
4. Accept terms and create
5. Copy your **Container ID** (format: GTM-XXXXXX)

## Step 2: Add GTM ID to Environment Variables

Update your `.env.local` file:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXX
```

Replace `GTM-XXXXXX` with your actual GTM Container ID.

## Step 3: Restart Your Application

```bash
npm run dev
```

The GTM script will now load automatically on all pages.

## Step 4: Create GA4 Tag in GTM

1. In GTM, go to **Tags** (left sidebar)
2. Click **"New"**
3. Click the pencil icon and search for **"Google Analytics: GA4 Configuration"**
4. Fill in:
   - **Measurement ID:** G-JC5HBXS64S
   - **Tag name:** GA4 Configuration
5. Under "Triggering", select **"All Pages"** trigger
6. Click **"Save"**

## Step 5: Add Event Tags

### Booking Event
1. Create **New Tag**
2. Choose **"Google Analytics: GA4 Event"**
3. Fill in:
   - **Measurement ID:** G-JC5HBXS64S
   - **Event name:** booking_submitted
   - **Tag name:** GA4 - Booking Submitted
4. Create a trigger for booking form submission
5. Save

### CTA Click Event
1. Create **New Tag**
2. Choose **"Google Analytics: GA4 Event"**
3. Fill in:
   - **Measurement ID:** G-JC5HBXS64S
   - **Event name:** cta_click
   - **Tag name:** GA4 - CTA Click
4. Create a trigger for button clicks
5. Save

## Step 6: Publish Your Container

1. Click **"Submit"** (top right)
2. Add version name: "Initial GA4 Setup"
3. Add description
4. Click **"Publish"**

## Step 7: Verify Installation

1. Go to your website: https://quick-taxi-eight.vercel.app
2. Open DevTools (F12) → **Console tab**
3. You should see GTM initializing
4. In GTM, go to **Preview** mode
5. Interact with your site and see events firing in real-time

## Step 8: Check Google Analytics

1. Go to https://analytics.google.com
2. Select your GA4 property
3. Go to **Real-time** → **Overview**
4. You should see events appearing ✅

## Using GTM Data Layer in Your Components

If you need to push custom events from React components:

```typescript
// Push event to GTM data layer
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'booking_submitted',
    booking_type: 'airport_transfer',
    pickup_location: 'Dublin Airport'
  });
}
```

## Common GTM Events to Track

| Event | Purpose | Trigger |
|-------|---------|---------|
| `page_view` | Track page visits | All pages |
| `cta_click` | Track button clicks | Click elements with class `.cta-button` |
| `booking_submitted` | Track bookings | Form submission |
| `form_start` | Track form engagement | Form focus |
| `scroll` | Track scroll depth | Scroll 25%, 50%, 75%, 100% |

## GTM Best Practices

1. **Use Variables** - Create variables for common values (GA ID, event names)
2. **Version Control** - Always add descriptions when publishing
3. **Test in Preview** - Test changes before publishing
4. **Monitor with GA4** - Check GA4 debugger to see incoming data
5. **Clean Up** - Remove unused tags and triggers periodically

## Troubleshooting

| Issue | Solution |
|-------|----------|
| GTM not loading | Check NEXT_PUBLIC_GTM_ID in .env.local |
| Events not appearing | Verify triggers are correctly set up in GTM |
| GA4 not receiving data | Check Measurement ID matches in GA4 tag |
| Preview mode shows no events | Make sure to interact with tracked elements |

## Resources

- [Google Tag Manager Documentation](https://support.google.com/tagmanager)
- [GTM Setup Guide](https://support.google.com/tagmanager/answer/6103696)
- [GA4 Tag Setup in GTM](https://support.google.com/tagmanager/answer/9442095)

## Support

For issues:
1. Check GTM **Preview** mode
2. Review GA4 **DebugView** in analytics
3. Check browser console for errors
4. Visit [GTM Community](https://support.google.com/tagmanager/community)
