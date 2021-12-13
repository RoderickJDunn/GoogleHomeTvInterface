
const TV1 = {
    // debug: true, // Default: false
  ip: "192.168.86.243",
  mac: "123456789ABC",
  name: "NodeJS-Test", // Default: NodeJS
  port: 8002, // Default: 8002
  token: "98674381"
};

const TV2 = {
    debug: true, // Default: false
  ip: "192.168.86.183",
  mac: "123456789ABC",
  name: "NodeJS-Test", // Default: NodeJS
  port: 8002, // Default: 8002
  token: "58407584"
};
const TV3 = {
debug: true, // Default: false
  ip: "192.168.86.241",
  mac: "B8:BB:AF:EB:4E:40",
  name: "NodeJS-Test", // Default: NodeJS
  port: 8001, // Default: 8002
//   token: "12341234" // NOTE: so weird, but upstairs TV only responds when token is different from last request
};

module.exports = {
    TV1,
    TV2, 
    TV3
}