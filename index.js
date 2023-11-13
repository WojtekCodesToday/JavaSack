import * as fs from "fs/promises";
/**     __  ___  __    __  ___     ____    ____     ___ _   __   _.-._
 *      / / / _ \ \ \  / / / _ \  .'    *  / .. \  .*    | _/   ."  |  ".
 *   __/ / / "-" \ \ \/ / / "-" \  *----. |  ''  | |     ||_        |
 *  /___/ /__/"\__\ \__/ /__/"\__\ .____* |__==__| *.___ |  \__     |
 * 
 * An JavaScript library that creates Minecraft datapacks from
 *                 your own file using Node.js,
 *              *until you realize it's an library*
 * ============================================================
 *                          Authors:
 *                      WojtekCodesToday
 */
let cmdWrap = (command, args) => {
    return `${command} ${args}\n`;
}
/** The JavaSack library providing access to creating Minecraft datapacks*/
const javasack = {
    cmd: {
        Say: (...messages) => cmdWrap('say', messages.join("")),
        Tellraw: (selector, ...messages) => cmdWrap('tellraw', [selector, ...messages]),
        Data: (selector, ...messages) => cmdWrap('data', [selector, ...messages]),
        RawCommand: (...cmd) => { return cmd.join(" ")},
        // Add more Minecraft command functions as needed
    },
    Selector(s, ...options) {
        if (!options || options.length === 0) return `@${s} `;
        const optionString = options.map(([key, value]) => `${key}=${value}`).join(',');
        return `@${s}[${optionString}] `;
    },
    NBT(tag, options = { quote: false }) {
        if (options.quote) return `{${Object.entries(tag).map(([key, value]) => `"${key}":${value}`).join(',')}} `;
        else return `{${Object.entries(tag).map(([key, value]) => `${key}:${value}`).join(',')}} `;
    },
    Datapack: class {
        constructor(name, format, desc) {
            if (typeof name !== 'string') throw new Error("Datapack m is not a string!");
            if (typeof format !== 'number') throw new Error("Pack format is not a number!");
            if (typeof desc !== 'string') throw new Error("Datapack description is not a string!");
            this.name = name.toLowerCase();
            this.format = format;
            this.description = desc;
            this.c = [];
            this.n = [];
            // Add more properties as needed
        }

        addFunction(funcm, funcc) {
            this.n.push(funcm);
            this.c.push(funcc);
        }

        async generate() {
            try {
                // Create functions folder inside the data folder
                console.log("Creating folder structure...")
                try {
                    await fs.mkdir(`${this.name}/data/minecraft/tags/functions`, { recursive: true });
                    await fs.mkdir(`${this.name}/data/${this.name}/functions`, { recursive: true });
                } catch (err) {
                    console.log({ err });
                }
                // Create pack.mcmeta file
                console.log("Creating mcmeta file...")
                await fs.writeFile(`${this.name}/pack.mcmeta`, `{"pack":{"pack_format":${this.format},"description":"${this.description}"}}`);


                // Generate functions
                for (let i = 0; i < this.c.length; i++) {
                    this.c[i] = this.c[i].replace("  ", " ")
                    console.log("Writing file " + this.n[i] + ` to ${this.name}/data/${this.name}/functions/${this.n[i]}.mcfunction`);
                    await fs.writeFile(this.name + `/data/${this.name}/functions/${this.n[i]}.mcfunction`, this.c[i]);
                    await fs.writeFile(this.name + `/data/minecraft/tags/functions/${this.n[i]}.json`, `{"values": ["${this.name}:${this.n[i]}"]}`);
                }

                console.log(`Datapack ${this.name} generated successfully!`);
            } catch (err) {
                console.error("Error generating datapack:", err);
            }
        }
    },
};

export default javasack;