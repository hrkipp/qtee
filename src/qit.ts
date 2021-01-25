import { Context, Location } from "./compile";
import { Functions } from "./functions";


export const BaseContext: Context = {
    functions: Functions,
    responseIdentifers: {},
    outcomeIdentifiers: {},
}
