require('babel-register');

var elastic = require('./elasticGenerator');
var mysql = require('./mysqlGenerator');

var total = 0;
var totaltime = new Date().getTime();
var i = 0;
var str = '';

var run = function (dbs, cb) {
    dbs.findStartWith(urlsWild[i], function (response, err) {
        if (err)
            console.log(err);

        str += response.hits.hits.length + '\n';
        str += response.took + '\n';
        i++;
        total += response.took;
        
        // console.log(i);

        if (i < urlsWild.length)
            run(dbs, cb);
        else {
            cb();
        }
    })

};

var urls = [
    'http://www.aktuality.sk',
    'http://www.aktuality.sk/clanok/331119/rakusko-prejavov-pravicoveho-extremizmu-rasizmu-a-xenofobie-vyrazne-pribudlo',
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
];
// urls = urls.concat(urls).concat(urls);
var urlsWild = [
    'http://www.aktuality.sk',
    'http://www.aktuality.sk/clanok',
    'http://www.aktuality.sk/clanok/331119',
    'http://www.aktuality.sk/clanok/331527',
    'http://www.aktuality.sk/clanok/332034',
    'http://www.aktuality.sk/clanok/332357',
    'http://www.aktuality.sk/clanok/332390',
    'http://www.aktuality.sk/clanok/332751',
    'http://www.aktuality.sk/clanok/332815',
    'http://www.aktuality.sk/clanok/332849',
    'http://www.aktuality.sk/clanok/332879',
    'http://www.aktuality.sk/clanok/332896',
    'http://www.aktuality.sk/clanok/332901',
    'http://www.aktuality.sk/clanok/332976',
    'http://www.aktuality.sk/clanok/333028',
    'http://www.aktuality.sk/clanok/333032',
    'http://www.aktuality.sk/clanok/333033',
    'http://www.aktuality.sk/clanok/333034',
    'http://www.aktuality.sk/clanok/333076',
    'http://www.aktuality.sk/clanok/333092',
    'http://www.aktuality.sk/clanok/333108',
    'http://www.aktuality.sk/clanok/333209',
    'http://www.aktuality.sk/clanok/333214',
    'http://www.aktuality.sk/clanok/333238',
    'http://www.aktuality.sk/clanok/333238',
    'http://www.aktuality.sk/clanok/333239',
    'http://www.aktuality.sk/clanok/333285',
    'http://www.aktuality.sk/clanok/333293',
    'http://www.aktuality.sk/clanok/333314',
    'http://www.aktuality.sk/clanok/333357',
    'http://www.aktuality.sk/clanok/333404',
    'http://www.aktuality.sk/clanok/333412',
    'http://www.aktuality.sk/clanok/333417',
    'http://www.aktuality.sk/clanok/333426',
    'http://www.aktuality.sk/clanok/333430',
    'http://www.aktuality.sk/clanok/333447',
    'http://www.aktuality.sk/clanok/333449',
    'http://www.aktuality.sk/clanok/333458',
    'http://www.aktuality.sk/clanok/333459',
    'http://www.aktuality.sk/clanok/333462',
    'http://www.aktuality.sk/clanok/333467',
    'http://www.aktuality.sk/clanok/333471',
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
];
// urlsWild = ['http://www.aktuality.sk/clanok'];
urlsWild = urlsWild.concat(urls);

run(mysql, function () {
    // console.log(str);
    console.log('mysql tooks ' + total/urlsWild.length);

    total = 0;
    i = 0;
    str = '';

    run(elastic, function () {
        // console.log(str);
        console.log('elastic tooks ' + total/urlsWild.length);
        process.exit(0);
    });
});