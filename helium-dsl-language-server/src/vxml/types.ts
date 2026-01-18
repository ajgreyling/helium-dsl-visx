export type VxmlPosition = {
  line: number;
  character: number;
};

export type VxmlRange = {
  start: VxmlPosition;
  end: VxmlPosition;
};

export type VxmlAttribute = {
  name: string;
  value?: string;
  nameRange: VxmlRange;
  valueRange?: VxmlRange;
};

export type VxmlTextSegment = {
  text: string;
  range: VxmlRange;
};

export type VxmlNode = {
  name: string;
  attributes: VxmlAttribute[];
  children: VxmlNode[];
  range: VxmlRange;
  parent?: VxmlNode;
  textSegments: VxmlTextSegment[];
};

export type VxmlViewInfo = {
  unitName?: string;
  initFunction?: string;
  labelKey?: string;
  range: VxmlRange;
};

export type VxmlReference =
  | { kind: "unit"; name: string; range: VxmlRange }
  | { kind: "function"; name: string; range: VxmlRange; unitName?: string }
  | { kind: "variable"; name: string; range: VxmlRange; unitName?: string }
  | { kind: "attribute"; name: string; range: VxmlRange }
  | { kind: "enum"; name: string; range: VxmlRange }
  | { kind: "langKey"; name: string; range: VxmlRange; attrName?: string };

export type VxmlAst = {
  uri: string;
  rootNodes: VxmlNode[];
  view?: VxmlViewInfo;
  references: VxmlReference[];
};

