let fs=require("fs");
let CookieRaw="/&&&&&/"
let UID,Cookie
function readCookies(){
try{CookieRaw=fs.readFileSync("cookies.txt").toString();}catch{
    console.log("[Luogu.js] 不能读取cookies.txt，请重新输入Cookies")
}
UID=CookieRaw.split("&&&&&")[1],Cookie=CookieRaw.split("&&&&&")[0]
}
readCookies()
let csrfkey="";const fetch = require('node-fetch')
//let cl=console.log;
var cheerio = require('cheerio');
//console.log=(e)=>{cl("[Luogu.js] ",e)}

console.log("Login:"+UID)
var cookiess={
    "cookie": Cookie
}
var getset={host:"www.luogu.com.cn",path:pageUrl,headers:cookiess}
var pageUrl = 'www.luogu.com.cn';
function getcsrfkey(shown, back) {

    if (0) {
    } else {
        var https = require('https');
        //Cookie=""
        var pageUrl = 'www.luogu.com.cn';
        getset.host=pageUrl
        getset.path="/"
        https.get(getset, function (res) {
            //console.log(res);
            var html = '';
            res.on('data', function (data) {
                html += data;
            });
            res.on('end', function () {
                for (var x = 0; x < res.rawHeaders.length; x++) {
                    //console.log(res.rawHeaders[x])
                    if ("Set-Cookie" == res.rawHeaders[x]) {
                        x++;
                        var _tmpa = res.rawHeaders[x].split(" ");
                        for (var mm = 0; mm < _tmpa.length; mm++) {
                            // console.log(_tmpa[mm].split("=")[0])
                            if (_tmpa[mm].split("=")[0] != "__client_id") continue;
                            //  Cookie=_tmpa[mm]+" "+ umdid+" "+" _uid=000000"+"; " +cnzzeid+ Math.round(Date.now()/1000);
                            break;
                        }

                        //    break;
                    }
                }
                //Cookie+=;
                //console.log("Cookie获取成功:" + Cookie)
                //数据获取完，执行回调函数
                callback(html);
            });
        });

        function callback(data) {
            var $ = cheerio.load(data);
            //console.log(data);
            console.log("[Luogu.js] 正在获取csrf-token")
            pagekey = undefined;
            try{
            $("meta").each(function () {
                if ($(this)[0].attribs.name == "csrf-token") {
                    console.log("[Luogu.js] 获取成功！")
                    console.log($(this)[0].attribs.content)
                    csrfkey =$(this)[0].attribs.content
                    
                    back()
                }
            });
        }catch{}
        }
    }
}
function uploadcode(problem,langu,code,o2=0,cbk=()=>{}){
    getcsrfkey(0,function (){
        fetch("https://www.luogu.com.cn/fe/api/problem/submit/"+problem, {
        headers: {
            'accept':'*/*',
            'accept-encoding':'gzip, deflate, br',
            'accept-language':'zh-CN,zh;q=0.9',
            'content-type':'application/json',
            'cookie':Cookie,
            'origin':'https://www.luogu.com.cn',
            'referer':'https://www.luogu.com.cn/record/list?pid='+problem,
            'sec-fetch-dest':'empty',
            'sec-fetch-mode':'cors',
            'sec-fetch-site':'same-origin',
            'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4083.0 Safari/537.36',
            'x-csrf-token':csrfkey,
            'x-requested-with':'XMLHttpRequest',
                },
        body: JSON.stringify({
          code: code,
          lang: langu,
          enableO2:o2,
          verify: ""
        }),
        method: "POST"
      }).then(async function (resp){
          var json=resp.json()
          return json;
        }).then(function (json){
        let lastupload=json.rid
console.log("[Luogu.js] UploadResponse "+JSON.stringify(json).substr(0,20))
cbk(json)
      });
    })
}

