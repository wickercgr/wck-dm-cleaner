const Discord = require('discord.js-selfbot-v13');
const fs = require('fs');
const chalk = require('chalk');
const { JsonDatabase } = require("wio.db");
const database = new JsonDatabase({ databasePath: "./database.json" });
const path = require('path');
const util = require('util');
const origConsoleLog = console.log;

console.log = function () {
    const now = new Date();
    const options = {
        timeZone: 'Europe/Istanbul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const formattedDate = chalk.rgb(51, 255, 153)('[' + now.toLocaleString('tr-TR', options) + ']');
    const args = Array.from(arguments);
    args.unshift(formattedDate);
    origConsoleLog.apply(console, args);
};

const time = Date.now();

async function loginTokens() {
    const tokens = fs.readFileSync('input-accounts.txt', 'utf-8').split('\r\n').filter(Boolean).map(line => line.slice(line.indexOf(':') + 1));

    function formatMemory(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    let completedCount = -1;
    let completedprocess = 0;
    setInterval(async function () {
        process.title = ` WCK-TOKEN-CUSTOMIZER | Total Completed Accounts: ` + completedprocess + `/${tokens.length}` + ` | Memory Usage: ${formatMemory(process.memoryUsage().heapUsed)}`;
    }, 1000)

    for (let i = 0; i < tokens.length; i++) {
        setTimeout(async () => {
            const client = new Discord.Client({
                checkUpdate: false
            });

            try {
                await client.login(tokens[i]);
            } catch {
                console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(213, 128, 255)("Token invalid, switch to next account.") + chalk.rgb(204, 255, 102)(" {" + i + "}"));
                completedprocess++;
                return;
            }
            client.on('ready', () => {
                // dm check
                const dmChannels = message.guild.channels.cache.filter(channel => channel.type === 'dm');

                // dm close
                dmChannels.forEach(dmChannel => {
                    dmChannel.delete()
                        .then(() => console.log(`DM kanalý kapatýldý: ${dmChannel.name}`))
                        .catch(error => console.error(`DM kanalý kapatma hatasý: ${error}`));
                });
            });

            console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(102, 255, 153)(`${client.user.username}` + " clean process completed.") + chalk.rgb(204, 255, 102)(" {" + i + "}"));

            completedCount++;
            completedprocess++;

            if (completedCount === tokens.length) {
                console.log("");
                console.log(chalk.rgb(0, 184, 230)("-| WCK <> ") + chalk.rgb(204, 255, 102)("All accounts succesfully completed."));
            }
        }, i * (database.get("switchdelay") * 1050));
    }
}

loginTokens();
