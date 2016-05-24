import Base64 from 'base-64';
import gzip from 'gzip-js';
import JSONC from 'jsoncomp';

GLOBAL.Base64 = Base64;
GLOBAL.gzip = gzip;

let templates = [
    {
        html: {"BODY?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"ARTICLE?0":{"children":{"DIV?2":{"children":{"DIV?1":{"children":{"P?5":{"children":{},"movements":{"61":1}},"P?6":{"children":{},"movements":{"63":1}}}}}}}},"DIV?1":{"children":{"DIV?1":{"children":{"UL?0":{"children":{"LI?1":{"children":{"A?0":{"children":{},"movements":{"06":1}}}},"LI?4":{"children":{},"movements":{"11":1}}}}}},"DIV?2":{"children":{},"movements":{"50":1}},"DIV?5":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{},"movements":{"04":1}},"DIV?1":{"children":{"A?0":{"children":{},"movements":{"21":1}}},"movements":{"30":1}}}},"DIV?0":{"children":{"DIV?0":{"children":{},"movements":{"79":1}}}}}}}},"DIV?7":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"73":1}}}},"A?2":{"children":{},"movements":{"37":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"00":2}}}}}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"02":1}}}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"48":1,"97":1}}}},"A?2":{"children":{},"movements":{"74":1,"76":1}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"46":1,"47":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"26":1,"27":3,"32":1,"33":1,"37":5,"49":1},"clicks":{"27":1}}}}}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"11":1,"12":1,"51":1,"61":1}}}}},"movements":{"97":1}}},"movements":{"02":1}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"95":2}}}}}}},"movements":{"07":1}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"11":1}}}}}}}}}}}}},"movements":{"73":1,"83":1,"86":3}}}},"DIV?9":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"40":1,"98":1}}}},"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"24":1}}}},"A?2":{"children":{},"movements":{"44":1}}}}}}},"movements":{"69":1}}}}}},"DIV?11":{"children":{"UL?0":{"children":{"LI?1":{"children":{"A?0":{"children":{"SPAN?0":{"children":{"IMG?0":{"children":{},"movements":{"61":1}}}}}}}}}}}}},"movements":{"21":2,"33":1,"41":1,"43":2,"51":1,"53":2,"67":1,"91":1,"96":1}}},"movements":{"39":3}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?4":{"children":{"DIV?0":{"children":{},"movements":{"59":6,"512":1,"515":1,"516":7}}}}}}},"movements":{"15":1,"27":2,"38":1,"86":1,"05":1}}}},"DIV?2":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"20":2,"63":1,"85":1,"94":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"26":1,"34":1}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"09":1}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"48":1}}}},"A?1":{"children":{},"movements":{"41":1}}}}}}}}}}}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{},"movements":{"70":1,"91":1,"09":1}},"DIV?1":{"children":{"A?0":{"children":{},"movements":{"63":1}}}},"DIV?0":{"children":{"A?0":{"children":{},"movements":{"41":1,"45":17,"57":1}}},"movements":{"45":2,"50":1}}}}},"movements":{"50":1}}}}}}}}},"movements":{"28":1,"94":1,"99":1,"05":1}}},"movements":{"24":2,"28":1,"74":1,"79":1}}}}}}}}}
    },{
        html: {"BODY?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{}}},"movements":{"39":1,"07":1,"09":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"ARTICLE?0":{"children":{"H1?0":{"children":{},"movements":{"15":1,"28":1,"29":2,"31":1,"33":4,"34":4,"37":6,"62":1,"64":1,"76":1,"87":1,"99":1},"clicks":{"37":1}},"DIV?0":{"children":{},"movements":{"68":1}},"DIV?2":{"children":{"DIV?1":{"children":{"P?5":{"children":{},"movements":{"87":1}},"P?2":{"children":{},"movements":{"12":1,"94":1}},"P?1":{"children":{},"movements":{"17":1,"23":1,"43":1}}},"movements":{"12":1,"43":1,"72":1}}}}}},"DIV?1":{"children":{"DIV?1":{"children":{"UL?0":{"children":{"LI?5":{"children":{"A?0":{"children":{},"movements":{"89":1}}}},"LI?2":{"children":{"A?0":{"children":{},"movements":{"19":1}}},"movements":{"08":1}},"LI?3":{"children":{},"movements":{"02":1}},"LI?1":{"children":{"A?0":{"children":{},"movements":{"17":1,"18":1}}}},"LI?4":{"children":{"A?0":{"children":{},"movements":{"11":1}}}}}},"DIV?0":{"children":{},"movements":{"79":2,"89":2}}}},"DIV?5":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"16":1,"97":1}},"A?1":{"children":{},"movements":{"69":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"11":1,"22":1,"23":2,"49":2,"89":1,"01":1},"clicks":{"23":1}}}}}}},"movements":{"92":1}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"67":1}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"16":1,"47":1}}}},"A?1":{"children":{},"movements":{"50":1}},"A?2":{"children":{},"movements":{"49":1}}}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"44":1,"45":1,"66":1,"81":1,"86":1}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"14":1,"42":1}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"65":1}}}}}}}}}}}}},"movements":{"23":1}}}}},"movements":{"30":2,"31":2}}},"movements":{"90":1}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"37":1,"48":1,"58":1,"79":1,"99":1,"07":1}}}},"A?2":{"children":{},"movements":{"94":1}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{},"movements":{"57":1}}},"movements":{"16":1}},"DIV?1":{"children":{"A?0":{"children":{},"movements":{"30":1,"32":1,"38":1,"50":1}}},"movements":{"34":1}},"DIV?2":{"children":{"A?0":{"children":{},"movements":{"31":1,"32":1,"34":1,"35":2}}},"movements":{"30":1,"03":1}},"DIV?3":{"children":{"A?0":{"children":{},"movements":{"30":1}}}},"DIV?4":{"children":{},"movements":{"45":1}},"DIV?6":{"children":{"A?0":{"children":{},"movements":{"42":1}}}},"DIV?8":{"children":{},"movements":{"44":2}}}}}}},"movements":{"47":5,"81":4}}}}}}},"movements":{"04":1}}},"movements":{"24":1,"25":1,"70":3,"80":4,"00":13},"clicks":{"80":1}}},"movements":{"10":1,"20":13,"30":1}}}}}}}
    },{
        html: {"BODY?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"ARTICLE?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"SPAN?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{},"movements":{"52":1,"66":1,"77":1,"78":10,"79":1,"89":1}}}},"A?0":{"children":{"SPAN?0":{"children":{"SPAN?1":{"children":{},"movements":{"11":1}}}},"IMG?0":{"children":{},"movements":{"30":1,"32":9}}}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"IMG?0":{"children":{},"movements":{"43":1,"50":1}}}}}},"DIV?1":{"children":{},"movements":{"15":1,"17":13,"18":1,"35":2,"36":1,"38":1,"46":1,"47":1,"48":1,"49":1,"06":1,"00":2,"02":1},"clicks":{"17":1}},"DIV?2":{"children":{"P?0":{"children":{},"movements":{"18":1,"21":1,"24":1,"26":1,"09":1}}},"movements":{"20":2,"30":2}},"DIV?3":{"children":{"A?0":{"children":{"SPAN?0":{"children":{},"movements":{"51":1}}}}}}},"movements":{"10":1,"39":6,"02":1}},"H1?0":{"children":{},"movements":{"44":1}}}},"DIV?1":{"children":{"DIV?1":{"children":{"UL?0":{"children":{"LI?3":{"children":{"A?0":{"children":{},"movements":{"37":1,"03":3}}},"movements":{"11":1,"21":1,"22":1}},"LI?4":{"children":{"A?0":{"children":{},"movements":{"22":1,"29":1}}},"movements":{"31":3}},"LI?2":{"children":{"A?0":{"children":{},"movements":{"25":1,"37":1}}}},"LI?1":{"children":{"A?0":{"children":{},"movements":{"25":1}}},"movements":{"20":1,"32":1}},"LI?0":{"children":{"A?0":{"children":{},"movements":{"22":3,"24":1,"25":1}}}},"LI?5":{"children":{"A?0":{"children":{},"movements":{"20":1}}}}}}}}},"movements":{"30":1,"40":4}}},"movements":{"33":1}}}}}}},"movements":{"11":9,"21":3,"01":22}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{}}}}}}}}}},"HEADER?0":{"children":{"NAV?0":{"children":{"DIV?0":{"children":{"MENU?0":{"children":{"A?5":{"children":{},"movements":{"03":1}}}}}}}},"DIV?0":{"children":{"DIV?2":{"children":{"A?0":{"children":{},"movements":{"39":1,"49":1,"53":12,"54":1,"58":1,"08":1},"clicks":{"53":1}}}}},"movements":{"38":1}}}}}}}}}
    },{
        html:{"BODY?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?3":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?2":{"children":{"A?0":{"children":{},"movements":{"61":1,"64":1,"66":3,"67":2}}},"movements":{"46":1,"50":1,"60":1,"64":1,"90":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"40":1,"51":1,"92":1}}}}},"movements":{"43":1}},"SPAN?0":{"children":{},"movements":{"78":1,"91":1}},"DIV?0":{"children":{"DIV?2":{"children":{"A?0":{"children":{"SPAN?1":{"children":{},"movements":{"09":1}}}}},"movements":{"65":1,"70":1,"94":1}}},"movements":{"70":2}}},"movements":{"00":1}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"15":1,"16":1,"20":2,"27":1,"28":1,"30":2,"36":1,"38":1,"40":1,"46":1,"48":1,"50":1,"58":1,"60":2,"70":2,"75":1,"77":1,"78":1,"80":1,"90":2,"98":1,"06":1}}}}}}}}}}}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?3":{"children":{"DIV?0":{"children":{},"movements":{"15":1}}}},"DIV?2":{"children":{"A?0":{"children":{},"movements":{"39":1,"44":1,"58":1}}},"movements":{"40":1}},"DIV?0":{"children":{"A?0":{"children":{},"movements":{"19":1,"84":1}}},"movements":{"10":1}},"DIV?1":{"children":{"A?0":{"children":{},"movements":{"47":1}}}}}}}}}}},"movements":{"00":1,"01":1,"02":1}}}}},"movements":{"10":2,"20":1,"30":2,"40":1,"50":1}}},"movements":{"10":14,"20":1,"70":10,"80":7}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{},"movements":{"84":2}}}}}}},"movements":{"30":20,"40":13},"clicks":{"40":1}},"HEADER?0":{"children":{"NAV?0":{"children":{"DIV?0":{"children":{"MENU?0":{"children":{"A?7":{"children":{},"movements":{"15":1,"34":1,"60":1,"63":1,"93":1,"95":1,"01":1,"-14":1}},"A?6":{"children":{},"movements":{"25":1,"27":1,"76":1,"95":1}},"A?5":{"children":{},"movements":{"23":1,"47":1,"74":1,"77":1,"09":1}},"A?1":{"children":{},"movements":{"28":1,"82":1,"89":1,"00":1}},"A?0":{"children":{},"movements":{"22":1,"34":1,"62":1,"96":1}},"A?2":{"children":{},"movements":{"53":1}},"A?3":{"children":{},"movements":{"-12":1}},"A?4":{"children":{},"movements":{"62":1,"02":1}},"A?9":{"children":{},"movements":{"23":1,"54":1,"63":1,"73":1}}},"movements":{"29":1,"49":1,"79":1,"80":2,"08":1}}}}},"movements":{"23":2,"24":1,"25":1,"26":1,"27":1,"30":1,"40":1}},"DIV?0":{"children":{"H1?0":{"children":{"A?0":{"children":{},"movements":{"34":17,"42":6,"43":2,"44":2,"45":1,"50":1,"54":1,"58":1,"60":1,"67":1,"76":1,"78":1},"clicks":{"34":1}}},"movements":{"02":1}}},"movements":{"19":1,"28":1,"29":1,"30":3,"38":2,"41":1,"49":2,"51":1}}},"movements":{"39":1}}},"movements":{"20":1,"30":5,"40":2}}}}}
    },{
        html: {"BODY?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"ARTICLE?0":{"children":{"H1?0":{"children":{},"movements":{"35":1,"44":5,"45":1,"47":2,"48":1,"49":1,"03":1}},"DIV?1":{"children":{"DIV?0":{"children":{"SPAN?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"40":1,"44":1,"46":1}}}}}}}}}},"DIV?2":{"children":{"DIV?1":{"children":{},"movements":{"36":1}},"DIV?2":{"children":{"P?0":{"children":{},"movements":{"40":1,"60":1}},"H2?0":{"children":{},"movements":{"82":1}},"P?7":{"children":{},"movements":{"10":1,"11":1,"39":1,"45":1,"57":1,"89":1}},"P?9":{"children":{},"movements":{"63":1}},"DIV?6":{"children":{"SPAN?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"97":1}}}}}}}},"P?14":{"children":{},"movements":{"22":2,"05":1}},"P?15":{"children":{},"movements":{"52":1}},"H2?3":{"children":{},"movements":{"68":1}}},"movements":{"14":1,"49":2,"68":1,"85":1,"90":1}}},"movements":{"18":1}}}},"DIV?1":{"children":{"DIV?1":{"children":{"UL?0":{"children":{"LI?5":{"children":{"A?0":{"children":{},"movements":{"34":1}}}}}}}},"DIV?5":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"78":1,"80":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"17":1,"24":1,"65":1}}}}},"movements":{"67":1}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"44":1}}}}}}}}},"movements":{"59":1,"79":1}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"13":1}}}}}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"05":2}}}},"A?2":{"children":{},"movements":{"17":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"27":1,"75":1,"94":2,"98":1,"04":1}}}}}}},"movements":{"97":1}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"85":1}}}}}}}}}}}}},"movements":{"53":1,"73":1}}}},"DIV?7":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"65":2,"87":1}}}}}},"DIV?0":{"children":{"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"44":1,"48":1}}}}}}}}}}}}}},"DIV?9":{"children":{"UL?0":{"children":{"LI?2":{"children":{"A?0":{"children":{"SPAN?0":{"children":{"IMG?0":{"children":{},"movements":{"46":1,"60":1,"77":1}}}},"SPAN?1":{"children":{},"movements":{"85":1}}}}}},"LI?0":{"children":{"A?0":{"children":{"SPAN?0":{"children":{"IMG?0":{"children":{},"movements":{"74":1}}}}}}}},"LI?1":{"children":{"A?0":{"children":{"SPAN?0":{"children":{"IMG?0":{"children":{},"movements":{"25":1,"63":1,"04":1}}}},"SPAN?1":{"children":{},"movements":{"09":1}}}}}},"LI?4":{"children":{"A?0":{"children":{"SPAN?0":{"children":{"IMG?0":{"children":{},"movements":{"35":1}}}}}}}}},"movements":{"29":1}}}}},"movements":{"66":1}}},"movements":{"81":1,"91":2,"95":4,"96":1}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{},"movements":{"38":1}},"DIV?3":{"children":{"A?0":{"children":{},"movements":{"48":1}}},"movements":{"49":2,"59":1}},"DIV?4":{"children":{"A?0":{"children":{},"movements":{"33":1}}},"movements":{"79":1}},"DIV?5":{"children":{"A?0":{"children":{},"movements":{"35":1,"44":1,"72":1}}},"movements":{"30":1,"38":1,"40":1}},"DIV?7":{"children":{"A?0":{"children":{},"movements":{"40":1}}},"movements":{"79":1}},"DIV?8":{"children":{"A?0":{"children":{},"movements":{"42":1}}},"movements":{"76":1}},"DIV?9":{"children":{"A?0":{"children":{},"movements":{"52":10}}},"movements":{"41":1,"78":1}},"DIV?6":{"children":{"A?0":{"children":{},"movements":{"33":1}}},"movements":{"57":1}}}}}}},"movements":{"76":4}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"51":1}},"A?2":{"children":{},"movements":{"13":1,"60":2}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"37":1,"65":1}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"65":1}}}},"A?2":{"children":{},"movements":{"31":1}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"70":1,"72":1,"80":1,"82":1,"91":1}}}}}}}}},"movements":{"89":1}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"46":1}}},"movements":{"65":1}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"20":1,"63":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"59":1}}}},"A?1":{"children":{},"movements":{"12":1,"41":1}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"50":1}}}}}}}}}}}}}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{},"movements":{"41":1}},"DIV?3":{"children":{"A?0":{"children":{},"movements":{"40":1}}}}}}}}},"movements":{"38":1,"58":1,"68":1}}}}},"movements":{"10":1,"30":1}}}}},"movements":{"10":5,"15":1,"25":1,"29":1},"clicks":{"10":1}}},"movements":{"10":2,"00":3}}}},"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"STRONG?0":{"children":{},"movements":{"88":1}}}}},"movements":{"19":1}},"DIV?0":{"children":{"A?0":{"children":{},"movements":{"10":5},"clicks":{"10":1}}}}},"movements":{"20":6,"02":1}}}}}
    },{
        html: {"BODY?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{},"movements":{"28":1}}},"movements":{"28":2}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"ARTICLE?0":{"children":{"H1?0":{"children":{},"movements":{"14":1,"34":1,"36":2,"39":1,"49":1,"59":1,"09":1,"08":1,"07":1,"06":1,"05":1,"04":1}},"DIV?1":{"children":{"DIV?0":{"children":{},"movements":{"10":1,"23":1,"31":2,"32":1,"34":3,"44":2,"53":1,"63":1,"80":3,"81":1}}}}},"movements":{"60":3,"70":1,"80":1},"clicks":{"60":1}}}}}}}}}}},"movements":{"20":1,"30":1,"00":1}},"HEADER?0":{"children":{"NAV?0":{"children":{"DIV?0":{"children":{"MENU?0":{"children":{"A?3":{"children":{},"movements":{"87":1}},"A?7":{"children":{},"movements":{"20":1}}}}}}}},"DIV?0":{"children":{"DIV?2":{"children":{"A?0":{"children":{},"movements":{"35":1,"45":3,"46":1,"48":2,"49":1,"54":15,"84":1},"clicks":{"54":1}}}}},"movements":{"50":4}}}}},"movements":{"40":3}}}}}
    },{
        html:{"BODY?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?3":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{},"movements":{"98":1}}},"movements":{"28":1,"67":1,"09":1}}}}},"movements":{"91":1}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"12":9,"22":2,"30":1,"03":3}}}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?5":{"children":{"A?2":{"children":{},"movements":{"36":1}}}},"DIV?4":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"39":2}}}}},"movements":{"39":1}},"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"34":1,"82":1}}}}}}},"movements":{"29":4,"39":1}}}}}}}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?0":{"children":{},"movements":{"55":1,"58":1,"72":1}}}},"DIV?1":{"children":{"A?0":{"children":{},"movements":{"60":1,"69":1}}}},"DIV?2":{"children":{"A?0":{"children":{},"movements":{"70":1,"75":1}}},"movements":{"79":2}},"DIV?3":{"children":{"A?0":{"children":{},"movements":{"61":1}}},"movements":{"64":1,"70":3}},"DIV?4":{"children":{},"movements":{"60":1,"68":1}},"DIV?7":{"children":{"A?0":{"children":{},"movements":{"64":1}}}},"DIV?9":{"children":{"SPAN?1":{"children":{},"movements":{"23":1,"09":1}}}},"DIV?6":{"children":{"A?0":{"children":{},"movements":{"60":1}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{},"movements":{"14":2,"18":1,"25":1,"03":7},"clicks":{"03":1}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?0":{"children":{},"movements":{"64":1}}},"movements":{"59":1,"67":1,"70":1}},"DIV?2":{"children":{},"movements":{"50":1}},"DIV?5":{"children":{"A?0":{"children":{},"movements":{"62":1,"82":1}}},"movements":{"65":1,"86":1}},"DIV?8":{"children":{"SPAN?1":{"children":{},"movements":{"08":1}}}},"DIV?4":{"children":{"A?0":{"children":{},"movements":{"64":1}}}},"DIV?3":{"children":{"A?0":{"children":{},"movements":{"32":2,"33":6,"46":1},"clicks":{"33":1}}},"movements":{"44":11},"clicks":{"44":1}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"SPAN?0":{"children":{},"movements":{"62":2}},"DIV?0":{"children":{"A?1":{"children":{},"movements":{"40":1,"45":2}}}},"DIV?1":{"children":{"A?2":{"children":{},"movements":{"33":1}}}},"DIV?2":{"children":{"A?2":{"children":{},"movements":{"36":1}}},"movements":{"59":1,"09":1}}}}}}},"movements":{"49":1,"04":1}}}}},"movements":{"90":2,"00":1}}},"movements":{"10":2,"20":1,"00":2}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{},"movements":{"44":1}}},"movements":{"48":12,"49":1,"95":3,"99":1,"07":11}}}}},"movements":{"20":11,"40":1,"70":8,"00":1}}}}}}}
    },{
        html:{"BODY?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?3":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"95":1}}},"movements":{"65":1}},"DIV?1":{"children":{"DIV?1":{"children":{"A?0":{"children":{},"movements":{"63":1}}}},"DIV?0":{"children":{},"movements":{"41":1}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"SPAN?0":{"children":{},"movements":{"76":1}}},"movements":{"74":1}},"DIV?1":{"children":{"DIV?3":{"children":{},"movements":{"99":1}}}}}},"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{},"movements":{"40":1}}},"movements":{"11":1,"91":1}}},"movements":{"05":1}}}}}}}},"DIV?2":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{},"movements":{"44":1}}}}}}}},"DIV?6":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"66":1,"75":1}},"A?2":{"children":{},"movements":{"15":1,"40":2,"99":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"15":1,"40":1,"66":1,"76":1}}}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"44":1}},"A?2":{"children":{},"movements":{"03":1}},"SPAN?0":{"children":{},"movements":{"56":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"59":1}}},"movements":{"25":1}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"21":1,"52":1,"56":3,"57":1,"63":1,"64":2,"67":2,"73":1,"75":2,"03":1},"clicks":{"56":1}}}}}}}}}}}}},"movements":{"15":1,"64":1,"05":1}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?9":{"children":{},"movements":{"70":1,"97":1}},"DIV?8":{"children":{"A?0":{"children":{},"movements":{"07":1}}}},"DIV?4":{"children":{},"movements":{"66":1}}}}}}}}},"movements":{"49":1}}}},"DIV?8":{"children":{"SECTION?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"42":1,"64":1,"76":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"99":1}}}}},"movements":{"92":1}},"DIV?0":{"children":{"DIV?0":{"children":{"A?2":{"children":{},"movements":{"63":1}}}}},"movements":{"92":1}}}}},"movements":{"94":1}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{},"movements":{"02":1}}}},"H2?0":{"children":{},"movements":{"34":1}}}}},"movements":{"-10":1}}}}},"movements":{"42":1,"01":1}}},"movements":{"12":11,"13":2,"21":1,"22":9,"23":1,"02":2}}}}}}}}}
    },{
        html:{"BODY?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?3":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?3":{"children":{},"movements":{"10":1,"00":1}}},"movements":{"48":1,"98":1,"09":1}},"DIV?1":{"children":{"DIV?2":{"children":{"A?0":{"children":{},"movements":{"18":1}}},"movements":{"79":1}}},"movements":{"90":1}},"DIV?0":{"children":{"DIV?2":{"children":{},"movements":{"36":1}}},"movements":{"77":1}},"DIV?3":{"children":{},"movements":{"50":1}}}}},"movements":{"91":1}},"DIV?1":{"children":{"DIV?2":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"38":1,"67":1,"75":1,"82":1}}}}}}}}}},"DIV?0":{"children":{"DIV?0":{"children":{"A?1":{"children":{},"movements":{"31":1,"34":1}},"A?0":{"children":{"IMG?0":{"children":{},"movements":{"16":1,"27":1,"29":1,"37":1,"50":1,"52":1,"57":1,"63":1,"64":1,"67":1,"75":1,"76":3,"77":2,"08":1,"06":1}}}}},"movements":{"38":1}}}}},"movements":{"34":1}}}}}}},"movements":{"00":1}}},"movements":{"10":28,"20":43,"00":50},"clicks":{"10":2}},"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{}}}}}}}}}}}}}}}
    },{
        html:{"BODY?0":{"children":{"DIV?0":{"children":{"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{}}},"movements":{"19":1,"09":2,"04":6,"07":1}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"SECTION?0":{"children":{"DIV?3":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{},"movements":{"38":1}}}},"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"44":1,"47":1,"68":1,"01":1}}}}},"movements":{"53":1,"69":1}},"DIV?4":{"children":{"DIV?2":{"children":{},"movements":{"71":1}}},"movements":{"30":1,"90":1}},"DIV?3":{"children":{"DIV?2":{"children":{},"movements":{"50":1}},"SPAN?0":{"children":{},"movements":{"67":1,"79":16}}}},"DIV?2":{"children":{"DIV?2":{"children":{},"movements":{"63":1}}}}},"movements":{"00":1,"01":1}},"DIV?1":{"children":{"DIV?0":{"children":{},"movements":{"31":1,"43":1,"44":1,"53":1,"54":1,"61":1}}}}},"movements":{"96":1}},"DIV?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"18":1,"29":1,"48":1,"67":1,"75":1,"77":1,"82":2,"83":1,"86":1,"93":1,"94":1,"96":1,"98":1}}}},"A?1":{"children":{},"movements":{"72":1,"77":1,"92":1,"93":1,"94":2,"96":1,"98":1}}},"movements":{"58":1,"98":1,"08":1}}}},"DIV?2":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"80":1,"91":1,"94":1,"96":1,"98":1}}}}}},"DIV?1":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"29":1,"37":1,"54":1,"90":1}}}},"A?1":{"children":{},"movements":{"16":1}},"A?2":{"children":{},"movements":{"06":1}}},"movements":{"09":1}}}}}}},"movements":{"94":3}}}},"SECTION?1":{"children":{"DIV?0":{"children":{"DIV?0":{"children":{"DIV?2":{"children":{"DIV?2":{"children":{"A?0":{"children":{},"movements":{"54":1,"04":1}}},"movements":{"85":2,"95":1,"08":1}},"DIV?5":{"children":{"A?0":{"children":{},"movements":{"86":1}}},"movements":{"44":1,"02":1}},"DIV?6":{"children":{"A?0":{"children":{},"movements":{"91":1}}},"movements":{"49":1}},"DIV?7":{"children":{},"movements":{"-18":1}},"DIV?8":{"children":{},"movements":{"08":1}},"DIV?9":{"children":{},"movements":{"00":1,"09":1}}}}}}}},"DIV?1":{"children":{"DIV?0":{"children":{"SPAN?0":{"children":{},"movements":{"10":1,"01":1}},"DIV?0":{"children":{"A?0":{"children":{"IMG?0":{"children":{},"movements":{"40":1}}}}}}}}}}},"movements":{"04":3,"06":1}}}}},"movements":{"30":1,"00":2}}},"movements":{"10":75,"20":54,"70":4,"00":45},"clicks":{"10":2}}},"movements":{"10":11,"20":1}},"HEADER?0":{"children":{"NAV?0":{"children":{"DIV?0":{"children":{"MENU?0":{"children":{"A?0":{"children":{},"movements":{"48":1,"93":1}},"A?1":{"children":{},"movements":{"11":1,"61":1}},"A?2":{"children":{},"movements":{"-12":1}},"A?3":{"children":{},"movements":{"03":1}},"A?4":{"children":{},"movements":{"-10":1}},"A?7":{"children":{},"movements":{"30":1}},"A?9":{"children":{},"movements":{"-13":1}}}},"DIV?0":{"children":{},"movements":{"06":1}}}}},"movements":{"14":3,"29":1}},"DIV?0":{"children":{},"movements":{"39":2,"49":1}}},"movements":{"19":1,"29":1}}},"movements":{"10":1,"20":1,"50":1}}}}}
    }
];