function luogufetch(link,body,cbk=()=>{},method="GET"){
    getcsrfkey(0,function (){
        let opt={
            headers: {
                'accept':'*/*',
                'accept-encoding':'gzip, deflate, br',
                'accept-language':'zh-CN,zh;q=0.9',
                
                'cookie':Cookie,
                'origin':'https://www.luogu.com.cn',
                'referer':'https://www.luogu.com.cn/',
                'sec-fetch-dest':'empty',
                'sec-fetch-mode':'cors',
                'sec-fetch-site':'same-origin',
                'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4083.0 Safari/537.36',
                'x-csrf-token':csrfkey,
                'x-requested-with':'XMLHttpRequest',
                    },
            
            method:method
          }
          if(method!="GET"&&method!="HEAD"){opt.body=body
            opt['content-type']='application/json'
        }
        fetch(link, opt).then(async function (resp){
          var json=JSON.parse(await resp.text())
          return json;
        }).then(function (json){
cbk(json)
      });
    })
}


function getTeam(uid){
    let res;
    function cbk(e){
        let tmp=[]
        console.log(e)
        e.currentData.teams.forEach((item)=>{
            tmp.push(item.team)
        })
        res(tmp)
    }
    console.log(`[Luogu.js] Navigate https://www.luogu.com.cn/user/${uid}?_contentOnly=1`)
    luogufetch(`https://www.luogu.com.cn/user/${uid}?_contentOnly=1`,{},cbk)
    return new Promise((s,j)=>{res=s})
}


