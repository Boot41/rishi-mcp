import express from 'express';
import { CalendarClient } from '../calendar-client.js';

const router = express.Router();
const calendarClient = new CalendarClient();

// Connect to the calendar client when the router is created
calendarClient.connect().catch(console.error);

router.get('/events', async (req, res) => {
  try {
    const { timeMin, timeMax } = req.query;
    
    if (!timeMin || !timeMax) {
      return res.status(400).json({ error: 'timeMin and timeMax are required query parameters' });
    }

    const response = await calendarClient.listEvents({
      timeMin: timeMin as string,
      timeMax: timeMax as string,
      maxResults: 100
    });

    // Parse the events from the response
    const events = JSON.parse(response.content[0].text);
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

export default router;
