# Claude Agent SDK Cron Application

A Docker-based application that uses the Claude Agent SDK to check calendar events every morning at 8:00 AM and logs the results to a file.

## Features

- **Claude Agent SDK Integration**: Uses Anthropic's Agent SDK for intelligent calendar queries
- **Mock Calendar Service**: Returns sample calendar events for demonstration
- **Cron Scheduling**: Automatically runs daily at 8:00 AM
- **Docker Containerized**: Runs in an isolated Docker environment
- **File Logging**: Saves calendar events to timestamped log files

## Prerequisites

- Docker and Docker Compose installed
- Anthropic API key

## Setup

1. **Clone the repository** (if not already done)
   ```bash
   cd casdk-cron-test
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   NODE_ENV=production
   TZ=America/New_York
   ```

3. **Build the Docker image**
   ```bash
   docker-compose build
   ```

## Usage

### Test Agent Manually

Run the agent once to verify it works:
```bash
docker-compose run --rm calendar-agent node dist/run.js
```

This will:
- Query the mock calendar for today's events
- Use Claude to format and present the events
- Create a log file in `logs/calendar-{timestamp}.log`

### Start Cron Service

Start the container with cron scheduling:
```bash
docker-compose up -d
```

The agent will now run automatically every day at 8:00 AM.

### Monitor Logs

View cron execution logs:
```bash
docker-compose exec calendar-agent tail -f /app/logs/cron.log
```

View calendar event logs:
```bash
ls -la logs/
cat logs/calendar-*.log
```

### Stop Service

```bash
docker-compose down
```

## Development

### Local Development

Install dependencies:
```bash
npm install
```

Run in development mode:
```bash
npm run dev
```

Build TypeScript:
```bash
npm run build
```

## Configuration

### Modify Cron Schedule

Edit the `crontab` file to change the schedule. The format is:
```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

Example schedules:
- `0 8 * * *` - Every day at 8:00 AM
- `0 */6 * * *` - Every 6 hours
- `30 9 * * 1-5` - Weekdays at 9:30 AM

After modifying, rebuild the Docker image:
```bash
docker-compose build
docker-compose up -d
```

### Change Timezone

Edit `.env` and change the `TZ` variable:
```
TZ=Europe/London
```

Then restart the container:
```bash
docker-compose down
docker-compose up -d
```

## Project Structure

```
casdk-cron-test/
├── src/
│   ├── agent.ts          # Main agent implementation with Claude SDK
│   ├── mock-calendar.ts  # Mock calendar service
│   └── run.ts            # Entry point for cron execution
├── logs/                 # Log files (created at runtime)
├── Dockerfile            # Docker container configuration
├── docker-compose.yml    # Docker Compose setup
├── package.json          # Node.js dependencies
├── tsconfig.json         # TypeScript configuration
├── crontab               # Cron schedule configuration
├── .env.example          # Example environment variables
├── .dockerignore         # Docker ignore patterns
├── .gitignore            # Git ignore patterns
└── README.md             # This file
```

## How It Works

1. **Cron Trigger**: At 8:00 AM daily, cron executes `node dist/run.js`
2. **Agent Initialization**: The agent loads environment variables and initializes the Claude SDK
3. **Calendar Query**: The agent asks "What are my calendar events today?"
4. **Tool Use**: Claude uses the `get_calendar_events` tool to fetch mock events
5. **Response Formatting**: Claude formats the events into a readable summary
6. **Logging**: Results are written to `logs/calendar-{timestamp}.log`

## Troubleshooting

### Check if cron is running
```bash
docker-compose exec calendar-agent ps aux | grep cron
```

### View crontab configuration
```bash
docker-compose exec calendar-agent crontab -l
```

### Check container logs
```bash
docker-compose logs -f calendar-agent
```

### Manually trigger cron (for testing)
```bash
docker-compose exec calendar-agent crond -f -l 2
```

### Verify API key
```bash
docker-compose exec calendar-agent printenv | grep ANTHROPIC_API_KEY
```

## Future Enhancements

- Replace mock calendar with real Google Calendar integration
- Add email notifications with calendar summaries
- Implement multi-day event queries
- Add web dashboard for viewing logs
- Support multiple users/calendars
- Add event reminders and notifications

## License

ISC
