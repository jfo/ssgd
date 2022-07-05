const ZIG_KEYWORDS = [
  "align",
  "allowzero",
  "and",
  "asm",
  "async",
  "await",
  "break",
  "callconv",
  "catch",
  "comptime",
  "const",
  "continue",
  "defer",
  "else",
  "enum",
  "errdefer",
  "error",
  "export",
  "extern",
  "false",
  "fn",
  "for",
  "if",
  "inline",
  "linksection",
  "noalias",
  "noasync",
  "noinline",
  "null",
  "or",
  "orelse",
  "packed",
  "pub",
  "resume",
  "return",
  "struct",
  "suspend",
  "switch",
  "test",
  "threadlocal",
  "true",
  "try",
  "undefined",
  "union",
  "unreachable",
  "usingnamespace",
  "var",
  "volatile",
  "while",
].join(" ");

const ZIG_BUILTIN_FUNC = [
  "ArgType",
  "Frame",
  "IntType",
  "OpaqueType",
  "TagType",
  "This",
  "Type",
  "TypeOf",
  "Vector",
  "addWithOverflow",
  "alignCast",
  "alignOf",
  "as",
  "asyncCall",
  "atomicLoad",
  "atomicRmw",
  "atomicStore",
  "bitCast",
  "bitOffsetOf",
  "bitReverse",
  "bitSizeOf",
  "boolToInt",
  "breakpoint",
  "byteOffsetOf",
  "byteSwap",
  "bytesToSlice",
  "cDefine",
  "cImport",
  "cInclude",
  "cUndef",
  "call",
  "canImplicitCast",
  "ceil",
  "clz",
  "cmpxchgStrong",
  "cmpxchgWeak",
  "compileError",
  "compileLog",
  "cos",
  "ctz",
  "divExact",
  "divFloor",
  "divTrunc",
  "embedFile",
  "enumToInt",
  "errSetCast",
  "errorName",
  "errorReturnTrace",
  "errorToInt",
  "exp",
  "exp2",
  "export",
  "fabs",
  "fence",
  "field",
  "fieldParentPtr",
  "floatCast",
  "floatToInt",
  "floor",
  "frame",
  "frameAddress",
  "frameSize",
  "hasDecl",
  "hasField",
  "import",
  "intCast",
  "intToEnum",
  "intToError",
  "intToFloat",
  "intToPtr",
  "log",
  "log10",
  "log2",
  "memberCount",
  "memberName",
  "memberType",
  "memcpy",
  "memset",
  "mod",
  "mulWithOverflow",
  "newStackCall",
  "panic",
  "popCount",
  "ptrCast",
  "ptrToInt",
  "rem",
  "returnAddress",
  "round",
  "setAlignStack",
  "setCold",
  "setEvalBranchQuota",
  "setFloatMode",
  "setGlobalLinkage",
  "setGlobalSection",
  "setRuntimeSafety",
  "shlExact",
  "shlWithOverflow",
  "shrExact",
  "shuffle",
  "sin",
  "sizeOf",
  "sliceToBytes",
  "splat",
  "sqrt",
  "subWithOverflow",
  "tagName",
  "trunc",
  "truncate",
  "typeId",
  "typeInfo",
  "typeName",
  "unionInit",
]
  .map((e) => "@" + e)
  .join(" ");

const ZIG_BUILTINS = [
  "anyerror",
  "anyframe",
  "bool",
  "c_int",
  "c_long",
  "c_longdouble",
  "c_longlong",
  "c_short",
  "c_uint",
  "c_ulong",
  "c_ulonglong",
  "c_ushort",
  "c_void",
  "comptime_float",
  "comptime_int",
  "f128",
  "f16",
  "f32",
  "f64",
  "isize",
  "noreturn",
  "type",
  "usize",
  "void",
].join(" ");

export default function (hljs) {
  return {
    name: "Zig",
    aliases: ["zig", "ziglang"],
    keywords: {
      keyword: ZIG_KEYWORDS,
      literal: "true false null undefined",
      built_in: ZIG_BUILTINS,
    },
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      {
        className: "string",
        variants: [hljs.QUOTE_STRING_MODE],
      },
      {
        className: "number",
        variants: [hljs.C_NUMBER_MODE],
      },
      {
        className: "type",
        begin: /(i|u)(\d{3}|\d{2}|\d{1})/,
      },
      {
        className: "meta",
        begin: /@\s*[a-zA-Z]+\b/,
        keywords: { "meta-keyword": ZIG_BUILTIN_FUNC },
        contains: [hljs.QUOTE_STRING_MODE],
      },
      {
        className: "symbol",
        begin: /'[a-zA-Z_][a-zA-Z0-9_]*/,
      },
      {
        className: "function",
        beginKeywords: "fn",
        end: "(\\()",
        excludeEnd: true,
        contains: [hljs.TITLE_MODE],
      },
    ],
  };
}