const library = require("base/library");
const myliquids = require("EDliquids");
const myitems = require("EDitems");

const furnace = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "集成炼钢厂", [
        {
            input: {
                items: ["ed-铁/4","ed-镍/1","graphite/2"],
                liquids: ["water/0.75"],
                power: 5.3,
            },
            output: {
                items: ["ed-钢/4"],
            },
            craftTime: 30,
        },
        
        {
            input: {
                items: ["ed-钢/2","ed-锰/2","ed-磨砂金属粉末/1"],
                liquids: ["water/0.5"],
                power: 6.2,
            },
            output: {
                items: ["ed-锰钢/3"],
            },
            craftTime: 45,
        },
        
        {
            input: {
                items: ["ed-钢/2","ed-钴/3"],
                liquids: ["water/0.25"],
                power: 4.1,
            },
            output: {
                items: ["ed-钴钢/4"],
            },
            craftTime: 60,
        }
    ]
);