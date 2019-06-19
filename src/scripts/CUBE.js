import * as THREE from "three";
import {AxesHelper} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Object3D} from "three";
import {MeshBasicMaterial} from "three";
import {Mesh} from "three";
import {TimelineLite, Power0} from "gsap/all";
import {WebGLRenderer} from "three";

var renderer, camera, scene, controls, object, object2, object3, object4, object5, object6;
const tl = new TimelineLite();
var mesh1, mesh2, mesh3, mesh4, mesh5, mesh6, button, range;
var tick = 0;
const tween = {
    mesh1: 1,
    mesh2: 1,
    mesh3: -1,
    mesh4: -1,
    mesh5: 1,
    mesh6: 1,
};
const tweenRagle = {
    mesh1A: Math.PI / 2,
    mesh2A: -Math.PI / 2,
    mesh3A: Math.PI / 2,
    mesh4A: -Math.PI / 2,
    mesh5A: Math.PI / 2,
    mesh6A: 0
};

export function init() {
    renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
    camera.position.set(11, 8, 10);


    controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener(
        'change',
        () => {
            renderer.render(scene, camera);
        },
        false
    );
    controls.enableZoom = false;
    controls.enablePan = false;

    scene = new THREE.Scene();

    scene.add(new AxesHelper(5));
    scene.add(new THREE.AmbientLight(0x444444));

    var light = new THREE.PointLight(0xffffff);
    light.position.set(15, 30, 1);

    //告诉平行光需要开启阴影投射
    light.castShadow = true;
    scene.add(light);

    //创建立方体的顶点
    var parent = new Object3D();
    // parent.position.y = 1;
    scene.add(parent);
    // parent.add(new AxesHelper(1));
    // parent.position.set(1, 1, 1);
    var vertices = [
        new THREE.Vector3(2, 2, 2), //v0
        new THREE.Vector3(0, 2, 2), //v1
        new THREE.Vector3(0, 0, 2), //v2
        new THREE.Vector3(2, 0, 2), //v3
        new THREE.Vector3(2, 0, 0), //v4
        new THREE.Vector3(2, 2, 0), //v5
        new THREE.Vector3(0, 2, 0), //v6
        new THREE.Vector3(0, -0, 0) //v7
    ];
    //
    // //创建立方的面
    var faces = [
        new THREE.Face3(0, 1, 2),
        new THREE.Face3(0, 2, 3),
        new THREE.Face3(0, 3, 4),
        new THREE.Face3(0, 4, 5),
        new THREE.Face3(1, 6, 7),
        new THREE.Face3(1, 7, 2),
        new THREE.Face3(6, 5, 4),
        new THREE.Face3(6, 4, 7),
        new THREE.Face3(5, 6, 1),
        new THREE.Face3(5, 1, 0),
        new THREE.Face3(3, 2, 7),
        new THREE.Face3(3, 7, 4)
    ];
    let material = new THREE.MeshPhongMaterial({
        color: 0x335599,
        specular: 0x335599,
        shininess: 15,
        flatShading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });
    // mesh1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);
    // mesh2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);
    // mesh3 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);
    // mesh4 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);
    // mesh5 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);
    // mesh6 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     material);

    // mesh3 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     new THREE.MeshBasicMaterial({color: 0xff0000}));
    // mesh4 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     new THREE.MeshBasicMaterial({color: 0xff0000}));
    // mesh5 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     new THREE.MeshBasicMaterial({color: 0xff0000}));
    // mesh6 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
    //     new THREE.MeshBasicMaterial({color: 0xff0000}));


    mesh1 = addMesh(vertices, [faces[0], faces[1]]);
    mesh2 = addMesh(vertices, [faces[2], faces[3]]);
    mesh3 = addMesh(vertices, [faces[4], faces[5]]);
    mesh4 = addMesh(vertices, [faces[6], faces[7]]);
    mesh5 = addMesh(vertices, [faces[8], faces[9]]);
    mesh6 = addMesh(vertices, [faces[10], faces[11]]);
    //
    // mesh1.position.set(0, 1, -1);
    // mesh2.position.set(-1, 1, 0);
    // mesh3.position.set(0, 1, 0);
    // mesh4.position.set(0, 1, 0);
    // mesh5.position.set(0, 1, 0);
    // mesh6.position.set(0, 1, -1);
    // mesh5.position.se
    // // const mesh2 = addMesh();
    // parent.add(mesh1);
    // parent.add(mesh2);
    // parent.add(mesh3);
    // parent.add(mesh4);
    // parent.add(mesh5);
    // parent.add(mesh6);
    object = new THREE.Object3D();
    object2 = new THREE.Object3D();
    object3 = new THREE.Object3D();
    object4 = new THREE.Object3D();
    object5 = new THREE.Object3D();
    object6 = new THREE.Object3D();
    // object.position.z = -2;
    // object5.add(new AxesHelper(4));
    // object5.add(new AxesHelper(4));
    // object5.add(new AxesHelper(4));
    // object.add(new AxesHelper(4));

    object.add(mesh1);
    object2.add(mesh2);
    object3.add(mesh3, object5);
    object4.add(mesh4);
    object5.add(mesh5);
    object6.add(mesh6);

    parent.add(object);
    parent.add(object2);
    parent.add(object3);
    parent.add(object4);
    // parent.add(mesh1, mesh4);
    // moveCenterX(mesh2, -2);
    // parent.add(object5);
    parent.add(object6);

    object.position.z = 2;
    mesh1.position.z = -2;

    object2.position.x = 2;
    mesh2.position.x = -2;

    // object5.position.x = -2;
    object5.position.y = 2;
    // object5.position.z = -2;
    // object5.rotation.x = Math.PI;

    mesh5.position.y = -2;
    // mesh5.position.z = -2;

    setAnimation();
}

