/*
Class represents the main ship user is controlling
*/
class Ship
{
    constructor(fix_start, init_energy, init_supp, init_creds, map_size)
    {
        this.health = false;
        this.sizeX = 50;
        this.sizeY = 50;
        this.posX = gameVars.startX; //Math.floor(Math.random() * 127); ->uncomment when random start
        this.posY = gameVars.startY; //Math.floor(Math.random() * 127); ->uncomment when random start
        this.delayMove = 150;

        this.map_size = map_size;
        this.energy = init_energy;
        this.supplies = init_supp;
        this.credits = init_creds;

        // Modified from random to fixed per documentation.
        if(!fix_start)
        {
            this.posX = 1;
            this.posY = 0;
        }
    }

    /*
    Helper function to copy the ship from passed ship object -> used when we Load the game
    */
    copyShip(obj)
    {
        this.health = obj.health;
        this.sizeX = obj.sizeX;
        this.sizeY = obj.sizeY;
        this.posX = obj.posX;
        this.posY = obj.posY;
        this.delayMove = 500;
        this.energy = obj.energy;
        this.supplies = obj.supplies;
        this.credits = obj.credits;
    }

    /*
    Helper function that moves the ship to new coordinates
    */
    move(x, y)
    {
        this.posX = x;
        this.posY = y;
    }

    /*
    this argument should be an object {angle: ?, magnitude: ?}
    */
    calculateXY(userInput)
    {
      var convertedAngle = (userInput.angle * (Math.PI/180))

      var coords = {x: Math.round(Math.cos(convertedAngle)*userInput.magnitude),
                    y: Math.round(-(Math.sin(convertedAngle)*userInput.magnitude))};
      return coords;
    }

    /*
    Added for sensor to be able to reduce supplies.
    */
    consume_supplies(percentage)
    {
        this.supplies -= this.supplies * percentage;
    }
}
