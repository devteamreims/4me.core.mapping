/**
 * Configuration file for CWP identification
 * JS Object with cwpIds and ip addresses
 */


const subnet = '192.168.2';


const cwpIps = [
  {
    cwpId: 1, // SPVR
    ipAddr: `${subnet}.229`,
  }, {
    cwpId: 2, // FMP
    ipAddr: `${subnet}.211`,
  }, {
    cwpId: 3, // TECH SPVR
    ipAddr: `::1`,
  }, {
    cwpId: 11,
    ipAddr: `${subnet}.232`,
  }, {
    cwpId: 12,
    ipAddr: `${subnet}.233`,
  },{
    cwpId: 13,
    ipAddr: `${subnet}.234`,
  },{
    cwpId: 14,
    ipAddr: `${subnet}.228`,
  },{
    cwpId: 15,
    ipAddr: `${subnet}.230`,
  },{
    cwpId: 16,
    ipAddr: `${subnet}.231`,
  },{
    cwpId: 20,
    ipAddr: `${subnet}.212`,
  },{
    cwpId: 21,
    ipAddr: `${subnet}.227`,
  },{
    cwpId: 22,
    ipAddr: `${subnet}.224`,
  },{
    cwpId: 23,
    ipAddr: `${subnet}.223`,
  },{
    cwpId: 24,
    ipAddr: `${subnet}.218`,
  },{
    cwpId: 25,
    ipAddr: `${subnet}.221`,
  },{
    cwpId: 26,
    ipAddr: `${subnet}.222`,
  },{
    cwpId: 27,
    ipAddr: `${subnet}.213`,
  },{
    cwpId: 30,
    ipAddr: `${subnet}.219`,
  },{
    cwpId: 31,
    ipAddr: `${subnet}.220`,
  },{
    cwpId: 32,
    ipAddr: `${subnet}.214`,
  },{
    cwpId: 33,
    ipAddr: `${subnet}.217`,
  },{
    cwpId: 34,
    ipAddr: `${subnet}.216`,
  },{
    cwpId: 35,
    ipAddr: `${subnet}.215`,
  },{
    cwpId: 36,
    ipAddr: `${subnet}.226`,
  },{
    cwpId: 37,
    ipAddr: `${subnet}.225`,
  },
];

export default cwpIps;
