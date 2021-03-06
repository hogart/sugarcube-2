<!-- ***************************************************************************
	AudioRunner API
**************************************************************************** -->
<h1 id="audiorunner-api"><code>AudioRunner</code> API</h1>

Audio runners are useful for performing actions on multiple tracks at once.

See the other audio APIs for additional information: [`SimpleAudio` API](#simpleaudio-api), [`AudioTrack` API](#audiotrack-api), [`AudioList` API](#audiolist-api).

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-fade"></span>
### `<AudioRunner>.fade(duration , toVol [, fromVol])`

Starts playback of the selected tracks and fades them between the specified starting and destination volume levels over the specified number of seconds.

#### Since:

* `v2.28.0`

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`toVol`:** (*number*) The destination volume level.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Example:

```
// Fade the selected tracks from volume 0 to 1 over 6 seconds.
someTracks.fade(6, 1, 0);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-fadein"></span>
### `<AudioRunner>.fadeIn(duration [, fromVol])`

Starts playback of the selected tracks and fades them from the specified volume level to `1` (loudest) over the specified number of seconds.

#### Since:

* `v2.28.0`

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Example:

```
// Fade the selected tracks in from volume 0 over 5 seconds.
someTracks.fadeIn(5, 0);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-fadeout"></span>
### `<AudioRunner>.fadeOut(duration [, fromVol])`

Starts playback of the selected tracks and fades them from the specified volume level to `0` (silent) over the specified number of seconds.

#### Since:

* `v2.28.0`

#### Parameters:

* **`duration`:** (*number*) The number of seconds over which the tracks should be faded.
* **`fromVol`:** (optional, *number*) The starting volume level.  If omitted, defaults to the tracks' current volume level.

#### Example:

```
// Fade the selected tracks out from volume 1 over 8 seconds.
someTracks.fadeOut(8, 1);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-fadestop"></span>
### `<AudioRunner>.fadeStop()`

Interrupts an in-progress fade of the selected tracks, or does nothing if no fade is progressing.

**NOTE:** This does not alter the volume level.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.fadeStop();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-load"></span>
### `<AudioRunner>.load()`

Pauses playback of the selected tracks and, if they're not already in the process of loading, forces them to drop any existing data and begin loading.

**NOTE:** This *should not* be done lightly if your audio sources are on the network, as it forces the player to begin downloading them.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.load();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-loop"></span>
### `<AudioRunner>.loop(state)` → *`AudioRunner` object*

Sets the selected tracks' repeating playback state (default: `false`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (*boolean*) The loop state.

#### Example:

```
// Loop the selected tracks.
someTracks.loop(true);

// Unloop the selected tracks.
someTracks.loop(false);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-mute"></span>
### `<AudioRunner>.mute(state)` → *`AudioRunner` object*

Sets the selected tracks' volume mute state (default: `false`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`state`:** (*boolean*) The mute state.

#### Example:

```
// Mute the selected tracks' volume.
someTracks.mute(true);

// Unmute the selected tracks' volume.
someTracks.mute(false);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-off"></span>
### `<AudioRunner>.off(...args)` → *`AudioRunner` object*

Removes event handlers from the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

**NOTE:** Shorthand for [jQuery's `.off()` method](http://api.jquery.com/off/) applied to each of the audio elements.

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

**SEE:** [`<jQuery>.off()`](http://api.jquery.com/off/) in the jQuery API docs for more information.

#### Example:

```
// Remove any handlers for the ended event.
someTracks.off('ended.myEvents');
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-on"></span>
### `<AudioRunner>.on(...args)` → *`AudioRunner` object*

Attaches event handlers to the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

**NOTE:** Shorthand for [jQuery's `.on()` method](http://api.jquery.com/on/) applied to each of the audio elements.

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

**SEE:** [`<jQuery>.on()`](http://api.jquery.com/on/) in the jQuery API docs for more information.

#### Example:

```
// Add a handler for the ended event.
someTracks.on('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-one"></span>
### `<AudioRunner>.one(...args)` → *`AudioRunner` object*

Attaches single-use event handlers to the selected tracks.  Returns a reference to the current `AudioRunner` instance for chaining.

**NOTE:** Shorthand for [jQuery's `.one()` method](http://api.jquery.com/one/) applied to each of the audio elements.

<p role="note" class="warning"><b>Warning:</b>
The <code>SimpleAudio</code> APIs use events internally for various pieces of functionality.  To prevent conflicts, it is <strong><em>strongly</em></strong> suggested that you specify a custom user namespace—e.g., <code>.myEvents</code>—when attaching your own handlers.  It is further <strong><em>strongly</em></strong> suggested that you provide that same custom user namespace when removing them.
</p>

#### Since:

* `v2.28.0`

#### Parameters:

**SEE:** [`<jQuery>.one()`](http://api.jquery.com/one/) in the jQuery API docs for more information.

#### Example:

```
// Add a single-use handler for the ended event.
someTracks.one('ended.myEvents', function () {
	/* do something */
});
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-pause"></span>
### `<AudioRunner>.pause()`

Pauses playback of the selected tracks.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.pause();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-play"></span>
### `<AudioRunner>.play()`

Begins playback of the selected tracks.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.play();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-playwhenallowed"></span>
### `<AudioRunner>.playWhenAllowed()`

Begins playback of the selected tracks or, failing that, sets the tracks to begin playback as soon as the player has interacted with the document.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.playWhenAllowed();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-stop"></span>
### `<AudioRunner>.stop()`

Stops playback of the selected tracks.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTrack.stop();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-time"></span>
### `<AudioRunner>.time(seconds)` → *`AudioRunner` object*

Sets the selected tracks' current time in seconds.  Returns a reference to the current `AudioRunner` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`seconds`:** (*number*) The time to set.  Valid values are floating-point numbers in the range `0` (start) to the maximum duration—e.g., `60` is `60` is sixty seconds in, `90.5` is ninety-point-five seconds in.

#### Example:

```
// Set the selected tracks' current time to 30 seconds from their beginning.
someTracks.time(30);
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-unload"></span>
### `<AudioRunner>.unload()`

Stops playback of the selected tracks and forces them to drop any existing data.

**NOTE:** Once unloaded, playback cannot occur until the selected tracks' data is loaded again.

#### Since:

* `v2.28.0`

#### Parameters: *none*

#### Example:

```
someTracks.unload();
```

<!-- *********************************************************************** -->

<span id="audiorunner-api-prototype-method-volume"></span>
### `<AudioRunner>.volume(level)` → *`AudioRunner` object*

Sets the selected tracks' volume level (default: `1`).  Returns a reference to the current `AudioRunner` instance for chaining.

#### Since:

* `v2.28.0`

#### Parameters:

* **`level`:** (*number*) The volume level to set.  Valid values are floating-point numbers in the range `0` (silent) to `1` (loudest)—e.g., `0` is 0%, `0.5` is 50%, `1` is 100%.

#### Example:

```
// Set the selected tracks' volume level to 75%.
someTracks.volume(0.75);
```
