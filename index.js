const {ipcRenderer} = require('electron');
const axios = require('axios');
const shell = require('electron').shell;
const remote = require('electron').remote;

function getData() {
    axios.get('http://www.gosugamers.net/overwatch/gosubet')
    .then(function (response) {
        var dataEl = document.createElement('html');
        dataEl.innerHTML = response.data;
        var matches = dataEl.getElementsByClassName('simple matches')[0].getElementsByClassName('match');
        var dates = dataEl.getElementsByClassName('simple matches')[0].getElementsByClassName('live-in');
        var content = "";
        for (var i = 0; i < matches.length; i++) {
            var link = "http://www.gosugamers.net" + matches[i].getAttribute("href");
            var opps = matches[i].getElementsByClassName('opp');
            var players = '<span class="team">' + opps[0].innerText.replace(/\s+/g, ' ').trim() + '</span> vs <span class="team">' + opps[1].innerText.replace(/\s+/g, ' ').trim() + '</span>';
            var time = dates[i].innerText.replace(/\s+/g, ' ').trim();
            content += "<tr><td>" + players + "</td><td>" + time + "</td></tr>";
        }
        document.getElementsByClassName("content")[0].innerHTML = content;

    })
    .catch(function (error) {
        console.log(error);
    });
}



document.addEventListener('DOMContentLoaded', () => {
    // let n = new Notification('You did it!', {
    //     body: 'Nice work.'
    // })
    // n.onclick = () => { ipcRenderer.send('show-window') }

    ipcRenderer.on('window-opened', () => {
        getData();
    })
    getData();
    document.getElementById("quit-btn").addEventListener("click", function (e) {
        console.log("TOTOTO")
        ipcRenderer.send('quit')
    });
})
