SensitiveJS
===========

> A remake of the good-old C64 game "Sensitive", in JavaScript, using the Phaser Game framework.

Sensitive (1991 Oliver Kirva, see http://www.lemon64.com/?game_id=2258) was a game I played for weeks and months with great enthusiasm.
Finally I got the nerve to create a remake, using web technologies (Phaser IO, the famous game framework). This is an ongoing work in progress.

Screens
--------

### SensitiveJS remake

![Remake](screen-remake.png)

### Original from 1990

![Original](screen-original.png)


Architecture notes
-------------------

### Game Layout

```
+---------------------------------------------------------+
|   Screen Dimension: 800x520                             |
|                                                         |
|    Title / Score   (Height: 120)                        |
|                                                         |
+---------------------------------------------------------+
|                                                         |
|                                                         |
|                                                         |
|                                                         |
|                Play field: 20x10 stones                 |
|                Stone size: 40                           |
|                                                         |
|                                                         |
+---------------------------------------------------------+
```


TODO
-------

* Teleporters (with Object pairs)
* Kid's levels (easier)
* Level pages (selectabe levels, already played levels stored in locaStorage (hashed))
  * level infos (e.g. id, title) in info.js
  * stored in localStorage (id hashed)
* store progress in localStorage
* soundtrack
* Virtual Joystick for mobile users

Copyright Violations
--------------------

Attention: At the moment, I didn't check copyright of the game assets! This is a known issue I have to resolve.
