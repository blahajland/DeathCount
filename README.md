<img src="https://cdn.discordapp.com/attachments/1147623385220788305/1147623427587444736/Group_416.png" alt="drawing" width="80%" style="text-align:center"/>

Based on the concept of [this bot](https://countingbot.com/), DeathCount (also known as  **numberhaj**) is a Discord counting bot that punishes players 

## How does it work ?

Before we start, bear in mind that this bot was tailormade for  the [Blahaj Land](https://blahaj.land) Discord server. Therefore, the punishment are hardcoded in, and modifying them requires you to dig into the code.

Basically, this bot will give a **timeout** role to whoever broke the count, for a limited amount of time, depending on how often the user reoffended.

As of the last build, the timeout looks like this :

Number of errors | Timeout duration
---|---
1 error| 12 hours
2 errors| 24 hours
3 errors  | $\infty$

Alonside this, multiple commands, only available for some roles (see below), will let you, among other things :

- Restart the game from zero (`/reset`)
- Restart from the last input, in case an error occured (`/resurrect`)
- Restart from a specific number (`/setnb nb`)
- Manually timeout an user (`/timeout user time`)

## How do I run it ?

1. This bot has been made and tested with the lastest version of Python (**3.11.4**), make sure you got it installed on your computer, as this bot's code uses recent additions to Python, like `async` code or `switch` statements.
2. Make sure the following packages are installed :
	- `discord`
		- `pip install discord`
3. Fill the **config.json** file with all the infos needed
	- DEBUG (int) : a number ranging between 0 and 1, lets you activate debug commands
  	- TOKEN (str) : your bot token
    - CHANNEL (str) : the channel in which the counting minigame takes place
    - TIMEOUTROLE (str) : the ID of the timeout role
  	- MODROLES (str[]) : a list of the roles ID allowed to use the commands listed above

4. Run the bot with the following command : `cd /path/to/bot && python3 main.py`
