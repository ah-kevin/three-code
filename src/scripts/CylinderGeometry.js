import {SetValueCommand} from "../utils/Commands/SetValueCommand";
import * as THREE from 'three';
import {AddObjectCommand} from "../utils/Commands/AddObjectCommand";
import {SetPositionCommand} from "../utils/Commands/SetPositionCommand";
import {SetRotationCommand} from "../utils/Commands/SetRotationCommand";

export class CylinderGeometry {
    constructor(editor, radius, segments) {
        this.signals = editor.signals;
        this.radius = radius || 3;
        this.segments = segments || 200;
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
        // editor.execute(new SetPositionCommand(editor.viewportCamera, new THREE.Vector3(0, 5, 12)));
        // 设置圆
        this.addCircle(editor);
    }

    addCircle(editor) {
        const camera = new THREE.PerspectiveCamera(
            70,
            innerWidth / innerHeight,
            1,
            100
        );
        camera.position.set(11, 8, 12);
        camera.lookAt(0, 0, 0);
        editor.execute(new AddObjectCommand(camera));
        editor.setViewportCamera(camera.uuid);

        const material = new THREE.MeshPhongMaterial({
            color: 0x335599,
            specular: 0x335599,
            shininess: 15,
            flatShading: THREE.FlatShading,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const light1 = new THREE.DirectionalLight(0xffffff);
        light1.position.set(-5, 10, 10);
        const light2 = new THREE.PointLight(0xffffff, 0.7, 0);
        light2.position.set(5, 5, -5);
        // editor.execute(new AddObjectCommand(light1));
        // editor.execute(new AddObjectCommand(light2));

        const parent = new THREE.Object3D();
        parent.add(new THREE.AxesHelper(5));
        let circle = new THREE.CircleGeometry(this.radius, this.segments);
        const circle1 = new THREE.Mesh(circle, material);
        const circle2 = new THREE.Mesh(circle, material);
        circle1.rotation.x = circle2.rotation.x = Math.PI / 2;
        circle1.rotation.y = this.tween.circle1;
        circle2.rotation.y = this.tween.circle2;
        circle1.position.y = this.height / 2;
        circle2.position.y = -this.height / 2;
        circle1.name = 'circle1';
        circle2.name = 'circle2';
        this.moveCenter(circle1, circle2);
        parent.add(circle1, circle2);
        editor.execute(new SetPositionCommand(parent, new THREE.Vector3(0, this.height / 2, 0)));
        editor.execute(new SetRotationCommand(parent, new THREE.Euler(0, Math.PI, 0)));
        editor.execute(new AddObjectCommand(parent));
    }

    moveCenter(...arg) {
        for (let i = 0; i < arg.length; i++) {
            for (let j = 0; j < arg[i].geometry.vertices.length; j++) {
                arg[i].geometry.vertices[j].x -= this.radius / 2;
            }
            arg[i].geometry.verticesNeedUpdate = true;
        }
    }

}
