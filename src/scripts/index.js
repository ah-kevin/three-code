import '../styles/index.scss';

import { Editor } from '../utils/Editor';
import { ViewPort } from '../utils/ViewPort';
import { WebGLRenderer } from 'three';
import { AddObjectCommand } from '../utils/Commands/AddObjectCommand';
import UI from '../utils/ui';
import { ToolBar } from '../utils/ToolBar';
import { ViewPortInfo } from '../utils/ViewPort.info';
import { CylinderGeometry } from './CylinderGeometry';
import * as THREE from 'three';
const editor = new Editor({
  helper: false
});
const viewport = new ViewPortInfo(editor, true);
document.body.appendChild(viewport.container.dom);
const toolBar = new ToolBar(editor);
document.body.appendChild(toolBar.container.dom);
const render = new WebGLRenderer();
//
editor.signals.rendererChanged.dispatch(render);
// const cylinder = new CylinderGeometry(editor);
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
mesh.name = 'Box';
editor.execute(new AddObjectCommand(mesh));

console.log(editor);
