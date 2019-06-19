import * as THREE from "three";
import UI from "./ui";

export class ViewPort {
    constructor(editor) {
        this.container = new UI.Panel();
        // 设置dom的样式
        this.container.setId('viewport');
        this.container.setPosition('absolute');
        this.container.setTop('0');
        this.container.setBottom('0');
        this.container.setLeft('0');
        this.container.setRight('0');

        this.signals = editor.signals;
        this.renderer = null;
        this.camera = editor.camera;
        this.defaultCamera = editor.camera;
        this.scene = editor.scene;
        this.sceneHelpers = editor.sceneHelpers;
        this.objects = [];

        // helpers
        this.addHelpers();
        this.registerSignals();
    }

    addHelpers() {
        // this.addGridHelpers();
        // add box
        const box = new THREE.Box3();
        const selectionBox = new THREE.BoxHelper();
        selectionBox.material.depthTest = false;
        selectionBox.material.transparent = true;
        selectionBox.visible = false;
        this.sceneHelpers.add(selectionBox);
    }

    registerSignals() {
        this.signals.editorCleared.add(_ => this.render());
        this.signals.rendererChanged.add(newRenderer => {
            if (this.renderer !== null) {
                this.container.dom.removeChild(this.renderer.domElement);
            }
            this.renderer = newRenderer;

            this.renderer.autoClear = false;
            this.renderer.gammaOutput = true;
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(this.container.dom.offsetWidth, this.container.dom.offsetHeight);
            this.container.dom.appendChild(this.renderer.domElement);
            this.render();
        });
        this.signals.sceneGraphChanged.add(_ => {
            this.render();
        });
        this.signals.cameraChanged.add(_ => {
            this.render();
        });
        this.signals.objectAdded.add((object) => {
            object.traverse((child) => {
                this.objects.push(child);
            });
        });
        this.signals.objectRemoved.add((object) => {
            object.traverse((child) => {
                this.objects.splice(this.objects.indexOf(child), 1);
            });
        });
    }

    render() {
        this.scene.updateMatrixWorld();
        this.renderer.render(this.scene, this.camera);
        if (this.camera === this.defaultCamera) {
            this.sceneHelpers.updateMatrixWorld();
            this.renderer.render(this.sceneHelpers, this.camera);
        }
        console.log(this.scene);

    }

    addGridHelpers() {
        const grid = new THREE.GridHelper(30, 30, 0x444444, 0x888888);
        this.sceneHelpers.add(grid);
        let array = grid.geometry.attributes.color.array;
        for (let i = 0; i < array.length; i += 60) {
            for (let j = 0; j < 12; j++) {
                array[i + j] = 0.26;
            }
        }
    }
}
