import { Context, BaseType, Cardinality, compile } from "./compile"
import { parse } from "./parse"
import { tokenize } from "./tokenize"
import { expect } from 'chai';
import { Functions } from "./functions";

describe("compile", () => {
    let ctx: Context = {
        functions: {
            "foo": {
                name: "foo",
                returnType: (_) => ({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
            },
            "bar": {
                name: "bar",
                attributes: ["arg1"],
                returnType: (_) => ({ baseType: BaseType.Integer, cardinality: Cardinality.Multiple })
            },
        },
        responseIdentifers: { "qux": { baseType: BaseType.Integer, cardinality: Cardinality.Single } },
        outcomeIdentifiers: {},
    }
    it("should do the thing", () => {
        let { value, type } = compile(ctx, parse(tokenize(`(foo (bar "baz" 42))`)))
        expect(type).to.eql({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
        expect(value).to.eql(`<foo>\n\t<bar arg1="baz">\n\t\t<baseValue baseType="integer">42</baseValue>\n\t</bar>\n</foo>`)

    })
    it("should do response lookups", () => {
        let { value, type } = compile(ctx, parse(tokenize(`(foo (bar "baz" qux))`)))
        expect(type).to.eql({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
        expect(value).to.eql(`<foo>\n\t<bar arg1="baz">\n\t\t<variable identifier="qux"/>\n\t</bar>\n</foo>`)

    })
    it("should do response lookups", () => {
        let { value, type } = compile(ctx, parse(tokenize(`(foo (bar "baz" qux))`)))
        expect(type).to.eql({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
        expect(value).to.eql(`<foo>\n\t<bar arg1="baz">\n\t\t<variable identifier="qux"/>\n\t</bar>\n</foo>`)

    })
    it("should process my example file correctly", () => {
        let tokens = tokenize(`
(and 
  (match (ordered COLOR_13 COLOR_15) (repeat 2 (id "Green")))
  (match (ordered COLOR_7 COLOR_12) (repeat 2 (id "Purple")))
  (match (ordered COLOR_1 COLOR_9) (repeat 2 (id "Yellow")))
  (anyN 2 3
        (match COLOR_6 (id "Red"))
        (match COLOR_8 (id "Red"))
        (match COLOR_14 (id "Red")))
  (anyN 5 6
        (or (isNull COLOR_2) (match COLOR_2 (id "None")))
        (or (isNull COLOR_3) (match COLOR_3 (id "None")))
        (or (isNull COLOR_4) (match COLOR_4 (id "None")))
        (or (isNull COLOR_5) (match COLOR_5 (id "None")))
        (or (isNull COLOR_10) (match COLOR_10 (id "None")))
        (or (isNull COLOR_11) (match COLOR_11 (id "None"))))
  (anyN 14 15
        (match (len CHECK_1) 1)
        (match (len CHECK_2) 1)
        (match (len CHECK_3) 0)
        (match (len CHECK_4) 1)
        (match (len CHECK_5) 1)
        (match (len CHECK_6) 1)
        (match (len CHECK_7) 1)
        (match (len CHECK_8) 1)
        (match (len CHECK_9) 1)
        (match (len CHECK_10) 0)
        (match (len CHECK_11) 0)
        (match (len CHECK_12) 1)
        (match (len CHECK_13) 1)
        (match (len CHECK_14) 1)
        (match (len CHECK_15) 1)))
            `)
        console.log(tokens)
        let node = parse(tokens)
        console.log(node)
        let { value, type } = compile({
            functions: Functions,
            responseIdentifers: {
                "COLOR_1": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_2": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_3": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_4": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_5": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_6": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_7": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_8": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_9": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_10": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_11": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_12": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_13": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_14": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "COLOR_15": { baseType: BaseType.Identifier, cardinality: Cardinality.Single },
                "CHECK_1": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_2": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_3": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_4": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_5": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_6": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_7": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_8": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_9": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_10": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_11": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_12": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_13": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_14": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
                "CHECK_15": { baseType: BaseType.Identifier, cardinality: Cardinality.Multiple },
            },
            outcomeIdentifiers: {},
        }, node)

        expect(type).to.eql({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
        console.log(value)
        expect(value).to.eql(``)

    })
})
