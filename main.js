let health = 100;
let xp = 0;
let gold = 50;
let damageResist;
let monsterDamage;
let monsterHealth;
let fighting;
let currentWeaponIndex = 0;
let inventory = ["Stick"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const hpText = document.querySelector("#hpText");
const goldText = document.querySelector("#goldText");
const monsterName = document.querySelector("#monsterText-name");
const monsterLevel = document.querySelector("#monsterText-level");
const monsterHp = document.querySelector("#monsterText-hp");
const monsterStats = document.querySelector(".monsterStats");
const weapons = [{name: "Stick", damage: 8}, {name: "Dagger", damage: 16}, {name: "Hammer", damage: 32}, {name: "Sword", damage: 48}];
const locations = [
    {
        name: "town square",
        "button text": ["Go to Store", "Go to Cave", "Fight the Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "This is the town"
    },
    {
        name: "store",
        "button text": ["Buy health (8 Gold)", "Buy Weapons (25 Gold)", "Go to town Square"],
        "button functions": [buyHealth, buyWeapons, goTown],
        text: "You can buy and sell item here"
    },
    {
        name: "cave",
        "button text": ["Fight slime", "Fight Wolves", "Go to town square"],
        "button functions": [fightSlime, fightWolves, goTown],
        text: "You see various monster, which one do you want to fight?"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goCave],
        text: "Fuck off"
    },
    {
        name: "kill",
        "button text": ["Search more monster", "Go to Store", "Go to town square"],
        "button functions": [goFight, goStore, goTown]
    },
    {
        name: "lose",
        "button text": ["Restart", "Restart", "Restart"],
        "button functions": [restart, restart, restart],
        text: "You suck"
    },
    {
        name: 'win',
        "button text": ["Restart", "Restart", "Restart"],
        "button functions": [restart, restart, restart],
        text: "Congratulation, you beat the game!"
    }
]
const monsters = [
    {
        name: "Slime",
        level: 8,
        hp: 30
    },
    {
        name: "Durin",
        level: 20,
        hp: 64
    },
    {
        name: "Kabraveen",
        level: 60,
        hp: 300
    }
]

button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location){
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;
}

//Main menu
function goTown(){
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}

function fightDragon(){
    fighting = 2;
    goFight();
}

//Store 
function buyHealth(){
    if(gold >= 10){
        gold -= 10;
        health += 9;
        goldText.innerText = gold;
        hpText.innerText = health;
        text.innerText = "You buy health. hp restored by 10 points";
    } else {
        text.innerText = "You don't have enough gold";
    }
}
function buyWeapons(){
    if(currentWeaponIndex < 3){
        if(gold >= 25){
            gold -= 25;
            goldText.innerText = gold
            currentWeaponIndex++;
            let newWeapon = weapons[currentWeaponIndex].name;
            inventory.push(newWeapon);
            text.innerText = "You buy the " + newWeapon + ".";
            text.innerText += " Do you want to sell the previous weapon? \n\nInventory: " + inventory;
        } else {
            text.innerText = "You don't have enough gold";
        }
    }
    button2.innerText = "Sell weapons (7 gold)";
    button2.onclick = sellWeapons
}
function sellWeapons(){
    if(inventory.length > 1){
        gold += 7;
        goldText.innerText = gold;
        text.innerText = "You sell the " + inventory[currentWeaponIndex - 1];
        inventory.shift();
        text.innerText = "You sell " + inventory + " for 7 gold. ";
    } else {
        text.innerText = "The store closed, wait for the next day."
    }
}

//Cave(Battle)
function fightSlime(){
    fighting = 0;
    goFight();
}

function fightWolves(){
    fighting = 1;
    goFight();
}

function goFight(){
    update(locations[3]);
    monsterStats.style.display= "block";
    monsterName.innerText = monsters[fighting].name;
    monsterLevel.innerText = monsters[fighting].level;
    monsterHealth = monsters[fighting].hp
    monsterHp.innerText = monsterHealth;
    text.innerText = "You face the " + monsters[fighting].name;
}

function attack(){
    damageResist = xp * 0.5;
    if(damageResist < monsters[fighting].level){
        monsterDamage = ((monsters[fighting].level * 1.5) - damageResist);
    } else {
        monsterDamage = ((monsters[fighting].level * 1.5) - monsters[fighting].level);
    }
    
    let playerDamage = (weapons[currentWeaponIndex].damage);
    health -= monsterDamage;
    monsterHealth -= playerDamage;
    hpText.innerText = health;
    monsterHp.innerText = monsterHealth;
    text.innerText = "You attack the monster with " + weapons[currentWeaponIndex].name + ". Causing " + playerDamage + " damage."
    text.innerText += "\n" + monsters[fighting].name + " fight back, causing " + monsterDamage + " damage." 
    if (health <= 0){
        lose();
    } else if (monsterHealth <= 0) {
        if (fighting == 2) {
            winGame();
        } else {
            killMonster();
        }
    }  
}

function dodge(){
    text.innerText = "You dodge the " + monsters[fighting].name + " attack.";
}

function killMonster(){
    update(locations[4]);
    xp += (monsters[fighting].level * 1.5);
    gold += (monsters[fighting].level * 2)
    xpText.innerText = xp;
    goldText.innerText = gold;
    text.innerText = "You killed the " + monsters[fighting].name;
}

function lose(){
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeaponIndex = 0;
    inventory = ["Stick"];
    xpText.innerText = xp;
    hpText.innerText = health;
    goldText.innerText = gold;
    goTown();
}