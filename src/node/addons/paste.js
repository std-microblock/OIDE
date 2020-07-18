function html2Escape(sHtml) {
    //html转义
    return sHtml.replace(/[<>&"]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
}

function getLocalIP() {
    const os = require('os');
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = '';
    if (osType === 'Windows_NT') { 
        for (let dev in netInfo) {
        	//win7的网络信息中显示为本地连接，win10显示为以太网
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        ip = netInfo.eth0[0].address;
    }

    return ip;
}


exports.init = (d) => {
    d.app.post('/pastepad', (req, res) => {
        let fs = require("fs")
        console.log("[Paste.js] Paste "+req.body.data.substr(0,20))
        fs.writeFileSync(d.tempfolder + "/" + "pastepad.html", "<div style='color:white;padding:10px;'>"+ html2Escape(req.body.data).replace(/\n/g,"</br>")+"</div>")
        res.send(200);
    })
    d.app.get("/getpad.html", (req, res) => {
        let fs = require("fs")
        res.sendFile((d.tempfolder + "/" + "pastepad.html"))
    })
}
exports.js = `
createMenu("剪贴板")

createPullDownMenu("发送当前编辑器内容",async ()=>{
   await(await fetch("/pastepad",{
    "headers": {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/json",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      body:JSON.stringify({
        data:getEditorText()
    
    }),
    "method":"POST",
      "referrer": "http://localhost/editor",
      "referrerPolicy": "no-referrer-when-downgrade",
}))
},"剪贴板")

createPullDownMenu("打开剪贴板",async ()=>{
    createWindow("剪贴板","/getpad.html");
},"剪贴板")

createBottomButton(()=>{},"Local IP:${getLocalIP()}","插件：paste.js")


`