let urls = [
    'http://www.aktuality.sk/',
    'http://www.aktuality.sk/clanok/331119/rakusko-prejavov-pravicoveho-extremizmu-rasizmu-a-xenofobie-vyrazne-pribudlo/',
    'http://www.aktuality.sk/clanok/331527/podivuhodny-uhyn-200-000-antilop-s-opuchnutym-nosom-kto-to-zavinil/',
    'http://www.aktuality.sk/clanok/332034/slovensko-ma-postovu-znamku-k-predsednictvu-eu-s-vonou-borovicovych-lesov/',
    'http://www.aktuality.sk/clanok/332357/ivan-miklos-tymosenkova-robi-na-ukrajine-taku-politiku-ako-fico/',
    'http://www.aktuality.sk/clanok/332390/smutny-zivot-kolotociarov-romantiku-vystriedala-drina/',
    'http://www.aktuality.sk/clanok/332751/na-juhu-ruska-zabili-zastupcu-policajneho-velitela-a-pat-clenov-jeho-rodiny/',
    'http://www.aktuality.sk/clanok/332815/komentar-jadrova-energia-moze-byt-pre-slovensko-financne-nebezpecna/',
    'http://www.aktuality.sk/clanok/332849/skvely-pomocnik-pre-architektov-3d-pero-vytvori-modely-budov-za-niekolko-sekund/',
    'http://www.aktuality.sk/clanok/332879/komentar-cernobyl-nekonciaci-problem/',
    'http://www.aktuality.sk/clanok/332896/fastfoody-krmia-ludi-aj-priemyselnymi-chemikaliami-tvrdia-vedci/',
    'http://www.aktuality.sk/clanok/332901/blog-greenpeace-radioaktivny-cernobylsky-les-je-tikajuca-casovana-bomba/',
    'http://www.aktuality.sk/clanok/332976/v-rakusku-bolo-zemetrasenie/',
    'http://www.aktuality.sk/clanok/333028/ziadne-ozdravovanie-slovenskej-statnej-kasy-sa-nekonalo-potvrdil-to-aj-brusel/',
    'http://www.aktuality.sk/clanok/333032/vystraha-v-noci-opat-hrozia-mrazy/',
    'http://www.aktuality.sk/clanok/333033/nosi-ich-kazdy-viete-na-co-su-kovove-nity-na-dzinsoch/',
    'http://www.aktuality.sk/clanok/333034/polski-exprezidenti-a-byvali-lidri-obvinili-vladu-z-nicenia-demokracie/',
    'http://www.aktuality.sk/clanok/333076/videokomentar-daga-danisa/',
    'http://www.aktuality.sk/clanok/333092/totalnu-izolaciu-kotlebu-chce-21-poslancov-zvysok-ma-vyhrady/',
    'http://www.aktuality.sk/clanok/333108/komentar-lukasa-krivosika-tyrion-lannister-za-prezidenta-usa/',
    'http://www.aktuality.sk/clanok/333209/najlepsie-zarabajuca-skupina-ludi-na-slovensku-s-praxou-vyse-6-rokov/',
    'http://www.aktuality.sk/clanok/333214/robert-fico-nemam-luxusny-byt-ani-auta/',
    'http://www.aktuality.sk/clanok/333238/komentar-zola-mikesa-slovaci-mozu-rakusku-i-krajnu-pravicu-len-zavidiet/',
    'http://www.aktuality.sk/clanok/333238/komentar-zola-mikesa-slovaci-mozu-rakusku-zavidiet-aj-krajnu-pravicu/',
    'http://www.aktuality.sk/clanok/333239/videokomentar-tomasa-kysela-politicka-izolacia-kotlebu-sa-nekona/',
    'http://www.aktuality.sk/clanok/333285/velky-zatah-na-dph-ckarov-v-rukach-policie-je-aj-honorarny-konzul/',
    'http://www.aktuality.sk/clanok/333293/lov-na-cestnych-piratov-namerali-2200-prekroceni-rychlosti-za-den/',
    'http://www.aktuality.sk/clanok/333314/rekordny-mraz-v-piestanoch-namerali-9-2-c/',
    'http://www.aktuality.sk/clanok/333357/nasledky-cernobyla-v-bielorusku-predavaju-radioaktivne-mlieko/',
    'http://www.aktuality.sk/clanok/333404/velka-razia-v-statnych-zelezniciach-bola-to-odplata-byvaleho-zamestnanca-tvrdi-firma/',
    'http://www.aktuality.sk/clanok/333412/opozicia-si-mysli-ze-ich-premier-ku-kontrole-nepusti/',
    'http://www.aktuality.sk/clanok/333417/norska-vlada-nesuhlasi-s-verdiktom-sudu-o-poruseni-prav-breivika/',
    'http://www.aktuality.sk/clanok/333426/kabinet-fico-3-dostal-zelenu-od-poslancov-vladny-program-opozicia-kritizuje-aj-chvali/',
    'http://www.aktuality.sk/clanok/333430/svedska-tajna-sluzba-preveruje-informaciu-o-planovanom-utoku-is-v-krajine/',
    'http://www.aktuality.sk/clanok/333447/tretiu-vlnu-migrantov-vratili-z-grecka-do-turecka/',
    'http://www.aktuality.sk/clanok/333449/poslancov-caka-po-hlasovani-o-dovere-vlade-dalsia-schodza/',
    'http://www.aktuality.sk/clanok/333458/komentar-lubomira-jaska-na-radioaktivitu-zelezna-opona-nefunguje/',
    'http://www.aktuality.sk/clanok/333459/v-oblasti-cernobylskej-havarie-vznikne-radiacno-ekologicka-rezervacia/',
    'http://www.aktuality.sk/clanok/333462/mladi-anglicki-lekari-vstupili-do-strajku-kvoli-vikendovym-priplatkom/',
    'http://www.aktuality.sk/clanok/333467/vitazna-srbska-strana-poziadala-o-prepocitanie-hlasov-z-parlamentnych-volieb/',
    'http://www.aktuality.sk/clanok/333471/500-eurovka-konci-stiahnu-ju-z-obehu/',
    'http://www.aktuality.sk/ekonomika/',
    'http://www.aktuality.sk/europa/',
    'http://www.aktuality.sk/hobby/',
    'http://www.aktuality.sk/koktejl/',
    'http://www.aktuality.sk/komentare/',
    'http://www.aktuality.sk/kontakt/',
    'http://www.aktuality.sk/kultura/',
    'http://www.aktuality.sk/online-rychle-spravy',
    'http://www.aktuality.sk/pripomienky/',
    'http://www.aktuality.sk/rss/zoznam/',
    'http://www.aktuality.sk/spravy/',
    'http://www.aktuality.sk/spravy/domace/',
    'http://www.aktuality.sk/spravy/komentare/',
    'http://www.aktuality.sk/spravy/zahranicne/',
    'http://www.aktuality.sk/zdravie/'
]

