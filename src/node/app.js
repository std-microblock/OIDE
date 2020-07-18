const addonsList=[
    "luogu.js","astyle.js","paste.js"
]
















let mainjs="document.location.reload()"
console.log("-----Main Function-----")
const express = require('express')

const hljs = require('highlight.js')
const { fstat } = require('fs')
const { spawn } = require('child_process');
let styleSheet = "vs2015"
const app = express()
const port = 80
let rootSpi=__dirname.split("\\")
app.use(express.json());
rootSpi.pop();rootSpi.pop();
let root=rootSpi.join("/")
app.post('/highlight', (req, res) => {
let val=hljs.highlight("cpp",req.body.data).value.split(''),replaceFlag=1;
/*1.左标签中 2.标签内 3.右标签中 */
val.forEach((a,b)=>{
switch(replaceFlag){
    case 1:{
        if(a=='<'){
            if(val[b+1]=='/')replaceFlag=3
            else replaceFlag=1
        }
        if(a=='>'){
            replaceFlag=2
        }
        break;
    }
    case 2:{
        if(a=='<'){
            if(val[b+1]=='/')replaceFlag=3
            else replaceFlag=1
        }
        if(a==" ")val[b]="&nbsp;"

        break;
    }
    case 3:{
        if(a=='>'){
           replaceFlag=2
        }
        if(a==" ")a="&nbsp;"
        break;
    }
}
//console.log(`Char:${a} Mode:${replaceFlag}`)
})
    res.send(`<link rel="stylesheet" href="/highlight_stylesheet"></link>`+val.join('') );
}
)



let term="",cmd=spawn("cmd.exe",{ encoding: 'buffer' })
const iconv = require('iconv-lite');
function html2Escape(sHtml) {
    //html转义
    return sHtml.replace(/[<>&"]/g, function (c) {
        return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c];
    });
}
let lastCmd=""
cmd.stdout.on('data', (data) => {
    data=html2Escape(iconv.decode(data, 'cp936'))//.replace(/\n/g," ")

    if(data.replace(/ |\n/g,"")==lastCmd.replace(/ |\n/g,""))return 0;
    console.log(`T > ${data}`);
    term+="> "+data
    term+="\n"
});

cmd.stderr.on('data', (data) => {
    data=html2Escape(iconv.decode(data, 'cp936'))//.replace(/\n/g," ")
    console.error(`T[Error] > ${data}`);
    term+="<div style='color:red'> &gt;"+data+"</div>"
});
cmd.stdin.write("@echo off"+"\n");
app.get('/command',(req,res)=>{
    
    req._parsedUrl.query=decodeURI(req._parsedUrl.query).replace(/\(root\)/g,root)
    lastCmd=req._parsedUrl.query
    res.send("> "+req._parsedUrl.query)
    console.error(`T < ${req._parsedUrl.query}`);
    cmd.stdin.write(req._parsedUrl.query+"\n");
    term+="<div style='color:gray'>"+html2Escape("< "+req._parsedUrl.query)+"</div>"
})


app.get("/term",(q,s)=>{
    s.send(term)
    term=""
})





app.get('/highlight_stylesheet', (req, res) => {
    res.sendFile(`${__dirname}/styles/${styleSheet}.css`);
}
)
app.get('/doc',(a,b)=>{
    b.send(`<script src="http:\/\/gist-it.appspot.com/http:\/\/github.com/MicroCBer/O.ide/blob/master/README.md"></script>`)
})
app.get('/editor', (req, res) => {
    res.sendFile(`${root}/src/html/editor.html`);
}
)


app.get('/', (req, res) => {
    res.sendFile(`${root}/src/html/index.html`);
}
)

app.get('/addons', (req, res) => {
    res.send(mainjs);
}
)

app.get('/icon.svg', (req, res) => {
    res.sendFile(`${root}/oide.png`);
}
)
app.get('/favicon.ico', (req, res) => {
    res.sendFile(`${root}/oide.png`);
}
)

app.get('/autoFillRules.js',(req, res) => {
    res.sendFile(`${root}/src/html/autoFillRules.js`);
})





app.post('/savefile',(req,res)=>{
    require("fs").writeFileSync(root+"/"+req.body.name.replace(" ","_"),req.body.data)
    res.send("FILE SAVED")
})
app.listen(port, () => {
    console.log(`O·ide is running at http://localhost:${port}`)
    console.log("----Loading Addons-----")
    mainjs=""
    addonsList.forEach((a)=>{
        try{
       let e=require("./addons/"+a);
      // console.log(e)
       e.init({addonlist:addonsList,app:app,addonsfolder:__dirname+"/addons/",tempfolder:__dirname+"/addons/temp"})
       mainjs+=`
       /*
       ----------------------------------
       模块：${a}
       ----------------------------------
       */
       ${e.js}
       `
        }catch(e){
            console.log("加载模块 "+a+" 时出错：\n\m"+e+"\n")
        }
    })
    console.log("---------Term----------")

})

