import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {AxesHelper, Box3Helper} from "three";
import {ArrowHelper} from "three";

export function demo() {
    /**
     * 创建场景对象Scene
     */
    var scene = new THREE.Scene();
    /**
     * 创建网格模型
     */
    var geometry = new THREE.BoxGeometry(10, 10, 10); //创建一个立方体几何对象Geometry
    var material = new THREE.MeshPhongMaterial({
        color: 0xdd00ff,
        wireframe: true,//将几何图形渲染为线框
        transparent: true,//开启透明
        opacity: 0.5,//透明度0.5
        // 前面FrontSide  背面：BackSide 双面：DoubleSide
        side: THREE.DoubleSide,
    }); //材质对象Material
    var cube = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(cube); //网格模型添加到场景中
    scene.add(new AxesHelper(20));

    var axis = new THREE.Vector3(1,1,0);    //创建一个三维向量
    var rotWorldMatrix = new THREE.Matrix4();      //创建一个4*4矩阵
    rotWorldMatrix.makeRotationAxis(axis.normalize(),  30 * Math.PI / 180 );
    rotWorldMatrix.multiply(cube.matrix);                // pre-multiply

    cube.matrix = rotWorldMatrix;
    cube.rotation.setFromRotationMatrix(cube.matrix);
    /**
     * 光源设置
     */
        //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    /**
     * 相机设置
     */
    var width = window.innerWidth; //窗口宽度
    var height = window.innerHeight; //窗口高度
    var k = width / height; //窗口宽高比
    var s = 15; //三维场景显示范围控制系数，系数越大，显示的范围越大
    //创建相机对象
    var camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
    camera.position.set(20, 30, 20); //设置相机位置
    camera.lookAt(scene.position); //设置相机方向(指向的场景对象)

    /**
     * 创建渲染器对象
     */
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height); //设置渲染区域尺寸
    renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
    document.body.appendChild(renderer.domElement); //body元素中插入canvas对象
    // 渲染函数
    function render() {
        renderer.render(scene, camera); //执行渲染操作
    }


    render();
    //创建控件对象  相机对象camera作为参数   控件可以监听鼠标的变化，改变相机对象的属性
    var controls = new OrbitControls(camera);
    //监听鼠标事件，触发渲染函数，更新canvas画布渲染效果
    controls.addEventListener('change', render);
}
