const json_schema_manager = require("./json-schema-manager")
// @ponicode
describe("json_schema_manager.fix", () => {
    test("0", () => {
        let callFunction = () => {
            json_schema_manager.fix("payment transaction at Satterfield - Hyatt using card ending with ***0494 for GHS 370.23 in account ***63108447")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            json_schema_manager.fix("deposit transaction at Streich, Mann and Rutherford using card ending with ***5156 for TJS 69.36 in account ***97846125")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            json_schema_manager.fix("withdrawal transaction at Kovacek Inc using card ending with ***6291 for IRR 718.83 in account ***77705372")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            json_schema_manager.fix("invoice transaction at Larkin Inc using card ending with ***8987 for GHS 889.84 in account ***54986018")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            json_schema_manager.fix("invoice transaction at O'Connell, Beahan and Gerhold using card ending with ***6715 for ARS 840.46 in account ***86953668")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            json_schema_manager.fix(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