exports.init=(data)=>{
    data.app.get("/luogu_setcookies",(s,q)=>{
        fs.writeFileSync("cookies.txt",s._parsedUrl.query)
        console.log("[Luogu.js] Cookie Saved.")
        readCookies()
        q.send("Saved.")
    })
    data.app.post('/luogu_upload',(s,q)=>{
        console.log("[Luogu.js] Upload："+s._parsedUrl.query+"\n     Code:"+s.body.data.substr(0,20)+"...")
        uploadcode(s._parsedUrl.query.replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、 ]/g,""),4,s.body.data,1,(a)=>{q.send(a.rid.toString())})

    })
    data.app.get('/luogu_getteam',async (s,q)=>{
        console.log("[Luogu.js] GetTeam "+UID)
     let teams=await(await getTeam(UID));
     q.send(JSON.stringify(teams))
    })
    data.app.get("/luogu_problem",async (s,q)=>{
        console.log("[Luogu.js] Navigate "+`https://www.luogu.com.cn/problem/${s._parsedUrl.query}?_contentOnly=1`)
        let json=await (await fetch(`https://www.luogu.com.cn/problem/${s._parsedUrl.query}?_contentOnly=1`,{
            headers: {
                'accept':'*/*',
                'accept-encoding':'gzip, deflate, br',
                'accept-language':'zh-CN,zh;q=0.9',
                
                'cookie':Cookie,
                'origin':'https://www.luogu.com.cn',
                'referer':'https://www.luogu.com.cn/',
                'sec-fetch-dest':'empty',
                'sec-fetch-mode':'cors',
                'sec-fetch-site':'same-origin',
                'user-agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/82.0.4083.0 Safari/537.36',
                'x-csrf-token':csrfkey,
                'x-requested-with':'XMLHttpRequest',
                    },
        })).json()
        console.log("[Luogu.js]"+JSON.stringify(json).substr(0,20)+"...")
        q.send(json)
        
    })
}
//currentData.problem
exports.js=`
createMenu("洛谷")
createPullDownMenu("登录",async ()=>{
    fetch("/luogu_setcookies?"+await prompt('请输入Cookie')+"&&&&&"+await prompt('请输入UID'))
    },"洛谷")
createPullDownMenu("提交",async ()=>{
    
    let th
    if(getWindowTitleByID(getNowWindow().wid).split('-')[0]=="洛谷编辑器")th=getWindowTitleByID(getNowWindow().wid).split("-").pop()
    else th=await prompt('请输入题号')

    let id=await (await fetch("/luogu_upload?"+th, {
        "headers": {
          "accept": "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin"
        },
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": JSON.stringify({data:getEditorText()}),
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      })).text();
    window.open('https://www.luogu.com.cn/record/'+id)
        },"洛谷")
        function genLGDesc(json){
            let tmp
            try{if(json.currentData.lastCode.indexOf("Generated by Luogu.js (within O-ide)")!=-1){tmp=json.currentData.lastCode;return tmp;}}catch{}
            tmp="/*\\nGenerated by Luogu.js (within O-ide)\\n\\n题目："+json.currentData.problem.pid+" "+json.currentData.problem.title
            +"\\n"+json.currentData.problem.background+"\\n"+json.currentData.problem.description+"\\n\\n 提示："+json.currentData.problem.hint+"\\n输入格式："+json.currentData.problem.inputFormat+"\\n输出格式："+json.currentData.problem.outputFormat+"\\n示例输入/输出"
            json.currentData.problem.samples.forEach((item,num)=>{
        tmp+="\\n--------------------------------\\n输入"+(num+1)+":\\n"+item[0]+"\\n\\n输出"+(num+1)+":\\n"+item[1]+"\\n--------------------------------\\n"
        })
        tmp+="*/"
        function stdcode(){
            try{
        if(json.currentData.problem.stdCode.length>10){
            tmp+="\\n\\n/*----洛谷提供的示范代码-----*/\\n\\n/*"
        tmp+=json.currentData.problem.stdCode
        tmp+="*/"
        }}catch{}
    }
        function deafa(){
            tmp+="\\n\\n/*--Luogu.js生成的初始代码--*/"
            tmp+="\\n#include <bits/stdc++.h>\\n/*以下为可选*/\\n//#include <vector>\\n"+
            "using namespace std;\\n\\n\\n"+
            "int main(/*int argc,char *argv[]*/){\\n\\n/*Your code...*/\\n\\n\\n\\n}"
        }
        function pd(){
            try{return json.currentData.lastCode.length>10}
            catch{return 0;}
        }
        stdcode()
        if(pd()){
            tmp+="\\n\\n/*----你上一次提交的代码-----*/\\n\\n"
        tmp+=json.currentData.lastCode
        }else{
            deafa()
        }
        tmp+="\\n\\n/*----End of generation-----*/"
    
        return tmp;
}
createPullDownMenu("创建洛谷项目",async ()=>{
            let th=await prompt('请输入题号')
            let json=await(await fetch("/luogu_problem?"+th)).json()
            createWindow("洛谷-"+th,"https://www.luogu.com.cn/problem/"+th.replace(/[\`~!@#$%^&*()_\\-+=<>?:"{}|,.\\/;'\\\\[\\]·~！@#￥%……&*（）——\\-+={}|《》？：“”【】、；‘'，。、 ]/g,"").toLocaleUpperCase());
            let luoguEditorWin=createWindow("洛谷编辑器-"+th,"/editor");
            changeToWin(luoguEditorWin)
            clearSelTabs()
            setTimeout(()=>{
            getNowWindow().window.contentWindow.savePath="LuoguProblem-"+th;
            getNowWindow().window.contentDocument.querySelector("textarea").value=genLGDesc(json)
            document.querySelector("body > div.sizebaropened").innerText=genLGDesc(json)
document.querySelector("body > div.sizebaropened").style.color="white"
            getNowWindow().window.contentDocument.querySelector("textarea").oninput()
            },400)
},"洛谷")
async function setTeam(){
    let u=await(await fetch("/luogu_getteam")).json()
    u.forEach((e)=>{
        let txt="洛谷团队-"+e.name
        createMenu(txt)
        createPullDownMenu("作业",()=>{createWindow("团队作业","https://www.luogu.com.cn/teamold/"+e.id)},txt)
        createPullDownMenu("题单",()=>{createWindow("团队题单","https://www.luogu.com.cn/team/"+e.id+"#training")},txt)
    })
    
}
setTeam()
`
