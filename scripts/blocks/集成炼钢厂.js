const library = require("base/library");
const myliquids = require("EDliquids");
const myitems = require("EDitems");

const furnace = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "集成炼钢厂", [
        {
            input: {
                items: ["ed-铁/4","ed-镍/1","graphite/2"],
                liquids: ["water/45"],
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
                liquids: ["water/30"],
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
                liquids: ["water/15"],
                power: 4.1,
            },
            output: {
                items: ["ed-钴钢/4"],
            },
            craftTime: 60,
        },
        
        {
            input: {
                items: ["ed-铁/2","ed-铬/2","ed-镍/1","ed-钼/1"],
                liquids: ["water/15"],
                power: 6,
            },
            output: {
                items: ["ed-铁铬合金/6"],
            },
            craftTime: 90,
        }
    ]
);