init = function () {
    // config values
    
    use_sensors=true;
    firstTime=true;    
    avoid_enemies=false;  // you that friendly?
    lay_mines=false;
    slave=true;
    medic=false;
    static=true;
    can_repair=false;
    recharge_to=90;    //  life recharge percentage
    fix_percent=70;     // percentage to need repair
    always_defend=70;    // percentage to defend at
    use_weapons=true;   // duh
    line_defense=false;
    max_friend_distance=12;
    alternate_moves=false; //artillery defense
    min_fight_distance=0;
    max_fight_distance=0;
    //init values
    //sharedB=false; //defenser
    enemy=null;
    friend=null;
    enemyDistance=0;
    needFix=false;      // init need fix
    moved_last_turn=false;
    self=getEntityAt(x,y);
    
    sharedB=self;
   
   sharedD=0;// in pursue
   moving=false;
   last_life=life; 
   timer=0;
    
     if(exists(sharedE)) array1=sharedE;
      else{
       array1[0]=null;array1[1]=null;array1[2]=null;array1[3]=null;array1[4]=null;array1[5]=null;array1[6]=null;array1[7]=null;array1[8]=null;   
          
      }
    

   if(medic){
   array1[3]=self;
   array1[4]=getX(self);
   array1[5]=getY(self);
   }
   array1[1]=arenaWidth-1;
   array1[2]=floor(arenaHeight/2);
   
  sharedE=array1;
  staticX=x;
  staticY=y;
   tmpMaxFriendDistance=max_friend_distance;
    debugLog(sharedE);
}

update = function () {
    setAttackPriority(CHIP_BOT_CPU);
    importSharedArray();
    
    moved_last_turn=moving;
    moving=false;
    
    enemy = nearestFoo();
    
    if (!friend || !check_friend(friend))
        friend = nearestFriend();
  
    check_defend();  
    
    last_life=life;
    
    nearestEnemy=enemy;

    timer++;
  
    if (enemy && canSense(enemy)) {
        if (use_weapons && check_distance() && (!alternate_moves || moved_last_turn))
          debugLog('TRY ATTACK');
            try_attacking();
      //  check_environment();
      if(!medic&&!static){  moving = true;
        try_moving();
                         }
    } else {
       if(use_weapons){ try_attacking();}
   if(!static&&!medic){ moving=true;
    check_environment();
        if(static && ( !x==staticX || !y==staticY)) moveTo(staticX,staticY);
       
       if(lifePercent < fix_percent ){ repairTrip();  }  
                       
       pursueEnemy();
       // if(canMoveTo(sharedA)&&!medic&&!static) moveTo(sharedA);
                       debugLog('HOLD STEADY');
     if(getDistanceTo(cpu)>max_friend_distance){
         pursue(cpuX,cpuY);
                      }
                      }
    }
           
};

check_environment = function() {
 
    if (use_sensors && canActivateSensors() && !areSensorsActivated() && firstTime==true) activateSensors();
    
}

nearestFoo = function(){
   enemy=alarmTarget;
  //  enemyDistance = getDistanceTo(enemy);
   // closestFoo=getDistanceTo(findEntity(ENEMY,ANYTHING,SORT_BY_DISTANCE,SORT_ASCENDING));
    
    if(alarmTarget===null||(calculateDistance(x,y,alarmTargetX,alarmTargetY)<=5&&!canSense(alarmTarget))) {
    alarmTarget=findEntity(ENEMY,ANYTHING,SORT_BY_LIFE,SORT_ASCENDING);
       if(exists(alarmTarget)){
    alarmTargetX=alarmTarget.x;
    alarmTargetY=alarmTarget.y;
       updateSharedArray();
       }
       //return alarmTarget;
        enemy=alarmTarget;
    }
   // if(closestFoo<enemyDistance){enemy=alarmTarget;alarmTarget=enemy;}
    if(canMoveTo(alarmTargetX,alarmTargetY)) debugLog('VILLAIN PURSUE');
 
    return enemy;   
}

nearestFriend = function(){
   // if(isDefined(sharedA)&&canSense(sharedA)) return sharedA;
    
    //friend =  findClosestAlliedBot(); 
   // sharedA=friend;
   // debugLog('new master');
    return cpu;
}

try_attacking = function() {
    if(enemy){
    if (canZap() && getDistanceTo(enemy)<=2||timer<3) zap();
    if (willMeleeHit(enemy)) melee(enemy);
    
    if (willLasersHit(enemy)) fireLasers(enemy);
    if (willMissilesHit(enemy)) fireMissiles(enemy);
    if (willArtilleryHit(enemy)) fireArtillery(enemy);
    }
    if (willMeleeHit()) melee();
    if (willMissilesHit()) fireMissiles();
    if (willArtilleryHit()) fireArtillery();
    if (willLasersHit()) fireLasers();
};

check_distance = function() {
    enemy_distance = calculateDistance(x,y,alarmTargetX,alarmTargetY);
    //cpu = findClosestEnemyCpu();
    
    cpu_distance = calculateDistance(x,y,cpuX,cpuY);
    if(enemy_distance == cpu_distance || canSense(cpu)) {min_fight_distance=0;avoid_enemies=false;return true;}
    if (!min_fight_distance || enemy_distance >= min_fight_distance) return true;
    if (!max_fight_distance || enemy_distance <= max_fight_distance) return true;
};


