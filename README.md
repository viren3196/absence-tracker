# Absence Tracker

A simple, single-page web app to track daily absences for your cook and maid — with WhatsApp notifications.

## Features

- **One-tap "Absent Today"** — marks today's date automatically
- **WhatsApp notification** — sends an absence message directly via WhatsApp
- **Monthly counter** — shows total absences per person per month
- **Month navigation** — browse past/future months
- **Undo support** — tap again to undo an absence
- **Remove past dates** — click any date chip to remove it
- **Monthly summary** — send a full month's absence summary via WhatsApp
- **Persistent storage** — all data saved in browser localStorage

## Setup

1. Open `index.html` in a browser (no server needed)
2. In **Settings**, enter the names and phone numbers (with country code, e.g. `919876543210`)
3. Click **Save Settings**

## Usage

- Tap **"Absent Today"** on the person's card to mark them absent
- WhatsApp will open automatically with a pre-filled message — just hit send
- Use the **"Send Summary via WhatsApp"** button to send the full month's report
- Navigate months with **‹ / ›** arrows
- Click any **date chip** to remove that absence

## Data

All data is stored in your browser's `localStorage`. Clearing browser data will erase records.
