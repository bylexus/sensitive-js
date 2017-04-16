export const centerGameObjects = (objects) => {
    objects.forEach(function(object) {
        object.anchor.setTo(0.5);
    });
};

export const centerSpriteOnPoint = (sprite, x, y) => {
    let newX = Math.floor(x-sprite.width / 2);
    let newY = Math.floor(y-sprite.height / 2);
    if (sprite.body) {
        sprite.body.x = newX;
        sprite.body.y = newY;
    }
    sprite.x = newX;
    sprite.y = newY;
};

