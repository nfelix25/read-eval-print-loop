## ADDED Requirements

### Requirement: Web app manifest
The app SHALL include a web app manifest defining the app name, short name, icons, theme color, background color, and display mode.

#### Scenario: Manifest present
- **WHEN** browser requests the manifest
- **THEN** a valid manifest.json is served with name, icons, and display: standalone

### Requirement: Standalone display mode
The app SHALL open in standalone mode when launched from the home screen, with no browser chrome (no URL bar, no navigation buttons).

#### Scenario: Standalone on launch
- **WHEN** user opens the app from the Android home screen icon
- **THEN** the app fills the screen with no browser navigation UI visible

### Requirement: Home screen installability
The app SHALL be installable to the Android home screen via Chrome and to the iOS home screen via Safari.

#### Scenario: Android install prompt
- **WHEN** user visits the app in Chrome on Android
- **THEN** Chrome offers an "Add to Home Screen" install prompt

#### Scenario: iOS add to home screen
- **WHEN** user uses Safari's share menu on iOS
- **THEN** "Add to Home Screen" is available and installs the app with the correct icon and name

### Requirement: App shell caching
The service worker SHALL precache all static assets (HTML, JS, CSS, fonts, icons) so the app shell loads instantly on subsequent visits.

#### Scenario: Instant load after first visit
- **WHEN** user opens the app for the second or later time
- **THEN** the editor is visible within 1 second regardless of network conditions

#### Scenario: App shell loads without network
- **WHEN** user opens the app with no network connection
- **THEN** the app shell loads and the editor is usable (execution requiring network will show an appropriate error)

### Requirement: HTTPS deployment
The app SHALL be served over HTTPS to satisfy PWA installation requirements.

#### Scenario: Served over HTTPS
- **WHEN** user navigates to the app URL
- **THEN** the connection is HTTPS and no mixed-content warnings appear
