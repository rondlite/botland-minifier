/*

MIT License

Copyright (c) 2018 Pnoexz (a.k.a. PlayingWithScissors)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/**  
    This attack script is pretty fun, but rather useless against most defenses. I have
    managed to beat some strong defenses I hadn't been able to beat before (admArt). The
    biggest issue with this script is that it runs out of ticks, so you might want to 
    tune up the numbers. Some undocumented important values to keep in mind (confirmed
    by Adam on discord):
        * Bots have 2000 hitpoints/life.
        * Each phase is 3000 ticks across all bots, this means larger computers 

    Loadout:
        * Lasers 3
        * Repair 2
        * Teleport 2

    @version 1.0.0
    @todo:
        * Move more logic to separate function. Specially the part only for lasers
        * Document ~more~
        * Rename some functions
        * Make a git repo
        * Review deltaX and deltaY part
        * Test target selection
        * Test other weapons
        * Change 1999 to 2000
*/
init = function () {
    setAttackPriority(BOT_CPU_CHIP);

    healthToStopRepairing = 100;
    healthToRunAway = 70;
    lastLife=0;
    enemyDistanceToTeleportAway = 1;
     self=getEntityAt(x,y);
     resetAlarm=false;  
         if(exists(sharedE)) array1=sharedE;
      else{
       array1[0]=null;array2[1]=null;array1[2]=null;array1[3]=null;array1[4]=null;array1[5]=null;array1[6]=null;array1[7]=null;array1[8]=null;array1[9]=null;array1[10]=null;array1[11]=null;   
          
      }
     self=getEntityAt(x,y);

   if(medic){
   array1[3]=self;
   array1[4]=getX(self);
   array1[5]=getY(self);
   }
   array1[1]=arenaWidth-1;
   array1[2]=floor(arenaHeight/2);
   
    sharedE=array1;
   
    
};

update = function () {
    
    importSharedArray();
 self=getEntityAt(x,y);
    if(canActivateSensors()) activateSensors();
    
    if(getDistanceTo(alarmTargetX,alarmTargetY)<=5&&!canSense(alarmTarget)){
    //closestEnemyBot = findEntity(ENEMY, ANYTHING, SORT_BY_DISTANCE, SORT_ASCENDING);
    alarmTarget=null;
    alarmTargetX=null;
    alarmTargetY=null;
    updateSharedArray();
        
    }
    if(getDistanceTo(repairTargetX,repairTargetY)<=5&&!canSense(repairTarget)){
   // closestEnemyBot = findEntity(ENEMY, ANYTHING, SORT_BY_DISTANCE, SORT_ASCENDING);
    repairTarget=null;
    repairTargetX=null;
    repairTargetY=null;
    updateSharedArray();
    }
   if(repairTarget==self&&lifePercent>=healthToStopRepairing){
       
        repairTarget=null;
    repairTargetX=null;
    repairTargetY=null;
    updateSharedArray();
   }
    
    if(!canSense(closestEnemyBot)&&!canSense(alarmTarget)){
      closestEnemyBot = findEntity(ENEMY, ANYTHING, SORT_BY_DISTANCE, SORT_ASCENDING);
    }
     if(canSense(closestEnemyBot)){
        alarmTarget=closestEnemyBot;
    alarmTargetX=closestEnemyBot.x;
    alarmTargetY=closestEnemyBot.y;
    updateSharedArray();
        
    }
    
    if(!exists(closestEnemyBot)||getDistanceTo(closestEnemyBot)>3){
     if(canLayMine())layMine();   
    }
    
     if (getDistanceTo(closestEnemyBot) <= enemyDistanceToTeleportAway) {
            teleportToPrefered();
        }
    
    if((!exists(repairTarget)&&getDistanceTo(repairTargetX,repairTargetY)<5)){
     repairTarget=null;   
     repairTargetX=null;
     repairTargetY=null;
     resetAlarm=false;
        updateSharedArray();
    }
      if(checkAlarm()&&exists(repairTarget)&&repairTarget!==self&&getDistanceTo(repairTargetX,repairTargetY)>2)teleportToFriend(repairTargetX,repairTargetY);
     // if(exists(repairTarget)&&repairTarget!==self&&getDistanceTo(repairTargetX,repairTargetY)>4)moveTo(repairTargetX,repairTargetY);
    if(checkAlarm())moveToIfPossible(repairTargetX,repairTargetY);
    
    if(isAdjacent(repairTarget) && willRepair(repairTarget) && repairTarget.life<life)repair(findClosestAlliedBot());
     
      if (lifePercent <= healthToRunAway ) {
            teleportToPrefered();
        }
    if (exists(closestEnemyBot)&&getDistanceTo(closestEnemyBot)>4) {
        botY = alarmTargetX;
        botX = alarmTargetY;
     
        if (lifePercent <= healthToRunAway ) {
            teleportToPrefered();
        }
         attack(); 
        
        
        if (botX !== x && botY !== y ) {
            deltaX = botX - x;
            deltaY = botY - y; // No abs() because we need it to know if up or down
            
            if((deltaX!==0&&deltaY!==0)){
            
            if (deltaX < abs(deltaY)) {
                // It costs more to match the bot in the y axis, so move x.
                moveToIfPossible(x - 1, botY);
            } else {
                if (deltaY == abs(deltaY)) {
                    moveToIfPossible(x, y + 1);
                } else {
                    moveToIfPossible(x, y - 1);
                }
            }
                
            }
        }

      
        if (getDistanceTo(closestEnemyBot) <= enemyDistanceToTeleportAway) {
            teleportToPrefered();
        }
    }
    if(getDistanceTo(findClosestEnemyBot())<5)runAway();
    
    if(canLayMine())layMine();
    healSelf()
    healOrPersueFriendlyBot();
    //if(canActivateSensors())activateSensors();
   //if(!exists(closestEnemyBot))fireLasers('right');
   if(canTeleport(x+1,y))    moveTowardsCpu();
    
    
        pursueEnemyCpu();

};

