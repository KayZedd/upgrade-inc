
var stats = {
    money: 0,
    moneyPerSecond: 0,
    moneyPerClick: 1,
    allowedCPS: 10,
    tickDelay: 1000,
    upgPriceMultiplier: 1.2,
    clickCritChance: 0.1,
    diamonds: 0,
};

var leveling = {
    level: 0,
    exp: 0,
    expToNext: 100,
    levelMultiplier: 1.1,
    maxLevel: 100,
}

var upgrades = {
    1: {
        name: "Better Mouse",
        description: "Increases money per click by 10",
        price: 10,
        limit: 10,
        bought: false,
        effect: function() { stats.moneyPerClick += 10; }
    },
    2: {
        name: "Better Air",
        description: "Increases money per second by 10",
        price: 10,
        limit: 10,
        bought: false,
        effect: function() { stats.moneyPerSecond += 10; }
    },
    3: {
        name: "Sweat Metter",
        description: "Increases allowed clicks per second by 1",
        price: 10,
        limit: 20,
        bought: false,
        effect: function() { stats.allowedCPS += 1; }
    },
    4: {
        name: "Stopwatch",
        description: "Decreases tick delay by 100ms",
        price: 10,
        limit: 5,
        bought: false,
        effect: function() { stats.tickDelay -= 100; setTickDelay(stats.tickDelay); }
    },
    5: {
        name: "Tab Name",
        description: "Increases money per click by 10, also changes the tab name",
        price: 1000,
        limit: 1,
        bought: false,
        effect: function() { 
            stats.moneyPerClick += 10; 
            document.title = "Upgrade INC ";  
            var favicon = document.createElement('link'); 
            favicon.rel = 'icon'; 
            favicon.href = 'assets/favicon-32x32.png'; 
            document.head.appendChild(favicon); 
        }
    },
    6: {
        name: "UI Revamp",
        description: "Increases money per second by 10, also revamps the UI",
        price: 10000,
        limit: 1,
        bought: false,
        effect: function() { stats.moneyPerSecond += 10; }
    },
    7: {
        name: "Golden Click",
        description: "Inceases critical chance by 5%",
        price: 100,
        limit: 10,
        bought: false,
        effect: function() { stats.clickCritChance += 0.05; }
    }
};

var config = {
    numberType : "round",
}

var achivements = {
    1: {"name": "First Click", "description": "Click the button for the first time", "reward": 10, "done": false},
    2: {"name": "First Upgrade", "description": "Buy your first upgrade", "reward": 10, "done": false},
    3: {"name": "First Level", "description": "Reach level 1", "reward": 10, "done": false},
}

function checkAchievements() {
    if (!achivements[1].done && stats.money >= 1) {
        addAchivement(1);
        achivements[1].done = true;
    }
    if (!achivements[2].done && upgrades[1].bought == true) {
        addAchivement(2);
        achivements[2].done = true;
    }
    if (!achivements[3].done && leveling.level == 1) {
        addAchivement(3);
        achivements[3].done = true;
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
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = `
        <h3>${achievement.name}</h3>
        <p>${achievement.description}</p>
        <p>Reward: ${achievement.reward} Diamonds</p>
        <button onclick="this.parentElement.style.display='none'">Close</button>
        <div class="achievement-prog">
            <progress value="0" max="100"></progress>
        </div>
    `;
    document.body.appendChild(popup);

    const progress = popup.querySelector('.achievement-prog progress');
    let timeLeft = 5000;
    const interval = setInterval(() => {
        progress.value = Math.round((1 - timeLeft / 5000) * 100);
        timeLeft -= 100;
        if (timeLeft <= 0) {
            clearInterval(interval);
            popup.style.display = 'none';
        }
    }, 100);
}

function showAchivements() {
    const popup = document.createElement('div');
    popup.className = 'achievements';
    popup.innerHTML = `
        <h3>Achivements</h3>
        ${Object.keys(achivements).map(i => `
            <div class="achievement">
                <h4>${achivements[i].name}</h4>
                <p>${achivements[i].description}</p>
                <p>Reward: ${achivements[i].reward} Diamonds</p>
                <p>${achivements[i].done ? 'Done' : 'Not done'}</p>
            </div>
        `).join('')}
        <button onclick="document.querySelector('.achievements').remove()">Close</button>
    `;
    const achievementsDiv = document.createElement('div');
    achievementsDiv.className = 'achievements';
    document.body.appendChild(achievementsDiv);
    achievementsDiv.appendChild(popup);
}

document.addEventListener("DOMContentLoaded", function() {
    init();
});

function init() {
    loadUpgrades();
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
            var upgradeContainer = document.createElement("div");
            upgradeContainer.className = "upgrade";
            upgradeContainer.id = "upg" + i;
            
            var upgradeButton = document.createElement("button");
            upgradeButton.className = "upgrade";
            upgradeButton.id = "upgrade" + i;
            upgradeButton.onclick = function() { buyUpgrade(i); };
            upgradeButton.innerHTML = upgrades[i].name + " | " + upgrades[i].price + "$";
            
            var tooltip = createTooltip(upgrades[i].description);
            upgradeButton.onmouseover = function(event) {
                showTooltip(tooltip, event);
            };
            upgradeButton.onmouseout = function() {
                hideTooltip(tooltip);
            };

            upgradeContainer.appendChild(upgradeButton);
            upgradeContainer.appendChild(tooltip);
            upgradesDiv.appendChild(upgradeContainer);
        });
    }
}

