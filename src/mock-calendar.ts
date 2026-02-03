export interface CalendarEvent {
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  description?: string;
}

export function getMockCalendarEvents(date: Date): CalendarEvent[] {
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Return mock events for the day
  const events: CalendarEvent[] = [
    {
      title: "Team Standup",
      startTime: "9:00 AM",
      endTime: "9:30 AM",
      location: "Conference Room A",
      description: "Daily team sync-up meeting"
    },
    {
      title: "Project Review",
      startTime: "11:00 AM",
      endTime: "12:00 PM",
      location: "Virtual - Zoom",
      description: "Q1 project milestone review with stakeholders"
    },
    {
      title: "Lunch with Client",
      startTime: "1:00 PM",
      endTime: "2:00 PM",
      location: "Downtown Cafe",
      description: "Discuss new project requirements"
    },
    {
      title: "Code Review Session",
      startTime: "3:00 PM",
      endTime: "4:00 PM",
      location: "Virtual - Teams",
      description: "Review PRs from the sprint"
    },
    {
      title: "Team Happy Hour",
      startTime: "5:30 PM",
      endTime: "7:00 PM",
      location: "The Local Pub",
      description: "End of sprint celebration"
    }
  ];

  return events;
}
