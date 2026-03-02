/**
 * Prints a startup banner before launching the Vite dev server.
 * Gives new users clear next-steps so they know what to do.
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const CYAN = '\x1b[36m';
const MAGENTA = '\x1b[35m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';

const banner = `
${BOLD}${MAGENTA}  Slidemason${RESET} ${DIM}— local-first presentation builder${RESET}

${BOLD}  Next steps:${RESET}

${GREEN}  1.${RESET} Open ${CYAN}http://localhost:4200${RESET} in your browser
${GREEN}  2.${RESET} Create a new deck, upload sources, and fill out the brief
${GREEN}  3.${RESET} Open this project in your AI-powered IDE:
     ${DIM}Cursor, VS Code + Copilot, Windsurf, or Claude Code${RESET}
${GREEN}  4.${RESET} Click ${YELLOW}"Build Deck"${RESET} — the wizard gives you a script to
     paste into your agent. It handles the rest.

${DIM}  Tip: The agent edits decks/<name>/slides.tsx and the
  studio hot-reloads automatically — no refresh needed.${RESET}
`;

console.log(banner);
