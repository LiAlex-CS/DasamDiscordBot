# DasamDiscordBot

The Dasam Discord Bot is a bot that tracks Valorant smurf accounts and their ranks.

![Smurf](https://github.com/LiAlex-CS/DasamDiscordBot/blob/master/README_IMG.png?raw=true)

To add this discord bot to your server, contact `BingBong#7235` on discord.

The bot listens to `$smurf`. To get a list of all commands use `$smurf help`.

## FOR THE DEVS:

### SETTING UP THE BOT:

_Ensure you have > node v16.x and npm installed on your machine._

_All environment variables required for setup are listed in the `#environment-variables` discord channel._

[This link](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) will help in setting up the `DISCORD_ID` environment variable.

1. Clone bot to your machine using:

   - http: `git clone https://github.com/LiAlex-CS/DasamDiscordBot.git`
   - ssh: `git clone git@github.com:LiAlex-CS/DasamDiscordBot.git`

2. `cd` into directory with the project.

3. Run `npm install` in the root directory of the project.

### STARTING THE BOT:

_If you are running an instance, please indicate it in the general text channel._

_Please note, the bot is listening to `$smurf-d` for developer instances and not `$smurf`, like in production._

1. `cd` into the root directory of the project.

2. Run `npm run dev`.

3. Verify your bot is running in the `#testing-grounds` text channel by running `$smurf-d`.
