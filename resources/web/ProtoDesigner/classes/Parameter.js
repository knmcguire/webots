'use strict';

import {VRML, vrmlTypeAsString} from './utility/utility.js';

export default class Parameter {
  constructor(name, type, isRegenerator, defaultValue, value) {
    this.nodeRefs = []; // a parameter can reference one or more nodes (ex: multiple IS)
    this.refNames = []; // name as defined in the body of the proto (i.e value before an IS)
    this.name = name; // name as defined in the proto header (i.e value after an IS)
    this.type = type;
    this.isTemplateRegenerator = isRegenerator;
    this.defaultValue = defaultValue;
    this.value = value;
    this.linkedProto = undefined; // SFNode fields can reference other proto files
  };

  isSFNode() {
    return this.type === VRML.SFNode;
  };

  exportVrml() {
    return 'field ' + vrmlTypeAsString(this.type) + ' ' + this.name + ' ' + this.vrmlify();
  };

  vrmlify() {
    switch (this.type) {
      case VRML.SFBool:
        return this.value.toString().toUpperCase();
      case VRML.SFFloat:
      case VRML.SFInt32:
        return this.value.toString();
      case VRML.SFString:
        return this.value;
      case VRML.SFVec2f:
        return this.value.x + ' ' + this.value.y;
      case VRML.SFVec3f:
      case VRML.SFColor:
        return this.value.x + ' ' + this.value.y + ' ' + this.value.z;
      case VRML.SFRotation:
        return this.value.x + ' ' + this.value.y + ' ' + this.value.z + ' ' + this.value.w;
      case VRML.SFNode:
        if (typeof this.value !== 'undefined')
          console.error('TODO: implement SFNode in vrmlify.');
        return 'NULL';
      default:
        throw new Error('Unknown type \'' + this.type + '\' in x3dify.');
    }
  }

  x3dify() {
    switch (this.type) {
      case VRML.SFBool:
      case VRML.SFFloat:
      case VRML.SFInt32:
      case VRML.SFString:
        return this.value;
      case VRML.SFVec2f:
        return this.value.x + ' ' + this.value.y;
      case VRML.SFVec3f:
      case VRML.SFColor:
        return this.value.x + ' ' + this.value.y + ' ' + this.value.z;
      case VRML.SFRotation:
        return this.value.x + ' ' + this.value.y + ' ' + this.value.z + ' ' + this.value.w;
      case VRML.SFNode:
        if (typeof this.value !== 'undefined')
          console.error('TODO: implement SFNode in x3dify.');
        return;
      default:
        throw new Error('Unknown type \'' + this.type + '\' in x3dify.');
    }
  }

  jsify(isColor = false) { // encodes field values in a format compliant for the template engine VRLM generation
    return '{value: ' + this._jsifyVariable(this.value, isColor) + ', defaultValue: ' + this._jsifyVariable(this.defaultValue, isColor) + '}';
  };

  _jsifyVariable(variable, isColor) {
    switch (this.type) {
      case VRML.SFBool:
      case VRML.SFFloat:
      case VRML.SFInt32:
        return variable;
      case VRML.SFString:
        return '\'' + variable + '\'';
      case VRML.SFVec2f:
        return '{x: ' + variable.x + ', y: ' + variable.y + '}';
      case VRML.SFVec3f:
      case VRML.SFColor:
        if (isColor)
          return '{r: ' + variable.x + ', g: ' + variable.y + ', b: ' + variable.z + '}';
        return '{x: ' + variable.x + ', y: ' + variable.y + ', z: ' + variable.z + '}';
      case VRML.SFRotation:
        return '{x: ' + variable.x + ', y: ' + variable.y + ', z: ' + variable.z + ', w: ' + variable.w + '}';
      case VRML.SFNode:
        if (typeof variable !== 'undefined')
          console.error('TODO: implement SFNode in _jsifyVariable.');
        return;
      default:
        throw new Error('Unknown type \'' + this.type + '\' in _jsifyVariable.');
    }
  }
};
