import { Token, TokenType } from './tokenize';

export interface Node {
    value: Token | Node[]
}

/* What i want here is to go from 
 * (foo (bar baz))
 *      to 
 * [{foo} [{bar} {baz}]]
 */

export function parse(tokens: Token[]): Node {
    if (tokens[0].tokenType != TokenType.LParen) {
        throw new Error("expression must start with a '('")
    }
    if (tokens[tokens.length - 1].tokenType != TokenType.RParen) {
        throw new Error("expression must end with a ')'")
    }
    let children: Node[] = [];
    let nestedStart = 0
    let nestedDepth = 0
    for (var i = 1; i < tokens.length - 1; i++) {
        let token = tokens[i]
        switch (token.tokenType) {
            case TokenType.LParen:
                if (nestedStart == 0) {
                    nestedStart = i
                }
                nestedDepth++
                break
            case TokenType.RParen:
                nestedDepth--
                if (nestedDepth == 0) {
                    console.log(nestedStart, i + 1)
                    children.push(parse(tokens.slice(nestedStart, i + 1)))
                    nestedStart = 0
                }
                break
            default:
                if (nestedDepth == 0) {
                    children.push({ value: token })
                }
        }
    }
    return { value: children };
}
