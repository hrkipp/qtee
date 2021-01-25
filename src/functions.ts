import { BaseType, Cardinality, Function } from "./compile";
import { parse, Node } from "./parse";
import { tokenize, Token, TokenType } from "./tokenize";

export const Functions: { [name: string]: Function } = {
    "repeat": {
        name: "repeat",
        attributes: ["numberRepeats"],
        returnType: (_, argTypes) => {
            let baseType: BaseType
            for (let argType of argTypes) {
                switch (argType.cardinality) {
                    case Cardinality.Single:
                    case Cardinality.Ordered:
                        break;
                    default:
                        throw new Error("repeat only accepts single and ordered cardinality things")
                }
                if (!baseType) {
                    baseType = argType.baseType
                } else {
                    if (baseType != argType.baseType) {
                        throw new Error("repeat only accepts arugments with the same baseType")
                    }
                }
            }
            if (!baseType) {
                throw new Error("repeat requires arguments")
            }
            return { baseType: baseType, cardinality: Cardinality.Ordered }
        },
    },
    "anyN": {
        name: "anyN",
        attributes: ["min", "max"],
        returnType: (_, argTypes) => {
            for (let argType of argTypes) {
                if (argType.baseType != BaseType.Boolean) {
                    throw new Error("or only takes arguments with baseType of bool")
                }
                if (argType.cardinality != Cardinality.Single) {
                    throw new Error("or only takes arguments with cardinality of single")
                }
            }
            return { baseType: BaseType.Boolean, cardinality: Cardinality.Single }
        },
    },
    "len": {
        name: "containerSize",
        returnType: (_, argTypes) => {
            if (argTypes.length != 1) {
                throw new Error("len expectect exaclty 1 arugment")
            }
            switch (argTypes[0].cardinality) {
                case Cardinality.Ordered:
                case Cardinality.Multiple:
                    return { baseType: BaseType.Integer, cardinality: Cardinality.Single }
                default:
                    throw new Error("len expects an agument of cardinality multiple or ordered")
            }
        }
    },
    "match": {
        name: "match",
        returnType: (_, argTypes) => {
            let baseType: BaseType
            let cardinality: Cardinality
            for (let argType of argTypes) {
                baseType = baseType || argType.baseType
                cardinality = cardinality || argType.cardinality
                if (baseType != argType.baseType) {
                    throw new Error("match requires that it's arguments have a matching baseType")
                }
                if (cardinality != argType.cardinality) {
                    throw new Error("match requires that it's arguments have a matching cardinality")
                }
            }
            return { baseType: BaseType.Boolean, cardinality: Cardinality.Single }
        },
    },
    "or": {
        name: "or",
        returnType: (_, argTypes) => {
            for (let argType of argTypes) {
                if (argType.baseType != BaseType.Boolean) {
                    throw new Error("or only takes arguments with baseType of bool")
                }
                if (argType.cardinality != Cardinality.Single) {
                    throw new Error("or only takes arguments with cardinality of single")
                }
            }
            return { baseType: BaseType.Boolean, cardinality: Cardinality.Single }
        },
    },
    "isNull": {
        name: "isNull",
        returnType: (_) => ({ baseType: BaseType.Boolean, cardinality: Cardinality.Single })
    },
    "and": {
        name: "and",
        returnType: (_, argTypes) => {
            for (let argType of argTypes) {
                if (argType.baseType != BaseType.Boolean) {
                    throw new Error("and only takes arguments with baseType of bool")
                }
                if (argType.cardinality != Cardinality.Single) {
                    throw new Error("and only takes arguments with cardinality of single")
                }
            }
            return { baseType: BaseType.Boolean, cardinality: Cardinality.Single }
        },
    },
    "ordered": {
        name: "ordered",
        returnType: (_, argTypes) => {
            let baseType: BaseType
            for (let argType of argTypes) {
                switch (argType.cardinality) {
                    case Cardinality.Single:
                    case Cardinality.Ordered:
                        break;
                    default:
                        throw new Error("ordered only accepts single and ordered cardinality things")
                }
                if (!baseType) {
                    baseType = argType.baseType
                } else {
                    if (baseType != argType.baseType) {
                        throw new Error("ordered only accepts arugments with the same baseType")
                    }
                }
            }
            return { baseType: baseType, cardinality: Cardinality.Ordered }
        },
    },
    "baseValue": {
        name: "baseValue",
        attributes: ["baseType"],
        returnType: (attributes, argTypes) => {
            if (argTypes.length != 1) {
                throw new Error("baseValue expects 1 argument")
            }
            return { baseType: attributes[0].value as BaseType, cardinality: Cardinality.Single }
        },
    },
    /// <baseValue baseType="identifier">Green</baseValue>
    "id": {
        name: "id",
        override: (nodes: Node[]) => {
            if (nodes.length != 2) {
                throw new Error("id only takes one argument")
            }
            if (nodes[1].value instanceof Array) {
                throw new Error("id only takes a string literal")
            }
            let tok = nodes[1].value as Token
            return {
                value: `<baseValue baseType="identifier">${tok.value}</baseValue>`,
                type: {
                    baseType: BaseType.Identifier,
                    cardinality: Cardinality.Single,
                },
            }
        }
    }
};
