import { Node } from './parse'
import { Token, TokenType } from './tokenize'

export enum BaseType {
    String = "string",
    Integer = "integer",
    Float = "float",
    Boolean = "boolean",
    Identifier = "identifier",
    File = "file",
}

export enum Cardinality {
    Single = "single",
    Multiple = "multiple",
    Ordered = "ordered",
}

export interface Type {
    baseType: BaseType
    cardinality: Cardinality
}

export interface Function {
    name: string
    attributes?: string[],
    returnType?: (attributes: { name: string, value: string }[], argTypes: Type[]) => Type
    override?: (node: Node[]) => { value: string, type: Type }
}

export interface Context {
    functions: { [name: string]: Function },
    responseIdentifers: { [name: string]: Type },
    outcomeIdentifiers: { [name: string]: Type },
}

export function compile(ctx: Context, node: Node): { value: string, type: Type } {

    if (node.value instanceof Object) {
        let token = node.value as Token
        switch (token.tokenType) {
            case TokenType.Identifier:
                let t = ctx.responseIdentifers[token.value] || ctx.outcomeIdentifiers[token.value];
                if (!t) {
                    throw new Error(`no variable found for identifier '${token.value}'`)
                }
                return { value: `<variable identifier="${token.value}"/>`, type: t }
            case TokenType.StringLiteral:
                return {
                    value: `<baseValue baseType="string">${token.value}</baseValue>`,
                    type: { baseType: BaseType.String, cardinality: Cardinality.Single },
                }
            case TokenType.FloatLiteral:
                return {
                    value: `<baseValue baseType="float">${token.value}</baseValue>`,
                    type: { baseType: BaseType.Float, cardinality: Cardinality.Single },
                }
            case TokenType.IntegerLiteral:
                return {
                    value: `<baseValue baseType="integer">${token.value}</baseValue>`,
                    type: { baseType: BaseType.Integer, cardinality: Cardinality.Single },
                }
        }
    }

    let nodes = node.value as Node[]

    let functionName = nodes[0].value as Token
    if (!functionName) {
        throw new Error("sub nodes not allowed as first element")
    }

    if (functionName.tokenType != TokenType.Identifier) {
        throw new Error("first element must be an identifier")
    }

    let func = ctx.functions[functionName.value]
    if (!func) {
        throw new Error(`no function found for ${functionName.value}`)
    }

    if (func.override) {
        return func.override(nodes)
    }

    let attributes: { name: string, value: string }[] = []
    let bodyElements: string[] = []
    let argTypes: Type[] = []
    for (let i = 1; i < nodes.length; i++) {
        if (func.attributes && i <= func.attributes.length) {
            let token = nodes[i].value as Token
            attributes.push({ name: func.attributes[i - 1], value: token.value })
        } else {
            let { value, type } = compile({ ...ctx }, nodes[i])
            bodyElements.push(value)
            argTypes.push(type)
        }
    }

    let out = `<${func.name}`
    for (let attribute of attributes) {
        out += ` ${attribute.name}="${attribute.value}"`
    }
    if (bodyElements.length == 0) {
        return { value: out + "/>", type: func.returnType(attributes, argTypes) }
    } else {
        out += ">"
    }

    for (let bodyElement of bodyElements) {
        out += "\n\t" + bodyElement.replace(/\n/g, "\n\t")
    }

    return { value: out + `\n</${func.name}>`, type: func.returnType(attributes, argTypes) }
}
