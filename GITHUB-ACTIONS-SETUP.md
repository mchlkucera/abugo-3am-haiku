# 🌙 GitHub Actions - 3 AM Haiku Generator

## ✅ Setup Complete!

Your 3 AM ABUGO haiku generator is now running on **GitHub Actions** - completely free, forever!

## What Was Set Up

### 1. GitHub Repository
- **URL**: https://github.com/mchlkucera/abugo-3am-haiku
- **Visibility**: Public
- **Owner**: mchlkucera

### 2. GitHub Actions Workflow
- **File**: `.github/workflows/3am-haiku.yml`
- **Schedule**: Every day at 3:00 AM EST (8:00 AM UTC)
- **Trigger**: Automatic + Manual

### 3. Secrets Configured
- ✅ `ANTHROPIC_API_KEY` - Stored securely in GitHub Secrets

## How It Works

```
Every day at 3 AM EST:
1. GitHub Actions spins up Ubuntu runner
2. Installs Bun runtime
3. Installs dependencies
4. Runs src/3am-haiku.ts
5. Agent generates creative haiku
6. Posts to Slack channel
7. Shuts down (costs you $0)
```

## Benefits

✅ **Free Forever** - GitHub Actions is free for public repos
✅ **Always Runs** - No Mac sleep issues
✅ **Reliable** - GitHub's infrastructure
✅ **Manual Trigger** - Test anytime
✅ **Logs** - See what happened
✅ **No Maintenance** - Just works

## Managing Your Workflow

### View Workflow Runs
```bash
gh run list
```

### Watch Latest Run
```bash
gh run view --log
```

### Trigger Manually (Test Now!)
```bash
gh workflow run "3am-haiku.yml"
```

### View in Browser
```bash
open https://github.com/mchlkucera/abugo-3am-haiku/actions
```

## Schedule Details

**Cron**: `0 8 * * *`
- Runs at 8:00 AM UTC
- Which is 3:00 AM EST
- Which is midnight PST
- Every single day, 365 days/year

**Format**: `minute hour day month weekday`
- `0 8 * * *` = "At minute 0, hour 8, every day"

## Modify Schedule

Edit `.github/workflows/3am-haiku.yml`:

```yaml
on:
  schedule:
    - cron: '0 8 * * *'  # 3 AM EST
    # - cron: '0 12 * * *'  # 7 AM EST (noon UTC)
    # - cron: '30 4 * * 1-5'  # 11:30 PM on weekdays
```

Examples:
- `0 8 * * *` - Every day at 3 AM EST
- `0 */6 * * *` - Every 6 hours
- `0 8 * * 1` - Mondays only at 3 AM
- `0 8 1 * *` - First day of each month

## Workflow File

```yaml
name: 🌙 3 AM Haiku Generator

on:
  schedule:
    - cron: '0 8 * * *'
  workflow_dispatch:  # Manual trigger

jobs:
  generate-haiku:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run src/3am-haiku.ts
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

## Monitoring

### Check Slack Channel
Your haiku will appear in channel `C09DF8SV4FP` every morning at 3 AM!

### GitHub Actions Tab
https://github.com/mchlkucera/abugo-3am-haiku/actions

Shows:
- ✅ Successful runs (green)
- ❌ Failed runs (red)
- Execution time
- Logs

### Get Notifications
Settings → Notifications → GitHub Actions
- Email on failure
- Mobile notifications

## Troubleshooting

### Workflow Not Running?

**Check the schedule:**
```bash
gh workflow view "3am-haiku.yml"
```

**Check recent runs:**
```bash
gh run list --workflow="3am-haiku.yml" --limit 10
```

**View error logs:**
```bash
gh run view <run-id> --log
```

### Test Immediately
```bash
# Trigger manually
gh workflow run "3am-haiku.yml"

# Watch it run
gh run list --limit 1
```

### Common Issues

**Issue**: Workflow says "disabled"
```bash
gh workflow enable "3am-haiku.yml"
```

**Issue**: Secret not working
```bash
# Update secret
gh secret set ANTHROPIC_API_KEY --body "new-key-here"

# List secrets
gh secret list
```

**Issue**: Wrong timezone
- Cron uses UTC
- 3 AM EST = 8 AM UTC
- Adjust cron expression accordingly

## Cost Breakdown

| Service | Cost |
|---------|------|
| GitHub Actions (public repo) | **FREE** |
| Execution time (~30s/day) | **FREE** |
| Storage | **FREE** |
| **Monthly Total** | **$0.00** |

**Limits**: 2,000 minutes/month (you'll use ~15 minutes)

## Comparison

| Solution | Cost/Month | Always On | Maintenance |
|----------|------------|-----------|-------------|
| Mac + Docker | $0 but Mac must stay awake | ❌ | High |
| **GitHub Actions** | **$0** | **✅** | **None** |
| Railway | $5 | ✅ | Low |
| Fly.io | $0-5 | ✅ | Medium |
| AWS Lambda | $0-1 | ✅ | High |

## What If You Want to Stop It?

**Disable workflow:**
```bash
gh workflow disable "3am-haiku.yml"
```

**Delete repository:**
```bash
gh repo delete mchlkucera/abugo-3am-haiku
```

**Just remove the schedule:**
Edit `.github/workflows/3am-haiku.yml` and delete the `schedule:` section.

## Advanced: Multiple Schedules

Want haikus at multiple times?

```yaml
on:
  schedule:
    - cron: '0 8 * * *'   # 3 AM EST
    - cron: '0 20 * * *'  # 3 PM EST
  workflow_dispatch:
```

## Local Development

Your code still works locally:
```bash
bun run src/3am-haiku.ts
```

And in Docker:
```bash
docker-compose up
```

## Files in This Project

```
.github/workflows/
  3am-haiku.yml          ← GitHub Actions workflow
src/
  3am-haiku.ts           ← The haiku generator
  agent.ts               ← Calendar agent (unused)
  mock-calendar.ts       ← Mock data (unused)
  send-cron-slack.ts     ← Old version (unused)
docker-compose.yml       ← For local testing
Dockerfile               ← For local testing
crontab                  ← For Docker (not used in GitHub Actions)
package.json             ← Dependencies
```

## Next Steps

1. **Watch First Run**: `gh run list`
2. **Check Slack**: Tomorrow at 3 AM, check your Slack!
3. **Enjoy**: Your Mac can sleep now! 😴

## Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Cron Expression Guide](https://crontab.guru/)
- [Your Workflow](https://github.com/mchlkucera/abugo-3am-haiku/actions)
- [Workflow Logs](https://github.com/mchlkucera/abugo-3am-haiku/actions)

---

**🎉 You're all set!**

Your 3 AM haiku will run every night, automatically, forever, for free. Your Mac can sleep peacefully. GitHub handles everything.

Check your Slack tomorrow morning! 🌙✨
