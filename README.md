# LumiState

LumiState is a read-only scene bridge for Lumiverse. It combines the public state published by LumiWeather, LumiWorld, and LumiMind into one validated, source-aware scene snapshot.

It does not call an AI model, rewrite source-extension data, or read private mind and world-state endpoints.

## What it connects

| Extension | Shared contribution |
| --- | --- |
| LumiWeather 1.3.1+ | Visible scene location, date, time, and weather |
| LumiWorld 0.3.2+ | Simulation day, hour, and running status |
| LumiMind 0.1.1+ | Cast identities, aliases, presence, and public stance |

Each source remains authoritative for its own state. LumiState preserves provenance and reports disagreements instead of silently choosing a winner.

## Scene Inspector

The **Scene Inspector** drawer shows:

- Connected, stale, unavailable, mismatched, or missing publishers
- The combined active-chat scene
- A source label on every claim
- Source revisions and update age
- Conflicts between overlapping claims
- Privacy-safe diagnostics with a copy button

Missing extensions are expected and do not break the bridge. LumiState uses whatever compatible publishers are available for the active chat.

## Installation

1. Install or update the source extensions you want to connect.
2. In Lumiverse, open **Extensions** and choose **Install**.
3. Paste this repository URL:

```text
https://github.com/Archkr/Lumiverse-LumiState
```

4. Enable LumiState and grant the `chats` permission.
5. Open a chat, then open **Scene Inspector** from the drawer.

LumiState requires Lumiverse 1.0.6 or newer.

## Public interface

LumiState publishes:

```text
lumi_state.contract.v1
lumi_state.scene.current
```

The aggregate includes `chatId`, `revision`, `schemaVersion`, freshness, timestamps, source status, provenance, and conflict metadata. Consumers must reject a snapshot whose `chatId` does not match their active chat.

Source extensions publish:

```text
lumi_weather.state.current
agent_world.state.current
lumi_mind.state.current
```

The normative wire contract is documented in [docs/lumi-state-v1.md](docs/lumi-state-v1.md), with a JSON Schema in [schema/lumi-state-v1.schema.json](schema/lumi-state-v1.schema.json).

## Privacy

LumiState reads only public, spoiler-safe snapshots registered with `requires: []`.

It does not read or republish:

- LumiMind beliefs, secrets, goals, evidence, or full private minds
- LumiWorld schedules, locations, moods, activity, thoughts, goals, or history
- Chat messages, prompts, credentials, or controller responses

The diagnostics report excludes claim values, actor names, aliases, public stance text, full chat IDs, and full entity IDs.

## Reliability behavior

- Endpoint reads are in-memory and do not trigger generation.
- Wrong-chat snapshots are rejected.
- Unknown schema versions are rejected.
- Older source revisions never overwrite newer aggregate revisions.
- Stale sources remain labeled stale.
- Publisher unloads and reloads are handled automatically.
- A lightweight five-second refresh catches asynchronous LumiMind analysis and LumiWorld clock changes.

## Development

```bash
bun install
bun run typecheck
bun test
bun run build
bun run check:dist
```

Built `dist/` files are committed so Lumiverse can load the extension directly.

LumiState is an independent community extension compatible with Lumiverse. It is not the official Lumiverse provider.
