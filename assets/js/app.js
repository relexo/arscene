var queryParamWorksId = getQueryString("wordsId");
var queryParamWorksNum = getQueryString("worksNum");
var queryParamToken = getQueryString("token");

function InitPage(loadWindowFunc) {
    var n = null;
    var v = null;
    var container;
    var camera, scene, renderer;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    //init();
    //animate();
    initCanvas(window.innerWidth, window.innerHeight);
    setwebcam();
    const threeHelper = new ThreeHelper();
    const setting = {
        model: "assets/images/3DModel/70zn/70zn.fbx",
        scale: 0.5,
        position: [0, 15, -80]
    };

    //模型加载部分
    var loader = new THREE.FBXLoader();
    var textureLoader = new THREE.TextureLoader();
    var textures = [];
    textures.push(textureLoader.load('assets/images/3DModel/70zn/1.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/2.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/3.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/5.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/6.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/7.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/8.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/9.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/10.png'));
    textures.push(textureLoader.load('assets/images/3DModel/70zn/12.png'));

    loader.load(setting.model, (object) => {
        object.scale.multiplyScalar(setting.scale);
        object.position.set(setting.position[0], setting.position[1], setting.position[2]);
        object.traverse(function (child) {
            for (var i = 0; i < child.children.length; i++) {
                if (child.children[i].name == "Sphere001") {
                    console.info(child.children[i].name)
                    child.children[i].visible = false;
                    child.children[i].geometry.dispose();
                    child.children[i].material.dispose();
                }
                console.info(child.children[i].name);
                if (child.children[i].isMesh) {
                    var material = new THREE.MeshStandardMaterial({
                        transparent: true
                    });
                    switch (child.children[i].name) {
                        case "Plane002":
                            material.map = textures[0];
                            child.children[i].material = material;
                            break;
                        case "Plane003":
                            material.map = textures[1];
                            child.children[i].material = material;
                            break;
                        case "Plane004":
                            material.map = textures[2];
                            child.children[i].material = material;
                            break;
                        case "Plane005":
                            material.map = textures[3];
                            child.children[i].material = material;
                            break;
                        case "Plane006":
                            material.map = textures[4];
                            child.children[i].material = material;
                            break;
                        case "Plane007":
                            material.map = textures[5];
                            child.children[i].material = material;
                            break;
                        case "Plane008":
                            material.map = textures[6];
                            child.children[i].material = material;
                            break;
                        case "Plane012":
                            material.map = textures[9];
                            child.children[i].material = material;
                            break;
                        case "Plane009":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "对象001":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "Plane010":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "对象002":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "Plane011":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "对象003":
                            material.map = textures[8];
                            child.children[i].material = material;
                            break;
                        case "IMG":

                            child.children[i].position.x = child.children[i].position.x + 10;
                            break;
                        default:
                    }
                    //var material = new THREE.MeshStandardMaterial({
                    //    map: textures[i],
                    //    transparent: true
                    //});
                    //child.children[i].material = material;
                    //child.children[i].castShadow = true;
                    //child.children[i].receiveShadow = true;
                }
            }
        });
        //模型加载到场景里之后，开始请求接口
        threeHelper.scene.add(object);
        if (object.animations.length > 0) {
            var mixer = new THREE.AnimationMixer(object);
            threeHelper.mixers.push(mixer);
            threeHelper.action.push(mixer.clipAction(object.animations[0]));
            threeHelper.action[0].play();
        }
        LoadObjAnimation(threeHelper, object, loadWindowFunc);

    });

    function LoadObjAnimation(threeHelperObj, object, callback) {
        $.ajax({
            url: "https://test.cdzghome.com:3176/national/works/getWorksInfoById?id=1157554665578332268",
            type: "Post",
            //data: { id: 1157554665578332268 },
            dataType: "Json",
            success: function (res) {
                if (res.code == 200) {
                    object.traverse(function (child) {
                        for (var i = 0; i < child.children.length; i++) {
                            if (child.children[i].name == "IMG") {
                                //textureLoader.setCrossOrigin('*');
                                //var texture = textureLoader.load(res.data.medias[0].mlink);
                                var texture = textureLoader.load("assets/images/3DModel/img.png");
                                var material = new THREE.MeshStandardMaterial({
                                    map: texture,
                                    transparent: true
                                });
                                child.children[i].material = material;
                            }
                        }
                    });



                    //之后请求抽字接口
                    $.ajax({
                        url: "https://test.cdzghome.com:3176/singleWord/gatherOneWord",
                        type: "Post",
                        dataType: "Json",
                        data: JSON.stringify({ latitude: 34.3619400000, longitude: 107.2373200000, workIdAndQrCode: "1157554665578332268-1" }),
                        dataType: "Json",
                        headers: { 'Content-Type': 'application/json;charset=UTF-8', token: "a62bf553-cb1f-4f39-83ca-b8c0cfe5eb1a" },
                        success: function (res) {
                            const settingAnimation = {
                                model: "assets/images/3DModel/70zn/70zn_hb.fbx",
                                scale: 0.5,
                                position: [8, 30, 150]
                            };
                            var animationTextures = [];
                            //模型加载部分
                            var animationLoader = new THREE.FBXLoader();
                            animationTextures.push(textureLoader.load('assets/images/3DModel/70zn/hb_1.png'));
                            animationTextures.push(textureLoader.load('assets/images/3DModel/70zn/hb_2.png'));
                            animationLoader.load(settingAnimation.model, (object) => {
                                object.scale.multiplyScalar(settingAnimation.scale);
                                object.position.set(settingAnimation.position[0], settingAnimation.position[1], settingAnimation.position[2]);
                                object.traverse(function (child) {
                                    for (var i = 0; i < child.children.length; i++) {
                                        if (child.children[i].name == "Sphere001") {
                                            console.info(child.children[i].name)
                                            child.children[i].visible = false;
                                        }
                                        console.info(child.children[i].name);
                                        if (child.children[i].isMesh) {
                                            var material = new THREE.MeshStandardMaterial({
                                                transparent: true
                                            });
                                            switch (child.children[i].name) {
                                                case "Plane014":
                                                    material.map = animationTextures[0];
                                                    child.children[i].material = material;
                                                    break;
                                                case "Plane015":
                                                    material.map = animationTextures[1];
                                                    child.children[i].material = material;
                                                    break;
                                                default:
                                            }
                                        }
                                    }
                                });
                                //模型加载到场景里之后，开始请求接口
                                threeHelperObj.scene.add(object);
                                var action;
                                if (object.animations.length > 0) {
                                    var mixer = new THREE.AnimationMixer(object);
                                    threeHelperObj.mixers.push(mixer);
                                    action = mixer.clipAction(object.animations[0]);
                                    action.play();
                                }
                                setTimeout(function () {
                                    for (var i = 0; i < threeHelperObj.mixers.length; i++) {
                                        if (i == 1) {
                                            threeHelperObj.mixers.splice(i, 1);
                                        }
                                    }
                                    object.visible = false;
                                    callback(JSON.stringify(res));//该回调直接返回中奖结果
                                }, 1580);
                            });
                        }
                    });
                }

            }
        });
    }

    //初始化canvas元素，形成一个矩形框
    function initCanvas(w, h) {
        v = document.getElementById("v");
        v.style.width = w + "px";
        v.style.height = h + "px";
    }

    //兼容性判断
    var deviceControl;
    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    function getUserMedia(constraints, success, error) {
        if (navigator.mediaDevices.getUserMedia) {
            //最新的标准API
            navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
        } else if (navigator.webkitGetUserMedia) {
            //webkit核心浏览器
            navigator.webkitGetUserMedia(constraints, success, error)
        } else if (navigator.mozGetUserMedia) {
            //firfox浏览器
            navigator.mozGetUserMedia(constraints, success, error);
        } else if (navigator.getUserMedia) {
            //旧版API
            navigator.getUserMedia(constraints, success, error);
        }
    }

    function setwebcam() {
        var options = true;
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind == 'videoinput') {
                    options = { //帧率
                        frameRate: { ideal: 60, max: 60, min: 30 },
                        'deviceId': { 'exact': device.deviceId }
                    };
                }
            });
            setwebcam2(options);

        }).catch(function (err) {
            alert("摄像头错误[errmsg:" + err + "]"); 
        });
    }
    function success(stream) {
        //alert('Succeed to get media!');
        if (v.srcObject !== undefined) {
            //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
            v.srcObject = stream;
        }
        else {
            v.src = window.URL && window.URL.createObjectURL(stream) || stream;
        }
        v.play();
    }
    function error(error) {
        console.log(error);
    }
    function setwebcam2(options) { v 
        var p = getUserMedia({ video: options, audio: false }, success, error);
        //p.then(success, error);
    }
}