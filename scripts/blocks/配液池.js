const library = require("base/library");
const myliquids = require("EDliquids");
const myitems = require("EDitems");

const furnace = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "配液池", [
        {
            input: {
                liquids: ["water/10","ed-氯/10"]
            },
            output: {
                liquids: ["ed-盐酸/10"],
            },
            craftTime: 10,
        },
        
        {
            input: {
                items: ["copper/2"],
                liquids: ["ed-盐酸/60","water/30"],
            },
            output: {
                liquids: ["ed-富液/45"],
            },
            craftTime: 60,
        }
    ]
);