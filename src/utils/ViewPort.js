import * as THREE from "three";
import {TransformControls} from 'three/examples/jsm/controls/TransformControls';
import {EditorControls} from 'three/examples/jsm/controls/EditorControls';
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
        this.helpers = editor.helpers;
        this.select = editor.select;
        this.scene = editor.scene;
        this.sceneHelpers = editor.sceneHelpers;
        this.objects = [];

        this.objectPositionOnDown = null;
        this.objectRotationOnDown = null;
        this.objectScaleOnDown = null;

        this.onDownPosition = new THREE.Vector2();
        this.onUpPosition = new THREE.Vector2();
        this.onDoubleClickPosition = new THREE.Vector2();

        // helpers
        this.addHelpers();
        this.registerSignals();

        // Controls
        this.transformControls = new TransformControls(this.camera, this.container.dom);
        this.transformControls.addEventListener('change', () => {
                let object = this.transformControls.object;
                if (object !== undefined) {
                    this.selectionBox.setFromObject(object);
                    if (editor.helpers[object.id] !== undefined) {
                        console.log(editor);
                        editor.helpers[object.id].update();
                    }
                    // 更新object3d数据
                    // this.signals.refreshSidebarObject3D.dispatch(object);
                }
                this.render();
            }
        );
        this.transformControls.addEventListener('mouseDown', () => {
            console.log('mouseDown');
            let object = this.transformControls.object;
            this.objectPositionOnDown = object.position.clone();
            this.objectRotationOnDown = object.rotation.clone();
            this.objectScaleOnDown = object.scale.clone();
            this.controls.enabled = false;
        });
        this.transformControls.addEventListener('mouseUp', () => {
            console.log('mouseUp');
            let object = this.transformControls.object;

            if (object !== undefined) {
                switch (this.transformControls.getMode()) {

                    case 'translate':

                        if (!this.objectPositionOnDown.equals(object.position)) {

                            // editor.execute(new SetPositionCommand(object, object.position, this.objectPositionOnDown));

                        }

                        break;

                    case 'rotate':

                        if (!this.objectRotationOnDown.equals(object.rotation)) {

                            // editor.execute(new SetRotationCommand(object, object.rotation, this.objectRotationOnDown));

                        }

                        break;

                    case 'scale':

                        if (!this.objectScaleOnDown.equals(object.scale)) {

                            // editor.execute(new SetScaleCommand(object, object.scale, this.objectScaleOnDown));

                        }

                        break;

                }

            }

            this.controls.enabled = true;

        });

        this.sceneHelpers.add(this.transformControls);

        // object选取
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // events
        this.addEvents();
        this.controls = new EditorControls(this.camera, this.container.dom);
        this.controls.addEventListener('change', () => {
            this.signals.cameraChanged.dispatch(this.camera);
        });
    }

    addHelpers() {
        this.addGridHelpers();
        // add box
        this.box = new THREE.Box3();
        this.selectionBox = new THREE.BoxHelper();
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.visible = false;
        this.sceneHelpers.add(this.selectionBox);
    }

    registerSignals() {
        this.signals.editorCleared.add(_ => {
            this.controls.center.set(0, 0, 0);
            this.render();
        });
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
            console.log(this);
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

        this.signals.objectSelected.add((object) => {
            this.selectionBox.visible = false;
            this.transformControls.detach();
            if (object !== null && object !== this.scene && object !== this.camera) {
                // 判断当前选中的对象是否被object3d的子对象 是就选择父级
                if ("Object3D" === object.parent.type) {
                    object = object.parent;
                }
                // TODO: 给参数判断当前是选择物品还是面
                this.box.setFromObject(object);
                if (this.box.isEmpty() === false) {

                    this.selectionBox.setFromObject(object);
                    this.selectionBox.visible = true;
                }
                this.transformControls.attach(object);
            }
            console.log('objectSelected: %o', object);
            this.render();
        });

        this.signals.transformModeChanged.add((mode) => {
            this.transformControls.setMode(mode);
        });
        this.signals.spaceChanged.add((space) => {
            this.transformControls.setSpace(space);
        });

        this.signals.objectFocused.add(object => {
            this.controls.focus(object);
        });

        this.signals.objectChanged.add(object => {
            if (this.select === object) {
                this.selectionBox.setFromObject(object);
            }
            if (object.isPerspectiveCamera) {
                object.updateProjectionMatrix();
            }
            if (this.helpers[object.id] !== undefined) {
                this.helpers[object.id].update();
            }
            this.render();
        });

        this.signals.geometryChanged.add(object => {
            if (object !== undefined) {
                this.selectionBox.setFromObject(object);
            }
            this.render();
        });
    }

    render() {
        this.scene.updateMatrixWorld();
        this.renderer.render(this.scene, this.camera);
        if (this.camera === this.defaultCamera) {
            this.sceneHelpers.updateMatrixWorld();
            this.renderer.render(this.sceneHelpers, this.camera);
        }

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

    getMousePosition(dom, x, y) {
        let rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    }

    addEvents() {

        this.container.dom.addEventListener('mousedown', (ev) => this.onMouseDown(ev), false);
        this.container.dom.addEventListener('mouseup', (ev) => this.onMouseUp(ev), false);
        this.container.dom.addEventListener('touchstart', (ev) => this.onTouchStart(ev), false);
        this.container.dom.addEventListener('dblclick', (ev) => this.onDoubleClick(ev), false);
    }

    onMouseDown(event) {
        let arr = this.getMousePosition(this.container.dom, event.clientX, event.clientY);
        this.onDownPosition.fromArray(arr);
        // document.addEventListener("mouseup", (ev) => this.onMouseUp(ev), false);
    }

    onMouseUp(event) {
        let arr = this.getMousePosition(this.container.dom, event.clientX, event.clientY);
        this.onUpPosition.fromArray(arr);
        this.handleClick();
        // document.removeEventListener("mouseup", this.onMouseUp.bind(this), false);
    }

    onDoubleClick(event) {
        let array = this.getMousePosition(this.container.dom, event.clientX, event.clientY);
        this.onDoubleClickPosition.fromArray(array);

        let intersects = this.getIntersects(this.onDoubleClickPosition, this.objects);
        console.log(intersects);
        if (intersects.length > 0) {

            let intersect = intersects[0];

            this.signals.objectFocused.dispatch(intersect.object);

        }
    }


    onTouchStart(event) {

        let touch = event.changedTouches[0];

        let array = this.getMousePosition(this.container.dom, touch.clientX, touch.clientY);
        this.onDownPosition.fromArray(array);

        document.addEventListener('touchend', (event) => this.onTouchEnd(event), false);

    }

    onTouchEnd(event) {
        let touch = event.changedTouches[0];

        let array = this.getMousePosition(this.container.dom, touch.clientX, touch.clientY);
        this.onUpPosition.fromArray(array);

        this.handleClick();

        document.removeEventListener('touchend', ev => this.onTouchEnd(ev), false);
    }

    handleClick() {

        if (this.onDownPosition.distanceTo(this.onUpPosition) === 0) {

            let intersects = this.getIntersects(this.onUpPosition, this.objects);
            console.log(intersects);
            if (intersects.length > 0) {

                let object = intersects[0].object;

                if (object.userData.object !== undefined) {

                    // helper

                    this.select(object.userData.object);

                } else {

                    this.select(object);

                }

            } else {

                this.select(null);

            }

            this.render();

        }
    }

    /**
     * // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
     */
    getIntersects(point, objects) {

        this.mouse.set((point.x * 2) - 1, -(point.y * 2) + 1);
        // 通过摄像机和鼠标位置更新射线
        this.raycaster.setFromCamera(this.mouse, this.camera);
        // 计算物体和射线的焦点
        return this.raycaster.intersectObjects(objects);
    }

}
