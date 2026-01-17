import { buildFileAst } from './out/src/ast/builder.js';

// Test with a simple object
console.log('=== Testing Simple Object ===');
const objectText = 'object TestObject { string name; }';
const result1 = buildFileAst(objectText, 'file:///test-object.mez');
console.log('Objects found:', result1.objects.length);
console.log('Object name:', result1.objects[0]?.name);

// Test with a simple unit
console.log('\n=== Testing Simple Unit ===');
const unitText = 'unit TestUnit;\nvoid testFunc() { }';
const result2 = buildFileAst(unitText, 'file:///test-unit.mez');
console.log('Units found:', result2.units.length);
console.log('Unit name:', result2.units[0]?.name);

// Test with a simple enum
console.log('\n=== Testing Simple Enum ===');
const enumText = 'enum TEST_ENUM { Value1, Value2 }';
const result3 = buildFileAst(enumText, 'file:///test-enum.mez');
console.log('Enums found:', result3.enums.length);
console.log('Enum name:', result3.enums[0]?.name);
