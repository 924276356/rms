jQuery(function ($) {
   
    $.post("http://localhost:3006/users/autosignin",{data:localStorage.getItem('token')},(res)=>{
        if(res=="ok"){
            location.href="data.html";
        }else{
            alert("登录过期，请重新登录");
        }
    });

    let signIn = (inputEmail,inputPassword)=>{
        return new Promise((resolve,reject)=>{
            $.post("http://localhost:3006/users/signin",{inputEmail,inputPassword},(data)=>{
                resolve(data);
            })
        })
    }
    let signinBtn = $("#signinBtn");
    signinBtn.click(async ()=> {
        console.log(111);
        let inputEmail = $("#inputEmail").val();
        let inputPassword = $("#inputPassword").val();
        let data = await signIn(inputEmail,inputPassword);
        if(data.status =="success"){
            localStorage.setItem("token",data.crypto)
            alert("登录成功");
            location.href ="data.html";
        }else{
            console.log("登录失败");
        }

    })
})