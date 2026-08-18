const library = require("base/library");
const myliquids = require("EDliquids");
const myitems = require("EDitems");

const furnace = library.MultiCrafter(GenericCrafter, GenericCrafter.GenericCrafterBuild, "金属精炼厂", [
        {
            input: {
                liquids: ["ed-富液/135"],
                items: ["graphite/1","ed-磨砂金属粉末/1"],
                power: 20.8,
            },
            output: {
                items: ["ed-精炼铜/10"],
                liquids: ["water/90"]
            },
            craftTime: 90
        }
    ]
);