# SOS Command Center (React Native)

Expo-powered port of the SOS Flutter application, featuring bilingual command center flows, SOS escalation, and resource intelligence.

## Requirements
- Node.js 18+
- Expo CLI (installed automatically via `npx`)
- iOS Simulator, Android Emulator, or Expo Go on a physical device

## Getting started
```bash
npm install
npm run start
```

Run a specific platform:

```bash
npm run android
npm run ios
npm run web
```

If Metro caches stale assets:

```bash
npm run start:clear
```

When the Metro bundler starts, scan the QR code with Expo Go (mobile) or press `a` / `i` to launch the Android/iOS simulator.

## Available flows
- **Mock Auth**: Tap "Continue" on the login gate to enter the command center.
- **Tabs**: NGO, Social, Home/SOS, Resources, Revelation—each mirrors the Flutter layout with shared gradients and typography.
- **SOS actions**: SOS and media upload buttons on Home, plus the Revelation submission CTA, navigate to the shared confirmation scene.
- **Profile stack**: Language toggle lives in the header; profile button opens nested screens (overview, contributions, distress history).

## Localization & theming
- Strings live in `src/localization/strings.js`; toggle languages via the header switch.
- Color/spacing tokens: `src/theme/colors.js`, `src/theme/metrics.js`.
- Typography auto-switches between Poppins (EN) and Noto Sans Devanagari (HI) using `src/theme/typography.js`.

## Troubleshooting
- Run `npm run doctor` to validate dependencies.
- Use `Ctrl+C` to stop the dev server.
