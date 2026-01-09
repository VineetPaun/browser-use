# Browser Use 🚀

A beautiful multi-agent CLI tool powered by OpenRouter, featuring Claude Code-style animations and multiple specialized AI agents.

```
  ___                                _   _
 | _ ) _ _  ___ __ __ __ ___  _ _   | | | | ___  ___
 | _ \| '_|/ _ \\ V  V /(_-< / -_)  | |_| |(_-< / -_)
 |___/|_|  \___/ \_/\_/ /__/ \___|   \___/ /__/ \___|

 ✨ Multi-agent CLI powered by OpenRouter
```

## Features

- 🎨 **Beautiful CLI UI** - Gradient colors, spinners, and animations (Ink + React)
- 🤖 **Multiple AI Models** - Access 10+ models via OpenRouter (Claude, GPT-4, Llama, Gemini, etc.)
- 🔧 **Specialized Agents** - Coder, Browser, Researcher, and System agents
- 💬 **Interactive Chat** - Real-time streaming responses
- ⚡ **One-off Tasks** - Quick command execution
- 🌐 **Browser Automation** - Playwright-powered web browsing
- 📁 **File Operations** - Read, write, search files
- 🔍 **Web Research** - Search and fetch web content

## Installation

```bash
# Clone and install
git clone <repo-url>
cd browser-use
npm install

# Configure API key
npm run dev -- config set-key YOUR_OPENROUTER_API_KEY
```

Get your free API key at [OpenRouter](https://openrouter.ai/keys).

## Usage

### Interactive Chat

```bash
# Start interactive chat (default command)
npm run dev

# Or explicitly
npm run dev -- chat
```

### One-off Tasks

```bash
npm run dev -- run "What is the capital of France?"
npm run dev -- run "Explain quantum computing" --model anthropic/claude-3.5-sonnet
```

### Configuration

```bash
# Set API key
npm run dev -- config set-key YOUR_KEY

# Set default model
npm run dev -- config set-model anthropic/claude-3.5-sonnet

# Show current config
npm run dev -- config show

# List available models
npm run dev -- models
npm run dev -- models --free  # Show only free models
```

## Available Models

| Model             | ID                                  | Free |
| ----------------- | ----------------------------------- | ---- |
| Claude Sonnet 4   | `anthropic/claude-sonnet-4`         | ❌   |
| Claude 3.5 Sonnet | `anthropic/claude-3.5-sonnet`       | ❌   |
| GPT-4o            | `openai/gpt-4o`                     | ❌   |
| GPT-4o Mini       | `openai/gpt-4o-mini`                | ❌   |
| Gemini 2.0 Flash  | `google/gemini-2.0-flash-exp:free`  | ✅   |
| Gemini Pro 1.5    | `google/gemini-pro-1.5`             | ❌   |
| Llama 3.3 70B     | `meta-llama/llama-3.3-70b-instruct` | ❌   |
| Mistral Large     | `mistralai/mistral-large`           | ❌   |
| DeepSeek V3       | `deepseek/deepseek-chat`            | ❌   |
| Qwen 2.5 72B      | `qwen/qwen-2.5-72b-instruct`        | ❌   |

## Slash Commands (In Chat)

- `/model` - Change AI model
- `/clear` - Clear conversation
- `/help` - Show help
- `/exit` - Exit application
- `Ctrl+C` - Exit anytime

## Architecture

```
src/
├── index.ts              # CLI entry point
├── cli/
│   ├── commands/         # Commander.js commands
│   │   ├── chat.ts       # Interactive chat
│   │   ├── run.ts        # One-off tasks
│   │   ├── config.ts     # Configuration
│   │   └── models.ts     # List models
│   └── ui/               # Ink React components
│       ├── App.tsx       # Main app
│       ├── Banner.tsx    # ASCII art header
│       ├── Spinner.tsx   # Loading animations
│       ├── MessageList.tsx
│       ├── InputPrompt.tsx
│       ├── ModelSelector.tsx
│       └── StatusBar.tsx
├── agents/
│   ├── orchestratorAgent.ts  # Main coordinator
│   ├── coderAgent.ts         # Code & files
│   ├── browserAgent.ts       # Web automation
│   ├── researchAgent.ts      # Web search
│   └── systemAgent.ts        # Shell commands
├── tools/
│   ├── fileTools.ts      # File operations
│   ├── browserTools.ts   # Playwright browser
│   ├── searchTools.ts    # Web search
│   └── systemTools.ts    # Shell & system
└── config/
    ├── models.ts         # Model definitions
    └── settings.ts       # User preferences
```

## Agent Capabilities

### 🖥️ Coder Agent

- Read/write files
- Search codebases
- Create directories
- Code analysis

### 🌐 Browser Agent

- Navigate websites
- Click, type, scroll
- Take screenshots
- Extract content
- Find links

### 🔍 Research Agent

- Web search (DuckDuckGo)
- Fetch webpages
- Calculations
- Date/time info

### ⚙️ System Agent

- Run shell commands
- Environment info
- DevOps tasks

## Technologies

- **OpenAI Agent SDK** - Multi-agent framework
- **Vercel AI SDK** - Model integration
- **OpenRouter** - Access to 100+ AI models
- **Ink** - React for terminal UIs
- **Playwright** - Browser automation
- **Commander** - CLI framework
- **Chalk/Gradient-string** - Terminal styling
- **Figlet** - ASCII art
- **Ora** - Spinners

## Development

```bash
# Run in development mode
npm run dev

# Type check
npm run typecheck

# Build for production
npm run build
```

## License

MIT
