﻿var queryParamWorksId = getQueryString("wordsId");
var queryParamWorksNum = getQueryString("worksNum");
var queryParamToken = getQueryString("token");

function InitPage(loadWindowFunc) {
    var n = null;
    var cameraView = document.querySelector("#v");
    var container;
    //const map = new AMap.Map();
    var camera, scene, renderer;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var constraints = { video: { facingMode: 'environment' }, audio: false };;
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
    function setwebcam() {
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            devices.forEach(device => {
                if (device.kind === "videoinput") {
                    constraints = {
                        video: { deviceId: { exact: device.deviceId } }, audio: false
                    };
                }
            });
        });

        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function (stream) {
                track = stream.getTracks()[0];
                cameraView.srcObject = stream;
            })
            .catch(function (error) {
                console.error("Oops. Something is broken.", error);
            });
    }

    //定位服务
    function getCurrentPosition() {//调用浏览器定位服务
        map.plugin('AMap.Geolocation', function () {
            geolocation = new AMap.Geolocation({
                enableHighAccuracy: true, //是否使用高精度定位，默认:true
                timeout: 10000, //超过10秒后停止定位，默认：无穷大
                buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                buttonPosition: 'RB'
            });
            map.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', onComplete);
            //返回定位信息
            AMap.event.addListener(geolocation, 'error', onError);
            //返回定位出错信息
        });
    };

    //获取经纬度结果数组，0为经度，1为纬度
    function onComplete(data) {
        return [data.position.getLng(), data.position.getLat()];
    };
    //获取错误信息，返回错误结果提示
    function onError(data) {
        var str;
        switch (data.info) {
            case 'PERMISSION_DENIED':
                str += '浏览器阻止了定位操作';
                break;
            case 'POSITION_UNAVAILBLE':
                str += '无法获得当前位置';
                break;
            case 'TIMEOUT':
                str += '定位超时';
                break;
            default:
                str += '未知错误';
                break;
        }
        return str;
    };
}