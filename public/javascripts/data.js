jQuery(($) => {

    //令牌校验拦截
    let check = () => {
        let Token = localStorage.getItem('token');
        $.post("http://localhost:3006/data/checktoken",
            { Token }, (res) => {
                if (res == false) {
                    location.href = "login.html"
                }
            })
    }
    check();

    //渲染数据库所有信息
    $.post("http://localhost:3006/data/msg", (res) => {
        let str = res.map((item) => {
            return `<tr>
                    <td><input type="checkbox">${item._id}</td>
                    <td>${item.skill}</td>
                    <td>${item.age}</td>
                    <td>${item.gender}</td>
                    <td>${item.name}</td>
                </tr>`
        }).join("");
        $("#msg").html(str);
    });

    //插入数据
    let insert = (_skill, _age, _gender, _name) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3006/data/insert", { _skill, _age, _gender, _name }, (data) => {
                resolve(data);
            })
        })
    }
    $("#ins").click(async () => {
        let _skill = $(".skill").val();
        let _age = $(".age").val();
        let _gender = $(".gender").val();
        let _name = $(".name").val();

        let data = await insert(_skill, _age, _gender, _name);

        if (data == "ok") {
            alert(data);
            $(".skill").val("");
            $(".age").val("");
            $(".gender").val("");
            $(".name").val("");
            location.href = "data.html";
        }
    })

    //删除数据
    let Del = (_name) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3006/data/del", { _name }, (data) => {
                resolve(data);
            })
        })
    }
    $("#del").click(async () => {
        let _name = $(".name").val();
        let data = await Del(_name);
        if (data.n > 0) {
            alert("ok");
            $(".name").val("")
        }
    })

    //查询数据
    let Find = (_name) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3006/data/find", { _name }, (data) => {
                resolve(data);
            })
        })
    }
    $("#find").click(async () => {
        let _name = $(".name").val();
        // let _age = $(".age").val();
        // let _gender = $(".gender").val();
        let data = await Find(_name);
        if (data.length > 0) {
            let str = data.map((item) => {
                return `<tr>
                        <td>id:${item._id}</td>
                        <td>${item.skill}</td>
                        <td>${item.age}</td>
                        <td>${item.gender}</td>
                        <td>${item.name}</td>
                    </tr>`
            }).join("");
            $("#dedails").html(str);
            $(".name").val("");
            // $(".age").val("");
            // $(".gender").val("");
        }
    })


    //更新数据
    $("#stu").on("blur", async () => {
        let _name = $(".name").val();
        let data = await Find(_name);
        if (data.length > 0) {
            let str = data.map((item) => {
                return `<tr>
                        <td>id:${item._id}</td>
                        <td>${item.skill}</td>
                        <td>${item.age}</td>
                        <td>${item.gender}</td>
                        <td>${item.name}</td>
                    </tr>`
            }).join("");
            $("#render").html(str);
        }
    })
    let Update = (_name, _age, _gender, _afskill, _afname, _afage, _afgender) => {
        return new Promise((resolve, reject) => {
            $.post("http://localhost:3006/data/update", { _name, _age, _gender, _afskill, _afname, _afage, _afgender }, (data) => {
                resolve(data);
            })
        })
    }
    $("#update").click(async () => {
        let _name = $(".name").val();
        let _age = $(".age").val();
        let _gender = $(".gender").val();
        let _afskill = $(".afskill").val();
        let _afname = $(".afname").val();
        let _afage = $(".afage").val();
        let _afgender = $(".afgender").val();

        let data = await Update(_name, _age, _gender, _afskill, _afname, _afage, _afgender);
        if (data.nModified > 0) {
            alert("update successfully");
            location.href = "data.html";
            $(".name").val("");
            $(".age").val("");
            $(".gender").val("");
            $(".afskill").val("");
            $(".afname").val("");
            $(".afage").val("");
            $(".afgender").val("");
        }
    })

    //渲染头像
    let renderPic = () => {
        $.post("http://localhost:3006/data/findpic", { Token: localStorage.getItem('token') }, (res) => {
            console.log(res)
            $("#photo").attr("src", `http://localhost:3006/${res}`)
        })
    }
    renderPic();

    //上传头像文件
    var fileNode = $("#file")[0];
    fileNode.onchange = function () {
        var data = new FormData();
        data.append("logo", fileNode.files[0]);
        $.ajax({
            url: 'http://localhost:3006/data/uploads',
            type: 'POST',
            data,
            processData: false,
            contentType: false,
            success: function (data) {
                let picname = data.file.filename;
                let Token = localStorage.getItem('token')
                $.post("http://localhost:3006/data/setpic", {
                    picname,
                    Token
                })
            }
        })
    }
})