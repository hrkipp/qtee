export enum TokenType {
    LParen = "(",
    RParen = ")",
    IntegerLiteral = "Integer",
    FloatLiteral = "Float",
    StringLiteral = "String",
    Identifier = "Identifier",
    Whitespace = "Whitespace",
}

let patterns = [
    { tokenType: TokenType.RParen, pattern: /\)/y },
    { tokenType: TokenType.LParen, pattern: /\(/y },
    { tokenType: TokenType.FloatLiteral, pattern: /-?[0-9]+\.[0-9]*/y },
    { tokenType: TokenType.IntegerLiteral, pattern: /-?[0-9]+/y },
    { tokenType: TokenType.StringLiteral, pattern: /"(.*?)"/y },
    { tokenType: TokenType.Identifier, pattern: /[^()\[\]\s]+/y },
    { tokenType: TokenType.Whitespace, pattern: /\s/y },
];

export interface Token {
    tokenType: TokenType,
    value: string,
};

export function tokenize(input: string): Token[] {
    let out: Token[] = [];
    let lastIndex = 0;
    while (lastIndex < input.length) {
        for (let pattern of patterns) {
            pattern.pattern.lastIndex = lastIndex
            let match = pattern.pattern.exec(input)
            if (match) {
                out.push({
                    tokenType: pattern.tokenType,
                    value: match[match.length - 1],
                })
                lastIndex = pattern.pattern.lastIndex
                break
            }
        }
    }
    return out.filter((token) => token.tokenType != TokenType.Whitespace)
}