function roate(x) {
    var T = new THREE.Matrix4();      //创建一个4*4矩阵
    T.makeTranslation(0, 0, 2);
    mesh1.applyMatrix(T);
    mesh1.rotation.x = Math.PI / 2;
    // var rotWorldMatrix = new THREE.Matrix4().makeRotationX(x);
    // rotWorldMatrix.multiply(T);
    // mesh1.matrix = T;
    // mesh1.rotation.setFromRotationMatrix(mesh1.matrix);
}

function moveCenterY(data, y) {
    for (var j = 0; j < data.geometry.vertices.length; j++) {
        data.geometry.vertices[j].y += y;
    }
    data.geometry.verticesNeedUpdate = true;
}

function moveCenterX(data, x) {
    for (var j = 0; j < data.geometry.vertices.length; j++) {
        data.geometry.vertices[j].x += x;
    }
    data.geometry.verticesNeedUpdate = true;
}


function moveCenterZ(data, w) {
    for (var j = 0; j < data.geometry.vertices.length; j++) {
        data.geometry.vertices[j].z += w;
    }
    data.geometry.verticesNeedUpdate = true;
}

function addMesh(vertices, faces) {
    var geometry = new THREE.Geometry();
    geometry.vertices = vertices;
    geometry.faces = faces;
    let material = new THREE.MeshPhongMaterial({
        color: 0x335599,
        specular: 0x335599,
        shininess: 15,
        flatShading: THREE.FlatShading,
        side: THREE.DoubleSide,
    });

    return new THREE.Mesh(geometry, material);
}

