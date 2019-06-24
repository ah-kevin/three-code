import * as THREE from 'three';
import signals from "signals";
import History from './history';

export class Editor {
    constructor() {
        this.DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.01, 1000);
        this.DEFAULT_CAMERA.name = "Camera";
        this.DEFAULT_CAMERA.position.set(0, 5, 10);
        this.DEFAULT_CAMERA.lookAt(new THREE.Vector3());
        const Signal = signals.Signal;
        this.signals = {

            // script

            editScript: new Signal(),

            // player

            startPlayer: new Signal(),
            stopPlayer: new Signal(),

            // notifications

            editorCleared: new Signal(),

            savingStarted: new Signal(),
            savingFinished: new Signal(),

            themeChanged: new Signal(),

            transformModeChanged: new Signal(),
            snapChanged: new Signal(),
            spaceChanged: new Signal(),
            rendererChanged: new Signal(),

            sceneBackgroundChanged: new Signal(),
            sceneFogChanged: new Signal(),
            sceneGraphChanged: new Signal(),

            cameraChanged: new Signal(),

            geometryChanged: new Signal(),

            objectSelected: new Signal(),
            objectFocused: new Signal(),

            objectAdded: new Signal(),
            objectChanged: new Signal(),
            objectRemoved: new Signal(),

            cameraAdded: new Signal(),
            cameraRemoved: new Signal(),

            helperAdded: new Signal(),
            helperRemoved: new Signal(),

            materialChanged: new Signal(),

            scriptAdded: new Signal(),
            scriptChanged: new Signal(),
            scriptRemoved: new Signal(),

            windowResize: new Signal(),

            showGridChanged: new Signal(),
            refreshSidebarObject3D: new Signal(),
            historyChanged: new Signal(),

            viewportCameraChanged: new Signal()

        };
        this.history = new History(this);
        this.camera = this.DEFAULT_CAMERA.clone();

        this.scene = new THREE.Scene();
        this.scene.name = 'Scene';
        this.scene.background = new THREE.Color(0xaaaaaa);

        this.sceneHelpers = new THREE.Scene();

        this.object = {};
        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.scripts = {};

        this.animations = {};
        this.mixer = new THREE.AnimationMixer(this.scene);

        this.selected = null;
        this.helpers = {};

        this.cameras = {};
        this.viewportCamera = this.camera;

        this.addCamera(this.camera);
        this.addHelper();
    }


    setScene(scene) {

        this.scene.uuid = scene.uuid;
        this.scene.name = scene.name;

        if (scene.background !== null) this.scene.background = scene.background.clone();
        if (scene.fog !== null) this.scene.fog = scene.fog.clone();

        this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

        // 表面过度渲染

        this.signals.sceneGraphChanged.active = false;

        while (scene.children.length > 0) {

            this.addObject(scene.children[0]);

        }

        this.signals.sceneGraphChanged.active = true;
        this.signals.sceneGraphChanged.dispatch();

    }

    addCamera(camera) {
        if (camera.isCamera) {

            this.cameras[camera.uuid] = camera;

            this.signals.cameraAdded.dispatch(camera);
        }
    }

    removeCamera(camera) {
        if (this.cameras[camera.uuid] !== undefined) {
            delete this.cameras[camera.uuid];
            this.signals.cameraRemoved.dispatch(camera);
        }
    }

    addHelper() {

        const geometry = new THREE.SphereBufferGeometry(2, 4, 2);
        const material = new THREE.MeshBasicMaterial({color: 0xff0000, visible: false});
        return function (object) {
            let helper;
            if (object.isCamera) {

                helper = new THREE.CameraHelper(object);

            } else if (object.isPointLight) {

                helper = new THREE.PointLightHelper(object, 1);

            } else if (object.isDirectionalLight) {

                helper = new THREE.DirectionalLightHelper(object, 1);

            } else if (object.isSpotLight) {

                helper = new THREE.SpotLightHelper(object, 1);

            } else if (object.isHemisphereLight) {

                helper = new THREE.HemisphereLightHelper(object, 1);

            } else if (object.isSkinnedMesh) {

                helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);

            } else {
                // no helper for this object type
                return;
            }
            const picker = new THREE.Mesh(geometry, material);
            picker.name = 'picker';
            picker.userData.object = object;
            helper.add(picker);
            this.sceneHelpers.add(helper);
            this.helpers[object.id] = helper;
            this.signals.helperAdded.dispatch(helper);
        };
    }

    removeHelper(object) {
        if (this.helpers[object.id] !== undefined) {
            let helper = this.helpers[object.id];
            helper.parent.remove(helper);
            delete this.helpers[object.id];
            this.signals.helperRemoved.dispatch(helper);
        }
    }

    addScript(object, script) {

        if (this.scripts[object.uuid] === undefined) {

            this.scripts[object.uuid] = [];

        }

        this.scripts[object.uuid].push(script);

        this.signals.scriptAdded.dispatch(script);

    }

    removeScript(object, script) {

        if (this.scripts[object.uuid] === undefined) return;

        var index = this.scripts[object.uuid].indexOf(script);

        if (index !== -1) {

            this.scripts[object.uuid].splice(index, 1);

        }

        this.signals.scriptRemoved.dispatch(script);

    }

    clear() {
        this.history.clear();
        this.camera.copy(this.DEFAULT_CAMERA);
        this.scene.name = "Scene";
        this.scene.userData = {};
        this.scene.background.setHex(0xaaaaaa);
        this.scene.fog = null;

        let objects = this.scene.children;

        while (objects.length > 0) {
            this.removeObject(objects[0]);
        }

        this.geometries = {};
        this.materials = {};
        this.textures = {};
        this.scripts = {};

        this.animations = {};
        this.mixer.stopAllAction();

        this.deselect();

        this.signals.editorCleared.dispatch();

    }

    deselect() {

        this.select(null);

    }

    select(object) {
        if (this.selected === object) return;

        this.selected = object;

        this.signals.objectSelected.dispatch(object);
    }

    selectById(id) {

        if (id === this.camera.id) {

            this.select(this.camera);
            return;

        }

        this.select(this.scene.getObjectById(id, true));

    }

    selectByUuid(uuid) {

        var scope = this;

        this.scene.traverse(function (child) {

            if (child.uuid === uuid) {

                scope.select(child);

            }

        });

    }

    focus(object) {
        if (object !== undefined) {
            this.signals.objectChanged.dispatch(object);
        }
    }

    foucusById(id) {
        this.focus(this.scene.getObjectById(id, true));
    }

    addObject(object) {
        object.traverse((child) => {
            if (child.geometry !== undefined) this.addGeometry(child.geometry);
            if (child.material !== undefined) this.addMaterial(child.material);
            this.addCamera(child);
            this.addHelper(child);
        });
        this.scene.add(object);
        this.signals.objectAdded.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();
    }

    removeObject(object) {

        if (object.parent === null) return; // avoid deleting the camera or scene


        object.traverse((child) => {
            this.removeCamera(child);
            this.removeHelper(child);
        });

        object.parent.remove(object);
        this.signals.objectRemoved.dispatch(object);
        this.signals.sceneGraphChanged.dispatch();
    }

    objectByUuid(uuid) {

        return this.scene.getObjectByProperty('uuid', uuid, true);

    }

    addGeometry(geometry) {
        this.geometries[geometry.uuid] = geometry;
    }

    addMaterial(material) {
        this.materials[material.uuid] = material;
    }

    execute(cmd, optionalName) {
        this.history.excute(cmd, optionalName);
    }
}
