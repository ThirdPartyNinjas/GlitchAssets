GlitchAssets
============
This is a straight-forward conversion of the flash assets files from the game Glitch, which were released into the public domain.

See [http://www.glitchthegame.com/public-domain-game-art/]{http://www.glitchthegame.com/public-domain-game-art/} for more information.

The repository contains:
Avatars - Vanity
Avatars - Wardrobes
Items
Locations
Overlays
Player Houses

It does not contain:
Inhabitants

The exported Inhabitants folder is enormous, and I will upload it to another repo.

Conversion process:
I wrote three scripts that run inside of Flash (I used Adobe Flash Professional CC).

RecursiveExportFile - Recursively searches through folders looking for *.fla files, and calls exportPNG on them. This works well for basic files, but if there's any animation, it will be lost.

RecursiveExportPieces - This one searches through each flash file for individual components, exports those individually. Movie clips are exported as png sequences. This one will dump everything out, sometimes getting way too much data.

RecursiveExportPiecesFlat - Same as "Pieces" but it doesn't export sequences. This means some data will be lost, but it's a better choice for some of the data. I decided experimentally which one was better.
