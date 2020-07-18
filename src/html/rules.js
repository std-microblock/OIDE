
let highLightList = [
    {
        plainTexts: ["for","while"],
        RegExps: ["for","while"],
        color: "#9579c0",
        backgroundColor: "unset",
        userCss: "",
        mode: "only-a-word"
    },
    
    {
        plainTexts:["namespace","int","double","string","float"],
        RegExps:["namespace","int","double","string","float"],
        color:"#569cd6",
        backgroundColor:"unset",
        userCss:"",
        mode:"only-a-word"
    },
    {
        plainTexts:["std"],
        RegExps:["std"],
        color:"#4ec9b0",
        backgroundColor:"unset",
        userCss:"",
        mode:"only-a-word"
    },
    {
        plainTexts:["$1("],
        RegExps:["__disabled__(.*?)\\("],
        color:"#dcdcaa",
        backgroundColor:"unset",
        userCss:"",
        mode:"strict"
    },  
    {
        noformat:true,
        plainTexts:["//$1","/*$1*/"],
        RegExps:["\\/\\/(.*<br>?)","/\\*(.*?)\\*/"],
        color:"#5e993e",
        backgroundColor:"unset",
        userCss:"color:#5e993e !important;",
        mode:"strict"
    },  
 
    {
        plainTexts: ["#define $1 $2","#include <$1>","using","if","else","#include<$1>"],
        RegExps: ["#define (\\w+) (\\w+)","#include <(\\w+)>","using","if","else","#include<(\\w+)>"],
        color: "#c586c0",
        backgroundColor: "unset",
        userCss: "",
        mode: "strict"
    },
    

],
    specialReplaceRules = [

        {
            from: " ",
            to: "&nbsp;",
            mode: "strict"
        }, {
            from: "<",
            to: "&lt;",
            mode: "strict"
        },
        {
            from: ">",
            to: "&gt;",
            mode: "strict"
        },
        {
            from: "\n",
            to: "<br>",
            mode: "strict"
        },
    ],
    userFormater=[
        function (a){
            console.log(a.replace(RegExp("//([\s\S]*?)\n","g"),"/*$1*/\n"))
            return a.replace(RegExp("//([\s\S]*?)\n","g"),"/*$1*/\n")
        }
    ]