checkAlarm = function(){
    
 if((getDistanceTo(repairTargetX,repairTargetY)<5&&!exists(repairTarget))||(exists(repairTarget)&&repairTarget.lifePercent>healthToStopRepairing))
 {
     repairTarget=null;
    repairTargetX=null;
    repairTargetY=null;
     updateSharedArray();
     return false;
 }
  if(exists(repairTarget)&&getDistanceTo(repairTargetX,repairTargetY)<8)return true;  
}


runAway = function() {
   moving=true;
    closestEnemy=findClosestEnemyBot();
    //if(enemy===false){move();}
   if (closestEnemy.x > x && canMove("left")) move("left");
   if (closestEnemy.y < y && canMove("down")) move("down");
   if (closestEnemy.y > y && canMove("up")) move("up");
   move("right");
}


teleportIfPossible = function(ownX, ownY) {
    if (canTeleport(ownX, ownY)) {
         if(lifePercent<healthToRunAway){
             repairTarget=self;
             repairTargetX=ownX;
             repairTargetY=ownY;
        
        resetAlarm=true;
        updateSharedArray();
         }
        teleport(ownX, ownY);
    }
    
}

moveToIfPossible = function(ownX, ownY) {
    if (canMoveTo(ownX, ownY)) {
        moveTo(ownX, ownY);
    }
}


healSelf = function() {
    if (willRepair() && lifePercent < healthToStopRepairing) {
       repairTarget=self;
        repairTargetX=x;
        repairTargetY=y;
        updateSharedArray();
        repair();
    }
    if(self===repairTarget){
        repairTarget=null;
        repairTargetX=null;
        repairTargetY=null;
    }
    if(getDistanceTo(closestEnemyBot)<=5)return;
    if(canTeleport(x+1,y))return;
   // move(x,y);
}

