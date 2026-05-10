# VoidVM

> Run Linux inside your browser. No cloud VM. No remote desktop. Just your machine, WebAssembly, and a virtual x86 environment.

---

## ⚠️ Current Status

VoidVM is currently in **Beta**.

This project is experimental, unstable in places, and still going through heavy architectural changes. Some VM profiles work better than others, memory usage can spike unexpectedly, and browser limitations are still being explored.

If something breaks:

* the browser might crash
* the VM might freeze
* snapshots might fail
* Chrome might suddenly decide it has suffered enough

That is unfortunately part of building virtualization software inside a browser.

---

# What is VoidVM?

VoidVM is a browser-native virtualization environment built using:

* WebAssembly
* v86 x86 emulation
* React
* Snapshot-based state restoration
* Browser-side storage and runtime management

The goal of this project is simple:

> Make lightweight Linux experimentation accessible directly inside the browser.

No VirtualBox setup.
No dual booting.
No cloud VPS.
No remote machine.

Everything runs locally on the user's own hardware through the browser sandbox.

---

# Why this project exists

This project originally started as a simple experiment:

> “Can I make Linux boot inside a browser?”

That question quickly turned into:

* virtual hardware emulation
* memory management problems
* browser limitations
* VM snapshot restoration
* CDN hotlink protection
* filesystem streaming
* runtime crashes
* state compatibility issues
* Chrome running out of memory at 3 AM

At some point it stopped feeling like frontend development and started feeling more like emulator engineering.

The biggest realization during development was:

> The browser is only the interface.
> The user's own PC becomes the actual host machine.

VoidVM does not stream video from a server.
It does not use cloud virtualization.
The browser itself becomes the runtime environment.

---

# Main Goal

VoidVM is not trying to replace a real desktop hypervisor.

The goal is:

* lightweight experimentation
* low-end hardware accessibility
* educational Linux environments
* portable virtual workspaces
* fast browser-native virtualization

The project is intentionally focused on:

* low memory usage
* fast startup
* browser compatibility
* minimal setup friction

A large part of the project philosophy is:

> If a browser can already consume 800MB of RAM for a video tab, it should also be capable of running useful software environments.

---

# Current Features

## Browser-native x86 virtualization

VoidVM uses the v86 emulator runtime compiled with WebAssembly to emulate:

* CPU
* RAM
* VGA hardware
* BIOS
* IDE controllers
* network devices
* virtual disks

inside the browser sandbox.

---

## Snapshot-based VM restoration

Instead of cold-booting an operating system every launch, VoidVM can restore prebuilt machine states.

This massively improves:

* startup speed
* responsiveness
* memory efficiency
* usability on weaker systems

The VM environment effectively resumes from a serialized machine state instead of reinitializing an entire operating system from scratch.

---

## Arch Linux support

VoidVM currently experiments with browser-native Arch Linux environments.

This implementation uses:

* compressed VM snapshots
* 9P filesystem streaming
* virtual network devices
* browser-based persistence

to avoid forcing users to download giant multi-gigabyte images.

Instead of shipping a full traditional VM image, the runtime attempts to stream only what is required.

---

## IndexedDB persistence

Machine states can be persisted directly inside the browser using IndexedDB.

This allows:

* restoring sessions
* saving runtime states
* persistent experimentation
* local VM continuity

without requiring backend infrastructure.

---

# Project Structure

The codebase is separated into multiple layers because browser virtualization becomes chaotic extremely quickly without separation.

## Runtime Layer

Handles:

* v86 initialization
* hardware configuration
* snapshot loading
* memory allocation
* device initialization
* VM lifecycle management

Main file:

```txt
src/hooks/useV86.ts
```

This file became the center of most debugging during development.

---

## UI Layer

Responsible for:

* VM controls
* workspace rendering
* runtime telemetry
* virtualization interface
* emulator display containers

Main files:

```txt
src/components/
```

The interface intentionally avoids modern SaaS aesthetics.

The goal was to make the software feel more like:

* workstation tooling
* emulator software
* virtualization utilities
* old VM environments

instead of another AI-generated landing page.

---

## Storage / Asset Layer

Responsible for:

* BIOS assets
* WASM runtime files
* VM snapshots
* disk images
* Linux boot resources

Main folders:

```txt
public/bios/
public/states/
public/images/
```

---

# The weird problems this project caused

VoidVM introduced problems that normally do not appear in traditional frontend development.

Some examples:

---

## IDE Controller State Mismatch

One of the largest bugs came from restoring VM snapshots created with different virtual hardware layouts.

A saved Arch Linux machine state expected a secondary IDE controller to exist because the original environment included a CD-ROM device.

After removing the CD-ROM from the runtime configuration, snapshot restoration started crashing with:

```txt
Cannot read properties of undefined (reading 'secondary')
```

The eventual solution was hilariously low-level:

A dummy zero-byte CD-ROM device had to be allocated purely so v86 would reconstruct the expected virtual hardware topology before state restoration.

That was the moment this project officially stopped feeling normal.

---

## CDN Hotlink Protection

Another issue involved BunnyCDN rejecting VM snapshot requests.

Even though CORS headers were technically enabled, the CDN still blocked requests because the browser origin and referer did not match the expected copy.sh domain.

A custom proxy layer had to:

* strip origin headers
* rewrite referer headers
* impersonate allowed origins

just to retrieve compressed VM state snapshots.

---

## Browser Memory Explosions

At one point Chrome crashed entirely with:

```txt
Aw, Snap! Out of Memory
```

because compressed VM states expand dramatically during runtime restoration.

A 15MB compressed snapshot does NOT mean 15MB runtime usage.

The browser temporarily allocates:

* decompression buffers
* emulator memory
* VRAM
* serialized hardware state
* duplicated ArrayBuffers

which can spiral quickly.

---

# Why VoidVM looks the way it does

The UI intentionally moved away from:

* oversized rounded cards
* floating SaaS dashboards
* excessive gradients
* AI startup design trends

The interface was redesigned to resemble:

* old virtualization software
* workstation tooling
* industrial runtime environments
* emulator frontends

because once the software actually started functioning, cleaner “startup-style” designs felt fake and disconnected from what the project really was.

---

# Current Limitations

VoidVM is still heavily experimental.

Known limitations include:

* high memory usage under heavy loads
* browser instability with large snapshots
* incomplete hardware emulation
* limited acceleration
* unstable filesystem streaming
* browser-specific behavior differences
* runtime crashes during aggressive state restoration

Some operating systems simply are not realistic yet inside a browser-only environment.

---

# Future Goals

Potential future areas:

* better snapshot management
* safer memory allocation
* improved filesystem streaming
* faster startup
* more stable persistence
* offline support
* progressive web app support
* cleaner runtime architecture
* lightweight Linux environments for weak hardware

The long-term goal is not to become another cloud desktop.

The goal is to explore what modern browsers are actually capable of when treated more like operating system runtimes instead of document viewers.

---

# Final Notes

VoidVM is still rough.

A lot of this project was built through experimentation, failure, browser crashes, broken snapshots, emulator debugging, and trial-and-error architecture decisions.

But watching an actual Linux environment boot inside a browser tab after hours of debugging felt genuinely surreal.

If you somehow found this repository:

Welcome to the chaos.

