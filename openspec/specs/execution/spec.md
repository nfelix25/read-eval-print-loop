## ADDED Requirements

### Requirement: Run action
The app SHALL provide a Run button that executes the current editor content in the selected language.

#### Scenario: Run button triggers execution
- **WHEN** user taps the Run button
- **THEN** the current editor content is executed and the output panel is updated

#### Scenario: Loading state during execution
- **WHEN** execution is in progress
- **THEN** the Run button is disabled and a loading indicator is shown

### Requirement: JavaScript execution
JavaScript code SHALL be executed in a sandboxed iframe within the browser. Console output (console.log, console.error, etc.) SHALL be captured and displayed.

#### Scenario: console.log output
- **WHEN** user runs JavaScript that calls console.log
- **THEN** the logged value appears in the output panel

#### Scenario: Runtime error displayed
- **WHEN** user runs JavaScript that throws an error
- **THEN** the error message and type appear in the output panel

#### Scenario: Infinite loop protection
- **WHEN** user runs JavaScript that does not terminate within 5 seconds
- **THEN** the iframe is terminated and a timeout message is displayed

### Requirement: SQL execution
SQL code SHALL be executed against a persistent in-memory SQLite database using sql.js. The database state SHALL persist across executions within the same session.

#### Scenario: SELECT query returns results
- **WHEN** user runs a SELECT query
- **THEN** the result rows are displayed in a tabular format in the output panel

#### Scenario: Schema persists across runs
- **WHEN** user runs CREATE TABLE in one execution and INSERT in a subsequent execution
- **THEN** the inserted rows are accessible

#### Scenario: SQL error displayed
- **WHEN** user runs invalid SQL
- **THEN** the SQL error message is shown in the output panel

#### Scenario: Database reset
- **WHEN** user triggers a database reset action
- **THEN** the in-memory database is cleared to an empty state

### Requirement: Remote execution via Piston
Python, TypeScript, Rust, C, C++, and Zig code SHALL be sent to the Piston public API for execution. Stdout and stderr SHALL be captured and displayed.

#### Scenario: Successful execution output
- **WHEN** user runs code in a Piston-supported language that prints to stdout
- **THEN** the stdout output appears in the output panel

#### Scenario: Compilation error displayed
- **WHEN** user runs code that fails to compile
- **THEN** the compiler error message appears in the output panel

#### Scenario: Piston API error
- **WHEN** the Piston API is unavailable or returns an error
- **THEN** a clear error message is shown explaining that remote execution failed

### Requirement: Output panel
The app SHALL display an output panel below the editor showing the result of the most recent execution.

#### Scenario: Output cleared on new run
- **WHEN** user triggers a new execution
- **THEN** the previous output is cleared before the new output appears

#### Scenario: Stderr visually distinguished
- **WHEN** execution produces stderr output
- **THEN** stderr lines are visually distinguished from stdout (e.g., different color)
