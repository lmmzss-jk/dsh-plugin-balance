# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-08-14

### Fixed

- README install command now uses the scoped package name `@lmmzss/dsh-plugin-balance`.

## [0.1.0] - 2026-08-14

### Added

- First public release as `@lmmzss/dsh-plugin-balance`.
- Header balance button (left of the native Session log button).
- Dropdown with account balance (total / topped-up / granted, availability status).
- Live per-session usage: model, input (cache miss/hit), cache write, output tokens,
  cache hit rate with progress bar.
- Official-rate cost estimates, auto-synced from the official DeepSeek pricing page
  every 6 hours (ETag conditional fetch), with peak/off-peak schedule auto-switch.
- Auto-hides while the settings page is open.
- Zero npm dependencies (helpers inlined) for reliable pnpm installs.
- Chinese/English UI auto-detection.
