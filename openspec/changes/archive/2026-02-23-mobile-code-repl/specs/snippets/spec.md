## ADDED Requirements

### Requirement: Save snippet
The user SHALL be able to save the current editor content as a named snippet associated with the current language.

#### Scenario: Save with name
- **WHEN** user taps Save and provides a name
- **THEN** the snippet is stored in localStorage with its name, language, and content

#### Scenario: Overwrite existing snippet
- **WHEN** user saves with a name that already exists
- **THEN** the user is prompted to confirm overwrite before the snippet is updated

### Requirement: Load snippet
The user SHALL be able to load a saved snippet into the editor.

#### Scenario: Load replaces editor content
- **WHEN** user selects a snippet from the snippet list
- **THEN** the editor content is replaced with the snippet's code and the language switches to match the snippet's language

### Requirement: Delete snippet
The user SHALL be able to delete a saved snippet.

#### Scenario: Delete removes from list
- **WHEN** user deletes a snippet
- **THEN** the snippet is removed from the list and from localStorage

### Requirement: Snippet list
The app SHALL display a list of all saved snippets, showing each snippet's name and language.

#### Scenario: List shows all snippets
- **WHEN** user opens the snippet panel
- **THEN** all saved snippets are listed with their name and language label

#### Scenario: Empty state
- **WHEN** no snippets have been saved
- **THEN** the snippet list shows a message indicating no snippets are saved yet

### Requirement: Snippet persistence
Snippets SHALL persist across browser sessions using localStorage.

#### Scenario: Snippets survive reload
- **WHEN** user saves a snippet and then reloads the app
- **THEN** the saved snippet is still present in the snippet list
