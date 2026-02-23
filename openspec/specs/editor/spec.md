## ADDED Requirements

### Requirement: Language selection
The app SHALL provide a language picker allowing the user to switch between supported languages: JavaScript, TypeScript, Python, SQL, Rust, C, C++, Zig, and WAT (WebAssembly Text).

#### Scenario: Switch language
- **WHEN** user selects a language from the picker
- **THEN** the editor updates its syntax highlighting and completion rules to match the selected language

#### Scenario: Language persists on reload
- **WHEN** user reloads the app
- **THEN** the previously selected language is restored

### Requirement: Syntax highlighting
The editor SHALL display syntax highlighting appropriate for the currently selected language.

#### Scenario: Highlighting visible
- **WHEN** user types code in the editor
- **THEN** keywords, strings, comments, and identifiers are visually distinguished by color

### Requirement: Auto-indentation
The editor SHALL automatically indent new lines based on the language's indentation rules.

#### Scenario: Enter after open brace
- **WHEN** user presses Enter after an opening brace or block keyword
- **THEN** the new line is indented one level deeper

### Requirement: Bracket matching
The editor SHALL highlight matching brackets, parentheses, and braces when the cursor is adjacent to one.

#### Scenario: Cursor on bracket
- **WHEN** user positions cursor next to an opening or closing bracket
- **THEN** both the opening and closing bracket are highlighted

### Requirement: Basic auto-completion
The editor SHALL offer auto-completion suggestions for language keywords and common identifiers.

#### Scenario: Completion triggered
- **WHEN** user types the beginning of a keyword or identifier
- **THEN** a dropdown of completions appears

#### Scenario: Completion accepted
- **WHEN** user selects a completion from the dropdown
- **THEN** the editor inserts the completed text

### Requirement: Undo and redo
The editor SHALL support undo and redo of editing actions.

#### Scenario: Undo
- **WHEN** user triggers undo (gesture or keyboard shortcut)
- **THEN** the last edit is reversed

#### Scenario: Redo
- **WHEN** user triggers redo after an undo
- **THEN** the undone edit is reapplied

### Requirement: Mobile-optimized layout
The editor SHALL occupy the primary screen area and be usable with a touch keyboard on a phone-sized screen.

#### Scenario: No horizontal overflow
- **WHEN** user views the app on a 375px-wide screen
- **THEN** the editor does not overflow horizontally and is fully usable

#### Scenario: Virtual keyboard does not obscure output
- **WHEN** the virtual keyboard is open
- **THEN** the output panel remains accessible by scrolling
