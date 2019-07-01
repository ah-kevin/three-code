import {SetValueCommand} from "../utils/Commands/SetValueCommand";
import * as THREE from 'three';
import {AddObjectCommand} from "../utils/Commands/AddObjectCommand";
import {SetPositionCommand} from "../utils/Commands/SetPositionCommand";
import {SetRotationCommand} from "../utils/Commands/SetRotationCommand";
import {TimelineLite, Power0} from 'gsap/all';

export class CylinderGeometry {
    constructor(editor, radius, segments) {
        this.signals = editor.signals;
        this.radius = radius || 3;
        this.segments = segments || 200;
        // this.height = this.radius * 2;
        this.height = this.radius * 2;
        this.tween = {
            angle: 0,
            circle1: -Math.PI / 2,
            circle2: Math.PI / 2
        };
        // 设置相机
        editor.execute(new SetValueCommand(editor.viewportCamera, 'fov', 75));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'aspect', innerWidth / innerHeight));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'near', 1));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'far', 100));
        editor.execute(new SetPositionCommand(editor.viewportCamera, new THREE.Vector3(11, 8, 12)));
        editor.camera.lookAt(0, 0, 0);

        // 设置光源
        const light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(-5, 10, 10);
        const light2 = new THREE.PointLight(0xffffff, 0.7, 0);
        light2.position.set(5, 5, -5);
        editor.execute(new AddObjectCommand(light1));
        editor.execute(new AddObjectCommand(light2));

        this.parent = new THREE.Object3D();
        this.parent.add(new THREE.AxesHelper(5));


        // 设置圆
        this.addCircle(editor);
        // 设置长方形
        this.addWrapper(editor);

        editor.execute(new SetPositionCommand(this.parent, new THREE.Vector3(0, this.height / 2, 0)));
        editor.execute(new SetRotationCommand(this.parent, new THREE.Euler(0, Math.PI, 0)));
        editor.execute(new AddObjectCommand(this.parent));
        this.setAnimation(editor);
    }

    addCircle(editor) {
        // const camera = new THREE.PerspectiveCamera(
        //     70,
        //     innerWidth / innerHeight,
        //     1,
        //     100
        // );
        // camera.position.set(11, 8, 12);
        // camera.lookAt(0, 0, 0);
        // editor.execute(new AddObjectCommand(camera));
        // editor.setViewportCamera(camera.uuid);
        // editor.execute(new SetHelperCommand(camera));
        this.material = new THREE.MeshPhongMaterial({
            color: 0x335599,
            specular: 0x335599,
            shininess: 15,
            flatShading: THREE.FlatShading,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });


        let circle = new THREE.CircleGeometry(this.radius, this.segments);
         this.circle1 = new THREE.Mesh(circle, this.material);
        this.circle2 = new THREE.Mesh(circle, this.material);
        this.circle1.rotation.x = this.circle2.rotation.x = Math.PI / 2;
        this.circle1.rotation.y = this.tween.circle1;
        this.circle2.rotation.y = this.tween.circle2;
        this.circle1.position.y = this.height / 2;
        this.circle2.position.y = -this.height / 2;
        this.circle1.name = 'circle1';
        this.circle2.name = 'circle2';
        this.moveCenter(this.circle1, this.circle2);
        this.parent.add(this.circle1, this.circle2);


    }

    moveCenter(...arg) {
        for (let i = 0; i < arg.length; i++) {
            for (let j = 0; j < arg[i].geometry.vertices.length; j++) {
                arg[i].geometry.vertices[j].x -= this.radius / 2;
            }
            arg[i].geometry.verticesNeedUpdate = true;
        }
    }

    addWrapper(editor) {
        const geo = new THREE.Geometry();
        this.segLength = (Math.PI * 2 * this.radius) / this.segments;
        geo.vertices.push(new THREE.Vector3(0, this.height / 2, 0));
        geo.vertices.push(new THREE.Vector3(0, -this.height / 2, 0));
        for (let i = 0; i < Math.floor(this.segments / 2); i++) {
            geo.vertices.push(new THREE.Vector3(0, this.height / 2, this.segLength * i));
            geo.vertices.push(new THREE.Vector3(0, -this.height / 2, this.segLength * i));
            geo.vertices.push(new THREE.Vector3(0, this.height / 2, -this.segLength * i));
            geo.vertices.push(new THREE.Vector3(0, -this.height / 2, -this.segLength * i));
        }
        geo.faces.push(new THREE.Face3(0, 1, 2));
        geo.faces.push(new THREE.Face3(1, 2, 3));
        geo.faces.push(new THREE.Face3(0, 1, 4));
        geo.faces.push(new THREE.Face3(1, 4, 5));
        for (var i = 1; i < Math.floor(this.segments / 2); i++) {
            geo.faces.push(
                new THREE.Face3(2 + (i - 1) * 4, 3 + (i - 1) * 4, 6 + (i - 1) * 4)
            );
            geo.faces.push(
                new THREE.Face3(3 + (i - 1) * 4, 6 + (i - 1) * 4, 7 + (i - 1) * 4)
            );
            geo.faces.push(
                new THREE.Face3(4 + (i - 1) * 4, 5 + (i - 1) * 4, 8 + (i - 1) * 4)
            );
            geo.faces.push(
                new THREE.Face3(5 + (i - 1) * 4, 8 + (i - 1) * 4, 9 + (i - 1) * 4)
            );
        }
        const wrapper = new THREE.Mesh(geo, this.material);
        this.parent.add(wrapper);
    }

    setAnimation() {
        const tl = new TimelineLite();

        tl.to(this.tween, 1.5, {
            angle: Math.PI / this.segments,
            circle1: 0,
            circle2: 0,
            ease: Power0.easeNone,
            onUpdate: () => this.update(),
            onComplete: function () {
                tl.pause();
            }
        });
        tl.progress(1);
        setTimeout(function () {
            tl.reverse();
        }, 800);
    }

    update(ed) {
        // 圆动画
        this.circle1.rotation.y = this.tween.circle1;
        this.circle2.rotation.y = this.tween.circle2;
        this.signals.sceneGraphChanged.dispatch();
    }
}