function createTooltip(description) {
    var tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.innerHTML = description;
    tooltip.style.position = "absolute";
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.3s ease-in-out";
    document.body.appendChild(tooltip);
    return tooltip;
}

function showTooltip(tooltip, event) {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
    tooltip.style.left = event.pageX + 10 + 'px';
    tooltip.style.top = event.pageY + 10 + 'px';
}


function hideTooltip(tooltip) {
    tooltip.style.opacity = "0";
    setTimeout(function() {
        tooltip.style.visibility = "hidden";
        document.body.removeChild(tooltip);
    }, 300);
}


document.querySelectorAll('.button').forEach(button => {
    let tooltip;

    button.addEventListener('mouseover', function(event) {
        const tooltipText = button.getAttribute('data-tooltip');
        tooltip = createTooltip(tooltipText);
        showTooltip(tooltip, event);
    });

    button.addEventListener('mouseout', function() {
        hideTooltip(tooltip);
    });
});


var intervalID = setInterval(function() {
    gainMoney(stats.moneyPerSecond);
}, stats.tickDelay);

function setTickDelay(tickDelay) {
    stats.tickDelay = tickDelay;
    clearInterval(intervalID);
    intervalID = setInterval(function() {
        gainMoney(stats.moneyPerSecond);
    }, stats.tickDelay);
}

function clicker() {
    var timeNow = Date.now();
    if (typeof clicker.lastCall === "undefined" || timeNow - clicker.lastCall > 1000 / stats.allowedCPS) {
        clicker.lastCall = timeNow;
        var crit = Math.random() < stats.clickCritChance;
        var moneyGained = stats.moneyPerClick * (crit ? 2 : 1);
        gainMoney(moneyGained);
        if (crit) {
            var clickerButton = document.querySelector(".game .button button");
            if (clickerButton) {
                clickerButton.style.color = "red";
                setTimeout(function() {
                    clickerButton.style.color = "white";
                }, 100);
            }
        }
        updateStats();
    }
    updateProgress(stats.moneyPerClick);
}

function updateProgress(i) {
    var progress = document.getElementById("progress");
    if (leveling.level >= leveling.maxLevel) {
        leveling.exp = leveling.expToNext;
        return;
    }
    leveling.exp += i;
    while (leveling.exp >= leveling.expToNext) {
        if (leveling.level >= leveling.maxLevel) {
            return;
        }
        leveling.level++;
        leveling.exp -= leveling.expToNext;
        leveling.expToNext = Math.round(leveling.expToNext * 1.1);
        progress.max = leveling.expToNext;
        progress.value = leveling.exp;
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

    const moneyPerSecondFormatted = formatNumber(Math.round(stats.moneyPerSecond * 1000 / stats.tickDelay), numberType);
    document.getElementById("moneyPerSecond").innerHTML = "$/s: " + moneyPerSecondFormatted;

    const moneyPerClickFormatted = formatNumber(stats.moneyPerClick, numberType);
    document.getElementById("moneyPerClick").innerHTML = "$/click: " + moneyPerClickFormatted;

    document.getElementById("allowedCPS").innerHTML = "Allowed CPS: " + stats.allowedCPS;

    document.getElementById("tickDelay").innerHTML = "Tick Delay: " + stats.tickDelay;

    document.getElementById("level").innerHTML = "Level: " + leveling.level;
    const expFormatted = formatNumber(leveling.exp, numberType);
    document.getElementById("exp").innerHTML = "Exp: " + expFormatted;
    document.getElementById("expToNext").innerHTML = "Exp to next: " + leveling.expToNext;

    document.getElementById("progress").value = leveling.exp;
    document.getElementById("progress").max = leveling.expToNext;
}

function buyUpgrade(i) {
    if (stats.money >= upgrades[i].price && !upgrades[i].bought) {
        if (upgrades[i].limit > 0) {
            upgrades[i].effect();
            stats.money -= upgrades[i].price;
            let oldPrice = upgrades[i].price / 2;
            upgrades[i].price = Math.round(upgrades[i].price * (1 + stats.upgPriceMultiplier) - oldPrice);
            document.getElementById("upgrade" + i).innerHTML = upgrades[i].name + " | " + upgrades[i].price + "$";
            upgrades[i].limit--;
            if (upgrades[i].limit <= 0) {
                document.getElementById("upg" + i).remove();
                upgrades[i].bought = true;
            }
            updateStats();
        }
    }
}

function save() {
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify({
        stats: stats,
        leveling: leveling,
        upgrades: upgrades,
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
    stats = json.stats;
    leveling = json.leveling;
    upgrades = json.upgrades;
    updateStats();
    document.querySelector(".modal").remove();
}

function reset() {
    location.reload();
}