check_repair = function(){
  
myBotsInRange = findEntities(IS_OWNED_BY_ME, ANYTHING, false);
brokenBot = filterEntities(myBotsInRange, [
  SORT_BY_DISTANCE,
  SORT_BY_LIFE
], [
  SORT_ASCENDING,
  SORT_ASCENDING
]);
    
if(exists(brokenBot) && willRepair(brokenBot))  repair(brokenBot);
if(willRepair()) repair();   
if(medic && brokenBot.lifePercent < fix_percent) moveTo(brokenBot);


    
}

check_enemy = function() {
    if (!exists(enemy) || !canSense(enemy)) return false;
    if (canTeleport(enemy)) return true;
    if (canZap() && !isZapping() && isAdjacent(enemy)) return true;
    if (willMeleeHit(enemy)) return true;
    if (willLasersHit(enemy)) return true;
    if (willMissilesHit(enemy)) return true;
    if (willArtilleryHit(enemy)) return true;
    return false;
};


check_friend = function() {
    if (!exists(friend) || !canSense(friend)) return false;
    if (canTeleport(friend)) return true;
    
    if (canMoveTo(friend)) return true;
    
    return false;
};

check_defend = function() {
    //if (life < last_life && moved_last_turn==false){moving=true;last_life=life; runAway();}
   // if(isAdjacent(enemy)&&willMeleeHit()&&life<last_life) return;
  //  if(cpu.lifePercent<100) max_friend_distance=tmpMaxFriendDistance;   
   // else
     //   max_friend_distance=floor(tmpMaxFrienDistance/2);
    
    if(timer<2) return;
    if(life<last_life && moved_last_turn==false && timer>2 && !medic ){timer=0;  runAway();}
    if (enemy || life < last_life || life <= (life * (always_defend / 100))) {
          
        last_life = life;
    
        //if (willRepair() && lifePercent<75) repair();
        
        if (isShielded() && isReflecting()) return;
        if (canShield()) shield();
        if (canCloak()) cloak();
        if (canReflect()) reflect();
        
    }
   //   if(canShield(findClosestAlliedBot()))shield(findClosestAlliedBot());
    
    check_repair();
};

try_moving = function() {
    
    debugLog('TRYING TO MOVE');
    if(lifePercent < fix_percent ){ repairTrip();  }  

    if((x==0||x==areaWidth-1)&&(y==areaHeight-1||y==0)&&!medic&&!static){
       move();
       }
    
    if (!medic && !static && (avoid_enemies || (min_fight_distance && enemy_distance < min_fight_distance))) {
        // Run awaaaaaay!
        if (enemy.y > y && canMove("up")) move("up");
        if (enemy.y < y && canMove("down")) move("down");
        if (enemy.x > x && canMove("left")) move("left");
        move("right");
    }
    if(slave && check_friend() && getDistanceTo(friend)>max_friend_distance && canMoveTo(friend)) moveTo(friend);
    
    if (line_defense && friend && getX(friend)<=x ) move('backward');
   
    if (alternate_moves && !moved_last_turn && isAdjacent(enemy))
        move();
    // Charge!
    if (canTeleport(enemy) && enemy_distance >= 2) teleport(enemy);
     pursueEnemy();
    if(findClosestEnemyBot())  pursue(findClosestEnemyBot());
    //if(enemy)  pursue(enemy);
    if(getEntityAt(cpuX,cpuY)) {
        cpu=getEntityAt(cpuX,cpuY);
    updateSharedArray();
    }
    if(!medic && !static) pursue(cpuX,cpuY);
};

runAway = function() {
   moving=true;
    if(enemy===false){move();}
   if (enemy.x > x && canMove("left")) move("left");
   if (enemy.y < y && canMove("down")) move("down");
   if (enemy.y > y && canMove("up")) move("up");
   move("right");
}

repairTrip = function () {
    if(repairBot === null) return;
    if (calculateDistance(x, y, repairBotX, repairBotY) <= 5 && !exists(repairBot)) {
        repairBot = null;
        repairBotX = null;
        repairBotY = null;

        updateSharedArray();
        debugLog('MEDIC DIED');
    } else if (calculateDistance(x, y, repairBotX, repairBotY) !== 1){
        debugLog('TO THE DOCTOR');
        pursue(repairBotX, repairBotY);
    }
};

pursueEnemy= function (){
    if(enemy.x===null) return;
    
        if (calculateDistance(x, y, alarmTargetX, alarmTargetY) <= 5 && !exists(alarmTarget)) {
        alarmTarget = null;
        alarmTargetX = null;
        alarmTargetY = null;

        updateSharedArray();
         debugLog('NO TARGET FOR '+self);
    } else if (calculateDistance(x, y, alarmTargetX, alarmTargetY) !== 1){
        debugLog('GOING FOR TARGET PURSUE');
        debugLog(alarmTarget);
        moveTo(alarmTargetX, alarmTargetY);
    }
    
}

calculateDistance = function(sourceX, sourceY, targetX, targetY) {
    xDiff = abs(sourceX - targetX);
    yDiff = abs(sourceY - targetY);

    return xDiff + yDiff;
};

initSharedArray = function(){
debugLog('naah no init');
   if(exists(sharedE)) array1=sharedE;
   if(alarmTarget==null||repairBot==null){ 
   if(findClosestEnemyBot()){ 
   if(exists(findClosestEnemyBot()))
      {
    array1[6]=findClosestEnemyBot();
   array1[7]=getX(array1[6]);
   array1[8]=getY(array1[6]);
     }
   }
      if(medic){
   array1[3]=self;
   array1[4]=getX(self);
   array1[5]=getY(self);
        }
    }
   
    
   array1[1]=arenaWidth-1;
   array1[2]=floor(arenaHeight/2);
    sharedE=array1;
    
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
        
        // UnitLog indices are handled elsewhere
    }
};


