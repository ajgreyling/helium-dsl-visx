"use strict";
// Generated from generated/grammar/MezDSL.g4 by ANTLR 4.9.0-SNAPSHOT
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipMultiplicityContext = exports.AtomicValidatorContext = exports.ValidatorContext = exports.ValidatorAnnotationContext = exports.NotTrackedAnnotationContext = exports.RestrictedAttributeAnnotationContext = exports.RestrictedObjectAnnotationContext = exports.RoleAnnotationContext = exports.ResponseExcludeAnnotationContext = exports.ResponseExpandAnnotationContext = exports.DeleteAnnotationContext = exports.PutAnnotationContext = exports.GetAnnotationContext = exports.PostAnnotationContext = exports.OnPaymentStatusRequestResultUpdateAnnotationContext = exports.OnSmsResultUpdateAnnotationContext = exports.OnScheduledFunctionResultUpdateAnnotationContext = exports.OnPaymentUpdateAnnotationContext = exports.RoleNameAnnotationContext = exports.InviteUserAnnotationContext = exports.ScheduledAnnotationContext = exports.UssdAnnotationContext = exports.UnitTestAnnotationContext = exports.ReceiveSMSAnnotationContext = exports.FunctionAnnotationContext = exports.AttributeAnnotationContext = exports.ObjectAnnotationContext = exports.MultiplicityAnnotationContext = exports.EnumValueContext = exports.EnumerationContext = exports.EnumAttributeContext = exports.PrimitiveAttributeContext = exports.RelationshipContext = exports.ObjectAttributeContext = exports.PersistentObjectContext = exports.AfterDeleteContext = exports.BeforeDeleteContext = exports.AfterUpdateContext = exports.BeforeUpdateContext = exports.AfterCreateContext = exports.BeforeCreateContext = exports.TriggerContext = exports.SimpleObjectContext = exports.CustomObjectContext = exports.UnitContext = exports.PersistenceElementContext = exports.PersistenceContext = exports.ScriptContentContext = exports.ScriptContext = exports.MezDSLParser = void 0;
exports.EqualityOperatorContext = exports.ComparisonOperatorContext = exports.ComparisonExpressionContext = exports.EqualityExpressionContext = exports.AndExpressionContext = exports.OrExpressionContext = exports.ExpressionContext = exports.AssignStatementContext = exports.EmailAttachmentContext = exports.EmailNamedAttachmentContext = exports.SystemBIFStatementContext = exports.PersistenceBIFStatementContext = exports.ForcePasswordResetStatementBIFContext = exports.RemoveRoleStatementBIFContext = exports.NotificationStatementBIFContext = exports.CollectionsStatementBIFContext = exports.InstanceBIFStatementContext = exports.AssertBIFContext = exports.AssertBIFStatementContext = exports.BifStatementContext = exports.ThrowStatementContext = exports.ElsePartContext = exports.ElseIfPartContext = exports.IfStatementContext = exports.FinallyPartContext = exports.CatchPartContext = exports.TryStatementContext = exports.ForLoopConditionOperatorContext = exports.ForLoopPostLoopContext = exports.ForLoopConditionContext = exports.ForLoopInitialConditionContext = exports.ForLoopParamsContext = exports.ForLoopContext = exports.ForEachContext = exports.ComplexStatementContext = exports.DecrementStatementContext = exports.IncrementStatementContext = exports.SimpleStatementContext = exports.ReturnStatementContext = exports.StatementContext = exports.ParameterContext = exports.TypeNameContext = exports.SpecialFunctionNameContext = exports.FunctionSignatureContext = exports.CodeBlockContentContext = exports.CodeBlockContext = exports.FunctionDefinitionContext = exports.VariableTypeContext = exports.VariableDeclareInitContext = exports.VariableDeclarationContext = void 0;
exports.StringUrlDecodeBIFContext = exports.StringUrlEncodeBIFContext = exports.StringReplaceAllBIFContext = exports.StringRegexFindBIFContext = exports.StringRegexReplaceAllBIFContext = exports.StringRegexReplaceFirstBIFContext = exports.StringRegexMatchBIFContext = exports.StringUpperBIFContext = exports.StringSubstringBIFContext = exports.StringStartsWithBIFContext = exports.StringSplitBIFContext = exports.StringLowerBIFContext = exports.StringLengthBIFContext = exports.StringJoinBIFContext = exports.StringIndexOfBIFContext = exports.StringEndsWithBIFContext = exports.StringConcatBIFContext = exports.StringTranslateBIFContext = exports.StringBIFExpressionContext = exports.StringsSplitBIFContext = exports.StringsLengthBIFContext = exports.StringsConcatBIFContext = exports.StringsBIFExpressionContext = exports.MathBIFExpressionContext = exports.ApiBIFStatementContext = exports.ApiBIFExpressionContext = exports.SystemBIFExpressionContext = exports.CollectionsExpressionBIFContext = exports.BatchCreateExpressonBIFContext = exports.JsonExpressionBIFContext = exports.JsonBIFStatementContext = exports.InstanceBIFExpressionContext = exports.BifExpressionContext = exports.DecrementExpressionContext = exports.IncrementExpressionContext = exports.AccessExpressionContext = exports.MemberAttributeContext = exports.MemberFunctionContext = exports.MemberAccessContext = exports.ValueExpressionContext = exports.FunctionCallContext = exports.EnumValueExpressionEntryContext = exports.EnumValueExpressionContext = exports.LiteralExpressionContext = exports.AtomicExpressionContext = exports.SimpleExpressionContext = exports.MultOperatorContext = exports.MultExpressionContext = exports.AddOperatorContext = exports.AddExpressionContext = void 0;
exports.PrimitiveTypeContext = exports.SelectorBIFContext = exports.SimpleSelectorBIFContext = exports.PersistenceBIFExpressionContext = exports.SqlBIFParamContext = exports.SqlBIFExpressionContext = exports.HeliumGetPlatformBIFContext = exports.HeliumBIFExpressionContext = exports.BlobToStringBIFContext = exports.BlobWrapperFromStringBIFContext = exports.BlobFromStringBIFContext = exports.BlobBIFExpressionContext = exports.UuidFromStringBIFContext = exports.UuidBIFExpressionContext = exports.LongFromStringBIFContext = exports.LongBIFExpressionContext = exports.DecimalFromStringBIFContext = exports.DecimalBIFExpressionContext = exports.IntegerFromStringBIFContext = exports.IntegerBIFExpressionContext = exports.DateTimeFromLongBIFContext = exports.DateTimeFromISOStringBIFContext = exports.DateFromISOStringBIFContext = exports.DateTimeFromStringBIFContext = exports.DateFromStringBIFContext = exports.DateTodayBIFContext = exports.DateNowBIFContext = exports.DateSecondsBetweenBIFContext = exports.DateMonthsBetweenBIFContext = exports.DateExtractBIFContext = exports.DateDaysBetweenBIFContext = exports.DateAddSecondsBIFContext = exports.DateAddMonthsBIFContext = exports.DateAddDaysBIFContext = exports.DateBIFExpressionContext = exports.JsonFromCsvBIFContext = exports.JsonFromCsvLineBIFContext = void 0;
const ATN_1 = require("antlr4ts/atn/ATN");
const ATNDeserializer_1 = require("antlr4ts/atn/ATNDeserializer");
const FailedPredicateException_1 = require("antlr4ts/FailedPredicateException");
const NoViableAltException_1 = require("antlr4ts/NoViableAltException");
const Parser_1 = require("antlr4ts/Parser");
const ParserRuleContext_1 = require("antlr4ts/ParserRuleContext");
const ParserATNSimulator_1 = require("antlr4ts/atn/ParserATNSimulator");
const RecognitionException_1 = require("antlr4ts/RecognitionException");
const Token_1 = require("antlr4ts/Token");
const VocabularyImpl_1 = require("antlr4ts/VocabularyImpl");
const Utils = __importStar(require("antlr4ts/misc/Utils"));
class MezDSLParser extends Parser_1.Parser {
    // @Override
    // @NotNull
    get vocabulary() {
        return MezDSLParser.VOCABULARY;
    }
    // tslint:enable:no-trailing-whitespace
    // @Override
    get grammarFileName() { return "MezDSL.g4"; }
    // @Override
    get ruleNames() { return MezDSLParser.ruleNames; }
    // @Override
    get serializedATN() { return MezDSLParser._serializedATN; }
    createFailedPredicateException(predicate, message) {
        return new FailedPredicateException_1.FailedPredicateException(this, predicate, message);
    }
    constructor(input) {
        super(input);
        this._interp = new ParserATNSimulator_1.ParserATNSimulator(MezDSLParser._ATN, this);
    }
    // @RuleVersion(0)
    script() {
        let _localctx = new ScriptContext(this._ctx, this.state);
        this.enterRule(_localctx, 0, MezDSLParser.RULE_script);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 373;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 372;
                            this.scriptContent();
                        }
                    }
                    this.state = 375;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << MezDSLParser.T__0) | (1 << MezDSLParser.T__2) | (1 << MezDSLParser.T__5) | (1 << MezDSLParser.T__6) | (1 << MezDSLParser.T__8) | (1 << MezDSLParser.T__11))) !== 0));
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    scriptContent() {
        let _localctx = new ScriptContentContext(this._ctx, this.state);
        this.enterRule(_localctx, 2, MezDSLParser.RULE_scriptContent);
        try {
            this.state = 379;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.T__2:
                case MezDSLParser.T__5:
                case MezDSLParser.T__6:
                case MezDSLParser.T__8:
                case MezDSLParser.T__11:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 377;
                        this.persistence();
                    }
                    break;
                case MezDSLParser.T__0:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 378;
                        this.unit();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    persistence() {
        let _localctx = new PersistenceContext(this._ctx, this.state);
        this.enterRule(_localctx, 4, MezDSLParser.RULE_persistence);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 381;
                this.persistenceElement();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    persistenceElement() {
        let _localctx = new PersistenceElementContext(this._ctx, this.state);
        this.enterRule(_localctx, 6, MezDSLParser.RULE_persistenceElement);
        try {
            this.state = 386;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.T__2:
                case MezDSLParser.T__5:
                case MezDSLParser.T__8:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 383;
                        this.customObject();
                    }
                    break;
                case MezDSLParser.T__11:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 384;
                        this.validator();
                    }
                    break;
                case MezDSLParser.T__6:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 385;
                        this.enumeration();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    unit() {
        let _localctx = new UnitContext(this._ctx, this.state);
        this.enterRule(_localctx, 8, MezDSLParser.RULE_unit);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 388;
                this.match(MezDSLParser.T__0);
                this.state = 389;
                _localctx._ID = this.match(MezDSLParser.ID);
                this.state = 390;
                this.match(MezDSLParser.T__1);
                token("UNIT", (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
                this.state = 398;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 392;
                                _localctx._variableDeclaration = this.variableDeclaration();
                                this.state = 393;
                                this.match(MezDSLParser.T__1);
                                token("UNIT_VARIABLE", (_localctx._variableDeclaration != null ? this._input.getTextFromRange(_localctx._variableDeclaration._start, _localctx._variableDeclaration._stop) : undefined), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getLine(), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getCharPositionInLine());
                            }
                        }
                    }
                    this.state = 400;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
                }
                this.state = 402;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 401;
                            this.functionDefinition();
                        }
                    }
                    this.state = 404;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (_la === MezDSLParser.T__8 || ((((_la - 215)) & ~0x1F) === 0 && ((1 << (_la - 215)) & ((1 << (MezDSLParser.INT - 215)) | (1 << (MezDSLParser.DECIMAL - 215)) | (1 << (MezDSLParser.LONG - 215)) | (1 << (MezDSLParser.UUID - 215)) | (1 << (MezDSLParser.BLOB - 215)) | (1 << (MezDSLParser.BOOL - 215)) | (1 << (MezDSLParser.STRING - 215)) | (1 << (MezDSLParser.VOID - 215)) | (1 << (MezDSLParser.DATE - 215)) | (1 << (MezDSLParser.DATETIME - 215)) | (1 << (MezDSLParser.JSON - 215)) | (1 << (MezDSLParser.JSONARRAY - 215)))) !== 0) || _la === MezDSLParser.ENUM_ID || _la === MezDSLParser.ID);
                this.state = 406;
                this.match(MezDSLParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    customObject() {
        let _localctx = new CustomObjectContext(this._ctx, this.state);
        this.enterRule(_localctx, 10, MezDSLParser.RULE_customObject);
        try {
            this.state = 410;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.T__2:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 408;
                        this.simpleObject();
                    }
                    break;
                case MezDSLParser.T__5:
                case MezDSLParser.T__8:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 409;
                        this.persistentObject();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    simpleObject() {
        let _localctx = new SimpleObjectContext(this._ctx, this.state);
        this.enterRule(_localctx, 12, MezDSLParser.RULE_simpleObject);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 412;
                this.match(MezDSLParser.T__2);
                this.state = 413;
                _localctx._ID = this.match(MezDSLParser.ID);
                this.state = 414;
                this.match(MezDSLParser.T__3);
                token("OBJECT", (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
                this.state = 421;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 416;
                                this.objectAttribute();
                                this.state = 417;
                                this.match(MezDSLParser.T__1);
                            }
                        }
                    }
                    this.state = 423;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 6, this._ctx);
                }
                this.state = 429;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__8) {
                    {
                        {
                            this.state = 424;
                            this.relationship();
                            this.state = 425;
                            this.match(MezDSLParser.T__1);
                        }
                    }
                    this.state = 431;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 435;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (((((_la - 127)) & ~0x1F) === 0 && ((1 << (_la - 127)) & ((1 << (MezDSLParser.BEFORE_CREATE - 127)) | (1 << (MezDSLParser.AFTER_CREATE - 127)) | (1 << (MezDSLParser.BEFORE_UPDATE - 127)) | (1 << (MezDSLParser.AFTER_UPDATE - 127)) | (1 << (MezDSLParser.BEFORE_DELETE - 127)) | (1 << (MezDSLParser.AFTER_DELETE - 127)))) !== 0)) {
                    {
                        {
                            this.state = 432;
                            this.trigger();
                        }
                    }
                    this.state = 437;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 438;
                this.match(MezDSLParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    trigger() {
        let _localctx = new TriggerContext(this._ctx, this.state);
        this.enterRule(_localctx, 14, MezDSLParser.RULE_trigger);
        try {
            this.state = 446;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.BEFORE_CREATE:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 440;
                        this.beforeCreate();
                    }
                    break;
                case MezDSLParser.AFTER_CREATE:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 441;
                        this.afterCreate();
                    }
                    break;
                case MezDSLParser.BEFORE_UPDATE:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 442;
                        this.beforeUpdate();
                    }
                    break;
                case MezDSLParser.AFTER_UPDATE:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 443;
                        this.afterUpdate();
                    }
                    break;
                case MezDSLParser.BEFORE_DELETE:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 444;
                        this.beforeDelete();
                    }
                    break;
                case MezDSLParser.AFTER_DELETE:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 445;
                        this.afterDelete();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    beforeCreate() {
        let _localctx = new BeforeCreateContext(this._ctx, this.state);
        this.enterRule(_localctx, 16, MezDSLParser.RULE_beforeCreate);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 448;
                this.match(MezDSLParser.BEFORE_CREATE);
                this.state = 449;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    afterCreate() {
        let _localctx = new AfterCreateContext(this._ctx, this.state);
        this.enterRule(_localctx, 18, MezDSLParser.RULE_afterCreate);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 451;
                this.match(MezDSLParser.AFTER_CREATE);
                this.state = 452;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    beforeUpdate() {
        let _localctx = new BeforeUpdateContext(this._ctx, this.state);
        this.enterRule(_localctx, 20, MezDSLParser.RULE_beforeUpdate);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 454;
                this.match(MezDSLParser.BEFORE_UPDATE);
                this.state = 455;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    afterUpdate() {
        let _localctx = new AfterUpdateContext(this._ctx, this.state);
        this.enterRule(_localctx, 22, MezDSLParser.RULE_afterUpdate);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 457;
                this.match(MezDSLParser.AFTER_UPDATE);
                this.state = 458;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    beforeDelete() {
        let _localctx = new BeforeDeleteContext(this._ctx, this.state);
        this.enterRule(_localctx, 24, MezDSLParser.RULE_beforeDelete);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 460;
                this.match(MezDSLParser.BEFORE_DELETE);
                this.state = 461;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    afterDelete() {
        let _localctx = new AfterDeleteContext(this._ctx, this.state);
        this.enterRule(_localctx, 26, MezDSLParser.RULE_afterDelete);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 463;
                this.match(MezDSLParser.AFTER_DELETE);
                this.state = 464;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    persistentObject() {
        let _localctx = new PersistentObjectContext(this._ctx, this.state);
        this.enterRule(_localctx, 28, MezDSLParser.RULE_persistentObject);
        let _la;
        try {
            this.state = 478;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.T__8:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 467;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        do {
                            {
                                {
                                    this.state = 466;
                                    this.objectAnnotation();
                                }
                            }
                            this.state = 469;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        } while (_la === MezDSLParser.T__8);
                        this.state = 472;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__5) {
                            {
                                this.state = 471;
                                this.match(MezDSLParser.T__5);
                            }
                        }
                        this.state = 474;
                        this.simpleObject();
                    }
                    break;
                case MezDSLParser.T__5:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 476;
                        this.match(MezDSLParser.T__5);
                        this.state = 477;
                        this.simpleObject();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    objectAttribute() {
        let _localctx = new ObjectAttributeContext(this._ctx, this.state);
        this.enterRule(_localctx, 30, MezDSLParser.RULE_objectAttribute);
        try {
            this.state = 482;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 13, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 480;
                        this.enumAttribute();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 481;
                        this.primitiveAttribute();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    relationship() {
        let _localctx = new RelationshipContext(this._ctx, this.state);
        this.enterRule(_localctx, 32, MezDSLParser.RULE_relationship);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 484;
                this.multiplicityAnnotation();
                this.state = 485;
                _localctx._objID = this.match(MezDSLParser.ID);
                this.state = 486;
                _localctx._nameID = this.match(MezDSLParser.ID);
                this.state = 489;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.VIA) {
                    {
                        this.state = 487;
                        this.match(MezDSLParser.VIA);
                        this.state = 488;
                        _localctx._aliasID = this.match(MezDSLParser.ID);
                    }
                }
                {
                    token("RELATIONSHIP", (_localctx._objID != null ? _localctx._objID.text : undefined) + " " + (_localctx._nameID != null ? _localctx._nameID.text : undefined), (_localctx._nameID != null ? _localctx._nameID.line : 0), (_localctx._nameID != null ? _localctx._nameID.charPositionInLine : 0));
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    primitiveAttribute() {
        let _localctx = new PrimitiveAttributeContext(this._ctx, this.state);
        this.enterRule(_localctx, 34, MezDSLParser.RULE_primitiveAttribute);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 496;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__8) {
                    {
                        {
                            this.state = 493;
                            this.attributeAnnotation();
                        }
                    }
                    this.state = 498;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 499;
                _localctx._primitiveType = this.primitiveType();
                this.state = 500;
                _localctx._ID = this.match(MezDSLParser.ID);
                token("ATTRIBUTE", (_localctx._primitiveType != null ? this._input.getTextFromRange(_localctx._primitiveType._start, _localctx._primitiveType._stop) : undefined) + " " + (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    enumAttribute() {
        let _localctx = new EnumAttributeContext(this._ctx, this.state);
        this.enterRule(_localctx, 36, MezDSLParser.RULE_enumAttribute);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 506;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__8) {
                    {
                        {
                            this.state = 503;
                            this.attributeAnnotation();
                        }
                    }
                    this.state = 508;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 509;
                _localctx._enumID = this.match(MezDSLParser.ENUM_ID);
                this.state = 510;
                _localctx._nameID = this.match(MezDSLParser.ID);
                token("ATTRIBUTE", (_localctx._enumID != null ? _localctx._enumID.text : undefined) + " " + (_localctx._nameID != null ? _localctx._nameID.text : undefined), (_localctx._nameID != null ? _localctx._nameID.line : 0), (_localctx._nameID != null ? _localctx._nameID.charPositionInLine : 0));
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    enumeration() {
        let _localctx = new EnumerationContext(this._ctx, this.state);
        this.enterRule(_localctx, 38, MezDSLParser.RULE_enumeration);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 513;
                this.match(MezDSLParser.T__6);
                this.state = 514;
                _localctx._ENUM_ID = this.match(MezDSLParser.ENUM_ID);
                token("ENUM", (_localctx._ENUM_ID != null ? _localctx._ENUM_ID.text : undefined), (_localctx._ENUM_ID != null ? _localctx._ENUM_ID.line : 0), (_localctx._ENUM_ID != null ? _localctx._ENUM_ID.charPositionInLine : 0));
                this.state = 516;
                this.match(MezDSLParser.T__3);
                this.state = 517;
                this.enumValue();
                this.state = 522;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__7) {
                    {
                        {
                            this.state = 518;
                            this.match(MezDSLParser.T__7);
                            this.state = 519;
                            this.enumValue();
                        }
                    }
                    this.state = 524;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 525;
                this.match(MezDSLParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    enumValue() {
        let _localctx = new EnumValueContext(this._ctx, this.state);
        this.enterRule(_localctx, 40, MezDSLParser.RULE_enumValue);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 527;
                _localctx._ID = this.match(MezDSLParser.ID);
                token("ENUM_VALUE", (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    multiplicityAnnotation() {
        let _localctx = new MultiplicityAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 42, MezDSLParser.RULE_multiplicityAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 530;
                this.match(MezDSLParser.T__8);
                this.state = 531;
                this.relationshipMultiplicity();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    objectAnnotation() {
        let _localctx = new ObjectAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 44, MezDSLParser.RULE_objectAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 533;
                this.match(MezDSLParser.T__8);
                this.state = 537;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case MezDSLParser.ROLE:
                        {
                            this.state = 534;
                            this.roleAnnotation();
                        }
                        break;
                    case MezDSLParser.RESTRICT:
                        {
                            this.state = 535;
                            this.restrictedObjectAnnotation();
                        }
                        break;
                    case MezDSLParser.NOT_TRACKED:
                        {
                            this.state = 536;
                            this.notTrackedAnnotation();
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    attributeAnnotation() {
        let _localctx = new AttributeAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 46, MezDSLParser.RULE_attributeAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 539;
                this.match(MezDSLParser.T__8);
                this.state = 542;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case MezDSLParser.ID:
                        {
                            this.state = 540;
                            this.validatorAnnotation();
                        }
                        break;
                    case MezDSLParser.RESTRICT:
                        {
                            this.state = 541;
                            this.restrictedAttributeAnnotation();
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    functionAnnotation() {
        let _localctx = new FunctionAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 48, MezDSLParser.RULE_functionAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 544;
                this.match(MezDSLParser.T__8);
                this.state = 561;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case MezDSLParser.RECEIVESMS:
                        {
                            this.state = 545;
                            this.receiveSMSAnnotation();
                        }
                        break;
                    case MezDSLParser.TEST:
                        {
                            this.state = 546;
                            this.unitTestAnnotation();
                        }
                        break;
                    case MezDSLParser.SCHEDULED:
                        {
                            this.state = 547;
                            this.scheduledAnnotation();
                        }
                        break;
                    case MezDSLParser.INVITEUSER:
                        {
                            this.state = 548;
                            this.inviteUserAnnotation();
                        }
                        break;
                    case MezDSLParser.ROLENAME:
                        {
                            this.state = 549;
                            this.roleNameAnnotation();
                        }
                        break;
                    case MezDSLParser.ONPAYMENTUPDATE:
                        {
                            this.state = 550;
                            this.onPaymentUpdateAnnotation();
                        }
                        break;
                    case MezDSLParser.ONSCHEDULEDFUNCTIONRESULTUPDATE:
                        {
                            this.state = 551;
                            this.onScheduledFunctionResultUpdateAnnotation();
                        }
                        break;
                    case MezDSLParser.ONSMSRESULTUPDATE:
                        {
                            this.state = 552;
                            this.onSmsResultUpdateAnnotation();
                        }
                        break;
                    case MezDSLParser.POST_API:
                        {
                            this.state = 553;
                            this.postAnnotation();
                        }
                        break;
                    case MezDSLParser.GET_API:
                        {
                            this.state = 554;
                            this.getAnnotation();
                        }
                        break;
                    case MezDSLParser.PUT_API:
                        {
                            this.state = 555;
                            this.putAnnotation();
                        }
                        break;
                    case MezDSLParser.DELETE_API:
                        {
                            this.state = 556;
                            this.deleteAnnotation();
                        }
                        break;
                    case MezDSLParser.RESPONSE_EXPAND:
                        {
                            this.state = 557;
                            this.responseExpandAnnotation();
                        }
                        break;
                    case MezDSLParser.RESPONSE_EXCLUDE:
                        {
                            this.state = 558;
                            this.responseExcludeAnnotation();
                        }
                        break;
                    case MezDSLParser.USSD:
                        {
                            this.state = 559;
                            this.ussdAnnotation();
                        }
                        break;
                    case MezDSLParser.ONPAYMENTSTATUSREQUESTRESULTUPDATE:
                        {
                            this.state = 560;
                            this.onPaymentStatusRequestResultUpdateAnnotation();
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    receiveSMSAnnotation() {
        let _localctx = new ReceiveSMSAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 50, MezDSLParser.RULE_receiveSMSAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 563;
                this.match(MezDSLParser.RECEIVESMS);
                this.state = 564;
                this.match(MezDSLParser.T__9);
                this.state = 565;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 566;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    unitTestAnnotation() {
        let _localctx = new UnitTestAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 52, MezDSLParser.RULE_unitTestAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 568;
                this.match(MezDSLParser.TEST);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    ussdAnnotation() {
        let _localctx = new UssdAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 54, MezDSLParser.RULE_ussdAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 570;
                this.match(MezDSLParser.USSD);
                this.state = 571;
                this.match(MezDSLParser.T__9);
                this.state = 572;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 573;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    scheduledAnnotation() {
        let _localctx = new ScheduledAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 56, MezDSLParser.RULE_scheduledAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 575;
                this.match(MezDSLParser.SCHEDULED);
                this.state = 576;
                this.match(MezDSLParser.T__9);
                this.state = 577;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 578;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    inviteUserAnnotation() {
        let _localctx = new InviteUserAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 58, MezDSLParser.RULE_inviteUserAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 580;
                this.match(MezDSLParser.INVITEUSER);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    roleNameAnnotation() {
        let _localctx = new RoleNameAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 60, MezDSLParser.RULE_roleNameAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 582;
                this.match(MezDSLParser.ROLENAME);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    onPaymentUpdateAnnotation() {
        let _localctx = new OnPaymentUpdateAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 62, MezDSLParser.RULE_onPaymentUpdateAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 584;
                this.match(MezDSLParser.ONPAYMENTUPDATE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    onScheduledFunctionResultUpdateAnnotation() {
        let _localctx = new OnScheduledFunctionResultUpdateAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 64, MezDSLParser.RULE_onScheduledFunctionResultUpdateAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 586;
                this.match(MezDSLParser.ONSCHEDULEDFUNCTIONRESULTUPDATE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    onSmsResultUpdateAnnotation() {
        let _localctx = new OnSmsResultUpdateAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 66, MezDSLParser.RULE_onSmsResultUpdateAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 588;
                this.match(MezDSLParser.ONSMSRESULTUPDATE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    onPaymentStatusRequestResultUpdateAnnotation() {
        let _localctx = new OnPaymentStatusRequestResultUpdateAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 68, MezDSLParser.RULE_onPaymentStatusRequestResultUpdateAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 590;
                this.match(MezDSLParser.ONPAYMENTSTATUSREQUESTRESULTUPDATE);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    postAnnotation() {
        let _localctx = new PostAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 70, MezDSLParser.RULE_postAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 592;
                this.match(MezDSLParser.POST_API);
                this.state = 593;
                this.match(MezDSLParser.T__9);
                this.state = 594;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 595;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    getAnnotation() {
        let _localctx = new GetAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 72, MezDSLParser.RULE_getAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 597;
                this.match(MezDSLParser.GET_API);
                this.state = 598;
                this.match(MezDSLParser.T__9);
                this.state = 599;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 600;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    putAnnotation() {
        let _localctx = new PutAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 74, MezDSLParser.RULE_putAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 602;
                this.match(MezDSLParser.PUT_API);
                this.state = 603;
                this.match(MezDSLParser.T__9);
                this.state = 604;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 605;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    deleteAnnotation() {
        let _localctx = new DeleteAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 76, MezDSLParser.RULE_deleteAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 607;
                this.match(MezDSLParser.DELETE_API);
                this.state = 608;
                this.match(MezDSLParser.T__9);
                this.state = 609;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 610;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    responseExpandAnnotation() {
        let _localctx = new ResponseExpandAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 78, MezDSLParser.RULE_responseExpandAnnotation);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 612;
                this.match(MezDSLParser.RESPONSE_EXPAND);
                this.state = 613;
                this.match(MezDSLParser.T__9);
                this.state = 614;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 619;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__7) {
                    {
                        {
                            this.state = 615;
                            this.match(MezDSLParser.T__7);
                            this.state = 616;
                            this.match(MezDSLParser.STR_LITERAL);
                        }
                    }
                    this.state = 621;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 622;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    responseExcludeAnnotation() {
        let _localctx = new ResponseExcludeAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 80, MezDSLParser.RULE_responseExcludeAnnotation);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 624;
                this.match(MezDSLParser.RESPONSE_EXCLUDE);
                this.state = 625;
                this.match(MezDSLParser.T__9);
                this.state = 626;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 631;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__7) {
                    {
                        {
                            this.state = 627;
                            this.match(MezDSLParser.T__7);
                            this.state = 628;
                            this.match(MezDSLParser.STR_LITERAL);
                        }
                    }
                    this.state = 633;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 634;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    roleAnnotation() {
        let _localctx = new RoleAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 82, MezDSLParser.RULE_roleAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 636;
                this.match(MezDSLParser.ROLE);
                this.state = 637;
                this.match(MezDSLParser.T__9);
                this.state = 638;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 639;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    restrictedObjectAnnotation() {
        let _localctx = new RestrictedObjectAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 84, MezDSLParser.RULE_restrictedObjectAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 641;
                this.match(MezDSLParser.RESTRICT);
                this.state = 642;
                this.match(MezDSLParser.T__9);
                this.state = 643;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 644;
                this.match(MezDSLParser.T__7);
                this.state = 645;
                this.selectorBIF();
                this.state = 646;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    restrictedAttributeAnnotation() {
        let _localctx = new RestrictedAttributeAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 86, MezDSLParser.RULE_restrictedAttributeAnnotation);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 648;
                this.match(MezDSLParser.RESTRICT);
                this.state = 649;
                this.match(MezDSLParser.T__9);
                this.state = 650;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 655;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__7) {
                    {
                        {
                            this.state = 651;
                            this.match(MezDSLParser.T__7);
                            this.state = 652;
                            this.match(MezDSLParser.STR_LITERAL);
                        }
                    }
                    this.state = 657;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 658;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    notTrackedAnnotation() {
        let _localctx = new NotTrackedAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 88, MezDSLParser.RULE_notTrackedAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 660;
                this.match(MezDSLParser.NOT_TRACKED);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    validatorAnnotation() {
        let _localctx = new ValidatorAnnotationContext(this._ctx, this.state);
        this.enterRule(_localctx, 90, MezDSLParser.RULE_validatorAnnotation);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 662;
                this.match(MezDSLParser.ID);
                this.state = 663;
                this.match(MezDSLParser.T__9);
                this.state = 664;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 665;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    validator() {
        let _localctx = new ValidatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 92, MezDSLParser.RULE_validator);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 667;
                this.match(MezDSLParser.T__11);
                this.state = 668;
                _localctx._ID = this.match(MezDSLParser.ID);
                token("VALIDATOR", (_localctx._ID != null ? _localctx._ID.text : undefined) + "()", (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
                this.state = 670;
                this.match(MezDSLParser.T__3);
                this.state = 674;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 671;
                            this.atomicValidator();
                            this.state = 672;
                            this.match(MezDSLParser.T__1);
                        }
                    }
                    this.state = 676;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (((((_la - 204)) & ~0x1F) === 0 && ((1 << (_la - 204)) & ((1 << (MezDSLParser.NOTNULL - 204)) | (1 << (MezDSLParser.REGEX - 204)) | (1 << (MezDSLParser.MINVAL - 204)) | (1 << (MezDSLParser.MAXVAL - 204)) | (1 << (MezDSLParser.MINLEN - 204)) | (1 << (MezDSLParser.MAXLEN - 204)))) !== 0));
                this.state = 678;
                this.match(MezDSLParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    atomicValidator() {
        let _localctx = new AtomicValidatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 94, MezDSLParser.RULE_atomicValidator);
        try {
            this.state = 731;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 25, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 680;
                        this.match(MezDSLParser.NOTNULL);
                        this.state = 681;
                        this.match(MezDSLParser.T__9);
                        this.state = 682;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 683;
                        this.match(MezDSLParser.REGEX);
                        this.state = 684;
                        this.match(MezDSLParser.T__9);
                        this.state = 685;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 686;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 687;
                        this.match(MezDSLParser.MAXLEN);
                        this.state = 688;
                        this.match(MezDSLParser.T__9);
                        this.state = 689;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 690;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 691;
                        this.match(MezDSLParser.MINLEN);
                        this.state = 692;
                        this.match(MezDSLParser.T__9);
                        this.state = 693;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 694;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 695;
                        this.match(MezDSLParser.MAXVAL);
                        this.state = 696;
                        this.match(MezDSLParser.T__9);
                        this.state = 697;
                        this.match(MezDSLParser.MINUS);
                        this.state = 698;
                        this.match(MezDSLParser.DEC_LITERAL);
                        this.state = 699;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 700;
                        this.match(MezDSLParser.MAXVAL);
                        this.state = 701;
                        this.match(MezDSLParser.T__9);
                        this.state = 702;
                        this.match(MezDSLParser.MINUS);
                        this.state = 703;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 704;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 7:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 705;
                        this.match(MezDSLParser.MAXVAL);
                        this.state = 706;
                        this.match(MezDSLParser.T__9);
                        this.state = 707;
                        this.match(MezDSLParser.DEC_LITERAL);
                        this.state = 708;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 8:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 709;
                        this.match(MezDSLParser.MAXVAL);
                        this.state = 710;
                        this.match(MezDSLParser.T__9);
                        this.state = 711;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 712;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 9:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 713;
                        this.match(MezDSLParser.MINVAL);
                        this.state = 714;
                        this.match(MezDSLParser.T__9);
                        this.state = 715;
                        this.match(MezDSLParser.MINUS);
                        this.state = 716;
                        this.match(MezDSLParser.DEC_LITERAL);
                        this.state = 717;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 10:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 718;
                        this.match(MezDSLParser.MINVAL);
                        this.state = 719;
                        this.match(MezDSLParser.T__9);
                        this.state = 720;
                        this.match(MezDSLParser.MINUS);
                        this.state = 721;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 722;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 11:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 723;
                        this.match(MezDSLParser.MINVAL);
                        this.state = 724;
                        this.match(MezDSLParser.T__9);
                        this.state = 725;
                        this.match(MezDSLParser.DEC_LITERAL);
                        this.state = 726;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 12:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 727;
                        this.match(MezDSLParser.MINVAL);
                        this.state = 728;
                        this.match(MezDSLParser.T__9);
                        this.state = 729;
                        this.match(MezDSLParser.INT_LITERAL);
                        this.state = 730;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    relationshipMultiplicity() {
        let _localctx = new RelationshipMultiplicityContext(this._ctx, this.state);
        this.enterRule(_localctx, 96, MezDSLParser.RULE_relationshipMultiplicity);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 733;
                _la = this._input.LA(1);
                if (!(((((_la - 210)) & ~0x1F) === 0 && ((1 << (_la - 210)) & ((1 << (MezDSLParser.ONETOONE - 210)) | (1 << (MezDSLParser.MANYTOMANY - 210)) | (1 << (MezDSLParser.MANYTOONE - 210)) | (1 << (MezDSLParser.ONETOMANY - 210)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    variableDeclaration() {
        let _localctx = new VariableDeclarationContext(this._ctx, this.state);
        this.enterRule(_localctx, 98, MezDSLParser.RULE_variableDeclaration);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 735;
                this.variableType();
                this.state = 737;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.COL) {
                    {
                        this.state = 736;
                        this.match(MezDSLParser.COL);
                    }
                }
                this.state = 739;
                this.match(MezDSLParser.ID);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    variableDeclareInit() {
        let _localctx = new VariableDeclareInitContext(this._ctx, this.state);
        this.enterRule(_localctx, 100, MezDSLParser.RULE_variableDeclareInit);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 741;
                _localctx._variableDeclaration = this.variableDeclaration();
                this.state = 742;
                this.match(MezDSLParser.ASSIGN);
                this.state = 743;
                this.expression();
                token("LOCAL_VARIABLE", (_localctx._variableDeclaration != null ? this._input.getTextFromRange(_localctx._variableDeclaration._start, _localctx._variableDeclaration._stop) : undefined), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getLine(), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getCharPositionInLine());
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    variableType() {
        let _localctx = new VariableTypeContext(this._ctx, this.state);
        this.enterRule(_localctx, 102, MezDSLParser.RULE_variableType);
        try {
            this.state = 749;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.INT:
                case MezDSLParser.DECIMAL:
                case MezDSLParser.LONG:
                case MezDSLParser.UUID:
                case MezDSLParser.BLOB:
                case MezDSLParser.BOOL:
                case MezDSLParser.STRING:
                case MezDSLParser.VOID:
                case MezDSLParser.DATE:
                case MezDSLParser.DATETIME:
                case MezDSLParser.JSON:
                case MezDSLParser.JSONARRAY:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 746;
                        this.primitiveType();
                    }
                    break;
                case MezDSLParser.ID:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 747;
                        this.match(MezDSLParser.ID);
                    }
                    break;
                case MezDSLParser.ENUM_ID:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 748;
                        this.match(MezDSLParser.ENUM_ID);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    functionDefinition() {
        let _localctx = new FunctionDefinitionContext(this._ctx, this.state);
        this.enterRule(_localctx, 104, MezDSLParser.RULE_functionDefinition);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 754;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__8) {
                    {
                        {
                            this.state = 751;
                            this.functionAnnotation();
                        }
                    }
                    this.state = 756;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 757;
                this.functionSignature();
                this.state = 758;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    codeBlock() {
        let _localctx = new CodeBlockContext(this._ctx, this.state);
        this.enterRule(_localctx, 106, MezDSLParser.RULE_codeBlock);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 760;
                this.match(MezDSLParser.T__3);
                this.state = 764;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << MezDSLParser.T__12) | (1 << MezDSLParser.T__14) | (1 << MezDSLParser.T__15) | (1 << MezDSLParser.T__18) | (1 << MezDSLParser.T__20) | (1 << MezDSLParser.T__21) | (1 << MezDSLParser.OBJECT_INVITE))) !== 0) || _la === MezDSLParser.COLLECTION_SELECT || ((((_la - 83)) & ~0x1F) === 0 && ((1 << (_la - 83)) & ((1 << (MezDSLParser.ALERT - 83)) | (1 << (MezDSLParser.ALERT_WARN - 83)) | (1 << (MezDSLParser.ALERT_ERROR - 83)) | (1 << (MezDSLParser.ERROR - 83)) | (1 << (MezDSLParser.LOG - 83)) | (1 << (MezDSLParser.WARN - 83)) | (1 << (MezDSLParser.SMS - 83)) | (1 << (MezDSLParser.SMS_SEND - 83)) | (1 << (MezDSLParser.SMS_END_CONVERSATION - 83)) | (1 << (MezDSLParser.EMAIL - 83)) | (1 << (MezDSLParser.EMAIL_ATTACH - 83)) | (1 << (MezDSLParser.EMAIL_CSV - 83)) | (1 << (MezDSLParser.PAYMENT_STATUS_REQUEST - 83)) | (1 << (MezDSLParser.CREATE_CRYPTO_KEY - 83)) | (1 << (MezDSLParser.DOWNLOAD_REPORT - 83)) | (1 << (MezDSLParser.DOWNLOAD_FILE - 83)) | (1 << (MezDSLParser.API_SET_STATUS_CODE - 83)))) !== 0) || _la === MezDSLParser.RETURN || ((((_la - 215)) & ~0x1F) === 0 && ((1 << (_la - 215)) & ((1 << (MezDSLParser.INT - 215)) | (1 << (MezDSLParser.DECIMAL - 215)) | (1 << (MezDSLParser.LONG - 215)) | (1 << (MezDSLParser.UUID - 215)) | (1 << (MezDSLParser.BLOB - 215)) | (1 << (MezDSLParser.BOOL - 215)) | (1 << (MezDSLParser.STRING - 215)) | (1 << (MezDSLParser.VOID - 215)) | (1 << (MezDSLParser.DATE - 215)) | (1 << (MezDSLParser.DATETIME - 215)) | (1 << (MezDSLParser.JSON - 215)) | (1 << (MezDSLParser.JSONARRAY - 215)))) !== 0) || _la === MezDSLParser.ENUM_ID || _la === MezDSLParser.ID) {
                    {
                        {
                            this.state = 761;
                            this.codeBlockContent();
                        }
                    }
                    this.state = 766;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 767;
                this.match(MezDSLParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    codeBlockContent() {
        let _localctx = new CodeBlockContentContext(this._ctx, this.state);
        this.enterRule(_localctx, 108, MezDSLParser.RULE_codeBlockContent);
        try {
            this.state = 780;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 30, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 769;
                        _localctx._variableDeclaration = this.variableDeclaration();
                        this.state = 770;
                        this.match(MezDSLParser.T__1);
                        token("LOCAL_VARIABLE", (_localctx._variableDeclaration != null ? this._input.getTextFromRange(_localctx._variableDeclaration._start, _localctx._variableDeclaration._stop) : undefined), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getLine(), (_localctx._variableDeclaration != null ? (_localctx._variableDeclaration._start) : undefined).getCharPositionInLine());
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 773;
                        this.variableDeclareInit();
                        this.state = 774;
                        this.match(MezDSLParser.T__1);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 776;
                        this.statement();
                        this.state = 777;
                        this.match(MezDSLParser.T__1);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 779;
                        this.complexStatement();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    functionSignature() {
        let _localctx = new FunctionSignatureContext(this._ctx, this.state);
        this.enterRule(_localctx, 110, MezDSLParser.RULE_functionSignature);
        let _la;
        try {
            this.state = 824;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 37, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 782;
                        _localctx._typeName = this.typeName();
                        this.state = 784;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.COL) {
                            {
                                this.state = 783;
                                _localctx._COL = this.match(MezDSLParser.COL);
                            }
                        }
                        this.state = 786;
                        _localctx._specialFunctionName = this.specialFunctionName();
                        token("FUNCTION", (_localctx._typeName != null ? this._input.getTextFromRange(_localctx._typeName._start, _localctx._typeName._stop) : undefined) + isNull((_localctx._COL != null ? _localctx._COL.text : undefined)) + " " + (_localctx._specialFunctionName != null ? this._input.getTextFromRange(_localctx._specialFunctionName._start, _localctx._specialFunctionName._stop) : undefined), (_localctx._specialFunctionName != null ? (_localctx._specialFunctionName._start) : undefined).getLine(), (_localctx._specialFunctionName != null ? (_localctx._specialFunctionName._start) : undefined).getCharPositionInLine());
                        this.state = 801;
                        this._errHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this._input, 33, this._ctx)) {
                            case 1:
                                {
                                    this.state = 788;
                                    this.match(MezDSLParser.T__9);
                                    this.state = 789;
                                    this.match(MezDSLParser.T__10);
                                }
                                break;
                            case 2:
                                {
                                    this.state = 790;
                                    this.match(MezDSLParser.T__9);
                                    this.state = 791;
                                    this.parameter();
                                    this.state = 796;
                                    this._errHandler.sync(this);
                                    _la = this._input.LA(1);
                                    while (_la === MezDSLParser.T__7) {
                                        {
                                            {
                                                this.state = 792;
                                                this.match(MezDSLParser.T__7);
                                                this.state = 793;
                                                this.parameter();
                                            }
                                        }
                                        this.state = 798;
                                        this._errHandler.sync(this);
                                        _la = this._input.LA(1);
                                    }
                                    this.state = 799;
                                    this.match(MezDSLParser.T__10);
                                }
                                break;
                        }
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 803;
                        _localctx._typeName = this.typeName();
                        this.state = 805;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.COL) {
                            {
                                this.state = 804;
                                _localctx._COL = this.match(MezDSLParser.COL);
                            }
                        }
                        this.state = 807;
                        _localctx._ID = this.match(MezDSLParser.ID);
                        token("FUNCTION", (_localctx._typeName != null ? this._input.getTextFromRange(_localctx._typeName._start, _localctx._typeName._stop) : undefined) + isNull((_localctx._COL != null ? _localctx._COL.text : undefined)) + " " + (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
                        this.state = 822;
                        this._errHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this._input, 36, this._ctx)) {
                            case 1:
                                {
                                    this.state = 809;
                                    this.match(MezDSLParser.T__9);
                                    this.state = 810;
                                    this.match(MezDSLParser.T__10);
                                }
                                break;
                            case 2:
                                {
                                    this.state = 811;
                                    this.match(MezDSLParser.T__9);
                                    this.state = 812;
                                    this.parameter();
                                    this.state = 817;
                                    this._errHandler.sync(this);
                                    _la = this._input.LA(1);
                                    while (_la === MezDSLParser.T__7) {
                                        {
                                            {
                                                this.state = 813;
                                                this.match(MezDSLParser.T__7);
                                                this.state = 814;
                                                this.parameter();
                                            }
                                        }
                                        this.state = 819;
                                        this._errHandler.sync(this);
                                        _la = this._input.LA(1);
                                    }
                                    this.state = 820;
                                    this.match(MezDSLParser.T__10);
                                }
                                break;
                        }
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    specialFunctionName() {
        let _localctx = new SpecialFunctionNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 112, MezDSLParser.RULE_specialFunctionName);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 826;
                _la = this._input.LA(1);
                if (!(_la === MezDSLParser.OBJECT_INVITE || _la === MezDSLParser.COLLECTION_SELECT)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    typeName() {
        let _localctx = new TypeNameContext(this._ctx, this.state);
        this.enterRule(_localctx, 114, MezDSLParser.RULE_typeName);
        try {
            this.state = 831;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.INT:
                case MezDSLParser.DECIMAL:
                case MezDSLParser.LONG:
                case MezDSLParser.UUID:
                case MezDSLParser.BLOB:
                case MezDSLParser.BOOL:
                case MezDSLParser.STRING:
                case MezDSLParser.VOID:
                case MezDSLParser.DATE:
                case MezDSLParser.DATETIME:
                case MezDSLParser.JSON:
                case MezDSLParser.JSONARRAY:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 828;
                        this.primitiveType();
                    }
                    break;
                case MezDSLParser.ID:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 829;
                        this.match(MezDSLParser.ID);
                    }
                    break;
                case MezDSLParser.ENUM_ID:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 830;
                        this.match(MezDSLParser.ENUM_ID);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    parameter() {
        let _localctx = new ParameterContext(this._ctx, this.state);
        this.enterRule(_localctx, 116, MezDSLParser.RULE_parameter);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 833;
                _localctx._typeName = this.typeName();
                this.state = 835;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.COL) {
                    {
                        this.state = 834;
                        _localctx._COL = this.match(MezDSLParser.COL);
                    }
                }
                this.state = 837;
                _localctx._ID = this.match(MezDSLParser.ID);
                {
                    token("PARAMETER", (_localctx._typeName != null ? this._input.getTextFromRange(_localctx._typeName._start, _localctx._typeName._stop) : undefined) + isNull((_localctx._COL != null ? _localctx._COL.text : undefined)) + " " + (_localctx._ID != null ? _localctx._ID.text : undefined), (_localctx._ID != null ? _localctx._ID.line : 0), (_localctx._ID != null ? _localctx._ID.charPositionInLine : 0));
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    statement() {
        let _localctx = new StatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 118, MezDSLParser.RULE_statement);
        try {
            this.state = 842;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.RETURN:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 840;
                        this.returnStatement();
                    }
                    break;
                case MezDSLParser.T__20:
                case MezDSLParser.T__21:
                case MezDSLParser.OBJECT_INVITE:
                case MezDSLParser.COLLECTION_SELECT:
                case MezDSLParser.ALERT:
                case MezDSLParser.ALERT_WARN:
                case MezDSLParser.ALERT_ERROR:
                case MezDSLParser.ERROR:
                case MezDSLParser.LOG:
                case MezDSLParser.WARN:
                case MezDSLParser.SMS:
                case MezDSLParser.SMS_SEND:
                case MezDSLParser.SMS_END_CONVERSATION:
                case MezDSLParser.EMAIL:
                case MezDSLParser.EMAIL_ATTACH:
                case MezDSLParser.EMAIL_CSV:
                case MezDSLParser.PAYMENT_STATUS_REQUEST:
                case MezDSLParser.CREATE_CRYPTO_KEY:
                case MezDSLParser.DOWNLOAD_REPORT:
                case MezDSLParser.DOWNLOAD_FILE:
                case MezDSLParser.API_SET_STATUS_CODE:
                case MezDSLParser.ID:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 841;
                        this.simpleStatement();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    returnStatement() {
        let _localctx = new ReturnStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 120, MezDSLParser.RULE_returnStatement);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 844;
                this.match(MezDSLParser.RETURN);
                this.state = 846;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__9 || _la === MezDSLParser.OBJECT_INVITE || _la === MezDSLParser.COLLECTION_SELECT || ((((_la - 89)) & ~0x1F) === 0 && ((1 << (_la - 89)) & ((1 << (MezDSLParser.NOW - 89)) | (1 << (MezDSLParser.TODAY - 89)) | (1 << (MezDSLParser.SMS - 89)) | (1 << (MezDSLParser.SMS_SEND - 89)) | (1 << (MezDSLParser.SMS_GET_CONVERSATION_ID - 89)) | (1 << (MezDSLParser.COLLECTION_CSV - 89)) | (1 << (MezDSLParser.USER_ROLE - 89)) | (1 << (MezDSLParser.ENCRYPT - 89)) | (1 << (MezDSLParser.DECRYPT - 89)) | (1 << (MezDSLParser.CBC_ENCRYPT - 89)) | (1 << (MezDSLParser.CBC_DECRYPT - 89)) | (1 << (MezDSLParser.GENERATE_REPORT - 89)) | (1 << (MezDSLParser.API_GET - 89)) | (1 << (MezDSLParser.API_POST - 89)) | (1 << (MezDSLParser.API_DELETE - 89)) | (1 << (MezDSLParser.API_PUT - 89)) | (1 << (MezDSLParser.CREATE_BATCH - 89)))) !== 0) || ((((_la - 153)) & ~0x1F) === 0 && ((1 << (_la - 153)) & ((1 << (MezDSLParser.POW - 153)) | (1 << (MezDSLParser.SQRT - 153)) | (1 << (MezDSLParser.RANDOM - 153)) | (1 << (MezDSLParser.FLOOR - 153)) | (1 << (MezDSLParser.CEILING - 153)) | (1 << (MezDSLParser.ROUND - 153)) | (1 << (MezDSLParser.STRINGS_CONCAT - 153)) | (1 << (MezDSLParser.STRINGS_LENGTH - 153)) | (1 << (MezDSLParser.STRINGS_SPLIT - 153)) | (1 << (MezDSLParser.STRING_CONCAT - 153)) | (1 << (MezDSLParser.STRING_ENDS_WITH - 153)) | (1 << (MezDSLParser.STRING_INDEX_OF - 153)) | (1 << (MezDSLParser.STRING_JOIN - 153)) | (1 << (MezDSLParser.STRING_LENGTH - 153)) | (1 << (MezDSLParser.STRING_LOWER - 153)) | (1 << (MezDSLParser.STRING_UPPER - 153)) | (1 << (MezDSLParser.STRING_SPLIT - 153)) | (1 << (MezDSLParser.STRING_STARTS_WITH - 153)) | (1 << (MezDSLParser.STRING_SUBSTRING - 153)) | (1 << (MezDSLParser.STRING_TRANSLATE - 153)) | (1 << (MezDSLParser.STRING_REGEX_MATCH - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_FIRST - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_REGEX_FIND - 153)) | (1 << (MezDSLParser.STRING_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_URL_ENCODE - 153)) | (1 << (MezDSLParser.STRING_URL_DECODE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV_LINE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV - 153)) | (1 << (MezDSLParser.DATE_FROM_STRING - 153)) | (1 << (MezDSLParser.DATE_FROM_ISO_STRING - 153)) | (1 << (MezDSLParser.DATE_TIME_FROM_STRING - 153)))) !== 0) || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & ((1 << (MezDSLParser.DATE_TIME_FROM_ISO_STRING - 185)) | (1 << (MezDSLParser.DATE_TIME_FROM_LONG - 185)) | (1 << (MezDSLParser.DATE_NOW - 185)) | (1 << (MezDSLParser.DATE_TODAY - 185)) | (1 << (MezDSLParser.DATE_ADD_DAYS - 185)) | (1 << (MezDSLParser.DATE_ADD_MONTHS - 185)) | (1 << (MezDSLParser.DATE_ADD_SECONDS - 185)) | (1 << (MezDSLParser.DATE_DAYS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_EXTRACT - 185)) | (1 << (MezDSLParser.DATE_MONTHS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_SECONDS_BETWEEN - 185)) | (1 << (MezDSLParser.INTEGER_FROM_STRING - 185)) | (1 << (MezDSLParser.DECIMAL_FROM_STRING - 185)) | (1 << (MezDSLParser.LONG_FROM_STRING - 185)) | (1 << (MezDSLParser.UUID_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_WRAPPER_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_TO_STRING - 185)) | (1 << (MezDSLParser.HELIUM_GET_PLATFORM - 185)))) !== 0) || ((((_la - 242)) & ~0x1F) === 0 && ((1 << (_la - 242)) & ((1 << (MezDSLParser.MINUS - 242)) | (1 << (MezDSLParser.SQL_EXECUTE - 242)) | (1 << (MezDSLParser.SQL_QUERY - 242)) | (1 << (MezDSLParser.NULL - 242)) | (1 << (MezDSLParser.TRUE - 242)) | (1 << (MezDSLParser.FALSE - 242)) | (1 << (MezDSLParser.ENUM_ID - 242)) | (1 << (MezDSLParser.ID - 242)) | (1 << (MezDSLParser.DEC_LITERAL - 242)) | (1 << (MezDSLParser.INT_LITERAL - 242)) | (1 << (MezDSLParser.LONG_LITERAL - 242)) | (1 << (MezDSLParser.STR_LITERAL - 242)) | (1 << (MezDSLParser.STR_BLOCK - 242)))) !== 0)) {
                    {
                        this.state = 845;
                        this.expression();
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    simpleStatement() {
        let _localctx = new SimpleStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 122, MezDSLParser.RULE_simpleStatement);
        try {
            this.state = 854;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 42, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 848;
                        this.assignStatement();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 849;
                        this.bifStatement();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 850;
                        this.functionCall();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 851;
                        this.incrementStatement();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 852;
                        this.decrementStatement();
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 853;
                        this.throwStatement();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    incrementStatement() {
        let _localctx = new IncrementStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 124, MezDSLParser.RULE_incrementStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 856;
                this.match(MezDSLParser.ID);
                this.state = 857;
                this.match(MezDSLParser.INC);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    decrementStatement() {
        let _localctx = new DecrementStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 126, MezDSLParser.RULE_decrementStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 859;
                this.match(MezDSLParser.ID);
                this.state = 860;
                this.match(MezDSLParser.DEC);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    complexStatement() {
        let _localctx = new ComplexStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 128, MezDSLParser.RULE_complexStatement);
        try {
            this.state = 866;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.T__18:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 862;
                        this.ifStatement();
                    }
                    break;
                case MezDSLParser.T__14:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 863;
                        this.forLoop();
                    }
                    break;
                case MezDSLParser.T__12:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 864;
                        this.forEach();
                    }
                    break;
                case MezDSLParser.T__15:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 865;
                        this.tryStatement();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forEach() {
        let _localctx = new ForEachContext(this._ctx, this.state);
        this.enterRule(_localctx, 130, MezDSLParser.RULE_forEach);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 868;
                this.match(MezDSLParser.T__12);
                this.state = 869;
                this.match(MezDSLParser.T__9);
                this.state = 870;
                this.variableDeclaration();
                this.state = 871;
                this.match(MezDSLParser.T__13);
                this.state = 872;
                this.expression();
                this.state = 873;
                this.match(MezDSLParser.T__10);
                this.state = 874;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoop() {
        let _localctx = new ForLoopContext(this._ctx, this.state);
        this.enterRule(_localctx, 132, MezDSLParser.RULE_forLoop);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 876;
                this.match(MezDSLParser.T__14);
                this.state = 877;
                this.forLoopParams();
                this.state = 878;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoopParams() {
        let _localctx = new ForLoopParamsContext(this._ctx, this.state);
        this.enterRule(_localctx, 134, MezDSLParser.RULE_forLoopParams);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 880;
                this.match(MezDSLParser.T__9);
                this.state = 882;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & ((1 << (MezDSLParser.T__20 - 21)) | (1 << (MezDSLParser.T__21 - 21)) | (1 << (MezDSLParser.OBJECT_INVITE - 21)) | (1 << (MezDSLParser.COLLECTION_SELECT - 21)))) !== 0) || ((((_la - 83)) & ~0x1F) === 0 && ((1 << (_la - 83)) & ((1 << (MezDSLParser.ALERT - 83)) | (1 << (MezDSLParser.ALERT_WARN - 83)) | (1 << (MezDSLParser.ALERT_ERROR - 83)) | (1 << (MezDSLParser.ERROR - 83)) | (1 << (MezDSLParser.LOG - 83)) | (1 << (MezDSLParser.WARN - 83)) | (1 << (MezDSLParser.SMS - 83)) | (1 << (MezDSLParser.SMS_SEND - 83)) | (1 << (MezDSLParser.SMS_END_CONVERSATION - 83)) | (1 << (MezDSLParser.EMAIL - 83)) | (1 << (MezDSLParser.EMAIL_ATTACH - 83)) | (1 << (MezDSLParser.EMAIL_CSV - 83)) | (1 << (MezDSLParser.PAYMENT_STATUS_REQUEST - 83)) | (1 << (MezDSLParser.CREATE_CRYPTO_KEY - 83)) | (1 << (MezDSLParser.DOWNLOAD_REPORT - 83)) | (1 << (MezDSLParser.DOWNLOAD_FILE - 83)) | (1 << (MezDSLParser.API_SET_STATUS_CODE - 83)))) !== 0) || ((((_la - 215)) & ~0x1F) === 0 && ((1 << (_la - 215)) & ((1 << (MezDSLParser.INT - 215)) | (1 << (MezDSLParser.DECIMAL - 215)) | (1 << (MezDSLParser.LONG - 215)) | (1 << (MezDSLParser.UUID - 215)) | (1 << (MezDSLParser.BLOB - 215)) | (1 << (MezDSLParser.BOOL - 215)) | (1 << (MezDSLParser.STRING - 215)) | (1 << (MezDSLParser.VOID - 215)) | (1 << (MezDSLParser.DATE - 215)) | (1 << (MezDSLParser.DATETIME - 215)) | (1 << (MezDSLParser.JSON - 215)) | (1 << (MezDSLParser.JSONARRAY - 215)))) !== 0) || _la === MezDSLParser.ENUM_ID || _la === MezDSLParser.ID) {
                    {
                        this.state = 881;
                        this.forLoopInitialCondition();
                    }
                }
                this.state = 884;
                this.match(MezDSLParser.T__1);
                this.state = 886;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__9 || _la === MezDSLParser.OBJECT_INVITE || _la === MezDSLParser.COLLECTION_SELECT || ((((_la - 89)) & ~0x1F) === 0 && ((1 << (_la - 89)) & ((1 << (MezDSLParser.NOW - 89)) | (1 << (MezDSLParser.TODAY - 89)) | (1 << (MezDSLParser.SMS - 89)) | (1 << (MezDSLParser.SMS_SEND - 89)) | (1 << (MezDSLParser.SMS_GET_CONVERSATION_ID - 89)) | (1 << (MezDSLParser.COLLECTION_CSV - 89)) | (1 << (MezDSLParser.USER_ROLE - 89)) | (1 << (MezDSLParser.ENCRYPT - 89)) | (1 << (MezDSLParser.DECRYPT - 89)) | (1 << (MezDSLParser.CBC_ENCRYPT - 89)) | (1 << (MezDSLParser.CBC_DECRYPT - 89)) | (1 << (MezDSLParser.GENERATE_REPORT - 89)) | (1 << (MezDSLParser.API_GET - 89)) | (1 << (MezDSLParser.API_POST - 89)) | (1 << (MezDSLParser.API_DELETE - 89)) | (1 << (MezDSLParser.API_PUT - 89)) | (1 << (MezDSLParser.CREATE_BATCH - 89)))) !== 0) || ((((_la - 153)) & ~0x1F) === 0 && ((1 << (_la - 153)) & ((1 << (MezDSLParser.POW - 153)) | (1 << (MezDSLParser.SQRT - 153)) | (1 << (MezDSLParser.RANDOM - 153)) | (1 << (MezDSLParser.FLOOR - 153)) | (1 << (MezDSLParser.CEILING - 153)) | (1 << (MezDSLParser.ROUND - 153)) | (1 << (MezDSLParser.STRINGS_CONCAT - 153)) | (1 << (MezDSLParser.STRINGS_LENGTH - 153)) | (1 << (MezDSLParser.STRINGS_SPLIT - 153)) | (1 << (MezDSLParser.STRING_CONCAT - 153)) | (1 << (MezDSLParser.STRING_ENDS_WITH - 153)) | (1 << (MezDSLParser.STRING_INDEX_OF - 153)) | (1 << (MezDSLParser.STRING_JOIN - 153)) | (1 << (MezDSLParser.STRING_LENGTH - 153)) | (1 << (MezDSLParser.STRING_LOWER - 153)) | (1 << (MezDSLParser.STRING_UPPER - 153)) | (1 << (MezDSLParser.STRING_SPLIT - 153)) | (1 << (MezDSLParser.STRING_STARTS_WITH - 153)) | (1 << (MezDSLParser.STRING_SUBSTRING - 153)) | (1 << (MezDSLParser.STRING_TRANSLATE - 153)) | (1 << (MezDSLParser.STRING_REGEX_MATCH - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_FIRST - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_REGEX_FIND - 153)) | (1 << (MezDSLParser.STRING_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_URL_ENCODE - 153)) | (1 << (MezDSLParser.STRING_URL_DECODE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV_LINE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV - 153)) | (1 << (MezDSLParser.DATE_FROM_STRING - 153)) | (1 << (MezDSLParser.DATE_FROM_ISO_STRING - 153)) | (1 << (MezDSLParser.DATE_TIME_FROM_STRING - 153)))) !== 0) || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & ((1 << (MezDSLParser.DATE_TIME_FROM_ISO_STRING - 185)) | (1 << (MezDSLParser.DATE_TIME_FROM_LONG - 185)) | (1 << (MezDSLParser.DATE_NOW - 185)) | (1 << (MezDSLParser.DATE_TODAY - 185)) | (1 << (MezDSLParser.DATE_ADD_DAYS - 185)) | (1 << (MezDSLParser.DATE_ADD_MONTHS - 185)) | (1 << (MezDSLParser.DATE_ADD_SECONDS - 185)) | (1 << (MezDSLParser.DATE_DAYS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_EXTRACT - 185)) | (1 << (MezDSLParser.DATE_MONTHS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_SECONDS_BETWEEN - 185)) | (1 << (MezDSLParser.INTEGER_FROM_STRING - 185)) | (1 << (MezDSLParser.DECIMAL_FROM_STRING - 185)) | (1 << (MezDSLParser.LONG_FROM_STRING - 185)) | (1 << (MezDSLParser.UUID_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_WRAPPER_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_TO_STRING - 185)) | (1 << (MezDSLParser.HELIUM_GET_PLATFORM - 185)))) !== 0) || ((((_la - 242)) & ~0x1F) === 0 && ((1 << (_la - 242)) & ((1 << (MezDSLParser.MINUS - 242)) | (1 << (MezDSLParser.SQL_EXECUTE - 242)) | (1 << (MezDSLParser.SQL_QUERY - 242)) | (1 << (MezDSLParser.NULL - 242)) | (1 << (MezDSLParser.TRUE - 242)) | (1 << (MezDSLParser.FALSE - 242)) | (1 << (MezDSLParser.ENUM_ID - 242)) | (1 << (MezDSLParser.ID - 242)) | (1 << (MezDSLParser.DEC_LITERAL - 242)) | (1 << (MezDSLParser.INT_LITERAL - 242)) | (1 << (MezDSLParser.LONG_LITERAL - 242)) | (1 << (MezDSLParser.STR_LITERAL - 242)) | (1 << (MezDSLParser.STR_BLOCK - 242)))) !== 0)) {
                    {
                        this.state = 885;
                        this.forLoopCondition();
                    }
                }
                this.state = 888;
                this.match(MezDSLParser.T__1);
                this.state = 890;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (((((_la - 21)) & ~0x1F) === 0 && ((1 << (_la - 21)) & ((1 << (MezDSLParser.T__20 - 21)) | (1 << (MezDSLParser.T__21 - 21)) | (1 << (MezDSLParser.OBJECT_INVITE - 21)) | (1 << (MezDSLParser.COLLECTION_SELECT - 21)))) !== 0) || ((((_la - 83)) & ~0x1F) === 0 && ((1 << (_la - 83)) & ((1 << (MezDSLParser.ALERT - 83)) | (1 << (MezDSLParser.ALERT_WARN - 83)) | (1 << (MezDSLParser.ALERT_ERROR - 83)) | (1 << (MezDSLParser.ERROR - 83)) | (1 << (MezDSLParser.LOG - 83)) | (1 << (MezDSLParser.WARN - 83)) | (1 << (MezDSLParser.SMS - 83)) | (1 << (MezDSLParser.SMS_SEND - 83)) | (1 << (MezDSLParser.SMS_END_CONVERSATION - 83)) | (1 << (MezDSLParser.EMAIL - 83)) | (1 << (MezDSLParser.EMAIL_ATTACH - 83)) | (1 << (MezDSLParser.EMAIL_CSV - 83)) | (1 << (MezDSLParser.PAYMENT_STATUS_REQUEST - 83)) | (1 << (MezDSLParser.CREATE_CRYPTO_KEY - 83)) | (1 << (MezDSLParser.DOWNLOAD_REPORT - 83)) | (1 << (MezDSLParser.DOWNLOAD_FILE - 83)) | (1 << (MezDSLParser.API_SET_STATUS_CODE - 83)))) !== 0) || _la === MezDSLParser.ID) {
                    {
                        this.state = 889;
                        this.forLoopPostLoop();
                    }
                }
                this.state = 892;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoopInitialCondition() {
        let _localctx = new ForLoopInitialConditionContext(this._ctx, this.state);
        this.enterRule(_localctx, 136, MezDSLParser.RULE_forLoopInitialCondition);
        try {
            this.state = 896;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 47, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 894;
                        this.simpleStatement();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 895;
                        this.variableDeclareInit();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoopCondition() {
        let _localctx = new ForLoopConditionContext(this._ctx, this.state);
        this.enterRule(_localctx, 138, MezDSLParser.RULE_forLoopCondition);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 898;
                _localctx._lhs = this.addExpression();
                this.state = 899;
                this.forLoopConditionOperator();
                this.state = 900;
                _localctx._rhs = this.addExpression();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoopPostLoop() {
        let _localctx = new ForLoopPostLoopContext(this._ctx, this.state);
        this.enterRule(_localctx, 140, MezDSLParser.RULE_forLoopPostLoop);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 902;
                this.simpleStatement();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forLoopConditionOperator() {
        let _localctx = new ForLoopConditionOperatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 142, MezDSLParser.RULE_forLoopConditionOperator);
        try {
            this.state = 906;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.LT:
                case MezDSLParser.LTE:
                case MezDSLParser.GT:
                case MezDSLParser.GTE:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 904;
                        this.comparisonOperator();
                    }
                    break;
                case MezDSLParser.EQU:
                case MezDSLParser.NEQU:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 905;
                        this.equalityOperator();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    tryStatement() {
        let _localctx = new TryStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 144, MezDSLParser.RULE_tryStatement);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 908;
                this.match(MezDSLParser.T__15);
                this.state = 909;
                this.codeBlock();
                this.state = 911;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__16) {
                    {
                        this.state = 910;
                        this.catchPart();
                    }
                }
                this.state = 914;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__17) {
                    {
                        this.state = 913;
                        this.finallyPart();
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    catchPart() {
        let _localctx = new CatchPartContext(this._ctx, this.state);
        this.enterRule(_localctx, 146, MezDSLParser.RULE_catchPart);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 916;
                this.match(MezDSLParser.T__16);
                this.state = 917;
                this.match(MezDSLParser.T__9);
                this.state = 918;
                this.match(MezDSLParser.ID);
                this.state = 919;
                this.match(MezDSLParser.T__10);
                this.state = 920;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    finallyPart() {
        let _localctx = new FinallyPartContext(this._ctx, this.state);
        this.enterRule(_localctx, 148, MezDSLParser.RULE_finallyPart);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 922;
                this.match(MezDSLParser.T__17);
                this.state = 923;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    ifStatement() {
        let _localctx = new IfStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 150, MezDSLParser.RULE_ifStatement);
        let _la;
        try {
            let _alt;
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 925;
                this.match(MezDSLParser.T__18);
                this.state = 926;
                this.match(MezDSLParser.T__9);
                this.state = 927;
                this.orExpression();
                this.state = 928;
                this.match(MezDSLParser.T__10);
                this.state = 929;
                this.codeBlock();
                this.state = 933;
                this._errHandler.sync(this);
                _alt = this.interpreter.adaptivePredict(this._input, 51, this._ctx);
                while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                    if (_alt === 1) {
                        {
                            {
                                this.state = 930;
                                this.elseIfPart();
                            }
                        }
                    }
                    this.state = 935;
                    this._errHandler.sync(this);
                    _alt = this.interpreter.adaptivePredict(this._input, 51, this._ctx);
                }
                this.state = 937;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__19) {
                    {
                        this.state = 936;
                        this.elsePart();
                    }
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    elseIfPart() {
        let _localctx = new ElseIfPartContext(this._ctx, this.state);
        this.enterRule(_localctx, 152, MezDSLParser.RULE_elseIfPart);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 939;
                this.match(MezDSLParser.T__19);
                this.state = 940;
                this.match(MezDSLParser.T__18);
                this.state = 941;
                this.match(MezDSLParser.T__9);
                this.state = 942;
                this.orExpression();
                this.state = 943;
                this.match(MezDSLParser.T__10);
                this.state = 944;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    elsePart() {
        let _localctx = new ElsePartContext(this._ctx, this.state);
        this.enterRule(_localctx, 154, MezDSLParser.RULE_elsePart);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 946;
                this.match(MezDSLParser.T__19);
                this.state = 947;
                this.codeBlock();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    throwStatement() {
        let _localctx = new ThrowStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 156, MezDSLParser.RULE_throwStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 949;
                this.match(MezDSLParser.T__20);
                this.state = 950;
                this.expression();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    bifStatement() {
        let _localctx = new BifStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 158, MezDSLParser.RULE_bifStatement);
        try {
            this.state = 958;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 53, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 952;
                        this.systemBIFStatement();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 953;
                        this.persistenceBIFStatement();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 954;
                        this.instanceBIFStatement();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 955;
                        this.assertBIFStatement();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 956;
                        this.jsonBIFStatement();
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 957;
                        this.apiBIFStatement();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    assertBIFStatement() {
        let _localctx = new AssertBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 160, MezDSLParser.RULE_assertBIFStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 960;
                this.match(MezDSLParser.T__21);
                this.state = 961;
                this.match(MezDSLParser.T__13);
                this.state = 962;
                this.assertBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    assertBIF() {
        let _localctx = new AssertBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 162, MezDSLParser.RULE_assertBIF);
        try {
            this.state = 1064;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.IS_EQUAL:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 964;
                        this.match(MezDSLParser.IS_EQUAL);
                        this.state = 965;
                        this.match(MezDSLParser.T__9);
                        this.state = 966;
                        this.expression();
                        this.state = 967;
                        this.match(MezDSLParser.T__7);
                        this.state = 968;
                        this.expression();
                        this.state = 969;
                        this.match(MezDSLParser.T__7);
                        this.state = 970;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 971;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_TRUE:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 973;
                        this.match(MezDSLParser.IS_TRUE);
                        this.state = 974;
                        this.match(MezDSLParser.T__9);
                        this.state = 975;
                        this.expression();
                        this.state = 976;
                        this.match(MezDSLParser.T__7);
                        this.state = 977;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 978;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_BOTH:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 980;
                        this.match(MezDSLParser.IS_BOTH);
                        this.state = 981;
                        this.match(MezDSLParser.T__9);
                        this.state = 982;
                        this.expression();
                        this.state = 983;
                        this.match(MezDSLParser.T__7);
                        this.state = 984;
                        this.expression();
                        this.state = 985;
                        this.match(MezDSLParser.T__7);
                        this.state = 986;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 987;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_EITHER:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 989;
                        this.match(MezDSLParser.IS_EITHER);
                        this.state = 990;
                        this.match(MezDSLParser.T__9);
                        this.state = 991;
                        this.expression();
                        this.state = 992;
                        this.match(MezDSLParser.T__7);
                        this.state = 993;
                        this.expression();
                        this.state = 994;
                        this.match(MezDSLParser.T__7);
                        this.state = 995;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 996;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_FALSE:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 998;
                        this.match(MezDSLParser.IS_FALSE);
                        this.state = 999;
                        this.match(MezDSLParser.T__9);
                        this.state = 1000;
                        this.expression();
                        this.state = 1001;
                        this.match(MezDSLParser.T__7);
                        this.state = 1002;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1003;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_GT:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1005;
                        this.match(MezDSLParser.IS_GT);
                        this.state = 1006;
                        this.match(MezDSLParser.T__9);
                        this.state = 1007;
                        this.expression();
                        this.state = 1008;
                        this.match(MezDSLParser.T__7);
                        this.state = 1009;
                        this.expression();
                        this.state = 1010;
                        this.match(MezDSLParser.T__7);
                        this.state = 1011;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1012;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_GTE:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1014;
                        this.match(MezDSLParser.IS_GTE);
                        this.state = 1015;
                        this.match(MezDSLParser.T__9);
                        this.state = 1016;
                        this.expression();
                        this.state = 1017;
                        this.match(MezDSLParser.T__7);
                        this.state = 1018;
                        this.expression();
                        this.state = 1019;
                        this.match(MezDSLParser.T__7);
                        this.state = 1020;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1021;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_LT:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1023;
                        this.match(MezDSLParser.IS_LT);
                        this.state = 1024;
                        this.match(MezDSLParser.T__9);
                        this.state = 1025;
                        this.expression();
                        this.state = 1026;
                        this.match(MezDSLParser.T__7);
                        this.state = 1027;
                        this.expression();
                        this.state = 1028;
                        this.match(MezDSLParser.T__7);
                        this.state = 1029;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1030;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_LTE:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 1032;
                        this.match(MezDSLParser.IS_LTE);
                        this.state = 1033;
                        this.match(MezDSLParser.T__9);
                        this.state = 1034;
                        this.expression();
                        this.state = 1035;
                        this.match(MezDSLParser.T__7);
                        this.state = 1036;
                        this.expression();
                        this.state = 1037;
                        this.match(MezDSLParser.T__7);
                        this.state = 1038;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1039;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_NOTEQUAL:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 1041;
                        this.match(MezDSLParser.IS_NOTEQUAL);
                        this.state = 1042;
                        this.match(MezDSLParser.T__9);
                        this.state = 1043;
                        this.expression();
                        this.state = 1044;
                        this.match(MezDSLParser.T__7);
                        this.state = 1045;
                        this.expression();
                        this.state = 1046;
                        this.match(MezDSLParser.T__7);
                        this.state = 1047;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1048;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_NULL:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 1050;
                        this.match(MezDSLParser.IS_NULL);
                        this.state = 1051;
                        this.match(MezDSLParser.T__9);
                        this.state = 1052;
                        this.expression();
                        this.state = 1053;
                        this.match(MezDSLParser.T__7);
                        this.state = 1054;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1055;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.IS_NOT_NULL:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 1057;
                        this.match(MezDSLParser.IS_NOT_NULL);
                        this.state = 1058;
                        this.match(MezDSLParser.T__9);
                        this.state = 1059;
                        this.expression();
                        this.state = 1060;
                        this.match(MezDSLParser.T__7);
                        this.state = 1061;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1062;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    instanceBIFStatement() {
        let _localctx = new InstanceBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 164, MezDSLParser.RULE_instanceBIFStatement);
        let _la;
        try {
            this.state = 1093;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 56, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1066;
                        this.accessExpression();
                        this.state = 1067;
                        this.match(MezDSLParser.T__22);
                        this.state = 1068;
                        this.collectionsStatementBIF();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1070;
                        this.accessExpression();
                        this.state = 1071;
                        this.match(MezDSLParser.T__22);
                        this.state = 1072;
                        this.notificationStatementBIF();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1074;
                        this.accessExpression();
                        this.state = 1075;
                        this.match(MezDSLParser.T__22);
                        this.state = 1076;
                        this.match(MezDSLParser.OBJECT_INVITE);
                        this.state = 1077;
                        this.match(MezDSLParser.T__9);
                        this.state = 1078;
                        this.expression();
                        this.state = 1081;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1079;
                                this.match(MezDSLParser.T__7);
                                this.state = 1080;
                                this.expression();
                            }
                        }
                        this.state = 1083;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1085;
                        this.accessExpression();
                        this.state = 1086;
                        this.match(MezDSLParser.T__22);
                        this.state = 1087;
                        this.removeRoleStatementBIF();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1089;
                        this.accessExpression();
                        this.state = 1090;
                        this.match(MezDSLParser.T__22);
                        this.state = 1091;
                        this.forcePasswordResetStatementBIF();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    collectionsStatementBIF() {
        let _localctx = new CollectionsStatementBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 166, MezDSLParser.RULE_collectionsStatementBIF);
        let _la;
        try {
            this.state = 1132;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.CLEAR:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1095;
                        this.match(MezDSLParser.CLEAR);
                        this.state = 1096;
                        this.match(MezDSLParser.T__9);
                        this.state = 1097;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.APPEND:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1098;
                        this.match(MezDSLParser.APPEND);
                        this.state = 1099;
                        this.match(MezDSLParser.T__9);
                        this.state = 1100;
                        this.expression();
                        this.state = 1101;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.PREPEND:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1103;
                        this.match(MezDSLParser.PREPEND);
                        this.state = 1104;
                        this.match(MezDSLParser.T__9);
                        this.state = 1105;
                        this.expression();
                        this.state = 1106;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SORTASC:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1108;
                        this.match(MezDSLParser.SORTASC);
                        this.state = 1109;
                        this.match(MezDSLParser.T__9);
                        this.state = 1111;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.STR_LITERAL) {
                            {
                                this.state = 1110;
                                this.match(MezDSLParser.STR_LITERAL);
                            }
                        }
                        this.state = 1113;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SORTDESC:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1114;
                        this.match(MezDSLParser.SORTDESC);
                        this.state = 1115;
                        this.match(MezDSLParser.T__9);
                        this.state = 1117;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.STR_LITERAL) {
                            {
                                this.state = 1116;
                                this.match(MezDSLParser.STR_LITERAL);
                            }
                        }
                        this.state = 1119;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.ADD:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1120;
                        this.match(MezDSLParser.ADD);
                        this.state = 1121;
                        this.match(MezDSLParser.T__9);
                        this.state = 1122;
                        this.expression();
                        this.state = 1123;
                        this.match(MezDSLParser.T__7);
                        this.state = 1124;
                        this.expression();
                        this.state = 1125;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.REMOVE:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1127;
                        this.match(MezDSLParser.REMOVE);
                        this.state = 1128;
                        this.match(MezDSLParser.T__9);
                        this.state = 1129;
                        this.expression();
                        this.state = 1130;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    notificationStatementBIF() {
        let _localctx = new NotificationStatementBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 168, MezDSLParser.RULE_notificationStatementBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1134;
                this.match(MezDSLParser.NOTIFY);
                this.state = 1135;
                this.match(MezDSLParser.T__9);
                this.state = 1136;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 1137;
                this.match(MezDSLParser.T__7);
                this.state = 1138;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 1139;
                this.match(MezDSLParser.T__7);
                this.state = 1140;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 1141;
                this.match(MezDSLParser.T__7);
                this.state = 1142;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 1143;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    removeRoleStatementBIF() {
        let _localctx = new RemoveRoleStatementBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 170, MezDSLParser.RULE_removeRoleStatementBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1145;
                this.match(MezDSLParser.REMOVE_ROLE);
                this.state = 1146;
                this.match(MezDSLParser.T__9);
                this.state = 1147;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    forcePasswordResetStatementBIF() {
        let _localctx = new ForcePasswordResetStatementBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 172, MezDSLParser.RULE_forcePasswordResetStatementBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1149;
                this.match(MezDSLParser.FORCE_PASSWORD_RESET);
                this.state = 1150;
                this.match(MezDSLParser.T__9);
                this.state = 1151;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    persistenceBIFStatement() {
        let _localctx = new PersistenceBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 174, MezDSLParser.RULE_persistenceBIFStatement);
        try {
            this.state = 1165;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 60, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1153;
                        this.match(MezDSLParser.ID);
                        this.state = 1154;
                        this.match(MezDSLParser.T__22);
                        this.state = 1155;
                        this.match(MezDSLParser.SAVE);
                        this.state = 1156;
                        this.match(MezDSLParser.T__9);
                        this.state = 1157;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1158;
                        this.match(MezDSLParser.ID);
                        this.state = 1159;
                        this.match(MezDSLParser.T__13);
                        this.state = 1160;
                        this.match(MezDSLParser.DELETE);
                        this.state = 1161;
                        this.match(MezDSLParser.T__9);
                        this.state = 1162;
                        this.expression();
                        this.state = 1163;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    systemBIFStatement() {
        let _localctx = new SystemBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 176, MezDSLParser.RULE_systemBIFStatement);
        let _la;
        try {
            let _alt;
            this.state = 1338;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 73, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1167;
                        this.match(MezDSLParser.LOG);
                        this.state = 1168;
                        this.match(MezDSLParser.T__9);
                        this.state = 1169;
                        this.expression();
                        this.state = 1170;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1172;
                        this.match(MezDSLParser.LOG);
                        this.state = 1173;
                        this.match(MezDSLParser.T__9);
                        this.state = 1174;
                        _localctx._key = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1175;
                        this.match(MezDSLParser.T__7);
                        this.state = 1176;
                        this.expression();
                        this.state = 1177;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1179;
                        this.match(MezDSLParser.WARN);
                        this.state = 1180;
                        this.match(MezDSLParser.T__9);
                        this.state = 1181;
                        this.expression();
                        this.state = 1182;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1184;
                        this.match(MezDSLParser.ERROR);
                        this.state = 1185;
                        this.match(MezDSLParser.T__9);
                        this.state = 1186;
                        this.expression();
                        this.state = 1187;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1189;
                        this.match(MezDSLParser.ALERT);
                        this.state = 1190;
                        this.match(MezDSLParser.T__9);
                        this.state = 1191;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1194;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1192;
                                this.match(MezDSLParser.T__7);
                                this.state = 1193;
                                this.match(MezDSLParser.STR_LITERAL);
                            }
                        }
                        this.state = 1196;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1197;
                        this.match(MezDSLParser.ALERT_WARN);
                        this.state = 1198;
                        this.match(MezDSLParser.T__9);
                        this.state = 1199;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1202;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1200;
                                this.match(MezDSLParser.T__7);
                                this.state = 1201;
                                this.match(MezDSLParser.STR_LITERAL);
                            }
                        }
                        this.state = 1204;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 7:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1205;
                        this.match(MezDSLParser.ALERT_ERROR);
                        this.state = 1206;
                        this.match(MezDSLParser.T__9);
                        this.state = 1207;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1210;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1208;
                                this.match(MezDSLParser.T__7);
                                this.state = 1209;
                                this.match(MezDSLParser.STR_LITERAL);
                            }
                        }
                        this.state = 1212;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 8:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1213;
                        this.match(MezDSLParser.SMS);
                        this.state = 1214;
                        this.match(MezDSLParser.T__9);
                        this.state = 1215;
                        this.expression();
                        this.state = 1216;
                        this.match(MezDSLParser.T__7);
                        this.state = 1217;
                        _localctx._attName = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1218;
                        this.match(MezDSLParser.T__7);
                        this.state = 1219;
                        _localctx._transKey = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1222;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1220;
                                this.match(MezDSLParser.T__7);
                                this.state = 1221;
                                this.expression();
                            }
                        }
                        this.state = 1224;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 9:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 1226;
                        this.match(MezDSLParser.SMS_SEND);
                        this.state = 1227;
                        this.match(MezDSLParser.T__9);
                        this.state = 1228;
                        this.expression();
                        this.state = 1229;
                        this.match(MezDSLParser.T__7);
                        this.state = 1230;
                        _localctx._attName = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1231;
                        this.match(MezDSLParser.T__7);
                        this.state = 1232;
                        _localctx._transKey = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1235;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1233;
                                this.match(MezDSLParser.T__7);
                                this.state = 1234;
                                this.expression();
                            }
                        }
                        this.state = 1237;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 10:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 1239;
                        this.match(MezDSLParser.SMS_END_CONVERSATION);
                        this.state = 1240;
                        this.match(MezDSLParser.T__9);
                        this.state = 1241;
                        this.expression();
                        this.state = 1242;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 11:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 1244;
                        this.match(MezDSLParser.EMAIL);
                        this.state = 1245;
                        this.match(MezDSLParser.T__9);
                        this.state = 1246;
                        this.expression();
                        this.state = 1247;
                        this.match(MezDSLParser.T__7);
                        this.state = 1248;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1249;
                        this.match(MezDSLParser.T__7);
                        this.state = 1250;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1251;
                        this.match(MezDSLParser.T__7);
                        this.state = 1252;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1256;
                        this._errHandler.sync(this);
                        _alt = this.interpreter.adaptivePredict(this._input, 66, this._ctx);
                        while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER) {
                            if (_alt === 1) {
                                {
                                    {
                                        this.state = 1253;
                                        this.emailAttachment();
                                    }
                                }
                            }
                            this.state = 1258;
                            this._errHandler.sync(this);
                            _alt = this.interpreter.adaptivePredict(this._input, 66, this._ctx);
                        }
                        this.state = 1261;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1259;
                                this.match(MezDSLParser.T__7);
                                this.state = 1260;
                                this.enumValueExpression();
                            }
                        }
                        this.state = 1263;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 12:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 1265;
                        this.match(MezDSLParser.EMAIL_ATTACH);
                        this.state = 1266;
                        this.match(MezDSLParser.T__9);
                        this.state = 1267;
                        this.expression();
                        this.state = 1268;
                        this.match(MezDSLParser.T__7);
                        this.state = 1269;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1270;
                        this.match(MezDSLParser.T__7);
                        this.state = 1271;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1272;
                        this.match(MezDSLParser.T__7);
                        this.state = 1273;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1275;
                        this._errHandler.sync(this);
                        _alt = 1;
                        do {
                            switch (_alt) {
                                case 1:
                                    {
                                        {
                                            this.state = 1274;
                                            this.emailNamedAttachment();
                                        }
                                    }
                                    break;
                                default:
                                    throw new NoViableAltException_1.NoViableAltException(this);
                            }
                            this.state = 1277;
                            this._errHandler.sync(this);
                            _alt = this.interpreter.adaptivePredict(this._input, 68, this._ctx);
                        } while (_alt !== 2 && _alt !== ATN_1.ATN.INVALID_ALT_NUMBER);
                        this.state = 1281;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1279;
                                this.match(MezDSLParser.T__7);
                                this.state = 1280;
                                this.enumValueExpression();
                            }
                        }
                        this.state = 1283;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 13:
                    this.enterOuterAlt(_localctx, 13);
                    {
                        this.state = 1285;
                        this.match(MezDSLParser.EMAIL_CSV);
                        this.state = 1286;
                        this.match(MezDSLParser.T__9);
                        this.state = 1287;
                        this.expression();
                        this.state = 1288;
                        this.match(MezDSLParser.T__7);
                        this.state = 1289;
                        this.expression();
                        this.state = 1290;
                        this.match(MezDSLParser.T__7);
                        this.state = 1291;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1292;
                        this.match(MezDSLParser.T__7);
                        this.state = 1293;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1294;
                        this.match(MezDSLParser.T__7);
                        this.state = 1295;
                        this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1298;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1296;
                                this.match(MezDSLParser.T__7);
                                this.state = 1297;
                                this.expression();
                            }
                        }
                        this.state = 1300;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 14:
                    this.enterOuterAlt(_localctx, 14);
                    {
                        this.state = 1302;
                        this.match(MezDSLParser.PAYMENT_STATUS_REQUEST);
                        this.state = 1303;
                        this.match(MezDSLParser.T__9);
                        this.state = 1304;
                        this.expression();
                        this.state = 1305;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 15:
                    this.enterOuterAlt(_localctx, 15);
                    {
                        this.state = 1307;
                        this.match(MezDSLParser.CREATE_CRYPTO_KEY);
                        this.state = 1308;
                        this.match(MezDSLParser.T__9);
                        this.state = 1309;
                        this.expression();
                        this.state = 1310;
                        this.match(MezDSLParser.T__7);
                        this.state = 1311;
                        this.expression();
                        this.state = 1312;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 16:
                    this.enterOuterAlt(_localctx, 16);
                    {
                        this.state = 1314;
                        this.match(MezDSLParser.DOWNLOAD_REPORT);
                        this.state = 1315;
                        this.match(MezDSLParser.T__9);
                        this.state = 1316;
                        this.expression();
                        this.state = 1317;
                        this.match(MezDSLParser.T__7);
                        this.state = 1318;
                        this.expression();
                        this.state = 1319;
                        this.match(MezDSLParser.T__7);
                        this.state = 1320;
                        this.expression();
                        this.state = 1323;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1321;
                                this.match(MezDSLParser.T__7);
                                this.state = 1322;
                                this.expression();
                            }
                        }
                        this.state = 1325;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 17:
                    this.enterOuterAlt(_localctx, 17);
                    {
                        this.state = 1327;
                        this.match(MezDSLParser.DOWNLOAD_FILE);
                        this.state = 1328;
                        this.match(MezDSLParser.T__9);
                        this.state = 1329;
                        this.expression();
                        this.state = 1330;
                        this.match(MezDSLParser.T__7);
                        this.state = 1331;
                        _localctx._attName = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1334;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1332;
                                this.match(MezDSLParser.T__7);
                                this.state = 1333;
                                this.expression();
                            }
                        }
                        this.state = 1336;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    emailNamedAttachment() {
        let _localctx = new EmailNamedAttachmentContext(this._ctx, this.state);
        this.enterRule(_localctx, 178, MezDSLParser.RULE_emailNamedAttachment);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1340;
                this.match(MezDSLParser.T__7);
                this.state = 1341;
                this.match(MezDSLParser.T__3);
                this.state = 1342;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 1343;
                this.match(MezDSLParser.T__7);
                this.state = 1344;
                this.functionCall();
                this.state = 1345;
                this.match(MezDSLParser.T__4);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    emailAttachment() {
        let _localctx = new EmailAttachmentContext(this._ctx, this.state);
        this.enterRule(_localctx, 180, MezDSLParser.RULE_emailAttachment);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1347;
                this.match(MezDSLParser.T__7);
                this.state = 1348;
                this.match(MezDSLParser.STR_LITERAL);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    assignStatement() {
        let _localctx = new AssignStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 182, MezDSLParser.RULE_assignStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1350;
                this.accessExpression();
                this.state = 1351;
                this.match(MezDSLParser.ASSIGN);
                this.state = 1352;
                this.expression();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    expression() {
        let _localctx = new ExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 184, MezDSLParser.RULE_expression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1354;
                this.orExpression();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    orExpression() {
        let _localctx = new OrExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 186, MezDSLParser.RULE_orExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1356;
                this.andExpression();
                this.state = 1361;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.OR) {
                    {
                        {
                            this.state = 1357;
                            this.match(MezDSLParser.OR);
                            this.state = 1358;
                            this.andExpression();
                        }
                    }
                    this.state = 1363;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    andExpression() {
        let _localctx = new AndExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 188, MezDSLParser.RULE_andExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1364;
                this.equalityExpression();
                this.state = 1369;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.AND) {
                    {
                        {
                            this.state = 1365;
                            this.match(MezDSLParser.AND);
                            this.state = 1366;
                            this.equalityExpression();
                        }
                    }
                    this.state = 1371;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    equalityExpression() {
        let _localctx = new EqualityExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 190, MezDSLParser.RULE_equalityExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1372;
                this.comparisonExpression();
                this.state = 1378;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.EQU || _la === MezDSLParser.NEQU) {
                    {
                        {
                            this.state = 1373;
                            this.equalityOperator();
                            this.state = 1374;
                            this.comparisonExpression();
                        }
                    }
                    this.state = 1380;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    comparisonExpression() {
        let _localctx = new ComparisonExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 192, MezDSLParser.RULE_comparisonExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1381;
                this.addExpression();
                this.state = 1387;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (((((_la - 233)) & ~0x1F) === 0 && ((1 << (_la - 233)) & ((1 << (MezDSLParser.LT - 233)) | (1 << (MezDSLParser.LTE - 233)) | (1 << (MezDSLParser.GT - 233)) | (1 << (MezDSLParser.GTE - 233)))) !== 0)) {
                    {
                        {
                            this.state = 1382;
                            this.comparisonOperator();
                            this.state = 1383;
                            this.addExpression();
                        }
                    }
                    this.state = 1389;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    comparisonOperator() {
        let _localctx = new ComparisonOperatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 194, MezDSLParser.RULE_comparisonOperator);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1390;
                _la = this._input.LA(1);
                if (!(((((_la - 233)) & ~0x1F) === 0 && ((1 << (_la - 233)) & ((1 << (MezDSLParser.LT - 233)) | (1 << (MezDSLParser.LTE - 233)) | (1 << (MezDSLParser.GT - 233)) | (1 << (MezDSLParser.GTE - 233)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    equalityOperator() {
        let _localctx = new EqualityOperatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 196, MezDSLParser.RULE_equalityOperator);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1392;
                _la = this._input.LA(1);
                if (!(_la === MezDSLParser.EQU || _la === MezDSLParser.NEQU)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    addExpression() {
        let _localctx = new AddExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 198, MezDSLParser.RULE_addExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1394;
                this.multExpression();
                this.state = 1400;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.PLUS || _la === MezDSLParser.MINUS) {
                    {
                        {
                            this.state = 1395;
                            this.addOperator();
                            this.state = 1396;
                            this.multExpression();
                        }
                    }
                    this.state = 1402;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    addOperator() {
        let _localctx = new AddOperatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 200, MezDSLParser.RULE_addOperator);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1403;
                _la = this._input.LA(1);
                if (!(_la === MezDSLParser.PLUS || _la === MezDSLParser.MINUS)) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    multExpression() {
        let _localctx = new MultExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 202, MezDSLParser.RULE_multExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1405;
                this.simpleExpression();
                this.state = 1411;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (((((_la - 243)) & ~0x1F) === 0 && ((1 << (_la - 243)) & ((1 << (MezDSLParser.MULT - 243)) | (1 << (MezDSLParser.DIV - 243)) | (1 << (MezDSLParser.MOD - 243)))) !== 0)) {
                    {
                        {
                            this.state = 1406;
                            this.multOperator();
                            this.state = 1407;
                            this.simpleExpression();
                        }
                    }
                    this.state = 1413;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    multOperator() {
        let _localctx = new MultOperatorContext(this._ctx, this.state);
        this.enterRule(_localctx, 204, MezDSLParser.RULE_multOperator);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1414;
                _la = this._input.LA(1);
                if (!(((((_la - 243)) & ~0x1F) === 0 && ((1 << (_la - 243)) & ((1 << (MezDSLParser.MULT - 243)) | (1 << (MezDSLParser.DIV - 243)) | (1 << (MezDSLParser.MOD - 243)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    simpleExpression() {
        let _localctx = new SimpleExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 206, MezDSLParser.RULE_simpleExpression);
        try {
            this.state = 1419;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.MINUS:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1416;
                        this.match(MezDSLParser.MINUS);
                        this.state = 1417;
                        this.atomicExpression();
                    }
                    break;
                case MezDSLParser.T__9:
                case MezDSLParser.OBJECT_INVITE:
                case MezDSLParser.COLLECTION_SELECT:
                case MezDSLParser.NOW:
                case MezDSLParser.TODAY:
                case MezDSLParser.SMS:
                case MezDSLParser.SMS_SEND:
                case MezDSLParser.SMS_GET_CONVERSATION_ID:
                case MezDSLParser.COLLECTION_CSV:
                case MezDSLParser.USER_ROLE:
                case MezDSLParser.ENCRYPT:
                case MezDSLParser.DECRYPT:
                case MezDSLParser.CBC_ENCRYPT:
                case MezDSLParser.CBC_DECRYPT:
                case MezDSLParser.GENERATE_REPORT:
                case MezDSLParser.API_GET:
                case MezDSLParser.API_POST:
                case MezDSLParser.API_DELETE:
                case MezDSLParser.API_PUT:
                case MezDSLParser.CREATE_BATCH:
                case MezDSLParser.POW:
                case MezDSLParser.SQRT:
                case MezDSLParser.RANDOM:
                case MezDSLParser.FLOOR:
                case MezDSLParser.CEILING:
                case MezDSLParser.ROUND:
                case MezDSLParser.STRINGS_CONCAT:
                case MezDSLParser.STRINGS_LENGTH:
                case MezDSLParser.STRINGS_SPLIT:
                case MezDSLParser.STRING_CONCAT:
                case MezDSLParser.STRING_ENDS_WITH:
                case MezDSLParser.STRING_INDEX_OF:
                case MezDSLParser.STRING_JOIN:
                case MezDSLParser.STRING_LENGTH:
                case MezDSLParser.STRING_LOWER:
                case MezDSLParser.STRING_UPPER:
                case MezDSLParser.STRING_SPLIT:
                case MezDSLParser.STRING_STARTS_WITH:
                case MezDSLParser.STRING_SUBSTRING:
                case MezDSLParser.STRING_TRANSLATE:
                case MezDSLParser.STRING_REGEX_MATCH:
                case MezDSLParser.STRING_REGEX_REPLACE_FIRST:
                case MezDSLParser.STRING_REGEX_REPLACE_ALL:
                case MezDSLParser.STRING_REGEX_FIND:
                case MezDSLParser.STRING_REPLACE_ALL:
                case MezDSLParser.STRING_URL_ENCODE:
                case MezDSLParser.STRING_URL_DECODE:
                case MezDSLParser.JSON_FROM_CSV_LINE:
                case MezDSLParser.JSON_FROM_CSV:
                case MezDSLParser.DATE_FROM_STRING:
                case MezDSLParser.DATE_FROM_ISO_STRING:
                case MezDSLParser.DATE_TIME_FROM_STRING:
                case MezDSLParser.DATE_TIME_FROM_ISO_STRING:
                case MezDSLParser.DATE_TIME_FROM_LONG:
                case MezDSLParser.DATE_NOW:
                case MezDSLParser.DATE_TODAY:
                case MezDSLParser.DATE_ADD_DAYS:
                case MezDSLParser.DATE_ADD_MONTHS:
                case MezDSLParser.DATE_ADD_SECONDS:
                case MezDSLParser.DATE_DAYS_BETWEEN:
                case MezDSLParser.DATE_EXTRACT:
                case MezDSLParser.DATE_MONTHS_BETWEEN:
                case MezDSLParser.DATE_SECONDS_BETWEEN:
                case MezDSLParser.INTEGER_FROM_STRING:
                case MezDSLParser.DECIMAL_FROM_STRING:
                case MezDSLParser.LONG_FROM_STRING:
                case MezDSLParser.UUID_FROM_STRING:
                case MezDSLParser.BLOB_FROM_STRING:
                case MezDSLParser.BLOB_WRAPPER_FROM_STRING:
                case MezDSLParser.BLOB_TO_STRING:
                case MezDSLParser.HELIUM_GET_PLATFORM:
                case MezDSLParser.SQL_EXECUTE:
                case MezDSLParser.SQL_QUERY:
                case MezDSLParser.NULL:
                case MezDSLParser.TRUE:
                case MezDSLParser.FALSE:
                case MezDSLParser.ENUM_ID:
                case MezDSLParser.ID:
                case MezDSLParser.DEC_LITERAL:
                case MezDSLParser.INT_LITERAL:
                case MezDSLParser.LONG_LITERAL:
                case MezDSLParser.STR_LITERAL:
                case MezDSLParser.STR_BLOCK:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1418;
                        this.atomicExpression();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    atomicExpression() {
        let _localctx = new AtomicExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 208, MezDSLParser.RULE_atomicExpression);
        try {
            this.state = 1432;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 81, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1421;
                        this.literalExpression();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1422;
                        this.enumValueExpression();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1423;
                        this.functionCall();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1424;
                        this.accessExpression();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1425;
                        this.bifExpression();
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1426;
                        this.incrementExpression();
                    }
                    break;
                case 7:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1427;
                        this.decrementExpression();
                    }
                    break;
                case 8:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1428;
                        this.match(MezDSLParser.T__9);
                        this.state = 1429;
                        this.expression();
                        this.state = 1430;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    literalExpression() {
        let _localctx = new LiteralExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 210, MezDSLParser.RULE_literalExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1434;
                _la = this._input.LA(1);
                if (!(((((_la - 254)) & ~0x1F) === 0 && ((1 << (_la - 254)) & ((1 << (MezDSLParser.NULL - 254)) | (1 << (MezDSLParser.TRUE - 254)) | (1 << (MezDSLParser.FALSE - 254)) | (1 << (MezDSLParser.DEC_LITERAL - 254)) | (1 << (MezDSLParser.INT_LITERAL - 254)) | (1 << (MezDSLParser.LONG_LITERAL - 254)) | (1 << (MezDSLParser.STR_LITERAL - 254)) | (1 << (MezDSLParser.STR_BLOCK - 254)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    enumValueExpression() {
        let _localctx = new EnumValueExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 212, MezDSLParser.RULE_enumValueExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1436;
                this.match(MezDSLParser.ENUM_ID);
                this.state = 1451;
                this._errHandler.sync(this);
                switch (this._input.LA(1)) {
                    case MezDSLParser.T__22:
                        {
                            {
                                this.state = 1437;
                                this.match(MezDSLParser.T__22);
                                this.state = 1438;
                                this.enumValueExpressionEntry();
                            }
                        }
                        break;
                    case MezDSLParser.T__3:
                        {
                            {
                                this.state = 1439;
                                this.match(MezDSLParser.T__3);
                                this.state = 1448;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                                if (_la === MezDSLParser.ID) {
                                    {
                                        this.state = 1440;
                                        this.enumValueExpressionEntry();
                                        this.state = 1445;
                                        this._errHandler.sync(this);
                                        _la = this._input.LA(1);
                                        while (_la === MezDSLParser.T__7) {
                                            {
                                                {
                                                    this.state = 1441;
                                                    this.match(MezDSLParser.T__7);
                                                    this.state = 1442;
                                                    this.enumValueExpressionEntry();
                                                }
                                            }
                                            this.state = 1447;
                                            this._errHandler.sync(this);
                                            _la = this._input.LA(1);
                                        }
                                    }
                                }
                                this.state = 1450;
                                this.match(MezDSLParser.T__4);
                            }
                        }
                        break;
                    default:
                        throw new NoViableAltException_1.NoViableAltException(this);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    enumValueExpressionEntry() {
        let _localctx = new EnumValueExpressionEntryContext(this._ctx, this.state);
        this.enterRule(_localctx, 214, MezDSLParser.RULE_enumValueExpressionEntry);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1453;
                this.match(MezDSLParser.ID);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    functionCall() {
        let _localctx = new FunctionCallContext(this._ctx, this.state);
        this.enterRule(_localctx, 216, MezDSLParser.RULE_functionCall);
        let _la;
        try {
            this.state = 1490;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 91, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1457;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.ID) {
                            {
                                this.state = 1455;
                                _localctx._unitID = this.match(MezDSLParser.ID);
                                this.state = 1456;
                                this.match(MezDSLParser.T__13);
                            }
                        }
                        this.state = 1459;
                        this.specialFunctionName();
                        this.state = 1460;
                        this.match(MezDSLParser.T__9);
                        this.state = 1469;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__9 || _la === MezDSLParser.OBJECT_INVITE || _la === MezDSLParser.COLLECTION_SELECT || ((((_la - 89)) & ~0x1F) === 0 && ((1 << (_la - 89)) & ((1 << (MezDSLParser.NOW - 89)) | (1 << (MezDSLParser.TODAY - 89)) | (1 << (MezDSLParser.SMS - 89)) | (1 << (MezDSLParser.SMS_SEND - 89)) | (1 << (MezDSLParser.SMS_GET_CONVERSATION_ID - 89)) | (1 << (MezDSLParser.COLLECTION_CSV - 89)) | (1 << (MezDSLParser.USER_ROLE - 89)) | (1 << (MezDSLParser.ENCRYPT - 89)) | (1 << (MezDSLParser.DECRYPT - 89)) | (1 << (MezDSLParser.CBC_ENCRYPT - 89)) | (1 << (MezDSLParser.CBC_DECRYPT - 89)) | (1 << (MezDSLParser.GENERATE_REPORT - 89)) | (1 << (MezDSLParser.API_GET - 89)) | (1 << (MezDSLParser.API_POST - 89)) | (1 << (MezDSLParser.API_DELETE - 89)) | (1 << (MezDSLParser.API_PUT - 89)) | (1 << (MezDSLParser.CREATE_BATCH - 89)))) !== 0) || ((((_la - 153)) & ~0x1F) === 0 && ((1 << (_la - 153)) & ((1 << (MezDSLParser.POW - 153)) | (1 << (MezDSLParser.SQRT - 153)) | (1 << (MezDSLParser.RANDOM - 153)) | (1 << (MezDSLParser.FLOOR - 153)) | (1 << (MezDSLParser.CEILING - 153)) | (1 << (MezDSLParser.ROUND - 153)) | (1 << (MezDSLParser.STRINGS_CONCAT - 153)) | (1 << (MezDSLParser.STRINGS_LENGTH - 153)) | (1 << (MezDSLParser.STRINGS_SPLIT - 153)) | (1 << (MezDSLParser.STRING_CONCAT - 153)) | (1 << (MezDSLParser.STRING_ENDS_WITH - 153)) | (1 << (MezDSLParser.STRING_INDEX_OF - 153)) | (1 << (MezDSLParser.STRING_JOIN - 153)) | (1 << (MezDSLParser.STRING_LENGTH - 153)) | (1 << (MezDSLParser.STRING_LOWER - 153)) | (1 << (MezDSLParser.STRING_UPPER - 153)) | (1 << (MezDSLParser.STRING_SPLIT - 153)) | (1 << (MezDSLParser.STRING_STARTS_WITH - 153)) | (1 << (MezDSLParser.STRING_SUBSTRING - 153)) | (1 << (MezDSLParser.STRING_TRANSLATE - 153)) | (1 << (MezDSLParser.STRING_REGEX_MATCH - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_FIRST - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_REGEX_FIND - 153)) | (1 << (MezDSLParser.STRING_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_URL_ENCODE - 153)) | (1 << (MezDSLParser.STRING_URL_DECODE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV_LINE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV - 153)) | (1 << (MezDSLParser.DATE_FROM_STRING - 153)) | (1 << (MezDSLParser.DATE_FROM_ISO_STRING - 153)) | (1 << (MezDSLParser.DATE_TIME_FROM_STRING - 153)))) !== 0) || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & ((1 << (MezDSLParser.DATE_TIME_FROM_ISO_STRING - 185)) | (1 << (MezDSLParser.DATE_TIME_FROM_LONG - 185)) | (1 << (MezDSLParser.DATE_NOW - 185)) | (1 << (MezDSLParser.DATE_TODAY - 185)) | (1 << (MezDSLParser.DATE_ADD_DAYS - 185)) | (1 << (MezDSLParser.DATE_ADD_MONTHS - 185)) | (1 << (MezDSLParser.DATE_ADD_SECONDS - 185)) | (1 << (MezDSLParser.DATE_DAYS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_EXTRACT - 185)) | (1 << (MezDSLParser.DATE_MONTHS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_SECONDS_BETWEEN - 185)) | (1 << (MezDSLParser.INTEGER_FROM_STRING - 185)) | (1 << (MezDSLParser.DECIMAL_FROM_STRING - 185)) | (1 << (MezDSLParser.LONG_FROM_STRING - 185)) | (1 << (MezDSLParser.UUID_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_WRAPPER_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_TO_STRING - 185)) | (1 << (MezDSLParser.HELIUM_GET_PLATFORM - 185)))) !== 0) || ((((_la - 242)) & ~0x1F) === 0 && ((1 << (_la - 242)) & ((1 << (MezDSLParser.MINUS - 242)) | (1 << (MezDSLParser.SQL_EXECUTE - 242)) | (1 << (MezDSLParser.SQL_QUERY - 242)) | (1 << (MezDSLParser.NULL - 242)) | (1 << (MezDSLParser.TRUE - 242)) | (1 << (MezDSLParser.FALSE - 242)) | (1 << (MezDSLParser.ENUM_ID - 242)) | (1 << (MezDSLParser.ID - 242)) | (1 << (MezDSLParser.DEC_LITERAL - 242)) | (1 << (MezDSLParser.INT_LITERAL - 242)) | (1 << (MezDSLParser.LONG_LITERAL - 242)) | (1 << (MezDSLParser.STR_LITERAL - 242)) | (1 << (MezDSLParser.STR_BLOCK - 242)))) !== 0)) {
                            {
                                this.state = 1461;
                                this.expression();
                                this.state = 1466;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                                while (_la === MezDSLParser.T__7) {
                                    {
                                        {
                                            this.state = 1462;
                                            this.match(MezDSLParser.T__7);
                                            this.state = 1463;
                                            this.expression();
                                        }
                                    }
                                    this.state = 1468;
                                    this._errHandler.sync(this);
                                    _la = this._input.LA(1);
                                }
                            }
                        }
                        this.state = 1471;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1475;
                        this._errHandler.sync(this);
                        switch (this.interpreter.adaptivePredict(this._input, 88, this._ctx)) {
                            case 1:
                                {
                                    this.state = 1473;
                                    _localctx._unitID = this.match(MezDSLParser.ID);
                                    this.state = 1474;
                                    this.match(MezDSLParser.T__13);
                                }
                                break;
                        }
                        this.state = 1477;
                        _localctx._funcID = this.match(MezDSLParser.ID);
                        this.state = 1478;
                        this.match(MezDSLParser.T__9);
                        this.state = 1487;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__9 || _la === MezDSLParser.OBJECT_INVITE || _la === MezDSLParser.COLLECTION_SELECT || ((((_la - 89)) & ~0x1F) === 0 && ((1 << (_la - 89)) & ((1 << (MezDSLParser.NOW - 89)) | (1 << (MezDSLParser.TODAY - 89)) | (1 << (MezDSLParser.SMS - 89)) | (1 << (MezDSLParser.SMS_SEND - 89)) | (1 << (MezDSLParser.SMS_GET_CONVERSATION_ID - 89)) | (1 << (MezDSLParser.COLLECTION_CSV - 89)) | (1 << (MezDSLParser.USER_ROLE - 89)) | (1 << (MezDSLParser.ENCRYPT - 89)) | (1 << (MezDSLParser.DECRYPT - 89)) | (1 << (MezDSLParser.CBC_ENCRYPT - 89)) | (1 << (MezDSLParser.CBC_DECRYPT - 89)) | (1 << (MezDSLParser.GENERATE_REPORT - 89)) | (1 << (MezDSLParser.API_GET - 89)) | (1 << (MezDSLParser.API_POST - 89)) | (1 << (MezDSLParser.API_DELETE - 89)) | (1 << (MezDSLParser.API_PUT - 89)) | (1 << (MezDSLParser.CREATE_BATCH - 89)))) !== 0) || ((((_la - 153)) & ~0x1F) === 0 && ((1 << (_la - 153)) & ((1 << (MezDSLParser.POW - 153)) | (1 << (MezDSLParser.SQRT - 153)) | (1 << (MezDSLParser.RANDOM - 153)) | (1 << (MezDSLParser.FLOOR - 153)) | (1 << (MezDSLParser.CEILING - 153)) | (1 << (MezDSLParser.ROUND - 153)) | (1 << (MezDSLParser.STRINGS_CONCAT - 153)) | (1 << (MezDSLParser.STRINGS_LENGTH - 153)) | (1 << (MezDSLParser.STRINGS_SPLIT - 153)) | (1 << (MezDSLParser.STRING_CONCAT - 153)) | (1 << (MezDSLParser.STRING_ENDS_WITH - 153)) | (1 << (MezDSLParser.STRING_INDEX_OF - 153)) | (1 << (MezDSLParser.STRING_JOIN - 153)) | (1 << (MezDSLParser.STRING_LENGTH - 153)) | (1 << (MezDSLParser.STRING_LOWER - 153)) | (1 << (MezDSLParser.STRING_UPPER - 153)) | (1 << (MezDSLParser.STRING_SPLIT - 153)) | (1 << (MezDSLParser.STRING_STARTS_WITH - 153)) | (1 << (MezDSLParser.STRING_SUBSTRING - 153)) | (1 << (MezDSLParser.STRING_TRANSLATE - 153)) | (1 << (MezDSLParser.STRING_REGEX_MATCH - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_FIRST - 153)) | (1 << (MezDSLParser.STRING_REGEX_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_REGEX_FIND - 153)) | (1 << (MezDSLParser.STRING_REPLACE_ALL - 153)) | (1 << (MezDSLParser.STRING_URL_ENCODE - 153)) | (1 << (MezDSLParser.STRING_URL_DECODE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV_LINE - 153)) | (1 << (MezDSLParser.JSON_FROM_CSV - 153)) | (1 << (MezDSLParser.DATE_FROM_STRING - 153)) | (1 << (MezDSLParser.DATE_FROM_ISO_STRING - 153)) | (1 << (MezDSLParser.DATE_TIME_FROM_STRING - 153)))) !== 0) || ((((_la - 185)) & ~0x1F) === 0 && ((1 << (_la - 185)) & ((1 << (MezDSLParser.DATE_TIME_FROM_ISO_STRING - 185)) | (1 << (MezDSLParser.DATE_TIME_FROM_LONG - 185)) | (1 << (MezDSLParser.DATE_NOW - 185)) | (1 << (MezDSLParser.DATE_TODAY - 185)) | (1 << (MezDSLParser.DATE_ADD_DAYS - 185)) | (1 << (MezDSLParser.DATE_ADD_MONTHS - 185)) | (1 << (MezDSLParser.DATE_ADD_SECONDS - 185)) | (1 << (MezDSLParser.DATE_DAYS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_EXTRACT - 185)) | (1 << (MezDSLParser.DATE_MONTHS_BETWEEN - 185)) | (1 << (MezDSLParser.DATE_SECONDS_BETWEEN - 185)) | (1 << (MezDSLParser.INTEGER_FROM_STRING - 185)) | (1 << (MezDSLParser.DECIMAL_FROM_STRING - 185)) | (1 << (MezDSLParser.LONG_FROM_STRING - 185)) | (1 << (MezDSLParser.UUID_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_WRAPPER_FROM_STRING - 185)) | (1 << (MezDSLParser.BLOB_TO_STRING - 185)) | (1 << (MezDSLParser.HELIUM_GET_PLATFORM - 185)))) !== 0) || ((((_la - 242)) & ~0x1F) === 0 && ((1 << (_la - 242)) & ((1 << (MezDSLParser.MINUS - 242)) | (1 << (MezDSLParser.SQL_EXECUTE - 242)) | (1 << (MezDSLParser.SQL_QUERY - 242)) | (1 << (MezDSLParser.NULL - 242)) | (1 << (MezDSLParser.TRUE - 242)) | (1 << (MezDSLParser.FALSE - 242)) | (1 << (MezDSLParser.ENUM_ID - 242)) | (1 << (MezDSLParser.ID - 242)) | (1 << (MezDSLParser.DEC_LITERAL - 242)) | (1 << (MezDSLParser.INT_LITERAL - 242)) | (1 << (MezDSLParser.LONG_LITERAL - 242)) | (1 << (MezDSLParser.STR_LITERAL - 242)) | (1 << (MezDSLParser.STR_BLOCK - 242)))) !== 0)) {
                            {
                                this.state = 1479;
                                this.expression();
                                this.state = 1484;
                                this._errHandler.sync(this);
                                _la = this._input.LA(1);
                                while (_la === MezDSLParser.T__7) {
                                    {
                                        {
                                            this.state = 1480;
                                            this.match(MezDSLParser.T__7);
                                            this.state = 1481;
                                            this.expression();
                                        }
                                    }
                                    this.state = 1486;
                                    this._errHandler.sync(this);
                                    _la = this._input.LA(1);
                                }
                            }
                        }
                        this.state = 1489;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    valueExpression() {
        let _localctx = new ValueExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 218, MezDSLParser.RULE_valueExpression);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1494;
                this._errHandler.sync(this);
                switch (this.interpreter.adaptivePredict(this._input, 92, this._ctx)) {
                    case 1:
                        {
                            this.state = 1492;
                            _localctx._unitName = this.match(MezDSLParser.ID);
                            this.state = 1493;
                            this.match(MezDSLParser.T__13);
                        }
                        break;
                }
                this.state = 1496;
                _localctx._variableName = this.match(MezDSLParser.ID);
                this.state = 1501;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (_la === MezDSLParser.T__22) {
                    {
                        {
                            this.state = 1497;
                            this.match(MezDSLParser.T__22);
                            this.state = 1498;
                            this.memberAccess();
                        }
                    }
                    this.state = 1503;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    memberAccess() {
        let _localctx = new MemberAccessContext(this._ctx, this.state);
        this.enterRule(_localctx, 220, MezDSLParser.RULE_memberAccess);
        try {
            this.state = 1506;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 94, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1504;
                        this.memberFunction();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1505;
                        this.memberAttribute();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    memberFunction() {
        let _localctx = new MemberFunctionContext(this._ctx, this.state);
        this.enterRule(_localctx, 222, MezDSLParser.RULE_memberFunction);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1508;
                _localctx._functionName = this.match(MezDSLParser.ID);
                this.state = 1509;
                this.match(MezDSLParser.T__9);
                this.state = 1513;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                while (((((_la - 215)) & ~0x1F) === 0 && ((1 << (_la - 215)) & ((1 << (MezDSLParser.INT - 215)) | (1 << (MezDSLParser.DECIMAL - 215)) | (1 << (MezDSLParser.LONG - 215)) | (1 << (MezDSLParser.UUID - 215)) | (1 << (MezDSLParser.BLOB - 215)) | (1 << (MezDSLParser.BOOL - 215)) | (1 << (MezDSLParser.STRING - 215)) | (1 << (MezDSLParser.VOID - 215)) | (1 << (MezDSLParser.DATE - 215)) | (1 << (MezDSLParser.DATETIME - 215)) | (1 << (MezDSLParser.JSON - 215)) | (1 << (MezDSLParser.JSONARRAY - 215)))) !== 0) || _la === MezDSLParser.ENUM_ID || _la === MezDSLParser.ID) {
                    {
                        {
                            this.state = 1510;
                            this.parameter();
                        }
                    }
                    this.state = 1515;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                }
                this.state = 1516;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    memberAttribute() {
        let _localctx = new MemberAttributeContext(this._ctx, this.state);
        this.enterRule(_localctx, 224, MezDSLParser.RULE_memberAttribute);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1518;
                _localctx._attName = this.match(MezDSLParser.ID);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    accessExpression() {
        let _localctx = new AccessExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 226, MezDSLParser.RULE_accessExpression);
        try {
            this.state = 1532;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 96, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1520;
                        this.match(MezDSLParser.ID);
                        this.state = 1521;
                        this.match(MezDSLParser.T__22);
                        this.state = 1522;
                        this.match(MezDSLParser.ID);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1523;
                        this.match(MezDSLParser.ID);
                        this.state = 1524;
                        this.match(MezDSLParser.T__13);
                        this.state = 1525;
                        this.match(MezDSLParser.ID);
                        this.state = 1526;
                        this.match(MezDSLParser.T__22);
                        this.state = 1527;
                        this.match(MezDSLParser.ID);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1528;
                        this.match(MezDSLParser.ID);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1529;
                        this.match(MezDSLParser.ID);
                        this.state = 1530;
                        this.match(MezDSLParser.T__13);
                        this.state = 1531;
                        this.match(MezDSLParser.ID);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    incrementExpression() {
        let _localctx = new IncrementExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 228, MezDSLParser.RULE_incrementExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1534;
                this.match(MezDSLParser.ID);
                this.state = 1535;
                this.match(MezDSLParser.INC);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    decrementExpression() {
        let _localctx = new DecrementExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 230, MezDSLParser.RULE_decrementExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1537;
                this.match(MezDSLParser.ID);
                this.state = 1538;
                this.match(MezDSLParser.DEC);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    bifExpression() {
        let _localctx = new BifExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 232, MezDSLParser.RULE_bifExpression);
        try {
            this.state = 1560;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 97, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1540;
                        this.match(MezDSLParser.ID);
                        this.state = 1541;
                        this.match(MezDSLParser.T__13);
                        this.state = 1542;
                        this.persistenceBIFExpression();
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1543;
                        this.collectionsExpressionBIF();
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1544;
                        this.mathBIFExpression();
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1545;
                        this.batchCreateExpressonBIF();
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1546;
                        this.stringsBIFExpression();
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1547;
                        this.stringBIFExpression();
                    }
                    break;
                case 7:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1548;
                        this.systemBIFExpression();
                    }
                    break;
                case 8:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1549;
                        this.dateBIFExpression();
                    }
                    break;
                case 9:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 1550;
                        this.integerBIFExpression();
                    }
                    break;
                case 10:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 1551;
                        this.longBIFExpression();
                    }
                    break;
                case 11:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 1552;
                        this.blobBIFExpression();
                    }
                    break;
                case 12:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 1553;
                        this.decimalBIFExpression();
                    }
                    break;
                case 13:
                    this.enterOuterAlt(_localctx, 13);
                    {
                        this.state = 1554;
                        this.uuidBIFExpression();
                    }
                    break;
                case 14:
                    this.enterOuterAlt(_localctx, 14);
                    {
                        this.state = 1555;
                        this.heliumBIFExpression();
                    }
                    break;
                case 15:
                    this.enterOuterAlt(_localctx, 15);
                    {
                        this.state = 1556;
                        this.instanceBIFExpression();
                    }
                    break;
                case 16:
                    this.enterOuterAlt(_localctx, 16);
                    {
                        this.state = 1557;
                        this.sqlBIFExpression();
                    }
                    break;
                case 17:
                    this.enterOuterAlt(_localctx, 17);
                    {
                        this.state = 1558;
                        this.jsonExpressionBIF();
                    }
                    break;
                case 18:
                    this.enterOuterAlt(_localctx, 18);
                    {
                        this.state = 1559;
                        this.apiBIFExpression();
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    instanceBIFExpression() {
        let _localctx = new InstanceBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 234, MezDSLParser.RULE_instanceBIFExpression);
        try {
            this.state = 1588;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 98, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1562;
                        this.accessExpression();
                        this.state = 1563;
                        this.match(MezDSLParser.T__22);
                        this.state = 1564;
                        this.match(MezDSLParser.OBJECT_PAY_RECIPIENT);
                        this.state = 1565;
                        this.match(MezDSLParser.T__9);
                        this.state = 1566;
                        this.expression();
                        this.state = 1567;
                        this.match(MezDSLParser.T__7);
                        this.state = 1568;
                        this.expression();
                        this.state = 1569;
                        this.match(MezDSLParser.T__7);
                        this.state = 1570;
                        this.expression();
                        this.state = 1571;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1573;
                        this.accessExpression();
                        this.state = 1574;
                        this.match(MezDSLParser.T__22);
                        this.state = 1575;
                        this.match(MezDSLParser.OBJECT_PAY_RECIPIENT_WITH_REF);
                        this.state = 1576;
                        this.match(MezDSLParser.T__9);
                        this.state = 1577;
                        this.expression();
                        this.state = 1578;
                        this.match(MezDSLParser.T__7);
                        this.state = 1579;
                        this.expression();
                        this.state = 1580;
                        this.match(MezDSLParser.T__7);
                        this.state = 1581;
                        this.expression();
                        this.state = 1582;
                        this.match(MezDSLParser.T__7);
                        this.state = 1583;
                        this.expression();
                        this.state = 1584;
                        this.match(MezDSLParser.T__7);
                        this.state = 1585;
                        this.expression();
                        this.state = 1586;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    jsonBIFStatement() {
        let _localctx = new JsonBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 236, MezDSLParser.RULE_jsonBIFStatement);
        try {
            this.state = 1606;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 99, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1590;
                        this.accessExpression();
                        this.state = 1591;
                        this.match(MezDSLParser.T__22);
                        this.state = 1592;
                        this.match(MezDSLParser.JSONPUT);
                        this.state = 1593;
                        this.match(MezDSLParser.T__9);
                        this.state = 1594;
                        this.expression();
                        this.state = 1595;
                        this.match(MezDSLParser.T__7);
                        this.state = 1596;
                        this.expression();
                        this.state = 1597;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1599;
                        this.accessExpression();
                        this.state = 1600;
                        this.match(MezDSLParser.T__22);
                        this.state = 1601;
                        this.match(MezDSLParser.JSONREMOVE);
                        this.state = 1602;
                        this.match(MezDSLParser.T__9);
                        this.state = 1603;
                        this.expression();
                        this.state = 1604;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    jsonExpressionBIF() {
        let _localctx = new JsonExpressionBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 238, MezDSLParser.RULE_jsonExpressionBIF);
        let _la;
        try {
            this.state = 1638;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 101, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1608;
                        this.accessExpression();
                        this.state = 1609;
                        this.match(MezDSLParser.T__22);
                        this.state = 1610;
                        this.match(MezDSLParser.JSONGET);
                        this.state = 1611;
                        this.match(MezDSLParser.T__9);
                        this.state = 1612;
                        this.expression();
                        this.state = 1613;
                        this.match(MezDSLParser.T__10);
                        this.state = 1622;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__22) {
                            {
                                {
                                    this.state = 1614;
                                    this.match(MezDSLParser.T__22);
                                    this.state = 1615;
                                    this.match(MezDSLParser.JSONGET);
                                    this.state = 1616;
                                    this.match(MezDSLParser.T__9);
                                    this.state = 1617;
                                    this.expression();
                                    this.state = 1618;
                                    this.match(MezDSLParser.T__10);
                                }
                            }
                            this.state = 1624;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1625;
                        this.accessExpression();
                        this.state = 1626;
                        this.match(MezDSLParser.T__22);
                        this.state = 1627;
                        this.match(MezDSLParser.JSONCONTAINS);
                        this.state = 1628;
                        this.match(MezDSLParser.T__9);
                        this.state = 1629;
                        this.expression();
                        this.state = 1630;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1632;
                        this.accessExpression();
                        this.state = 1633;
                        this.match(MezDSLParser.T__22);
                        this.state = 1634;
                        this.match(MezDSLParser.JSONKEYS);
                        this.state = 1635;
                        this.match(MezDSLParser.T__9);
                        this.state = 1636;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    batchCreateExpressonBIF() {
        let _localctx = new BatchCreateExpressonBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 240, MezDSLParser.RULE_batchCreateExpressonBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1640;
                this.match(MezDSLParser.CREATE_BATCH);
                this.state = 1641;
                this.match(MezDSLParser.T__9);
                this.state = 1642;
                this.expression();
                this.state = 1643;
                this.match(MezDSLParser.T__7);
                this.state = 1644;
                this.expression();
                this.state = 1645;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    collectionsExpressionBIF() {
        let _localctx = new CollectionsExpressionBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 242, MezDSLParser.RULE_collectionsExpressionBIF);
        try {
            this.state = 1691;
            this._errHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this._input, 102, this._ctx)) {
                case 1:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1647;
                        this.accessExpression();
                        this.state = 1648;
                        this.match(MezDSLParser.T__22);
                        this.state = 1649;
                        this.match(MezDSLParser.POP);
                        this.state = 1650;
                        this.match(MezDSLParser.T__9);
                        this.state = 1651;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 2:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1653;
                        this.accessExpression();
                        this.state = 1654;
                        this.match(MezDSLParser.T__22);
                        this.state = 1655;
                        this.match(MezDSLParser.DROP);
                        this.state = 1656;
                        this.match(MezDSLParser.T__9);
                        this.state = 1657;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 3:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1659;
                        this.accessExpression();
                        this.state = 1660;
                        this.match(MezDSLParser.T__22);
                        this.state = 1661;
                        this.match(MezDSLParser.LENGTH);
                        this.state = 1662;
                        this.match(MezDSLParser.T__9);
                        this.state = 1663;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 4:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1665;
                        this.accessExpression();
                        this.state = 1666;
                        this.match(MezDSLParser.T__22);
                        this.state = 1667;
                        this.match(MezDSLParser.FIRST);
                        this.state = 1668;
                        this.match(MezDSLParser.T__9);
                        this.state = 1669;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 5:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1671;
                        this.accessExpression();
                        this.state = 1672;
                        this.match(MezDSLParser.T__22);
                        this.state = 1673;
                        this.match(MezDSLParser.LAST);
                        this.state = 1674;
                        this.match(MezDSLParser.T__9);
                        this.state = 1675;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 6:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1677;
                        this.accessExpression();
                        this.state = 1678;
                        this.match(MezDSLParser.T__22);
                        this.state = 1679;
                        this.match(MezDSLParser.GET);
                        this.state = 1680;
                        this.match(MezDSLParser.T__9);
                        this.state = 1681;
                        this.expression();
                        this.state = 1682;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case 7:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1684;
                        this.accessExpression();
                        this.state = 1685;
                        this.match(MezDSLParser.T__22);
                        this.state = 1686;
                        this.match(MezDSLParser.COLLECTION_SELECT);
                        this.state = 1687;
                        this.match(MezDSLParser.T__9);
                        this.state = 1688;
                        this.selectorBIF();
                        this.state = 1689;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    systemBIFExpression() {
        let _localctx = new SystemBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 244, MezDSLParser.RULE_systemBIFExpression);
        let _la;
        try {
            this.state = 1793;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.NOW:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1693;
                        this.match(MezDSLParser.NOW);
                        this.state = 1694;
                        this.match(MezDSLParser.T__9);
                        this.state = 1695;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.TODAY:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1696;
                        this.match(MezDSLParser.TODAY);
                        this.state = 1697;
                        this.match(MezDSLParser.T__9);
                        this.state = 1698;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.USER_ROLE:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1699;
                        this.match(MezDSLParser.USER_ROLE);
                        this.state = 1700;
                        this.match(MezDSLParser.T__9);
                        this.state = 1701;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SMS:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1702;
                        this.match(MezDSLParser.SMS);
                        this.state = 1703;
                        this.match(MezDSLParser.T__9);
                        this.state = 1704;
                        this.expression();
                        this.state = 1705;
                        this.match(MezDSLParser.T__7);
                        this.state = 1706;
                        _localctx._attName = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1707;
                        this.match(MezDSLParser.T__7);
                        this.state = 1708;
                        _localctx._transKey = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1711;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1709;
                                this.match(MezDSLParser.T__7);
                                this.state = 1710;
                                this.expression();
                            }
                        }
                        this.state = 1713;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SMS_SEND:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1715;
                        this.match(MezDSLParser.SMS_SEND);
                        this.state = 1716;
                        this.match(MezDSLParser.T__9);
                        this.state = 1717;
                        this.expression();
                        this.state = 1718;
                        this.match(MezDSLParser.T__7);
                        this.state = 1719;
                        _localctx._attName = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1720;
                        this.match(MezDSLParser.T__7);
                        this.state = 1721;
                        _localctx._transKey = this.match(MezDSLParser.STR_LITERAL);
                        this.state = 1724;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1722;
                                this.match(MezDSLParser.T__7);
                                this.state = 1723;
                                this.expression();
                            }
                        }
                        this.state = 1726;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SMS_GET_CONVERSATION_ID:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1728;
                        this.match(MezDSLParser.SMS_GET_CONVERSATION_ID);
                        this.state = 1729;
                        this.match(MezDSLParser.T__9);
                        this.state = 1730;
                        this.expression();
                        this.state = 1731;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.ENCRYPT:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1733;
                        this.match(MezDSLParser.ENCRYPT);
                        this.state = 1734;
                        this.match(MezDSLParser.T__9);
                        this.state = 1735;
                        this.expression();
                        this.state = 1738;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1736;
                                this.match(MezDSLParser.T__7);
                                this.state = 1737;
                                this.expression();
                            }
                        }
                        this.state = 1740;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.DECRYPT:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1742;
                        this.match(MezDSLParser.DECRYPT);
                        this.state = 1743;
                        this.match(MezDSLParser.T__9);
                        this.state = 1744;
                        this.expression();
                        this.state = 1747;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1745;
                                this.match(MezDSLParser.T__7);
                                this.state = 1746;
                                this.expression();
                            }
                        }
                        this.state = 1749;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.GENERATE_REPORT:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 1751;
                        this.match(MezDSLParser.GENERATE_REPORT);
                        this.state = 1752;
                        this.match(MezDSLParser.T__9);
                        this.state = 1753;
                        this.expression();
                        this.state = 1754;
                        this.match(MezDSLParser.T__7);
                        this.state = 1755;
                        this.expression();
                        this.state = 1756;
                        this.match(MezDSLParser.T__7);
                        this.state = 1757;
                        this.expression();
                        this.state = 1760;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1758;
                                this.match(MezDSLParser.T__7);
                                this.state = 1759;
                                this.expression();
                            }
                        }
                        this.state = 1762;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.CBC_ENCRYPT:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 1764;
                        this.match(MezDSLParser.CBC_ENCRYPT);
                        this.state = 1765;
                        this.match(MezDSLParser.T__9);
                        this.state = 1766;
                        this.expression();
                        this.state = 1767;
                        this.match(MezDSLParser.T__7);
                        this.state = 1768;
                        this.expression();
                        this.state = 1769;
                        this.match(MezDSLParser.T__7);
                        this.state = 1770;
                        this.expression();
                        this.state = 1771;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.CBC_DECRYPT:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 1773;
                        this.match(MezDSLParser.CBC_DECRYPT);
                        this.state = 1774;
                        this.match(MezDSLParser.T__9);
                        this.state = 1775;
                        this.expression();
                        this.state = 1776;
                        this.match(MezDSLParser.T__7);
                        this.state = 1777;
                        this.expression();
                        this.state = 1778;
                        this.match(MezDSLParser.T__7);
                        this.state = 1779;
                        this.expression();
                        this.state = 1780;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.COLLECTION_CSV:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 1782;
                        this.match(MezDSLParser.COLLECTION_CSV);
                        this.state = 1783;
                        this.match(MezDSLParser.T__9);
                        this.state = 1784;
                        this.expression();
                        this.state = 1785;
                        this.match(MezDSLParser.T__7);
                        this.state = 1786;
                        this.expression();
                        this.state = 1789;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1787;
                                this.match(MezDSLParser.T__7);
                                this.state = 1788;
                                this.expression();
                            }
                        }
                        this.state = 1791;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    apiBIFExpression() {
        let _localctx = new ApiBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 246, MezDSLParser.RULE_apiBIFExpression);
        try {
            this.state = 1815;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.API_GET:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1795;
                        this.match(MezDSLParser.API_GET);
                        this.state = 1796;
                        this.match(MezDSLParser.T__9);
                        this.state = 1797;
                        this.expression();
                        this.state = 1798;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.API_POST:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1800;
                        this.match(MezDSLParser.API_POST);
                        this.state = 1801;
                        this.match(MezDSLParser.T__9);
                        this.state = 1802;
                        this.expression();
                        this.state = 1803;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.API_PUT:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1805;
                        this.match(MezDSLParser.API_PUT);
                        this.state = 1806;
                        this.match(MezDSLParser.T__9);
                        this.state = 1807;
                        this.expression();
                        this.state = 1808;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.API_DELETE:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1810;
                        this.match(MezDSLParser.API_DELETE);
                        this.state = 1811;
                        this.match(MezDSLParser.T__9);
                        this.state = 1812;
                        this.expression();
                        this.state = 1813;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    apiBIFStatement() {
        let _localctx = new ApiBIFStatementContext(this._ctx, this.state);
        this.enterRule(_localctx, 248, MezDSLParser.RULE_apiBIFStatement);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1817;
                this.match(MezDSLParser.API_SET_STATUS_CODE);
                this.state = 1818;
                this.match(MezDSLParser.T__9);
                this.state = 1819;
                this.expression();
                this.state = 1820;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    mathBIFExpression() {
        let _localctx = new MathBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 250, MezDSLParser.RULE_mathBIFExpression);
        let _la;
        try {
            this.state = 1858;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.POW:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1822;
                        this.match(MezDSLParser.POW);
                        this.state = 1823;
                        this.match(MezDSLParser.T__9);
                        this.state = 1824;
                        this.expression();
                        this.state = 1825;
                        this.match(MezDSLParser.T__7);
                        this.state = 1826;
                        this.expression();
                        this.state = 1827;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SQRT:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1829;
                        this.match(MezDSLParser.SQRT);
                        this.state = 1830;
                        this.match(MezDSLParser.T__9);
                        this.state = 1831;
                        this.expression();
                        this.state = 1832;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.CEILING:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1834;
                        this.match(MezDSLParser.CEILING);
                        this.state = 1835;
                        this.match(MezDSLParser.T__9);
                        this.state = 1836;
                        this.expression();
                        this.state = 1837;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.FLOOR:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1839;
                        this.match(MezDSLParser.FLOOR);
                        this.state = 1840;
                        this.match(MezDSLParser.T__9);
                        this.state = 1841;
                        this.expression();
                        this.state = 1842;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.ROUND:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1844;
                        this.match(MezDSLParser.ROUND);
                        this.state = 1845;
                        this.match(MezDSLParser.T__9);
                        this.state = 1846;
                        this.expression();
                        this.state = 1847;
                        this.match(MezDSLParser.T__7);
                        this.state = 1848;
                        this.expression();
                        this.state = 1851;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        if (_la === MezDSLParser.T__7) {
                            {
                                this.state = 1849;
                                this.match(MezDSLParser.T__7);
                                this.state = 1850;
                                this.expression();
                            }
                        }
                        this.state = 1853;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.RANDOM:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1855;
                        this.match(MezDSLParser.RANDOM);
                        this.state = 1856;
                        this.match(MezDSLParser.T__9);
                        this.state = 1857;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringsBIFExpression() {
        let _localctx = new StringsBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 252, MezDSLParser.RULE_stringsBIFExpression);
        try {
            this.state = 1863;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.STRINGS_CONCAT:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1860;
                        this.stringsConcatBIF();
                    }
                    break;
                case MezDSLParser.STRINGS_LENGTH:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1861;
                        this.stringsLengthBIF();
                    }
                    break;
                case MezDSLParser.STRINGS_SPLIT:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1862;
                        this.stringsSplitBIF();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringsConcatBIF() {
        let _localctx = new StringsConcatBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 254, MezDSLParser.RULE_stringsConcatBIF);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1865;
                this.match(MezDSLParser.STRINGS_CONCAT);
                this.state = 1866;
                this.match(MezDSLParser.T__9);
                this.state = 1867;
                this.expression();
                this.state = 1870;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 1868;
                            this.match(MezDSLParser.T__7);
                            this.state = 1869;
                            this.expression();
                        }
                    }
                    this.state = 1872;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (_la === MezDSLParser.T__7);
                this.state = 1874;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringsLengthBIF() {
        let _localctx = new StringsLengthBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 256, MezDSLParser.RULE_stringsLengthBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1876;
                this.match(MezDSLParser.STRINGS_LENGTH);
                this.state = 1877;
                this.match(MezDSLParser.T__9);
                this.state = 1878;
                this.expression();
                this.state = 1879;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringsSplitBIF() {
        let _localctx = new StringsSplitBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 258, MezDSLParser.RULE_stringsSplitBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1881;
                this.match(MezDSLParser.STRINGS_SPLIT);
                this.state = 1882;
                this.match(MezDSLParser.T__9);
                this.state = 1883;
                this.expression();
                this.state = 1884;
                this.match(MezDSLParser.T__7);
                this.state = 1885;
                this.expression();
                this.state = 1886;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringBIFExpression() {
        let _localctx = new StringBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 260, MezDSLParser.RULE_stringBIFExpression);
        try {
            this.state = 1908;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.STRING_CONCAT:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 1888;
                        this.stringConcatBIF();
                    }
                    break;
                case MezDSLParser.STRING_ENDS_WITH:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 1889;
                        this.stringEndsWithBIF();
                    }
                    break;
                case MezDSLParser.STRING_INDEX_OF:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 1890;
                        this.stringIndexOfBIF();
                    }
                    break;
                case MezDSLParser.STRING_JOIN:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 1891;
                        this.stringJoinBIF();
                    }
                    break;
                case MezDSLParser.STRING_LENGTH:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 1892;
                        this.stringLengthBIF();
                    }
                    break;
                case MezDSLParser.STRING_LOWER:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 1893;
                        this.stringLowerBIF();
                    }
                    break;
                case MezDSLParser.STRING_UPPER:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 1894;
                        this.stringUpperBIF();
                    }
                    break;
                case MezDSLParser.STRING_SPLIT:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 1895;
                        this.stringSplitBIF();
                    }
                    break;
                case MezDSLParser.STRING_STARTS_WITH:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 1896;
                        this.stringStartsWithBIF();
                    }
                    break;
                case MezDSLParser.STRING_SUBSTRING:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 1897;
                        this.stringSubstringBIF();
                    }
                    break;
                case MezDSLParser.STRING_TRANSLATE:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 1898;
                        this.stringTranslateBIF();
                    }
                    break;
                case MezDSLParser.STRING_REGEX_MATCH:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 1899;
                        this.stringRegexMatchBIF();
                    }
                    break;
                case MezDSLParser.STRING_REGEX_REPLACE_FIRST:
                    this.enterOuterAlt(_localctx, 13);
                    {
                        this.state = 1900;
                        this.stringRegexReplaceFirstBIF();
                    }
                    break;
                case MezDSLParser.STRING_REGEX_REPLACE_ALL:
                    this.enterOuterAlt(_localctx, 14);
                    {
                        this.state = 1901;
                        this.stringRegexReplaceAllBIF();
                    }
                    break;
                case MezDSLParser.STRING_REGEX_FIND:
                    this.enterOuterAlt(_localctx, 15);
                    {
                        this.state = 1902;
                        this.stringRegexFindBIF();
                    }
                    break;
                case MezDSLParser.STRING_REPLACE_ALL:
                    this.enterOuterAlt(_localctx, 16);
                    {
                        this.state = 1903;
                        this.stringReplaceAllBIF();
                    }
                    break;
                case MezDSLParser.STRING_URL_ENCODE:
                    this.enterOuterAlt(_localctx, 17);
                    {
                        this.state = 1904;
                        this.stringUrlEncodeBIF();
                    }
                    break;
                case MezDSLParser.STRING_URL_DECODE:
                    this.enterOuterAlt(_localctx, 18);
                    {
                        this.state = 1905;
                        this.stringUrlDecodeBIF();
                    }
                    break;
                case MezDSLParser.JSON_FROM_CSV_LINE:
                    this.enterOuterAlt(_localctx, 19);
                    {
                        this.state = 1906;
                        this.jsonFromCsvLineBIF();
                    }
                    break;
                case MezDSLParser.JSON_FROM_CSV:
                    this.enterOuterAlt(_localctx, 20);
                    {
                        this.state = 1907;
                        this.jsonFromCsvBIF();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringTranslateBIF() {
        let _localctx = new StringTranslateBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 262, MezDSLParser.RULE_stringTranslateBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1910;
                this.match(MezDSLParser.STRING_TRANSLATE);
                this.state = 1911;
                this.match(MezDSLParser.T__9);
                this.state = 1912;
                _localctx._transKey = this.match(MezDSLParser.STR_LITERAL);
                this.state = 1913;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringConcatBIF() {
        let _localctx = new StringConcatBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 264, MezDSLParser.RULE_stringConcatBIF);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1915;
                this.match(MezDSLParser.STRING_CONCAT);
                this.state = 1916;
                this.match(MezDSLParser.T__9);
                this.state = 1917;
                this.expression();
                this.state = 1920;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                do {
                    {
                        {
                            this.state = 1918;
                            this.match(MezDSLParser.T__7);
                            this.state = 1919;
                            this.expression();
                        }
                    }
                    this.state = 1922;
                    this._errHandler.sync(this);
                    _la = this._input.LA(1);
                } while (_la === MezDSLParser.T__7);
                this.state = 1924;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringEndsWithBIF() {
        let _localctx = new StringEndsWithBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 266, MezDSLParser.RULE_stringEndsWithBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1926;
                this.match(MezDSLParser.STRING_ENDS_WITH);
                this.state = 1927;
                this.match(MezDSLParser.T__9);
                this.state = 1928;
                this.expression();
                this.state = 1929;
                this.match(MezDSLParser.T__7);
                this.state = 1930;
                this.expression();
                this.state = 1931;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringIndexOfBIF() {
        let _localctx = new StringIndexOfBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 268, MezDSLParser.RULE_stringIndexOfBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1933;
                this.match(MezDSLParser.STRING_INDEX_OF);
                this.state = 1934;
                this.match(MezDSLParser.T__9);
                this.state = 1935;
                this.expression();
                this.state = 1936;
                this.match(MezDSLParser.T__7);
                this.state = 1937;
                this.expression();
                this.state = 1938;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringJoinBIF() {
        let _localctx = new StringJoinBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 270, MezDSLParser.RULE_stringJoinBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1940;
                this.match(MezDSLParser.STRING_JOIN);
                this.state = 1941;
                this.match(MezDSLParser.T__9);
                this.state = 1942;
                this.expression();
                this.state = 1943;
                this.match(MezDSLParser.T__7);
                this.state = 1944;
                this.expression();
                this.state = 1945;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringLengthBIF() {
        let _localctx = new StringLengthBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 272, MezDSLParser.RULE_stringLengthBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1947;
                this.match(MezDSLParser.STRING_LENGTH);
                this.state = 1948;
                this.match(MezDSLParser.T__9);
                this.state = 1949;
                this.expression();
                this.state = 1950;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringLowerBIF() {
        let _localctx = new StringLowerBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 274, MezDSLParser.RULE_stringLowerBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1952;
                this.match(MezDSLParser.STRING_LOWER);
                this.state = 1953;
                this.match(MezDSLParser.T__9);
                this.state = 1954;
                this.expression();
                this.state = 1955;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringSplitBIF() {
        let _localctx = new StringSplitBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 276, MezDSLParser.RULE_stringSplitBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1957;
                this.match(MezDSLParser.STRING_SPLIT);
                this.state = 1958;
                this.match(MezDSLParser.T__9);
                this.state = 1959;
                this.expression();
                this.state = 1960;
                this.match(MezDSLParser.T__7);
                this.state = 1961;
                this.expression();
                this.state = 1962;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringStartsWithBIF() {
        let _localctx = new StringStartsWithBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 278, MezDSLParser.RULE_stringStartsWithBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1964;
                this.match(MezDSLParser.STRING_STARTS_WITH);
                this.state = 1965;
                this.match(MezDSLParser.T__9);
                this.state = 1966;
                this.expression();
                this.state = 1967;
                this.match(MezDSLParser.T__7);
                this.state = 1968;
                this.expression();
                this.state = 1969;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringSubstringBIF() {
        let _localctx = new StringSubstringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 280, MezDSLParser.RULE_stringSubstringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1971;
                this.match(MezDSLParser.STRING_SUBSTRING);
                this.state = 1972;
                this.match(MezDSLParser.T__9);
                this.state = 1973;
                this.expression();
                this.state = 1974;
                this.match(MezDSLParser.T__7);
                this.state = 1975;
                this.expression();
                this.state = 1976;
                this.match(MezDSLParser.T__7);
                this.state = 1977;
                this.expression();
                this.state = 1978;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringUpperBIF() {
        let _localctx = new StringUpperBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 282, MezDSLParser.RULE_stringUpperBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1980;
                this.match(MezDSLParser.STRING_UPPER);
                this.state = 1981;
                this.match(MezDSLParser.T__9);
                this.state = 1982;
                this.expression();
                this.state = 1983;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringRegexMatchBIF() {
        let _localctx = new StringRegexMatchBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 284, MezDSLParser.RULE_stringRegexMatchBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1985;
                this.match(MezDSLParser.STRING_REGEX_MATCH);
                this.state = 1986;
                this.match(MezDSLParser.T__9);
                this.state = 1987;
                this.expression();
                this.state = 1988;
                this.match(MezDSLParser.T__7);
                this.state = 1989;
                this.expression();
                this.state = 1990;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringRegexReplaceFirstBIF() {
        let _localctx = new StringRegexReplaceFirstBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 286, MezDSLParser.RULE_stringRegexReplaceFirstBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 1992;
                this.match(MezDSLParser.STRING_REGEX_REPLACE_FIRST);
                this.state = 1993;
                this.match(MezDSLParser.T__9);
                this.state = 1994;
                this.expression();
                this.state = 1995;
                this.match(MezDSLParser.T__7);
                this.state = 1996;
                this.expression();
                this.state = 1997;
                this.match(MezDSLParser.T__7);
                this.state = 1998;
                this.expression();
                this.state = 1999;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringRegexReplaceAllBIF() {
        let _localctx = new StringRegexReplaceAllBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 288, MezDSLParser.RULE_stringRegexReplaceAllBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2001;
                this.match(MezDSLParser.STRING_REGEX_REPLACE_ALL);
                this.state = 2002;
                this.match(MezDSLParser.T__9);
                this.state = 2003;
                this.expression();
                this.state = 2004;
                this.match(MezDSLParser.T__7);
                this.state = 2005;
                this.expression();
                this.state = 2006;
                this.match(MezDSLParser.T__7);
                this.state = 2007;
                this.expression();
                this.state = 2008;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringRegexFindBIF() {
        let _localctx = new StringRegexFindBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 290, MezDSLParser.RULE_stringRegexFindBIF);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2010;
                this.match(MezDSLParser.STRING_REGEX_FIND);
                this.state = 2011;
                this.match(MezDSLParser.T__9);
                this.state = 2012;
                this.expression();
                this.state = 2013;
                this.match(MezDSLParser.T__7);
                this.state = 2014;
                this.expression();
                this.state = 2017;
                this._errHandler.sync(this);
                _la = this._input.LA(1);
                if (_la === MezDSLParser.T__7) {
                    {
                        this.state = 2015;
                        this.match(MezDSLParser.T__7);
                        this.state = 2016;
                        this.expression();
                    }
                }
                this.state = 2019;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringReplaceAllBIF() {
        let _localctx = new StringReplaceAllBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 292, MezDSLParser.RULE_stringReplaceAllBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2021;
                this.match(MezDSLParser.STRING_REPLACE_ALL);
                this.state = 2022;
                this.match(MezDSLParser.T__9);
                this.state = 2023;
                this.expression();
                this.state = 2024;
                this.match(MezDSLParser.T__7);
                this.state = 2025;
                this.expression();
                this.state = 2026;
                this.match(MezDSLParser.T__7);
                this.state = 2027;
                this.expression();
                this.state = 2028;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringUrlEncodeBIF() {
        let _localctx = new StringUrlEncodeBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 294, MezDSLParser.RULE_stringUrlEncodeBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2030;
                this.match(MezDSLParser.STRING_URL_ENCODE);
                this.state = 2031;
                this.match(MezDSLParser.T__9);
                this.state = 2032;
                this.expression();
                this.state = 2033;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    stringUrlDecodeBIF() {
        let _localctx = new StringUrlDecodeBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 296, MezDSLParser.RULE_stringUrlDecodeBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2035;
                this.match(MezDSLParser.STRING_URL_DECODE);
                this.state = 2036;
                this.match(MezDSLParser.T__9);
                this.state = 2037;
                this.expression();
                this.state = 2038;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    jsonFromCsvLineBIF() {
        let _localctx = new JsonFromCsvLineBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 298, MezDSLParser.RULE_jsonFromCsvLineBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2040;
                this.match(MezDSLParser.JSON_FROM_CSV_LINE);
                this.state = 2041;
                this.match(MezDSLParser.T__9);
                this.state = 2042;
                this.expression();
                this.state = 2043;
                this.match(MezDSLParser.T__7);
                this.state = 2044;
                this.expression();
                this.state = 2045;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    jsonFromCsvBIF() {
        let _localctx = new JsonFromCsvBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 300, MezDSLParser.RULE_jsonFromCsvBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2047;
                this.match(MezDSLParser.JSON_FROM_CSV);
                this.state = 2048;
                this.match(MezDSLParser.T__9);
                this.state = 2049;
                this.expression();
                this.state = 2050;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateBIFExpression() {
        let _localctx = new DateBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 302, MezDSLParser.RULE_dateBIFExpression);
        try {
            this.state = 2066;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.DATE_ADD_DAYS:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2052;
                        this.dateAddDaysBIF();
                    }
                    break;
                case MezDSLParser.DATE_ADD_MONTHS:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2053;
                        this.dateAddMonthsBIF();
                    }
                    break;
                case MezDSLParser.DATE_ADD_SECONDS:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 2054;
                        this.dateAddSecondsBIF();
                    }
                    break;
                case MezDSLParser.DATE_DAYS_BETWEEN:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 2055;
                        this.dateDaysBetweenBIF();
                    }
                    break;
                case MezDSLParser.DATE_EXTRACT:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 2056;
                        this.dateExtractBIF();
                    }
                    break;
                case MezDSLParser.DATE_MONTHS_BETWEEN:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 2057;
                        this.dateMonthsBetweenBIF();
                    }
                    break;
                case MezDSLParser.DATE_SECONDS_BETWEEN:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 2058;
                        this.dateSecondsBetweenBIF();
                    }
                    break;
                case MezDSLParser.DATE_NOW:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 2059;
                        this.dateNowBIF();
                    }
                    break;
                case MezDSLParser.DATE_TODAY:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 2060;
                        this.dateTodayBIF();
                    }
                    break;
                case MezDSLParser.DATE_FROM_STRING:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 2061;
                        this.dateFromStringBIF();
                    }
                    break;
                case MezDSLParser.DATE_TIME_FROM_STRING:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 2062;
                        this.dateTimeFromStringBIF();
                    }
                    break;
                case MezDSLParser.DATE_FROM_ISO_STRING:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 2063;
                        this.dateFromISOStringBIF();
                    }
                    break;
                case MezDSLParser.DATE_TIME_FROM_ISO_STRING:
                    this.enterOuterAlt(_localctx, 13);
                    {
                        this.state = 2064;
                        this.dateTimeFromISOStringBIF();
                    }
                    break;
                case MezDSLParser.DATE_TIME_FROM_LONG:
                    this.enterOuterAlt(_localctx, 14);
                    {
                        this.state = 2065;
                        this.dateTimeFromLongBIF();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateAddDaysBIF() {
        let _localctx = new DateAddDaysBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 304, MezDSLParser.RULE_dateAddDaysBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2068;
                this.match(MezDSLParser.DATE_ADD_DAYS);
                this.state = 2069;
                this.match(MezDSLParser.T__9);
                this.state = 2070;
                this.expression();
                this.state = 2071;
                this.match(MezDSLParser.T__7);
                this.state = 2072;
                this.expression();
                this.state = 2073;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateAddMonthsBIF() {
        let _localctx = new DateAddMonthsBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 306, MezDSLParser.RULE_dateAddMonthsBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2075;
                this.match(MezDSLParser.DATE_ADD_MONTHS);
                this.state = 2076;
                this.match(MezDSLParser.T__9);
                this.state = 2077;
                this.expression();
                this.state = 2078;
                this.match(MezDSLParser.T__7);
                this.state = 2079;
                this.expression();
                this.state = 2080;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateAddSecondsBIF() {
        let _localctx = new DateAddSecondsBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 308, MezDSLParser.RULE_dateAddSecondsBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2082;
                this.match(MezDSLParser.DATE_ADD_SECONDS);
                this.state = 2083;
                this.match(MezDSLParser.T__9);
                this.state = 2084;
                this.expression();
                this.state = 2085;
                this.match(MezDSLParser.T__7);
                this.state = 2086;
                this.expression();
                this.state = 2087;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateDaysBetweenBIF() {
        let _localctx = new DateDaysBetweenBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 310, MezDSLParser.RULE_dateDaysBetweenBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2089;
                this.match(MezDSLParser.DATE_DAYS_BETWEEN);
                this.state = 2090;
                this.match(MezDSLParser.T__9);
                this.state = 2091;
                this.expression();
                this.state = 2092;
                this.match(MezDSLParser.T__7);
                this.state = 2093;
                this.expression();
                this.state = 2094;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateExtractBIF() {
        let _localctx = new DateExtractBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 312, MezDSLParser.RULE_dateExtractBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2096;
                this.match(MezDSLParser.DATE_EXTRACT);
                this.state = 2097;
                this.match(MezDSLParser.T__9);
                this.state = 2098;
                this.expression();
                this.state = 2099;
                this.match(MezDSLParser.T__7);
                this.state = 2100;
                this.match(MezDSLParser.STR_LITERAL);
                this.state = 2101;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateMonthsBetweenBIF() {
        let _localctx = new DateMonthsBetweenBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 314, MezDSLParser.RULE_dateMonthsBetweenBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2103;
                this.match(MezDSLParser.DATE_MONTHS_BETWEEN);
                this.state = 2104;
                this.match(MezDSLParser.T__9);
                this.state = 2105;
                this.expression();
                this.state = 2106;
                this.match(MezDSLParser.T__7);
                this.state = 2107;
                this.expression();
                this.state = 2108;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateSecondsBetweenBIF() {
        let _localctx = new DateSecondsBetweenBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 316, MezDSLParser.RULE_dateSecondsBetweenBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2110;
                this.match(MezDSLParser.DATE_SECONDS_BETWEEN);
                this.state = 2111;
                this.match(MezDSLParser.T__9);
                this.state = 2112;
                this.expression();
                this.state = 2113;
                this.match(MezDSLParser.T__7);
                this.state = 2114;
                this.expression();
                this.state = 2115;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateNowBIF() {
        let _localctx = new DateNowBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 318, MezDSLParser.RULE_dateNowBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2117;
                this.match(MezDSLParser.DATE_NOW);
                this.state = 2118;
                this.match(MezDSLParser.T__9);
                this.state = 2119;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateTodayBIF() {
        let _localctx = new DateTodayBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 320, MezDSLParser.RULE_dateTodayBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2121;
                this.match(MezDSLParser.DATE_TODAY);
                this.state = 2122;
                this.match(MezDSLParser.T__9);
                this.state = 2123;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateFromStringBIF() {
        let _localctx = new DateFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 322, MezDSLParser.RULE_dateFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2125;
                this.match(MezDSLParser.DATE_FROM_STRING);
                this.state = 2126;
                this.match(MezDSLParser.T__9);
                this.state = 2127;
                this.expression();
                this.state = 2128;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateTimeFromStringBIF() {
        let _localctx = new DateTimeFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 324, MezDSLParser.RULE_dateTimeFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2130;
                this.match(MezDSLParser.DATE_TIME_FROM_STRING);
                this.state = 2131;
                this.match(MezDSLParser.T__9);
                this.state = 2132;
                this.expression();
                this.state = 2133;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateFromISOStringBIF() {
        let _localctx = new DateFromISOStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 326, MezDSLParser.RULE_dateFromISOStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2135;
                this.match(MezDSLParser.DATE_FROM_ISO_STRING);
                this.state = 2136;
                this.match(MezDSLParser.T__9);
                this.state = 2137;
                this.expression();
                this.state = 2138;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateTimeFromISOStringBIF() {
        let _localctx = new DateTimeFromISOStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 328, MezDSLParser.RULE_dateTimeFromISOStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2140;
                this.match(MezDSLParser.DATE_TIME_FROM_ISO_STRING);
                this.state = 2141;
                this.match(MezDSLParser.T__9);
                this.state = 2142;
                this.expression();
                this.state = 2143;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    dateTimeFromLongBIF() {
        let _localctx = new DateTimeFromLongBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 330, MezDSLParser.RULE_dateTimeFromLongBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2145;
                this.match(MezDSLParser.DATE_TIME_FROM_LONG);
                this.state = 2146;
                this.match(MezDSLParser.T__9);
                this.state = 2147;
                this.expression();
                this.state = 2148;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    integerBIFExpression() {
        let _localctx = new IntegerBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 332, MezDSLParser.RULE_integerBIFExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2150;
                this.integerFromStringBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    integerFromStringBIF() {
        let _localctx = new IntegerFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 334, MezDSLParser.RULE_integerFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2152;
                this.match(MezDSLParser.INTEGER_FROM_STRING);
                this.state = 2153;
                this.match(MezDSLParser.T__9);
                this.state = 2154;
                this.expression();
                this.state = 2155;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    decimalBIFExpression() {
        let _localctx = new DecimalBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 336, MezDSLParser.RULE_decimalBIFExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2157;
                this.decimalFromStringBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    decimalFromStringBIF() {
        let _localctx = new DecimalFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 338, MezDSLParser.RULE_decimalFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2159;
                this.match(MezDSLParser.DECIMAL_FROM_STRING);
                this.state = 2160;
                this.match(MezDSLParser.T__9);
                this.state = 2161;
                this.expression();
                this.state = 2162;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    longBIFExpression() {
        let _localctx = new LongBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 340, MezDSLParser.RULE_longBIFExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2164;
                this.longFromStringBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    longFromStringBIF() {
        let _localctx = new LongFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 342, MezDSLParser.RULE_longFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2166;
                this.match(MezDSLParser.LONG_FROM_STRING);
                this.state = 2167;
                this.match(MezDSLParser.T__9);
                this.state = 2168;
                this.expression();
                this.state = 2169;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    uuidBIFExpression() {
        let _localctx = new UuidBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 344, MezDSLParser.RULE_uuidBIFExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2171;
                this.uuidFromStringBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    uuidFromStringBIF() {
        let _localctx = new UuidFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 346, MezDSLParser.RULE_uuidFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2173;
                this.match(MezDSLParser.UUID_FROM_STRING);
                this.state = 2174;
                this.match(MezDSLParser.T__9);
                this.state = 2175;
                this.expression();
                this.state = 2176;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    blobBIFExpression() {
        let _localctx = new BlobBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 348, MezDSLParser.RULE_blobBIFExpression);
        try {
            this.state = 2181;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.BLOB_FROM_STRING:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2178;
                        this.blobFromStringBIF();
                    }
                    break;
                case MezDSLParser.BLOB_WRAPPER_FROM_STRING:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2179;
                        this.blobWrapperFromStringBIF();
                    }
                    break;
                case MezDSLParser.BLOB_TO_STRING:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 2180;
                        this.blobToStringBIF();
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    blobFromStringBIF() {
        let _localctx = new BlobFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 350, MezDSLParser.RULE_blobFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2183;
                this.match(MezDSLParser.BLOB_FROM_STRING);
                this.state = 2184;
                this.match(MezDSLParser.T__9);
                this.state = 2185;
                this.expression();
                this.state = 2186;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    blobWrapperFromStringBIF() {
        let _localctx = new BlobWrapperFromStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 352, MezDSLParser.RULE_blobWrapperFromStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2188;
                this.match(MezDSLParser.BLOB_WRAPPER_FROM_STRING);
                this.state = 2189;
                this.match(MezDSLParser.T__9);
                this.state = 2190;
                this.expression();
                this.state = 2191;
                this.match(MezDSLParser.T__7);
                this.state = 2192;
                this.expression();
                this.state = 2193;
                this.match(MezDSLParser.T__7);
                this.state = 2194;
                this.expression();
                this.state = 2195;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    blobToStringBIF() {
        let _localctx = new BlobToStringBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 354, MezDSLParser.RULE_blobToStringBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2197;
                this.match(MezDSLParser.BLOB_TO_STRING);
                this.state = 2198;
                this.match(MezDSLParser.T__9);
                this.state = 2199;
                this.expression();
                this.state = 2200;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    heliumBIFExpression() {
        let _localctx = new HeliumBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 356, MezDSLParser.RULE_heliumBIFExpression);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2202;
                this.heliumGetPlatformBIF();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    heliumGetPlatformBIF() {
        let _localctx = new HeliumGetPlatformBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 358, MezDSLParser.RULE_heliumGetPlatformBIF);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2204;
                this.match(MezDSLParser.HELIUM_GET_PLATFORM);
                this.state = 2205;
                this.match(MezDSLParser.T__9);
                this.state = 2206;
                this.match(MezDSLParser.T__10);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    sqlBIFExpression() {
        let _localctx = new SqlBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 360, MezDSLParser.RULE_sqlBIFExpression);
        let _la;
        try {
            this.state = 2230;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.SQL_EXECUTE:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2208;
                        this.match(MezDSLParser.SQL_EXECUTE);
                        this.state = 2209;
                        this.match(MezDSLParser.T__9);
                        this.state = 2210;
                        _localctx._query = this.expression();
                        this.state = 2214;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2211;
                                    this.sqlBIFParam();
                                }
                            }
                            this.state = 2216;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2217;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.SQL_QUERY:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2219;
                        this.match(MezDSLParser.SQL_QUERY);
                        this.state = 2220;
                        this.match(MezDSLParser.T__9);
                        this.state = 2221;
                        _localctx._query = this.expression();
                        this.state = 2225;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2222;
                                    this.sqlBIFParam();
                                }
                            }
                            this.state = 2227;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2228;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    sqlBIFParam() {
        let _localctx = new SqlBIFParamContext(this._ctx, this.state);
        this.enterRule(_localctx, 362, MezDSLParser.RULE_sqlBIFParam);
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2232;
                this.match(MezDSLParser.T__7);
                this.state = 2233;
                this.expression();
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    persistenceBIFExpression() {
        let _localctx = new PersistenceBIFExpressionContext(this._ctx, this.state);
        this.enterRule(_localctx, 364, MezDSLParser.RULE_persistenceBIFExpression);
        try {
            this.state = 2256;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.ALL:
                case MezDSLParser.USERSELECTOR:
                case MezDSLParser.EQUALS:
                case MezDSLParser.EMPTY:
                case MezDSLParser.BETWEEN:
                case MezDSLParser.LESSTHAN:
                case MezDSLParser.LESSOREQUAL:
                case MezDSLParser.GREATERTHAN:
                case MezDSLParser.GREATEROREQAUL:
                case MezDSLParser.ATTIN:
                case MezDSLParser.RELIN:
                case MezDSLParser.CONTAINS:
                case MezDSLParser.BEGINSWITH:
                case MezDSLParser.ENDSWITH:
                case MezDSLParser.NOTLTE:
                case MezDSLParser.NOTGTE:
                case MezDSLParser.NOTEQU:
                case MezDSLParser.NOTEMPTY:
                case MezDSLParser.NOTBETWEEN:
                case MezDSLParser.NOTCONTAINS:
                case MezDSLParser.NOTBEGINSWITH:
                case MezDSLParser.NOTENDSWITH:
                case MezDSLParser.NOTATTIN:
                case MezDSLParser.NOTRELIN:
                case MezDSLParser.ANDSELECTOR:
                case MezDSLParser.UNION:
                case MezDSLParser.DIFF:
                case MezDSLParser.INTERSECT:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2235;
                        this.selectorBIF();
                    }
                    break;
                case MezDSLParser.NEW:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2236;
                        this.match(MezDSLParser.NEW);
                        this.state = 2237;
                        this.match(MezDSLParser.T__9);
                        this.state = 2238;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.READ:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 2239;
                        this.match(MezDSLParser.READ);
                        this.state = 2240;
                        this.match(MezDSLParser.T__9);
                        this.state = 2241;
                        this.expression();
                        this.state = 2242;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.FROM_CSV:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 2244;
                        this.match(MezDSLParser.FROM_CSV);
                        this.state = 2245;
                        this.match(MezDSLParser.T__9);
                        this.state = 2246;
                        this.expression();
                        this.state = 2247;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.FROM_CSV_LINE:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 2249;
                        this.match(MezDSLParser.FROM_CSV_LINE);
                        this.state = 2250;
                        this.match(MezDSLParser.T__9);
                        this.state = 2251;
                        this.expression();
                        this.state = 2252;
                        this.match(MezDSLParser.T__7);
                        this.state = 2253;
                        this.expression();
                        this.state = 2254;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    simpleSelectorBIF() {
        let _localctx = new SimpleSelectorBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 366, MezDSLParser.RULE_simpleSelectorBIF);
        try {
            this.state = 2416;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.ALL:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2258;
                        this.match(MezDSLParser.ALL);
                        this.state = 2259;
                        this.match(MezDSLParser.T__9);
                        this.state = 2260;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.USERSELECTOR:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2261;
                        this.match(MezDSLParser.USERSELECTOR);
                        this.state = 2262;
                        this.match(MezDSLParser.T__9);
                        this.state = 2263;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.LESSTHAN:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 2264;
                        this.match(MezDSLParser.LESSTHAN);
                        this.state = 2265;
                        this.match(MezDSLParser.T__9);
                        this.state = 2266;
                        this.match(MezDSLParser.ID);
                        this.state = 2267;
                        this.match(MezDSLParser.T__7);
                        this.state = 2268;
                        this.expression();
                        this.state = 2269;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.LESSOREQUAL:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 2271;
                        this.match(MezDSLParser.LESSOREQUAL);
                        this.state = 2272;
                        this.match(MezDSLParser.T__9);
                        this.state = 2273;
                        this.match(MezDSLParser.ID);
                        this.state = 2274;
                        this.match(MezDSLParser.T__7);
                        this.state = 2275;
                        this.expression();
                        this.state = 2276;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.GREATERTHAN:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 2278;
                        this.match(MezDSLParser.GREATERTHAN);
                        this.state = 2279;
                        this.match(MezDSLParser.T__9);
                        this.state = 2280;
                        this.match(MezDSLParser.ID);
                        this.state = 2281;
                        this.match(MezDSLParser.T__7);
                        this.state = 2282;
                        this.expression();
                        this.state = 2283;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.GREATEROREQAUL:
                    this.enterOuterAlt(_localctx, 6);
                    {
                        this.state = 2285;
                        this.match(MezDSLParser.GREATEROREQAUL);
                        this.state = 2286;
                        this.match(MezDSLParser.T__9);
                        this.state = 2287;
                        this.match(MezDSLParser.ID);
                        this.state = 2288;
                        this.match(MezDSLParser.T__7);
                        this.state = 2289;
                        this.expression();
                        this.state = 2290;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.EQUALS:
                    this.enterOuterAlt(_localctx, 7);
                    {
                        this.state = 2292;
                        this.match(MezDSLParser.EQUALS);
                        this.state = 2293;
                        this.match(MezDSLParser.T__9);
                        this.state = 2294;
                        this.match(MezDSLParser.ID);
                        this.state = 2295;
                        this.match(MezDSLParser.T__7);
                        this.state = 2296;
                        this.expression();
                        this.state = 2297;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.EMPTY:
                    this.enterOuterAlt(_localctx, 8);
                    {
                        this.state = 2299;
                        this.match(MezDSLParser.EMPTY);
                        this.state = 2300;
                        this.match(MezDSLParser.T__9);
                        this.state = 2301;
                        this.match(MezDSLParser.ID);
                        this.state = 2302;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.BETWEEN:
                    this.enterOuterAlt(_localctx, 9);
                    {
                        this.state = 2303;
                        this.match(MezDSLParser.BETWEEN);
                        this.state = 2304;
                        this.match(MezDSLParser.T__9);
                        this.state = 2305;
                        this.match(MezDSLParser.ID);
                        this.state = 2306;
                        this.match(MezDSLParser.T__7);
                        this.state = 2307;
                        _localctx._begin = this.expression();
                        this.state = 2308;
                        this.match(MezDSLParser.T__7);
                        this.state = 2309;
                        _localctx._end = this.expression();
                        this.state = 2310;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.CONTAINS:
                    this.enterOuterAlt(_localctx, 10);
                    {
                        this.state = 2312;
                        this.match(MezDSLParser.CONTAINS);
                        this.state = 2313;
                        this.match(MezDSLParser.T__9);
                        this.state = 2314;
                        this.match(MezDSLParser.ID);
                        this.state = 2315;
                        this.match(MezDSLParser.T__7);
                        this.state = 2316;
                        this.expression();
                        this.state = 2317;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.BEGINSWITH:
                    this.enterOuterAlt(_localctx, 11);
                    {
                        this.state = 2319;
                        this.match(MezDSLParser.BEGINSWITH);
                        this.state = 2320;
                        this.match(MezDSLParser.T__9);
                        this.state = 2321;
                        this.match(MezDSLParser.ID);
                        this.state = 2322;
                        this.match(MezDSLParser.T__7);
                        this.state = 2323;
                        this.expression();
                        this.state = 2324;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.ENDSWITH:
                    this.enterOuterAlt(_localctx, 12);
                    {
                        this.state = 2326;
                        this.match(MezDSLParser.ENDSWITH);
                        this.state = 2327;
                        this.match(MezDSLParser.T__9);
                        this.state = 2328;
                        this.match(MezDSLParser.ID);
                        this.state = 2329;
                        this.match(MezDSLParser.T__7);
                        this.state = 2330;
                        this.expression();
                        this.state = 2331;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.ATTIN:
                    this.enterOuterAlt(_localctx, 13);
                    {
                        this.state = 2333;
                        this.match(MezDSLParser.ATTIN);
                        this.state = 2334;
                        this.match(MezDSLParser.T__9);
                        this.state = 2335;
                        this.match(MezDSLParser.ID);
                        this.state = 2336;
                        this.match(MezDSLParser.T__7);
                        this.state = 2337;
                        this.expression();
                        this.state = 2338;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.RELIN:
                    this.enterOuterAlt(_localctx, 14);
                    {
                        this.state = 2340;
                        this.match(MezDSLParser.RELIN);
                        this.state = 2341;
                        this.match(MezDSLParser.T__9);
                        this.state = 2342;
                        this.match(MezDSLParser.ID);
                        this.state = 2343;
                        this.match(MezDSLParser.T__7);
                        this.state = 2344;
                        this.expression();
                        this.state = 2345;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTLTE:
                    this.enterOuterAlt(_localctx, 15);
                    {
                        this.state = 2347;
                        this.match(MezDSLParser.NOTLTE);
                        this.state = 2348;
                        this.match(MezDSLParser.T__9);
                        this.state = 2349;
                        this.match(MezDSLParser.ID);
                        this.state = 2350;
                        this.match(MezDSLParser.T__7);
                        this.state = 2351;
                        this.expression();
                        this.state = 2352;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTGTE:
                    this.enterOuterAlt(_localctx, 16);
                    {
                        this.state = 2354;
                        this.match(MezDSLParser.NOTGTE);
                        this.state = 2355;
                        this.match(MezDSLParser.T__9);
                        this.state = 2356;
                        this.match(MezDSLParser.ID);
                        this.state = 2357;
                        this.match(MezDSLParser.T__7);
                        this.state = 2358;
                        this.expression();
                        this.state = 2359;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTEQU:
                    this.enterOuterAlt(_localctx, 17);
                    {
                        this.state = 2361;
                        this.match(MezDSLParser.NOTEQU);
                        this.state = 2362;
                        this.match(MezDSLParser.T__9);
                        this.state = 2363;
                        this.match(MezDSLParser.ID);
                        this.state = 2364;
                        this.match(MezDSLParser.T__7);
                        this.state = 2365;
                        this.expression();
                        this.state = 2366;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTEMPTY:
                    this.enterOuterAlt(_localctx, 18);
                    {
                        this.state = 2368;
                        this.match(MezDSLParser.NOTEMPTY);
                        this.state = 2369;
                        this.match(MezDSLParser.T__9);
                        this.state = 2370;
                        this.match(MezDSLParser.ID);
                        this.state = 2371;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTBETWEEN:
                    this.enterOuterAlt(_localctx, 19);
                    {
                        this.state = 2372;
                        this.match(MezDSLParser.NOTBETWEEN);
                        this.state = 2373;
                        this.match(MezDSLParser.T__9);
                        this.state = 2374;
                        this.match(MezDSLParser.ID);
                        this.state = 2375;
                        this.match(MezDSLParser.T__7);
                        this.state = 2376;
                        _localctx._begin = this.expression();
                        this.state = 2377;
                        this.match(MezDSLParser.T__7);
                        this.state = 2378;
                        _localctx._end = this.expression();
                        this.state = 2379;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTCONTAINS:
                    this.enterOuterAlt(_localctx, 20);
                    {
                        this.state = 2381;
                        this.match(MezDSLParser.NOTCONTAINS);
                        this.state = 2382;
                        this.match(MezDSLParser.T__9);
                        this.state = 2383;
                        this.match(MezDSLParser.ID);
                        this.state = 2384;
                        this.match(MezDSLParser.T__7);
                        this.state = 2385;
                        this.expression();
                        this.state = 2386;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTBEGINSWITH:
                    this.enterOuterAlt(_localctx, 21);
                    {
                        this.state = 2388;
                        this.match(MezDSLParser.NOTBEGINSWITH);
                        this.state = 2389;
                        this.match(MezDSLParser.T__9);
                        this.state = 2390;
                        this.match(MezDSLParser.ID);
                        this.state = 2391;
                        this.match(MezDSLParser.T__7);
                        this.state = 2392;
                        this.expression();
                        this.state = 2393;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTENDSWITH:
                    this.enterOuterAlt(_localctx, 22);
                    {
                        this.state = 2395;
                        this.match(MezDSLParser.NOTENDSWITH);
                        this.state = 2396;
                        this.match(MezDSLParser.T__9);
                        this.state = 2397;
                        this.match(MezDSLParser.ID);
                        this.state = 2398;
                        this.match(MezDSLParser.T__7);
                        this.state = 2399;
                        this.expression();
                        this.state = 2400;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTATTIN:
                    this.enterOuterAlt(_localctx, 23);
                    {
                        this.state = 2402;
                        this.match(MezDSLParser.NOTATTIN);
                        this.state = 2403;
                        this.match(MezDSLParser.T__9);
                        this.state = 2404;
                        this.match(MezDSLParser.ID);
                        this.state = 2405;
                        this.match(MezDSLParser.T__7);
                        this.state = 2406;
                        this.expression();
                        this.state = 2407;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.NOTRELIN:
                    this.enterOuterAlt(_localctx, 24);
                    {
                        this.state = 2409;
                        this.match(MezDSLParser.NOTRELIN);
                        this.state = 2410;
                        this.match(MezDSLParser.T__9);
                        this.state = 2411;
                        this.match(MezDSLParser.ID);
                        this.state = 2412;
                        this.match(MezDSLParser.T__7);
                        this.state = 2413;
                        this.expression();
                        this.state = 2414;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    selectorBIF() {
        let _localctx = new SelectorBIFContext(this._ctx, this.state);
        this.enterRule(_localctx, 368, MezDSLParser.RULE_selectorBIF);
        let _la;
        try {
            this.state = 2475;
            this._errHandler.sync(this);
            switch (this._input.LA(1)) {
                case MezDSLParser.ALL:
                case MezDSLParser.USERSELECTOR:
                case MezDSLParser.EQUALS:
                case MezDSLParser.EMPTY:
                case MezDSLParser.BETWEEN:
                case MezDSLParser.LESSTHAN:
                case MezDSLParser.LESSOREQUAL:
                case MezDSLParser.GREATERTHAN:
                case MezDSLParser.GREATEROREQAUL:
                case MezDSLParser.ATTIN:
                case MezDSLParser.RELIN:
                case MezDSLParser.CONTAINS:
                case MezDSLParser.BEGINSWITH:
                case MezDSLParser.ENDSWITH:
                case MezDSLParser.NOTLTE:
                case MezDSLParser.NOTGTE:
                case MezDSLParser.NOTEQU:
                case MezDSLParser.NOTEMPTY:
                case MezDSLParser.NOTBETWEEN:
                case MezDSLParser.NOTCONTAINS:
                case MezDSLParser.NOTBEGINSWITH:
                case MezDSLParser.NOTENDSWITH:
                case MezDSLParser.NOTATTIN:
                case MezDSLParser.NOTRELIN:
                    this.enterOuterAlt(_localctx, 1);
                    {
                        this.state = 2418;
                        this.simpleSelectorBIF();
                    }
                    break;
                case MezDSLParser.ANDSELECTOR:
                    this.enterOuterAlt(_localctx, 2);
                    {
                        this.state = 2419;
                        this.match(MezDSLParser.ANDSELECTOR);
                        this.state = 2420;
                        this.match(MezDSLParser.T__9);
                        this.state = 2421;
                        this.simpleSelectorBIF();
                        this.state = 2422;
                        this.match(MezDSLParser.T__7);
                        this.state = 2423;
                        this.simpleSelectorBIF();
                        this.state = 2428;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2424;
                                    this.match(MezDSLParser.T__7);
                                    this.state = 2425;
                                    this.simpleSelectorBIF();
                                }
                            }
                            this.state = 2430;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2431;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.UNION:
                    this.enterOuterAlt(_localctx, 3);
                    {
                        this.state = 2433;
                        this.match(MezDSLParser.UNION);
                        this.state = 2434;
                        this.match(MezDSLParser.T__9);
                        this.state = 2435;
                        this.selectorBIF();
                        this.state = 2436;
                        this.match(MezDSLParser.T__7);
                        this.state = 2437;
                        this.selectorBIF();
                        this.state = 2442;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2438;
                                    this.match(MezDSLParser.T__7);
                                    this.state = 2439;
                                    this.selectorBIF();
                                }
                            }
                            this.state = 2444;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2445;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.DIFF:
                    this.enterOuterAlt(_localctx, 4);
                    {
                        this.state = 2447;
                        this.match(MezDSLParser.DIFF);
                        this.state = 2448;
                        this.match(MezDSLParser.T__9);
                        this.state = 2449;
                        this.selectorBIF();
                        this.state = 2450;
                        this.match(MezDSLParser.T__7);
                        this.state = 2451;
                        this.selectorBIF();
                        this.state = 2456;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2452;
                                    this.match(MezDSLParser.T__7);
                                    this.state = 2453;
                                    this.selectorBIF();
                                }
                            }
                            this.state = 2458;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2459;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                case MezDSLParser.INTERSECT:
                    this.enterOuterAlt(_localctx, 5);
                    {
                        this.state = 2461;
                        this.match(MezDSLParser.INTERSECT);
                        this.state = 2462;
                        this.match(MezDSLParser.T__9);
                        this.state = 2463;
                        this.selectorBIF();
                        this.state = 2464;
                        this.match(MezDSLParser.T__7);
                        this.state = 2465;
                        this.selectorBIF();
                        this.state = 2470;
                        this._errHandler.sync(this);
                        _la = this._input.LA(1);
                        while (_la === MezDSLParser.T__7) {
                            {
                                {
                                    this.state = 2466;
                                    this.match(MezDSLParser.T__7);
                                    this.state = 2467;
                                    this.selectorBIF();
                                }
                            }
                            this.state = 2472;
                            this._errHandler.sync(this);
                            _la = this._input.LA(1);
                        }
                        this.state = 2473;
                        this.match(MezDSLParser.T__10);
                    }
                    break;
                default:
                    throw new NoViableAltException_1.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    // @RuleVersion(0)
    primitiveType() {
        let _localctx = new PrimitiveTypeContext(this._ctx, this.state);
        this.enterRule(_localctx, 370, MezDSLParser.RULE_primitiveType);
        let _la;
        try {
            this.enterOuterAlt(_localctx, 1);
            {
                this.state = 2477;
                _la = this._input.LA(1);
                if (!(((((_la - 215)) & ~0x1F) === 0 && ((1 << (_la - 215)) & ((1 << (MezDSLParser.INT - 215)) | (1 << (MezDSLParser.DECIMAL - 215)) | (1 << (MezDSLParser.LONG - 215)) | (1 << (MezDSLParser.UUID - 215)) | (1 << (MezDSLParser.BLOB - 215)) | (1 << (MezDSLParser.BOOL - 215)) | (1 << (MezDSLParser.STRING - 215)) | (1 << (MezDSLParser.VOID - 215)) | (1 << (MezDSLParser.DATE - 215)) | (1 << (MezDSLParser.DATETIME - 215)) | (1 << (MezDSLParser.JSON - 215)) | (1 << (MezDSLParser.JSONARRAY - 215)))) !== 0))) {
                    this._errHandler.recoverInline(this);
                }
                else {
                    if (this._input.LA(1) === Token_1.Token.EOF) {
                        this.matchedEOF = true;
                    }
                    this._errHandler.reportMatch(this);
                    this.consume();
                }
            }
        }
        catch (re) {
            if (re instanceof RecognitionException_1.RecognitionException) {
                _localctx.exception = re;
                this._errHandler.reportError(this, re);
                this._errHandler.recover(this, re);
            }
            else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return _localctx;
    }
    static get _ATN() {
        if (!MezDSLParser.__ATN) {
            MezDSLParser.__ATN = new ATNDeserializer_1.ATNDeserializer().deserialize(Utils.toCharArray(MezDSLParser._serializedATN));
        }
        return MezDSLParser.__ATN;
    }
}
exports.MezDSLParser = MezDSLParser;
MezDSLParser.T__0 = 1;
MezDSLParser.T__1 = 2;
MezDSLParser.T__2 = 3;
MezDSLParser.T__3 = 4;
MezDSLParser.T__4 = 5;
MezDSLParser.T__5 = 6;
MezDSLParser.T__6 = 7;
MezDSLParser.T__7 = 8;
MezDSLParser.T__8 = 9;
MezDSLParser.T__9 = 10;
MezDSLParser.T__10 = 11;
MezDSLParser.T__11 = 12;
MezDSLParser.T__12 = 13;
MezDSLParser.T__13 = 14;
MezDSLParser.T__14 = 15;
MezDSLParser.T__15 = 16;
MezDSLParser.T__16 = 17;
MezDSLParser.T__17 = 18;
MezDSLParser.T__18 = 19;
MezDSLParser.T__19 = 20;
MezDSLParser.T__20 = 21;
MezDSLParser.T__21 = 22;
MezDSLParser.T__22 = 23;
MezDSLParser.FORCE_PASSWORD_RESET = 24;
MezDSLParser.REMOVE_ROLE = 25;
MezDSLParser.OBJECT_INVITE = 26;
MezDSLParser.OBJECT_PAY_RECIPIENT = 27;
MezDSLParser.OBJECT_PAY_RECIPIENT_WITH_REF = 28;
MezDSLParser.NOTIFY = 29;
MezDSLParser.JSONGET = 30;
MezDSLParser.JSONPUT = 31;
MezDSLParser.JSONREMOVE = 32;
MezDSLParser.JSONCONTAINS = 33;
MezDSLParser.JSONKEYS = 34;
MezDSLParser.CLEAR = 35;
MezDSLParser.APPEND = 36;
MezDSLParser.PREPEND = 37;
MezDSLParser.SORTASC = 38;
MezDSLParser.SORTDESC = 39;
MezDSLParser.ADD = 40;
MezDSLParser.REMOVE = 41;
MezDSLParser.POP = 42;
MezDSLParser.DROP = 43;
MezDSLParser.LENGTH = 44;
MezDSLParser.FIRST = 45;
MezDSLParser.LAST = 46;
MezDSLParser.GET = 47;
MezDSLParser.COLLECTION_SELECT = 48;
MezDSLParser.SAVE = 49;
MezDSLParser.NEW = 50;
MezDSLParser.FROM_CSV = 51;
MezDSLParser.FROM_CSV_LINE = 52;
MezDSLParser.READ = 53;
MezDSLParser.DELETE = 54;
MezDSLParser.ALL = 55;
MezDSLParser.USERSELECTOR = 56;
MezDSLParser.EQUALS = 57;
MezDSLParser.EMPTY = 58;
MezDSLParser.BETWEEN = 59;
MezDSLParser.LESSTHAN = 60;
MezDSLParser.LESSOREQUAL = 61;
MezDSLParser.GREATERTHAN = 62;
MezDSLParser.GREATEROREQAUL = 63;
MezDSLParser.ATTIN = 64;
MezDSLParser.RELIN = 65;
MezDSLParser.CONTAINS = 66;
MezDSLParser.BEGINSWITH = 67;
MezDSLParser.ENDSWITH = 68;
MezDSLParser.NOTLTE = 69;
MezDSLParser.NOTGTE = 70;
MezDSLParser.NOTEQU = 71;
MezDSLParser.NOTEMPTY = 72;
MezDSLParser.NOTBETWEEN = 73;
MezDSLParser.NOTCONTAINS = 74;
MezDSLParser.NOTBEGINSWITH = 75;
MezDSLParser.NOTENDSWITH = 76;
MezDSLParser.NOTATTIN = 77;
MezDSLParser.NOTRELIN = 78;
MezDSLParser.ANDSELECTOR = 79;
MezDSLParser.UNION = 80;
MezDSLParser.DIFF = 81;
MezDSLParser.INTERSECT = 82;
MezDSLParser.ALERT = 83;
MezDSLParser.ALERT_WARN = 84;
MezDSLParser.ALERT_ERROR = 85;
MezDSLParser.ERROR = 86;
MezDSLParser.LOG = 87;
MezDSLParser.WARN = 88;
MezDSLParser.NOW = 89;
MezDSLParser.TODAY = 90;
MezDSLParser.SMS = 91;
MezDSLParser.SMS_SEND = 92;
MezDSLParser.SMS_END_CONVERSATION = 93;
MezDSLParser.SMS_GET_CONVERSATION_ID = 94;
MezDSLParser.EMAIL = 95;
MezDSLParser.EMAIL_ATTACH = 96;
MezDSLParser.EMAIL_CSV = 97;
MezDSLParser.COLLECTION_CSV = 98;
MezDSLParser.USER_ROLE = 99;
MezDSLParser.PAYMENT_STATUS_REQUEST = 100;
MezDSLParser.ENCRYPT = 101;
MezDSLParser.DECRYPT = 102;
MezDSLParser.CREATE_CRYPTO_KEY = 103;
MezDSLParser.CBC_ENCRYPT = 104;
MezDSLParser.CBC_DECRYPT = 105;
MezDSLParser.DOWNLOAD_REPORT = 106;
MezDSLParser.GENERATE_REPORT = 107;
MezDSLParser.DOWNLOAD_FILE = 108;
MezDSLParser.API_GET = 109;
MezDSLParser.API_POST = 110;
MezDSLParser.API_DELETE = 111;
MezDSLParser.API_PUT = 112;
MezDSLParser.API_SET_STATUS_CODE = 113;
MezDSLParser.CREATE_BATCH = 114;
MezDSLParser.IS_EQUAL = 115;
MezDSLParser.IS_TRUE = 116;
MezDSLParser.IS_FALSE = 117;
MezDSLParser.IS_NULL = 118;
MezDSLParser.IS_NOT_NULL = 119;
MezDSLParser.IS_GTE = 120;
MezDSLParser.IS_GT = 121;
MezDSLParser.IS_LTE = 122;
MezDSLParser.IS_LT = 123;
MezDSLParser.IS_BOTH = 124;
MezDSLParser.IS_EITHER = 125;
MezDSLParser.IS_NOTEQUAL = 126;
MezDSLParser.BEFORE_CREATE = 127;
MezDSLParser.AFTER_CREATE = 128;
MezDSLParser.BEFORE_UPDATE = 129;
MezDSLParser.AFTER_UPDATE = 130;
MezDSLParser.BEFORE_DELETE = 131;
MezDSLParser.AFTER_DELETE = 132;
MezDSLParser.RETURN = 133;
MezDSLParser.RECEIVESMS = 134;
MezDSLParser.TEST = 135;
MezDSLParser.USSD = 136;
MezDSLParser.ROLE = 137;
MezDSLParser.RESTRICT = 138;
MezDSLParser.SCHEDULED = 139;
MezDSLParser.INVITEUSER = 140;
MezDSLParser.ROLENAME = 141;
MezDSLParser.ONPAYMENTUPDATE = 142;
MezDSLParser.ONSCHEDULEDFUNCTIONRESULTUPDATE = 143;
MezDSLParser.ONSMSRESULTUPDATE = 144;
MezDSLParser.ONPAYMENTSTATUSREQUESTRESULTUPDATE = 145;
MezDSLParser.NOT_TRACKED = 146;
MezDSLParser.POST_API = 147;
MezDSLParser.GET_API = 148;
MezDSLParser.PUT_API = 149;
MezDSLParser.DELETE_API = 150;
MezDSLParser.RESPONSE_EXPAND = 151;
MezDSLParser.RESPONSE_EXCLUDE = 152;
MezDSLParser.POW = 153;
MezDSLParser.SQRT = 154;
MezDSLParser.RANDOM = 155;
MezDSLParser.FLOOR = 156;
MezDSLParser.CEILING = 157;
MezDSLParser.ROUND = 158;
MezDSLParser.STRINGS_CONCAT = 159;
MezDSLParser.STRINGS_LENGTH = 160;
MezDSLParser.STRINGS_SPLIT = 161;
MezDSLParser.STRING_CONCAT = 162;
MezDSLParser.STRING_ENDS_WITH = 163;
MezDSLParser.STRING_INDEX_OF = 164;
MezDSLParser.STRING_JOIN = 165;
MezDSLParser.STRING_LENGTH = 166;
MezDSLParser.STRING_LOWER = 167;
MezDSLParser.STRING_UPPER = 168;
MezDSLParser.STRING_SPLIT = 169;
MezDSLParser.STRING_STARTS_WITH = 170;
MezDSLParser.STRING_SUBSTRING = 171;
MezDSLParser.STRING_TRANSLATE = 172;
MezDSLParser.STRING_REGEX_MATCH = 173;
MezDSLParser.STRING_REGEX_REPLACE_FIRST = 174;
MezDSLParser.STRING_REGEX_REPLACE_ALL = 175;
MezDSLParser.STRING_REGEX_FIND = 176;
MezDSLParser.STRING_REPLACE_ALL = 177;
MezDSLParser.STRING_URL_ENCODE = 178;
MezDSLParser.STRING_URL_DECODE = 179;
MezDSLParser.JSON_FROM_CSV_LINE = 180;
MezDSLParser.JSON_FROM_CSV = 181;
MezDSLParser.DATE_FROM_STRING = 182;
MezDSLParser.DATE_FROM_ISO_STRING = 183;
MezDSLParser.DATE_TIME_FROM_STRING = 184;
MezDSLParser.DATE_TIME_FROM_ISO_STRING = 185;
MezDSLParser.DATE_TIME_FROM_LONG = 186;
MezDSLParser.DATE_NOW = 187;
MezDSLParser.DATE_TODAY = 188;
MezDSLParser.DATE_ADD_DAYS = 189;
MezDSLParser.DATE_ADD_MONTHS = 190;
MezDSLParser.DATE_ADD_SECONDS = 191;
MezDSLParser.DATE_DAYS_BETWEEN = 192;
MezDSLParser.DATE_EXTRACT = 193;
MezDSLParser.DATE_MONTHS_BETWEEN = 194;
MezDSLParser.DATE_SECONDS_BETWEEN = 195;
MezDSLParser.INTEGER_FROM_STRING = 196;
MezDSLParser.DECIMAL_FROM_STRING = 197;
MezDSLParser.LONG_FROM_STRING = 198;
MezDSLParser.UUID_FROM_STRING = 199;
MezDSLParser.BLOB_FROM_STRING = 200;
MezDSLParser.BLOB_WRAPPER_FROM_STRING = 201;
MezDSLParser.BLOB_TO_STRING = 202;
MezDSLParser.HELIUM_GET_PLATFORM = 203;
MezDSLParser.NOTNULL = 204;
MezDSLParser.REGEX = 205;
MezDSLParser.MINVAL = 206;
MezDSLParser.MAXVAL = 207;
MezDSLParser.MINLEN = 208;
MezDSLParser.MAXLEN = 209;
MezDSLParser.ONETOONE = 210;
MezDSLParser.MANYTOMANY = 211;
MezDSLParser.MANYTOONE = 212;
MezDSLParser.ONETOMANY = 213;
MezDSLParser.VIA = 214;
MezDSLParser.INT = 215;
MezDSLParser.DECIMAL = 216;
MezDSLParser.LONG = 217;
MezDSLParser.UUID = 218;
MezDSLParser.BLOB = 219;
MezDSLParser.BOOL = 220;
MezDSLParser.STRING = 221;
MezDSLParser.VOID = 222;
MezDSLParser.DATE = 223;
MezDSLParser.DATETIME = 224;
MezDSLParser.JSON = 225;
MezDSLParser.JSONARRAY = 226;
MezDSLParser.ASSIGN = 227;
MezDSLParser.COL = 228;
MezDSLParser.LCOL = 229;
MezDSLParser.RCOL = 230;
MezDSLParser.EQU = 231;
MezDSLParser.NEQU = 232;
MezDSLParser.LT = 233;
MezDSLParser.LTE = 234;
MezDSLParser.GT = 235;
MezDSLParser.GTE = 236;
MezDSLParser.OR = 237;
MezDSLParser.AND = 238;
MezDSLParser.INC = 239;
MezDSLParser.DEC = 240;
MezDSLParser.PLUS = 241;
MezDSLParser.MINUS = 242;
MezDSLParser.MULT = 243;
MezDSLParser.DIV = 244;
MezDSLParser.MOD = 245;
MezDSLParser.QUOTE = 246;
MezDSLParser.LMULTI = 247;
MezDSLParser.RMULTI = 248;
MezDSLParser.LSTR_BLOCK = 249;
MezDSLParser.RSTR_BLOCK = 250;
MezDSLParser.SQL_EXECUTE = 251;
MezDSLParser.SQL_QUERY = 252;
MezDSLParser.DEFAULT = 253;
MezDSLParser.NULL = 254;
MezDSLParser.TRUE = 255;
MezDSLParser.FALSE = 256;
MezDSLParser.ENUM_ID = 257;
MezDSLParser.ID = 258;
MezDSLParser.DEC_LITERAL = 259;
MezDSLParser.INT_LITERAL = 260;
MezDSLParser.LONG_LITERAL = 261;
MezDSLParser.STR_LITERAL = 262;
MezDSLParser.STR_BLOCK = 263;
MezDSLParser.NEWLINE = 264;
MezDSLParser.WHITESPACE = 265;
MezDSLParser.ML_COMMENT = 266;
MezDSLParser.SL_COMMENT = 267;
MezDSLParser.SCRIPT = 268;
MezDSLParser.PERSISTENCE = 269;
MezDSLParser.UNIT = 270;
MezDSLParser.OBJECT = 271;
MezDSLParser.SELECTOR = 272;
MezDSLParser.PERSISTENT_OBJECT = 273;
MezDSLParser.PERS_SELECTOR = 274;
MezDSLParser.RELATIONSHIP = 275;
MezDSLParser.ENUMERATION = 276;
MezDSLParser.PRIMITIVE_ATTRIBUTE = 277;
MezDSLParser.ENUMERATION_ATTRIBUTE = 278;
MezDSLParser.ENUM_VALUE = 279;
MezDSLParser.VALIDATOR = 280;
MezDSLParser.VARIABLE_DECL = 281;
MezDSLParser.FUNCTION_DEF = 282;
MezDSLParser.CODEBLOCK = 283;
MezDSLParser.FUNCTION_SIGNATURE = 284;
MezDSLParser.TOKEN_SPECIAL_FUNCTION_SIGNATURE = 285;
MezDSLParser.VALIDATOR_ANNOTATION = 286;
MezDSLParser.VARIABLE_ACCESS = 287;
MezDSLParser.ATTRIBUTE_ACCESS = 288;
MezDSLParser.FUNCTION_ACCESS = 289;
MezDSLParser.UNIT_VARIABLE_ACCESS = 290;
MezDSLParser.UNIT_ATTRIBUTE_ACCESS = 291;
MezDSLParser.INSTANCE_BIF = 292;
MezDSLParser.TOKEN_OBJECT_PAY_RECIPIENT = 293;
MezDSLParser.TOKEN_OBJECT_PAY_REF_RECIPIENT = 294;
MezDSLParser.TOKEN_OBJECT_INVITE = 295;
MezDSLParser.ENUM_ACCESS = 296;
MezDSLParser.ENUM_ACCESS_ENTRY = 297;
MezDSLParser.ASSIGNMENT = 298;
MezDSLParser.FUNC_CALL = 299;
MezDSLParser.TOKEN_SPECIAL_FUNCTION_CALL = 300;
MezDSLParser.IF_STMT = 301;
MezDSLParser.ELSEIF_PART = 302;
MezDSLParser.ELSE_PART = 303;
MezDSLParser.TRY_STMT = 304;
MezDSLParser.TRY_PART = 305;
MezDSLParser.CATCH_PART = 306;
MezDSLParser.FINALLY_PART = 307;
MezDSLParser.THROW = 308;
MezDSLParser.FOR_EACH = 309;
MezDSLParser.FOR_LOOP = 310;
MezDSLParser.FOR_INIT = 311;
MezDSLParser.FOR_COMP = 312;
MezDSLParser.FOR_POST = 313;
MezDSLParser.PERS_BIF = 314;
MezDSLParser.NEG_EXP = 315;
MezDSLParser.INC_EXP = 316;
MezDSLParser.DEC_EXP = 317;
MezDSLParser.VARINIT = 318;
MezDSLParser.EMAIL_ATTACHMENT = 319;
MezDSLParser.TOKEN_COLLECTION_SELECT = 320;
MezDSLParser.EMAIL_ATTACHMENT_WITH_NAME = 321;
MezDSLParser.EMAIL_WITH_ATTACHMENTS = 322;
MezDSLParser.SQL_PARAM = 323;
MezDSLParser.TOKEN_JSON_GET = 324;
MezDSLParser.TOKEN_JSON_PUT = 325;
MezDSLParser.TOKEN_JSON_REMOVE = 326;
MezDSLParser.TOKEN_JSON_CONTAINS = 327;
MezDSLParser.TOKEN_JSON_KEYS = 328;
MezDSLParser.TOKEN_CREATE_BATCH = 329;
MezDSLParser.RULE_script = 0;
MezDSLParser.RULE_scriptContent = 1;
MezDSLParser.RULE_persistence = 2;
MezDSLParser.RULE_persistenceElement = 3;
MezDSLParser.RULE_unit = 4;
MezDSLParser.RULE_customObject = 5;
MezDSLParser.RULE_simpleObject = 6;
MezDSLParser.RULE_trigger = 7;
MezDSLParser.RULE_beforeCreate = 8;
MezDSLParser.RULE_afterCreate = 9;
MezDSLParser.RULE_beforeUpdate = 10;
MezDSLParser.RULE_afterUpdate = 11;
MezDSLParser.RULE_beforeDelete = 12;
MezDSLParser.RULE_afterDelete = 13;
MezDSLParser.RULE_persistentObject = 14;
MezDSLParser.RULE_objectAttribute = 15;
MezDSLParser.RULE_relationship = 16;
MezDSLParser.RULE_primitiveAttribute = 17;
MezDSLParser.RULE_enumAttribute = 18;
MezDSLParser.RULE_enumeration = 19;
MezDSLParser.RULE_enumValue = 20;
MezDSLParser.RULE_multiplicityAnnotation = 21;
MezDSLParser.RULE_objectAnnotation = 22;
MezDSLParser.RULE_attributeAnnotation = 23;
MezDSLParser.RULE_functionAnnotation = 24;
MezDSLParser.RULE_receiveSMSAnnotation = 25;
MezDSLParser.RULE_unitTestAnnotation = 26;
MezDSLParser.RULE_ussdAnnotation = 27;
MezDSLParser.RULE_scheduledAnnotation = 28;
MezDSLParser.RULE_inviteUserAnnotation = 29;
MezDSLParser.RULE_roleNameAnnotation = 30;
MezDSLParser.RULE_onPaymentUpdateAnnotation = 31;
MezDSLParser.RULE_onScheduledFunctionResultUpdateAnnotation = 32;
MezDSLParser.RULE_onSmsResultUpdateAnnotation = 33;
MezDSLParser.RULE_onPaymentStatusRequestResultUpdateAnnotation = 34;
MezDSLParser.RULE_postAnnotation = 35;
MezDSLParser.RULE_getAnnotation = 36;
MezDSLParser.RULE_putAnnotation = 37;
MezDSLParser.RULE_deleteAnnotation = 38;
MezDSLParser.RULE_responseExpandAnnotation = 39;
MezDSLParser.RULE_responseExcludeAnnotation = 40;
MezDSLParser.RULE_roleAnnotation = 41;
MezDSLParser.RULE_restrictedObjectAnnotation = 42;
MezDSLParser.RULE_restrictedAttributeAnnotation = 43;
MezDSLParser.RULE_notTrackedAnnotation = 44;
MezDSLParser.RULE_validatorAnnotation = 45;
MezDSLParser.RULE_validator = 46;
MezDSLParser.RULE_atomicValidator = 47;
MezDSLParser.RULE_relationshipMultiplicity = 48;
MezDSLParser.RULE_variableDeclaration = 49;
MezDSLParser.RULE_variableDeclareInit = 50;
MezDSLParser.RULE_variableType = 51;
MezDSLParser.RULE_functionDefinition = 52;
MezDSLParser.RULE_codeBlock = 53;
MezDSLParser.RULE_codeBlockContent = 54;
MezDSLParser.RULE_functionSignature = 55;
MezDSLParser.RULE_specialFunctionName = 56;
MezDSLParser.RULE_typeName = 57;
MezDSLParser.RULE_parameter = 58;
MezDSLParser.RULE_statement = 59;
MezDSLParser.RULE_returnStatement = 60;
MezDSLParser.RULE_simpleStatement = 61;
MezDSLParser.RULE_incrementStatement = 62;
MezDSLParser.RULE_decrementStatement = 63;
MezDSLParser.RULE_complexStatement = 64;
MezDSLParser.RULE_forEach = 65;
MezDSLParser.RULE_forLoop = 66;
MezDSLParser.RULE_forLoopParams = 67;
MezDSLParser.RULE_forLoopInitialCondition = 68;
MezDSLParser.RULE_forLoopCondition = 69;
MezDSLParser.RULE_forLoopPostLoop = 70;
MezDSLParser.RULE_forLoopConditionOperator = 71;
MezDSLParser.RULE_tryStatement = 72;
MezDSLParser.RULE_catchPart = 73;
MezDSLParser.RULE_finallyPart = 74;
MezDSLParser.RULE_ifStatement = 75;
MezDSLParser.RULE_elseIfPart = 76;
MezDSLParser.RULE_elsePart = 77;
MezDSLParser.RULE_throwStatement = 78;
MezDSLParser.RULE_bifStatement = 79;
MezDSLParser.RULE_assertBIFStatement = 80;
MezDSLParser.RULE_assertBIF = 81;
MezDSLParser.RULE_instanceBIFStatement = 82;
MezDSLParser.RULE_collectionsStatementBIF = 83;
MezDSLParser.RULE_notificationStatementBIF = 84;
MezDSLParser.RULE_removeRoleStatementBIF = 85;
MezDSLParser.RULE_forcePasswordResetStatementBIF = 86;
MezDSLParser.RULE_persistenceBIFStatement = 87;
MezDSLParser.RULE_systemBIFStatement = 88;
MezDSLParser.RULE_emailNamedAttachment = 89;
MezDSLParser.RULE_emailAttachment = 90;
MezDSLParser.RULE_assignStatement = 91;
MezDSLParser.RULE_expression = 92;
MezDSLParser.RULE_orExpression = 93;
MezDSLParser.RULE_andExpression = 94;
MezDSLParser.RULE_equalityExpression = 95;
MezDSLParser.RULE_comparisonExpression = 96;
MezDSLParser.RULE_comparisonOperator = 97;
MezDSLParser.RULE_equalityOperator = 98;
MezDSLParser.RULE_addExpression = 99;
MezDSLParser.RULE_addOperator = 100;
MezDSLParser.RULE_multExpression = 101;
MezDSLParser.RULE_multOperator = 102;
MezDSLParser.RULE_simpleExpression = 103;
MezDSLParser.RULE_atomicExpression = 104;
MezDSLParser.RULE_literalExpression = 105;
MezDSLParser.RULE_enumValueExpression = 106;
MezDSLParser.RULE_enumValueExpressionEntry = 107;
MezDSLParser.RULE_functionCall = 108;
MezDSLParser.RULE_valueExpression = 109;
MezDSLParser.RULE_memberAccess = 110;
MezDSLParser.RULE_memberFunction = 111;
MezDSLParser.RULE_memberAttribute = 112;
MezDSLParser.RULE_accessExpression = 113;
MezDSLParser.RULE_incrementExpression = 114;
MezDSLParser.RULE_decrementExpression = 115;
MezDSLParser.RULE_bifExpression = 116;
MezDSLParser.RULE_instanceBIFExpression = 117;
MezDSLParser.RULE_jsonBIFStatement = 118;
MezDSLParser.RULE_jsonExpressionBIF = 119;
MezDSLParser.RULE_batchCreateExpressonBIF = 120;
MezDSLParser.RULE_collectionsExpressionBIF = 121;
MezDSLParser.RULE_systemBIFExpression = 122;
MezDSLParser.RULE_apiBIFExpression = 123;
MezDSLParser.RULE_apiBIFStatement = 124;
MezDSLParser.RULE_mathBIFExpression = 125;
MezDSLParser.RULE_stringsBIFExpression = 126;
MezDSLParser.RULE_stringsConcatBIF = 127;
MezDSLParser.RULE_stringsLengthBIF = 128;
MezDSLParser.RULE_stringsSplitBIF = 129;
MezDSLParser.RULE_stringBIFExpression = 130;
MezDSLParser.RULE_stringTranslateBIF = 131;
MezDSLParser.RULE_stringConcatBIF = 132;
MezDSLParser.RULE_stringEndsWithBIF = 133;
MezDSLParser.RULE_stringIndexOfBIF = 134;
MezDSLParser.RULE_stringJoinBIF = 135;
MezDSLParser.RULE_stringLengthBIF = 136;
MezDSLParser.RULE_stringLowerBIF = 137;
MezDSLParser.RULE_stringSplitBIF = 138;
MezDSLParser.RULE_stringStartsWithBIF = 139;
MezDSLParser.RULE_stringSubstringBIF = 140;
MezDSLParser.RULE_stringUpperBIF = 141;
MezDSLParser.RULE_stringRegexMatchBIF = 142;
MezDSLParser.RULE_stringRegexReplaceFirstBIF = 143;
MezDSLParser.RULE_stringRegexReplaceAllBIF = 144;
MezDSLParser.RULE_stringRegexFindBIF = 145;
MezDSLParser.RULE_stringReplaceAllBIF = 146;
MezDSLParser.RULE_stringUrlEncodeBIF = 147;
MezDSLParser.RULE_stringUrlDecodeBIF = 148;
MezDSLParser.RULE_jsonFromCsvLineBIF = 149;
MezDSLParser.RULE_jsonFromCsvBIF = 150;
MezDSLParser.RULE_dateBIFExpression = 151;
MezDSLParser.RULE_dateAddDaysBIF = 152;
MezDSLParser.RULE_dateAddMonthsBIF = 153;
MezDSLParser.RULE_dateAddSecondsBIF = 154;
MezDSLParser.RULE_dateDaysBetweenBIF = 155;
MezDSLParser.RULE_dateExtractBIF = 156;
MezDSLParser.RULE_dateMonthsBetweenBIF = 157;
MezDSLParser.RULE_dateSecondsBetweenBIF = 158;
MezDSLParser.RULE_dateNowBIF = 159;
MezDSLParser.RULE_dateTodayBIF = 160;
MezDSLParser.RULE_dateFromStringBIF = 161;
MezDSLParser.RULE_dateTimeFromStringBIF = 162;
MezDSLParser.RULE_dateFromISOStringBIF = 163;
MezDSLParser.RULE_dateTimeFromISOStringBIF = 164;
MezDSLParser.RULE_dateTimeFromLongBIF = 165;
MezDSLParser.RULE_integerBIFExpression = 166;
MezDSLParser.RULE_integerFromStringBIF = 167;
MezDSLParser.RULE_decimalBIFExpression = 168;
MezDSLParser.RULE_decimalFromStringBIF = 169;
MezDSLParser.RULE_longBIFExpression = 170;
MezDSLParser.RULE_longFromStringBIF = 171;
MezDSLParser.RULE_uuidBIFExpression = 172;
MezDSLParser.RULE_uuidFromStringBIF = 173;
MezDSLParser.RULE_blobBIFExpression = 174;
MezDSLParser.RULE_blobFromStringBIF = 175;
MezDSLParser.RULE_blobWrapperFromStringBIF = 176;
MezDSLParser.RULE_blobToStringBIF = 177;
MezDSLParser.RULE_heliumBIFExpression = 178;
MezDSLParser.RULE_heliumGetPlatformBIF = 179;
MezDSLParser.RULE_sqlBIFExpression = 180;
MezDSLParser.RULE_sqlBIFParam = 181;
MezDSLParser.RULE_persistenceBIFExpression = 182;
MezDSLParser.RULE_simpleSelectorBIF = 183;
MezDSLParser.RULE_selectorBIF = 184;
MezDSLParser.RULE_primitiveType = 185;
// tslint:disable:no-trailing-whitespace
MezDSLParser.ruleNames = [
    "script", "scriptContent", "persistence", "persistenceElement", "unit",
    "customObject", "simpleObject", "trigger", "beforeCreate", "afterCreate",
    "beforeUpdate", "afterUpdate", "beforeDelete", "afterDelete", "persistentObject",
    "objectAttribute", "relationship", "primitiveAttribute", "enumAttribute",
    "enumeration", "enumValue", "multiplicityAnnotation", "objectAnnotation",
    "attributeAnnotation", "functionAnnotation", "receiveSMSAnnotation", "unitTestAnnotation",
    "ussdAnnotation", "scheduledAnnotation", "inviteUserAnnotation", "roleNameAnnotation",
    "onPaymentUpdateAnnotation", "onScheduledFunctionResultUpdateAnnotation",
    "onSmsResultUpdateAnnotation", "onPaymentStatusRequestResultUpdateAnnotation",
    "postAnnotation", "getAnnotation", "putAnnotation", "deleteAnnotation",
    "responseExpandAnnotation", "responseExcludeAnnotation", "roleAnnotation",
    "restrictedObjectAnnotation", "restrictedAttributeAnnotation", "notTrackedAnnotation",
    "validatorAnnotation", "validator", "atomicValidator", "relationshipMultiplicity",
    "variableDeclaration", "variableDeclareInit", "variableType", "functionDefinition",
    "codeBlock", "codeBlockContent", "functionSignature", "specialFunctionName",
    "typeName", "parameter", "statement", "returnStatement", "simpleStatement",
    "incrementStatement", "decrementStatement", "complexStatement", "forEach",
    "forLoop", "forLoopParams", "forLoopInitialCondition", "forLoopCondition",
    "forLoopPostLoop", "forLoopConditionOperator", "tryStatement", "catchPart",
    "finallyPart", "ifStatement", "elseIfPart", "elsePart", "throwStatement",
    "bifStatement", "assertBIFStatement", "assertBIF", "instanceBIFStatement",
    "collectionsStatementBIF", "notificationStatementBIF", "removeRoleStatementBIF",
    "forcePasswordResetStatementBIF", "persistenceBIFStatement", "systemBIFStatement",
    "emailNamedAttachment", "emailAttachment", "assignStatement", "expression",
    "orExpression", "andExpression", "equalityExpression", "comparisonExpression",
    "comparisonOperator", "equalityOperator", "addExpression", "addOperator",
    "multExpression", "multOperator", "simpleExpression", "atomicExpression",
    "literalExpression", "enumValueExpression", "enumValueExpressionEntry",
    "functionCall", "valueExpression", "memberAccess", "memberFunction", "memberAttribute",
    "accessExpression", "incrementExpression", "decrementExpression", "bifExpression",
    "instanceBIFExpression", "jsonBIFStatement", "jsonExpressionBIF", "batchCreateExpressonBIF",
    "collectionsExpressionBIF", "systemBIFExpression", "apiBIFExpression",
    "apiBIFStatement", "mathBIFExpression", "stringsBIFExpression", "stringsConcatBIF",
    "stringsLengthBIF", "stringsSplitBIF", "stringBIFExpression", "stringTranslateBIF",
    "stringConcatBIF", "stringEndsWithBIF", "stringIndexOfBIF", "stringJoinBIF",
    "stringLengthBIF", "stringLowerBIF", "stringSplitBIF", "stringStartsWithBIF",
    "stringSubstringBIF", "stringUpperBIF", "stringRegexMatchBIF", "stringRegexReplaceFirstBIF",
    "stringRegexReplaceAllBIF", "stringRegexFindBIF", "stringReplaceAllBIF",
    "stringUrlEncodeBIF", "stringUrlDecodeBIF", "jsonFromCsvLineBIF", "jsonFromCsvBIF",
    "dateBIFExpression", "dateAddDaysBIF", "dateAddMonthsBIF", "dateAddSecondsBIF",
    "dateDaysBetweenBIF", "dateExtractBIF", "dateMonthsBetweenBIF", "dateSecondsBetweenBIF",
    "dateNowBIF", "dateTodayBIF", "dateFromStringBIF", "dateTimeFromStringBIF",
    "dateFromISOStringBIF", "dateTimeFromISOStringBIF", "dateTimeFromLongBIF",
    "integerBIFExpression", "integerFromStringBIF", "decimalBIFExpression",
    "decimalFromStringBIF", "longBIFExpression", "longFromStringBIF", "uuidBIFExpression",
    "uuidFromStringBIF", "blobBIFExpression", "blobFromStringBIF", "blobWrapperFromStringBIF",
    "blobToStringBIF", "heliumBIFExpression", "heliumGetPlatformBIF", "sqlBIFExpression",
    "sqlBIFParam", "persistenceBIFExpression", "simpleSelectorBIF", "selectorBIF",
    "primitiveType",
];
MezDSLParser._LITERAL_NAMES = [
    undefined, "'unit'", "';'", "'object'", "'{'", "'}'", "'persistent'",
    "'enum'", "','", "'@'", "'('", "')'", "'validator'", "'foreach'", "':'",
    "'for'", "'try'", "'catch'", "'finally'", "'if'", "'else'", "'throw'",
    "'Assert'", "'.'", "'forcePasswordReset'", "'removeRole'", "'invite'",
    "'pay'", "'payWithRef'", "'notify'", "'jsonGet'", "'jsonPut'", "'jsonRemove'",
    "'jsonContains'", "'jsonKeys'", "'clear'", "'append'", "'prepend'", "'sortAsc'",
    "'sortDesc'", "'add'", "'remove'", "'pop'", "'drop'", "'length'", "'first'",
    "'last'", "'get'", "'select'", "'save'", "'new'", "'fromCsv'", "'fromCsvLine'",
    "'read'", "'delete'", "'all'", "'user'", "'equals'", "'empty'", "'between'",
    "'lessThan'", "'lessThanOrEqual'", "'greaterThan'", "'greaterOrEqual'",
    "'attributeIn'", "'relationshipIn'", "'contains'", "'beginsWith'", "'endsWith'",
    "'notLessOrEqual'", "'notGreaterOr'", "'notEquals'", "'notEmpty'", "'notBetween'",
    "'notContains'", "'notBeginsWith'", "'notEndsWith'", "'notAttributeIn'",
    "'notRelationshipIn'", "'and'", "'union'", "'diff'", "'intersect'", "'Mez:alert'",
    "'Mez:alertWarn'", "'Mez:alertError'", "'Mez:error'", "'Mez:log'", "'Mez:warn'",
    "'Mez:now'", "'Mez:today'", "'Mez:sms'", "'MezSms:send'", "'MezSms:endConversation'",
    "'MezSms:getConversationId'", "'Mez:email'", "'Mez:emailAttach'", "'Mez:emailCsv'",
    "'Mez:collectionCsv'", "'Mez:userRole'", "'Mez:requestPaymentStatus'",
    "'Mez:encrypt'", "'Mez:decrypt'", "'Mez:createCryptoKey'", "'Mez:cbcEncrypt'",
    "'Mez:cbcDecrypt'", "'Mez:downloadReport'", "'Mez:generateReport'", "'Mez:downloadFile'",
    "'api:get'", "'api:post'", "'api:delete'", "'api:put'", "'api:setStatusCode'",
    "'Mez:createBatch'", "'isEqual'", "'isTrue'", "'isFalse'", "'isNull'",
    "'isNotNull'", "'isGreaterOrEqual'", "'isGreater'", "'isLessOrEqual'",
    "'isLess'", "'isBoth'", "'isEither'", "'isNotEqual'", "'beforeCreate'",
    "'afterCreate'", "'beforeUpdate'", "'afterUpdate'", "'beforeDelete'",
    "'afterDelete'", "'return'", "'ReceiveSms'", "'Test'", "'USSD'", "'Role'",
    "'Restrict'", "'Scheduled'", "'InviteUser'", "'RoleName'", "'OnPaymentUpdate'",
    "'OnScheduledFunctionResultUpdate'", "'OnSmsResultUpdate'", "'OnPaymentStatusRequestResultUpdate'",
    "'NotTracked'", "'POST'", "'GET'", "'PUT'", "'DELETE'", "'ResponseExpand'",
    "'ResponseExclude'", "'Math:pow'", "'Math:sqrt'", "'Math:random'", "'Math:floor'",
    "'Math:ceil'", "'Math:round'", "'Strings:concat'", "'Strings:length'",
    "'Strings:split'", "'String:concat'", "'String:endsWith'", "'String:indexOf'",
    "'String:join'", "'String:length'", "'String:lower'", "'String:upper'",
    "'String:split'", "'String:startsWith'", "'String:substring'", "'String:translate'",
    "'String:regexMatch'", "'String:regexReplaceFirst'", "'String:regexReplaceAll'",
    "'String:regexFind'", "'String:replaceAll'", "'String:urlEncode'", "'String:urlDecode'",
    "'Json:fromCsvLine'", "'Json:fromCsv'", "'Date:fromString'", "'Date:fromISOString'",
    "'Date:fromTimeString'", "'Date:fromISOTimeString'", "'Date:fromUnixTimestamp'",
    "'Date:now'", "'Date:today'", "'Date:addDays'", "'Date:addMonths'", "'Date:addSeconds'",
    "'Date:daysBetween'", "'Date:extract'", "'Date:monthsBetween'", "'Date:secondsBetween'",
    "'Integer:fromString'", "'Decimal:fromString'", "'Long:fromString'", "'Uuid:fromString'",
    "'Blob:fromString'", "'Blob:wrapFromString'", "'Blob:toString'", "'Helium:platform'",
    "'notnull'", "'regex'", "'minval'", "'maxval'", "'minlen'", "'maxlen'",
    "'OneToOne'", "'ManyToMany'", "'ManyToOne'", "'OneToMany'", "'via'", "'int'",
    "'decimal'", "'bigint'", "'uuid'", "'blob'", "'bool'", "'string'", "'void'",
    "'date'", "'datetime'", "'json'", "'jsonarray'", undefined, undefined,
    "'['", "']'", "'=='", undefined, "'<'", "'<='", "'>'", "'>='", "'||'",
    "'&&'", "'++'", "'--'", "'+'", "'-'", "'*'", "'/'", "'%'", "'\"'", "'/*'",
    "'*/'", "'/%'", "'%/'", "'sql:execute'", "'sql:query'", "'DEFAULT'", "'null'",
    "'true'", "'false'",
];
MezDSLParser._SYMBOLIC_NAMES = [
    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, undefined, undefined, undefined, undefined,
    undefined, undefined, undefined, "FORCE_PASSWORD_RESET", "REMOVE_ROLE",
    "OBJECT_INVITE", "OBJECT_PAY_RECIPIENT", "OBJECT_PAY_RECIPIENT_WITH_REF",
    "NOTIFY", "JSONGET", "JSONPUT", "JSONREMOVE", "JSONCONTAINS", "JSONKEYS",
    "CLEAR", "APPEND", "PREPEND", "SORTASC", "SORTDESC", "ADD", "REMOVE",
    "POP", "DROP", "LENGTH", "FIRST", "LAST", "GET", "COLLECTION_SELECT",
    "SAVE", "NEW", "FROM_CSV", "FROM_CSV_LINE", "READ", "DELETE", "ALL", "USERSELECTOR",
    "EQUALS", "EMPTY", "BETWEEN", "LESSTHAN", "LESSOREQUAL", "GREATERTHAN",
    "GREATEROREQAUL", "ATTIN", "RELIN", "CONTAINS", "BEGINSWITH", "ENDSWITH",
    "NOTLTE", "NOTGTE", "NOTEQU", "NOTEMPTY", "NOTBETWEEN", "NOTCONTAINS",
    "NOTBEGINSWITH", "NOTENDSWITH", "NOTATTIN", "NOTRELIN", "ANDSELECTOR",
    "UNION", "DIFF", "INTERSECT", "ALERT", "ALERT_WARN", "ALERT_ERROR", "ERROR",
    "LOG", "WARN", "NOW", "TODAY", "SMS", "SMS_SEND", "SMS_END_CONVERSATION",
    "SMS_GET_CONVERSATION_ID", "EMAIL", "EMAIL_ATTACH", "EMAIL_CSV", "COLLECTION_CSV",
    "USER_ROLE", "PAYMENT_STATUS_REQUEST", "ENCRYPT", "DECRYPT", "CREATE_CRYPTO_KEY",
    "CBC_ENCRYPT", "CBC_DECRYPT", "DOWNLOAD_REPORT", "GENERATE_REPORT", "DOWNLOAD_FILE",
    "API_GET", "API_POST", "API_DELETE", "API_PUT", "API_SET_STATUS_CODE",
    "CREATE_BATCH", "IS_EQUAL", "IS_TRUE", "IS_FALSE", "IS_NULL", "IS_NOT_NULL",
    "IS_GTE", "IS_GT", "IS_LTE", "IS_LT", "IS_BOTH", "IS_EITHER", "IS_NOTEQUAL",
    "BEFORE_CREATE", "AFTER_CREATE", "BEFORE_UPDATE", "AFTER_UPDATE", "BEFORE_DELETE",
    "AFTER_DELETE", "RETURN", "RECEIVESMS", "TEST", "USSD", "ROLE", "RESTRICT",
    "SCHEDULED", "INVITEUSER", "ROLENAME", "ONPAYMENTUPDATE", "ONSCHEDULEDFUNCTIONRESULTUPDATE",
    "ONSMSRESULTUPDATE", "ONPAYMENTSTATUSREQUESTRESULTUPDATE", "NOT_TRACKED",
    "POST_API", "GET_API", "PUT_API", "DELETE_API", "RESPONSE_EXPAND", "RESPONSE_EXCLUDE",
    "POW", "SQRT", "RANDOM", "FLOOR", "CEILING", "ROUND", "STRINGS_CONCAT",
    "STRINGS_LENGTH", "STRINGS_SPLIT", "STRING_CONCAT", "STRING_ENDS_WITH",
    "STRING_INDEX_OF", "STRING_JOIN", "STRING_LENGTH", "STRING_LOWER", "STRING_UPPER",
    "STRING_SPLIT", "STRING_STARTS_WITH", "STRING_SUBSTRING", "STRING_TRANSLATE",
    "STRING_REGEX_MATCH", "STRING_REGEX_REPLACE_FIRST", "STRING_REGEX_REPLACE_ALL",
    "STRING_REGEX_FIND", "STRING_REPLACE_ALL", "STRING_URL_ENCODE", "STRING_URL_DECODE",
    "JSON_FROM_CSV_LINE", "JSON_FROM_CSV", "DATE_FROM_STRING", "DATE_FROM_ISO_STRING",
    "DATE_TIME_FROM_STRING", "DATE_TIME_FROM_ISO_STRING", "DATE_TIME_FROM_LONG",
    "DATE_NOW", "DATE_TODAY", "DATE_ADD_DAYS", "DATE_ADD_MONTHS", "DATE_ADD_SECONDS",
    "DATE_DAYS_BETWEEN", "DATE_EXTRACT", "DATE_MONTHS_BETWEEN", "DATE_SECONDS_BETWEEN",
    "INTEGER_FROM_STRING", "DECIMAL_FROM_STRING", "LONG_FROM_STRING", "UUID_FROM_STRING",
    "BLOB_FROM_STRING", "BLOB_WRAPPER_FROM_STRING", "BLOB_TO_STRING", "HELIUM_GET_PLATFORM",
    "NOTNULL", "REGEX", "MINVAL", "MAXVAL", "MINLEN", "MAXLEN", "ONETOONE",
    "MANYTOMANY", "MANYTOONE", "ONETOMANY", "VIA", "INT", "DECIMAL", "LONG",
    "UUID", "BLOB", "BOOL", "STRING", "VOID", "DATE", "DATETIME", "JSON",
    "JSONARRAY", "ASSIGN", "COL", "LCOL", "RCOL", "EQU", "NEQU", "LT", "LTE",
    "GT", "GTE", "OR", "AND", "INC", "DEC", "PLUS", "MINUS", "MULT", "DIV",
    "MOD", "QUOTE", "LMULTI", "RMULTI", "LSTR_BLOCK", "RSTR_BLOCK", "SQL_EXECUTE",
    "SQL_QUERY", "DEFAULT", "NULL", "TRUE", "FALSE", "ENUM_ID", "ID", "DEC_LITERAL",
    "INT_LITERAL", "LONG_LITERAL", "STR_LITERAL", "STR_BLOCK", "NEWLINE",
    "WHITESPACE", "ML_COMMENT", "SL_COMMENT", "SCRIPT", "PERSISTENCE", "UNIT",
    "OBJECT", "SELECTOR", "PERSISTENT_OBJECT", "PERS_SELECTOR", "RELATIONSHIP",
    "ENUMERATION", "PRIMITIVE_ATTRIBUTE", "ENUMERATION_ATTRIBUTE", "ENUM_VALUE",
    "VALIDATOR", "VARIABLE_DECL", "FUNCTION_DEF", "CODEBLOCK", "FUNCTION_SIGNATURE",
    "TOKEN_SPECIAL_FUNCTION_SIGNATURE", "VALIDATOR_ANNOTATION", "VARIABLE_ACCESS",
    "ATTRIBUTE_ACCESS", "FUNCTION_ACCESS", "UNIT_VARIABLE_ACCESS", "UNIT_ATTRIBUTE_ACCESS",
    "INSTANCE_BIF", "TOKEN_OBJECT_PAY_RECIPIENT", "TOKEN_OBJECT_PAY_REF_RECIPIENT",
    "TOKEN_OBJECT_INVITE", "ENUM_ACCESS", "ENUM_ACCESS_ENTRY", "ASSIGNMENT",
    "FUNC_CALL", "TOKEN_SPECIAL_FUNCTION_CALL", "IF_STMT", "ELSEIF_PART",
    "ELSE_PART", "TRY_STMT", "TRY_PART", "CATCH_PART", "FINALLY_PART", "THROW",
    "FOR_EACH", "FOR_LOOP", "FOR_INIT", "FOR_COMP", "FOR_POST", "PERS_BIF",
    "NEG_EXP", "INC_EXP", "DEC_EXP", "VARINIT", "EMAIL_ATTACHMENT", "TOKEN_COLLECTION_SELECT",
    "EMAIL_ATTACHMENT_WITH_NAME", "EMAIL_WITH_ATTACHMENTS", "SQL_PARAM", "TOKEN_JSON_GET",
    "TOKEN_JSON_PUT", "TOKEN_JSON_REMOVE", "TOKEN_JSON_CONTAINS", "TOKEN_JSON_KEYS",
    "TOKEN_CREATE_BATCH",
];
MezDSLParser.VOCABULARY = new VocabularyImpl_1.VocabularyImpl(MezDSLParser._LITERAL_NAMES, MezDSLParser._SYMBOLIC_NAMES, []);
MezDSLParser._serializedATNSegments = 5;
MezDSLParser._serializedATNSegment0 = "\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\u014B\u09B2\x04" +
    "\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
    "\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
    "\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
    "\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17" +
    "\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C" +
    "\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04" +
    "#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t" +
    "+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
    "4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
    "=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
    "F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
    "O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
    "X\tX\x04Y\tY\x04Z\tZ\x04[\t[\x04\\\t\\\x04]\t]\x04^\t^\x04_\t_\x04`\t" +
    "`\x04a\ta\x04b\tb\x04c\tc\x04d\td\x04e\te\x04f\tf\x04g\tg\x04h\th\x04" +
    "i\ti\x04j\tj\x04k\tk\x04l\tl\x04m\tm\x04n\tn\x04o\to\x04p\tp\x04q\tq\x04" +
    "r\tr\x04s\ts\x04t\tt\x04u\tu\x04v\tv\x04w\tw\x04x\tx\x04y\ty\x04z\tz\x04" +
    "{\t{\x04|\t|\x04}\t}\x04~\t~\x04\x7F\t\x7F\x04\x80\t\x80\x04\x81\t\x81" +
    "\x04\x82\t\x82\x04\x83\t\x83\x04\x84\t\x84\x04\x85\t\x85\x04\x86\t\x86" +
    "\x04\x87\t\x87\x04\x88\t\x88\x04\x89\t\x89\x04\x8A\t\x8A\x04\x8B\t\x8B" +
    "\x04\x8C\t\x8C\x04\x8D\t\x8D\x04\x8E\t\x8E\x04\x8F\t\x8F\x04\x90\t\x90" +
    "\x04\x91\t\x91\x04\x92\t\x92\x04\x93\t\x93\x04\x94\t\x94\x04\x95\t\x95" +
    "\x04\x96\t\x96\x04\x97\t\x97\x04\x98\t\x98\x04\x99\t\x99\x04\x9A\t\x9A" +
    "\x04\x9B\t\x9B\x04\x9C\t\x9C\x04\x9D\t\x9D\x04\x9E\t\x9E\x04\x9F\t\x9F" +
    "\x04\xA0\t\xA0\x04\xA1\t\xA1\x04\xA2\t\xA2\x04\xA3\t\xA3\x04\xA4\t\xA4" +
    "\x04\xA5\t\xA5\x04\xA6\t\xA6\x04\xA7\t\xA7\x04\xA8\t\xA8\x04\xA9\t\xA9" +
    "\x04\xAA\t\xAA\x04\xAB\t\xAB\x04\xAC\t\xAC\x04\xAD\t\xAD\x04\xAE\t\xAE" +
    "\x04\xAF\t\xAF\x04\xB0\t\xB0\x04\xB1\t\xB1\x04\xB2\t\xB2\x04\xB3\t\xB3" +
    "\x04\xB4\t\xB4\x04\xB5\t\xB5\x04\xB6\t\xB6\x04\xB7\t\xB7\x04\xB8\t\xB8" +
    "\x04\xB9\t\xB9\x04\xBA\t\xBA\x04\xBB\t\xBB\x03\x02\x06\x02\u0178\n\x02" +
    "\r\x02\x0E\x02\u0179\x03\x03\x03\x03\x05\x03\u017E\n\x03\x03\x04\x03\x04" +
    "\x03\x05\x03\x05\x03\x05\x05\x05\u0185\n\x05\x03\x06\x03\x06\x03\x06\x03" +
    "\x06\x03\x06\x03\x06\x03\x06\x03\x06\x07\x06\u018F\n\x06\f\x06\x0E\x06" +
    "\u0192\v\x06\x03\x06\x06\x06\u0195\n\x06\r\x06\x0E\x06\u0196\x03\x06\x03" +
    "\x06\x03\x07\x03\x07\x05\x07\u019D\n\x07\x03\b\x03\b\x03\b\x03\b\x03\b" +
    "\x03\b\x03\b\x07\b\u01A6\n\b\f\b\x0E\b\u01A9\v\b\x03\b\x03\b\x03\b\x07" +
    "\b\u01AE\n\b\f\b\x0E\b\u01B1\v\b\x03\b\x07\b\u01B4\n\b\f\b\x0E\b\u01B7" +
    "\v\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\u01C1\n\t\x03" +
    "\n\x03\n\x03\n\x03\v\x03\v\x03\v\x03\f\x03\f\x03\f\x03\r\x03\r\x03\r\x03" +
    "\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03\x10\x06\x10\u01D6\n\x10" +
    "\r\x10\x0E\x10\u01D7\x03\x10\x05\x10\u01DB\n\x10\x03\x10\x03\x10\x03\x10" +
    "\x03\x10\x05\x10\u01E1\n\x10\x03\x11\x03\x11\x05\x11\u01E5\n\x11\x03\x12" +
    "\x03\x12\x03\x12\x03\x12\x03\x12\x05\x12\u01EC\n\x12\x03\x12\x03\x12\x03" +
    "\x13\x07\x13\u01F1\n\x13\f\x13\x0E\x13\u01F4\v\x13\x03\x13\x03\x13\x03" +
    "\x13\x03\x13\x03\x14\x07\x14\u01FB\n\x14\f\x14\x0E\x14\u01FE\v\x14\x03" +
    "\x14\x03\x14\x03\x14\x03\x14\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03" +
    "\x15\x03\x15\x07\x15\u020B\n\x15\f\x15\x0E\x15\u020E\v\x15\x03\x15\x03" +
    "\x15\x03\x16\x03\x16\x03\x16\x03\x17\x03\x17\x03\x17\x03\x18\x03\x18\x03" +
    "\x18\x03\x18\x05\x18\u021C\n\x18\x03\x19\x03\x19\x03\x19\x05\x19\u0221" +
    "\n\x19\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A" +
    "\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A\x03\x1A" +
    "\x05\x1A\u0234\n\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1C\x03" +
    "\x1C\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1E\x03\x1E\x03\x1E\x03" +
    "\x1E\x03\x1E\x03\x1F\x03\x1F\x03 \x03 \x03!\x03!\x03\"\x03\"\x03#\x03" +
    "#\x03$\x03$\x03%\x03%\x03%\x03%\x03%\x03&\x03&\x03&\x03&\x03&\x03\'\x03" +
    "\'\x03\'\x03\'\x03\'\x03(\x03(\x03(\x03(\x03(\x03)\x03)\x03)\x03)\x03" +
    ")\x07)\u026C\n)\f)\x0E)\u026F\v)\x03)\x03)\x03*\x03*\x03*\x03*\x03*\x07" +
    "*\u0278\n*\f*\x0E*\u027B\v*\x03*\x03*\x03+\x03+\x03+\x03+\x03+\x03,\x03" +
    ",\x03,\x03,\x03,\x03,\x03,\x03-\x03-\x03-\x03-\x03-\x07-\u0290\n-\f-\x0E" +
    "-\u0293\v-\x03-\x03-\x03.\x03.\x03/\x03/\x03/\x03/\x03/\x030\x030\x03" +
    "0\x030\x030\x030\x030\x060\u02A5\n0\r0\x0E0\u02A6\x030\x030\x031\x031" +
    "\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x03" +
    "1\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x03" +
    "1\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x031\x03" +
    "1\x031\x031\x031\x031\x031\x031\x031\x051\u02DE\n1\x032\x032\x033\x03" +
    "3\x053\u02E4\n3\x033\x033\x034\x034\x034\x034\x034\x035\x035\x035\x05" +
    "5\u02F0\n5\x036\x076\u02F3\n6\f6\x0E6\u02F6\v6\x036\x036\x036\x037\x03" +
    "7\x077\u02FD\n7\f7\x0E7\u0300\v7\x037\x037\x038\x038\x038\x038\x038\x03" +
    "8\x038\x038\x038\x038\x038\x058\u030F\n8\x039\x039\x059\u0313\n9\x039" +
    "\x039\x039\x039\x039\x039\x039\x039\x079\u031D\n9\f9\x0E9\u0320\v9\x03" +
    "9\x039\x059\u0324\n9\x039\x039\x059\u0328\n9\x039\x039\x039\x039\x039" +
    "\x039\x039\x039\x079\u0332\n9\f9\x0E9\u0335\v9\x039\x039\x059\u0339\n" +
    "9\x059\u033B\n9\x03:\x03:\x03;\x03;\x03;\x05;\u0342\n;\x03<\x03<\x05<" +
    "\u0346\n<\x03<\x03<\x03<\x03=\x03=\x05=\u034D\n=\x03>\x03>\x05>\u0351" +
    "\n>\x03?\x03?\x03?\x03?\x03?\x03?\x05?\u0359\n?\x03@\x03@\x03@\x03A\x03" +
    "A\x03A\x03B\x03B\x03B\x03B\x05B\u0365\nB\x03C\x03C\x03C\x03C\x03C\x03" +
    "C\x03C\x03C\x03D\x03D\x03D\x03D\x03E\x03E\x05E\u0375\nE\x03E\x03E\x05" +
    "E\u0379\nE\x03E\x03E\x05E\u037D\nE\x03E\x03E\x03F\x03F\x05F\u0383\nF\x03" +
    "G\x03G\x03G\x03G\x03H\x03H\x03I\x03I\x05I\u038D\nI\x03J\x03J\x03J\x05" +
    "J\u0392\nJ\x03J\x05J\u0395\nJ\x03K\x03K\x03K\x03K\x03K\x03K\x03L\x03L" +
    "\x03L\x03M\x03M\x03M\x03M\x03M\x03M\x07M\u03A6\nM\fM\x0EM\u03A9\vM\x03" +
    "M\x05M\u03AC\nM\x03N\x03N\x03N\x03N\x03N\x03N\x03N\x03O\x03O\x03O\x03" +
    "P\x03P\x03P\x03Q\x03Q\x03Q\x03Q\x03Q\x03Q\x05Q\u03C1\nQ\x03R\x03R\x03" +
    "R\x03R\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03S\x03" +
    "S\x03S\x03S\x03S\x05S\u042B\nS\x03T\x03T\x03T\x03T\x03T\x03T\x03T\x03" +
    "T\x03T\x03T\x03T\x03T\x03T\x03T\x03T\x05T\u043C\nT\x03T\x03T\x03T\x03" +
    "T\x03T\x03T\x03T\x03T\x03T\x03T\x05T\u0448\nT\x03U\x03U\x03U\x03U\x03" +
    "U\x03U\x03U\x03U\x03U\x03U\x03U\x03U\x03U\x03U\x03U\x03U\x05U\u045A\n" +
    "U\x03U\x03U\x03U\x03U\x05U\u0460\nU\x03U\x03U\x03U\x03U\x03U\x03U\x03" +
    "U\x03U\x03U\x03U\x03U\x03U\x03U\x05U\u046F\nU\x03V\x03V\x03V\x03V\x03" +
    "V\x03V\x03V\x03V\x03V\x03V\x03V\x03W\x03W\x03W\x03W\x03X\x03X\x03X\x03" +
    "X\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x03Y\x05Y\u0490" +
    "\nY\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03" +
    "Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x05" +
    "Z\u04AD\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x05Z\u04B5\nZ\x03Z\x03Z\x03Z" +
    "\x03Z\x03Z\x03Z\x05Z\u04BD\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z" +
    "\x03Z\x03Z\x05Z\u04C9\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z" +
    "\x03Z\x03Z\x05Z\u04D6\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z" +
    "\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x07Z\u04E9\nZ\fZ\x0EZ\u04EC\v" +
    "Z\x03Z\x03Z\x05Z\u04F0\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03" +
    "Z\x03Z\x03Z\x03Z\x06Z\u04FE\nZ\rZ\x0EZ\u04FF\x03Z\x03Z\x05Z\u0504\nZ\x03" +
    "Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03" +
    "Z\x05Z\u0515\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03" +
    "Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x05Z\u052E" +
    "\nZ\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x03Z\x05Z\u0539\nZ\x03Z\x03" +
    "Z\x05Z\u053D\nZ\x03[\x03[\x03[\x03[\x03[\x03[\x03[\x03\\\x03\\\x03\\\x03" +
    "]\x03]\x03]\x03]\x03^\x03^\x03_\x03_\x03_\x07_\u0552\n_\f_\x0E_\u0555" +
    "\v_\x03`\x03`\x03`\x07`\u055A\n`\f`\x0E`\u055D\v`\x03a\x03a\x03a\x03a" +
    "\x07a\u0563\na\fa\x0Ea\u0566\va\x03b\x03b\x03b\x03b\x07b\u056C\nb\fb\x0E" +
    "b\u056F\vb\x03c\x03c\x03d\x03d\x03e\x03e\x03e\x03e\x07e\u0579\ne\fe\x0E" +
    "e\u057C\ve\x03f\x03f\x03g\x03g\x03g\x03g\x07g\u0584\ng\fg\x0Eg\u0587\v" +
    "g\x03h\x03h\x03i\x03i\x03i\x05i\u058E\ni\x03j\x03j\x03j\x03j\x03j\x03" +
    "j\x03j\x03j\x03j\x03j\x03j\x05j\u059B\nj\x03k\x03k\x03l\x03l\x03l\x03" +
    "l\x03l\x03l\x03l\x07l\u05A6\nl\fl\x0El\u05A9\vl\x05l\u05AB\nl\x03l\x05" +
    "l\u05AE\nl\x03m\x03m\x03n\x03n\x05n\u05B4\nn\x03n\x03n\x03n\x03n\x03n" +
    "\x07n\u05BB\nn\fn\x0En\u05BE\vn\x05n\u05C0\nn\x03n\x03n\x03n\x03n\x05" +
    "n\u05C6\nn\x03n\x03n\x03n\x03n\x03n\x07n\u05CD\nn\fn\x0En\u05D0\vn\x05" +
    "n\u05D2\nn\x03n\x05n\u05D5\nn\x03o\x03o\x05o\u05D9\no\x03o\x03o\x03o\x07" +
    "o\u05DE\no\fo\x0Eo\u05E1\vo\x03p\x03p\x05p\u05E5\np\x03q\x03q\x03q\x07" +
    "q\u05EA\nq\fq\x0Eq\u05ED\vq\x03q\x03q\x03r\x03r\x03s\x03s\x03s\x03s\x03" +
    "s\x03s\x03s\x03s\x03s\x03s\x03s\x03s\x05s\u05FF\ns\x03t\x03t\x03t\x03" +
    "u\x03u\x03u\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03" +
    "v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x05v\u061B\nv\x03w\x03w\x03" +
    "w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03" +
    "w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x03w\x05w\u0637\nw\x03x\x03" +
    "x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03x\x03" +
    "x\x05x\u0649\nx\x03y\x03y\x03y\x03y\x03y\x03y\x03y\x03y\x03y\x03y\x03" +
    "y\x03y\x07y\u0657\ny\fy\x0Ey\u065A\vy\x03y\x03y\x03y\x03y\x03y\x03y\x03" +
    "y\x03y\x03y\x03y\x03y\x03y\x03y\x05y\u0669\ny\x03z\x03z\x03z\x03z\x03" +
    "z\x03z\x03z\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03" +
    "{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03" +
    "{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03{\x03" +
    "{\x03{\x03{\x03{\x03{\x05{\u069E\n{\x03|\x03|\x03|\x03|\x03|\x03|\x03" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u06B2\n" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u06BF\n" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u06CD" +
    "\n|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u06D6\n|\x03|\x03|\x03|\x03" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u06E3\n|\x03|\x03|\x03|\x03" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03" +
    "|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x03|\x05|\u0700\n|\x03|\x03" +
    "|\x05|\u0704\n|\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03" +
    "}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x03}\x05}\u071A\n}\x03~\x03" +
    "~\x03~\x03~\x03~\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F" +
    "\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F" +
    "\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x03\x7F" +
    "\x03\x7F\x03\x7F\x03\x7F\x03\x7F\x05\x7F\u073E\n\x7F\x03\x7F\x03\x7F\x03" +
    "\x7F\x03\x7F\x03\x7F\x05\x7F\u0745\n\x7F\x03\x80\x03\x80\x03\x80\x05\x80" +
    "\u074A\n\x80\x03\x81\x03\x81\x03\x81\x03\x81\x03\x81\x06\x81\u0751\n\x81" +
    "\r\x81\x0E\x81\u0752\x03\x81\x03\x81\x03\x82\x03\x82\x03\x82\x03\x82\x03" +
    "\x82\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x84\x03" +
    "\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03" +
    "\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03" +
    "\x84\x05\x84\u0777\n\x84\x03\x85\x03\x85\x03\x85\x03\x85\x03\x85\x03\x86" +
    "\x03\x86\x03\x86\x03\x86\x03\x86\x06\x86\u0783\n\x86\r\x86\x0E\x86\u0784" +
    "\x03\x86\x03\x86\x03\x87\x03\x87\x03\x87\x03\x87\x03\x87\x03\x87\x03\x87" +
    "\x03\x88\x03\x88\x03\x88\x03\x88\x03\x88\x03\x88\x03\x88\x03\x89\x03\x89" +
    "\x03\x89\x03\x89\x03\x89\x03\x89\x03\x89\x03\x8A\x03\x8A\x03\x8A\x03\x8A" +
    "\x03\x8A\x03\x8B\x03\x8B\x03\x8B\x03\x8B\x03\x8B\x03\x8C\x03\x8C\x03\x8C" +
    "\x03\x8C\x03\x8C\x03\x8C\x03\x8C\x03\x8D\x03\x8D\x03\x8D\x03\x8D\x03\x8D" +
    "\x03\x8D\x03\x8D\x03\x8E\x03\x8E\x03\x8E\x03\x8E\x03\x8E\x03\x8E\x03\x8E" +
    "\x03\x8E\x03\x8E\x03\x8F\x03\x8F\x03\x8F\x03\x8F\x03\x8F\x03\x90\x03\x90" +
    "\x03\x90\x03\x90\x03\x90\x03\x90\x03\x90\x03\x91\x03\x91\x03\x91\x03\x91" +
    "\x03\x91\x03\x91\x03\x91\x03\x91\x03\x91\x03\x92\x03\x92\x03\x92\x03\x92" +
    "\x03\x92\x03\x92\x03\x92\x03\x92\x03\x92\x03\x93\x03\x93\x03\x93\x03\x93" +
    "\x03\x93\x03\x93\x03\x93\x05\x93\u07E4\n\x93\x03\x93\x03\x93\x03\x94\x03" +
    "\x94\x03\x94\x03\x94\x03\x94\x03\x94\x03\x94\x03\x94\x03\x94\x03\x95\x03" +
    "\x95\x03\x95\x03\x95\x03\x95\x03\x96\x03\x96\x03\x96\x03\x96\x03\x96\x03" +
    "\x97\x03\x97\x03\x97\x03\x97\x03\x97\x03\x97\x03\x97\x03\x98\x03\x98\x03" +
    "\x98\x03\x98\x03\x98\x03\x99\x03\x99\x03\x99\x03\x99\x03\x99\x03\x99\x03" +
    "\x99\x03\x99\x03\x99\x03\x99\x03\x99\x03\x99\x03\x99\x03\x99\x05\x99\u0815" +
    "\n\x99\x03\x9A\x03\x9A\x03\x9A\x03\x9A\x03\x9A\x03\x9A\x03\x9A\x03\x9B" +
    "\x03\x9B\x03\x9B\x03\x9B\x03\x9B\x03\x9B\x03\x9B\x03\x9C\x03\x9C\x03\x9C" +
    "\x03\x9C\x03\x9C\x03\x9C\x03\x9C\x03\x9D\x03\x9D\x03\x9D\x03\x9D\x03\x9D" +
    "\x03\x9D\x03\x9D\x03\x9E\x03\x9E\x03\x9E\x03\x9E\x03\x9E\x03\x9E\x03\x9E" +
    "\x03\x9F\x03\x9F\x03\x9F\x03\x9F\x03\x9F\x03\x9F\x03\x9F\x03\xA0\x03\xA0" +
    "\x03\xA0\x03\xA0\x03\xA0\x03\xA0\x03\xA0\x03\xA1\x03\xA1\x03\xA1\x03\xA1" +
    "\x03\xA2\x03\xA2\x03\xA2\x03\xA2\x03\xA3\x03\xA3\x03\xA3\x03\xA3\x03\xA3" +
    "\x03\xA4\x03\xA4\x03\xA4\x03\xA4\x03\xA4\x03\xA5\x03\xA5\x03\xA5\x03\xA5" +
    "\x03\xA5\x03\xA6\x03\xA6\x03\xA6\x03\xA6\x03\xA6\x03\xA7\x03\xA7\x03\xA7" +
    "\x03\xA7\x03\xA7\x03\xA8\x03\xA8\x03\xA9\x03\xA9\x03\xA9\x03\xA9\x03\xA9" +
    "\x03\xAA\x03\xAA\x03\xAB\x03\xAB\x03\xAB\x03\xAB\x03\xAB\x03\xAC\x03\xAC" +
    "\x03\xAD\x03\xAD\x03\xAD\x03\xAD\x03\xAD\x03\xAE\x03\xAE\x03\xAF\x03\xAF" +
    "\x03\xAF\x03\xAF\x03\xAF\x03\xB0\x03\xB0\x03\xB0\x05\xB0\u0888\n\xB0\x03" +
    "\xB1\x03\xB1\x03\xB1\x03\xB1\x03\xB1\x03\xB2\x03\xB2\x03\xB2\x03\xB2\x03" +
    "\xB2\x03\xB2\x03\xB2\x03\xB2\x03\xB2\x03\xB3\x03\xB3\x03\xB3\x03\xB3\x03" +
    "\xB3\x03\xB4\x03\xB4\x03\xB5\x03\xB5\x03\xB5\x03\xB5\x03\xB6\x03\xB6\x03" +
    "\xB6\x03\xB6\x07\xB6\u08A7\n\xB6\f\xB6\x0E\xB6\u08AA\v\xB6\x03\xB6\x03" +
    "\xB6\x03\xB6\x03\xB6\x03\xB6\x03\xB6\x07\xB6\u08B2\n\xB6\f\xB6\x0E\xB6" +
    "\u08B5\v\xB6\x03\xB6\x03\xB6\x05\xB6\u08B9\n\xB6\x03\xB7\x03\xB7\x03\xB7" +
    "\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8" +
    "\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8\x03\xB8" +
    "\x03\xB8\x03\xB8\x03\xB8\x05\xB8\u08D3\n\xB8\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03" +
    "\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03\xB9\x03";
MezDSLParser._serializedATNSegment1 = "\xB9\x03\xB9\x03\xB9\x05\xB9\u0973\n\xB9\x03\xBA\x03\xBA\x03\xBA\x03\xBA" +
    "\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x07\xBA\u097D\n\xBA\f\xBA\x0E\xBA\u0980" +
    "\v\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA" +
    "\x03\xBA\x07\xBA\u098B\n\xBA\f\xBA\x0E\xBA\u098E\v\xBA\x03\xBA\x03\xBA" +
    "\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x07\xBA\u0999" +
    "\n\xBA\f\xBA\x0E\xBA\u099C\v\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x03\xBA" +
    "\x03\xBA\x03\xBA\x03\xBA\x03\xBA\x07\xBA\u09A7\n\xBA\f\xBA\x0E\xBA\u09AA" +
    "\v\xBA\x03\xBA\x03\xBA\x05\xBA\u09AE\n\xBA\x03\xBB\x03\xBB\x03\xBB\x02" +
    "\x02\x02\xBC\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02" +
    "\x12\x02\x14\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02" +
    "&\x02(\x02*\x02,\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02" +
    "B\x02D\x02F\x02H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02" +
    "^\x02`\x02b\x02d\x02f\x02h\x02j\x02l\x02n\x02p\x02r\x02t\x02v\x02x\x02" +
    "z\x02|\x02~\x02\x80\x02\x82\x02\x84\x02\x86\x02\x88\x02\x8A\x02\x8C\x02" +
    "\x8E\x02\x90\x02\x92\x02\x94\x02\x96\x02\x98\x02\x9A\x02\x9C\x02\x9E\x02" +
    "\xA0\x02\xA2\x02\xA4\x02\xA6\x02\xA8\x02\xAA\x02\xAC\x02\xAE\x02\xB0\x02" +
    "\xB2\x02\xB4\x02\xB6\x02\xB8\x02\xBA\x02\xBC\x02\xBE\x02\xC0\x02\xC2\x02" +
    "\xC4\x02\xC6\x02\xC8\x02\xCA\x02\xCC\x02\xCE\x02\xD0\x02\xD2\x02\xD4\x02" +
    "\xD6\x02\xD8\x02\xDA\x02\xDC\x02\xDE\x02\xE0\x02\xE2\x02\xE4\x02\xE6\x02" +
    "\xE8\x02\xEA\x02\xEC\x02\xEE\x02\xF0\x02\xF2\x02\xF4\x02\xF6\x02\xF8\x02" +
    "\xFA\x02\xFC\x02\xFE\x02\u0100\x02\u0102\x02\u0104\x02\u0106\x02\u0108" +
    "\x02\u010A\x02\u010C\x02\u010E\x02\u0110\x02\u0112\x02\u0114\x02\u0116" +
    "\x02\u0118\x02\u011A\x02\u011C\x02\u011E\x02\u0120\x02\u0122\x02\u0124" +
    "\x02\u0126\x02\u0128\x02\u012A\x02\u012C\x02\u012E\x02\u0130\x02\u0132" +
    "\x02\u0134\x02\u0136\x02\u0138\x02\u013A\x02\u013C\x02\u013E\x02\u0140" +
    "\x02\u0142\x02\u0144\x02\u0146\x02\u0148\x02\u014A\x02\u014C\x02\u014E" +
    "\x02\u0150\x02\u0152\x02\u0154\x02\u0156\x02\u0158\x02\u015A\x02\u015C" +
    "\x02\u015E\x02\u0160\x02\u0162\x02\u0164\x02\u0166\x02\u0168\x02\u016A" +
    "\x02\u016C\x02\u016E\x02\u0170\x02\u0172\x02\u0174\x02\x02\n\x03\x02\xD4" +
    "\xD7\x04\x02\x1C\x1C22\x03\x02\xEB\xEE\x03\x02\xE9\xEA\x03\x02\xF3\xF4" +
    "\x03\x02\xF5\xF7\x04\x02\u0100\u0102\u0105\u0109\x03\x02\xD9\xE4\x02\u0A30" +
    "\x02\u0177\x03\x02\x02\x02\x04\u017D\x03\x02\x02\x02\x06\u017F\x03\x02" +
    "\x02\x02\b\u0184\x03\x02\x02\x02\n\u0186\x03\x02\x02\x02\f\u019C\x03\x02" +
    "\x02\x02\x0E\u019E\x03\x02\x02\x02\x10\u01C0\x03\x02\x02\x02\x12\u01C2" +
    "\x03\x02\x02\x02\x14\u01C5\x03\x02\x02\x02\x16\u01C8\x03\x02\x02\x02\x18" +
    "\u01CB\x03\x02\x02\x02\x1A\u01CE\x03\x02\x02\x02\x1C\u01D1\x03\x02\x02" +
    "\x02\x1E\u01E0\x03\x02\x02\x02 \u01E4\x03\x02\x02\x02\"\u01E6\x03\x02" +
    "\x02\x02$\u01F2\x03\x02\x02\x02&\u01FC\x03\x02\x02\x02(\u0203\x03\x02" +
    "\x02\x02*\u0211\x03\x02\x02\x02,\u0214\x03\x02\x02\x02.\u0217\x03\x02" +
    "\x02\x020\u021D\x03\x02\x02\x022\u0222\x03\x02\x02\x024\u0235\x03\x02" +
    "\x02\x026\u023A\x03\x02\x02\x028\u023C\x03\x02\x02\x02:\u0241\x03\x02" +
    "\x02\x02<\u0246\x03\x02\x02\x02>\u0248\x03\x02\x02\x02@\u024A\x03\x02" +
    "\x02\x02B\u024C\x03\x02\x02\x02D\u024E\x03\x02\x02\x02F\u0250\x03\x02" +
    "\x02\x02H\u0252\x03\x02\x02\x02J\u0257\x03\x02\x02\x02L\u025C\x03\x02" +
    "\x02\x02N\u0261\x03\x02\x02\x02P\u0266\x03\x02\x02\x02R\u0272\x03\x02" +
    "\x02\x02T\u027E\x03\x02\x02\x02V\u0283\x03\x02\x02\x02X\u028A\x03\x02" +
    "\x02\x02Z\u0296\x03\x02\x02\x02\\\u0298\x03\x02\x02\x02^\u029D\x03\x02" +
    "\x02\x02`\u02DD\x03\x02\x02\x02b\u02DF\x03\x02\x02\x02d\u02E1\x03\x02" +
    "\x02\x02f\u02E7\x03\x02\x02\x02h\u02EF\x03\x02\x02\x02j\u02F4\x03\x02" +
    "\x02\x02l\u02FA\x03\x02\x02\x02n\u030E\x03\x02\x02\x02p\u033A\x03\x02" +
    "\x02\x02r\u033C\x03\x02\x02\x02t\u0341\x03\x02\x02\x02v\u0343\x03\x02" +
    "\x02\x02x\u034C\x03\x02\x02\x02z\u034E\x03\x02\x02\x02|\u0358\x03\x02" +
    "\x02\x02~\u035A\x03\x02\x02\x02\x80\u035D\x03\x02\x02\x02\x82\u0364\x03" +
    "\x02\x02\x02\x84\u0366\x03\x02\x02\x02\x86\u036E\x03\x02\x02\x02\x88\u0372" +
    "\x03\x02\x02\x02\x8A\u0382\x03\x02\x02\x02\x8C\u0384\x03\x02\x02\x02\x8E" +
    "\u0388\x03\x02\x02\x02\x90\u038C\x03\x02\x02\x02\x92\u038E\x03\x02\x02" +
    "\x02\x94\u0396\x03\x02\x02\x02\x96\u039C\x03\x02\x02\x02\x98\u039F\x03" +
    "\x02\x02\x02\x9A\u03AD\x03\x02\x02\x02\x9C\u03B4\x03\x02\x02\x02\x9E\u03B7" +
    "\x03\x02\x02\x02\xA0\u03C0\x03\x02\x02\x02\xA2\u03C2\x03\x02\x02\x02\xA4" +
    "\u042A\x03\x02\x02\x02\xA6\u0447\x03\x02\x02\x02\xA8\u046E\x03\x02\x02" +
    "\x02\xAA\u0470\x03\x02\x02\x02\xAC\u047B\x03\x02\x02\x02\xAE\u047F\x03" +
    "\x02\x02\x02\xB0\u048F\x03\x02\x02\x02\xB2\u053C\x03\x02\x02\x02\xB4\u053E" +
    "\x03\x02\x02\x02\xB6\u0545\x03\x02\x02\x02\xB8\u0548\x03\x02\x02\x02\xBA" +
    "\u054C\x03\x02\x02\x02\xBC\u054E\x03\x02\x02\x02\xBE\u0556\x03\x02\x02" +
    "\x02\xC0\u055E\x03\x02\x02\x02\xC2\u0567\x03\x02\x02\x02\xC4\u0570\x03" +
    "\x02\x02\x02\xC6\u0572\x03\x02\x02\x02\xC8\u0574\x03\x02\x02\x02\xCA\u057D" +
    "\x03\x02\x02\x02\xCC\u057F\x03\x02\x02\x02\xCE\u0588\x03\x02\x02\x02\xD0" +
    "\u058D\x03\x02\x02\x02\xD2\u059A\x03\x02\x02\x02\xD4\u059C\x03\x02\x02" +
    "\x02\xD6\u059E\x03\x02\x02\x02\xD8\u05AF\x03\x02\x02\x02\xDA\u05D4\x03" +
    "\x02\x02\x02\xDC\u05D8\x03\x02\x02\x02\xDE\u05E4\x03\x02\x02\x02\xE0\u05E6" +
    "\x03\x02\x02\x02\xE2\u05F0\x03\x02\x02\x02\xE4\u05FE\x03\x02\x02\x02\xE6" +
    "\u0600\x03\x02\x02\x02\xE8\u0603\x03\x02\x02\x02\xEA\u061A\x03\x02\x02" +
    "\x02\xEC\u0636\x03\x02\x02\x02\xEE\u0648\x03\x02\x02\x02\xF0\u0668\x03" +
    "\x02\x02\x02\xF2\u066A\x03\x02\x02\x02\xF4\u069D\x03\x02\x02\x02\xF6\u0703" +
    "\x03\x02\x02\x02\xF8\u0719\x03\x02\x02\x02\xFA\u071B\x03\x02\x02\x02\xFC" +
    "\u0744\x03\x02\x02\x02\xFE\u0749\x03\x02\x02\x02\u0100\u074B\x03\x02\x02" +
    "\x02\u0102\u0756\x03\x02\x02\x02\u0104\u075B\x03\x02\x02\x02\u0106\u0776" +
    "\x03\x02\x02\x02\u0108\u0778\x03\x02\x02\x02\u010A\u077D\x03\x02\x02\x02" +
    "\u010C\u0788\x03\x02\x02\x02\u010E\u078F\x03\x02\x02\x02\u0110\u0796\x03" +
    "\x02\x02\x02\u0112\u079D\x03\x02\x02\x02\u0114\u07A2\x03\x02\x02\x02\u0116" +
    "\u07A7\x03\x02\x02\x02\u0118\u07AE\x03\x02\x02\x02\u011A\u07B5\x03\x02" +
    "\x02\x02\u011C\u07BE\x03\x02\x02\x02\u011E\u07C3\x03\x02\x02\x02\u0120" +
    "\u07CA\x03\x02\x02\x02\u0122\u07D3\x03\x02\x02\x02\u0124\u07DC\x03\x02" +
    "\x02\x02\u0126\u07E7\x03\x02\x02\x02\u0128\u07F0\x03\x02\x02\x02\u012A" +
    "\u07F5\x03\x02\x02\x02\u012C\u07FA\x03\x02\x02\x02\u012E\u0801\x03\x02" +
    "\x02\x02\u0130\u0814\x03\x02\x02\x02\u0132\u0816\x03\x02\x02\x02\u0134" +
    "\u081D\x03\x02\x02\x02\u0136\u0824\x03\x02\x02\x02\u0138\u082B\x03\x02" +
    "\x02\x02\u013A\u0832\x03\x02\x02\x02\u013C\u0839\x03\x02\x02\x02\u013E" +
    "\u0840\x03\x02\x02\x02\u0140\u0847\x03\x02\x02\x02\u0142\u084B\x03\x02" +
    "\x02\x02\u0144\u084F\x03\x02\x02\x02\u0146\u0854\x03\x02\x02\x02\u0148" +
    "\u0859\x03\x02\x02\x02\u014A\u085E\x03\x02\x02\x02\u014C\u0863\x03\x02" +
    "\x02\x02\u014E\u0868\x03\x02\x02\x02\u0150\u086A\x03\x02\x02\x02\u0152" +
    "\u086F\x03\x02\x02\x02\u0154\u0871\x03\x02\x02\x02\u0156\u0876\x03\x02" +
    "\x02\x02\u0158\u0878\x03\x02\x02\x02\u015A\u087D\x03\x02\x02\x02\u015C" +
    "\u087F\x03\x02\x02\x02\u015E\u0887\x03\x02\x02\x02\u0160\u0889\x03\x02" +
    "\x02\x02\u0162\u088E\x03\x02\x02\x02\u0164\u0897\x03\x02\x02\x02\u0166" +
    "\u089C\x03\x02\x02\x02\u0168\u089E\x03\x02\x02\x02\u016A\u08B8\x03\x02" +
    "\x02\x02\u016C\u08BA\x03\x02\x02\x02\u016E\u08D2\x03\x02\x02\x02\u0170" +
    "\u0972\x03\x02\x02\x02\u0172\u09AD\x03\x02\x02\x02\u0174\u09AF\x03\x02" +
    "\x02\x02\u0176\u0178\x05\x04\x03\x02\u0177\u0176\x03\x02\x02\x02\u0178" +
    "\u0179\x03\x02\x02\x02\u0179\u0177\x03\x02\x02\x02\u0179\u017A\x03\x02" +
    "\x02\x02\u017A\x03\x03\x02\x02\x02\u017B\u017E\x05\x06\x04\x02\u017C\u017E" +
    "\x05\n\x06\x02\u017D\u017B\x03\x02\x02\x02\u017D\u017C\x03\x02\x02\x02" +
    "\u017E\x05\x03\x02\x02\x02\u017F\u0180\x05\b\x05\x02\u0180\x07\x03\x02" +
    "\x02\x02\u0181\u0185\x05\f\x07\x02\u0182\u0185\x05^0\x02\u0183\u0185\x05" +
    "(\x15\x02\u0184\u0181\x03\x02\x02\x02\u0184\u0182\x03\x02\x02\x02\u0184" +
    "\u0183\x03\x02\x02\x02\u0185\t\x03\x02\x02\x02\u0186\u0187\x07\x03\x02" +
    "\x02\u0187\u0188\x07\u0104\x02\x02\u0188\u0189\x07\x04\x02\x02\u0189\u0190" +
    "\b\x06\x01\x02\u018A\u018B\x05d3\x02\u018B\u018C\x07\x04\x02\x02\u018C" +
    "\u018D\b\x06\x01\x02\u018D\u018F\x03\x02\x02\x02\u018E\u018A\x03\x02\x02" +
    "\x02\u018F\u0192\x03\x02\x02\x02\u0190\u018E\x03\x02\x02\x02\u0190\u0191" +
    "\x03\x02\x02\x02\u0191\u0194\x03\x02\x02\x02\u0192\u0190\x03\x02\x02\x02" +
    "\u0193\u0195\x05j6\x02\u0194\u0193\x03\x02\x02\x02\u0195\u0196\x03\x02" +
    "\x02\x02\u0196\u0194\x03\x02\x02\x02\u0196\u0197\x03\x02\x02\x02\u0197" +
    "\u0198\x03\x02\x02\x02\u0198\u0199\x07\x02\x02\x03\u0199\v\x03\x02\x02" +
    "\x02\u019A\u019D\x05\x0E\b\x02\u019B\u019D\x05\x1E\x10\x02\u019C\u019A" +
    "\x03\x02\x02\x02\u019C\u019B\x03\x02\x02\x02\u019D\r\x03\x02\x02\x02\u019E" +
    "\u019F\x07\x05\x02\x02\u019F\u01A0\x07\u0104\x02\x02\u01A0\u01A1\x07\x06" +
    "\x02\x02\u01A1\u01A7\b\b\x01\x02\u01A2\u01A3\x05 \x11\x02\u01A3\u01A4" +
    "\x07\x04\x02\x02\u01A4\u01A6\x03\x02\x02\x02\u01A5\u01A2\x03\x02\x02\x02" +
    "\u01A6\u01A9\x03\x02\x02\x02\u01A7\u01A5\x03\x02\x02\x02\u01A7\u01A8\x03" +
    "\x02\x02\x02\u01A8\u01AF\x03\x02\x02\x02\u01A9\u01A7\x03\x02\x02\x02\u01AA" +
    "\u01AB\x05\"\x12\x02\u01AB\u01AC\x07\x04\x02\x02\u01AC\u01AE\x03\x02\x02" +
    "\x02\u01AD\u01AA\x03\x02\x02\x02\u01AE\u01B1\x03\x02\x02\x02\u01AF\u01AD" +
    "\x03\x02\x02\x02\u01AF\u01B0\x03\x02\x02\x02\u01B0\u01B5\x03\x02\x02\x02" +
    "\u01B1\u01AF\x03\x02\x02\x02\u01B2\u01B4\x05\x10\t\x02\u01B3\u01B2\x03" +
    "\x02\x02\x02\u01B4\u01B7\x03\x02\x02\x02\u01B5\u01B3\x03\x02\x02\x02\u01B5" +
    "\u01B6\x03\x02\x02\x02\u01B6\u01B8\x03\x02\x02\x02\u01B7\u01B5\x03\x02" +
    "\x02\x02\u01B8\u01B9\x07\x07\x02\x02\u01B9\x0F\x03\x02\x02\x02\u01BA\u01C1" +
    "\x05\x12\n\x02\u01BB\u01C1\x05\x14\v\x02\u01BC\u01C1\x05\x16\f\x02\u01BD" +
    "\u01C1\x05\x18\r\x02\u01BE\u01C1\x05\x1A\x0E\x02\u01BF\u01C1\x05\x1C\x0F" +
    "\x02\u01C0\u01BA\x03\x02\x02\x02\u01C0\u01BB\x03\x02\x02\x02\u01C0\u01BC" +
    "\x03\x02\x02\x02\u01C0\u01BD\x03\x02\x02\x02\u01C0\u01BE\x03\x02\x02\x02" +
    "\u01C0\u01BF\x03\x02\x02\x02\u01C1\x11\x03\x02\x02\x02\u01C2\u01C3\x07" +
    "\x81\x02\x02\u01C3\u01C4\x05l7\x02\u01C4\x13\x03\x02\x02\x02\u01C5\u01C6" +
    "\x07\x82\x02\x02\u01C6\u01C7\x05l7\x02\u01C7\x15\x03\x02\x02\x02\u01C8" +
    "\u01C9\x07\x83\x02\x02\u01C9\u01CA\x05l7\x02\u01CA\x17\x03\x02\x02\x02" +
    "\u01CB\u01CC\x07\x84\x02\x02\u01CC\u01CD\x05l7\x02\u01CD\x19\x03\x02\x02" +
    "\x02\u01CE\u01CF\x07\x85\x02\x02\u01CF\u01D0\x05l7\x02\u01D0\x1B\x03\x02" +
    "\x02\x02\u01D1\u01D2\x07\x86\x02\x02\u01D2\u01D3\x05l7\x02\u01D3\x1D\x03" +
    "\x02\x02\x02\u01D4\u01D6\x05.\x18\x02\u01D5\u01D4\x03\x02\x02\x02\u01D6" +
    "\u01D7\x03\x02\x02\x02\u01D7\u01D5\x03\x02\x02\x02\u01D7\u01D8\x03\x02" +
    "\x02\x02\u01D8\u01DA\x03\x02\x02\x02\u01D9\u01DB\x07\b\x02\x02\u01DA\u01D9" +
    "\x03\x02\x02\x02\u01DA\u01DB\x03\x02\x02\x02\u01DB\u01DC\x03\x02\x02\x02" +
    "\u01DC\u01DD\x05\x0E\b\x02\u01DD\u01E1\x03\x02\x02\x02\u01DE\u01DF\x07" +
    "\b\x02\x02\u01DF\u01E1\x05\x0E\b\x02\u01E0\u01D5\x03\x02\x02\x02\u01E0" +
    "\u01DE\x03\x02\x02\x02\u01E1\x1F\x03\x02\x02\x02\u01E2\u01E5\x05&\x14" +
    "\x02\u01E3\u01E5\x05$\x13\x02\u01E4\u01E2\x03\x02\x02\x02\u01E4\u01E3" +
    "\x03\x02\x02\x02\u01E5!\x03\x02\x02\x02\u01E6\u01E7\x05,\x17\x02\u01E7" +
    "\u01E8\x07\u0104\x02\x02\u01E8\u01EB\x07\u0104\x02\x02\u01E9\u01EA\x07" +
    "\xD8\x02\x02\u01EA\u01EC\x07\u0104\x02\x02\u01EB\u01E9\x03\x02\x02\x02" +
    "\u01EB\u01EC\x03\x02\x02\x02\u01EC\u01ED\x03\x02\x02\x02\u01ED\u01EE\b" +
    "\x12\x01\x02\u01EE#\x03\x02\x02\x02\u01EF\u01F1\x050\x19\x02\u01F0\u01EF" +
    "\x03\x02\x02\x02\u01F1\u01F4\x03\x02\x02\x02\u01F2\u01F0\x03\x02\x02\x02" +
    "\u01F2\u01F3\x03\x02\x02\x02\u01F3\u01F5\x03\x02\x02\x02\u01F4\u01F2\x03" +
    "\x02\x02\x02\u01F5\u01F6\x05\u0174\xBB\x02\u01F6\u01F7\x07\u0104\x02\x02" +
    "\u01F7\u01F8\b\x13\x01\x02\u01F8%\x03\x02\x02\x02\u01F9\u01FB\x050\x19" +
    "\x02\u01FA\u01F9\x03\x02\x02\x02\u01FB\u01FE\x03\x02\x02\x02\u01FC\u01FA" +
    "\x03\x02\x02\x02\u01FC\u01FD\x03\x02\x02\x02\u01FD\u01FF\x03\x02\x02\x02" +
    "\u01FE\u01FC\x03\x02\x02\x02\u01FF\u0200\x07\u0103\x02\x02\u0200\u0201" +
    "\x07\u0104\x02\x02\u0201\u0202\b\x14\x01\x02\u0202\'\x03\x02\x02\x02\u0203" +
    "\u0204\x07\t\x02\x02\u0204\u0205\x07\u0103\x02\x02\u0205\u0206\b\x15\x01" +
    "\x02\u0206\u0207\x07\x06\x02\x02\u0207\u020C\x05*\x16\x02\u0208\u0209" +
    "\x07\n\x02\x02\u0209\u020B\x05*\x16\x02\u020A\u0208\x03\x02\x02\x02\u020B" +
    "\u020E\x03\x02\x02\x02\u020C\u020A\x03\x02\x02\x02\u020C\u020D\x03\x02" +
    "\x02\x02\u020D\u020F\x03\x02\x02\x02\u020E\u020C\x03\x02\x02\x02\u020F" +
    "\u0210\x07\x07\x02\x02\u0210)\x03\x02\x02\x02\u0211\u0212\x07\u0104\x02" +
    "\x02\u0212\u0213\b\x16\x01\x02\u0213+\x03\x02\x02\x02\u0214\u0215\x07" +
    "\v\x02\x02\u0215\u0216\x05b2\x02\u0216-\x03\x02\x02\x02\u0217\u021B\x07" +
    "\v\x02\x02\u0218\u021C\x05T+\x02\u0219\u021C\x05V,\x02\u021A\u021C\x05" +
    "Z.\x02\u021B\u0218\x03\x02\x02\x02\u021B\u0219\x03\x02\x02\x02\u021B\u021A" +
    "\x03\x02\x02\x02\u021C/\x03\x02\x02\x02\u021D\u0220\x07\v\x02\x02\u021E" +
    "\u0221\x05\\/\x02\u021F\u0221\x05X-\x02\u0220\u021E\x03\x02\x02\x02\u0220" +
    "\u021F\x03\x02\x02\x02\u02211\x03\x02\x02\x02\u0222\u0233\x07\v\x02\x02" +
    "\u0223\u0234\x054\x1B\x02\u0224\u0234\x056\x1C\x02\u0225\u0234\x05:\x1E" +
    "\x02\u0226\u0234\x05<\x1F\x02\u0227\u0234\x05> \x02\u0228\u0234\x05@!" +
    "\x02\u0229\u0234\x05B\"\x02\u022A\u0234\x05D#\x02\u022B\u0234\x05H%\x02" +
    "\u022C\u0234\x05J&\x02\u022D\u0234\x05L\'\x02\u022E\u0234\x05N(\x02\u022F" +
    "\u0234\x05P)\x02\u0230\u0234\x05R*\x02\u0231\u0234\x058\x1D\x02\u0232" +
    "\u0234\x05F$\x02\u0233\u0223\x03\x02\x02\x02\u0233\u0224\x03\x02\x02\x02" +
    "\u0233\u0225\x03\x02\x02\x02\u0233\u0226\x03\x02\x02\x02\u0233\u0227\x03" +
    "\x02\x02\x02\u0233\u0228\x03\x02\x02\x02\u0233\u0229\x03\x02\x02\x02\u0233" +
    "\u022A\x03\x02\x02\x02\u0233\u022B\x03\x02\x02\x02\u0233\u022C\x03\x02" +
    "\x02\x02\u0233\u022D\x03\x02\x02\x02\u0233\u022E\x03\x02\x02\x02\u0233" +
    "\u022F\x03\x02\x02\x02\u0233\u0230\x03\x02\x02\x02\u0233\u0231\x03\x02" +
    "\x02\x02\u0233\u0232\x03\x02\x02\x02\u02343\x03\x02\x02\x02\u0235\u0236" +
    "\x07\x88\x02\x02\u0236\u0237\x07\f\x02\x02\u0237\u0238\x07\u0108\x02\x02" +
    "\u0238\u0239\x07\r\x02\x02\u02395\x03\x02\x02\x02\u023A\u023B\x07\x89" +
    "\x02\x02\u023B7\x03\x02\x02\x02\u023C\u023D\x07\x8A\x02\x02\u023D\u023E" +
    "\x07\f\x02\x02\u023E\u023F\x07\u0108\x02\x02\u023F\u0240\x07\r\x02\x02" +
    "\u02409\x03\x02\x02\x02\u0241\u0242\x07\x8D\x02\x02\u0242\u0243\x07\f" +
    "\x02\x02\u0243\u0244\x07\u0108\x02\x02\u0244\u0245\x07\r\x02\x02\u0245" +
    ";\x03\x02\x02\x02\u0246\u0247\x07\x8E\x02\x02\u0247=\x03\x02\x02\x02\u0248" +
    "\u0249\x07\x8F\x02\x02\u0249?\x03\x02\x02\x02\u024A\u024B\x07\x90\x02" +
    "\x02\u024BA\x03\x02\x02\x02\u024C\u024D\x07\x91\x02\x02\u024DC\x03\x02" +
    "\x02\x02\u024E\u024F\x07\x92\x02\x02\u024FE\x03\x02\x02\x02\u0250\u0251" +
    "\x07\x93\x02\x02\u0251G\x03\x02\x02\x02\u0252\u0253\x07\x95\x02\x02\u0253" +
    "\u0254\x07\f\x02\x02\u0254\u0255\x07\u0108\x02\x02\u0255\u0256\x07\r\x02" +
    "\x02\u0256I\x03\x02\x02\x02\u0257\u0258\x07\x96\x02\x02\u0258\u0259\x07" +
    "\f\x02\x02\u0259\u025A\x07\u0108\x02\x02\u025A\u025B\x07\r\x02\x02\u025B" +
    "K\x03\x02\x02\x02\u025C\u025D\x07\x97\x02\x02\u025D\u025E\x07\f\x02\x02" +
    "\u025E\u025F\x07\u0108\x02\x02\u025F\u0260\x07\r\x02\x02\u0260M\x03\x02" +
    "\x02\x02\u0261\u0262\x07\x98\x02\x02\u0262\u0263\x07\f\x02\x02\u0263\u0264" +
    "\x07\u0108\x02\x02\u0264\u0265\x07\r\x02\x02\u0265O\x03\x02\x02\x02\u0266" +
    "\u0267\x07\x99\x02\x02\u0267\u0268\x07\f\x02\x02\u0268\u026D\x07\u0108" +
    "\x02\x02\u0269\u026A\x07\n\x02\x02\u026A\u026C\x07\u0108\x02\x02\u026B" +
    "\u0269\x03\x02\x02\x02\u026C\u026F\x03\x02\x02\x02\u026D\u026B\x03\x02" +
    "\x02\x02\u026D\u026E\x03\x02\x02\x02\u026E\u0270\x03\x02\x02\x02\u026F" +
    "\u026D\x03\x02\x02\x02\u0270\u0271\x07\r\x02\x02\u0271Q\x03\x02\x02\x02" +
    "\u0272\u0273\x07\x9A\x02\x02\u0273\u0274\x07\f\x02\x02\u0274\u0279\x07" +
    "\u0108\x02\x02\u0275\u0276\x07\n\x02\x02\u0276\u0278\x07\u0108\x02\x02" +
    "\u0277\u0275\x03\x02\x02\x02\u0278\u027B\x03\x02\x02\x02\u0279\u0277\x03" +
    "\x02\x02\x02\u0279\u027A\x03\x02\x02\x02\u027A\u027C\x03\x02\x02\x02\u027B" +
    "\u0279\x03\x02\x02\x02\u027C\u027D\x07\r\x02\x02\u027DS\x03\x02\x02\x02" +
    "\u027E\u027F\x07\x8B\x02\x02\u027F\u0280\x07\f\x02\x02\u0280\u0281\x07" +
    "\u0108\x02\x02\u0281\u0282\x07\r\x02\x02\u0282U\x03\x02\x02\x02\u0283" +
    "\u0284\x07\x8C\x02\x02\u0284\u0285\x07\f\x02\x02\u0285\u0286\x07\u0108" +
    "\x02\x02\u0286\u0287\x07\n\x02\x02\u0287\u0288\x05\u0172\xBA\x02\u0288" +
    "\u0289\x07\r\x02\x02\u0289W\x03\x02\x02\x02\u028A\u028B\x07\x8C\x02\x02" +
    "\u028B\u028C\x07\f\x02\x02\u028C\u0291\x07\u0108\x02\x02\u028D\u028E\x07" +
    "\n\x02\x02\u028E\u0290\x07\u0108\x02\x02\u028F\u028D\x03\x02\x02\x02\u0290" +
    "\u0293\x03\x02\x02\x02\u0291\u028F\x03\x02\x02\x02\u0291\u0292\x03\x02" +
    "\x02\x02\u0292\u0294\x03\x02\x02\x02\u0293\u0291\x03\x02\x02\x02\u0294" +
    "\u0295\x07\r\x02\x02\u0295Y\x03\x02\x02\x02\u0296\u0297\x07\x94\x02\x02" +
    "\u0297[\x03\x02\x02\x02\u0298\u0299\x07\u0104\x02\x02\u0299\u029A\x07" +
    "\f\x02\x02\u029A\u029B\x07\u0108\x02\x02\u029B\u029C\x07\r\x02\x02\u029C" +
    "]\x03\x02\x02\x02\u029D\u029E\x07\x0E\x02\x02\u029E\u029F\x07\u0104\x02" +
    "\x02\u029F\u02A0\b0\x01\x02\u02A0\u02A4\x07\x06\x02\x02\u02A1\u02A2\x05" +
    "`1\x02\u02A2\u02A3\x07\x04\x02\x02\u02A3\u02A5\x03\x02\x02\x02\u02A4\u02A1" +
    "\x03\x02\x02\x02\u02A5\u02A6\x03\x02\x02\x02\u02A6\u02A4\x03\x02\x02\x02" +
    "\u02A6\u02A7\x03\x02\x02\x02\u02A7\u02A8\x03\x02\x02\x02\u02A8\u02A9\x07" +
    "\x07\x02\x02\u02A9_\x03\x02\x02\x02\u02AA\u02AB\x07\xCE\x02\x02\u02AB" +
    "\u02AC\x07\f\x02\x02\u02AC\u02DE\x07\r\x02\x02\u02AD\u02AE\x07\xCF\x02" +
    "\x02\u02AE\u02AF\x07\f\x02\x02\u02AF\u02B0\x07\u0108\x02\x02\u02B0\u02DE" +
    "\x07\r\x02\x02\u02B1\u02B2\x07\xD3\x02\x02\u02B2\u02B3\x07\f\x02\x02\u02B3" +
    "\u02B4\x07\u0106\x02\x02\u02B4\u02DE\x07\r\x02\x02\u02B5\u02B6\x07\xD2" +
    "\x02\x02\u02B6\u02B7\x07\f\x02\x02\u02B7\u02B8\x07\u0106\x02\x02\u02B8" +
    "\u02DE\x07\r\x02\x02\u02B9\u02BA\x07\xD1\x02\x02\u02BA\u02BB\x07\f\x02" +
    "\x02\u02BB\u02BC\x07\xF4\x02\x02\u02BC\u02BD\x07\u0105\x02\x02\u02BD\u02DE" +
    "\x07\r\x02\x02\u02BE\u02BF\x07\xD1\x02\x02\u02BF\u02C0\x07\f\x02\x02\u02C0" +
    "\u02C1\x07\xF4\x02\x02\u02C1\u02C2\x07\u0106\x02\x02\u02C2\u02DE\x07\r" +
    "\x02\x02\u02C3\u02C4\x07\xD1\x02\x02\u02C4\u02C5\x07\f\x02\x02\u02C5\u02C6" +
    "\x07\u0105\x02\x02\u02C6\u02DE\x07\r\x02\x02\u02C7\u02C8\x07\xD1\x02\x02" +
    "\u02C8\u02C9\x07\f\x02\x02\u02C9\u02CA\x07\u0106\x02\x02\u02CA\u02DE\x07" +
    "\r\x02\x02\u02CB\u02CC\x07\xD0\x02\x02\u02CC\u02CD\x07\f\x02\x02\u02CD" +
    "\u02CE\x07\xF4\x02\x02\u02CE\u02CF\x07\u0105\x02\x02\u02CF\u02DE\x07\r" +
    "\x02\x02\u02D0\u02D1\x07\xD0\x02\x02\u02D1\u02D2\x07\f\x02\x02\u02D2\u02D3" +
    "\x07\xF4\x02\x02\u02D3\u02D4\x07\u0106\x02\x02\u02D4\u02DE\x07\r\x02\x02" +
    "\u02D5\u02D6\x07\xD0\x02\x02\u02D6\u02D7\x07\f\x02\x02\u02D7\u02D8\x07" +
    "\u0105\x02\x02\u02D8\u02DE\x07\r\x02\x02\u02D9\u02DA\x07\xD0\x02\x02\u02DA" +
    "\u02DB\x07\f\x02\x02\u02DB\u02DC\x07\u0106\x02\x02\u02DC\u02DE\x07\r\x02" +
    "\x02\u02DD\u02AA\x03\x02\x02\x02\u02DD\u02AD\x03\x02\x02\x02\u02DD\u02B1" +
    "\x03\x02\x02\x02\u02DD\u02B5\x03\x02\x02\x02\u02DD\u02B9\x03\x02\x02\x02" +
    "\u02DD\u02BE\x03\x02\x02\x02\u02DD\u02C3\x03\x02\x02\x02\u02DD\u02C7\x03" +
    "\x02\x02\x02\u02DD\u02CB\x03\x02\x02\x02\u02DD\u02D0\x03\x02\x02\x02\u02DD" +
    "\u02D5\x03\x02\x02\x02\u02DD\u02D9\x03\x02\x02\x02\u02DEa\x03\x02\x02" +
    "\x02\u02DF\u02E0\t\x02\x02\x02\u02E0c\x03\x02\x02\x02\u02E1\u02E3\x05" +
    "h5\x02\u02E2\u02E4\x07\xE6\x02\x02\u02E3\u02E2\x03\x02\x02\x02\u02E3\u02E4" +
    "\x03\x02\x02\x02\u02E4\u02E5\x03\x02\x02\x02\u02E5\u02E6\x07\u0104\x02" +
    "\x02\u02E6e\x03\x02\x02\x02\u02E7\u02E8\x05d3\x02\u02E8\u02E9\x07\xE5" +
    "\x02\x02\u02E9\u02EA\x05\xBA^\x02\u02EA\u02EB\b4\x01\x02\u02EBg\x03\x02" +
    "\x02\x02\u02EC\u02F0\x05\u0174\xBB\x02\u02ED\u02F0\x07\u0104\x02\x02\u02EE" +
    "\u02F0\x07\u0103\x02\x02\u02EF\u02EC\x03\x02\x02\x02\u02EF\u02ED\x03\x02" +
    "\x02\x02\u02EF\u02EE\x03\x02\x02\x02\u02F0i\x03\x02\x02\x02\u02F1\u02F3" +
    "\x052\x1A\x02\u02F2\u02F1\x03\x02\x02\x02\u02F3\u02F6\x03\x02\x02\x02" +
    "\u02F4\u02F2\x03\x02\x02\x02\u02F4\u02F5\x03\x02\x02\x02\u02F5\u02F7\x03" +
    "\x02\x02\x02\u02F6\u02F4\x03\x02\x02\x02\u02F7\u02F8\x05p9\x02\u02F8\u02F9" +
    "\x05l7\x02\u02F9k\x03\x02\x02\x02\u02FA\u02FE\x07\x06\x02\x02\u02FB\u02FD" +
    "\x05n8\x02\u02FC\u02FB\x03\x02\x02\x02\u02FD\u0300\x03\x02\x02\x02\u02FE" +
    "\u02FC\x03\x02\x02\x02\u02FE\u02FF\x03\x02\x02\x02\u02FF\u0301\x03\x02" +
    "\x02\x02\u0300\u02FE\x03\x02\x02\x02\u0301\u0302\x07\x07\x02\x02\u0302" +
    "m\x03\x02\x02\x02\u0303\u0304\x05d3\x02\u0304\u0305\x07\x04\x02\x02\u0305" +
    "\u0306\b8\x01\x02\u0306\u030F\x03\x02\x02\x02\u0307\u0308\x05f4\x02\u0308" +
    "\u0309\x07\x04\x02\x02\u0309\u030F\x03\x02\x02\x02\u030A\u030B\x05x=\x02" +
    "\u030B\u030C\x07\x04\x02\x02\u030C\u030F\x03\x02\x02\x02\u030D\u030F\x05" +
    "\x82B\x02\u030E\u0303\x03\x02\x02\x02\u030E\u0307\x03\x02\x02\x02\u030E" +
    "\u030A\x03\x02\x02\x02\u030E\u030D\x03\x02\x02\x02\u030Fo\x03\x02\x02" +
    "\x02\u0310\u0312\x05t;\x02\u0311\u0313\x07\xE6\x02\x02\u0312\u0311\x03" +
    "\x02\x02\x02\u0312\u0313\x03\x02\x02\x02\u0313\u0314\x03\x02\x02\x02\u0314" +
    "\u0315\x05r:\x02\u0315\u0323\b9\x01\x02\u0316\u0317\x07\f\x02\x02\u0317" +
    "\u0324\x07\r\x02\x02\u0318\u0319\x07\f\x02\x02\u0319\u031E\x05v<\x02\u031A" +
    "\u031B\x07\n\x02\x02\u031B\u031D\x05v<\x02\u031C\u031A\x03\x02\x02\x02" +
    "\u031D\u0320\x03\x02\x02\x02\u031E\u031C\x03\x02\x02\x02\u031E\u031F\x03" +
    "\x02\x02\x02\u031F\u0321\x03\x02\x02\x02\u0320\u031E\x03\x02\x02\x02\u0321" +
    "\u0322\x07\r\x02\x02\u0322\u0324\x03\x02\x02\x02\u0323\u0316\x03\x02\x02" +
    "\x02\u0323\u0318\x03\x02\x02\x02\u0324\u033B\x03\x02\x02\x02\u0325\u0327" +
    "\x05t;\x02\u0326\u0328\x07\xE6\x02\x02\u0327\u0326\x03\x02\x02\x02\u0327" +
    "\u0328\x03\x02\x02\x02\u0328\u0329\x03\x02\x02\x02\u0329\u032A\x07\u0104" +
    "\x02\x02\u032A\u0338\b9\x01\x02\u032B\u032C\x07\f\x02\x02\u032C\u0339" +
    "\x07\r\x02\x02\u032D\u032E\x07\f\x02\x02\u032E\u0333\x05v<\x02\u032F\u0330" +
    "\x07\n\x02\x02\u0330\u0332\x05v<\x02\u0331\u032F\x03\x02\x02\x02\u0332" +
    "\u0335\x03\x02\x02\x02\u0333\u0331\x03\x02\x02\x02\u0333\u0334\x03\x02" +
    "\x02\x02\u0334\u0336\x03\x02\x02\x02\u0335\u0333\x03\x02\x02\x02\u0336" +
    "\u0337\x07\r\x02\x02\u0337\u0339\x03\x02\x02\x02\u0338\u032B\x03\x02\x02" +
    "\x02\u0338\u032D\x03\x02\x02\x02\u0339\u033B\x03\x02\x02\x02\u033A\u0310" +
    "\x03\x02\x02\x02\u033A\u0325\x03\x02\x02\x02\u033Bq\x03\x02\x02\x02\u033C" +
    "\u033D\t\x03\x02\x02\u033Ds\x03\x02\x02\x02\u033E\u0342\x05\u0174\xBB" +
    "\x02\u033F\u0342\x07\u0104\x02\x02\u0340\u0342\x07\u0103\x02\x02\u0341" +
    "\u033E\x03\x02\x02\x02\u0341\u033F\x03\x02\x02\x02\u0341\u0340\x03\x02" +
    "\x02\x02\u0342u\x03\x02\x02\x02\u0343\u0345\x05t;\x02\u0344\u0346\x07" +
    "\xE6\x02\x02\u0345\u0344\x03\x02\x02\x02\u0345\u0346\x03\x02\x02\x02\u0346" +
    "\u0347\x03\x02\x02\x02\u0347\u0348\x07\u0104\x02\x02\u0348\u0349\b<\x01" +
    "\x02\u0349w\x03\x02\x02\x02\u034A\u034D\x05z>\x02\u034B\u034D\x05|?\x02" +
    "\u034C\u034A\x03\x02\x02\x02\u034C\u034B\x03\x02\x02\x02\u034Dy\x03\x02" +
    "\x02\x02\u034E\u0350\x07\x87\x02\x02\u034F\u0351\x05\xBA^\x02\u0350\u034F" +
    "\x03\x02\x02\x02\u0350\u0351\x03\x02\x02\x02\u0351{\x03\x02\x02\x02\u0352" +
    "\u0359\x05\xB8]\x02\u0353\u0359\x05\xA0Q\x02\u0354";
MezDSLParser._serializedATNSegment2 = "\u0359\x05\xDAn\x02\u0355\u0359\x05~@\x02\u0356\u0359\x05\x80A\x02\u0357" +
    "\u0359\x05\x9EP\x02\u0358\u0352\x03\x02\x02\x02\u0358\u0353\x03\x02\x02" +
    "\x02\u0358\u0354\x03\x02\x02\x02\u0358\u0355\x03\x02\x02\x02\u0358\u0356" +
    "\x03\x02\x02\x02\u0358\u0357\x03\x02\x02\x02\u0359}\x03\x02\x02\x02\u035A" +
    "\u035B\x07\u0104\x02\x02\u035B\u035C\x07\xF1\x02\x02\u035C\x7F\x03\x02" +
    "\x02\x02\u035D\u035E\x07\u0104\x02\x02\u035E\u035F\x07\xF2\x02\x02\u035F" +
    "\x81\x03\x02\x02\x02\u0360\u0365\x05\x98M\x02\u0361\u0365\x05\x86D\x02" +
    "\u0362\u0365\x05\x84C\x02\u0363\u0365\x05\x92J\x02\u0364\u0360\x03\x02" +
    "\x02\x02\u0364\u0361\x03\x02\x02\x02\u0364\u0362\x03\x02\x02\x02\u0364" +
    "\u0363\x03\x02\x02\x02\u0365\x83\x03\x02\x02\x02\u0366\u0367\x07\x0F\x02" +
    "\x02\u0367\u0368\x07\f\x02\x02\u0368\u0369\x05d3\x02\u0369\u036A\x07\x10" +
    "\x02\x02\u036A\u036B\x05\xBA^\x02\u036B\u036C\x07\r\x02\x02\u036C\u036D" +
    "\x05l7\x02\u036D\x85\x03\x02\x02\x02\u036E\u036F\x07\x11\x02\x02\u036F" +
    "\u0370\x05\x88E\x02\u0370\u0371\x05l7\x02\u0371\x87\x03\x02\x02\x02\u0372" +
    "\u0374\x07\f\x02\x02\u0373\u0375\x05\x8AF\x02\u0374\u0373\x03\x02\x02" +
    "\x02\u0374\u0375\x03\x02\x02\x02\u0375\u0376\x03\x02\x02\x02\u0376\u0378" +
    "\x07\x04\x02\x02\u0377\u0379\x05\x8CG\x02\u0378\u0377\x03\x02\x02\x02" +
    "\u0378\u0379\x03\x02\x02\x02\u0379\u037A\x03\x02\x02\x02\u037A\u037C\x07" +
    "\x04\x02\x02\u037B\u037D\x05\x8EH\x02\u037C\u037B\x03\x02\x02\x02\u037C" +
    "\u037D\x03\x02\x02\x02\u037D\u037E\x03\x02\x02\x02\u037E\u037F\x07\r\x02" +
    "\x02\u037F\x89\x03\x02\x02\x02\u0380\u0383\x05|?\x02\u0381\u0383\x05f" +
    "4\x02\u0382\u0380\x03\x02\x02\x02\u0382\u0381\x03\x02\x02\x02\u0383\x8B" +
    "\x03\x02\x02\x02\u0384\u0385\x05\xC8e\x02\u0385\u0386\x05\x90I\x02\u0386" +
    "\u0387\x05\xC8e\x02\u0387\x8D\x03\x02\x02\x02\u0388\u0389\x05|?\x02\u0389" +
    "\x8F\x03\x02\x02\x02\u038A\u038D\x05\xC4c\x02\u038B\u038D\x05\xC6d\x02" +
    "\u038C\u038A\x03\x02\x02\x02\u038C\u038B\x03\x02\x02\x02\u038D\x91\x03" +
    "\x02\x02\x02\u038E\u038F\x07\x12\x02\x02\u038F\u0391\x05l7\x02\u0390\u0392" +
    "\x05\x94K\x02\u0391\u0390\x03\x02\x02\x02\u0391\u0392\x03\x02\x02\x02" +
    "\u0392\u0394\x03\x02\x02\x02\u0393\u0395\x05\x96L\x02\u0394\u0393\x03" +
    "\x02\x02\x02\u0394\u0395\x03\x02\x02\x02\u0395\x93\x03\x02\x02\x02\u0396" +
    "\u0397\x07\x13\x02\x02\u0397\u0398\x07\f\x02\x02\u0398\u0399\x07\u0104" +
    "\x02\x02\u0399\u039A\x07\r\x02\x02\u039A\u039B\x05l7\x02\u039B\x95\x03" +
    "\x02\x02\x02\u039C\u039D\x07\x14\x02\x02\u039D\u039E\x05l7\x02\u039E\x97" +
    "\x03\x02\x02\x02\u039F\u03A0\x07\x15\x02\x02\u03A0\u03A1\x07\f\x02\x02" +
    "\u03A1\u03A2\x05\xBC_\x02\u03A2\u03A3\x07\r\x02\x02\u03A3\u03A7\x05l7" +
    "\x02\u03A4\u03A6\x05\x9AN\x02\u03A5\u03A4\x03\x02\x02\x02\u03A6\u03A9" +
    "\x03\x02\x02\x02\u03A7\u03A5\x03\x02\x02\x02\u03A7\u03A8\x03\x02\x02\x02" +
    "\u03A8\u03AB\x03\x02\x02\x02\u03A9\u03A7\x03\x02\x02\x02\u03AA\u03AC\x05" +
    "\x9CO\x02\u03AB\u03AA\x03\x02\x02\x02\u03AB\u03AC\x03\x02\x02\x02\u03AC" +
    "\x99\x03\x02\x02\x02\u03AD\u03AE\x07\x16\x02\x02\u03AE\u03AF\x07\x15\x02" +
    "\x02\u03AF\u03B0\x07\f\x02\x02\u03B0\u03B1\x05\xBC_\x02\u03B1\u03B2\x07" +
    "\r\x02\x02\u03B2\u03B3\x05l7\x02\u03B3\x9B\x03\x02\x02\x02\u03B4\u03B5" +
    "\x07\x16\x02\x02\u03B5\u03B6\x05l7\x02\u03B6\x9D\x03\x02\x02\x02\u03B7" +
    "\u03B8\x07\x17\x02\x02\u03B8\u03B9\x05\xBA^\x02\u03B9\x9F\x03\x02\x02" +
    "\x02\u03BA\u03C1\x05\xB2Z\x02\u03BB\u03C1\x05\xB0Y\x02\u03BC\u03C1\x05" +
    "\xA6T\x02\u03BD\u03C1\x05\xA2R\x02\u03BE\u03C1\x05\xEEx\x02\u03BF\u03C1" +
    "\x05\xFA~\x02\u03C0\u03BA\x03\x02\x02\x02\u03C0\u03BB\x03\x02\x02\x02" +
    "\u03C0\u03BC\x03\x02\x02\x02\u03C0\u03BD\x03\x02\x02\x02\u03C0\u03BE\x03" +
    "\x02\x02\x02\u03C0\u03BF\x03\x02\x02\x02\u03C1\xA1\x03\x02\x02\x02\u03C2" +
    "\u03C3\x07\x18\x02\x02\u03C3\u03C4\x07\x10\x02\x02\u03C4\u03C5\x05\xA4" +
    "S\x02\u03C5\xA3\x03\x02\x02\x02\u03C6\u03C7\x07u\x02\x02\u03C7\u03C8\x07" +
    "\f\x02\x02\u03C8\u03C9\x05\xBA^\x02\u03C9\u03CA\x07\n\x02\x02\u03CA\u03CB" +
    "\x05\xBA^\x02\u03CB\u03CC\x07\n\x02\x02\u03CC\u03CD\x07\u0108\x02\x02" +
    "\u03CD\u03CE\x07\r\x02\x02\u03CE\u042B\x03\x02\x02\x02\u03CF\u03D0\x07" +
    "v\x02\x02\u03D0\u03D1\x07\f\x02\x02\u03D1\u03D2\x05\xBA^\x02\u03D2\u03D3" +
    "\x07\n\x02\x02\u03D3\u03D4\x07\u0108\x02\x02\u03D4\u03D5\x07\r\x02\x02" +
    "\u03D5\u042B\x03\x02\x02\x02\u03D6\u03D7\x07~\x02\x02\u03D7\u03D8\x07" +
    "\f\x02\x02\u03D8\u03D9\x05\xBA^\x02\u03D9\u03DA\x07\n\x02\x02\u03DA\u03DB" +
    "\x05\xBA^\x02\u03DB\u03DC\x07\n\x02\x02\u03DC\u03DD\x07\u0108\x02\x02" +
    "\u03DD\u03DE\x07\r\x02\x02\u03DE\u042B\x03\x02\x02\x02\u03DF\u03E0\x07" +
    "\x7F\x02\x02\u03E0\u03E1\x07\f\x02\x02\u03E1\u03E2\x05\xBA^\x02\u03E2" +
    "\u03E3\x07\n\x02\x02\u03E3\u03E4\x05\xBA^\x02\u03E4\u03E5\x07\n\x02\x02" +
    "\u03E5\u03E6\x07\u0108\x02\x02\u03E6\u03E7\x07\r\x02\x02\u03E7\u042B\x03" +
    "\x02\x02\x02\u03E8\u03E9\x07w\x02\x02\u03E9\u03EA\x07\f\x02\x02\u03EA" +
    "\u03EB\x05\xBA^\x02\u03EB\u03EC\x07\n\x02\x02\u03EC\u03ED\x07\u0108\x02" +
    "\x02\u03ED\u03EE\x07\r\x02\x02\u03EE\u042B\x03\x02\x02\x02\u03EF\u03F0" +
    "\x07{\x02\x02\u03F0\u03F1\x07\f\x02\x02\u03F1\u03F2\x05\xBA^\x02\u03F2" +
    "\u03F3\x07\n\x02\x02\u03F3\u03F4\x05\xBA^\x02\u03F4\u03F5\x07\n\x02\x02" +
    "\u03F5\u03F6\x07\u0108\x02\x02\u03F6\u03F7\x07\r\x02\x02\u03F7\u042B\x03" +
    "\x02\x02\x02\u03F8\u03F9\x07z\x02\x02\u03F9\u03FA\x07\f\x02\x02\u03FA" +
    "\u03FB\x05\xBA^\x02\u03FB\u03FC\x07\n\x02\x02\u03FC\u03FD\x05\xBA^\x02" +
    "\u03FD\u03FE\x07\n\x02\x02\u03FE\u03FF\x07\u0108\x02\x02\u03FF\u0400\x07" +
    "\r\x02\x02\u0400\u042B\x03\x02\x02\x02\u0401\u0402\x07}\x02\x02\u0402" +
    "\u0403\x07\f\x02\x02\u0403\u0404\x05\xBA^\x02\u0404\u0405\x07\n\x02\x02" +
    "\u0405\u0406\x05\xBA^\x02\u0406\u0407\x07\n\x02\x02\u0407\u0408\x07\u0108" +
    "\x02\x02\u0408\u0409\x07\r\x02\x02\u0409\u042B\x03\x02\x02\x02\u040A\u040B" +
    "\x07|\x02\x02\u040B\u040C\x07\f\x02\x02\u040C\u040D\x05\xBA^\x02\u040D" +
    "\u040E\x07\n\x02\x02\u040E\u040F\x05\xBA^\x02\u040F\u0410\x07\n\x02\x02" +
    "\u0410\u0411\x07\u0108\x02\x02\u0411\u0412\x07\r\x02\x02\u0412\u042B\x03" +
    "\x02\x02\x02\u0413\u0414\x07\x80\x02\x02\u0414\u0415\x07\f\x02\x02\u0415" +
    "\u0416\x05\xBA^\x02\u0416\u0417\x07\n\x02\x02\u0417\u0418\x05\xBA^\x02" +
    "\u0418\u0419\x07\n\x02\x02\u0419\u041A\x07\u0108\x02\x02\u041A\u041B\x07" +
    "\r\x02\x02\u041B\u042B\x03\x02\x02\x02\u041C\u041D\x07x\x02\x02\u041D" +
    "\u041E\x07\f\x02\x02\u041E\u041F\x05\xBA^\x02\u041F\u0420\x07\n\x02\x02" +
    "\u0420\u0421\x07\u0108\x02\x02\u0421\u0422\x07\r\x02\x02\u0422\u042B\x03" +
    "\x02\x02\x02\u0423\u0424\x07y\x02\x02\u0424\u0425\x07\f\x02\x02\u0425" +
    "\u0426\x05\xBA^\x02\u0426\u0427\x07\n\x02\x02\u0427\u0428\x07\u0108\x02" +
    "\x02\u0428\u0429\x07\r\x02\x02\u0429\u042B\x03\x02\x02\x02\u042A\u03C6" +
    "\x03\x02\x02\x02\u042A\u03CF\x03\x02\x02\x02\u042A\u03D6\x03\x02\x02\x02" +
    "\u042A\u03DF\x03\x02\x02\x02\u042A\u03E8\x03\x02\x02\x02\u042A\u03EF\x03" +
    "\x02\x02\x02\u042A\u03F8\x03\x02\x02\x02\u042A\u0401\x03\x02\x02\x02\u042A" +
    "\u040A\x03\x02\x02\x02\u042A\u0413\x03\x02\x02\x02\u042A\u041C\x03\x02" +
    "\x02\x02\u042A\u0423\x03\x02\x02\x02\u042B\xA5\x03\x02\x02\x02\u042C\u042D" +
    "\x05\xE4s\x02\u042D\u042E\x07\x19\x02\x02\u042E\u042F\x05\xA8U\x02\u042F" +
    "\u0448\x03\x02\x02\x02\u0430\u0431\x05\xE4s\x02\u0431\u0432\x07\x19\x02" +
    "\x02\u0432\u0433\x05\xAAV\x02\u0433\u0448\x03\x02\x02\x02\u0434\u0435" +
    "\x05\xE4s\x02\u0435\u0436\x07\x19\x02\x02\u0436\u0437\x07\x1C\x02\x02" +
    "\u0437\u0438\x07\f\x02\x02\u0438\u043B\x05\xBA^\x02\u0439\u043A\x07\n" +
    "\x02\x02\u043A\u043C\x05\xBA^\x02\u043B\u0439\x03\x02\x02\x02\u043B\u043C" +
    "\x03\x02\x02\x02\u043C\u043D\x03\x02\x02\x02\u043D\u043E\x07\r\x02\x02" +
    "\u043E\u0448\x03\x02\x02\x02\u043F\u0440\x05\xE4s\x02\u0440\u0441\x07" +
    "\x19\x02\x02\u0441\u0442\x05\xACW\x02\u0442\u0448\x03\x02\x02\x02\u0443" +
    "\u0444\x05\xE4s\x02\u0444\u0445\x07\x19\x02\x02\u0445\u0446\x05\xAEX\x02" +
    "\u0446\u0448\x03\x02\x02\x02\u0447\u042C\x03\x02\x02\x02\u0447\u0430\x03" +
    "\x02\x02\x02\u0447\u0434\x03\x02\x02\x02\u0447\u043F\x03\x02\x02\x02\u0447" +
    "\u0443\x03\x02\x02\x02\u0448\xA7\x03\x02\x02\x02\u0449\u044A\x07%\x02" +
    "\x02\u044A\u044B\x07\f\x02\x02\u044B\u046F\x07\r\x02\x02\u044C\u044D\x07" +
    "&\x02\x02\u044D\u044E\x07\f\x02\x02\u044E\u044F\x05\xBA^\x02\u044F\u0450" +
    "\x07\r\x02\x02\u0450\u046F\x03\x02\x02\x02\u0451\u0452\x07\'\x02\x02\u0452" +
    "\u0453\x07\f\x02\x02\u0453\u0454\x05\xBA^\x02\u0454\u0455\x07\r\x02\x02" +
    "\u0455\u046F\x03\x02\x02\x02\u0456\u0457\x07(\x02\x02\u0457\u0459\x07" +
    "\f\x02\x02\u0458\u045A\x07\u0108\x02\x02\u0459\u0458\x03\x02\x02\x02\u0459" +
    "\u045A\x03\x02\x02\x02\u045A\u045B\x03\x02\x02\x02\u045B\u046F\x07\r\x02" +
    "\x02\u045C\u045D\x07)\x02\x02\u045D\u045F\x07\f\x02\x02\u045E\u0460\x07" +
    "\u0108\x02\x02\u045F\u045E\x03\x02\x02\x02\u045F\u0460\x03\x02\x02\x02" +
    "\u0460\u0461\x03\x02\x02\x02\u0461\u046F\x07\r\x02\x02\u0462\u0463\x07" +
    "*\x02\x02\u0463\u0464\x07\f\x02\x02\u0464\u0465\x05\xBA^\x02\u0465\u0466" +
    "\x07\n\x02\x02\u0466\u0467\x05\xBA^\x02\u0467\u0468\x07\r\x02\x02\u0468" +
    "\u046F\x03\x02\x02\x02\u0469\u046A\x07+\x02\x02\u046A\u046B\x07\f\x02" +
    "\x02\u046B\u046C\x05\xBA^\x02\u046C\u046D\x07\r\x02\x02\u046D\u046F\x03" +
    "\x02\x02\x02\u046E\u0449\x03\x02\x02\x02\u046E\u044C\x03\x02\x02\x02\u046E" +
    "\u0451\x03\x02\x02\x02\u046E\u0456\x03\x02\x02\x02\u046E\u045C\x03\x02" +
    "\x02\x02\u046E\u0462\x03\x02\x02\x02\u046E\u0469\x03\x02\x02\x02\u046F" +
    "\xA9\x03\x02\x02\x02\u0470\u0471\x07\x1F\x02\x02\u0471\u0472\x07\f\x02" +
    "\x02\u0472\u0473\x07\u0108\x02\x02\u0473\u0474\x07\n\x02\x02\u0474\u0475" +
    "\x07\u0108\x02\x02\u0475\u0476\x07\n\x02\x02\u0476\u0477\x07\u0108\x02" +
    "\x02\u0477\u0478\x07\n\x02\x02\u0478\u0479\x07\u0108\x02\x02\u0479\u047A" +
    "\x07\r\x02\x02\u047A\xAB\x03\x02\x02\x02\u047B\u047C\x07\x1B\x02\x02\u047C" +
    "\u047D\x07\f\x02\x02\u047D\u047E\x07\r\x02\x02\u047E\xAD\x03\x02\x02\x02" +
    "\u047F\u0480\x07\x1A\x02\x02\u0480\u0481\x07\f\x02\x02\u0481\u0482\x07" +
    "\r\x02\x02\u0482\xAF\x03\x02\x02\x02\u0483\u0484\x07\u0104\x02\x02\u0484" +
    "\u0485\x07\x19\x02\x02\u0485\u0486\x073\x02\x02\u0486\u0487\x07\f\x02" +
    "\x02\u0487\u0490\x07\r\x02\x02\u0488\u0489\x07\u0104\x02\x02\u0489\u048A" +
    "\x07\x10\x02\x02\u048A\u048B\x078\x02\x02\u048B\u048C\x07\f\x02\x02\u048C" +
    "\u048D\x05\xBA^\x02\u048D\u048E\x07\r\x02\x02\u048E\u0490\x03\x02\x02" +
    "\x02\u048F\u0483\x03\x02\x02\x02\u048F\u0488\x03\x02\x02\x02\u0490\xB1" +
    "\x03\x02\x02\x02\u0491\u0492\x07Y\x02\x02\u0492\u0493\x07\f\x02\x02\u0493" +
    "\u0494\x05\xBA^\x02\u0494\u0495\x07\r\x02\x02\u0495\u053D\x03\x02\x02" +
    "\x02\u0496\u0497\x07Y\x02\x02\u0497\u0498\x07\f\x02\x02\u0498\u0499\x07" +
    "\u0108\x02\x02\u0499\u049A\x07\n\x02\x02\u049A\u049B\x05\xBA^\x02\u049B" +
    "\u049C\x07\r\x02\x02\u049C\u053D\x03\x02\x02\x02\u049D\u049E\x07Z\x02" +
    "\x02\u049E\u049F\x07\f\x02\x02\u049F\u04A0\x05\xBA^\x02\u04A0\u04A1\x07" +
    "\r\x02\x02\u04A1\u053D\x03\x02\x02\x02\u04A2\u04A3\x07X\x02\x02\u04A3" +
    "\u04A4\x07\f\x02\x02\u04A4\u04A5\x05\xBA^\x02\u04A5\u04A6\x07\r\x02\x02" +
    "\u04A6\u053D\x03\x02\x02\x02\u04A7\u04A8\x07U\x02\x02\u04A8\u04A9\x07" +
    "\f\x02\x02\u04A9\u04AC\x07\u0108\x02\x02\u04AA\u04AB\x07\n\x02\x02\u04AB" +
    "\u04AD\x07\u0108\x02\x02\u04AC\u04AA\x03\x02\x02\x02\u04AC\u04AD\x03\x02" +
    "\x02\x02\u04AD\u04AE\x03\x02\x02\x02\u04AE\u053D\x07\r\x02\x02\u04AF\u04B0" +
    "\x07V\x02\x02\u04B0\u04B1\x07\f\x02\x02\u04B1\u04B4\x07\u0108\x02\x02" +
    "\u04B2\u04B3\x07\n\x02\x02\u04B3\u04B5\x07\u0108\x02\x02\u04B4\u04B2\x03" +
    "\x02\x02\x02\u04B4\u04B5\x03\x02\x02\x02\u04B5\u04B6\x03\x02\x02\x02\u04B6" +
    "\u053D\x07\r\x02\x02\u04B7\u04B8\x07W\x02\x02\u04B8\u04B9\x07\f\x02\x02" +
    "\u04B9\u04BC\x07\u0108\x02\x02\u04BA\u04BB\x07\n\x02\x02\u04BB\u04BD\x07" +
    "\u0108\x02\x02\u04BC\u04BA\x03\x02\x02\x02\u04BC\u04BD\x03\x02\x02\x02" +
    "\u04BD\u04BE\x03\x02\x02\x02\u04BE\u053D\x07\r\x02\x02\u04BF\u04C0\x07" +
    "]\x02\x02\u04C0\u04C1\x07\f\x02\x02\u04C1\u04C2\x05\xBA^\x02\u04C2\u04C3" +
    "\x07\n\x02\x02\u04C3\u04C4\x07\u0108\x02\x02\u04C4\u04C5\x07\n\x02\x02" +
    "\u04C5\u04C8\x07\u0108\x02\x02\u04C6\u04C7\x07\n\x02\x02\u04C7\u04C9\x05" +
    "\xBA^\x02\u04C8\u04C6\x03\x02\x02\x02\u04C8\u04C9\x03\x02\x02\x02\u04C9" +
    "\u04CA\x03\x02\x02\x02\u04CA\u04CB\x07\r\x02\x02\u04CB\u053D\x03\x02\x02" +
    "\x02\u04CC\u04CD\x07^\x02\x02\u04CD\u04CE\x07\f\x02\x02\u04CE\u04CF\x05" +
    "\xBA^\x02\u04CF\u04D0\x07\n\x02\x02\u04D0\u04D1\x07\u0108\x02\x02\u04D1" +
    "\u04D2\x07\n\x02\x02\u04D2\u04D5\x07\u0108\x02\x02\u04D3\u04D4\x07\n\x02" +
    "\x02\u04D4\u04D6\x05\xBA^\x02\u04D5\u04D3\x03\x02\x02\x02\u04D5\u04D6" +
    "\x03\x02\x02\x02\u04D6\u04D7\x03\x02\x02\x02\u04D7\u04D8\x07\r\x02\x02" +
    "\u04D8\u053D\x03\x02\x02\x02\u04D9\u04DA\x07_\x02\x02\u04DA\u04DB\x07" +
    "\f\x02\x02\u04DB\u04DC\x05\xBA^\x02\u04DC\u04DD\x07\r\x02\x02\u04DD\u053D" +
    "\x03\x02\x02\x02\u04DE\u04DF\x07a\x02\x02\u04DF\u04E0\x07\f\x02\x02\u04E0" +
    "\u04E1\x05\xBA^\x02\u04E1\u04E2\x07\n\x02\x02\u04E2\u04E3\x07\u0108\x02" +
    "\x02\u04E3\u04E4\x07\n\x02\x02\u04E4\u04E5\x07\u0108\x02\x02\u04E5\u04E6" +
    "\x07\n\x02\x02\u04E6\u04EA\x07\u0108\x02\x02\u04E7\u04E9\x05\xB6\\\x02" +
    "\u04E8\u04E7\x03\x02\x02\x02\u04E9\u04EC\x03\x02\x02\x02\u04EA\u04E8\x03" +
    "\x02\x02\x02\u04EA\u04EB\x03\x02\x02\x02\u04EB\u04EF\x03\x02\x02\x02\u04EC" +
    "\u04EA\x03\x02\x02\x02\u04ED\u04EE\x07\n\x02\x02\u04EE\u04F0\x05\xD6l" +
    "\x02\u04EF\u04ED\x03\x02\x02\x02\u04EF\u04F0\x03\x02\x02\x02\u04F0\u04F1" +
    "\x03\x02\x02\x02\u04F1\u04F2\x07\r\x02\x02\u04F2\u053D\x03\x02\x02\x02" +
    "\u04F3\u04F4\x07b\x02\x02\u04F4\u04F5\x07\f\x02\x02\u04F5\u04F6\x05\xBA" +
    "^\x02\u04F6\u04F7\x07\n\x02\x02\u04F7\u04F8\x07\u0108\x02\x02\u04F8\u04F9" +
    "\x07\n\x02\x02\u04F9\u04FA\x07\u0108\x02\x02\u04FA\u04FB\x07\n\x02\x02" +
    "\u04FB\u04FD\x07\u0108\x02\x02\u04FC\u04FE\x05\xB4[\x02\u04FD\u04FC\x03" +
    "\x02\x02\x02\u04FE\u04FF\x03\x02\x02\x02\u04FF\u04FD\x03\x02\x02\x02\u04FF" +
    "\u0500\x03\x02\x02\x02\u0500\u0503\x03\x02\x02\x02\u0501\u0502\x07\n\x02" +
    "\x02\u0502\u0504\x05\xD6l\x02\u0503\u0501\x03\x02\x02\x02\u0503\u0504" +
    "\x03\x02\x02\x02\u0504\u0505\x03\x02\x02\x02\u0505\u0506\x07\r\x02\x02" +
    "\u0506\u053D\x03\x02\x02\x02\u0507\u0508\x07c\x02\x02\u0508\u0509\x07" +
    "\f\x02\x02\u0509\u050A\x05\xBA^\x02\u050A\u050B\x07\n\x02\x02\u050B\u050C" +
    "\x05\xBA^\x02\u050C\u050D\x07\n\x02\x02\u050D\u050E\x07\u0108\x02\x02" +
    "\u050E\u050F\x07\n\x02\x02\u050F\u0510\x07\u0108\x02\x02\u0510\u0511\x07" +
    "\n\x02\x02\u0511\u0514\x07\u0108\x02\x02\u0512\u0513\x07\n\x02\x02\u0513" +
    "\u0515\x05\xBA^\x02\u0514\u0512\x03\x02\x02\x02\u0514\u0515\x03\x02\x02" +
    "\x02\u0515\u0516\x03\x02\x02\x02\u0516\u0517\x07\r\x02\x02\u0517\u053D" +
    "\x03\x02\x02\x02\u0518\u0519\x07f\x02\x02\u0519\u051A\x07\f\x02\x02\u051A" +
    "\u051B\x05\xBA^\x02\u051B\u051C\x07\r\x02\x02\u051C\u053D\x03\x02\x02" +
    "\x02\u051D\u051E\x07i\x02\x02\u051E\u051F\x07\f\x02\x02\u051F\u0520\x05" +
    "\xBA^\x02\u0520\u0521\x07\n\x02\x02\u0521\u0522\x05\xBA^\x02\u0522\u0523" +
    "\x07\r\x02\x02\u0523\u053D\x03\x02\x02\x02\u0524\u0525\x07l\x02\x02\u0525" +
    "\u0526\x07\f\x02\x02\u0526\u0527\x05\xBA^\x02\u0527\u0528\x07\n\x02\x02" +
    "\u0528\u0529\x05\xBA^\x02\u0529\u052A\x07\n\x02\x02\u052A\u052D\x05\xBA" +
    "^\x02\u052B\u052C\x07\n\x02\x02\u052C\u052E\x05\xBA^\x02\u052D\u052B\x03" +
    "\x02\x02\x02\u052D\u052E\x03\x02\x02\x02\u052E\u052F\x03\x02\x02\x02\u052F" +
    "\u0530\x07\r\x02\x02\u0530\u053D\x03\x02\x02\x02\u0531\u0532\x07n\x02" +
    "\x02\u0532\u0533\x07\f\x02\x02\u0533\u0534\x05\xBA^\x02\u0534\u0535\x07" +
    "\n\x02\x02\u0535\u0538\x07\u0108\x02\x02\u0536\u0537\x07\n\x02\x02\u0537" +
    "\u0539\x05\xBA^\x02\u0538\u0536\x03\x02\x02\x02\u0538\u0539\x03\x02\x02" +
    "\x02\u0539\u053A\x03\x02\x02\x02\u053A\u053B\x07\r\x02\x02\u053B\u053D" +
    "\x03\x02\x02\x02\u053C\u0491\x03\x02\x02\x02\u053C\u0496\x03\x02\x02\x02" +
    "\u053C\u049D\x03\x02\x02\x02\u053C\u04A2\x03\x02\x02\x02\u053C\u04A7\x03" +
    "\x02\x02\x02\u053C\u04AF\x03\x02\x02\x02\u053C\u04B7\x03\x02\x02\x02\u053C" +
    "\u04BF\x03\x02\x02\x02\u053C\u04CC\x03\x02\x02\x02\u053C\u04D9\x03\x02" +
    "\x02\x02\u053C\u04DE\x03\x02\x02\x02\u053C\u04F3\x03\x02\x02\x02\u053C" +
    "\u0507\x03\x02\x02\x02\u053C\u0518\x03\x02\x02\x02\u053C\u051D\x03\x02" +
    "\x02\x02\u053C\u0524\x03\x02\x02\x02\u053C\u0531\x03\x02\x02\x02\u053D" +
    "\xB3\x03\x02\x02\x02\u053E\u053F\x07\n\x02\x02\u053F\u0540\x07\x06\x02" +
    "\x02\u0540\u0541\x07\u0108\x02\x02\u0541\u0542\x07\n\x02\x02\u0542\u0543" +
    "\x05\xDAn\x02\u0543\u0544\x07\x07\x02\x02\u0544\xB5\x03\x02\x02\x02\u0545" +
    "\u0546\x07\n\x02\x02\u0546\u0547\x07\u0108\x02\x02\u0547\xB7\x03\x02\x02" +
    "\x02\u0548\u0549\x05\xE4s\x02\u0549\u054A\x07\xE5\x02\x02\u054A\u054B" +
    "\x05\xBA^\x02\u054B\xB9\x03\x02\x02\x02\u054C\u054D\x05\xBC_\x02\u054D" +
    "\xBB\x03\x02\x02\x02\u054E\u0553\x05\xBE`\x02\u054F\u0550\x07\xEF\x02" +
    "\x02\u0550\u0552\x05\xBE`\x02\u0551\u054F\x03\x02\x02\x02\u0552\u0555" +
    "\x03\x02\x02\x02\u0553\u0551\x03\x02\x02\x02\u0553\u0554\x03\x02\x02\x02" +
    "\u0554\xBD\x03\x02\x02\x02\u0555\u0553\x03\x02\x02\x02\u0556\u055B\x05" +
    "\xC0a\x02\u0557\u0558\x07\xF0\x02\x02\u0558\u055A\x05\xC0a\x02\u0559\u0557" +
    "\x03\x02\x02\x02\u055A\u055D\x03\x02\x02\x02\u055B\u0559\x03\x02\x02\x02" +
    "\u055B\u055C\x03\x02\x02\x02\u055C\xBF\x03\x02\x02\x02\u055D\u055B\x03" +
    "\x02\x02\x02\u055E\u0564\x05\xC2b\x02\u055F\u0560\x05\xC6d\x02\u0560\u0561" +
    "\x05\xC2b\x02\u0561\u0563\x03\x02\x02\x02\u0562\u055F\x03\x02\x02\x02" +
    "\u0563\u0566\x03\x02\x02\x02\u0564\u0562\x03\x02\x02\x02\u0564\u0565\x03" +
    "\x02\x02\x02\u0565\xC1\x03\x02\x02\x02\u0566\u0564\x03\x02\x02\x02\u0567" +
    "\u056D\x05\xC8e\x02\u0568\u0569\x05\xC4c\x02\u0569\u056A\x05\xC8e\x02" +
    "\u056A\u056C\x03\x02\x02\x02\u056B\u0568\x03\x02\x02\x02\u056C\u056F\x03" +
    "\x02\x02\x02\u056D\u056B\x03\x02\x02\x02\u056D\u056E\x03\x02\x02\x02\u056E" +
    "\xC3\x03\x02\x02\x02\u056F\u056D\x03\x02\x02\x02\u0570\u0571\t\x04\x02" +
    "\x02\u0571\xC5\x03\x02\x02\x02\u0572\u0573\t\x05\x02\x02\u0573\xC7\x03" +
    "\x02\x02\x02\u0574\u057A\x05\xCCg\x02\u0575\u0576\x05\xCAf\x02\u0576\u0577" +
    "\x05\xCCg\x02\u0577\u0579\x03\x02\x02\x02\u0578\u0575\x03\x02\x02\x02" +
    "\u0579\u057C\x03\x02\x02\x02\u057A\u0578\x03\x02\x02\x02\u057A\u057B\x03" +
    "\x02\x02\x02\u057B\xC9\x03\x02\x02\x02\u057C\u057A\x03\x02\x02\x02\u057D" +
    "\u057E\t\x06\x02\x02\u057E\xCB\x03\x02\x02\x02\u057F\u0585\x05\xD0i\x02" +
    "\u0580\u0581\x05\xCEh\x02\u0581\u0582\x05\xD0i\x02\u0582\u0584\x03\x02" +
    "\x02\x02\u0583\u0580\x03\x02\x02\x02\u0584\u0587\x03\x02\x02\x02\u0585" +
    "\u0583\x03\x02\x02\x02\u0585\u0586\x03\x02\x02\x02\u0586\xCD\x03\x02\x02" +
    "\x02\u0587\u0585\x03\x02\x02\x02\u0588\u0589\t\x07\x02\x02\u0589\xCF\x03" +
    "\x02\x02\x02\u058A\u058B\x07\xF4\x02\x02\u058B\u058E\x05\xD2j\x02\u058C" +
    "\u058E\x05\xD2j\x02\u058D\u058A\x03\x02\x02\x02\u058D\u058C\x03\x02\x02" +
    "\x02\u058E\xD1\x03\x02\x02\x02\u058F\u059B\x05\xD4k\x02\u0590\u059B\x05" +
    "\xD6l\x02\u0591\u059B\x05\xDAn\x02\u0592\u059B\x05\xE4s\x02\u0593\u059B" +
    "\x05\xEAv\x02\u0594\u059B\x05\xE6t\x02\u0595\u059B\x05\xE8u\x02\u0596" +
    "\u0597\x07\f\x02\x02\u0597\u0598\x05\xBA^\x02\u0598\u0599\x07\r\x02\x02" +
    "\u0599\u059B\x03\x02\x02\x02\u059A\u058F\x03\x02\x02\x02\u059A\u0590\x03" +
    "\x02\x02\x02\u059A\u0591\x03\x02\x02\x02\u059A\u0592\x03\x02\x02\x02\u059A" +
    "\u0593\x03\x02\x02\x02\u059A\u0594\x03\x02\x02\x02\u059A\u0595\x03\x02" +
    "\x02\x02\u059A\u0596\x03\x02\x02\x02\u059B\xD3\x03\x02\x02\x02\u059C\u059D" +
    "\t\b\x02\x02\u059D\xD5\x03\x02\x02\x02\u059E\u05AD\x07\u0103\x02\x02\u059F" +
    "\u05A0\x07\x19\x02\x02\u05A0\u05AE\x05\xD8m\x02\u05A1\u05AA\x07\x06\x02" +
    "\x02\u05A2\u05A7\x05\xD8m\x02\u05A3\u05A4\x07\n\x02\x02\u05A4\u05A6\x05" +
    "\xD8m\x02\u05A5\u05A3\x03\x02\x02\x02\u05A6\u05A9\x03\x02\x02\x02\u05A7" +
    "\u05A5\x03\x02\x02\x02\u05A7\u05A8\x03\x02\x02\x02\u05A8\u05AB\x03\x02" +
    "\x02\x02\u05A9\u05A7\x03\x02\x02\x02\u05AA\u05A2\x03\x02\x02\x02\u05AA" +
    "\u05AB\x03\x02\x02\x02\u05AB\u05AC\x03\x02\x02\x02\u05AC\u05AE\x07\x07" +
    "\x02\x02\u05AD\u059F\x03\x02\x02\x02\u05AD\u05A1\x03\x02\x02\x02\u05AE" +
    "\xD7\x03\x02\x02\x02\u05AF\u05B0\x07\u0104\x02\x02\u05B0\xD9\x03\x02\x02" +
    "\x02\u05B1\u05B2\x07\u0104\x02\x02\u05B2\u05B4\x07\x10\x02\x02\u05B3\u05B1" +
    "\x03\x02\x02\x02\u05B3\u05B4\x03\x02\x02\x02\u05B4\u05B5\x03\x02\x02\x02" +
    "\u05B5\u05B6\x05r:\x02\u05B6\u05BF\x07\f\x02\x02\u05B7\u05BC\x05\xBA^" +
    "\x02\u05B8\u05B9\x07\n\x02\x02\u05B9\u05BB\x05\xBA^\x02\u05BA\u05B8\x03" +
    "\x02\x02\x02\u05BB\u05BE\x03\x02\x02\x02\u05BC\u05BA\x03\x02\x02\x02\u05BC" +
    "\u05BD\x03\x02\x02\x02\u05BD\u05C0\x03\x02\x02\x02\u05BE\u05BC\x03\x02" +
    "\x02\x02\u05BF\u05B7\x03\x02\x02\x02\u05BF\u05C0\x03\x02\x02\x02\u05C0" +
    "\u05C1\x03\x02\x02\x02\u05C1\u05C2\x07\r\x02\x02\u05C2\u05D5\x03\x02\x02" +
    "\x02\u05C3\u05C4\x07\u0104\x02\x02\u05C4\u05C6\x07\x10\x02\x02\u05C5\u05C3" +
    "\x03\x02\x02\x02\u05C5\u05C6\x03\x02\x02\x02\u05C6\u05C7\x03\x02\x02\x02" +
    "\u05C7\u05C8\x07\u0104\x02\x02\u05C8\u05D1\x07\f\x02\x02\u05C9\u05CE\x05" +
    "\xBA^\x02\u05CA\u05CB\x07\n\x02\x02\u05CB\u05CD\x05\xBA^\x02\u05CC\u05CA" +
    "\x03\x02\x02\x02\u05CD\u05D0\x03\x02\x02\x02\u05CE\u05CC\x03\x02\x02\x02" +
    "\u05CE\u05CF\x03\x02\x02\x02\u05CF\u05D2\x03\x02\x02\x02\u05D0\u05CE\x03" +
    "\x02\x02\x02\u05D1\u05C9\x03\x02\x02\x02\u05D1\u05D2\x03\x02\x02\x02\u05D2" +
    "\u05D3\x03\x02\x02\x02\u05D3\u05D5\x07\r\x02\x02\u05D4\u05B3\x03\x02\x02" +
    "\x02\u05D4\u05C5\x03\x02\x02\x02\u05D5\xDB\x03\x02\x02\x02\u05D6\u05D7" +
    "\x07\u0104\x02\x02\u05D7\u05D9\x07\x10\x02\x02\u05D8\u05D6\x03\x02\x02" +
    "\x02\u05D8\u05D9\x03\x02\x02\x02\u05D9\u05DA\x03\x02\x02\x02\u05DA\u05DF" +
    "\x07\u0104\x02\x02\u05DB\u05DC\x07\x19\x02\x02\u05DC\u05DE\x05\xDEp\x02" +
    "\u05DD\u05DB\x03\x02\x02\x02\u05DE\u05E1\x03\x02\x02\x02\u05DF\u05DD\x03" +
    "\x02\x02\x02\u05DF\u05E0\x03\x02\x02\x02\u05E0\xDD\x03\x02\x02\x02\u05E1" +
    "\u05DF\x03\x02\x02\x02\u05E2\u05E5\x05\xE0q\x02\u05E3\u05E5\x05\xE2r\x02" +
    "\u05E4\u05E2\x03\x02\x02\x02\u05E4\u05E3\x03\x02\x02\x02\u05E5\xDF\x03" +
    "\x02\x02\x02\u05E6\u05E7\x07\u0104\x02\x02\u05E7\u05EB\x07\f\x02\x02\u05E8" +
    "\u05EA\x05v<\x02\u05E9\u05E8\x03\x02\x02\x02\u05EA\u05ED\x03\x02\x02\x02" +
    "\u05EB\u05E9\x03\x02\x02\x02\u05EB\u05EC\x03\x02\x02\x02\u05EC\u05EE\x03" +
    "\x02\x02\x02\u05ED\u05EB\x03\x02\x02\x02\u05EE\u05EF\x07\r\x02\x02\u05EF" +
    "\xE1\x03\x02\x02\x02\u05F0\u05F1\x07\u0104\x02\x02\u05F1\xE3\x03\x02\x02" +
    "\x02\u05F2\u05F3\x07\u0104\x02\x02\u05F3\u05F4\x07\x19\x02\x02\u05F4\u05FF" +
    "\x07\u0104\x02\x02\u05F5\u05F6\x07\u0104\x02\x02\u05F6\u05F7\x07\x10\x02" +
    "\x02\u05F7\u05F8\x07\u0104\x02\x02\u05F8\u05F9\x07\x19\x02\x02\u05F9\u05FF" +
    "\x07\u0104\x02\x02\u05FA\u05FF\x07\u0104\x02\x02\u05FB\u05FC\x07\u0104" +
    "\x02\x02\u05FC\u05FD\x07\x10\x02\x02\u05FD\u05FF\x07\u0104\x02\x02\u05FE" +
    "\u05F2\x03\x02\x02\x02\u05FE\u05F5\x03\x02\x02\x02\u05FE\u05FA\x03\x02" +
    "\x02\x02\u05FE\u05FB\x03\x02\x02\x02\u05FF\xE5\x03\x02\x02\x02\u0600\u0601" +
    "\x07\u0104\x02\x02\u0601\u0602\x07\xF1\x02\x02\u0602\xE7\x03\x02\x02\x02" +
    "\u0603\u0604\x07\u0104\x02\x02\u0604\u0605\x07\xF2\x02\x02\u0605\xE9\x03" +
    "\x02\x02\x02\u0606\u0607\x07\u0104\x02\x02\u0607\u0608\x07\x10\x02\x02" +
    "\u0608\u061B\x05\u016E\xB8\x02\u0609\u061B\x05\xF4{\x02\u060A\u061B\x05" +
    "\xFC\x7F\x02\u060B\u061B\x05\xF2z\x02\u060C\u061B\x05\xFE\x80\x02\u060D" +
    "\u061B\x05\u0106\x84\x02\u060E\u061B\x05\xF6|\x02\u060F\u061B\x05\u0130" +
    "\x99\x02\u0610\u061B\x05\u014E\xA8\x02\u0611\u061B\x05\u0156\xAC\x02\u0612" +
    "\u061B\x05\u015E\xB0\x02\u0613\u061B\x05\u0152\xAA\x02\u0614\u061B\x05" +
    "\u015A\xAE\x02\u0615\u061B\x05\u0166\xB4\x02\u0616\u061B\x05\xECw\x02" +
    "\u0617\u061B\x05\u016A\xB6\x02\u0618\u061B\x05\xF0y\x02\u0619\u061B\x05" +
    "\xF8}\x02\u061A\u0606\x03\x02\x02\x02\u061A\u0609\x03\x02\x02\x02\u061A" +
    "\u060A\x03\x02\x02\x02\u061A\u060B\x03\x02\x02\x02\u061A\u060C\x03\x02" +
    "\x02\x02\u061A\u060D\x03\x02\x02\x02\u061A\u060E\x03\x02\x02\x02\u061A" +
    "\u060F\x03\x02\x02\x02\u061A\u0610\x03\x02\x02\x02\u061A\u0611\x03\x02" +
    "\x02\x02\u061A\u0612\x03\x02\x02\x02\u061A\u0613\x03\x02\x02\x02\u061A" +
    "\u0614\x03\x02\x02\x02\u061A\u0615\x03\x02\x02\x02\u061A\u0616\x03\x02" +
    "\x02\x02\u061A\u0617\x03\x02\x02\x02\u061A\u0618\x03\x02\x02\x02\u061A" +
    "\u0619\x03";
MezDSLParser._serializedATNSegment3 = "\x02\x02\x02\u061B\xEB\x03\x02\x02\x02\u061C\u061D\x05\xE4s\x02\u061D" +
    "\u061E\x07\x19\x02\x02\u061E\u061F\x07\x1D\x02\x02\u061F\u0620\x07\f\x02" +
    "\x02\u0620\u0621\x05\xBA^\x02\u0621\u0622\x07\n\x02\x02\u0622\u0623\x05" +
    "\xBA^\x02\u0623\u0624\x07\n\x02\x02\u0624\u0625\x05\xBA^\x02\u0625\u0626" +
    "\x07\r\x02\x02\u0626\u0637\x03\x02\x02\x02\u0627\u0628\x05\xE4s\x02\u0628" +
    "\u0629\x07\x19\x02\x02\u0629\u062A\x07\x1E\x02\x02\u062A\u062B\x07\f\x02" +
    "\x02\u062B\u062C\x05\xBA^\x02\u062C\u062D\x07\n\x02\x02\u062D\u062E\x05" +
    "\xBA^\x02\u062E\u062F\x07\n\x02\x02\u062F\u0630\x05\xBA^\x02\u0630\u0631" +
    "\x07\n\x02\x02\u0631\u0632\x05\xBA^\x02\u0632\u0633\x07\n\x02\x02\u0633" +
    "\u0634\x05\xBA^\x02\u0634\u0635\x07\r\x02\x02\u0635\u0637\x03\x02\x02" +
    "\x02\u0636\u061C\x03\x02\x02\x02\u0636\u0627\x03\x02\x02\x02\u0637\xED" +
    "\x03\x02\x02\x02\u0638\u0639\x05\xE4s\x02\u0639\u063A\x07\x19\x02\x02" +
    "\u063A\u063B\x07!\x02\x02\u063B\u063C\x07\f\x02\x02\u063C\u063D\x05\xBA" +
    "^\x02\u063D\u063E\x07\n\x02\x02\u063E\u063F\x05\xBA^\x02\u063F\u0640\x07" +
    "\r\x02\x02\u0640\u0649\x03\x02\x02\x02\u0641\u0642\x05\xE4s\x02\u0642" +
    "\u0643\x07\x19\x02\x02\u0643\u0644\x07\"\x02\x02\u0644\u0645\x07\f\x02" +
    "\x02\u0645\u0646\x05\xBA^\x02\u0646\u0647\x07\r\x02\x02\u0647\u0649\x03" +
    "\x02\x02\x02\u0648\u0638\x03\x02\x02\x02\u0648\u0641\x03\x02\x02\x02\u0649" +
    "\xEF\x03\x02\x02\x02\u064A\u064B\x05\xE4s\x02\u064B\u064C\x07\x19\x02" +
    "\x02\u064C\u064D\x07 \x02\x02\u064D\u064E\x07\f\x02\x02\u064E\u064F\x05" +
    "\xBA^\x02\u064F\u0658\x07\r\x02\x02\u0650\u0651\x07\x19\x02\x02\u0651" +
    "\u0652\x07 \x02\x02\u0652\u0653\x07\f\x02\x02\u0653\u0654\x05\xBA^\x02" +
    "\u0654\u0655\x07\r\x02\x02\u0655\u0657\x03\x02\x02\x02\u0656\u0650\x03" +
    "\x02\x02\x02\u0657\u065A\x03\x02\x02\x02\u0658\u0656\x03\x02\x02\x02\u0658" +
    "\u0659\x03\x02\x02\x02\u0659\u0669\x03\x02\x02\x02\u065A\u0658\x03\x02" +
    "\x02\x02\u065B\u065C\x05\xE4s\x02\u065C\u065D\x07\x19\x02\x02\u065D\u065E" +
    "\x07#\x02\x02\u065E\u065F\x07\f\x02\x02\u065F\u0660\x05\xBA^\x02\u0660" +
    "\u0661\x07\r\x02\x02\u0661\u0669\x03\x02\x02\x02\u0662\u0663\x05\xE4s" +
    "\x02\u0663\u0664\x07\x19\x02\x02\u0664\u0665\x07$\x02\x02\u0665\u0666" +
    "\x07\f\x02\x02\u0666\u0667\x07\r\x02\x02\u0667\u0669\x03\x02\x02\x02\u0668" +
    "\u064A\x03\x02\x02\x02\u0668\u065B\x03\x02\x02\x02\u0668\u0662\x03\x02" +
    "\x02\x02\u0669\xF1\x03\x02\x02\x02\u066A\u066B\x07t\x02\x02\u066B\u066C" +
    "\x07\f\x02\x02\u066C\u066D\x05\xBA^\x02\u066D\u066E\x07\n\x02\x02\u066E" +
    "\u066F\x05\xBA^\x02\u066F\u0670\x07\r\x02\x02\u0670\xF3\x03\x02\x02\x02" +
    "\u0671\u0672\x05\xE4s\x02\u0672\u0673\x07\x19\x02\x02\u0673\u0674\x07" +
    ",\x02\x02\u0674\u0675\x07\f\x02\x02\u0675\u0676\x07\r\x02\x02\u0676\u069E" +
    "\x03\x02\x02\x02\u0677\u0678\x05\xE4s\x02\u0678\u0679\x07\x19\x02\x02" +
    "\u0679\u067A\x07-\x02\x02\u067A\u067B\x07\f\x02\x02\u067B\u067C\x07\r" +
    "\x02\x02\u067C\u069E\x03\x02\x02\x02\u067D\u067E\x05\xE4s\x02\u067E\u067F" +
    "\x07\x19\x02\x02\u067F\u0680\x07.\x02\x02\u0680\u0681\x07\f\x02\x02\u0681" +
    "\u0682\x07\r\x02\x02\u0682\u069E\x03\x02\x02\x02\u0683\u0684\x05\xE4s" +
    "\x02\u0684\u0685\x07\x19\x02\x02\u0685\u0686\x07/\x02\x02\u0686\u0687" +
    "\x07\f\x02\x02\u0687\u0688\x07\r\x02\x02\u0688\u069E\x03\x02\x02\x02\u0689" +
    "\u068A\x05\xE4s\x02\u068A\u068B\x07\x19\x02\x02\u068B\u068C\x070\x02\x02" +
    "\u068C\u068D\x07\f\x02\x02\u068D\u068E\x07\r\x02\x02\u068E\u069E\x03\x02" +
    "\x02\x02\u068F\u0690\x05\xE4s\x02\u0690\u0691\x07\x19\x02\x02\u0691\u0692" +
    "\x071\x02\x02\u0692\u0693\x07\f\x02\x02\u0693\u0694\x05\xBA^\x02\u0694" +
    "\u0695\x07\r\x02\x02\u0695\u069E\x03\x02\x02\x02\u0696\u0697\x05\xE4s" +
    "\x02\u0697\u0698\x07\x19\x02\x02\u0698\u0699\x072\x02\x02\u0699\u069A" +
    "\x07\f\x02\x02\u069A\u069B\x05\u0172\xBA\x02\u069B\u069C\x07\r\x02\x02" +
    "\u069C\u069E\x03\x02\x02\x02\u069D\u0671\x03\x02\x02\x02\u069D\u0677\x03" +
    "\x02\x02\x02\u069D\u067D\x03\x02\x02\x02\u069D\u0683\x03\x02\x02\x02\u069D" +
    "\u0689\x03\x02\x02\x02\u069D\u068F\x03\x02\x02\x02\u069D\u0696\x03\x02" +
    "\x02\x02\u069E\xF5\x03\x02\x02\x02\u069F\u06A0\x07[\x02\x02\u06A0\u06A1" +
    "\x07\f\x02\x02\u06A1\u0704\x07\r\x02\x02\u06A2\u06A3\x07\\\x02\x02\u06A3" +
    "\u06A4\x07\f\x02\x02\u06A4\u0704\x07\r\x02\x02\u06A5\u06A6\x07e\x02\x02" +
    "\u06A6\u06A7\x07\f\x02\x02\u06A7\u0704\x07\r\x02\x02\u06A8\u06A9\x07]" +
    "\x02\x02\u06A9\u06AA\x07\f\x02\x02\u06AA\u06AB\x05\xBA^\x02\u06AB\u06AC" +
    "\x07\n\x02\x02\u06AC\u06AD\x07\u0108\x02\x02\u06AD\u06AE\x07\n\x02\x02" +
    "\u06AE\u06B1\x07\u0108\x02\x02\u06AF\u06B0\x07\n\x02\x02\u06B0\u06B2\x05" +
    "\xBA^\x02\u06B1\u06AF\x03\x02\x02\x02\u06B1\u06B2\x03\x02\x02\x02\u06B2" +
    "\u06B3\x03\x02\x02\x02\u06B3\u06B4\x07\r\x02\x02\u06B4\u0704\x03\x02\x02" +
    "\x02\u06B5\u06B6\x07^\x02\x02\u06B6\u06B7\x07\f\x02\x02\u06B7\u06B8\x05" +
    "\xBA^\x02\u06B8\u06B9\x07\n\x02\x02\u06B9\u06BA\x07\u0108\x02\x02\u06BA" +
    "\u06BB\x07\n\x02\x02\u06BB\u06BE\x07\u0108\x02\x02\u06BC\u06BD\x07\n\x02" +
    "\x02\u06BD\u06BF\x05\xBA^\x02\u06BE\u06BC\x03\x02\x02\x02\u06BE\u06BF" +
    "\x03\x02\x02\x02\u06BF\u06C0\x03\x02\x02\x02\u06C0\u06C1\x07\r\x02\x02" +
    "\u06C1\u0704\x03\x02\x02\x02\u06C2\u06C3\x07`\x02\x02\u06C3\u06C4\x07" +
    "\f\x02\x02\u06C4\u06C5\x05\xBA^\x02\u06C5\u06C6\x07\r\x02\x02\u06C6\u0704" +
    "\x03\x02\x02\x02\u06C7\u06C8\x07g\x02\x02\u06C8\u06C9\x07\f\x02\x02\u06C9" +
    "\u06CC\x05\xBA^\x02\u06CA\u06CB\x07\n\x02\x02\u06CB\u06CD\x05\xBA^\x02" +
    "\u06CC\u06CA\x03\x02\x02\x02\u06CC\u06CD\x03\x02\x02\x02\u06CD\u06CE\x03" +
    "\x02\x02\x02\u06CE\u06CF\x07\r\x02\x02\u06CF\u0704\x03\x02\x02\x02\u06D0" +
    "\u06D1\x07h\x02\x02\u06D1\u06D2\x07\f\x02\x02\u06D2\u06D5\x05\xBA^\x02" +
    "\u06D3\u06D4\x07\n\x02\x02\u06D4\u06D6\x05\xBA^\x02\u06D5\u06D3\x03\x02" +
    "\x02\x02\u06D5\u06D6\x03\x02\x02\x02\u06D6\u06D7\x03\x02\x02\x02\u06D7" +
    "\u06D8\x07\r\x02\x02\u06D8\u0704\x03\x02\x02\x02\u06D9\u06DA\x07m\x02" +
    "\x02\u06DA\u06DB\x07\f\x02\x02\u06DB\u06DC\x05\xBA^\x02\u06DC\u06DD\x07" +
    "\n\x02\x02\u06DD\u06DE\x05\xBA^\x02\u06DE\u06DF\x07\n\x02\x02\u06DF\u06E2" +
    "\x05\xBA^\x02\u06E0\u06E1\x07\n\x02\x02\u06E1\u06E3\x05\xBA^\x02\u06E2" +
    "\u06E0\x03\x02\x02\x02\u06E2\u06E3\x03\x02\x02\x02\u06E3\u06E4\x03\x02" +
    "\x02\x02\u06E4\u06E5\x07\r\x02\x02\u06E5\u0704\x03\x02\x02\x02\u06E6\u06E7" +
    "\x07j\x02\x02\u06E7\u06E8\x07\f\x02\x02\u06E8\u06E9\x05\xBA^\x02\u06E9" +
    "\u06EA\x07\n\x02\x02\u06EA\u06EB\x05\xBA^\x02\u06EB\u06EC\x07\n\x02\x02" +
    "\u06EC\u06ED\x05\xBA^\x02\u06ED\u06EE\x07\r\x02\x02\u06EE\u0704\x03\x02" +
    "\x02\x02\u06EF\u06F0\x07k\x02\x02\u06F0\u06F1\x07\f\x02\x02\u06F1\u06F2" +
    "\x05\xBA^\x02\u06F2\u06F3\x07\n\x02\x02\u06F3\u06F4\x05\xBA^\x02\u06F4" +
    "\u06F5\x07\n\x02\x02\u06F5\u06F6\x05\xBA^\x02\u06F6\u06F7\x07\r\x02\x02" +
    "\u06F7\u0704\x03\x02\x02\x02\u06F8\u06F9\x07d\x02\x02\u06F9\u06FA\x07" +
    "\f\x02\x02\u06FA\u06FB\x05\xBA^\x02\u06FB\u06FC\x07\n\x02\x02\u06FC\u06FF" +
    "\x05\xBA^\x02\u06FD\u06FE\x07\n\x02\x02\u06FE\u0700\x05\xBA^\x02\u06FF" +
    "\u06FD\x03\x02\x02\x02\u06FF\u0700\x03\x02\x02\x02\u0700\u0701\x03\x02" +
    "\x02\x02\u0701\u0702\x07\r\x02\x02\u0702\u0704\x03\x02\x02\x02\u0703\u069F" +
    "\x03\x02\x02\x02\u0703\u06A2\x03\x02\x02\x02\u0703\u06A5\x03\x02\x02\x02" +
    "\u0703\u06A8\x03\x02\x02\x02\u0703\u06B5\x03\x02\x02\x02\u0703\u06C2\x03" +
    "\x02\x02\x02\u0703\u06C7\x03\x02\x02\x02\u0703\u06D0\x03\x02\x02\x02\u0703" +
    "\u06D9\x03\x02\x02\x02\u0703\u06E6\x03\x02\x02\x02\u0703\u06EF\x03\x02" +
    "\x02\x02\u0703\u06F8\x03\x02\x02\x02\u0704\xF7\x03\x02\x02\x02\u0705\u0706" +
    "\x07o\x02\x02\u0706\u0707\x07\f\x02\x02\u0707\u0708\x05\xBA^\x02\u0708" +
    "\u0709\x07\r\x02\x02\u0709\u071A\x03\x02\x02\x02\u070A\u070B\x07p\x02" +
    "\x02\u070B\u070C\x07\f\x02\x02\u070C\u070D\x05\xBA^\x02\u070D\u070E\x07" +
    "\r\x02\x02\u070E\u071A\x03\x02\x02\x02\u070F\u0710\x07r\x02\x02\u0710" +
    "\u0711\x07\f\x02\x02\u0711\u0712\x05\xBA^\x02\u0712\u0713\x07\r\x02\x02" +
    "\u0713\u071A\x03\x02\x02\x02\u0714\u0715\x07q\x02\x02\u0715\u0716\x07" +
    "\f\x02\x02\u0716\u0717\x05\xBA^\x02\u0717\u0718\x07\r\x02\x02\u0718\u071A" +
    "\x03\x02\x02\x02\u0719\u0705\x03\x02\x02\x02\u0719\u070A\x03\x02\x02\x02" +
    "\u0719\u070F\x03\x02\x02\x02\u0719\u0714\x03\x02\x02\x02\u071A\xF9\x03" +
    "\x02\x02\x02\u071B\u071C\x07s\x02\x02\u071C\u071D\x07\f\x02\x02\u071D" +
    "\u071E\x05\xBA^\x02\u071E\u071F\x07\r\x02\x02\u071F\xFB\x03\x02\x02\x02" +
    "\u0720\u0721\x07\x9B\x02\x02\u0721\u0722\x07\f\x02\x02\u0722\u0723\x05" +
    "\xBA^\x02\u0723\u0724\x07\n\x02\x02\u0724\u0725\x05\xBA^\x02\u0725\u0726" +
    "\x07\r\x02\x02\u0726\u0745\x03\x02\x02\x02\u0727\u0728\x07\x9C\x02\x02" +
    "\u0728\u0729\x07\f\x02\x02\u0729\u072A\x05\xBA^\x02\u072A\u072B\x07\r" +
    "\x02\x02\u072B\u0745\x03\x02\x02\x02\u072C\u072D\x07\x9F\x02\x02\u072D" +
    "\u072E\x07\f\x02\x02\u072E\u072F\x05\xBA^\x02\u072F\u0730\x07\r\x02\x02" +
    "\u0730\u0745\x03\x02\x02\x02\u0731\u0732\x07\x9E\x02\x02\u0732\u0733\x07" +
    "\f\x02\x02\u0733\u0734\x05\xBA^\x02\u0734\u0735\x07\r\x02\x02\u0735\u0745" +
    "\x03\x02\x02\x02\u0736\u0737\x07\xA0\x02\x02\u0737\u0738\x07\f\x02\x02" +
    "\u0738\u0739\x05\xBA^\x02\u0739\u073A\x07\n\x02\x02\u073A\u073D\x05\xBA" +
    "^\x02\u073B\u073C\x07\n\x02\x02\u073C\u073E\x05\xBA^\x02\u073D\u073B\x03" +
    "\x02\x02\x02\u073D\u073E\x03\x02\x02\x02\u073E\u073F\x03\x02\x02\x02\u073F" +
    "\u0740\x07\r\x02\x02\u0740\u0745\x03\x02\x02\x02\u0741\u0742\x07\x9D\x02" +
    "\x02\u0742\u0743\x07\f\x02\x02\u0743\u0745\x07\r\x02\x02\u0744\u0720\x03" +
    "\x02\x02\x02\u0744\u0727\x03\x02\x02\x02\u0744\u072C\x03\x02\x02\x02\u0744" +
    "\u0731\x03\x02\x02\x02\u0744\u0736\x03\x02\x02\x02\u0744\u0741\x03\x02" +
    "\x02\x02\u0745\xFD\x03\x02\x02\x02\u0746\u074A\x05\u0100\x81\x02\u0747" +
    "\u074A\x05\u0102\x82\x02\u0748\u074A\x05\u0104\x83\x02\u0749\u0746\x03" +
    "\x02\x02\x02\u0749\u0747\x03\x02\x02\x02\u0749\u0748\x03\x02\x02\x02\u074A" +
    "\xFF\x03\x02\x02\x02\u074B\u074C\x07\xA1\x02\x02\u074C\u074D\x07\f\x02" +
    "\x02\u074D\u0750\x05\xBA^\x02\u074E\u074F\x07\n\x02\x02\u074F\u0751\x05" +
    "\xBA^\x02\u0750\u074E\x03\x02\x02\x02\u0751\u0752\x03\x02\x02\x02\u0752" +
    "\u0750\x03\x02\x02\x02\u0752\u0753\x03\x02\x02\x02\u0753\u0754\x03\x02" +
    "\x02\x02\u0754\u0755\x07\r\x02\x02\u0755\u0101\x03\x02\x02\x02\u0756\u0757" +
    "\x07\xA2\x02\x02\u0757\u0758\x07\f\x02\x02\u0758\u0759\x05\xBA^\x02\u0759" +
    "\u075A\x07\r\x02\x02\u075A\u0103\x03\x02\x02\x02\u075B\u075C\x07\xA3\x02" +
    "\x02\u075C\u075D\x07\f\x02\x02\u075D\u075E\x05\xBA^\x02\u075E\u075F\x07" +
    "\n\x02\x02\u075F\u0760\x05\xBA^\x02\u0760\u0761\x07\r\x02\x02\u0761\u0105" +
    "\x03\x02\x02\x02\u0762\u0777\x05\u010A\x86\x02\u0763\u0777\x05\u010C\x87" +
    "\x02\u0764\u0777\x05\u010E\x88\x02\u0765\u0777\x05\u0110\x89\x02\u0766" +
    "\u0777\x05\u0112\x8A\x02\u0767\u0777\x05\u0114\x8B\x02\u0768\u0777\x05" +
    "\u011C\x8F\x02\u0769\u0777\x05\u0116\x8C\x02\u076A\u0777\x05\u0118\x8D" +
    "\x02\u076B\u0777\x05\u011A\x8E\x02\u076C\u0777\x05\u0108\x85\x02\u076D" +
    "\u0777\x05\u011E\x90\x02\u076E\u0777\x05\u0120\x91\x02\u076F\u0777\x05" +
    "\u0122\x92\x02\u0770\u0777\x05\u0124\x93\x02\u0771\u0777\x05\u0126\x94" +
    "\x02\u0772\u0777\x05\u0128\x95\x02\u0773\u0777\x05\u012A\x96\x02\u0774" +
    "\u0777\x05\u012C\x97\x02\u0775\u0777\x05\u012E\x98\x02\u0776\u0762\x03" +
    "\x02\x02\x02\u0776\u0763\x03\x02\x02\x02\u0776\u0764\x03\x02\x02\x02\u0776" +
    "\u0765\x03\x02\x02\x02\u0776\u0766\x03\x02\x02\x02\u0776\u0767\x03\x02" +
    "\x02\x02\u0776\u0768\x03\x02\x02\x02\u0776\u0769\x03\x02\x02\x02\u0776" +
    "\u076A\x03\x02\x02\x02\u0776\u076B\x03\x02\x02\x02\u0776\u076C\x03\x02" +
    "\x02\x02\u0776\u076D\x03\x02\x02\x02\u0776\u076E\x03\x02\x02\x02\u0776" +
    "\u076F\x03\x02\x02\x02\u0776\u0770\x03\x02\x02\x02\u0776\u0771\x03\x02" +
    "\x02\x02\u0776\u0772\x03\x02\x02\x02\u0776\u0773\x03\x02\x02\x02\u0776" +
    "\u0774\x03\x02\x02\x02\u0776\u0775\x03\x02\x02\x02\u0777\u0107\x03\x02" +
    "\x02\x02\u0778\u0779\x07\xAE\x02\x02\u0779\u077A\x07\f\x02\x02\u077A\u077B" +
    "\x07\u0108\x02\x02\u077B\u077C\x07\r\x02\x02\u077C\u0109\x03\x02\x02\x02" +
    "\u077D\u077E\x07\xA4\x02\x02\u077E\u077F\x07\f\x02\x02\u077F\u0782\x05" +
    "\xBA^\x02\u0780\u0781\x07\n\x02\x02\u0781\u0783\x05\xBA^\x02\u0782\u0780" +
    "\x03\x02\x02\x02\u0783\u0784\x03\x02\x02\x02\u0784\u0782\x03\x02\x02\x02" +
    "\u0784\u0785\x03\x02\x02\x02\u0785\u0786\x03\x02\x02\x02\u0786\u0787\x07" +
    "\r\x02\x02\u0787\u010B\x03\x02\x02\x02\u0788\u0789\x07\xA5\x02\x02\u0789" +
    "\u078A\x07\f\x02\x02\u078A\u078B\x05\xBA^\x02\u078B\u078C\x07\n\x02\x02" +
    "\u078C\u078D\x05\xBA^\x02\u078D\u078E\x07\r\x02\x02\u078E\u010D\x03\x02" +
    "\x02\x02\u078F\u0790\x07\xA6\x02\x02\u0790\u0791\x07\f\x02\x02\u0791\u0792" +
    "\x05\xBA^\x02\u0792\u0793\x07\n\x02\x02\u0793\u0794\x05\xBA^\x02\u0794" +
    "\u0795\x07\r\x02\x02\u0795\u010F\x03\x02\x02\x02\u0796\u0797\x07\xA7\x02" +
    "\x02\u0797\u0798\x07\f\x02\x02\u0798\u0799\x05\xBA^\x02\u0799\u079A\x07" +
    "\n\x02\x02\u079A\u079B\x05\xBA^\x02\u079B\u079C\x07\r\x02\x02\u079C\u0111" +
    "\x03\x02\x02\x02\u079D\u079E\x07\xA8\x02\x02\u079E\u079F\x07\f\x02\x02" +
    "\u079F\u07A0\x05\xBA^\x02\u07A0\u07A1\x07\r\x02\x02\u07A1\u0113\x03\x02" +
    "\x02\x02\u07A2\u07A3\x07\xA9\x02\x02\u07A3\u07A4\x07\f\x02\x02\u07A4\u07A5" +
    "\x05\xBA^\x02\u07A5\u07A6\x07\r\x02\x02\u07A6\u0115\x03\x02\x02\x02\u07A7" +
    "\u07A8\x07\xAB\x02\x02\u07A8\u07A9\x07\f\x02\x02\u07A9\u07AA\x05\xBA^" +
    "\x02\u07AA\u07AB\x07\n\x02\x02\u07AB\u07AC\x05\xBA^\x02\u07AC\u07AD\x07" +
    "\r\x02\x02\u07AD\u0117\x03\x02\x02\x02\u07AE\u07AF\x07\xAC\x02\x02\u07AF" +
    "\u07B0\x07\f\x02\x02\u07B0\u07B1\x05\xBA^\x02\u07B1\u07B2\x07\n\x02\x02" +
    "\u07B2\u07B3\x05\xBA^\x02\u07B3\u07B4\x07\r\x02\x02\u07B4\u0119\x03\x02" +
    "\x02\x02\u07B5\u07B6\x07\xAD\x02\x02\u07B6\u07B7\x07\f\x02\x02\u07B7\u07B8" +
    "\x05\xBA^\x02\u07B8\u07B9\x07\n\x02\x02\u07B9\u07BA\x05\xBA^\x02\u07BA" +
    "\u07BB\x07\n\x02\x02\u07BB\u07BC\x05\xBA^\x02\u07BC\u07BD\x07\r\x02\x02" +
    "\u07BD\u011B\x03\x02\x02\x02\u07BE\u07BF\x07\xAA\x02\x02\u07BF\u07C0\x07" +
    "\f\x02\x02\u07C0\u07C1\x05\xBA^\x02\u07C1\u07C2\x07\r\x02\x02\u07C2\u011D" +
    "\x03\x02\x02\x02\u07C3\u07C4\x07\xAF\x02\x02\u07C4\u07C5\x07\f\x02\x02" +
    "\u07C5\u07C6\x05\xBA^\x02\u07C6\u07C7\x07\n\x02\x02\u07C7\u07C8\x05\xBA" +
    "^\x02\u07C8\u07C9\x07\r\x02\x02\u07C9\u011F\x03\x02\x02\x02\u07CA\u07CB" +
    "\x07\xB0\x02\x02\u07CB\u07CC\x07\f\x02\x02\u07CC\u07CD\x05\xBA^\x02\u07CD" +
    "\u07CE\x07\n\x02\x02\u07CE\u07CF\x05\xBA^\x02\u07CF\u07D0\x07\n\x02\x02" +
    "\u07D0\u07D1\x05\xBA^\x02\u07D1\u07D2\x07\r\x02\x02\u07D2\u0121\x03\x02" +
    "\x02\x02\u07D3\u07D4\x07\xB1\x02\x02\u07D4\u07D5\x07\f\x02\x02\u07D5\u07D6" +
    "\x05\xBA^\x02\u07D6\u07D7\x07\n\x02\x02\u07D7\u07D8\x05\xBA^\x02\u07D8" +
    "\u07D9\x07\n\x02\x02\u07D9\u07DA\x05\xBA^\x02\u07DA\u07DB\x07\r\x02\x02" +
    "\u07DB\u0123\x03\x02\x02\x02\u07DC\u07DD\x07\xB2\x02\x02\u07DD\u07DE\x07" +
    "\f\x02\x02\u07DE\u07DF\x05\xBA^\x02\u07DF\u07E0\x07\n\x02\x02\u07E0\u07E3" +
    "\x05\xBA^\x02\u07E1\u07E2\x07\n\x02\x02\u07E2\u07E4\x05\xBA^\x02\u07E3" +
    "\u07E1\x03\x02\x02\x02\u07E3\u07E4\x03\x02\x02\x02\u07E4\u07E5\x03\x02" +
    "\x02\x02\u07E5\u07E6\x07\r\x02\x02\u07E6\u0125\x03\x02\x02\x02\u07E7\u07E8" +
    "\x07\xB3\x02\x02\u07E8\u07E9\x07\f\x02\x02\u07E9\u07EA\x05\xBA^\x02\u07EA" +
    "\u07EB\x07\n\x02\x02\u07EB\u07EC\x05\xBA^\x02\u07EC\u07ED\x07\n\x02\x02" +
    "\u07ED\u07EE\x05\xBA^\x02\u07EE\u07EF\x07\r\x02\x02\u07EF\u0127\x03\x02" +
    "\x02\x02\u07F0\u07F1\x07\xB4\x02\x02\u07F1\u07F2\x07\f\x02\x02\u07F2\u07F3" +
    "\x05\xBA^\x02\u07F3\u07F4\x07\r\x02\x02\u07F4\u0129\x03\x02\x02\x02\u07F5" +
    "\u07F6\x07\xB5\x02\x02\u07F6\u07F7\x07\f\x02\x02\u07F7\u07F8\x05\xBA^" +
    "\x02\u07F8\u07F9\x07\r\x02\x02\u07F9\u012B\x03\x02\x02\x02\u07FA\u07FB" +
    "\x07\xB6\x02\x02\u07FB\u07FC\x07\f\x02\x02\u07FC\u07FD\x05\xBA^\x02\u07FD" +
    "\u07FE\x07\n\x02\x02\u07FE\u07FF\x05\xBA^\x02\u07FF\u0800\x07\r\x02\x02" +
    "\u0800\u012D\x03\x02\x02\x02\u0801\u0802\x07\xB7\x02\x02\u0802\u0803\x07" +
    "\f\x02\x02\u0803\u0804\x05\xBA^\x02\u0804\u0805\x07\r\x02\x02\u0805\u012F" +
    "\x03\x02\x02\x02\u0806\u0815\x05\u0132\x9A\x02\u0807\u0815\x05\u0134\x9B" +
    "\x02\u0808\u0815\x05\u0136\x9C\x02\u0809\u0815\x05\u0138\x9D\x02\u080A" +
    "\u0815\x05\u013A\x9E\x02\u080B\u0815\x05\u013C\x9F\x02\u080C\u0815\x05" +
    "\u013E\xA0\x02\u080D\u0815\x05\u0140\xA1\x02\u080E\u0815\x05\u0142\xA2" +
    "\x02\u080F\u0815\x05\u0144\xA3\x02\u0810\u0815\x05\u0146\xA4\x02\u0811" +
    "\u0815\x05\u0148\xA5\x02\u0812\u0815\x05\u014A\xA6\x02\u0813\u0815\x05" +
    "\u014C\xA7\x02\u0814\u0806\x03\x02\x02\x02\u0814\u0807\x03\x02\x02\x02" +
    "\u0814\u0808\x03\x02\x02\x02\u0814\u0809\x03\x02\x02\x02\u0814\u080A\x03" +
    "\x02\x02\x02\u0814\u080B\x03\x02\x02\x02\u0814\u080C\x03\x02\x02\x02\u0814" +
    "\u080D\x03\x02\x02\x02\u0814\u080E\x03\x02\x02\x02\u0814\u080F\x03\x02" +
    "\x02\x02\u0814\u0810\x03\x02\x02\x02\u0814\u0811\x03\x02\x02\x02\u0814" +
    "\u0812\x03\x02\x02\x02\u0814\u0813\x03\x02\x02\x02\u0815\u0131\x03\x02" +
    "\x02\x02\u0816\u0817\x07\xBF\x02\x02\u0817\u0818\x07\f\x02\x02\u0818\u0819" +
    "\x05\xBA^\x02\u0819\u081A\x07\n\x02\x02\u081A\u081B\x05\xBA^\x02\u081B" +
    "\u081C\x07\r\x02\x02\u081C\u0133\x03\x02\x02\x02\u081D\u081E\x07\xC0\x02" +
    "\x02\u081E\u081F\x07\f\x02\x02\u081F\u0820\x05\xBA^\x02\u0820\u0821\x07" +
    "\n\x02\x02\u0821\u0822\x05\xBA^\x02\u0822\u0823\x07\r\x02\x02\u0823\u0135" +
    "\x03\x02\x02\x02\u0824\u0825\x07\xC1\x02\x02\u0825\u0826\x07\f\x02\x02" +
    "\u0826\u0827\x05\xBA^\x02\u0827\u0828\x07\n\x02\x02\u0828\u0829\x05\xBA" +
    "^\x02\u0829\u082A\x07\r\x02\x02\u082A\u0137\x03\x02\x02\x02\u082B\u082C" +
    "\x07\xC2\x02\x02\u082C\u082D\x07\f\x02\x02\u082D\u082E\x05\xBA^\x02\u082E" +
    "\u082F\x07\n\x02\x02\u082F\u0830\x05\xBA^\x02\u0830\u0831\x07\r\x02\x02" +
    "\u0831\u0139\x03\x02\x02\x02\u0832\u0833\x07\xC3\x02\x02\u0833\u0834\x07" +
    "\f\x02\x02\u0834\u0835\x05\xBA^\x02\u0835\u0836\x07\n\x02\x02\u0836\u0837" +
    "\x07\u0108\x02\x02\u0837\u0838\x07\r\x02\x02\u0838\u013B\x03\x02\x02\x02" +
    "\u0839\u083A\x07\xC4\x02\x02\u083A\u083B\x07\f\x02\x02\u083B\u083C\x05" +
    "\xBA^\x02\u083C\u083D\x07\n\x02\x02\u083D\u083E\x05\xBA^\x02\u083E\u083F" +
    "\x07\r\x02\x02\u083F\u013D\x03\x02\x02\x02\u0840\u0841\x07\xC5\x02\x02" +
    "\u0841\u0842\x07\f\x02\x02\u0842\u0843\x05\xBA^\x02\u0843\u0844\x07\n" +
    "\x02\x02\u0844\u0845\x05\xBA^\x02\u0845\u0846\x07\r\x02\x02\u0846\u013F" +
    "\x03\x02\x02\x02\u0847\u0848\x07\xBD\x02\x02\u0848\u0849\x07\f\x02\x02" +
    "\u0849\u084A\x07\r\x02\x02\u084A\u0141\x03\x02\x02\x02\u084B\u084C\x07" +
    "\xBE\x02\x02\u084C\u084D\x07\f\x02\x02\u084D\u084E\x07\r\x02\x02\u084E" +
    "\u0143\x03\x02\x02\x02\u084F\u0850\x07\xB8\x02\x02\u0850\u0851\x07\f\x02" +
    "\x02\u0851\u0852\x05\xBA^\x02\u0852\u0853\x07\r\x02\x02\u0853\u0145\x03" +
    "\x02\x02\x02\u0854\u0855\x07\xBA\x02\x02\u0855\u0856\x07\f\x02\x02\u0856" +
    "\u0857\x05\xBA^\x02\u0857\u0858\x07\r\x02\x02\u0858\u0147\x03\x02\x02" +
    "\x02\u0859\u085A\x07\xB9\x02\x02\u085A\u085B\x07\f\x02\x02\u085B\u085C" +
    "\x05\xBA^\x02\u085C\u085D\x07\r\x02\x02\u085D\u0149\x03\x02\x02\x02\u085E" +
    "\u085F\x07\xBB\x02\x02\u085F\u0860\x07\f\x02\x02\u0860\u0861\x05\xBA^" +
    "\x02\u0861\u0862\x07\r\x02\x02\u0862\u014B\x03\x02\x02\x02\u0863\u0864" +
    "\x07\xBC\x02\x02\u0864\u0865\x07\f\x02\x02\u0865\u0866\x05\xBA^\x02\u0866" +
    "\u0867\x07\r\x02\x02\u0867\u014D\x03\x02\x02\x02\u0868\u0869\x05\u0150" +
    "\xA9\x02\u0869\u014F\x03\x02\x02\x02\u086A\u086B\x07\xC6\x02\x02\u086B" +
    "\u086C\x07\f\x02\x02\u086C\u086D\x05\xBA^\x02\u086D\u086E\x07\r\x02\x02" +
    "\u086E\u0151\x03\x02\x02\x02\u086F\u0870\x05\u0154\xAB\x02\u0870\u0153" +
    "\x03\x02\x02\x02\u0871\u0872\x07\xC7\x02\x02\u0872\u0873\x07\f\x02\x02" +
    "\u0873\u0874\x05\xBA^\x02\u0874\u0875\x07\r\x02\x02\u0875\u0155\x03\x02" +
    "\x02\x02\u0876\u0877\x05\u0158\xAD\x02\u0877\u0157\x03\x02\x02\x02\u0878" +
    "\u0879\x07\xC8\x02\x02\u0879\u087A\x07\f\x02\x02\u087A\u087B\x05\xBA^" +
    "\x02\u087B\u087C\x07\r\x02\x02\u087C\u0159\x03\x02\x02\x02\u087D\u087E" +
    "\x05\u015C\xAF\x02\u087E\u015B\x03\x02\x02\x02\u087F\u0880\x07\xC9\x02" +
    "\x02\u0880\u0881\x07\f\x02\x02\u0881\u0882\x05\xBA^\x02\u0882\u0883\x07" +
    "\r\x02\x02\u0883\u015D\x03\x02\x02\x02\u0884\u0888\x05\u0160\xB1\x02\u0885" +
    "\u0888\x05\u0162\xB2\x02\u0886\u0888\x05\u0164\xB3\x02\u0887\u0884\x03" +
    "\x02\x02\x02\u0887\u0885\x03\x02\x02\x02\u0887\u0886\x03\x02\x02\x02\u0888" +
    "\u015F\x03\x02\x02\x02\u0889\u088A\x07\xCA\x02\x02\u088A\u088B\x07\f\x02" +
    "\x02\u088B\u088C\x05\xBA^\x02\u088C\u088D\x07\r\x02\x02\u088D\u0161\x03" +
    "\x02\x02\x02\u088E\u088F\x07\xCB\x02\x02\u088F\u0890\x07\f\x02\x02\u0890" +
    "\u0891\x05\xBA^\x02\u0891\u0892\x07\n\x02\x02\u0892\u0893\x05\xBA^\x02" +
    "\u0893\u0894\x07\n\x02\x02\u0894\u0895\x05\xBA^\x02\u0895\u0896\x07\r" +
    "\x02\x02\u0896\u0163\x03\x02\x02\x02\u0897\u0898\x07\xCC\x02\x02\u0898" +
    "\u0899\x07\f\x02\x02\u0899\u089A\x05\xBA^\x02\u089A\u089B\x07\r\x02\x02" +
    "\u089B\u0165\x03\x02\x02\x02\u089C\u089D\x05\u0168\xB5\x02\u089D\u0167" +
    "\x03\x02\x02\x02\u089E\u089F\x07\xCD\x02\x02\u089F\u08A0\x07\f\x02\x02" +
    "\u08A0\u08A1\x07\r\x02\x02\u08A1\u0169\x03\x02\x02\x02\u08A2\u08A3\x07" +
    "\xFD\x02\x02\u08A3\u08A4\x07\f\x02\x02\u08A4\u08A8\x05\xBA^\x02\u08A5" +
    "\u08A7\x05\u016C\xB7\x02\u08A6\u08A5\x03\x02\x02\x02\u08A7\u08AA\x03\x02" +
    "\x02\x02\u08A8\u08A6\x03\x02\x02\x02\u08A8\u08A9\x03\x02\x02\x02\u08A9" +
    "\u08AB\x03\x02\x02\x02\u08AA\u08A8\x03\x02\x02\x02\u08AB\u08AC\x07\r\x02" +
    "\x02\u08AC\u08B9\x03\x02\x02\x02\u08AD\u08AE\x07\xFE\x02\x02\u08AE\u08AF" +
    "\x07\f\x02\x02\u08AF\u08B3\x05\xBA^\x02\u08B0\u08B2\x05\u016C\xB7\x02" +
    "\u08B1\u08B0\x03\x02\x02\x02\u08B2\u08B5\x03\x02\x02\x02\u08B3\u08B1\x03" +
    "\x02\x02\x02\u08B3\u08B4\x03\x02\x02\x02\u08B4\u08B6\x03\x02\x02\x02\u08B5" +
    "\u08B3\x03\x02\x02\x02\u08B6\u08B7\x07\r\x02\x02\u08B7\u08B9\x03\x02\x02" +
    "\x02\u08B8\u08A2\x03\x02\x02\x02\u08B8\u08AD\x03\x02\x02\x02\u08B9\u016B" +
    "\x03\x02\x02\x02\u08BA\u08BB\x07\n\x02\x02\u08BB\u08BC\x05\xBA^\x02\u08BC" +
    "\u016D\x03\x02\x02\x02\u08BD\u08D3\x05\u0172\xBA\x02\u08BE\u08BF\x074" +
    "\x02\x02\u08BF\u08C0\x07\f\x02\x02\u08C0\u08D3\x07\r\x02\x02\u08C1\u08C2" +
    "\x077\x02\x02\u08C2\u08C3\x07\f\x02\x02\u08C3\u08C4\x05\xBA^\x02\u08C4" +
    "\u08C5\x07\r\x02\x02\u08C5\u08D3\x03\x02\x02\x02\u08C6\u08C7\x075\x02" +
    "\x02\u08C7\u08C8\x07\f\x02\x02\u08C8\u08C9\x05\xBA^\x02\u08C9\u08CA\x07" +
    "\r\x02\x02\u08CA\u08D3\x03\x02\x02\x02\u08CB\u08CC\x076\x02\x02\u08CC" +
    "\u08CD\x07\f\x02\x02\u08CD\u08CE\x05\xBA^\x02\u08CE\u08CF\x07\n\x02\x02" +
    "\u08CF\u08D0\x05\xBA^\x02\u08D0\u08D1\x07\r\x02\x02\u08D1\u08D3\x03\x02" +
    "\x02\x02\u08D2\u08BD\x03\x02\x02\x02\u08D2\u08BE\x03\x02\x02\x02\u08D2" +
    "\u08C1\x03\x02\x02\x02\u08D2\u08C6\x03\x02\x02\x02\u08D2\u08CB\x03\x02" +
    "\x02\x02\u08D3\u016F\x03\x02\x02\x02\u08D4\u08D5\x079\x02\x02\u08D5\u08D6" +
    "\x07\f\x02\x02\u08D6\u0973\x07\r\x02\x02\u08D7\u08D8\x07:\x02\x02\u08D8" +
    "\u08D9\x07\f\x02\x02\u08D9\u0973\x07\r\x02\x02\u08DA\u08DB\x07>\x02\x02" +
    "\u08DB\u08DC\x07\f\x02\x02\u08DC\u08DD\x07\u0104\x02\x02\u08DD\u08DE\x07" +
    "\n\x02\x02\u08DE\u08DF\x05\xBA^\x02\u08DF\u08E0\x07\r\x02\x02\u08E0\u0973" +
    "\x03\x02\x02\x02\u08E1\u08E2\x07?\x02\x02\u08E2\u08E3\x07\f\x02\x02\u08E3" +
    "\u08E4\x07\u0104\x02\x02\u08E4\u08E5\x07\n\x02\x02\u08E5\u08E6\x05\xBA" +
    "^\x02\u08E6\u08E7\x07\r\x02\x02\u08E7\u0973\x03\x02\x02\x02\u08E8\u08E9" +
    "\x07@\x02\x02\u08E9\u08EA\x07\f\x02\x02\u08EA\u08EB\x07\u0104\x02\x02" +
    "\u08EB\u08EC\x07\n\x02\x02\u08EC\u08ED\x05\xBA^\x02\u08ED\u08EE\x07\r" +
    "\x02\x02\u08EE\u0973\x03\x02\x02\x02\u08EF\u08F0\x07A\x02\x02\u08F0\u08F1" +
    "\x07\f\x02\x02\u08F1\u08F2\x07\u0104\x02\x02\u08F2\u08F3\x07\n\x02\x02" +
    "\u08F3\u08F4\x05\xBA^\x02\u08F4\u08F5\x07\r\x02\x02\u08F5\u0973\x03\x02" +
    "\x02\x02\u08F6\u08F7\x07;\x02\x02\u08F7\u08F8\x07\f\x02\x02\u08F8\u08F9" +
    "\x07\u0104\x02\x02\u08F9\u08FA\x07\n\x02\x02\u08FA\u08FB\x05\xBA^\x02" +
    "\u08FB\u08FC\x07\r\x02\x02\u08FC\u0973\x03\x02\x02\x02\u08FD\u08FE\x07" +
    "<\x02\x02\u08FE\u08FF\x07\f\x02\x02\u08FF\u0900\x07\u0104\x02\x02\u0900" +
    "\u0973\x07\r\x02\x02\u0901\u0902\x07=\x02\x02\u0902\u0903\x07\f\x02\x02" +
    "\u0903\u0904\x07\u0104\x02\x02\u0904\u0905\x07\n\x02\x02\u0905\u0906\x05" +
    "\xBA^\x02\u0906\u0907\x07\n\x02\x02\u0907\u0908\x05\xBA^\x02\u0908\u0909" +
    "\x07\r\x02";
MezDSLParser._serializedATNSegment4 = "\x02\u0909\u0973\x03\x02\x02\x02\u090A\u090B\x07D\x02\x02\u090B\u090C" +
    "\x07\f\x02\x02\u090C\u090D\x07\u0104\x02\x02\u090D\u090E\x07\n\x02\x02" +
    "\u090E\u090F\x05\xBA^\x02\u090F\u0910\x07\r\x02\x02\u0910\u0973\x03\x02" +
    "\x02\x02\u0911\u0912\x07E\x02\x02\u0912\u0913\x07\f\x02\x02\u0913\u0914" +
    "\x07\u0104\x02\x02\u0914\u0915\x07\n\x02\x02\u0915\u0916\x05\xBA^\x02" +
    "\u0916\u0917\x07\r\x02\x02\u0917\u0973\x03\x02\x02\x02\u0918\u0919\x07" +
    "F\x02\x02\u0919\u091A\x07\f\x02\x02\u091A\u091B\x07\u0104\x02\x02\u091B" +
    "\u091C\x07\n\x02\x02\u091C\u091D\x05\xBA^\x02\u091D\u091E\x07\r\x02\x02" +
    "\u091E\u0973\x03\x02\x02\x02\u091F\u0920\x07B\x02\x02\u0920\u0921\x07" +
    "\f\x02\x02\u0921\u0922\x07\u0104\x02\x02\u0922\u0923\x07\n\x02\x02\u0923" +
    "\u0924\x05\xBA^\x02\u0924\u0925\x07\r\x02\x02\u0925\u0973\x03\x02\x02" +
    "\x02\u0926\u0927\x07C\x02\x02\u0927\u0928\x07\f\x02\x02\u0928\u0929\x07" +
    "\u0104\x02\x02\u0929\u092A\x07\n\x02\x02\u092A\u092B\x05\xBA^\x02\u092B" +
    "\u092C\x07\r\x02\x02\u092C\u0973\x03\x02\x02\x02\u092D\u092E\x07G\x02" +
    "\x02\u092E\u092F\x07\f\x02\x02\u092F\u0930\x07\u0104\x02\x02\u0930\u0931" +
    "\x07\n\x02\x02\u0931\u0932\x05\xBA^\x02\u0932\u0933\x07\r\x02\x02\u0933" +
    "\u0973\x03\x02\x02\x02\u0934\u0935\x07H\x02\x02\u0935\u0936\x07\f\x02" +
    "\x02\u0936\u0937\x07\u0104\x02\x02\u0937\u0938\x07\n\x02\x02\u0938\u0939" +
    "\x05\xBA^\x02\u0939\u093A\x07\r\x02\x02\u093A\u0973\x03\x02\x02\x02\u093B" +
    "\u093C\x07I\x02\x02\u093C\u093D\x07\f\x02\x02\u093D\u093E\x07\u0104\x02" +
    "\x02\u093E\u093F\x07\n\x02\x02\u093F\u0940\x05\xBA^\x02\u0940\u0941\x07" +
    "\r\x02\x02\u0941\u0973\x03\x02\x02\x02\u0942\u0943\x07J\x02\x02\u0943" +
    "\u0944\x07\f\x02\x02\u0944\u0945\x07\u0104\x02\x02\u0945\u0973\x07\r\x02" +
    "\x02\u0946\u0947\x07K\x02\x02\u0947\u0948\x07\f\x02\x02\u0948\u0949\x07" +
    "\u0104\x02\x02\u0949\u094A\x07\n\x02\x02\u094A\u094B\x05\xBA^\x02\u094B" +
    "\u094C\x07\n\x02\x02\u094C\u094D\x05\xBA^\x02\u094D\u094E\x07\r\x02\x02" +
    "\u094E\u0973\x03\x02\x02\x02\u094F\u0950\x07L\x02\x02\u0950\u0951\x07" +
    "\f\x02\x02\u0951\u0952\x07\u0104\x02\x02\u0952\u0953\x07\n\x02\x02\u0953" +
    "\u0954\x05\xBA^\x02\u0954\u0955\x07\r\x02\x02\u0955\u0973\x03\x02\x02" +
    "\x02\u0956\u0957\x07M\x02\x02\u0957\u0958\x07\f\x02\x02\u0958\u0959\x07" +
    "\u0104\x02\x02\u0959\u095A\x07\n\x02\x02\u095A\u095B\x05\xBA^\x02\u095B" +
    "\u095C\x07\r\x02\x02\u095C\u0973\x03\x02\x02\x02\u095D\u095E\x07N\x02" +
    "\x02\u095E\u095F\x07\f\x02\x02\u095F\u0960\x07\u0104\x02\x02\u0960\u0961" +
    "\x07\n\x02\x02\u0961\u0962\x05\xBA^\x02\u0962\u0963\x07\r\x02\x02\u0963" +
    "\u0973\x03\x02\x02\x02\u0964\u0965\x07O\x02\x02\u0965\u0966\x07\f\x02" +
    "\x02\u0966\u0967\x07\u0104\x02\x02\u0967\u0968\x07\n\x02\x02\u0968\u0969" +
    "\x05\xBA^\x02\u0969\u096A\x07\r\x02\x02\u096A\u0973\x03\x02\x02\x02\u096B" +
    "\u096C\x07P\x02\x02\u096C\u096D\x07\f\x02\x02\u096D\u096E\x07\u0104\x02" +
    "\x02\u096E\u096F\x07\n\x02\x02\u096F\u0970\x05\xBA^\x02\u0970\u0971\x07" +
    "\r\x02\x02\u0971\u0973\x03\x02\x02\x02\u0972\u08D4\x03\x02\x02\x02\u0972" +
    "\u08D7\x03\x02\x02\x02\u0972\u08DA\x03\x02\x02\x02\u0972\u08E1\x03\x02" +
    "\x02\x02\u0972\u08E8\x03\x02\x02\x02\u0972\u08EF\x03\x02\x02\x02\u0972" +
    "\u08F6\x03\x02\x02\x02\u0972\u08FD\x03\x02\x02\x02\u0972\u0901\x03\x02" +
    "\x02\x02\u0972\u090A\x03\x02\x02\x02\u0972\u0911\x03\x02\x02\x02\u0972" +
    "\u0918\x03\x02\x02\x02\u0972\u091F\x03\x02\x02\x02\u0972\u0926\x03\x02" +
    "\x02\x02\u0972\u092D\x03\x02\x02\x02\u0972\u0934\x03\x02\x02\x02\u0972" +
    "\u093B\x03\x02\x02\x02\u0972\u0942\x03\x02\x02\x02\u0972\u0946\x03\x02" +
    "\x02\x02\u0972\u094F\x03\x02\x02\x02\u0972\u0956\x03\x02\x02\x02\u0972" +
    "\u095D\x03\x02\x02\x02\u0972\u0964\x03\x02\x02\x02\u0972\u096B\x03\x02" +
    "\x02\x02\u0973\u0171\x03\x02\x02\x02\u0974\u09AE\x05\u0170\xB9\x02\u0975" +
    "\u0976\x07Q\x02\x02\u0976\u0977\x07\f\x02\x02\u0977\u0978\x05\u0170\xB9" +
    "\x02\u0978\u0979\x07\n\x02\x02\u0979\u097E\x05\u0170\xB9\x02\u097A\u097B" +
    "\x07\n\x02\x02\u097B\u097D\x05\u0170\xB9\x02\u097C\u097A\x03\x02\x02\x02" +
    "\u097D\u0980\x03\x02\x02\x02\u097E\u097C\x03\x02\x02\x02\u097E\u097F\x03" +
    "\x02\x02\x02\u097F\u0981\x03\x02\x02\x02\u0980\u097E\x03\x02\x02\x02\u0981" +
    "\u0982\x07\r\x02\x02\u0982\u09AE\x03\x02\x02\x02\u0983\u0984\x07R\x02" +
    "\x02\u0984\u0985\x07\f\x02\x02\u0985\u0986\x05\u0172\xBA\x02\u0986\u0987" +
    "\x07\n\x02\x02\u0987\u098C\x05\u0172\xBA\x02\u0988\u0989\x07\n\x02\x02" +
    "\u0989\u098B\x05\u0172\xBA\x02\u098A\u0988\x03\x02\x02\x02\u098B\u098E" +
    "\x03\x02\x02\x02\u098C\u098A\x03\x02\x02\x02\u098C\u098D\x03\x02\x02\x02" +
    "\u098D\u098F\x03\x02\x02\x02\u098E\u098C\x03\x02\x02\x02\u098F\u0990\x07" +
    "\r\x02\x02\u0990\u09AE\x03\x02\x02\x02\u0991\u0992\x07S\x02\x02\u0992" +
    "\u0993\x07\f\x02\x02\u0993\u0994\x05\u0172\xBA\x02\u0994\u0995\x07\n\x02" +
    "\x02\u0995\u099A\x05\u0172\xBA\x02\u0996\u0997\x07\n\x02\x02\u0997\u0999" +
    "\x05\u0172\xBA\x02\u0998\u0996\x03\x02\x02\x02\u0999\u099C\x03\x02\x02" +
    "\x02\u099A\u0998\x03\x02\x02\x02\u099A\u099B\x03\x02\x02\x02\u099B\u099D" +
    "\x03\x02\x02\x02\u099C\u099A\x03\x02\x02\x02\u099D\u099E\x07\r\x02\x02" +
    "\u099E\u09AE\x03\x02\x02\x02\u099F\u09A0\x07T\x02\x02\u09A0\u09A1\x07" +
    "\f\x02\x02\u09A1\u09A2\x05\u0172\xBA\x02\u09A2\u09A3\x07\n\x02\x02\u09A3" +
    "\u09A8\x05\u0172\xBA\x02\u09A4\u09A5\x07\n\x02\x02\u09A5\u09A7\x05\u0172" +
    "\xBA\x02\u09A6\u09A4\x03\x02\x02\x02\u09A7\u09AA\x03\x02\x02\x02\u09A8" +
    "\u09A6\x03\x02\x02\x02\u09A8\u09A9\x03\x02\x02\x02\u09A9\u09AB\x03\x02" +
    "\x02\x02\u09AA\u09A8\x03\x02\x02\x02\u09AB\u09AC\x07\r\x02\x02\u09AC\u09AE" +
    "\x03\x02\x02\x02\u09AD\u0974\x03\x02\x02\x02\u09AD\u0975\x03\x02\x02\x02" +
    "\u09AD\u0983\x03\x02\x02\x02\u09AD\u0991\x03\x02\x02\x02\u09AD\u099F\x03" +
    "\x02\x02\x02\u09AE\u0173\x03\x02\x02\x02\u09AF\u09B0\t\t\x02\x02\u09B0" +
    "\u0175\x03\x02\x02\x02\x84\u0179\u017D\u0184\u0190\u0196\u019C\u01A7\u01AF" +
    "\u01B5\u01C0\u01D7\u01DA\u01E0\u01E4\u01EB\u01F2\u01FC\u020C\u021B\u0220" +
    "\u0233\u026D\u0279\u0291\u02A6\u02DD\u02E3\u02EF\u02F4\u02FE\u030E\u0312" +
    "\u031E\u0323\u0327\u0333\u0338\u033A\u0341\u0345\u034C\u0350\u0358\u0364" +
    "\u0374\u0378\u037C\u0382\u038C\u0391\u0394\u03A7\u03AB\u03C0\u042A\u043B" +
    "\u0447\u0459\u045F\u046E\u048F\u04AC\u04B4\u04BC\u04C8\u04D5\u04EA\u04EF" +
    "\u04FF\u0503\u0514\u052D\u0538\u053C\u0553\u055B\u0564\u056D\u057A\u0585" +
    "\u058D\u059A\u05A7\u05AA\u05AD\u05B3\u05BC\u05BF\u05C5\u05CE\u05D1\u05D4" +
    "\u05D8\u05DF\u05E4\u05EB\u05FE\u061A\u0636\u0648\u0658\u0668\u069D\u06B1" +
    "\u06BE\u06CC\u06D5\u06E2\u06FF\u0703\u0719\u073D\u0744\u0749\u0752\u0776" +
    "\u0784\u07E3\u0814\u0887\u08A8\u08B3\u08B8\u08D2\u0972\u097E\u098C\u099A" +
    "\u09A8\u09AD";
MezDSLParser._serializedATN = Utils.join([
    MezDSLParser._serializedATNSegment0,
    MezDSLParser._serializedATNSegment1,
    MezDSLParser._serializedATNSegment2,
    MezDSLParser._serializedATNSegment3,
    MezDSLParser._serializedATNSegment4,
], "");
class ScriptContext extends ParserRuleContext_1.ParserRuleContext {
    scriptContent(i) {
        if (i === undefined) {
            return this.getRuleContexts(ScriptContentContext);
        }
        else {
            return this.getRuleContext(i, ScriptContentContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_script; }
    // @Override
    enterRule(listener) {
        if (listener.enterScript) {
            listener.enterScript(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitScript) {
            listener.exitScript(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScript) {
            return visitor.visitScript(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ScriptContext = ScriptContext;
class ScriptContentContext extends ParserRuleContext_1.ParserRuleContext {
    persistence() {
        return this.tryGetRuleContext(0, PersistenceContext);
    }
    unit() {
        return this.tryGetRuleContext(0, UnitContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_scriptContent; }
    // @Override
    enterRule(listener) {
        if (listener.enterScriptContent) {
            listener.enterScriptContent(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitScriptContent) {
            listener.exitScriptContent(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScriptContent) {
            return visitor.visitScriptContent(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ScriptContentContext = ScriptContentContext;
class PersistenceContext extends ParserRuleContext_1.ParserRuleContext {
    persistenceElement() {
        return this.getRuleContext(0, PersistenceElementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_persistence; }
    // @Override
    enterRule(listener) {
        if (listener.enterPersistence) {
            listener.enterPersistence(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPersistence) {
            listener.exitPersistence(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPersistence) {
            return visitor.visitPersistence(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PersistenceContext = PersistenceContext;
class PersistenceElementContext extends ParserRuleContext_1.ParserRuleContext {
    customObject() {
        return this.tryGetRuleContext(0, CustomObjectContext);
    }
    validator() {
        return this.tryGetRuleContext(0, ValidatorContext);
    }
    enumeration() {
        return this.tryGetRuleContext(0, EnumerationContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_persistenceElement; }
    // @Override
    enterRule(listener) {
        if (listener.enterPersistenceElement) {
            listener.enterPersistenceElement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPersistenceElement) {
            listener.exitPersistenceElement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPersistenceElement) {
            return visitor.visitPersistenceElement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PersistenceElementContext = PersistenceElementContext;
class UnitContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    EOF() { return this.getToken(MezDSLParser.EOF, 0); }
    variableDeclaration(i) {
        if (i === undefined) {
            return this.getRuleContexts(VariableDeclarationContext);
        }
        else {
            return this.getRuleContext(i, VariableDeclarationContext);
        }
    }
    functionDefinition(i) {
        if (i === undefined) {
            return this.getRuleContexts(FunctionDefinitionContext);
        }
        else {
            return this.getRuleContext(i, FunctionDefinitionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_unit; }
    // @Override
    enterRule(listener) {
        if (listener.enterUnit) {
            listener.enterUnit(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitUnit) {
            listener.exitUnit(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUnit) {
            return visitor.visitUnit(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UnitContext = UnitContext;
class CustomObjectContext extends ParserRuleContext_1.ParserRuleContext {
    simpleObject() {
        return this.tryGetRuleContext(0, SimpleObjectContext);
    }
    persistentObject() {
        return this.tryGetRuleContext(0, PersistentObjectContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_customObject; }
    // @Override
    enterRule(listener) {
        if (listener.enterCustomObject) {
            listener.enterCustomObject(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCustomObject) {
            listener.exitCustomObject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCustomObject) {
            return visitor.visitCustomObject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CustomObjectContext = CustomObjectContext;
class SimpleObjectContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    objectAttribute(i) {
        if (i === undefined) {
            return this.getRuleContexts(ObjectAttributeContext);
        }
        else {
            return this.getRuleContext(i, ObjectAttributeContext);
        }
    }
    relationship(i) {
        if (i === undefined) {
            return this.getRuleContexts(RelationshipContext);
        }
        else {
            return this.getRuleContext(i, RelationshipContext);
        }
    }
    trigger(i) {
        if (i === undefined) {
            return this.getRuleContexts(TriggerContext);
        }
        else {
            return this.getRuleContext(i, TriggerContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_simpleObject; }
    // @Override
    enterRule(listener) {
        if (listener.enterSimpleObject) {
            listener.enterSimpleObject(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSimpleObject) {
            listener.exitSimpleObject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSimpleObject) {
            return visitor.visitSimpleObject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SimpleObjectContext = SimpleObjectContext;
class TriggerContext extends ParserRuleContext_1.ParserRuleContext {
    beforeCreate() {
        return this.tryGetRuleContext(0, BeforeCreateContext);
    }
    afterCreate() {
        return this.tryGetRuleContext(0, AfterCreateContext);
    }
    beforeUpdate() {
        return this.tryGetRuleContext(0, BeforeUpdateContext);
    }
    afterUpdate() {
        return this.tryGetRuleContext(0, AfterUpdateContext);
    }
    beforeDelete() {
        return this.tryGetRuleContext(0, BeforeDeleteContext);
    }
    afterDelete() {
        return this.tryGetRuleContext(0, AfterDeleteContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_trigger; }
    // @Override
    enterRule(listener) {
        if (listener.enterTrigger) {
            listener.enterTrigger(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitTrigger) {
            listener.exitTrigger(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTrigger) {
            return visitor.visitTrigger(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TriggerContext = TriggerContext;
class BeforeCreateContext extends ParserRuleContext_1.ParserRuleContext {
    BEFORE_CREATE() { return this.getToken(MezDSLParser.BEFORE_CREATE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_beforeCreate; }
    // @Override
    enterRule(listener) {
        if (listener.enterBeforeCreate) {
            listener.enterBeforeCreate(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBeforeCreate) {
            listener.exitBeforeCreate(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBeforeCreate) {
            return visitor.visitBeforeCreate(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BeforeCreateContext = BeforeCreateContext;
class AfterCreateContext extends ParserRuleContext_1.ParserRuleContext {
    AFTER_CREATE() { return this.getToken(MezDSLParser.AFTER_CREATE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_afterCreate; }
    // @Override
    enterRule(listener) {
        if (listener.enterAfterCreate) {
            listener.enterAfterCreate(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAfterCreate) {
            listener.exitAfterCreate(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAfterCreate) {
            return visitor.visitAfterCreate(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AfterCreateContext = AfterCreateContext;
class BeforeUpdateContext extends ParserRuleContext_1.ParserRuleContext {
    BEFORE_UPDATE() { return this.getToken(MezDSLParser.BEFORE_UPDATE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_beforeUpdate; }
    // @Override
    enterRule(listener) {
        if (listener.enterBeforeUpdate) {
            listener.enterBeforeUpdate(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBeforeUpdate) {
            listener.exitBeforeUpdate(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBeforeUpdate) {
            return visitor.visitBeforeUpdate(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BeforeUpdateContext = BeforeUpdateContext;
class AfterUpdateContext extends ParserRuleContext_1.ParserRuleContext {
    AFTER_UPDATE() { return this.getToken(MezDSLParser.AFTER_UPDATE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_afterUpdate; }
    // @Override
    enterRule(listener) {
        if (listener.enterAfterUpdate) {
            listener.enterAfterUpdate(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAfterUpdate) {
            listener.exitAfterUpdate(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAfterUpdate) {
            return visitor.visitAfterUpdate(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AfterUpdateContext = AfterUpdateContext;
class BeforeDeleteContext extends ParserRuleContext_1.ParserRuleContext {
    BEFORE_DELETE() { return this.getToken(MezDSLParser.BEFORE_DELETE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_beforeDelete; }
    // @Override
    enterRule(listener) {
        if (listener.enterBeforeDelete) {
            listener.enterBeforeDelete(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBeforeDelete) {
            listener.exitBeforeDelete(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBeforeDelete) {
            return visitor.visitBeforeDelete(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BeforeDeleteContext = BeforeDeleteContext;
class AfterDeleteContext extends ParserRuleContext_1.ParserRuleContext {
    AFTER_DELETE() { return this.getToken(MezDSLParser.AFTER_DELETE, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_afterDelete; }
    // @Override
    enterRule(listener) {
        if (listener.enterAfterDelete) {
            listener.enterAfterDelete(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAfterDelete) {
            listener.exitAfterDelete(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAfterDelete) {
            return visitor.visitAfterDelete(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AfterDeleteContext = AfterDeleteContext;
class PersistentObjectContext extends ParserRuleContext_1.ParserRuleContext {
    simpleObject() {
        return this.getRuleContext(0, SimpleObjectContext);
    }
    objectAnnotation(i) {
        if (i === undefined) {
            return this.getRuleContexts(ObjectAnnotationContext);
        }
        else {
            return this.getRuleContext(i, ObjectAnnotationContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_persistentObject; }
    // @Override
    enterRule(listener) {
        if (listener.enterPersistentObject) {
            listener.enterPersistentObject(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPersistentObject) {
            listener.exitPersistentObject(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPersistentObject) {
            return visitor.visitPersistentObject(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PersistentObjectContext = PersistentObjectContext;
class ObjectAttributeContext extends ParserRuleContext_1.ParserRuleContext {
    enumAttribute() {
        return this.tryGetRuleContext(0, EnumAttributeContext);
    }
    primitiveAttribute() {
        return this.tryGetRuleContext(0, PrimitiveAttributeContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_objectAttribute; }
    // @Override
    enterRule(listener) {
        if (listener.enterObjectAttribute) {
            listener.enterObjectAttribute(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitObjectAttribute) {
            listener.exitObjectAttribute(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitObjectAttribute) {
            return visitor.visitObjectAttribute(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ObjectAttributeContext = ObjectAttributeContext;
class RelationshipContext extends ParserRuleContext_1.ParserRuleContext {
    multiplicityAnnotation() {
        return this.getRuleContext(0, MultiplicityAnnotationContext);
    }
    ID(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.ID);
        }
        else {
            return this.getToken(MezDSLParser.ID, i);
        }
    }
    VIA() { return this.tryGetToken(MezDSLParser.VIA, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_relationship; }
    // @Override
    enterRule(listener) {
        if (listener.enterRelationship) {
            listener.enterRelationship(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRelationship) {
            listener.exitRelationship(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRelationship) {
            return visitor.visitRelationship(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RelationshipContext = RelationshipContext;
class PrimitiveAttributeContext extends ParserRuleContext_1.ParserRuleContext {
    primitiveType() {
        return this.getRuleContext(0, PrimitiveTypeContext);
    }
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    attributeAnnotation(i) {
        if (i === undefined) {
            return this.getRuleContexts(AttributeAnnotationContext);
        }
        else {
            return this.getRuleContext(i, AttributeAnnotationContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_primitiveAttribute; }
    // @Override
    enterRule(listener) {
        if (listener.enterPrimitiveAttribute) {
            listener.enterPrimitiveAttribute(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPrimitiveAttribute) {
            listener.exitPrimitiveAttribute(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPrimitiveAttribute) {
            return visitor.visitPrimitiveAttribute(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PrimitiveAttributeContext = PrimitiveAttributeContext;
class EnumAttributeContext extends ParserRuleContext_1.ParserRuleContext {
    ENUM_ID() { return this.getToken(MezDSLParser.ENUM_ID, 0); }
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    attributeAnnotation(i) {
        if (i === undefined) {
            return this.getRuleContexts(AttributeAnnotationContext);
        }
        else {
            return this.getRuleContext(i, AttributeAnnotationContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_enumAttribute; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnumAttribute) {
            listener.enterEnumAttribute(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnumAttribute) {
            listener.exitEnumAttribute(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnumAttribute) {
            return visitor.visitEnumAttribute(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnumAttributeContext = EnumAttributeContext;
class EnumerationContext extends ParserRuleContext_1.ParserRuleContext {
    ENUM_ID() { return this.getToken(MezDSLParser.ENUM_ID, 0); }
    enumValue(i) {
        if (i === undefined) {
            return this.getRuleContexts(EnumValueContext);
        }
        else {
            return this.getRuleContext(i, EnumValueContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_enumeration; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnumeration) {
            listener.enterEnumeration(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnumeration) {
            listener.exitEnumeration(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnumeration) {
            return visitor.visitEnumeration(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnumerationContext = EnumerationContext;
class EnumValueContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_enumValue; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnumValue) {
            listener.enterEnumValue(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnumValue) {
            listener.exitEnumValue(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnumValue) {
            return visitor.visitEnumValue(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnumValueContext = EnumValueContext;
class MultiplicityAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    relationshipMultiplicity() {
        return this.getRuleContext(0, RelationshipMultiplicityContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_multiplicityAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterMultiplicityAnnotation) {
            listener.enterMultiplicityAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMultiplicityAnnotation) {
            listener.exitMultiplicityAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMultiplicityAnnotation) {
            return visitor.visitMultiplicityAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MultiplicityAnnotationContext = MultiplicityAnnotationContext;
class ObjectAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    roleAnnotation() {
        return this.tryGetRuleContext(0, RoleAnnotationContext);
    }
    restrictedObjectAnnotation() {
        return this.tryGetRuleContext(0, RestrictedObjectAnnotationContext);
    }
    notTrackedAnnotation() {
        return this.tryGetRuleContext(0, NotTrackedAnnotationContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_objectAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterObjectAnnotation) {
            listener.enterObjectAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitObjectAnnotation) {
            listener.exitObjectAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitObjectAnnotation) {
            return visitor.visitObjectAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ObjectAnnotationContext = ObjectAnnotationContext;
class AttributeAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    validatorAnnotation() {
        return this.tryGetRuleContext(0, ValidatorAnnotationContext);
    }
    restrictedAttributeAnnotation() {
        return this.tryGetRuleContext(0, RestrictedAttributeAnnotationContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_attributeAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterAttributeAnnotation) {
            listener.enterAttributeAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAttributeAnnotation) {
            listener.exitAttributeAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAttributeAnnotation) {
            return visitor.visitAttributeAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AttributeAnnotationContext = AttributeAnnotationContext;
class FunctionAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    receiveSMSAnnotation() {
        return this.tryGetRuleContext(0, ReceiveSMSAnnotationContext);
    }
    unitTestAnnotation() {
        return this.tryGetRuleContext(0, UnitTestAnnotationContext);
    }
    scheduledAnnotation() {
        return this.tryGetRuleContext(0, ScheduledAnnotationContext);
    }
    inviteUserAnnotation() {
        return this.tryGetRuleContext(0, InviteUserAnnotationContext);
    }
    roleNameAnnotation() {
        return this.tryGetRuleContext(0, RoleNameAnnotationContext);
    }
    onPaymentUpdateAnnotation() {
        return this.tryGetRuleContext(0, OnPaymentUpdateAnnotationContext);
    }
    onScheduledFunctionResultUpdateAnnotation() {
        return this.tryGetRuleContext(0, OnScheduledFunctionResultUpdateAnnotationContext);
    }
    onSmsResultUpdateAnnotation() {
        return this.tryGetRuleContext(0, OnSmsResultUpdateAnnotationContext);
    }
    postAnnotation() {
        return this.tryGetRuleContext(0, PostAnnotationContext);
    }
    getAnnotation() {
        return this.tryGetRuleContext(0, GetAnnotationContext);
    }
    putAnnotation() {
        return this.tryGetRuleContext(0, PutAnnotationContext);
    }
    deleteAnnotation() {
        return this.tryGetRuleContext(0, DeleteAnnotationContext);
    }
    responseExpandAnnotation() {
        return this.tryGetRuleContext(0, ResponseExpandAnnotationContext);
    }
    responseExcludeAnnotation() {
        return this.tryGetRuleContext(0, ResponseExcludeAnnotationContext);
    }
    ussdAnnotation() {
        return this.tryGetRuleContext(0, UssdAnnotationContext);
    }
    onPaymentStatusRequestResultUpdateAnnotation() {
        return this.tryGetRuleContext(0, OnPaymentStatusRequestResultUpdateAnnotationContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_functionAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterFunctionAnnotation) {
            listener.enterFunctionAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFunctionAnnotation) {
            listener.exitFunctionAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunctionAnnotation) {
            return visitor.visitFunctionAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionAnnotationContext = FunctionAnnotationContext;
class ReceiveSMSAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    RECEIVESMS() { return this.getToken(MezDSLParser.RECEIVESMS, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_receiveSMSAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterReceiveSMSAnnotation) {
            listener.enterReceiveSMSAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitReceiveSMSAnnotation) {
            listener.exitReceiveSMSAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitReceiveSMSAnnotation) {
            return visitor.visitReceiveSMSAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ReceiveSMSAnnotationContext = ReceiveSMSAnnotationContext;
class UnitTestAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    TEST() { return this.getToken(MezDSLParser.TEST, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_unitTestAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterUnitTestAnnotation) {
            listener.enterUnitTestAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitUnitTestAnnotation) {
            listener.exitUnitTestAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUnitTestAnnotation) {
            return visitor.visitUnitTestAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UnitTestAnnotationContext = UnitTestAnnotationContext;
class UssdAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    USSD() { return this.getToken(MezDSLParser.USSD, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_ussdAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterUssdAnnotation) {
            listener.enterUssdAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitUssdAnnotation) {
            listener.exitUssdAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUssdAnnotation) {
            return visitor.visitUssdAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UssdAnnotationContext = UssdAnnotationContext;
class ScheduledAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    SCHEDULED() { return this.getToken(MezDSLParser.SCHEDULED, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_scheduledAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterScheduledAnnotation) {
            listener.enterScheduledAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitScheduledAnnotation) {
            listener.exitScheduledAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitScheduledAnnotation) {
            return visitor.visitScheduledAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ScheduledAnnotationContext = ScheduledAnnotationContext;
class InviteUserAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    INVITEUSER() { return this.getToken(MezDSLParser.INVITEUSER, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_inviteUserAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterInviteUserAnnotation) {
            listener.enterInviteUserAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitInviteUserAnnotation) {
            listener.exitInviteUserAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitInviteUserAnnotation) {
            return visitor.visitInviteUserAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.InviteUserAnnotationContext = InviteUserAnnotationContext;
class RoleNameAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ROLENAME() { return this.getToken(MezDSLParser.ROLENAME, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_roleNameAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterRoleNameAnnotation) {
            listener.enterRoleNameAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRoleNameAnnotation) {
            listener.exitRoleNameAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRoleNameAnnotation) {
            return visitor.visitRoleNameAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RoleNameAnnotationContext = RoleNameAnnotationContext;
class OnPaymentUpdateAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ONPAYMENTUPDATE() { return this.getToken(MezDSLParser.ONPAYMENTUPDATE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_onPaymentUpdateAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterOnPaymentUpdateAnnotation) {
            listener.enterOnPaymentUpdateAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitOnPaymentUpdateAnnotation) {
            listener.exitOnPaymentUpdateAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOnPaymentUpdateAnnotation) {
            return visitor.visitOnPaymentUpdateAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OnPaymentUpdateAnnotationContext = OnPaymentUpdateAnnotationContext;
class OnScheduledFunctionResultUpdateAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ONSCHEDULEDFUNCTIONRESULTUPDATE() { return this.getToken(MezDSLParser.ONSCHEDULEDFUNCTIONRESULTUPDATE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_onScheduledFunctionResultUpdateAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterOnScheduledFunctionResultUpdateAnnotation) {
            listener.enterOnScheduledFunctionResultUpdateAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitOnScheduledFunctionResultUpdateAnnotation) {
            listener.exitOnScheduledFunctionResultUpdateAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOnScheduledFunctionResultUpdateAnnotation) {
            return visitor.visitOnScheduledFunctionResultUpdateAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OnScheduledFunctionResultUpdateAnnotationContext = OnScheduledFunctionResultUpdateAnnotationContext;
class OnSmsResultUpdateAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ONSMSRESULTUPDATE() { return this.getToken(MezDSLParser.ONSMSRESULTUPDATE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_onSmsResultUpdateAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterOnSmsResultUpdateAnnotation) {
            listener.enterOnSmsResultUpdateAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitOnSmsResultUpdateAnnotation) {
            listener.exitOnSmsResultUpdateAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOnSmsResultUpdateAnnotation) {
            return visitor.visitOnSmsResultUpdateAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OnSmsResultUpdateAnnotationContext = OnSmsResultUpdateAnnotationContext;
class OnPaymentStatusRequestResultUpdateAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ONPAYMENTSTATUSREQUESTRESULTUPDATE() { return this.getToken(MezDSLParser.ONPAYMENTSTATUSREQUESTRESULTUPDATE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_onPaymentStatusRequestResultUpdateAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterOnPaymentStatusRequestResultUpdateAnnotation) {
            listener.enterOnPaymentStatusRequestResultUpdateAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitOnPaymentStatusRequestResultUpdateAnnotation) {
            listener.exitOnPaymentStatusRequestResultUpdateAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOnPaymentStatusRequestResultUpdateAnnotation) {
            return visitor.visitOnPaymentStatusRequestResultUpdateAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OnPaymentStatusRequestResultUpdateAnnotationContext = OnPaymentStatusRequestResultUpdateAnnotationContext;
class PostAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    POST_API() { return this.getToken(MezDSLParser.POST_API, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_postAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterPostAnnotation) {
            listener.enterPostAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPostAnnotation) {
            listener.exitPostAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPostAnnotation) {
            return visitor.visitPostAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PostAnnotationContext = PostAnnotationContext;
class GetAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    GET_API() { return this.getToken(MezDSLParser.GET_API, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_getAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterGetAnnotation) {
            listener.enterGetAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitGetAnnotation) {
            listener.exitGetAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitGetAnnotation) {
            return visitor.visitGetAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.GetAnnotationContext = GetAnnotationContext;
class PutAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    PUT_API() { return this.getToken(MezDSLParser.PUT_API, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_putAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterPutAnnotation) {
            listener.enterPutAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPutAnnotation) {
            listener.exitPutAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPutAnnotation) {
            return visitor.visitPutAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PutAnnotationContext = PutAnnotationContext;
class DeleteAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    DELETE_API() { return this.getToken(MezDSLParser.DELETE_API, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_deleteAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterDeleteAnnotation) {
            listener.enterDeleteAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDeleteAnnotation) {
            listener.exitDeleteAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDeleteAnnotation) {
            return visitor.visitDeleteAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DeleteAnnotationContext = DeleteAnnotationContext;
class ResponseExpandAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    RESPONSE_EXPAND() { return this.getToken(MezDSLParser.RESPONSE_EXPAND, 0); }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_responseExpandAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterResponseExpandAnnotation) {
            listener.enterResponseExpandAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitResponseExpandAnnotation) {
            listener.exitResponseExpandAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitResponseExpandAnnotation) {
            return visitor.visitResponseExpandAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ResponseExpandAnnotationContext = ResponseExpandAnnotationContext;
class ResponseExcludeAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    RESPONSE_EXCLUDE() { return this.getToken(MezDSLParser.RESPONSE_EXCLUDE, 0); }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_responseExcludeAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterResponseExcludeAnnotation) {
            listener.enterResponseExcludeAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitResponseExcludeAnnotation) {
            listener.exitResponseExcludeAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitResponseExcludeAnnotation) {
            return visitor.visitResponseExcludeAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ResponseExcludeAnnotationContext = ResponseExcludeAnnotationContext;
class RoleAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ROLE() { return this.getToken(MezDSLParser.ROLE, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_roleAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterRoleAnnotation) {
            listener.enterRoleAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRoleAnnotation) {
            listener.exitRoleAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRoleAnnotation) {
            return visitor.visitRoleAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RoleAnnotationContext = RoleAnnotationContext;
class RestrictedObjectAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    RESTRICT() { return this.getToken(MezDSLParser.RESTRICT, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    selectorBIF() {
        return this.getRuleContext(0, SelectorBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_restrictedObjectAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterRestrictedObjectAnnotation) {
            listener.enterRestrictedObjectAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRestrictedObjectAnnotation) {
            listener.exitRestrictedObjectAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRestrictedObjectAnnotation) {
            return visitor.visitRestrictedObjectAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RestrictedObjectAnnotationContext = RestrictedObjectAnnotationContext;
class RestrictedAttributeAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    RESTRICT() { return this.getToken(MezDSLParser.RESTRICT, 0); }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_restrictedAttributeAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterRestrictedAttributeAnnotation) {
            listener.enterRestrictedAttributeAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRestrictedAttributeAnnotation) {
            listener.exitRestrictedAttributeAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRestrictedAttributeAnnotation) {
            return visitor.visitRestrictedAttributeAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RestrictedAttributeAnnotationContext = RestrictedAttributeAnnotationContext;
class NotTrackedAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    NOT_TRACKED() { return this.getToken(MezDSLParser.NOT_TRACKED, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_notTrackedAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterNotTrackedAnnotation) {
            listener.enterNotTrackedAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitNotTrackedAnnotation) {
            listener.exitNotTrackedAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitNotTrackedAnnotation) {
            return visitor.visitNotTrackedAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.NotTrackedAnnotationContext = NotTrackedAnnotationContext;
class ValidatorAnnotationContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_validatorAnnotation; }
    // @Override
    enterRule(listener) {
        if (listener.enterValidatorAnnotation) {
            listener.enterValidatorAnnotation(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitValidatorAnnotation) {
            listener.exitValidatorAnnotation(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitValidatorAnnotation) {
            return visitor.visitValidatorAnnotation(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ValidatorAnnotationContext = ValidatorAnnotationContext;
class ValidatorContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    atomicValidator(i) {
        if (i === undefined) {
            return this.getRuleContexts(AtomicValidatorContext);
        }
        else {
            return this.getRuleContext(i, AtomicValidatorContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_validator; }
    // @Override
    enterRule(listener) {
        if (listener.enterValidator) {
            listener.enterValidator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitValidator) {
            listener.exitValidator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitValidator) {
            return visitor.visitValidator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ValidatorContext = ValidatorContext;
class AtomicValidatorContext extends ParserRuleContext_1.ParserRuleContext {
    NOTNULL() { return this.tryGetToken(MezDSLParser.NOTNULL, 0); }
    REGEX() { return this.tryGetToken(MezDSLParser.REGEX, 0); }
    STR_LITERAL() { return this.tryGetToken(MezDSLParser.STR_LITERAL, 0); }
    MAXLEN() { return this.tryGetToken(MezDSLParser.MAXLEN, 0); }
    INT_LITERAL() { return this.tryGetToken(MezDSLParser.INT_LITERAL, 0); }
    MINLEN() { return this.tryGetToken(MezDSLParser.MINLEN, 0); }
    MAXVAL() { return this.tryGetToken(MezDSLParser.MAXVAL, 0); }
    MINUS() { return this.tryGetToken(MezDSLParser.MINUS, 0); }
    DEC_LITERAL() { return this.tryGetToken(MezDSLParser.DEC_LITERAL, 0); }
    MINVAL() { return this.tryGetToken(MezDSLParser.MINVAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_atomicValidator; }
    // @Override
    enterRule(listener) {
        if (listener.enterAtomicValidator) {
            listener.enterAtomicValidator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAtomicValidator) {
            listener.exitAtomicValidator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAtomicValidator) {
            return visitor.visitAtomicValidator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AtomicValidatorContext = AtomicValidatorContext;
class RelationshipMultiplicityContext extends ParserRuleContext_1.ParserRuleContext {
    ONETOONE() { return this.tryGetToken(MezDSLParser.ONETOONE, 0); }
    MANYTOMANY() { return this.tryGetToken(MezDSLParser.MANYTOMANY, 0); }
    MANYTOONE() { return this.tryGetToken(MezDSLParser.MANYTOONE, 0); }
    ONETOMANY() { return this.tryGetToken(MezDSLParser.ONETOMANY, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_relationshipMultiplicity; }
    // @Override
    enterRule(listener) {
        if (listener.enterRelationshipMultiplicity) {
            listener.enterRelationshipMultiplicity(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRelationshipMultiplicity) {
            listener.exitRelationshipMultiplicity(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRelationshipMultiplicity) {
            return visitor.visitRelationshipMultiplicity(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RelationshipMultiplicityContext = RelationshipMultiplicityContext;
class VariableDeclarationContext extends ParserRuleContext_1.ParserRuleContext {
    variableType() {
        return this.getRuleContext(0, VariableTypeContext);
    }
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    COL() { return this.tryGetToken(MezDSLParser.COL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_variableDeclaration; }
    // @Override
    enterRule(listener) {
        if (listener.enterVariableDeclaration) {
            listener.enterVariableDeclaration(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitVariableDeclaration) {
            listener.exitVariableDeclaration(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitVariableDeclaration) {
            return visitor.visitVariableDeclaration(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.VariableDeclarationContext = VariableDeclarationContext;
class VariableDeclareInitContext extends ParserRuleContext_1.ParserRuleContext {
    variableDeclaration() {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    ASSIGN() { return this.getToken(MezDSLParser.ASSIGN, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_variableDeclareInit; }
    // @Override
    enterRule(listener) {
        if (listener.enterVariableDeclareInit) {
            listener.enterVariableDeclareInit(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitVariableDeclareInit) {
            listener.exitVariableDeclareInit(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitVariableDeclareInit) {
            return visitor.visitVariableDeclareInit(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.VariableDeclareInitContext = VariableDeclareInitContext;
class VariableTypeContext extends ParserRuleContext_1.ParserRuleContext {
    primitiveType() {
        return this.tryGetRuleContext(0, PrimitiveTypeContext);
    }
    ID() { return this.tryGetToken(MezDSLParser.ID, 0); }
    ENUM_ID() { return this.tryGetToken(MezDSLParser.ENUM_ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_variableType; }
    // @Override
    enterRule(listener) {
        if (listener.enterVariableType) {
            listener.enterVariableType(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitVariableType) {
            listener.exitVariableType(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitVariableType) {
            return visitor.visitVariableType(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.VariableTypeContext = VariableTypeContext;
class FunctionDefinitionContext extends ParserRuleContext_1.ParserRuleContext {
    functionSignature() {
        return this.getRuleContext(0, FunctionSignatureContext);
    }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    functionAnnotation(i) {
        if (i === undefined) {
            return this.getRuleContexts(FunctionAnnotationContext);
        }
        else {
            return this.getRuleContext(i, FunctionAnnotationContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_functionDefinition; }
    // @Override
    enterRule(listener) {
        if (listener.enterFunctionDefinition) {
            listener.enterFunctionDefinition(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFunctionDefinition) {
            listener.exitFunctionDefinition(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunctionDefinition) {
            return visitor.visitFunctionDefinition(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionDefinitionContext = FunctionDefinitionContext;
class CodeBlockContext extends ParserRuleContext_1.ParserRuleContext {
    codeBlockContent(i) {
        if (i === undefined) {
            return this.getRuleContexts(CodeBlockContentContext);
        }
        else {
            return this.getRuleContext(i, CodeBlockContentContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_codeBlock; }
    // @Override
    enterRule(listener) {
        if (listener.enterCodeBlock) {
            listener.enterCodeBlock(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCodeBlock) {
            listener.exitCodeBlock(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCodeBlock) {
            return visitor.visitCodeBlock(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CodeBlockContext = CodeBlockContext;
class CodeBlockContentContext extends ParserRuleContext_1.ParserRuleContext {
    variableDeclaration() {
        return this.tryGetRuleContext(0, VariableDeclarationContext);
    }
    variableDeclareInit() {
        return this.tryGetRuleContext(0, VariableDeclareInitContext);
    }
    statement() {
        return this.tryGetRuleContext(0, StatementContext);
    }
    complexStatement() {
        return this.tryGetRuleContext(0, ComplexStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_codeBlockContent; }
    // @Override
    enterRule(listener) {
        if (listener.enterCodeBlockContent) {
            listener.enterCodeBlockContent(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCodeBlockContent) {
            listener.exitCodeBlockContent(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCodeBlockContent) {
            return visitor.visitCodeBlockContent(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CodeBlockContentContext = CodeBlockContentContext;
class FunctionSignatureContext extends ParserRuleContext_1.ParserRuleContext {
    typeName() {
        return this.getRuleContext(0, TypeNameContext);
    }
    specialFunctionName() {
        return this.tryGetRuleContext(0, SpecialFunctionNameContext);
    }
    parameter(i) {
        if (i === undefined) {
            return this.getRuleContexts(ParameterContext);
        }
        else {
            return this.getRuleContext(i, ParameterContext);
        }
    }
    COL() { return this.tryGetToken(MezDSLParser.COL, 0); }
    ID() { return this.tryGetToken(MezDSLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_functionSignature; }
    // @Override
    enterRule(listener) {
        if (listener.enterFunctionSignature) {
            listener.enterFunctionSignature(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFunctionSignature) {
            listener.exitFunctionSignature(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunctionSignature) {
            return visitor.visitFunctionSignature(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionSignatureContext = FunctionSignatureContext;
class SpecialFunctionNameContext extends ParserRuleContext_1.ParserRuleContext {
    COLLECTION_SELECT() { return this.tryGetToken(MezDSLParser.COLLECTION_SELECT, 0); }
    OBJECT_INVITE() { return this.tryGetToken(MezDSLParser.OBJECT_INVITE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_specialFunctionName; }
    // @Override
    enterRule(listener) {
        if (listener.enterSpecialFunctionName) {
            listener.enterSpecialFunctionName(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSpecialFunctionName) {
            listener.exitSpecialFunctionName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSpecialFunctionName) {
            return visitor.visitSpecialFunctionName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SpecialFunctionNameContext = SpecialFunctionNameContext;
class TypeNameContext extends ParserRuleContext_1.ParserRuleContext {
    primitiveType() {
        return this.tryGetRuleContext(0, PrimitiveTypeContext);
    }
    ID() { return this.tryGetToken(MezDSLParser.ID, 0); }
    ENUM_ID() { return this.tryGetToken(MezDSLParser.ENUM_ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_typeName; }
    // @Override
    enterRule(listener) {
        if (listener.enterTypeName) {
            listener.enterTypeName(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitTypeName) {
            listener.exitTypeName(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTypeName) {
            return visitor.visitTypeName(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TypeNameContext = TypeNameContext;
class ParameterContext extends ParserRuleContext_1.ParserRuleContext {
    typeName() {
        return this.getRuleContext(0, TypeNameContext);
    }
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    COL() { return this.tryGetToken(MezDSLParser.COL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_parameter; }
    // @Override
    enterRule(listener) {
        if (listener.enterParameter) {
            listener.enterParameter(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitParameter) {
            listener.exitParameter(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitParameter) {
            return visitor.visitParameter(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ParameterContext = ParameterContext;
class StatementContext extends ParserRuleContext_1.ParserRuleContext {
    returnStatement() {
        return this.tryGetRuleContext(0, ReturnStatementContext);
    }
    simpleStatement() {
        return this.tryGetRuleContext(0, SimpleStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_statement; }
    // @Override
    enterRule(listener) {
        if (listener.enterStatement) {
            listener.enterStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStatement) {
            listener.exitStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStatement) {
            return visitor.visitStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StatementContext = StatementContext;
class ReturnStatementContext extends ParserRuleContext_1.ParserRuleContext {
    RETURN() { return this.getToken(MezDSLParser.RETURN, 0); }
    expression() {
        return this.tryGetRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_returnStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterReturnStatement) {
            listener.enterReturnStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitReturnStatement) {
            listener.exitReturnStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitReturnStatement) {
            return visitor.visitReturnStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ReturnStatementContext = ReturnStatementContext;
class SimpleStatementContext extends ParserRuleContext_1.ParserRuleContext {
    assignStatement() {
        return this.tryGetRuleContext(0, AssignStatementContext);
    }
    bifStatement() {
        return this.tryGetRuleContext(0, BifStatementContext);
    }
    functionCall() {
        return this.tryGetRuleContext(0, FunctionCallContext);
    }
    incrementStatement() {
        return this.tryGetRuleContext(0, IncrementStatementContext);
    }
    decrementStatement() {
        return this.tryGetRuleContext(0, DecrementStatementContext);
    }
    throwStatement() {
        return this.tryGetRuleContext(0, ThrowStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_simpleStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterSimpleStatement) {
            listener.enterSimpleStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSimpleStatement) {
            listener.exitSimpleStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSimpleStatement) {
            return visitor.visitSimpleStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SimpleStatementContext = SimpleStatementContext;
class IncrementStatementContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    INC() { return this.getToken(MezDSLParser.INC, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_incrementStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterIncrementStatement) {
            listener.enterIncrementStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIncrementStatement) {
            listener.exitIncrementStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIncrementStatement) {
            return visitor.visitIncrementStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IncrementStatementContext = IncrementStatementContext;
class DecrementStatementContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    DEC() { return this.getToken(MezDSLParser.DEC, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_decrementStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterDecrementStatement) {
            listener.enterDecrementStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDecrementStatement) {
            listener.exitDecrementStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDecrementStatement) {
            return visitor.visitDecrementStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DecrementStatementContext = DecrementStatementContext;
class ComplexStatementContext extends ParserRuleContext_1.ParserRuleContext {
    ifStatement() {
        return this.tryGetRuleContext(0, IfStatementContext);
    }
    forLoop() {
        return this.tryGetRuleContext(0, ForLoopContext);
    }
    forEach() {
        return this.tryGetRuleContext(0, ForEachContext);
    }
    tryStatement() {
        return this.tryGetRuleContext(0, TryStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_complexStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterComplexStatement) {
            listener.enterComplexStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitComplexStatement) {
            listener.exitComplexStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComplexStatement) {
            return visitor.visitComplexStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComplexStatementContext = ComplexStatementContext;
class ForEachContext extends ParserRuleContext_1.ParserRuleContext {
    variableDeclaration() {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forEach; }
    // @Override
    enterRule(listener) {
        if (listener.enterForEach) {
            listener.enterForEach(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForEach) {
            listener.exitForEach(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForEach) {
            return visitor.visitForEach(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForEachContext = ForEachContext;
class ForLoopContext extends ParserRuleContext_1.ParserRuleContext {
    forLoopParams() {
        return this.getRuleContext(0, ForLoopParamsContext);
    }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoop; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoop) {
            listener.enterForLoop(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoop) {
            listener.exitForLoop(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoop) {
            return visitor.visitForLoop(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopContext = ForLoopContext;
class ForLoopParamsContext extends ParserRuleContext_1.ParserRuleContext {
    forLoopInitialCondition() {
        return this.tryGetRuleContext(0, ForLoopInitialConditionContext);
    }
    forLoopCondition() {
        return this.tryGetRuleContext(0, ForLoopConditionContext);
    }
    forLoopPostLoop() {
        return this.tryGetRuleContext(0, ForLoopPostLoopContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoopParams; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoopParams) {
            listener.enterForLoopParams(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoopParams) {
            listener.exitForLoopParams(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoopParams) {
            return visitor.visitForLoopParams(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopParamsContext = ForLoopParamsContext;
class ForLoopInitialConditionContext extends ParserRuleContext_1.ParserRuleContext {
    simpleStatement() {
        return this.tryGetRuleContext(0, SimpleStatementContext);
    }
    variableDeclareInit() {
        return this.tryGetRuleContext(0, VariableDeclareInitContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoopInitialCondition; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoopInitialCondition) {
            listener.enterForLoopInitialCondition(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoopInitialCondition) {
            listener.exitForLoopInitialCondition(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoopInitialCondition) {
            return visitor.visitForLoopInitialCondition(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopInitialConditionContext = ForLoopInitialConditionContext;
class ForLoopConditionContext extends ParserRuleContext_1.ParserRuleContext {
    forLoopConditionOperator() {
        return this.getRuleContext(0, ForLoopConditionOperatorContext);
    }
    addExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(AddExpressionContext);
        }
        else {
            return this.getRuleContext(i, AddExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoopCondition; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoopCondition) {
            listener.enterForLoopCondition(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoopCondition) {
            listener.exitForLoopCondition(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoopCondition) {
            return visitor.visitForLoopCondition(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopConditionContext = ForLoopConditionContext;
class ForLoopPostLoopContext extends ParserRuleContext_1.ParserRuleContext {
    simpleStatement() {
        return this.getRuleContext(0, SimpleStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoopPostLoop; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoopPostLoop) {
            listener.enterForLoopPostLoop(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoopPostLoop) {
            listener.exitForLoopPostLoop(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoopPostLoop) {
            return visitor.visitForLoopPostLoop(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopPostLoopContext = ForLoopPostLoopContext;
class ForLoopConditionOperatorContext extends ParserRuleContext_1.ParserRuleContext {
    comparisonOperator() {
        return this.tryGetRuleContext(0, ComparisonOperatorContext);
    }
    equalityOperator() {
        return this.tryGetRuleContext(0, EqualityOperatorContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forLoopConditionOperator; }
    // @Override
    enterRule(listener) {
        if (listener.enterForLoopConditionOperator) {
            listener.enterForLoopConditionOperator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForLoopConditionOperator) {
            listener.exitForLoopConditionOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForLoopConditionOperator) {
            return visitor.visitForLoopConditionOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForLoopConditionOperatorContext = ForLoopConditionOperatorContext;
class TryStatementContext extends ParserRuleContext_1.ParserRuleContext {
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    catchPart() {
        return this.tryGetRuleContext(0, CatchPartContext);
    }
    finallyPart() {
        return this.tryGetRuleContext(0, FinallyPartContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_tryStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterTryStatement) {
            listener.enterTryStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitTryStatement) {
            listener.exitTryStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitTryStatement) {
            return visitor.visitTryStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.TryStatementContext = TryStatementContext;
class CatchPartContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_catchPart; }
    // @Override
    enterRule(listener) {
        if (listener.enterCatchPart) {
            listener.enterCatchPart(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCatchPart) {
            listener.exitCatchPart(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCatchPart) {
            return visitor.visitCatchPart(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CatchPartContext = CatchPartContext;
class FinallyPartContext extends ParserRuleContext_1.ParserRuleContext {
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_finallyPart; }
    // @Override
    enterRule(listener) {
        if (listener.enterFinallyPart) {
            listener.enterFinallyPart(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFinallyPart) {
            listener.exitFinallyPart(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFinallyPart) {
            return visitor.visitFinallyPart(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FinallyPartContext = FinallyPartContext;
class IfStatementContext extends ParserRuleContext_1.ParserRuleContext {
    orExpression() {
        return this.getRuleContext(0, OrExpressionContext);
    }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    elseIfPart(i) {
        if (i === undefined) {
            return this.getRuleContexts(ElseIfPartContext);
        }
        else {
            return this.getRuleContext(i, ElseIfPartContext);
        }
    }
    elsePart() {
        return this.tryGetRuleContext(0, ElsePartContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_ifStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterIfStatement) {
            listener.enterIfStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIfStatement) {
            listener.exitIfStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIfStatement) {
            return visitor.visitIfStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IfStatementContext = IfStatementContext;
class ElseIfPartContext extends ParserRuleContext_1.ParserRuleContext {
    orExpression() {
        return this.getRuleContext(0, OrExpressionContext);
    }
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_elseIfPart; }
    // @Override
    enterRule(listener) {
        if (listener.enterElseIfPart) {
            listener.enterElseIfPart(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitElseIfPart) {
            listener.exitElseIfPart(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitElseIfPart) {
            return visitor.visitElseIfPart(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ElseIfPartContext = ElseIfPartContext;
class ElsePartContext extends ParserRuleContext_1.ParserRuleContext {
    codeBlock() {
        return this.getRuleContext(0, CodeBlockContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_elsePart; }
    // @Override
    enterRule(listener) {
        if (listener.enterElsePart) {
            listener.enterElsePart(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitElsePart) {
            listener.exitElsePart(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitElsePart) {
            return visitor.visitElsePart(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ElsePartContext = ElsePartContext;
class ThrowStatementContext extends ParserRuleContext_1.ParserRuleContext {
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_throwStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterThrowStatement) {
            listener.enterThrowStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitThrowStatement) {
            listener.exitThrowStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitThrowStatement) {
            return visitor.visitThrowStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ThrowStatementContext = ThrowStatementContext;
class BifStatementContext extends ParserRuleContext_1.ParserRuleContext {
    systemBIFStatement() {
        return this.tryGetRuleContext(0, SystemBIFStatementContext);
    }
    persistenceBIFStatement() {
        return this.tryGetRuleContext(0, PersistenceBIFStatementContext);
    }
    instanceBIFStatement() {
        return this.tryGetRuleContext(0, InstanceBIFStatementContext);
    }
    assertBIFStatement() {
        return this.tryGetRuleContext(0, AssertBIFStatementContext);
    }
    jsonBIFStatement() {
        return this.tryGetRuleContext(0, JsonBIFStatementContext);
    }
    apiBIFStatement() {
        return this.tryGetRuleContext(0, ApiBIFStatementContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_bifStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterBifStatement) {
            listener.enterBifStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBifStatement) {
            listener.exitBifStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBifStatement) {
            return visitor.visitBifStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BifStatementContext = BifStatementContext;
class AssertBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    assertBIF() {
        return this.getRuleContext(0, AssertBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_assertBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterAssertBIFStatement) {
            listener.enterAssertBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAssertBIFStatement) {
            listener.exitAssertBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAssertBIFStatement) {
            return visitor.visitAssertBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AssertBIFStatementContext = AssertBIFStatementContext;
class AssertBIFContext extends ParserRuleContext_1.ParserRuleContext {
    IS_EQUAL() { return this.tryGetToken(MezDSLParser.IS_EQUAL, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    IS_TRUE() { return this.tryGetToken(MezDSLParser.IS_TRUE, 0); }
    IS_BOTH() { return this.tryGetToken(MezDSLParser.IS_BOTH, 0); }
    IS_EITHER() { return this.tryGetToken(MezDSLParser.IS_EITHER, 0); }
    IS_FALSE() { return this.tryGetToken(MezDSLParser.IS_FALSE, 0); }
    IS_GT() { return this.tryGetToken(MezDSLParser.IS_GT, 0); }
    IS_GTE() { return this.tryGetToken(MezDSLParser.IS_GTE, 0); }
    IS_LT() { return this.tryGetToken(MezDSLParser.IS_LT, 0); }
    IS_LTE() { return this.tryGetToken(MezDSLParser.IS_LTE, 0); }
    IS_NOTEQUAL() { return this.tryGetToken(MezDSLParser.IS_NOTEQUAL, 0); }
    IS_NULL() { return this.tryGetToken(MezDSLParser.IS_NULL, 0); }
    IS_NOT_NULL() { return this.tryGetToken(MezDSLParser.IS_NOT_NULL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_assertBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterAssertBIF) {
            listener.enterAssertBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAssertBIF) {
            listener.exitAssertBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAssertBIF) {
            return visitor.visitAssertBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AssertBIFContext = AssertBIFContext;
class InstanceBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    collectionsStatementBIF() {
        return this.tryGetRuleContext(0, CollectionsStatementBIFContext);
    }
    notificationStatementBIF() {
        return this.tryGetRuleContext(0, NotificationStatementBIFContext);
    }
    OBJECT_INVITE() { return this.tryGetToken(MezDSLParser.OBJECT_INVITE, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    removeRoleStatementBIF() {
        return this.tryGetRuleContext(0, RemoveRoleStatementBIFContext);
    }
    forcePasswordResetStatementBIF() {
        return this.tryGetRuleContext(0, ForcePasswordResetStatementBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_instanceBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterInstanceBIFStatement) {
            listener.enterInstanceBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitInstanceBIFStatement) {
            listener.exitInstanceBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitInstanceBIFStatement) {
            return visitor.visitInstanceBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.InstanceBIFStatementContext = InstanceBIFStatementContext;
class CollectionsStatementBIFContext extends ParserRuleContext_1.ParserRuleContext {
    CLEAR() { return this.tryGetToken(MezDSLParser.CLEAR, 0); }
    APPEND() { return this.tryGetToken(MezDSLParser.APPEND, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    PREPEND() { return this.tryGetToken(MezDSLParser.PREPEND, 0); }
    SORTASC() { return this.tryGetToken(MezDSLParser.SORTASC, 0); }
    STR_LITERAL() { return this.tryGetToken(MezDSLParser.STR_LITERAL, 0); }
    SORTDESC() { return this.tryGetToken(MezDSLParser.SORTDESC, 0); }
    ADD() { return this.tryGetToken(MezDSLParser.ADD, 0); }
    REMOVE() { return this.tryGetToken(MezDSLParser.REMOVE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_collectionsStatementBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterCollectionsStatementBIF) {
            listener.enterCollectionsStatementBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCollectionsStatementBIF) {
            listener.exitCollectionsStatementBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCollectionsStatementBIF) {
            return visitor.visitCollectionsStatementBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CollectionsStatementBIFContext = CollectionsStatementBIFContext;
class NotificationStatementBIFContext extends ParserRuleContext_1.ParserRuleContext {
    NOTIFY() { return this.getToken(MezDSLParser.NOTIFY, 0); }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_notificationStatementBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterNotificationStatementBIF) {
            listener.enterNotificationStatementBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitNotificationStatementBIF) {
            listener.exitNotificationStatementBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitNotificationStatementBIF) {
            return visitor.visitNotificationStatementBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.NotificationStatementBIFContext = NotificationStatementBIFContext;
class RemoveRoleStatementBIFContext extends ParserRuleContext_1.ParserRuleContext {
    REMOVE_ROLE() { return this.getToken(MezDSLParser.REMOVE_ROLE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_removeRoleStatementBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterRemoveRoleStatementBIF) {
            listener.enterRemoveRoleStatementBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitRemoveRoleStatementBIF) {
            listener.exitRemoveRoleStatementBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitRemoveRoleStatementBIF) {
            return visitor.visitRemoveRoleStatementBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.RemoveRoleStatementBIFContext = RemoveRoleStatementBIFContext;
class ForcePasswordResetStatementBIFContext extends ParserRuleContext_1.ParserRuleContext {
    FORCE_PASSWORD_RESET() { return this.getToken(MezDSLParser.FORCE_PASSWORD_RESET, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_forcePasswordResetStatementBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterForcePasswordResetStatementBIF) {
            listener.enterForcePasswordResetStatementBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitForcePasswordResetStatementBIF) {
            listener.exitForcePasswordResetStatementBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitForcePasswordResetStatementBIF) {
            return visitor.visitForcePasswordResetStatementBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ForcePasswordResetStatementBIFContext = ForcePasswordResetStatementBIFContext;
class PersistenceBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    SAVE() { return this.tryGetToken(MezDSLParser.SAVE, 0); }
    DELETE() { return this.tryGetToken(MezDSLParser.DELETE, 0); }
    expression() {
        return this.tryGetRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_persistenceBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterPersistenceBIFStatement) {
            listener.enterPersistenceBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPersistenceBIFStatement) {
            listener.exitPersistenceBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPersistenceBIFStatement) {
            return visitor.visitPersistenceBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PersistenceBIFStatementContext = PersistenceBIFStatementContext;
class SystemBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    LOG() { return this.tryGetToken(MezDSLParser.LOG, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    WARN() { return this.tryGetToken(MezDSLParser.WARN, 0); }
    ERROR() { return this.tryGetToken(MezDSLParser.ERROR, 0); }
    ALERT() { return this.tryGetToken(MezDSLParser.ALERT, 0); }
    ALERT_WARN() { return this.tryGetToken(MezDSLParser.ALERT_WARN, 0); }
    ALERT_ERROR() { return this.tryGetToken(MezDSLParser.ALERT_ERROR, 0); }
    SMS() { return this.tryGetToken(MezDSLParser.SMS, 0); }
    SMS_SEND() { return this.tryGetToken(MezDSLParser.SMS_SEND, 0); }
    SMS_END_CONVERSATION() { return this.tryGetToken(MezDSLParser.SMS_END_CONVERSATION, 0); }
    EMAIL() { return this.tryGetToken(MezDSLParser.EMAIL, 0); }
    emailAttachment(i) {
        if (i === undefined) {
            return this.getRuleContexts(EmailAttachmentContext);
        }
        else {
            return this.getRuleContext(i, EmailAttachmentContext);
        }
    }
    enumValueExpression() {
        return this.tryGetRuleContext(0, EnumValueExpressionContext);
    }
    EMAIL_ATTACH() { return this.tryGetToken(MezDSLParser.EMAIL_ATTACH, 0); }
    emailNamedAttachment(i) {
        if (i === undefined) {
            return this.getRuleContexts(EmailNamedAttachmentContext);
        }
        else {
            return this.getRuleContext(i, EmailNamedAttachmentContext);
        }
    }
    EMAIL_CSV() { return this.tryGetToken(MezDSLParser.EMAIL_CSV, 0); }
    PAYMENT_STATUS_REQUEST() { return this.tryGetToken(MezDSLParser.PAYMENT_STATUS_REQUEST, 0); }
    CREATE_CRYPTO_KEY() { return this.tryGetToken(MezDSLParser.CREATE_CRYPTO_KEY, 0); }
    DOWNLOAD_REPORT() { return this.tryGetToken(MezDSLParser.DOWNLOAD_REPORT, 0); }
    DOWNLOAD_FILE() { return this.tryGetToken(MezDSLParser.DOWNLOAD_FILE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_systemBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterSystemBIFStatement) {
            listener.enterSystemBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSystemBIFStatement) {
            listener.exitSystemBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSystemBIFStatement) {
            return visitor.visitSystemBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SystemBIFStatementContext = SystemBIFStatementContext;
class EmailNamedAttachmentContext extends ParserRuleContext_1.ParserRuleContext {
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    functionCall() {
        return this.getRuleContext(0, FunctionCallContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_emailNamedAttachment; }
    // @Override
    enterRule(listener) {
        if (listener.enterEmailNamedAttachment) {
            listener.enterEmailNamedAttachment(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEmailNamedAttachment) {
            listener.exitEmailNamedAttachment(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEmailNamedAttachment) {
            return visitor.visitEmailNamedAttachment(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EmailNamedAttachmentContext = EmailNamedAttachmentContext;
class EmailAttachmentContext extends ParserRuleContext_1.ParserRuleContext {
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_emailAttachment; }
    // @Override
    enterRule(listener) {
        if (listener.enterEmailAttachment) {
            listener.enterEmailAttachment(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEmailAttachment) {
            listener.exitEmailAttachment(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEmailAttachment) {
            return visitor.visitEmailAttachment(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EmailAttachmentContext = EmailAttachmentContext;
class AssignStatementContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    ASSIGN() { return this.getToken(MezDSLParser.ASSIGN, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_assignStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterAssignStatement) {
            listener.enterAssignStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAssignStatement) {
            listener.exitAssignStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAssignStatement) {
            return visitor.visitAssignStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AssignStatementContext = AssignStatementContext;
class ExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    orExpression() {
        return this.getRuleContext(0, OrExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_expression; }
    // @Override
    enterRule(listener) {
        if (listener.enterExpression) {
            listener.enterExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitExpression) {
            listener.exitExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ExpressionContext = ExpressionContext;
class OrExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    andExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(AndExpressionContext);
        }
        else {
            return this.getRuleContext(i, AndExpressionContext);
        }
    }
    OR(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.OR);
        }
        else {
            return this.getToken(MezDSLParser.OR, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_orExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterOrExpression) {
            listener.enterOrExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitOrExpression) {
            listener.exitOrExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitOrExpression) {
            return visitor.visitOrExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.OrExpressionContext = OrExpressionContext;
class AndExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    equalityExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(EqualityExpressionContext);
        }
        else {
            return this.getRuleContext(i, EqualityExpressionContext);
        }
    }
    AND(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.AND);
        }
        else {
            return this.getToken(MezDSLParser.AND, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_andExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterAndExpression) {
            listener.enterAndExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAndExpression) {
            listener.exitAndExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAndExpression) {
            return visitor.visitAndExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AndExpressionContext = AndExpressionContext;
class EqualityExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    comparisonExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ComparisonExpressionContext);
        }
        else {
            return this.getRuleContext(i, ComparisonExpressionContext);
        }
    }
    equalityOperator(i) {
        if (i === undefined) {
            return this.getRuleContexts(EqualityOperatorContext);
        }
        else {
            return this.getRuleContext(i, EqualityOperatorContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_equalityExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterEqualityExpression) {
            listener.enterEqualityExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEqualityExpression) {
            listener.exitEqualityExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEqualityExpression) {
            return visitor.visitEqualityExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EqualityExpressionContext = EqualityExpressionContext;
class ComparisonExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    addExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(AddExpressionContext);
        }
        else {
            return this.getRuleContext(i, AddExpressionContext);
        }
    }
    comparisonOperator(i) {
        if (i === undefined) {
            return this.getRuleContexts(ComparisonOperatorContext);
        }
        else {
            return this.getRuleContext(i, ComparisonOperatorContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_comparisonExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterComparisonExpression) {
            listener.enterComparisonExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitComparisonExpression) {
            listener.exitComparisonExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComparisonExpression) {
            return visitor.visitComparisonExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComparisonExpressionContext = ComparisonExpressionContext;
class ComparisonOperatorContext extends ParserRuleContext_1.ParserRuleContext {
    LT() { return this.tryGetToken(MezDSLParser.LT, 0); }
    LTE() { return this.tryGetToken(MezDSLParser.LTE, 0); }
    GT() { return this.tryGetToken(MezDSLParser.GT, 0); }
    GTE() { return this.tryGetToken(MezDSLParser.GTE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_comparisonOperator; }
    // @Override
    enterRule(listener) {
        if (listener.enterComparisonOperator) {
            listener.enterComparisonOperator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitComparisonOperator) {
            listener.exitComparisonOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitComparisonOperator) {
            return visitor.visitComparisonOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ComparisonOperatorContext = ComparisonOperatorContext;
class EqualityOperatorContext extends ParserRuleContext_1.ParserRuleContext {
    EQU() { return this.tryGetToken(MezDSLParser.EQU, 0); }
    NEQU() { return this.tryGetToken(MezDSLParser.NEQU, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_equalityOperator; }
    // @Override
    enterRule(listener) {
        if (listener.enterEqualityOperator) {
            listener.enterEqualityOperator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEqualityOperator) {
            listener.exitEqualityOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEqualityOperator) {
            return visitor.visitEqualityOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EqualityOperatorContext = EqualityOperatorContext;
class AddExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    multExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(MultExpressionContext);
        }
        else {
            return this.getRuleContext(i, MultExpressionContext);
        }
    }
    addOperator(i) {
        if (i === undefined) {
            return this.getRuleContexts(AddOperatorContext);
        }
        else {
            return this.getRuleContext(i, AddOperatorContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_addExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterAddExpression) {
            listener.enterAddExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAddExpression) {
            listener.exitAddExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAddExpression) {
            return visitor.visitAddExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AddExpressionContext = AddExpressionContext;
class AddOperatorContext extends ParserRuleContext_1.ParserRuleContext {
    PLUS() { return this.tryGetToken(MezDSLParser.PLUS, 0); }
    MINUS() { return this.tryGetToken(MezDSLParser.MINUS, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_addOperator; }
    // @Override
    enterRule(listener) {
        if (listener.enterAddOperator) {
            listener.enterAddOperator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAddOperator) {
            listener.exitAddOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAddOperator) {
            return visitor.visitAddOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AddOperatorContext = AddOperatorContext;
class MultExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    simpleExpression(i) {
        if (i === undefined) {
            return this.getRuleContexts(SimpleExpressionContext);
        }
        else {
            return this.getRuleContext(i, SimpleExpressionContext);
        }
    }
    multOperator(i) {
        if (i === undefined) {
            return this.getRuleContexts(MultOperatorContext);
        }
        else {
            return this.getRuleContext(i, MultOperatorContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_multExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterMultExpression) {
            listener.enterMultExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMultExpression) {
            listener.exitMultExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMultExpression) {
            return visitor.visitMultExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MultExpressionContext = MultExpressionContext;
class MultOperatorContext extends ParserRuleContext_1.ParserRuleContext {
    MULT() { return this.tryGetToken(MezDSLParser.MULT, 0); }
    DIV() { return this.tryGetToken(MezDSLParser.DIV, 0); }
    MOD() { return this.tryGetToken(MezDSLParser.MOD, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_multOperator; }
    // @Override
    enterRule(listener) {
        if (listener.enterMultOperator) {
            listener.enterMultOperator(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMultOperator) {
            listener.exitMultOperator(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMultOperator) {
            return visitor.visitMultOperator(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MultOperatorContext = MultOperatorContext;
class SimpleExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    MINUS() { return this.tryGetToken(MezDSLParser.MINUS, 0); }
    atomicExpression() {
        return this.getRuleContext(0, AtomicExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_simpleExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterSimpleExpression) {
            listener.enterSimpleExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSimpleExpression) {
            listener.exitSimpleExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSimpleExpression) {
            return visitor.visitSimpleExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SimpleExpressionContext = SimpleExpressionContext;
class AtomicExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    literalExpression() {
        return this.tryGetRuleContext(0, LiteralExpressionContext);
    }
    enumValueExpression() {
        return this.tryGetRuleContext(0, EnumValueExpressionContext);
    }
    functionCall() {
        return this.tryGetRuleContext(0, FunctionCallContext);
    }
    accessExpression() {
        return this.tryGetRuleContext(0, AccessExpressionContext);
    }
    bifExpression() {
        return this.tryGetRuleContext(0, BifExpressionContext);
    }
    incrementExpression() {
        return this.tryGetRuleContext(0, IncrementExpressionContext);
    }
    decrementExpression() {
        return this.tryGetRuleContext(0, DecrementExpressionContext);
    }
    expression() {
        return this.tryGetRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_atomicExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterAtomicExpression) {
            listener.enterAtomicExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAtomicExpression) {
            listener.exitAtomicExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAtomicExpression) {
            return visitor.visitAtomicExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AtomicExpressionContext = AtomicExpressionContext;
class LiteralExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    INT_LITERAL() { return this.tryGetToken(MezDSLParser.INT_LITERAL, 0); }
    LONG_LITERAL() { return this.tryGetToken(MezDSLParser.LONG_LITERAL, 0); }
    DEC_LITERAL() { return this.tryGetToken(MezDSLParser.DEC_LITERAL, 0); }
    STR_LITERAL() { return this.tryGetToken(MezDSLParser.STR_LITERAL, 0); }
    STR_BLOCK() { return this.tryGetToken(MezDSLParser.STR_BLOCK, 0); }
    TRUE() { return this.tryGetToken(MezDSLParser.TRUE, 0); }
    FALSE() { return this.tryGetToken(MezDSLParser.FALSE, 0); }
    NULL() { return this.tryGetToken(MezDSLParser.NULL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_literalExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterLiteralExpression) {
            listener.enterLiteralExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitLiteralExpression) {
            listener.exitLiteralExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitLiteralExpression) {
            return visitor.visitLiteralExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.LiteralExpressionContext = LiteralExpressionContext;
class EnumValueExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ENUM_ID() { return this.getToken(MezDSLParser.ENUM_ID, 0); }
    enumValueExpressionEntry(i) {
        if (i === undefined) {
            return this.getRuleContexts(EnumValueExpressionEntryContext);
        }
        else {
            return this.getRuleContext(i, EnumValueExpressionEntryContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_enumValueExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnumValueExpression) {
            listener.enterEnumValueExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnumValueExpression) {
            listener.exitEnumValueExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnumValueExpression) {
            return visitor.visitEnumValueExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnumValueExpressionContext = EnumValueExpressionContext;
class EnumValueExpressionEntryContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_enumValueExpressionEntry; }
    // @Override
    enterRule(listener) {
        if (listener.enterEnumValueExpressionEntry) {
            listener.enterEnumValueExpressionEntry(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitEnumValueExpressionEntry) {
            listener.exitEnumValueExpressionEntry(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitEnumValueExpressionEntry) {
            return visitor.visitEnumValueExpressionEntry(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.EnumValueExpressionEntryContext = EnumValueExpressionEntryContext;
class FunctionCallContext extends ParserRuleContext_1.ParserRuleContext {
    specialFunctionName() {
        return this.tryGetRuleContext(0, SpecialFunctionNameContext);
    }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    ID(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.ID);
        }
        else {
            return this.getToken(MezDSLParser.ID, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_functionCall; }
    // @Override
    enterRule(listener) {
        if (listener.enterFunctionCall) {
            listener.enterFunctionCall(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitFunctionCall) {
            listener.exitFunctionCall(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitFunctionCall) {
            return visitor.visitFunctionCall(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.FunctionCallContext = FunctionCallContext;
class ValueExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ID(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.ID);
        }
        else {
            return this.getToken(MezDSLParser.ID, i);
        }
    }
    memberAccess(i) {
        if (i === undefined) {
            return this.getRuleContexts(MemberAccessContext);
        }
        else {
            return this.getRuleContext(i, MemberAccessContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_valueExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterValueExpression) {
            listener.enterValueExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitValueExpression) {
            listener.exitValueExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitValueExpression) {
            return visitor.visitValueExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ValueExpressionContext = ValueExpressionContext;
class MemberAccessContext extends ParserRuleContext_1.ParserRuleContext {
    memberFunction() {
        return this.tryGetRuleContext(0, MemberFunctionContext);
    }
    memberAttribute() {
        return this.tryGetRuleContext(0, MemberAttributeContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_memberAccess; }
    // @Override
    enterRule(listener) {
        if (listener.enterMemberAccess) {
            listener.enterMemberAccess(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMemberAccess) {
            listener.exitMemberAccess(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMemberAccess) {
            return visitor.visitMemberAccess(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MemberAccessContext = MemberAccessContext;
class MemberFunctionContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    parameter(i) {
        if (i === undefined) {
            return this.getRuleContexts(ParameterContext);
        }
        else {
            return this.getRuleContext(i, ParameterContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_memberFunction; }
    // @Override
    enterRule(listener) {
        if (listener.enterMemberFunction) {
            listener.enterMemberFunction(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMemberFunction) {
            listener.exitMemberFunction(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMemberFunction) {
            return visitor.visitMemberFunction(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MemberFunctionContext = MemberFunctionContext;
class MemberAttributeContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_memberAttribute; }
    // @Override
    enterRule(listener) {
        if (listener.enterMemberAttribute) {
            listener.enterMemberAttribute(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMemberAttribute) {
            listener.exitMemberAttribute(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMemberAttribute) {
            return visitor.visitMemberAttribute(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MemberAttributeContext = MemberAttributeContext;
class AccessExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ID(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.ID);
        }
        else {
            return this.getToken(MezDSLParser.ID, i);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_accessExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterAccessExpression) {
            listener.enterAccessExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitAccessExpression) {
            listener.exitAccessExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitAccessExpression) {
            return visitor.visitAccessExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.AccessExpressionContext = AccessExpressionContext;
class IncrementExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    INC() { return this.getToken(MezDSLParser.INC, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_incrementExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterIncrementExpression) {
            listener.enterIncrementExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIncrementExpression) {
            listener.exitIncrementExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIncrementExpression) {
            return visitor.visitIncrementExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IncrementExpressionContext = IncrementExpressionContext;
class DecrementExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.getToken(MezDSLParser.ID, 0); }
    DEC() { return this.getToken(MezDSLParser.DEC, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_decrementExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterDecrementExpression) {
            listener.enterDecrementExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDecrementExpression) {
            listener.exitDecrementExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDecrementExpression) {
            return visitor.visitDecrementExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DecrementExpressionContext = DecrementExpressionContext;
class BifExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    ID() { return this.tryGetToken(MezDSLParser.ID, 0); }
    persistenceBIFExpression() {
        return this.tryGetRuleContext(0, PersistenceBIFExpressionContext);
    }
    collectionsExpressionBIF() {
        return this.tryGetRuleContext(0, CollectionsExpressionBIFContext);
    }
    mathBIFExpression() {
        return this.tryGetRuleContext(0, MathBIFExpressionContext);
    }
    batchCreateExpressonBIF() {
        return this.tryGetRuleContext(0, BatchCreateExpressonBIFContext);
    }
    stringsBIFExpression() {
        return this.tryGetRuleContext(0, StringsBIFExpressionContext);
    }
    stringBIFExpression() {
        return this.tryGetRuleContext(0, StringBIFExpressionContext);
    }
    systemBIFExpression() {
        return this.tryGetRuleContext(0, SystemBIFExpressionContext);
    }
    dateBIFExpression() {
        return this.tryGetRuleContext(0, DateBIFExpressionContext);
    }
    integerBIFExpression() {
        return this.tryGetRuleContext(0, IntegerBIFExpressionContext);
    }
    longBIFExpression() {
        return this.tryGetRuleContext(0, LongBIFExpressionContext);
    }
    blobBIFExpression() {
        return this.tryGetRuleContext(0, BlobBIFExpressionContext);
    }
    decimalBIFExpression() {
        return this.tryGetRuleContext(0, DecimalBIFExpressionContext);
    }
    uuidBIFExpression() {
        return this.tryGetRuleContext(0, UuidBIFExpressionContext);
    }
    heliumBIFExpression() {
        return this.tryGetRuleContext(0, HeliumBIFExpressionContext);
    }
    instanceBIFExpression() {
        return this.tryGetRuleContext(0, InstanceBIFExpressionContext);
    }
    sqlBIFExpression() {
        return this.tryGetRuleContext(0, SqlBIFExpressionContext);
    }
    jsonExpressionBIF() {
        return this.tryGetRuleContext(0, JsonExpressionBIFContext);
    }
    apiBIFExpression() {
        return this.tryGetRuleContext(0, ApiBIFExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_bifExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterBifExpression) {
            listener.enterBifExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBifExpression) {
            listener.exitBifExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBifExpression) {
            return visitor.visitBifExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BifExpressionContext = BifExpressionContext;
class InstanceBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    OBJECT_PAY_RECIPIENT() { return this.tryGetToken(MezDSLParser.OBJECT_PAY_RECIPIENT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    OBJECT_PAY_RECIPIENT_WITH_REF() { return this.tryGetToken(MezDSLParser.OBJECT_PAY_RECIPIENT_WITH_REF, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_instanceBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterInstanceBIFExpression) {
            listener.enterInstanceBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitInstanceBIFExpression) {
            listener.exitInstanceBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitInstanceBIFExpression) {
            return visitor.visitInstanceBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.InstanceBIFExpressionContext = InstanceBIFExpressionContext;
class JsonBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    JSONPUT() { return this.tryGetToken(MezDSLParser.JSONPUT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    JSONREMOVE() { return this.tryGetToken(MezDSLParser.JSONREMOVE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_jsonBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterJsonBIFStatement) {
            listener.enterJsonBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitJsonBIFStatement) {
            listener.exitJsonBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitJsonBIFStatement) {
            return visitor.visitJsonBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.JsonBIFStatementContext = JsonBIFStatementContext;
class JsonExpressionBIFContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    JSONGET(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.JSONGET);
        }
        else {
            return this.getToken(MezDSLParser.JSONGET, i);
        }
    }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    JSONCONTAINS() { return this.tryGetToken(MezDSLParser.JSONCONTAINS, 0); }
    JSONKEYS() { return this.tryGetToken(MezDSLParser.JSONKEYS, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_jsonExpressionBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterJsonExpressionBIF) {
            listener.enterJsonExpressionBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitJsonExpressionBIF) {
            listener.exitJsonExpressionBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitJsonExpressionBIF) {
            return visitor.visitJsonExpressionBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.JsonExpressionBIFContext = JsonExpressionBIFContext;
class BatchCreateExpressonBIFContext extends ParserRuleContext_1.ParserRuleContext {
    CREATE_BATCH() { return this.getToken(MezDSLParser.CREATE_BATCH, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_batchCreateExpressonBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterBatchCreateExpressonBIF) {
            listener.enterBatchCreateExpressonBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBatchCreateExpressonBIF) {
            listener.exitBatchCreateExpressonBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBatchCreateExpressonBIF) {
            return visitor.visitBatchCreateExpressonBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BatchCreateExpressonBIFContext = BatchCreateExpressonBIFContext;
class CollectionsExpressionBIFContext extends ParserRuleContext_1.ParserRuleContext {
    accessExpression() {
        return this.getRuleContext(0, AccessExpressionContext);
    }
    POP() { return this.tryGetToken(MezDSLParser.POP, 0); }
    DROP() { return this.tryGetToken(MezDSLParser.DROP, 0); }
    LENGTH() { return this.tryGetToken(MezDSLParser.LENGTH, 0); }
    FIRST() { return this.tryGetToken(MezDSLParser.FIRST, 0); }
    LAST() { return this.tryGetToken(MezDSLParser.LAST, 0); }
    GET() { return this.tryGetToken(MezDSLParser.GET, 0); }
    expression() {
        return this.tryGetRuleContext(0, ExpressionContext);
    }
    COLLECTION_SELECT() { return this.tryGetToken(MezDSLParser.COLLECTION_SELECT, 0); }
    selectorBIF() {
        return this.tryGetRuleContext(0, SelectorBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_collectionsExpressionBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterCollectionsExpressionBIF) {
            listener.enterCollectionsExpressionBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitCollectionsExpressionBIF) {
            listener.exitCollectionsExpressionBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitCollectionsExpressionBIF) {
            return visitor.visitCollectionsExpressionBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.CollectionsExpressionBIFContext = CollectionsExpressionBIFContext;
class SystemBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    NOW() { return this.tryGetToken(MezDSLParser.NOW, 0); }
    TODAY() { return this.tryGetToken(MezDSLParser.TODAY, 0); }
    USER_ROLE() { return this.tryGetToken(MezDSLParser.USER_ROLE, 0); }
    SMS() { return this.tryGetToken(MezDSLParser.SMS, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    STR_LITERAL(i) {
        if (i === undefined) {
            return this.getTokens(MezDSLParser.STR_LITERAL);
        }
        else {
            return this.getToken(MezDSLParser.STR_LITERAL, i);
        }
    }
    SMS_SEND() { return this.tryGetToken(MezDSLParser.SMS_SEND, 0); }
    SMS_GET_CONVERSATION_ID() { return this.tryGetToken(MezDSLParser.SMS_GET_CONVERSATION_ID, 0); }
    ENCRYPT() { return this.tryGetToken(MezDSLParser.ENCRYPT, 0); }
    DECRYPT() { return this.tryGetToken(MezDSLParser.DECRYPT, 0); }
    GENERATE_REPORT() { return this.tryGetToken(MezDSLParser.GENERATE_REPORT, 0); }
    CBC_ENCRYPT() { return this.tryGetToken(MezDSLParser.CBC_ENCRYPT, 0); }
    CBC_DECRYPT() { return this.tryGetToken(MezDSLParser.CBC_DECRYPT, 0); }
    COLLECTION_CSV() { return this.tryGetToken(MezDSLParser.COLLECTION_CSV, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_systemBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterSystemBIFExpression) {
            listener.enterSystemBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSystemBIFExpression) {
            listener.exitSystemBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSystemBIFExpression) {
            return visitor.visitSystemBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SystemBIFExpressionContext = SystemBIFExpressionContext;
class ApiBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    API_GET() { return this.tryGetToken(MezDSLParser.API_GET, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    API_POST() { return this.tryGetToken(MezDSLParser.API_POST, 0); }
    API_PUT() { return this.tryGetToken(MezDSLParser.API_PUT, 0); }
    API_DELETE() { return this.tryGetToken(MezDSLParser.API_DELETE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_apiBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterApiBIFExpression) {
            listener.enterApiBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitApiBIFExpression) {
            listener.exitApiBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitApiBIFExpression) {
            return visitor.visitApiBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ApiBIFExpressionContext = ApiBIFExpressionContext;
class ApiBIFStatementContext extends ParserRuleContext_1.ParserRuleContext {
    API_SET_STATUS_CODE() { return this.getToken(MezDSLParser.API_SET_STATUS_CODE, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_apiBIFStatement; }
    // @Override
    enterRule(listener) {
        if (listener.enterApiBIFStatement) {
            listener.enterApiBIFStatement(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitApiBIFStatement) {
            listener.exitApiBIFStatement(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitApiBIFStatement) {
            return visitor.visitApiBIFStatement(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.ApiBIFStatementContext = ApiBIFStatementContext;
class MathBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    POW() { return this.tryGetToken(MezDSLParser.POW, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    SQRT() { return this.tryGetToken(MezDSLParser.SQRT, 0); }
    CEILING() { return this.tryGetToken(MezDSLParser.CEILING, 0); }
    FLOOR() { return this.tryGetToken(MezDSLParser.FLOOR, 0); }
    ROUND() { return this.tryGetToken(MezDSLParser.ROUND, 0); }
    RANDOM() { return this.tryGetToken(MezDSLParser.RANDOM, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_mathBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterMathBIFExpression) {
            listener.enterMathBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitMathBIFExpression) {
            listener.exitMathBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitMathBIFExpression) {
            return visitor.visitMathBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.MathBIFExpressionContext = MathBIFExpressionContext;
class StringsBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    stringsConcatBIF() {
        return this.tryGetRuleContext(0, StringsConcatBIFContext);
    }
    stringsLengthBIF() {
        return this.tryGetRuleContext(0, StringsLengthBIFContext);
    }
    stringsSplitBIF() {
        return this.tryGetRuleContext(0, StringsSplitBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringsBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringsBIFExpression) {
            listener.enterStringsBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringsBIFExpression) {
            listener.exitStringsBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringsBIFExpression) {
            return visitor.visitStringsBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringsBIFExpressionContext = StringsBIFExpressionContext;
class StringsConcatBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRINGS_CONCAT() { return this.getToken(MezDSLParser.STRINGS_CONCAT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringsConcatBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringsConcatBIF) {
            listener.enterStringsConcatBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringsConcatBIF) {
            listener.exitStringsConcatBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringsConcatBIF) {
            return visitor.visitStringsConcatBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringsConcatBIFContext = StringsConcatBIFContext;
class StringsLengthBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRINGS_LENGTH() { return this.getToken(MezDSLParser.STRINGS_LENGTH, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringsLengthBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringsLengthBIF) {
            listener.enterStringsLengthBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringsLengthBIF) {
            listener.exitStringsLengthBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringsLengthBIF) {
            return visitor.visitStringsLengthBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringsLengthBIFContext = StringsLengthBIFContext;
class StringsSplitBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRINGS_SPLIT() { return this.getToken(MezDSLParser.STRINGS_SPLIT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringsSplitBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringsSplitBIF) {
            listener.enterStringsSplitBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringsSplitBIF) {
            listener.exitStringsSplitBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringsSplitBIF) {
            return visitor.visitStringsSplitBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringsSplitBIFContext = StringsSplitBIFContext;
class StringBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    stringConcatBIF() {
        return this.tryGetRuleContext(0, StringConcatBIFContext);
    }
    stringEndsWithBIF() {
        return this.tryGetRuleContext(0, StringEndsWithBIFContext);
    }
    stringIndexOfBIF() {
        return this.tryGetRuleContext(0, StringIndexOfBIFContext);
    }
    stringJoinBIF() {
        return this.tryGetRuleContext(0, StringJoinBIFContext);
    }
    stringLengthBIF() {
        return this.tryGetRuleContext(0, StringLengthBIFContext);
    }
    stringLowerBIF() {
        return this.tryGetRuleContext(0, StringLowerBIFContext);
    }
    stringUpperBIF() {
        return this.tryGetRuleContext(0, StringUpperBIFContext);
    }
    stringSplitBIF() {
        return this.tryGetRuleContext(0, StringSplitBIFContext);
    }
    stringStartsWithBIF() {
        return this.tryGetRuleContext(0, StringStartsWithBIFContext);
    }
    stringSubstringBIF() {
        return this.tryGetRuleContext(0, StringSubstringBIFContext);
    }
    stringTranslateBIF() {
        return this.tryGetRuleContext(0, StringTranslateBIFContext);
    }
    stringRegexMatchBIF() {
        return this.tryGetRuleContext(0, StringRegexMatchBIFContext);
    }
    stringRegexReplaceFirstBIF() {
        return this.tryGetRuleContext(0, StringRegexReplaceFirstBIFContext);
    }
    stringRegexReplaceAllBIF() {
        return this.tryGetRuleContext(0, StringRegexReplaceAllBIFContext);
    }
    stringRegexFindBIF() {
        return this.tryGetRuleContext(0, StringRegexFindBIFContext);
    }
    stringReplaceAllBIF() {
        return this.tryGetRuleContext(0, StringReplaceAllBIFContext);
    }
    stringUrlEncodeBIF() {
        return this.tryGetRuleContext(0, StringUrlEncodeBIFContext);
    }
    stringUrlDecodeBIF() {
        return this.tryGetRuleContext(0, StringUrlDecodeBIFContext);
    }
    jsonFromCsvLineBIF() {
        return this.tryGetRuleContext(0, JsonFromCsvLineBIFContext);
    }
    jsonFromCsvBIF() {
        return this.tryGetRuleContext(0, JsonFromCsvBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringBIFExpression) {
            listener.enterStringBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringBIFExpression) {
            listener.exitStringBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringBIFExpression) {
            return visitor.visitStringBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringBIFExpressionContext = StringBIFExpressionContext;
class StringTranslateBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_TRANSLATE() { return this.getToken(MezDSLParser.STRING_TRANSLATE, 0); }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringTranslateBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringTranslateBIF) {
            listener.enterStringTranslateBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringTranslateBIF) {
            listener.exitStringTranslateBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringTranslateBIF) {
            return visitor.visitStringTranslateBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringTranslateBIFContext = StringTranslateBIFContext;
class StringConcatBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_CONCAT() { return this.getToken(MezDSLParser.STRING_CONCAT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringConcatBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringConcatBIF) {
            listener.enterStringConcatBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringConcatBIF) {
            listener.exitStringConcatBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringConcatBIF) {
            return visitor.visitStringConcatBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringConcatBIFContext = StringConcatBIFContext;
class StringEndsWithBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_ENDS_WITH() { return this.getToken(MezDSLParser.STRING_ENDS_WITH, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringEndsWithBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringEndsWithBIF) {
            listener.enterStringEndsWithBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringEndsWithBIF) {
            listener.exitStringEndsWithBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringEndsWithBIF) {
            return visitor.visitStringEndsWithBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringEndsWithBIFContext = StringEndsWithBIFContext;
class StringIndexOfBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_INDEX_OF() { return this.getToken(MezDSLParser.STRING_INDEX_OF, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringIndexOfBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringIndexOfBIF) {
            listener.enterStringIndexOfBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringIndexOfBIF) {
            listener.exitStringIndexOfBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringIndexOfBIF) {
            return visitor.visitStringIndexOfBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringIndexOfBIFContext = StringIndexOfBIFContext;
class StringJoinBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_JOIN() { return this.getToken(MezDSLParser.STRING_JOIN, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringJoinBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringJoinBIF) {
            listener.enterStringJoinBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringJoinBIF) {
            listener.exitStringJoinBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringJoinBIF) {
            return visitor.visitStringJoinBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringJoinBIFContext = StringJoinBIFContext;
class StringLengthBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_LENGTH() { return this.getToken(MezDSLParser.STRING_LENGTH, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringLengthBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringLengthBIF) {
            listener.enterStringLengthBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringLengthBIF) {
            listener.exitStringLengthBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringLengthBIF) {
            return visitor.visitStringLengthBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringLengthBIFContext = StringLengthBIFContext;
class StringLowerBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_LOWER() { return this.getToken(MezDSLParser.STRING_LOWER, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringLowerBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringLowerBIF) {
            listener.enterStringLowerBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringLowerBIF) {
            listener.exitStringLowerBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringLowerBIF) {
            return visitor.visitStringLowerBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringLowerBIFContext = StringLowerBIFContext;
class StringSplitBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_SPLIT() { return this.getToken(MezDSLParser.STRING_SPLIT, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringSplitBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringSplitBIF) {
            listener.enterStringSplitBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringSplitBIF) {
            listener.exitStringSplitBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringSplitBIF) {
            return visitor.visitStringSplitBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringSplitBIFContext = StringSplitBIFContext;
class StringStartsWithBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_STARTS_WITH() { return this.getToken(MezDSLParser.STRING_STARTS_WITH, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringStartsWithBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringStartsWithBIF) {
            listener.enterStringStartsWithBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringStartsWithBIF) {
            listener.exitStringStartsWithBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringStartsWithBIF) {
            return visitor.visitStringStartsWithBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringStartsWithBIFContext = StringStartsWithBIFContext;
class StringSubstringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_SUBSTRING() { return this.getToken(MezDSLParser.STRING_SUBSTRING, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringSubstringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringSubstringBIF) {
            listener.enterStringSubstringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringSubstringBIF) {
            listener.exitStringSubstringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringSubstringBIF) {
            return visitor.visitStringSubstringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringSubstringBIFContext = StringSubstringBIFContext;
class StringUpperBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_UPPER() { return this.getToken(MezDSLParser.STRING_UPPER, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringUpperBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringUpperBIF) {
            listener.enterStringUpperBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringUpperBIF) {
            listener.exitStringUpperBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringUpperBIF) {
            return visitor.visitStringUpperBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringUpperBIFContext = StringUpperBIFContext;
class StringRegexMatchBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_REGEX_MATCH() { return this.getToken(MezDSLParser.STRING_REGEX_MATCH, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringRegexMatchBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringRegexMatchBIF) {
            listener.enterStringRegexMatchBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringRegexMatchBIF) {
            listener.exitStringRegexMatchBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringRegexMatchBIF) {
            return visitor.visitStringRegexMatchBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringRegexMatchBIFContext = StringRegexMatchBIFContext;
class StringRegexReplaceFirstBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_REGEX_REPLACE_FIRST() { return this.getToken(MezDSLParser.STRING_REGEX_REPLACE_FIRST, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringRegexReplaceFirstBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringRegexReplaceFirstBIF) {
            listener.enterStringRegexReplaceFirstBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringRegexReplaceFirstBIF) {
            listener.exitStringRegexReplaceFirstBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringRegexReplaceFirstBIF) {
            return visitor.visitStringRegexReplaceFirstBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringRegexReplaceFirstBIFContext = StringRegexReplaceFirstBIFContext;
class StringRegexReplaceAllBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_REGEX_REPLACE_ALL() { return this.getToken(MezDSLParser.STRING_REGEX_REPLACE_ALL, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringRegexReplaceAllBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringRegexReplaceAllBIF) {
            listener.enterStringRegexReplaceAllBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringRegexReplaceAllBIF) {
            listener.exitStringRegexReplaceAllBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringRegexReplaceAllBIF) {
            return visitor.visitStringRegexReplaceAllBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringRegexReplaceAllBIFContext = StringRegexReplaceAllBIFContext;
class StringRegexFindBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_REGEX_FIND() { return this.getToken(MezDSLParser.STRING_REGEX_FIND, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringRegexFindBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringRegexFindBIF) {
            listener.enterStringRegexFindBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringRegexFindBIF) {
            listener.exitStringRegexFindBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringRegexFindBIF) {
            return visitor.visitStringRegexFindBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringRegexFindBIFContext = StringRegexFindBIFContext;
class StringReplaceAllBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_REPLACE_ALL() { return this.getToken(MezDSLParser.STRING_REPLACE_ALL, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringReplaceAllBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringReplaceAllBIF) {
            listener.enterStringReplaceAllBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringReplaceAllBIF) {
            listener.exitStringReplaceAllBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringReplaceAllBIF) {
            return visitor.visitStringReplaceAllBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringReplaceAllBIFContext = StringReplaceAllBIFContext;
class StringUrlEncodeBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_URL_ENCODE() { return this.getToken(MezDSLParser.STRING_URL_ENCODE, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringUrlEncodeBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringUrlEncodeBIF) {
            listener.enterStringUrlEncodeBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringUrlEncodeBIF) {
            listener.exitStringUrlEncodeBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringUrlEncodeBIF) {
            return visitor.visitStringUrlEncodeBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringUrlEncodeBIFContext = StringUrlEncodeBIFContext;
class StringUrlDecodeBIFContext extends ParserRuleContext_1.ParserRuleContext {
    STRING_URL_DECODE() { return this.getToken(MezDSLParser.STRING_URL_DECODE, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_stringUrlDecodeBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterStringUrlDecodeBIF) {
            listener.enterStringUrlDecodeBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitStringUrlDecodeBIF) {
            listener.exitStringUrlDecodeBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitStringUrlDecodeBIF) {
            return visitor.visitStringUrlDecodeBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.StringUrlDecodeBIFContext = StringUrlDecodeBIFContext;
class JsonFromCsvLineBIFContext extends ParserRuleContext_1.ParserRuleContext {
    JSON_FROM_CSV_LINE() { return this.getToken(MezDSLParser.JSON_FROM_CSV_LINE, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_jsonFromCsvLineBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterJsonFromCsvLineBIF) {
            listener.enterJsonFromCsvLineBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitJsonFromCsvLineBIF) {
            listener.exitJsonFromCsvLineBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitJsonFromCsvLineBIF) {
            return visitor.visitJsonFromCsvLineBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.JsonFromCsvLineBIFContext = JsonFromCsvLineBIFContext;
class JsonFromCsvBIFContext extends ParserRuleContext_1.ParserRuleContext {
    JSON_FROM_CSV() { return this.getToken(MezDSLParser.JSON_FROM_CSV, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_jsonFromCsvBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterJsonFromCsvBIF) {
            listener.enterJsonFromCsvBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitJsonFromCsvBIF) {
            listener.exitJsonFromCsvBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitJsonFromCsvBIF) {
            return visitor.visitJsonFromCsvBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.JsonFromCsvBIFContext = JsonFromCsvBIFContext;
class DateBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    dateAddDaysBIF() {
        return this.tryGetRuleContext(0, DateAddDaysBIFContext);
    }
    dateAddMonthsBIF() {
        return this.tryGetRuleContext(0, DateAddMonthsBIFContext);
    }
    dateAddSecondsBIF() {
        return this.tryGetRuleContext(0, DateAddSecondsBIFContext);
    }
    dateDaysBetweenBIF() {
        return this.tryGetRuleContext(0, DateDaysBetweenBIFContext);
    }
    dateExtractBIF() {
        return this.tryGetRuleContext(0, DateExtractBIFContext);
    }
    dateMonthsBetweenBIF() {
        return this.tryGetRuleContext(0, DateMonthsBetweenBIFContext);
    }
    dateSecondsBetweenBIF() {
        return this.tryGetRuleContext(0, DateSecondsBetweenBIFContext);
    }
    dateNowBIF() {
        return this.tryGetRuleContext(0, DateNowBIFContext);
    }
    dateTodayBIF() {
        return this.tryGetRuleContext(0, DateTodayBIFContext);
    }
    dateFromStringBIF() {
        return this.tryGetRuleContext(0, DateFromStringBIFContext);
    }
    dateTimeFromStringBIF() {
        return this.tryGetRuleContext(0, DateTimeFromStringBIFContext);
    }
    dateFromISOStringBIF() {
        return this.tryGetRuleContext(0, DateFromISOStringBIFContext);
    }
    dateTimeFromISOStringBIF() {
        return this.tryGetRuleContext(0, DateTimeFromISOStringBIFContext);
    }
    dateTimeFromLongBIF() {
        return this.tryGetRuleContext(0, DateTimeFromLongBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateBIFExpression) {
            listener.enterDateBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateBIFExpression) {
            listener.exitDateBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateBIFExpression) {
            return visitor.visitDateBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateBIFExpressionContext = DateBIFExpressionContext;
class DateAddDaysBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_ADD_DAYS() { return this.getToken(MezDSLParser.DATE_ADD_DAYS, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateAddDaysBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateAddDaysBIF) {
            listener.enterDateAddDaysBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateAddDaysBIF) {
            listener.exitDateAddDaysBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateAddDaysBIF) {
            return visitor.visitDateAddDaysBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateAddDaysBIFContext = DateAddDaysBIFContext;
class DateAddMonthsBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_ADD_MONTHS() { return this.getToken(MezDSLParser.DATE_ADD_MONTHS, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateAddMonthsBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateAddMonthsBIF) {
            listener.enterDateAddMonthsBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateAddMonthsBIF) {
            listener.exitDateAddMonthsBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateAddMonthsBIF) {
            return visitor.visitDateAddMonthsBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateAddMonthsBIFContext = DateAddMonthsBIFContext;
class DateAddSecondsBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_ADD_SECONDS() { return this.getToken(MezDSLParser.DATE_ADD_SECONDS, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateAddSecondsBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateAddSecondsBIF) {
            listener.enterDateAddSecondsBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateAddSecondsBIF) {
            listener.exitDateAddSecondsBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateAddSecondsBIF) {
            return visitor.visitDateAddSecondsBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateAddSecondsBIFContext = DateAddSecondsBIFContext;
class DateDaysBetweenBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_DAYS_BETWEEN() { return this.getToken(MezDSLParser.DATE_DAYS_BETWEEN, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateDaysBetweenBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateDaysBetweenBIF) {
            listener.enterDateDaysBetweenBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateDaysBetweenBIF) {
            listener.exitDateDaysBetweenBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateDaysBetweenBIF) {
            return visitor.visitDateDaysBetweenBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateDaysBetweenBIFContext = DateDaysBetweenBIFContext;
class DateExtractBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_EXTRACT() { return this.getToken(MezDSLParser.DATE_EXTRACT, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    STR_LITERAL() { return this.getToken(MezDSLParser.STR_LITERAL, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateExtractBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateExtractBIF) {
            listener.enterDateExtractBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateExtractBIF) {
            listener.exitDateExtractBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateExtractBIF) {
            return visitor.visitDateExtractBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateExtractBIFContext = DateExtractBIFContext;
class DateMonthsBetweenBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_MONTHS_BETWEEN() { return this.getToken(MezDSLParser.DATE_MONTHS_BETWEEN, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateMonthsBetweenBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateMonthsBetweenBIF) {
            listener.enterDateMonthsBetweenBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateMonthsBetweenBIF) {
            listener.exitDateMonthsBetweenBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateMonthsBetweenBIF) {
            return visitor.visitDateMonthsBetweenBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateMonthsBetweenBIFContext = DateMonthsBetweenBIFContext;
class DateSecondsBetweenBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_SECONDS_BETWEEN() { return this.getToken(MezDSLParser.DATE_SECONDS_BETWEEN, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateSecondsBetweenBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateSecondsBetweenBIF) {
            listener.enterDateSecondsBetweenBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateSecondsBetweenBIF) {
            listener.exitDateSecondsBetweenBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateSecondsBetweenBIF) {
            return visitor.visitDateSecondsBetweenBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateSecondsBetweenBIFContext = DateSecondsBetweenBIFContext;
class DateNowBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_NOW() { return this.getToken(MezDSLParser.DATE_NOW, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateNowBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateNowBIF) {
            listener.enterDateNowBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateNowBIF) {
            listener.exitDateNowBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateNowBIF) {
            return visitor.visitDateNowBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateNowBIFContext = DateNowBIFContext;
class DateTodayBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_TODAY() { return this.getToken(MezDSLParser.DATE_TODAY, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateTodayBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateTodayBIF) {
            listener.enterDateTodayBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateTodayBIF) {
            listener.exitDateTodayBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateTodayBIF) {
            return visitor.visitDateTodayBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateTodayBIFContext = DateTodayBIFContext;
class DateFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_FROM_STRING() { return this.getToken(MezDSLParser.DATE_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateFromStringBIF) {
            listener.enterDateFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateFromStringBIF) {
            listener.exitDateFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateFromStringBIF) {
            return visitor.visitDateFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateFromStringBIFContext = DateFromStringBIFContext;
class DateTimeFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_TIME_FROM_STRING() { return this.getToken(MezDSLParser.DATE_TIME_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateTimeFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateTimeFromStringBIF) {
            listener.enterDateTimeFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateTimeFromStringBIF) {
            listener.exitDateTimeFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateTimeFromStringBIF) {
            return visitor.visitDateTimeFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateTimeFromStringBIFContext = DateTimeFromStringBIFContext;
class DateFromISOStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_FROM_ISO_STRING() { return this.getToken(MezDSLParser.DATE_FROM_ISO_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateFromISOStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateFromISOStringBIF) {
            listener.enterDateFromISOStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateFromISOStringBIF) {
            listener.exitDateFromISOStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateFromISOStringBIF) {
            return visitor.visitDateFromISOStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateFromISOStringBIFContext = DateFromISOStringBIFContext;
class DateTimeFromISOStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_TIME_FROM_ISO_STRING() { return this.getToken(MezDSLParser.DATE_TIME_FROM_ISO_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateTimeFromISOStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateTimeFromISOStringBIF) {
            listener.enterDateTimeFromISOStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateTimeFromISOStringBIF) {
            listener.exitDateTimeFromISOStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateTimeFromISOStringBIF) {
            return visitor.visitDateTimeFromISOStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateTimeFromISOStringBIFContext = DateTimeFromISOStringBIFContext;
class DateTimeFromLongBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DATE_TIME_FROM_LONG() { return this.getToken(MezDSLParser.DATE_TIME_FROM_LONG, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_dateTimeFromLongBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDateTimeFromLongBIF) {
            listener.enterDateTimeFromLongBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDateTimeFromLongBIF) {
            listener.exitDateTimeFromLongBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDateTimeFromLongBIF) {
            return visitor.visitDateTimeFromLongBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DateTimeFromLongBIFContext = DateTimeFromLongBIFContext;
class IntegerBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    integerFromStringBIF() {
        return this.getRuleContext(0, IntegerFromStringBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_integerBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterIntegerBIFExpression) {
            listener.enterIntegerBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIntegerBIFExpression) {
            listener.exitIntegerBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIntegerBIFExpression) {
            return visitor.visitIntegerBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IntegerBIFExpressionContext = IntegerBIFExpressionContext;
class IntegerFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    INTEGER_FROM_STRING() { return this.getToken(MezDSLParser.INTEGER_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_integerFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterIntegerFromStringBIF) {
            listener.enterIntegerFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitIntegerFromStringBIF) {
            listener.exitIntegerFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitIntegerFromStringBIF) {
            return visitor.visitIntegerFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.IntegerFromStringBIFContext = IntegerFromStringBIFContext;
class DecimalBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    decimalFromStringBIF() {
        return this.getRuleContext(0, DecimalFromStringBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_decimalBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterDecimalBIFExpression) {
            listener.enterDecimalBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDecimalBIFExpression) {
            listener.exitDecimalBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDecimalBIFExpression) {
            return visitor.visitDecimalBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DecimalBIFExpressionContext = DecimalBIFExpressionContext;
class DecimalFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    DECIMAL_FROM_STRING() { return this.getToken(MezDSLParser.DECIMAL_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_decimalFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterDecimalFromStringBIF) {
            listener.enterDecimalFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitDecimalFromStringBIF) {
            listener.exitDecimalFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitDecimalFromStringBIF) {
            return visitor.visitDecimalFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.DecimalFromStringBIFContext = DecimalFromStringBIFContext;
class LongBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    longFromStringBIF() {
        return this.getRuleContext(0, LongFromStringBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_longBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterLongBIFExpression) {
            listener.enterLongBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitLongBIFExpression) {
            listener.exitLongBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitLongBIFExpression) {
            return visitor.visitLongBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.LongBIFExpressionContext = LongBIFExpressionContext;
class LongFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    LONG_FROM_STRING() { return this.getToken(MezDSLParser.LONG_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_longFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterLongFromStringBIF) {
            listener.enterLongFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitLongFromStringBIF) {
            listener.exitLongFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitLongFromStringBIF) {
            return visitor.visitLongFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.LongFromStringBIFContext = LongFromStringBIFContext;
class UuidBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    uuidFromStringBIF() {
        return this.getRuleContext(0, UuidFromStringBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_uuidBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterUuidBIFExpression) {
            listener.enterUuidBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitUuidBIFExpression) {
            listener.exitUuidBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUuidBIFExpression) {
            return visitor.visitUuidBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UuidBIFExpressionContext = UuidBIFExpressionContext;
class UuidFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    UUID_FROM_STRING() { return this.getToken(MezDSLParser.UUID_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_uuidFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterUuidFromStringBIF) {
            listener.enterUuidFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitUuidFromStringBIF) {
            listener.exitUuidFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitUuidFromStringBIF) {
            return visitor.visitUuidFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.UuidFromStringBIFContext = UuidFromStringBIFContext;
class BlobBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    blobFromStringBIF() {
        return this.tryGetRuleContext(0, BlobFromStringBIFContext);
    }
    blobWrapperFromStringBIF() {
        return this.tryGetRuleContext(0, BlobWrapperFromStringBIFContext);
    }
    blobToStringBIF() {
        return this.tryGetRuleContext(0, BlobToStringBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_blobBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterBlobBIFExpression) {
            listener.enterBlobBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBlobBIFExpression) {
            listener.exitBlobBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBlobBIFExpression) {
            return visitor.visitBlobBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BlobBIFExpressionContext = BlobBIFExpressionContext;
class BlobFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    BLOB_FROM_STRING() { return this.getToken(MezDSLParser.BLOB_FROM_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_blobFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterBlobFromStringBIF) {
            listener.enterBlobFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBlobFromStringBIF) {
            listener.exitBlobFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBlobFromStringBIF) {
            return visitor.visitBlobFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BlobFromStringBIFContext = BlobFromStringBIFContext;
class BlobWrapperFromStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    BLOB_WRAPPER_FROM_STRING() { return this.getToken(MezDSLParser.BLOB_WRAPPER_FROM_STRING, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_blobWrapperFromStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterBlobWrapperFromStringBIF) {
            listener.enterBlobWrapperFromStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBlobWrapperFromStringBIF) {
            listener.exitBlobWrapperFromStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBlobWrapperFromStringBIF) {
            return visitor.visitBlobWrapperFromStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BlobWrapperFromStringBIFContext = BlobWrapperFromStringBIFContext;
class BlobToStringBIFContext extends ParserRuleContext_1.ParserRuleContext {
    BLOB_TO_STRING() { return this.getToken(MezDSLParser.BLOB_TO_STRING, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_blobToStringBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterBlobToStringBIF) {
            listener.enterBlobToStringBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitBlobToStringBIF) {
            listener.exitBlobToStringBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitBlobToStringBIF) {
            return visitor.visitBlobToStringBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.BlobToStringBIFContext = BlobToStringBIFContext;
class HeliumBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    heliumGetPlatformBIF() {
        return this.getRuleContext(0, HeliumGetPlatformBIFContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_heliumBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterHeliumBIFExpression) {
            listener.enterHeliumBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitHeliumBIFExpression) {
            listener.exitHeliumBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitHeliumBIFExpression) {
            return visitor.visitHeliumBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.HeliumBIFExpressionContext = HeliumBIFExpressionContext;
class HeliumGetPlatformBIFContext extends ParserRuleContext_1.ParserRuleContext {
    HELIUM_GET_PLATFORM() { return this.getToken(MezDSLParser.HELIUM_GET_PLATFORM, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_heliumGetPlatformBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterHeliumGetPlatformBIF) {
            listener.enterHeliumGetPlatformBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitHeliumGetPlatformBIF) {
            listener.exitHeliumGetPlatformBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitHeliumGetPlatformBIF) {
            return visitor.visitHeliumGetPlatformBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.HeliumGetPlatformBIFContext = HeliumGetPlatformBIFContext;
class SqlBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    SQL_EXECUTE() { return this.tryGetToken(MezDSLParser.SQL_EXECUTE, 0); }
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    sqlBIFParam(i) {
        if (i === undefined) {
            return this.getRuleContexts(SqlBIFParamContext);
        }
        else {
            return this.getRuleContext(i, SqlBIFParamContext);
        }
    }
    SQL_QUERY() { return this.tryGetToken(MezDSLParser.SQL_QUERY, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_sqlBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterSqlBIFExpression) {
            listener.enterSqlBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSqlBIFExpression) {
            listener.exitSqlBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSqlBIFExpression) {
            return visitor.visitSqlBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SqlBIFExpressionContext = SqlBIFExpressionContext;
class SqlBIFParamContext extends ParserRuleContext_1.ParserRuleContext {
    expression() {
        return this.getRuleContext(0, ExpressionContext);
    }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_sqlBIFParam; }
    // @Override
    enterRule(listener) {
        if (listener.enterSqlBIFParam) {
            listener.enterSqlBIFParam(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSqlBIFParam) {
            listener.exitSqlBIFParam(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSqlBIFParam) {
            return visitor.visitSqlBIFParam(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SqlBIFParamContext = SqlBIFParamContext;
class PersistenceBIFExpressionContext extends ParserRuleContext_1.ParserRuleContext {
    selectorBIF() {
        return this.tryGetRuleContext(0, SelectorBIFContext);
    }
    NEW() { return this.tryGetToken(MezDSLParser.NEW, 0); }
    READ() { return this.tryGetToken(MezDSLParser.READ, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    FROM_CSV() { return this.tryGetToken(MezDSLParser.FROM_CSV, 0); }
    FROM_CSV_LINE() { return this.tryGetToken(MezDSLParser.FROM_CSV_LINE, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_persistenceBIFExpression; }
    // @Override
    enterRule(listener) {
        if (listener.enterPersistenceBIFExpression) {
            listener.enterPersistenceBIFExpression(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPersistenceBIFExpression) {
            listener.exitPersistenceBIFExpression(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPersistenceBIFExpression) {
            return visitor.visitPersistenceBIFExpression(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PersistenceBIFExpressionContext = PersistenceBIFExpressionContext;
class SimpleSelectorBIFContext extends ParserRuleContext_1.ParserRuleContext {
    ALL() { return this.tryGetToken(MezDSLParser.ALL, 0); }
    USERSELECTOR() { return this.tryGetToken(MezDSLParser.USERSELECTOR, 0); }
    LESSTHAN() { return this.tryGetToken(MezDSLParser.LESSTHAN, 0); }
    ID() { return this.tryGetToken(MezDSLParser.ID, 0); }
    expression(i) {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }
        else {
            return this.getRuleContext(i, ExpressionContext);
        }
    }
    LESSOREQUAL() { return this.tryGetToken(MezDSLParser.LESSOREQUAL, 0); }
    GREATERTHAN() { return this.tryGetToken(MezDSLParser.GREATERTHAN, 0); }
    GREATEROREQAUL() { return this.tryGetToken(MezDSLParser.GREATEROREQAUL, 0); }
    EQUALS() { return this.tryGetToken(MezDSLParser.EQUALS, 0); }
    EMPTY() { return this.tryGetToken(MezDSLParser.EMPTY, 0); }
    BETWEEN() { return this.tryGetToken(MezDSLParser.BETWEEN, 0); }
    CONTAINS() { return this.tryGetToken(MezDSLParser.CONTAINS, 0); }
    BEGINSWITH() { return this.tryGetToken(MezDSLParser.BEGINSWITH, 0); }
    ENDSWITH() { return this.tryGetToken(MezDSLParser.ENDSWITH, 0); }
    ATTIN() { return this.tryGetToken(MezDSLParser.ATTIN, 0); }
    RELIN() { return this.tryGetToken(MezDSLParser.RELIN, 0); }
    NOTLTE() { return this.tryGetToken(MezDSLParser.NOTLTE, 0); }
    NOTGTE() { return this.tryGetToken(MezDSLParser.NOTGTE, 0); }
    NOTEQU() { return this.tryGetToken(MezDSLParser.NOTEQU, 0); }
    NOTEMPTY() { return this.tryGetToken(MezDSLParser.NOTEMPTY, 0); }
    NOTBETWEEN() { return this.tryGetToken(MezDSLParser.NOTBETWEEN, 0); }
    NOTCONTAINS() { return this.tryGetToken(MezDSLParser.NOTCONTAINS, 0); }
    NOTBEGINSWITH() { return this.tryGetToken(MezDSLParser.NOTBEGINSWITH, 0); }
    NOTENDSWITH() { return this.tryGetToken(MezDSLParser.NOTENDSWITH, 0); }
    NOTATTIN() { return this.tryGetToken(MezDSLParser.NOTATTIN, 0); }
    NOTRELIN() { return this.tryGetToken(MezDSLParser.NOTRELIN, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_simpleSelectorBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterSimpleSelectorBIF) {
            listener.enterSimpleSelectorBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSimpleSelectorBIF) {
            listener.exitSimpleSelectorBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSimpleSelectorBIF) {
            return visitor.visitSimpleSelectorBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SimpleSelectorBIFContext = SimpleSelectorBIFContext;
class SelectorBIFContext extends ParserRuleContext_1.ParserRuleContext {
    simpleSelectorBIF(i) {
        if (i === undefined) {
            return this.getRuleContexts(SimpleSelectorBIFContext);
        }
        else {
            return this.getRuleContext(i, SimpleSelectorBIFContext);
        }
    }
    ANDSELECTOR() { return this.tryGetToken(MezDSLParser.ANDSELECTOR, 0); }
    UNION() { return this.tryGetToken(MezDSLParser.UNION, 0); }
    selectorBIF(i) {
        if (i === undefined) {
            return this.getRuleContexts(SelectorBIFContext);
        }
        else {
            return this.getRuleContext(i, SelectorBIFContext);
        }
    }
    DIFF() { return this.tryGetToken(MezDSLParser.DIFF, 0); }
    INTERSECT() { return this.tryGetToken(MezDSLParser.INTERSECT, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_selectorBIF; }
    // @Override
    enterRule(listener) {
        if (listener.enterSelectorBIF) {
            listener.enterSelectorBIF(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitSelectorBIF) {
            listener.exitSelectorBIF(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitSelectorBIF) {
            return visitor.visitSelectorBIF(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.SelectorBIFContext = SelectorBIFContext;
class PrimitiveTypeContext extends ParserRuleContext_1.ParserRuleContext {
    INT() { return this.tryGetToken(MezDSLParser.INT, 0); }
    DECIMAL() { return this.tryGetToken(MezDSLParser.DECIMAL, 0); }
    LONG() { return this.tryGetToken(MezDSLParser.LONG, 0); }
    UUID() { return this.tryGetToken(MezDSLParser.UUID, 0); }
    BOOL() { return this.tryGetToken(MezDSLParser.BOOL, 0); }
    BLOB() { return this.tryGetToken(MezDSLParser.BLOB, 0); }
    STRING() { return this.tryGetToken(MezDSLParser.STRING, 0); }
    VOID() { return this.tryGetToken(MezDSLParser.VOID, 0); }
    DATE() { return this.tryGetToken(MezDSLParser.DATE, 0); }
    DATETIME() { return this.tryGetToken(MezDSLParser.DATETIME, 0); }
    JSON() { return this.tryGetToken(MezDSLParser.JSON, 0); }
    JSONARRAY() { return this.tryGetToken(MezDSLParser.JSONARRAY, 0); }
    constructor(parent, invokingState) {
        super(parent, invokingState);
    }
    // @Override
    get ruleIndex() { return MezDSLParser.RULE_primitiveType; }
    // @Override
    enterRule(listener) {
        if (listener.enterPrimitiveType) {
            listener.enterPrimitiveType(this);
        }
    }
    // @Override
    exitRule(listener) {
        if (listener.exitPrimitiveType) {
            listener.exitPrimitiveType(this);
        }
    }
    // @Override
    accept(visitor) {
        if (visitor.visitPrimitiveType) {
            return visitor.visitPrimitiveType(this);
        }
        else {
            return visitor.visitChildren(this);
        }
    }
}
exports.PrimitiveTypeContext = PrimitiveTypeContext;
