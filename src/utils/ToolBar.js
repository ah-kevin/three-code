import UI from "./ui";
import * as THREE from 'three';
import {AddObjectCommand} from "./Commands/AddObjectCommand";
import {SetValueCommand} from "./Commands/SetValueCommand";

export class ToolBar {
    constructor(editor) {
        this.signals = editor.signals;
        this.container = new UI.Panel();
        this.container.setId('toolbar');
        this.container.setDisplay('none');
        // this.container.setHeight('32px');
        this.transform(editor);
    }

    transform() {
        let groups = new UI.Panel();
        // groups.setDisplay('none');
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

            this.signals.spaceChanged.dispatch(local.getValue() === true ? 'local' : 'world');

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
            this.container.setDisplay(object === null ? 'none' : '');
            // if (object !== null) {
            //     this.container.setHeight('64px');
            // } else {
            //     this.container.setHeight('32px');
            // }
        });
    }
}
