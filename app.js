const {app, BrowserWindow, ipcMain, Tray, nativeImage} = require('electron')
const path = require('path')
app.dock.hide();

const assetsDir = path.join(__dirname, 'assets')

let tray = undefined
let window = undefined

// This method is called once Electron is ready to run our code
// It is effectively the main method of our Electron app
app.on('ready', () => {
    // Setup the menubar with an icon
    let icon = nativeImage.createFromDataURL(base64Icon)
    tray = new Tray(icon)

    window = new BrowserWindow({
        width: 500,
        height: 540,
        show: false,
        frame: false,
        resizable: false,
    })

    // Add a click handler so that when the user clicks on the menubar icon, it shows
    // our popup window
    tray.on('click', function(event) {
        toggleWindow();
        window.webContents.send('window-opened')

        // Show devtools when command clicked
        // if (window.isVisible() && process.defaultApp && event.metaKey) {
        //     window.openDevTools({mode: 'detach'})
        // }
    })

    // Tell the popup window to load our index.html file
    window.loadURL(`file://${path.join(__dirname, 'src/index.html')}`)

    // Only close the window on blur if dev tools isn't opened
    window.on('blur', () => {
        if(!window.webContents.isDevToolsOpened()) {
            window.hide()
        }
    })
})

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
}

const showWindow = () => {
    const trayPos = tray.getBounds()
    const windowPos = window.getBounds()
    let x, y = 0
    if (process.platform == 'darwin') {
        x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
        y = Math.round(trayPos.y + trayPos.height)
    } else {
        x = Math.round(trayPos.x + (trayPos.width / 2) - (windowPos.width / 2))
        y = Math.round(trayPos.y + trayPos.height * 10)
    }


    window.setPosition(x, y, false)
    window.show()
    window.focus()
}

ipcMain.on('show-window', () => {
    showWindow()
})

ipcMain.on('quit', () => {
    app.quit()
})

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    app.quit()
})

let base64Icon = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACXBIWXMAAAsTAAALEwEAmpwYAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAACyElEQVQ4EV2US0hUYRSA///OjOOzcRTLtOgBZYGB0KooaWHRtk1BBYoEYRIuahEEMVTYNqIIIxOpjCZctMuCJIgeJAi1KA0i6GFPUlPnee/pO9e5MnTgu+ec/zzu/7rXmiIREcda6+mQ9DWUZ0x+pSuheATfM/mZqGumbPfPOT8uCXITfq76YX2oCAFjrchgY202V7rbK5vfEw1HmsX16hk3xon+8HK5t9n+dY+yaXlobOI7L+a9VrSeDJqgMUSSycr8zMnT4crsKVNRYiST94x1Zv2g58VsSdiatGty09lLkfj5M3b/0ZmglilIiK4ueis9D3hPB2L2Y+dO1za9l3R6xIlEp2hm8+mFxlB5WZvjTmyWVZefhHZ1/TaOM0ztK+2hE2IqEoMhEMlnB3LDPa1/e02dHyx6yA1Tlxvat8PNpq76ua57B71sKQWnHXRWKTgeBGSsLyKysJrhNSJjuue+kHNEPG8OrTWHgsE4zj1QuQvlGpBEIozdAD1wQlI0SyZDkjCOjI5qrB9UdFYxXVYLTEIejvlNREoKuoOxW3ATuv6LHWZsASZgi0MwDvUwDZ+BI7RZgjWYHRDVIdDCFRrDVvkCf6ABarSRXipFbX/3KajFPgutkAcXtkMvMX2piuYunhaGXshf8AmaYT2Jpehz4C8F/RoyoM06IUROD7oJlsMkTOseVcFtUHkBuuF6GirXoBoq4CIEch/jWcFJoqtp5t+jgzjpQkDVLFyAKj9hMacMPwHTEIjuZXuQo7OqhMEgih6HlqWEgsHYJngJgehKYhou/kQ24l+BNpiHcXgOH0A/zLWwDfRTqoTH0M0pvqPZ4qZj6InpzDbAdSheZg5flxBIBkMvo2621vi1/tcfDNDdI6A3e28BPUk9bs37Bm9gBB6QO69NtAZ/8TeihgoB/09QsMvQetn0wqro5ftKYUqd4lz1/wG7EkqmnFdAYQAAAABJRU5ErkJggg==`