healOrPersueFriendlyBot = function() {
    myBotsInRange = findEntities(IS_OWNED_BY_ME, BOT, false);
    if(!exists(repairTarget)){
    repairTarget = filterEntities(myBotsInRange, [
        SORT_BY_DISTANCE,
        SORT_BY_LIFE
    ], [
        SORT_ASCENDING,
        SORT_ASCENDING
    ]);
     repairTargetX=repairTarget.x;
     repairTargetY=repairTarget.y;
        updateSharedArray();
    }
    
    if((getDistanceTo(repairTarget)<=5&&!canSense(repairTarget)) || repairTarget.lifePercent>90)
    {
     repairTarget=null;
        repairTargetX=null;
        repairTargetY=null;
        updateSharedArray();
        
    }
    
    if (exists(repairTarget)) {
      
      //  repairTargetX=repairTarget.x;
       // repairTargetY=repairTarget.y;
        updateSharedArray();
        if (willRepair(repairTarget)) {
            repair(repairTarget);
        } else {
            if(canTeleport(repairTargetX,repairTargetY))teleport(repairTargetX,repairTargetY);
            moveToIfPossible(repairTargetX,repairTargetY);
        }
        
    }
           
}

pursueEnemyCpu = function() {
    enemyCpu = findEntity(ENEMY, CPU, SORT_BY_DISTANCE, SORT_ASCENDING);
    if (exists(enemyCpu)) {
        if (canMoveTo(enemyCpu) && getDistanceTo(enemyCpu) > 1) {
            pursue(enemyCpu);
        }
    }
    if(x<arenaWidth-1)move("right");
    moveToMiddle();
}

attack = function() {
    if (willArtilleryHit()) {
        fireArtillery();
    }
    if (willMeleeHit(closestEnemyBot))
        melee(closestEnemyBot)
    if (willMeleeHit()) {
        melee();
    }
    if (willMissilesHit()) {
        fireMissiles();
    }
    if(willLasersHit(closestEnemyBot))
        fireLasers(closestEnemyBot)
    if (willLasersHit()) {
        fireLasers();
    }
}

moveTowardsCpu = function() {
    if (isAttacker) {
        destinationX = arenaWidth - 1;
        destinationY = floor(arenaHeight / 2);
        moveTo(destinationX, destinationY);
    } else {
        move();
    }
}

teleportToFriend = function() {
if(repairTargetX!==null){
    
    if(x>repairTargetX)
    maxX=x-floor(5,abs(x-repairTargetX));
    if(y>repairTargetY)
    maxY=y-floor(5-abs(x-repairTargetX),abs(y-repairTargetY));
    if(x<repairTargetX)
    maxX=x+floor(5,abs(x-repairTargetX));
    if(y<repairTargetY)
    maxY=y+floor(5-abs(x-repairTargetX),abs(y-repairTargetY));
    
   if(canTeleport(maxX,maxY))teleport(maxX,maxY);
  
// moveTo(repairTargetX,repairTargetY);
} 
}

teleportToPrefered = function() {
    teleportIfPossible(x - 5, y);
    teleportIfPossible(x, y - 5);
    teleportIfPossible(x, y + 5);

    teleportIfPossible(x - 4, y);
    teleportIfPossible(x - 1, y - 4);
    teleportIfPossible(x - 1, y + 4);

    teleportIfPossible(x - 3, y);
    teleportIfPossible(x - 2, y - 3);
    teleportIfPossible(x - 2, y + 3);

    teleportIfPossible(x - 2, y);
    teleportIfPossible(x - 3, y - 2);
    teleportIfPossible(x - 3, y + 2);
}

updateSharedArray = function(){
    array1[0]=cpu;
    array1[1]=cpuX;
    array1[2]=cpuY;
    array1[3]=repairBot;
    array1[4]=repairBotX;
    array1[5]=repairBotY;
    array1[6]=alarmTarget;
    array1[7]=alarmTargetX;
    array1[8]=alarmTargetY;
  
    array1[9]=repairTarget;
    array1[10]=repairTargetX;
    array1[11]=repairTargetY;
    
    sharedE=array1;
    
}

importSharedArray = function() {
    // havocbot snippet
    
    if (exists(sharedE)) {
        array1 = sharedE;

        cpu = array1[0];
        cpuX = array1[1];
        cpuY = array1[2];
        repairBot = array1[3];
        repairBotX = array1[4];
        repairBotY = array1[5];    
        alarmTarget = array1[6];
        alarmTargetX = array1[7];
        alarmTargetY = array1[8];
        repairTarget = array1[9];
        repairTargetX = array1[10];
        repairTargetY = array1[11];
               
        // UnitLog indices are handled elsewhere
    }
};


