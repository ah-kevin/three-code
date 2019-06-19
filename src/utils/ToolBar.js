import UI from "./ui";
import * as THREE from 'three';
import {AddObjectCommand} from "./Commands/AddObjectCommand";

export class ToolBar {
    constructor(editor) {
        this.signals = editor.signals;
        this.container = new UI.Panel();
        this.container.setId('toolbar');
        this.container.setHeight('32px');
        this.transform(editor);
        this.addButton(editor);
    }

    addButton(editor) {
        let buttons = new UI.Panel();
        this.container.add(buttons);

        let addBox = new UI.Button('圆柱体');
        addBox.dom.className = 'Button';
        addBox.onClick(_ => {
            const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
            const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
            mesh.name = 'Box';
            editor.execute(new AddObjectCommand(mesh));
        });
        buttons.add(addBox);
    }

    transform(editor) {
        let groups = new UI.Panel();
        groups.setDisplay('none');
        this.container.add(groups);
        // translate / rotate / scale

        var translate = new UI.Button('移动');
        translate.dom.className = 'Button selected';
        translate.onClick(() => {

            this.signals.transformModeChanged.dispatch('translate');

        });
        groups.add(translate);

        const rotate = new UI.Button('旋转');

        rotate.onClick(() => {

            this.signals.transformModeChanged.dispatch('rotate');

        });
        groups.add(rotate);

        const scale = new UI.Button('缩放');
        scale.onClick(() => {

            this.signals.transformModeChanged.dispatch('scale');

        });
        groups.add(scale);

        var local = new UI.THREE.Boolean(false, '本地');
        local.onChange(() => {

            this.signals.spaceChanged.dispatch(this.getValue() === true ? 'local' : 'world');

        });
        groups.add(local);
        this.signals.transformModeChanged.add((mode) => {

            translate.dom.classList.remove('selected');
            rotate.dom.classList.remove('selected');
            scale.dom.classList.remove('selected');

            switch (mode) {
                case 'translate':
                    translate.dom.classList.add('selected');
                    break;
                case 'rotate':
                    rotate.dom.classList.add('selected');
                    break;
                case 'scale':
                    scale.dom.classList.add('selected');
                    break;
            }

        });
        this.signals.objectSelected.add((object) => {
            groups.setDisplay(object === null ? 'none' : '');
            if (object !== null) {
                this.container.setHeight('64px');
            }
        });
    }
}
