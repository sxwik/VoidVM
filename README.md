# VoidVM

> Run Linux inside your browser.
> No installs. No cloud VM. No remote desktop.
> Just your browser, WebAssembly, caffeine, and emotional damage.

![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-beta-orange)
![Powered By](https://img.shields.io/badge/powered%20by-v86-black)
![Runtime](https://img.shields.io/badge/runtime-WebAssembly-purple)
![Deployment](https://img.shields.io/badge/deployed%20on-Vercel-black)
![RAM](https://img.shields.io/badge/browser%20RAM-consumed-red)
![Sanity](https://img.shields.io/badge/developer%20sanity-decreasing-darkred)

---

## What is this?

VoidVM is a browser-based virtualization environment built around the `v86` x86 emulator.

The goal was simple:

```txt
"what if a low-end laptop could boot Linux directly inside a browser?"
```

Then the browser started fighting back.

Now the project accidentally became:

* a virtualization experiment
* a WebAssembly runtime battle
* a CDN debugging simulator
* a browser architecture research paper
* and psychological warfare against Chromium

---

## Current State

⚠️ **BETA**

VoidVM is still under active development and currently focused on getting Linux virtualization stable inside browser environments.

Current supported/testing targets:

* Arch Linux
* Damn Small Linux (DSL)
* TinyCore (planned)
* Alpine (planned)
* Tiny11 (experimental)

---

# Features

* Browser-based x86 virtualization
* WebAssembly powered VM runtime
* No installation required
* Works entirely client-side
* Low-end hardware focused
* Virtual networking support
* BIOS + VGA emulation
* Linux ISO boot support
* Snapshot/state restoration experiments
* Vercel deployment support
* PWA-ready architecture

---

# Why this project exists

Because modern browsers are basically operating systems pretending to be document viewers.

If browsers can run:

* games
* IDEs
* 3D engines
* emulators
* rendering pipelines

then technically:

```txt
they should also run Linux.
```

So I tried.

---

# What I learned while building this

This project taught me more about low-level systems than I expected.

Topics I accidentally fell into:

* WebAssembly internals
* x86 emulation
* binary serialization
* ZSTD compression
* ArrayBuffers
* browser memory allocation
* Vercel deployment pipelines
* CDN hotlink protection
* CSP restrictions
* browser security policies
* runtime restoration
* virtual hardware initialization

At some point this stopped being:

```txt
"make Linux run in browser"
```

and became:

```txt
"why does the internet keep corrupting my operating system"
```

---

# The Great UTF-8 Incident

One of the funniest bugs during development:

The Linux VM snapshot (`.zst`) got corrupted because Git/Vercel treated the binary file like UTF-8 text.

The browser then tried restoring:

```txt
corrupted Linux consciousness
```

which resulted in:

```txt
Invalid header: 0xBDBFEF28
```

The bytes:

```txt
EF BF BD
```

are actually the Unicode replacement character (`�`).

Meaning somewhere in the deployment pipeline:

```txt
the internet attempted to "fix" Linux
```

This project has not emotionally recovered since.

---

# Architecture

## Frontend

* React
* Vite
* TypeScript

## Virtualization

* v86
* WebAssembly
* BIOS/VGA emulation

## Deployment

* Vercel

## Runtime Strategy

Current strategy:

* lightweight ISO booting
* CDN streamed assets
* browser-local execution

Future strategy:

* optimized VM snapshots
* worker-thread decompression
* persistent browser storage
* multi-OS runtime switching

---

# Why DSL replaced Arch (temporarily)

Arch Linux snapshot restoration was consuming:

```txt
700MB+ RAM
```

inside Chromium because restoring a VM snapshot means rebuilding:

* guest RAM
* CPU state
* VGA state
* device memory
* machine buffers

inside the browser.

DSL became the temporary testing OS because:

* lighter RAM usage
* smaller ISO
* faster boot
* easier debugging
* less chance of browser death

Arch Linux support is still actively being worked on.

---

# Known Issues

Current known problems:

* fullscreen quirks in iframe environments
* browser memory spikes
* Chromium CSP warnings
* keyboard mapping weirdness
* snapshot restoration instability
* browser main-thread freezing during decompression
* occasional existential crisis

---

# Performance Notes

VoidVM runs locally in your browser.

This is NOT cloud gaming.

Your own computer handles:

* CPU emulation
* rendering
* memory
* filesystem state
* virtualization runtime

Which means:

```txt
your browser becomes the motherboard.
```

---

# Inspiration

This project exists because I genuinely wanted to see:

```txt
how far a browser can be pushed before it starts behaving like an operating system.
```

Turns out:
very far.

---

# Future Plans

* Stable Arch Linux support
* Multi-OS profiles
* Better UI/telemetry
* Worker-thread decompression
* VM save/load states
* Persistent filesystem storage
* Better keyboard/mouse integration
* GPU acceleration experiments
* Browser-native sandboxing research

---

# Final Notes

VoidVM started as:

```txt
"haha imagine running Linux inside browser"
```

Now it has:

* runtime profiles
* deployment pipelines
* CDN asset streaming
* virtualization layers
* binary handling systems
* browser hypervisor behavior

and a developer that now hears the words:

```txt
WASM
CSP
ZSTD
ArrayBuffer
```

with emotional attachment.

---

## License

MIT

---

## Built by

**sxwik / Satwik Bajpai**

Powered by:

* caffeine
* browser abuse
* sleep deprivation
* and Chromium reluctantly cooperating.