function setAnimation() {
    button = document.createElement('button');
    button.innerHTML = 'wrap';
    document.body.appendChild(button);

    range = document.createElement('input');
    range.type = 'range';
    range.min = 0;
    range.max = 1;
    range.step = 0.001;
    range.value = 0;
    document.body.appendChild(range);

    tl.to([tween, tweenRagle], 1.5, {
        mesh1: 0,
        mesh2: 0,
        mesh3: 0,
        mesh4: 0,
        mesh5: 0,
        mesh6: 0,
        mesh1A: 0,
        mesh2A: 0,
        mesh3A: 0,
        mesh4A: 0,
        mesh5A: 0,
        mesh6A: 0,
        ease: Power0.easeNone,
        onUpdate: update,
        onComplete: () => {
            tl.pause();
        }
    });
    tl.progress(1);
    range.addEventListener(
        'input',
        function () {
            tl.pause();
            tl.progress(range.value);
            button.innerHTML = tl.progress() > 0.5 ? 'unwrap' : 'wrap';
        },
        false
    );

    button.addEventListener(
        'click',
        function () {
            tl.progress() > 0.5 ? tl.reverse() : tl.play();
        },
        false
    );
}

function update() {

    // function updateWrapper(vIndex) {
    //     console.log(vIndex);
    // }

    // mesh1.position.z = 2;
    // mesh2.rotation.z = -Math.PI / 2;
    // mesh2.position.x = 2;
    // mesh3.rotation.z = Math.PI / 2;
    // mesh3.position.x = -2;
    // mesh4.rotation.x = -Math.PI / 2;
    // mesh4.position.z = -2;
    // mesh5.position.z = -4;
    // mesh5.rotation.x = -Math.PI;
    // mesh1.rotation.setFromRotationMatrix(tween.mesh1);

    // mesh1.position.z = tween.mesh1;
    // mesh2.position.x = tween.mesh2;
    // mesh3.position.x = tween.mesh3;
    // mesh4.position.z = tween.mesh4;
    // mesh5.position.z = tween.mesh5;
    //
    // object.rotation.x = tweenRagle.mesh1A;
    // console.log(mesh1);
    // for ()
    // object.position.z = tween.mesh1;
    // mesh1.position.y = tween.mesh1 * 2;
    // console.log(mesh1.geometry.vertices);
    // object2.rotation.z = tweenRagle.mesh2A;
    // object2.position.x = tween.mesh2;
    // mesh2.position.y = tween.mesh2;
    //
    // object3.rotation.z = tweenRagle.mesh3A;
    // object3.position.x = tween.mesh3;
    // mesh3.position.y = -tween.mesh3;
    //
    // object4.rotation.x = tweenRagle.mesh4A;
    // object4.position.z = tween.mesh4;
    // mesh4.position.y = -tween.mesh4;
    //
    // object5.rotation.z = tweenRagle.mesh5A;
    // object5.position.x = -tween.mesh5 * 3;
    // mesh5.position.x = tween.mesh5 ;

    // object6.rotation.x = tweenRagle.mesh6A;
    // object6.position.z = tween.mesh6;
    // roate(tweenRagle.mesh1A);
    // mesh1.rotation.x = tweenRagle.mesh1A;
    // object2.position.x = tween.mesh2 * 2;
    // mesh2.position.x = -tween.mesh2 * 2;
    object.rotation.x = tweenRagle.mesh1A;

    object2.rotation.z = tweenRagle.mesh2A;

    // object5.rotation.z = tweenRagle.mesh5A;
    // mesh5.position.z = tween.mesh5 * -4;
    // object5.position.z = tween.mesh5 * 4;
    // object5.position.z = tween.mesh5 * 2;
    // object.position.z = tween.mesh5 * 4;
    // mesh5.rotation.x = tweenRagle.mesh5A;
    // mesh5.rotation.x = tweenRagle.mesh5A;
    // mesh5.position.y = tween.mesh5 * -2;
    // mesh5.position.z = tween.mesh5 * 2;

    mesh4.rotation.x = tweenRagle.mesh4A;

    object3.rotation.z = tweenRagle.mesh3A;

    object5.rotation.z = tweenRagle.mesh5A;

    renderer.render(scene, camera);
    //UI
    range.value = tl.progress();
    button.innerHTML = tl.progress() > 0.5 ? 'unwrap' : 'wrap';
}
