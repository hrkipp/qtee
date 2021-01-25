import { parse } from './parse';
import { TokenType, tokenize } from './tokenize';
import { expect } from 'chai';

describe("parse", () => {
    it("should do the thing", () => {
        let node = parse(tokenize(`(foo (bar "baz" 42))`))
        expect(node).to.eql({
            value: [
                { value: { tokenType: TokenType.Identifier, value: "foo" } },
                {
                    value: [
                        { value: { tokenType: TokenType.Identifier, value: "bar" } },
                        { value: { tokenType: TokenType.StringLiteral, value: "baz" } },
                        { value: { tokenType: TokenType.IntegerLiteral, value: "42" } },
                    ],
                },
            ],
        })
    })
    it("should parse queries nested down a few levels", () => {
        let node = parse(tokenize(`(foo (bar (baz)))`))
        expect(node).to.eql({
            value: [
                { value: { tokenType: TokenType.Identifier, value: "foo" } },
                {
                    value: [
                        { value: { tokenType: TokenType.Identifier, value: "bar" } },
                        {
                            value: [
                                { value: { tokenType: TokenType.Identifier, value: "baz" } },
                            ],
                        },
                    ],
                },
            ],
        })
    })
    it("should parse my nasty query", () => {
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
        let node = parse(tokens)
        console.log(node)
    })
})
