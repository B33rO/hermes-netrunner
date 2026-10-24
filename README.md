# Hermes Netrunner

A cyberpunk, Duolingo-style desktop game that teaches every feature of
[Hermes Agent](https://github.com/NousResearch/hermes-agent), starting from a fresh install.

![icon](build/icon.png)

## What you learn

Fourteen nodes across five sectors, each with a briefing (what it is, how you would use it,
why it helps) and a command reference, followed by challenges:

| Sector | Nodes |
| --- | --- |
| The Deck | Files · Models · Logs |
| Automation | Cron · Skills · Plugins |
| The Net | MCP · Channels · Webhooks |
| Identity | Pairing · Profiles |
| Root | Config · Keys · System |

Challenge types: multiple choice, true/false, match the pairs, and build-the-command
(tap tokens into a terminal line). You get 5 integrity points per lesson, and wrong answers
come back at the end. You earn XP and eddies, keep a daily streak against a 30 XP goal, and
level each node up to 3 by replaying it.

Keyboard: `1`–`4` pick an answer, `Enter` checks or continues, `Esc` leaves a lesson, `F11` toggles full screen.

The commands are based on the Hermes Agent v0.18 CLI.

## Download

Get `HermesNetrunner-Setup-<version>.exe` from the [Releases](../../releases) page.
It installs per-user, so no admin prompt. It runs fully offline and keeps progress on your PC.

The installer is not code-signed, so Windows SmartScreen may warn you. Choose **More info → Run anyway**.

## Build from source

Requires Node.js 20+ and, for the installer, [Inno Setup 6](https://jrsoftware.org/isinfo.php).

```sh
npm install
npm start          # run the app
npm run dist       # package + build dist/installer/HermesNetrunner-Setup-<version>.exe
```

The game itself is the single file `src/hermes-netrunner.html`. `scripts/sync.js` wraps it
into `app/index.html` and swaps web fonts for the bundled ones.

## License

MIT. Bundled fonts are under the SIL Open Font License 1.1 (`fonts/licenses/`).
Hermes Agent is a project of Nous Research. This game is an unofficial fan-made learning aid.