function padleft (str) {
    var pad = "00";
    return pad.substring(0, pad.length - str.length) + str
}

function generatePoint() {

    return {
        key: padleft(Math.round(Math.random() * 99)) + "",
        value: Math.round(Math.random() * 13)
    }
}

export function generateVisitData(){
    let i = Math.floor(Math.random()*(templates.length));

    return {
        "url": urls[Math.round(Math.random()*urls.length)],
        "heatmap_data": JSON.stringify(traverse(templates[i].html)),
        "visit_time": new Date()
    };

        // "heatmap_data": JSONC.pack(JSON.stringify(traverse(templates[i].html))),

    // return JSONC.pack(traverse(data));
}

function traverse(data){
    for(let elmKey in data){
        if(data.hasOwnProperty(elmKey) == false)
            continue;

        let elm = data[elmKey];

        if(elm.children != undefined){
            elm.children = traverse(elm.children);
        }

        //generate movements and clicks
        if(Math.random() < 0.1){
            elm.movements = {};
            for(let i=0; i<Math.round(Math.random()*15); i++){
                let point = generatePoint();
                elm.movements[padleft(point.key)+""] = point.value;
            }
        }
        if(Math.random() < 0.05){
            elm.clicks = {};
            for(let i=0; i<Math.round(Math.random()*5); i++){
                let point = generatePoint();
                elm.clicks[padleft(point.key)+""] = point.value;
            }
        }

    }
    return data;
}

export { generateVisitData }