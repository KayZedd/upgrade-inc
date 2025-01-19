//todo:
// - add more upgrades (10%) - more to come
// - add more achivements (10%) - more to come
// - revamp level system (40%)
// - add more stats (30%)
// - add more minigames (0%)
// - add more settings (0%)



var stats = {
    money: 0,
    squareValue: 1,
    squareMultiplier: 1,
    tickDelay: 1000,
    upgPriceMultiplier: 1.2,
    squareCritChance: 0.1,
    diamonds: 0,
    spawnLimit: 15,
};

var leveling = {
    level: 0,
    exp: 0,
    expToNext: 100,
    expMultiplier: 1.1,
    levelMultiplier: 1.1,
    maxLevel: 100,
}

var upgrades = {
    1: {
        name: "Square Power",
        description: "squareValue++",
        price: 10,
        limit: 10,
        minLevel: 0,
        number: 0,
        effect: "function() { stats.squareValue += 1; }"
    },
    2: {
        name: "Better Squares",
        description: "squareLimit++",
        price: 10,
        limit: 10,
        minLevel: 0,
        number: 0,
        effect: "function() { stats.spawnLimit += 1; }"
    },
    3: {
        name: "Stopwatch",
        description: "tickDelay--",
        price: 10,
        limit: 5,
        minLevel: 0,
        number: 0,
        effect: "function() { stats.tickDelay -= 100; setTickDelay(stats.tickDelay); }"
    },
    4: {
        name: "UpgradeOverhaul",
        description: "squareValue++\n+tabName",
        price: 1000,
        limit: 1,
        minLevel: 5,
        number: 0,
        effect: "function() { stats.squareValue += 10; document.title = 'Upgrade INC ';  var favicon = document.createElement('link'); favicon.rel = 'icon'; favicon.href = 'assets/favicon-32x32.png'; document.head.appendChild(favicon); }"
    },
    5: {
        name: "Expirienced Player",
        description: "expGain++",
        price: 1000,
        limit: 10,
        minLevel: 10,
        number: 0,
        effect: "function() { leveling.expMultiplier += 0.1; }"
    },
    6: {
        name: "Golden Squares",
        description: "squareCritChance++",
        price: 100,
        limit: 10,
        minLevel: 5,
        number: 0,
        effect: "function() { stats.squareCritChance += 0.05; }"
    },
    7: {
        name: "SquareMatics",
        description: "squareMultiplier*2",
        price: 100,
        limit: 10,
        minLevel: 5,
        number: 0,
        effect: "function() { stats.squareMultiplier *= 2; }"
    },
};

var config = {
    numberType : "suffix",
    volume: 0.5,
}

var achivements = {
    1: {"name": "First Click", "description": "Click the button for the first time", "reward": 10, "done": false},
    2: {"name": "First Upgrade", "description": "Buy your first upgrade", "reward": 10, "done": false},
    3: {"name": "First Level", "description": "Reach level 1", "reward": 10, "done": false},
    4: {"name": "First Diamond", "description": "Earn your first diamond", "reward": 10, "done": false},
}

document.addEventListener('mousedown', function(event) {
    if (event.detail > 1) {
      event.preventDefault();
    }
  }, false);

