# VoidVM

<div align="center">

![VoidVM Banner](https://img.shields.io/badge/VoidVM-Beta-111111?style=for-the-badge\&logo=virtualbox\&logoColor=white)
![WebAssembly](https://img.shields.io/badge/WebAssembly-x86_Runtime-654FF0?style=for-the-badge\&logo=webassembly\&logoColor=white)
![Arch Linux](https://img.shields.io/badge/Arch_Linux-Browser_Native-1793D1?style=for-the-badge\&logo=archlinux\&logoColor=white)
![Status](https://img.shields.io/badge/status-chaotically_stable-0f172a?style=for-the-badge)
![Powered By](https://img.shields.io/badge/powered_by-v86_&_sleep_deprivation-black?style=for-the-badge)

### Run Linux inside your browser.

### No cloud VM. No remote desktop. Just your machine, WebAssembly, and a virtual x86 environment.

</div>

---

#  BETA STATUS

VoidVM is currently in **Beta**.

And by beta I mean:

* sometimes it works beautifully
* sometimes Chrome enters cardiac arrest
* sometimes snapshots restore perfectly
* sometimes the browser suddenly consumes enough RAM to contact NASA

This project is still experimental.

There WILL be:

* runtime crashes
* broken snapshots
* browser instability
* weird emulator bugs
* random VM behavior
* moments where you stare at a single error for 3 hours straight

That is unfortunately part of building a virtual machine inside a browser.

---

# What even is VoidVM?

VoidVM is a browser-native virtualization environment built using:

* WebAssembly
* v86 x86 emulation
* React
* Snapshot-based VM restoration
* Browser-side persistence
* Questionable levels of caffeine

The original idea was incredibly simple:

> “Can I run Linux inside a browser?”

The problem is that question accidentally opened a portal into:

* emulator engineering
* memory management hell
* browser limitations
* VM state restoration
* filesystem streaming
* binary snapshot debugging
* IDE controller topology mismatches
* CDN hotlink protection
* Chrome tabs dying heroic deaths

At some point this stopped feeling like frontend development.

Now it feels more like convincing a browser to become a tiny hypervisor.

---

# The Main Philosophy

VoidVM does NOT:

* stream a desktop from a server
* run on cloud compute
* use remote virtualization
* fake screenshots pretending to be a VM

Everything runs:

```txt
Your CPU
↓
Browser
↓
WebAssembly Runtime
↓
v86 Emulator
↓
Virtual Hardware
↓
Linux Environment
```

The browser becomes the runtime.
The user's own PC becomes the host machine.

That realization completely changed the direction of the project.

---

# Why this project exists

Because modern browsers are absurdly powerful.

If a browser tab can consume:

```txt
800MB RAM
for a single YouTube video
```

then it should also be capable of:

```txt
running actual software environments
```

VoidVM focuses on:

* lightweight experimentation
* low-end hardware accessibility
* portable Linux environments
* browser-native virtualization
* reducing setup friction

The goal is NOT replacing VMware.

The goal is making experimentation accessible.

---

# Current Features

##  Browser-native x86 Virtualization

VoidVM emulates:

* CPU
* RAM
* VGA
* BIOS
* IDE controllers
* virtual disks
* network hardware

entirely inside the browser sandbox.

No kernel drivers.
No system-level hypervisor.
No native installation.

---

##  Snapshot-Based VM Restoration

Instead of cold booting Linux every launch:

```txt
BIOS
→ kernel
→ init
→ userspace
→ suffering
```

VoidVM restores serialized machine states.

This massively improves:

* startup speed
* responsiveness
* usability
* low-end compatibility

The VM resumes instead of rebooting.

---

##  Arch Linux inside Browser

Yes.
Actual Arch Linux.
Inside Chrome.

This implementation currently experiments with:

* compressed VM snapshots
* 9P filesystem streaming
* virtual network devices
* IndexedDB persistence

Instead of forcing users to download multi-gigabyte VM images, the runtime attempts to stream only what it needs.

Which sounds cool until you spend 4 hours debugging a virtual IDE controller.

---

##  IndexedDB Persistence

Machine states can persist directly inside the browser.

This allows:

* restoring sessions
* persistent experimentation
* runtime continuity
* local VM state saving

without needing backend infrastructure.

---

# Project Structure

The codebase is intentionally separated because browser virtualization becomes spaghetti code almost immediately.

## Runtime Layer

Handles:

* v86 initialization
* hardware configuration
* snapshot loading
* memory allocation
* emulator lifecycle management
* runtime restoration

Main runtime file:

```txt
src/hooks/useV86.ts
```

This file became the emotional support zone for most debugging.

---

## UI Layer

Responsible for:

* VM controls
* runtime telemetry
* display rendering
* emulator workspace management

Main folders:

```txt
src/components/
```

The UI intentionally avoids modern startup aesthetics.

It was redesigned to feel more like:

* workstation tooling
* emulator software
* industrial virtualization environments
* old VM interfaces

instead of another glowing AI SaaS landing page.

---

## Storage / Asset Layer

Responsible for:

* BIOS assets
* WASM runtimes
* VM snapshots
* Linux boot resources
* virtual disk assets

Main folders:

```txt
public/bios/
public/states/
public/images/
```

---

# The Bugs That Almost Ended Me

## ☠️ IDE Controller Topology Mismatch

One of the worst bugs came from restoring VM states created with different virtual hardware layouts.

A saved Arch snapshot expected a secondary IDE controller because the original machine state included a CD-ROM device.

After removing the CD-ROM from the runtime config:

```txt
Cannot read properties of undefined (reading 'secondary')
```

started appearing everywhere.

The eventual solution?

Allocating a completely fake zero-byte CD-ROM device purely to force v86 into reconstructing the expected hardware topology before restoring the snapshot.

That was the moment this project officially left reality.

---

## ☠️ CDN Hotlink Protection vs Human Sanity

Another issue involved BunnyCDN rejecting VM snapshots with:

```txt
403 Forbidden
```

Even though CORS technically existed.

Turns out the CDN was checking:

* Origin
* Referer

and rejecting anything that wasn't copy.sh.

The fix involved:

* proxy rewriting
* header stripping
* origin impersonation
* convincing the CDN the request came from itself

Normal frontend development activities.

---

## ☠️ Chrome Out Of Memory

At one point Chrome fully crashed with:

```txt
Aw, Snap! Out of Memory
```

because compressed VM snapshots expand violently during runtime restoration.

A 15MB compressed state does NOT mean 15MB runtime memory.

During restoration the browser temporarily allocates:

* decompression buffers
* emulator RAM
* VRAM
* duplicated ArrayBuffers
* serialized hardware state

Chrome eventually decided the experiment had gone too far.

---

# Why VoidVM looks like old VM software

Because once the project actually started functioning:

* giant rounded cards
* startup gradients
* floating SaaS panels
* fake AI aesthetics

felt completely wrong.

The interface evolved into something closer to:

* Oracle VM
* old workstation tooling
* emulator frontends
* industrial runtime software

because that aesthetic actually matched what the project had become.

---

# Current Limitations

VoidVM is still heavily experimental.

Known limitations include:

* high memory usage
* unstable snapshot restoration
* browser-specific runtime behavior
* incomplete hardware emulation
* filesystem instability
* occasional crashes
* Chrome emotional breakdowns

Some operating systems simply are not realistic yet in a browser-only environment.

---

# Future Goals

Potential future directions:

* safer snapshot systems
* runtime profiling
* memory optimization
* faster startup
* improved persistence
* better filesystem streaming
* offline support
* progressive web app integration
* lightweight Linux environments for weak hardware

The long-term goal is not:

> “another cloud desktop platform.”

The goal is:

> exploring what browsers become when treated more like operating system runtimes instead of document viewers.

---

# Final Notes

VoidVM was built through:

* experimentation
* broken snapshots
* browser crashes
* runtime debugging
* emulator archaeology
* memory disasters
* caffeine
* more caffeine
* even more caffeine

But eventually:

```txt
root@localhost
```

appeared inside a browser tab.

And honestly?

That felt completely surreal.

If you somehow found this repository:

Welcome to the chaos.
