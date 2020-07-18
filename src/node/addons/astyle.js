exports.init=(d)=>{
    d.app.post('/astyle_format',(req,res)=>{
        let fs=require("fs")
        console.log(req.body.data)
        fs.writeFileSync(d.tempfolder+"/"+"astyle_file_temp.cpp",req.body.data)
        let cp=require("child_process")
        console.log("CMD:"+d.addonsfolder+"/astyle.exe "+d.tempfolder+"\\astyle_file_temp.cpp")
        cp.exec(d.addonsfolder+"/astyle.exe "+d.tempfolder+"\\astyle_file_temp.cpp",(a,O)=>{
            console.log(O)
            res.send(fs.readFileSync(d.tempfolder+"/"+"astyle_file_temp.cpp").toString())
        });
       
    })
}
exports.js=`
createMenu("格式化")

createPullDownMenu("格式化当前编辑器",async ()=>{
    let formated=await(await fetch("/astyle_format",{
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
})).text()
getNowWindow().window.contentDocument.querySelector('textarea').value=formated
getNowWindow().window.contentDocument.querySelector('textarea').oninput()
},"格式化")
`