function showOptions() {
    document.querySelector('.options').style.display = 'flex';
    document.querySelector('.options').style.transform = 'translate(-50%, -50%) scale(0)';
    document.querySelector('.options').style.transition = 'transform 0.3s ease-in-out';
    setTimeout(function() {
        document.querySelector('.options').style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
}

function hideOptions() {
    document.querySelector('.options').style.transform = 'translate(-50%, -50%) scale(0)';
    document.querySelector('.options').style.transition = 'transform 0.3s ease-in-out';
    setTimeout(function() {
        document.querySelector('.options').style.display = 'none';
    }, 300);
}


function showAchivements() {
    document.querySelector('.achievements-modal').style.display = 'block';
    document.querySelector('.achievements-modal').style.transform = 'translate(-50%, -50%) scale(0)';
    document.querySelector('.achievements-modal').style.transition = 'transform 0.3s ease-in-out';
    setTimeout(function() {
        document.querySelector('.achievements-modal').style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
}

function hideAchivements() {
    document.querySelector('.achievements-modal').style.transform = 'translate(-50%, -50%) scale(0)';
    document.querySelector('.achievements-modal').style.transition = 'transform 0.3s ease-in-out';
    setTimeout(function() {
        document.querySelector('.achievements-modal').style.display = 'none';
    }, 300);
}

var spawnCount = 0;

function spawnSquare() {
    if (spawnCount >= stats.spawnLimit) {
        return;
    }
    var square = document.createElement('div');
    var gameGrid = document.querySelector('.gameGrid');
    square.className = 'square';
    square.style.width = '50px';
    square.style.height = '50px';
    square.style.position = 'absolute';

    var x = Math.random() * (gameGrid.clientWidth - 50);
    var y = Math.random() * (gameGrid.clientHeight - 50);
    square.style.left = x + 'px';
    square.style.top = y + 'px';

    gameGrid.appendChild(square);
    spawnCount++;
    updateStats();
}


document.addEventListener('click', event => {
    if (event.target.classList.contains('square')) {
        event.target.remove();
        if (Math.random() < stats.critChance) {
            gainMoney(stats.squareValue * 2);
        } else {
            gainMoney(stats.squareValue);
        }
        spawnCount--;
        updateStats();
    }
});

function checkAchievements() {
    if (!achivements[1].done && stats.money >= 1) {
        addAchivement(1);
        achivements[1].done = true;
    }
    if (!achivements[2].done && Object.values(upgrades).some(upgrade => upgrade.number > 0)) {
        addAchivement(2);
        achivements[2].done = true;
    }
    if (!achivements[3].done && leveling.level >= 1) {
        addAchivement(3);
        achivements[3].done = true;
    }
    if (!achivements[4].done && stats.diamonds >= 1) {
        addAchivement(4);
        achivements[4].done = true;
    }
}

function addAchivement(i) {
    stats.diamonds += achivements[i].reward;
    achivements[i].done = true;
    document.getElementById("diamonds").innerHTML = "Diamonds: " + stats.diamonds;


showAchievementPopup(i);

}

function showAchievementPopup(i) {
    const achievement = achivements[i];
    const notificationBox = document.querySelector('.notification-box');
    const popup = document.createElement('div');
    popup.className = 'notification';
    popup.innerHTML = `
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
        <p>Reward: ${achievement.reward} Diamonds</p>
        <button onclick="this.parentElement.remove()">Close</button>
        <div class="notification-prog">
            <progress value="0" max="100"></progress>
        </div>
    `;
    notificationBox.appendChild(popup);

    const progress = popup.querySelector('.notification-prog progress');
    const startTime = performance.now();
    const interval = setInterval(() => {
        const timeElapsed = performance.now() - startTime;
        progress.value = Math.round((timeElapsed / 5000) * 100);
        if (timeElapsed >= 5000) {
            clearInterval(interval);
            popup.remove();
        }
    }, 16);
}


document.addEventListener("DOMContentLoaded", function() {
    init();
    document.querySelector('.options').style.display = 'none';

});

const music = new Audio('assets/soundtrack.mp3');
music.loop = true;
music.play().catch(error => console.error('Failed to play music:', error));

function init() {
    loadUpgrades();
    loadAchivements();
    updateStats();
}

function gainMoney(i) {
    moneyG = i;
    moneyG *= Math.pow(1 + leveling.level / 100, leveling.level);
    stats.money += Math.round(moneyG);
    updateProgress(Math.round(moneyG));
    updateStats();
    checkAchievements();
}

function loadUpgrades() {
    var upgradesDiv = document.getElementsByClassName("upgrades")[0];
    if (upgradesDiv) {
        Object.keys(upgrades).forEach(function(i) {
            if (!document.getElementById("upg" + i)) {
                var upgradeContainer = document.createElement("div");
                upgradeContainer.className = "upgrade";
                upgradeContainer.id = "upg" + i;
                upgradeContainer.onclick = function() { buyUpgrade(i); };

                var upgradeImage = document.createElement("img");
                upgradeImage.src = "assets/favicon-32x32.png";
                upgradeImage.alt = "Upgrade Image";
                upgradeContainer.appendChild(upgradeImage);

                var upgradeName = document.createElement("p");
                upgradeName.innerText = upgrades[i].name;
                upgradeContainer.appendChild(upgradeName);

                var upgradeDescription = document.createElement("p");
                upgradeDescription.innerText = upgrades[i].description;
                upgradeContainer.appendChild(upgradeDescription);

                var upgradePrice = document.createElement("p");
                upgradePrice.innerText = "Price: $" + upgrades[i].price;
                upgradeContainer.appendChild(upgradePrice);

                var upgradeProgress = document.createElement("progress");
                upgradeProgress.id = "upg" + i + "Progress";
                upgradeProgress.max = upgrades[i].limit;
                upgradeProgress.value = upgrades[i].number;
                upgradeContainer.appendChild(upgradeProgress);

                if (upgrades[i].minLevel > leveling.level || upgrades[i].number >= upgrades[i].limit) {
                    return;
                }

                upgradesDiv.appendChild(upgradeContainer);
            }
        });
    }
    updateStats();
}

function loadAchivements() {
    var achivementsDiv = document.getElementById("achievements-modal");
    if (achivementsDiv) {
        Object.keys(achivements).forEach(function(i) {
            var achivementContainer = document.createElement("div");
            achivementContainer.className = "achivement";
            achivementContainer.id = "ach" + i;

            var achivementImage = document.createElement("img");
            achivementImage.src = "assets/favicon-32x32.png";
            achivementImage.alt = "Achivement Image";
            achivementContainer.appendChild(achivementImage);

            var achivementName = document.createElement("p");
            achivementName.innerText = achivements[i].name;
            achivementContainer.appendChild(achivementName);

            var achivementDescription = document.createElement("p");
            achivementDescription.innerText = achivements[i].description;
            achivementContainer.appendChild(achivementDescription);

            var achivementReward = document.createElement("p");
            achivementReward.innerText = "Reward: " + achivements[i].reward + " Diamonds";
            achivementContainer.appendChild(achivementReward);

            var achivementDone = document.createElement("p");
            achivementDone.id = "ach" + i + "Done";
            if (achivements[i].done) {
                achivementDone.innerText = "Done";
            } else {
                achivementDone.innerText = "Not done";
            }
            achivementContainer.appendChild(achivementDone);

            achivementsDiv.appendChild(achivementContainer);

        });
    }
}


var intervalID = setInterval(function() {
    spawnSquare();
}, stats.tickDelay);

function setTickDelay(tickDelay) {
    stats.tickDelay = tickDelay;
    clearInterval(intervalID);
    intervalID = setInterval(function() {
        spawnSquare();
    }, stats.tickDelay);
}

function updateProgress(i) {
    var progress = document.getElementById("progress");
    if (leveling.level >= leveling.maxLevel) {
        leveling.exp = leveling.expToNext;
        return;
    }
    leveling.exp += Math.round(i * leveling.expMultiplier);
    while (leveling.exp >= leveling.expToNext) {
        if (leveling.level >= leveling.maxLevel) {
            return;
        }
        leveling.level++;
        leveling.exp -= leveling.expToNext;
        leveling.expToNext = Math.round(leveling.expToNext * 1.1);
        progress.max = leveling.expToNext;
        progress.value = leveling.exp;
        loadUpgrades();
    }

}


function formatNumber(value, numberType) {
    switch (numberType) {
        case "exponential":
            return value.toExponential(2);
        case "fixed":
            return value.toFixed(2);
        case "round":
            return Math.round(value);
        case "scientific":
            return value.toPrecision(3);
        case "engineering":
            const exponent = Math.floor(Math.log10(value) / 3) * 3;
            return `${(value / Math.pow(10, exponent)).toFixed(2)}e${exponent}`;
        case "compact":
            return Intl.NumberFormat('en', { notation: 'compact' }).format(value);
        case "suffix":
            const suffixes = [
                { value: 1e27, symbol: "Y" },
                { value: 1e24, symbol: "X" },
                { value: 1e21, symbol: "W" },
                { value: 1e18, symbol: "V" },
                { value: 1e15, symbol: "U" },
                { value: 1e12, symbol: "T" },
                { value: 1e9, symbol: "B" },
                { value: 1e6, symbol: "M" },
                { value: 1e3, symbol: "K" }
            ];
            for (let i = 0; i < suffixes.length; i++) {
                if (value >= suffixes[i].value) {
                    return (value / suffixes[i].value).toFixed(2) + suffixes[i].symbol;
                }
            }
            return value.toString();
        default:
            return value;
    }
}

function updateStats() {
    const numberType = config.numberType;

    const moneyFormatted = formatNumber(stats.money, numberType);
    document.getElementById("money").innerHTML = "Money: $" + moneyFormatted;


    document.getElementById("diamonds").innerHTML = "Diamonds: " + stats.diamonds;

    document.getElementById("spawnCount").innerHTML = "Spawn Count: " + spawnCount + "/" + stats.spawnLimit;

    document.getElementById("tickDelay").innerHTML = "Tick Delay: " + stats.tickDelay;

    document.getElementById("level").innerHTML = "Level: " + leveling.level;
    const expFormatted = formatNumber(leveling.exp, numberType);
    document.getElementById("exp").innerHTML = "Exp: " + expFormatted;
    const expToNextFormatted = formatNumber(leveling.expToNext, numberType);
    document.getElementById("expToNext").innerHTML = "Exp to next: " + expToNextFormatted;

    document.getElementById("progress").value = leveling.exp;
    document.getElementById("progress").max = leveling.expToNext;

    for (let i = 1; i <= Object.keys(upgrades).length; i++) {
        const upgrade = upgrades[i];
        if (upgrade && upgrade.number >= upgrade.limit) {
            continue;
        }
        const progress = document.getElementById("upg" + i + "Progress");
        if (progress) {
            progress.value = upgrade.limit - upgrade.number;
        }
    }

    music.volume = config.volume;


    for (let i = 1; i <= Object.keys(achivements).length; i++) {
        const achivement = achivements[i];
        const achivementDone = document.querySelector("#ach" + i);
        if (achivementDone) {
            if (achivement.done) {
                achivementDone.querySelector("#ach" + i + "Done").innerText = "Done";
            } else {
                achivementDone.querySelector("#ach" + i + "Done").innerText = "Not done";
            }
        }
    }
}

function buyUpgrade(i) {
    if (stats.money >= upgrades[i].price && upgrades[i].number <= upgrades[i].limit) {
        if (upgrades[i].limit > 0) {
            const effectFunction = new Function('return ' + upgrades[i].effect)();
            effectFunction();
            upgrades[i].number++;
            stats.money -= upgrades[i].price;
            let oldPrice = upgrades[i].price / 2;
            upgrades[i].price = Math.round(upgrades[i].price * (1 + stats.upgPriceMultiplier) - oldPrice);
            document.querySelector("#upg" + i + " p:nth-child(2)").innerText = upgrades[i].name;
            document.querySelector("#upg" + i + " p:nth-child(3)").innerText = upgrades[i].description;
            document.querySelector("#upg" + i + " p:nth-child(4)").innerText = "Price: $" + upgrades[i].price;
            if (upgrades[i].number >= upgrades[i].limit) {
                document.getElementById("upg" + i).remove();
            }
            updateStats();
            checkAchievements();
        }
    }
}

function save() {
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify({
        stats: stats,
        leveling: leveling,
        upgrades: upgrades,
        achivements: achivements,
        config: config
    }), "12345").toString();
    var textArea = document.createElement("textarea");
    textArea.value = encrypted;
    document.body.appendChild(textArea);
    textArea.select();
    navigator.clipboard.writeText(textArea.value).then(function() {
        console.log('Text copied to clipboard');
    });
    textArea.remove();
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = "Code to save: <br><textarea readonly id='saveInput'>" + encrypted + "</textarea><br><button onclick='document.querySelector(\"#saveInput\").select(); navigator.clipboard.writeText(document.querySelector(\"#saveInput\").value);'>Copy</button><button onclick='document.querySelector(\".modal\").remove()'>Close</button>";
    document.body.appendChild(modal);
}

function load() {
    var modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = "Paste your code: <br><textarea id='loadInput' cols='30' rows='10'></textarea><br><button onclick='loadFromInput()'>Load</button><button onclick='document.querySelector(\".modal\").remove()'>Close</button>";
    document.body.appendChild(modal);
}

function loadFromInput() {
    var encrypted = document.getElementById("loadInput").value;
    var bytes = CryptoJS.AES.decrypt(encrypted, "12345");
    var json = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    console.log(json);
    stats = json.stats;
    leveling = json.leveling;
    upgrades = json.upgrades;
    achivements = json.achivements;
    config = json.config;
    updateStats();
    document.querySelector(".modal").remove();
}

function reset() {
    location.reload();
}

