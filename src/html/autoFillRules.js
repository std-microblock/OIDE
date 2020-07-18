let words=[

    {
        keyword:"for",
        type:"gen",
        gen:`async (text)=>{
          
            let va=prompt("请输入循环变量值"),from=prompt("请输入循环起始值"),end=prompt("请输入循环条件")
            return template.for.replace(/n/g,va).replace("a",from).replace("tj",end)
        }`
    },
    
    {
        keyword:"if",
        type:"gen",
        gen:`(text)=>{
          
            let tj=prompt("请输入判断条件")
            return template.if.replace(/n/g,tj)
        }`
    },
    {
        keyword:"#include",
        type:"kwdhd"
    },
    {
        keyword:"{}",
        type:"kwdfh"
    },
    {
        keyword:"()",
        type:"kwdfh"
    },
    {
        keyword:"<string>",
        type:"kwdhd"
    },
    {
        keyword:"#define",
        type:"kwdhd"
    },
    {
        keyword:"int",
        type:"kwdtype"
    },
    {
        keyword:"float",
        type:"kwdtype"
    },
    {
        keyword:"double",
        type:"kwdtype"
    },
    {
        keyword:"string",
        type:"kwdtype"
    },
    {
        keyword:"<iostream>",
        type:"kwdhd"
    },
    {
        keyword:"<bits/stdc++.h>",
        type:"kwdhd"
    },
    {
        keyword:"<algorithm>",
        type:"kwdhd"
    },
    {
        keyword:"using",
        type:"kwd"
    },
    {
        keyword:"namespace",
        type:"kwd"
    },
    {
        keyword:"std",
        type:"kwd"
    },
    {
        keyword:"cin",
        type:"kwd"
    },
]
let template={
    for:`
    for(double n=a;tj;n++){

    }
    `,
    if:`if(n){


    }
    else{

    }`
}
let descriptions={
    gen:{
        name:"生成器",
        desc:"按下`启动生成器",
        key:192,
        activity:async (text,kw)=>{
            console.log(kw)
            let u=(await eval(kw.gen)(text,kw))
            return u;
        }
    },
    kwd:{
        name:"关键词",  
        desc:"按下Tab自动补全",
        key:9,
        activity:(text,kw)=>{
            console.log(kw)
            return kw.keyword;
        }
    },
    kwdfh:{
        name:"符号",  
        desc:"按下Enter自动补全",
        key:13,
        activity:(text,kw)=>{
            console.log(kw)
            return kw.keyword;
        }
    },
    kwdfn:{
        name:"函数",
        desc:"按下Tab自动补全",
        key:9,
        activity:(text,kw)=>{
            console.log(kw)
            return kw.keyword;
        }
    },
    kwdhd:{
        name:"头文件/预编译",
        desc:"按下Tab自动补全",
        key:9,
        activity:(text,kw)=>{
            console.log(kw)
            return kw.keyword;
        }
    },
    kwdtype:{
        name:"数据类型",
        desc:"按下Tab自动补全",
        key:9,
        activity:(text,kw)=>{
            console.log(kw)
            return kw.keyword;
        }
    }
}