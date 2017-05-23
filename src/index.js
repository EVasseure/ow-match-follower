const {ipcRenderer} = require('electron');
const axios = require('axios');
const shell = require('electron').shell;
const remote = require('electron').remote;
const Match = require('./match');

function checkTimes(incomingMatches) {
    incomingMatches.forEach(function(match) {
        if (match.parsedTime <= 1800) {
            let n = new Notification('Match incoming!', {
                body: match.opp1 + " vs " + match.opp2 + " in " + match.time,
                silent: true,
                icon: match.icon
            })
            n.onclick = () => { ipcRenderer.send('show-window') }
        }
    }, this);
}

function displayData(currentMatches, incomingMatches) {
    let currentContent = "";
    let incomingContent = "";
    for (var i = 0; i < currentMatches.length; ++i) {
        var players = '<span class="team">' + currentMatches[i].opp1 + '</span> vs <span class="team">' + currentMatches[i].opp2 + '</span>';
        currentContent += "<tr><td>" + players + "</td><td><img src=\"" + currentMatches[i].icon + "\"></td></tr>";
    }
    for (var i = 0; i < incomingMatches.length; ++i) {
        var players = '<span class="team">' + incomingMatches[i].opp1 + '</span> vs <span class="team">' + incomingMatches[i].opp2 + '</span>';
        incomingContent += "<tr><td>" + players + "</td><td>" + incomingMatches[i].time + "</td><td><img src=\"" + incomingMatches[i].icon + "\"></td></tr>";
    }

    var currentMatchesEl = document.getElementById("current-matches");
    var noMatchesEl = document.getElementById("no-matches");
    if (currentContent === "") {
        currentMatchesEl.classList.add("hidden");
        noMatchesEl.classList.remove("hidden");
    }
    else {
        currentMatchesEl.classList.remove("hidden");
        noMatchesEl.classList.add("hidden");
    }
    document.getElementsByClassName("current-content")[0].innerHTML = currentContent;
    document.getElementsByClassName("incoming-content")[0].innerHTML = incomingContent;
}

function readData(categoriesList, index) {
    var matches = categoriesList[index].getElementsByClassName('match');
    var dates = categoriesList[index].getElementsByClassName('live-in');
    var icons = categoriesList[index].getElementsByClassName('tournament-icon');
    var matchesObjects = [];
    for (var i = 0; i < matches.length; i++) {
        var link = "http://www.gosugamers.net" + matches[i].getAttribute("href");
        var icon = "http://www.gosugamers.net" + icons[i].childNodes[1].getAttribute("src");
        var opps = matches[i].getElementsByClassName('opp');
        var time = dates[i] !== undefined ? dates[i].innerText.replace(/\s+/g, ' ').trim() : undefined;
        matchesObjects.push(new Match(opps[0].innerText.replace(/\s+/g, ' ').trim(), opps[1].innerText.replace(/\s+/g, ' ').trim(), time, icon));
    }
    return matchesObjects;
}

function getData() {
    axios.get('http://www.gosugamers.net/overwatch/gosubet')
    .then(function (response) {
        var dataEl = document.createElement('html');
        dataEl.innerHTML = response.data;

        var categoriesList = dataEl.getElementsByClassName('simple matches');

        var currentMatches = [];
        var incomingMatches = [];
        if (categoriesList.length === 2)
            incomingMatches = readData(categoriesList, 0);
        if (categoriesList.length === 3) {
            currentMatches = readData(categoriesList, 0);
            incomingMatches = readData(categoriesList, 1);
        }

        displayData(currentMatches, incomingMatches);
        checkTimes(incomingMatches);
    })
}

document.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.on('window-opened', () => {
        getData();
    })
    ipcRenderer.on('get-data', () => {
        getData();
    })
    document.getElementById("quit-btn").addEventListener("click", function (e) {
        ipcRenderer.send('quit')
    });
    document.getElementById("gosu-link").addEventListener("click", function (e) {
        e.preventDefault();
        shell.openExternal("http://www.gosugamers.net/overwatch/gosubet");
    });
})
