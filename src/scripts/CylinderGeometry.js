import {SetValueCommand} from "../utils/Commands/SetValueCommand";
import * as THREE from 'three';
import {AddObjectCommand} from "../utils/Commands/AddObjectCommand";

export class CylinderGeometry {
    constructor(editor, radius, segments) {
        this.signals = editor.signals;
        this.radius = radius || 3;
        this.segments = segments || 200;
        // 设置相机
        editor.execute(new SetValueCommand(editor.viewportCamera, 'fov', 75));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'aspect', innerWidth / innerHeight));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'near', 1));
        editor.execute(new SetValueCommand(editor.viewportCamera, 'far', 100));
        // 设置圆
        this.addCircle(editor);
    }

    addCircle(editor) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x335599,
            specular: 0x335599,
            shininess: 15,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
        const parent = new THREE.Object3D();
        parent.add(new THREE.AxesHelper(5));
        let circle = new THREE.CircleGeometry(this.radius, this.segments);
        const circle1 = new THREE.Mesh(circle, material);
        const circle2 = new THREE.Mesh(circle, material);
        circle1.name = 'circle1';
        circle2.name = 'circle2';
        circle2.position.x = 10;
        parent.add(circle1, circle2);
        editor.execute(new AddObjectCommand(parent));
    }
}
