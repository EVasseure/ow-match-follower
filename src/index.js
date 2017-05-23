const {ipcRenderer} = require('electron');
const axios = require('axios');
const shell = require('electron').shell;
const remote = require('electron').remote;
const Match = require('./match');

function checkTimes(matches) {
    matches.forEach(function(match) {
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

function displayData(matches) {
    let content = "";
    for (var i = 0; i < matches.length; ++i) {
        var players = '<span class="team">' + matches[i].opp1 + '</span> vs <span class="team">' + matches[i].opp2 + '</span>';
        content += "<tr><td>" + players + "</td><td>" + matches[i].time + "</td><td><img src=\"" + matches[i].icon + "\"></td></tr>";
    }
    document.getElementsByClassName("content")[0].innerHTML = content;
}

function getData() {
    axios.get('http://www.gosugamers.net/overwatch/gosubet')
    .then(function (response) {
        var dataEl = document.createElement('html');
        dataEl.innerHTML = response.data;
        var matchesList = dataEl.getElementsByClassName('simple matches')
        matchesList = matchesList.length === 2 ? dataEl.getElementsByClassName('simple matches')[0] : dataEl.getElementsByClassName('simple matches')[1]
        var matches = matchesList.getElementsByClassName('match');
        var dates = matchesList.getElementsByClassName('live-in');
        var icons = matchesList.getElementsByClassName('tournament-icon');

        var matchesObjects = [];
        for (var i = 0; i < matches.length; i++) {
            var link = "http://www.gosugamers.net" + matches[i].getAttribute("href");
            var icon = "http://www.gosugamers.net" + icons[i].childNodes[1].getAttribute("src");
            var opps = matches[i].getElementsByClassName('opp');
            var time = dates[i].innerText.replace(/\s+/g, ' ').trim();
            matchesObjects.push(new Match(opps[0].innerText.replace(/\s+/g, ' ').trim(), opps[1].innerText.replace(/\s+/g, ' ').trim(), time, icon));
        }

        displayData(matchesObjects);
        checkTimes(matchesObjects);
    })
    .catch(function (error) {
        console.log(error);
    });
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
