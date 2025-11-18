# readme.md

# Features
- Menu panel *accordions*, *dropdowns* for various settings, *sliders* for volume and reverb, *nav bars* for menu navigation,
a *graph* for displaying the playing song's gain, quality of life features such as light/dark mode and font size, *volume* control,
*reverb, cpm, speed* controls, *badges* to keep user aware of changes made, and the ability to *load and import JSON* settings.

# Quirks & Usage Guidelines
- ### Editor View
Switch between editor view (between processed & unprocessed) with the button to the right of "Viewing", below the header in the top right.
To *edit the song*, please use the unprocessed code box. This allows you to run the previously-processed code whilst making a new song.

- ### Processing Changes
To ensure changes are processed, use the *process* or *proc&play* buttons in the top right. You can see if a song and or setting changes are
not yet processed if there is a "modified" badge appearing on the "controls" menu button.

- ### The Graph
The graph measures *combined gain*; that is, a combination of `gain`, `postgain` and the variable affected by *volume* and applied afterwards to
allow for both gain and postgain to be used by the user, `dry`. The graph will increase its maximum Y value to accomdate rising data.

# Controls
## Audio Controls

- ### Volume
Affects the final volume of each instrument; applied after both "gain" and "postgain".

- ### CPM
Controls the cycles per minute. As per standard, it is divided by four.

- ### Speed
Multiplier on the play speed of the song.

## DJ Controls
- ### Reverb
Applies a reverb affect to the song.
Be careful, as this can be very loud.

## Editor Controls
- ### Theme
Switch between UI themes for usability.

- ### FontSize
Controls the editor (both processed and unprocessed)'s text size.

## Other Control Panel Buttons
- ### Restore Default Settings
Restores settings to *base* settings.

- ### Restore Defauilt Song
Restores the editor(s) to initial load state -- i.e., the example starting song.