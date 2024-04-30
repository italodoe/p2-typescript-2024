export const usageText = `Usage: bun run main.ts [options]

Options:
  -y, --youtube <term>        Search in YouTube for videos related to the specified term
  -h, --help                  Display this help message`;

export function forceExit(code: number, withError: boolean = true) {
    if (withError) console.error(usageText);
    process.exit(code);
  }
  