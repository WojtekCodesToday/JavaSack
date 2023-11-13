import javasack  from "./index.js";
const mDp = new javasack.Datapack('MyDatapack', 7, 'Description of MyDatapack');
mDp.addFunction("my_function", javasack.cmd.RawCommand("data get entity "+javasack.Selector("r", ["limit", 1])+" SelectedItem"))
mDp.generate();