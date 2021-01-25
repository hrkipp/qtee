import { TokenType, tokenize } from './tokenize';
import { expect } from 'chai';

describe("tokenize", () => {
    it("should do the thing", () => {
        expect(tokenize(`(foo2 "bar" (+ 1 2.5))`)).to.eql([
            { value: "(", tokenType: TokenType.LParen },
            { value: "foo2", tokenType: TokenType.Identifier },
            { value: "bar", tokenType: TokenType.StringLiteral },
            { value: "(", tokenType: TokenType.LParen },
            { value: "+", tokenType: TokenType.Identifier },
            { value: "1", tokenType: TokenType.IntegerLiteral },
            { value: "2.5", tokenType: TokenType.FloatLiteral },
            { value: ")", tokenType: TokenType.RParen },
            { value: ")", tokenType: TokenType.RParen },
        ])
    })
})
