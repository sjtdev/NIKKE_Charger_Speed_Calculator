let str = `{
    "Name":"${$("body > main > h1").text()}",
    "ID":"${
        $("body > main > div.contentbox.character_header__lVZI2 > img")
            .attr("src")
            .match(/c(\d{3})?_/)[1]
    }",
    "Manufacturer":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(1) > div:nth-child(2)").text()}",
    "Squad":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(2) > div:nth-child(2)").text()}",
    "Weapon":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(3) > div:nth-child(2)").text()}",
    "Class":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(4) > div:nth-child(2)").text()}",
    "Element":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(5) > div:nth-child(2)").text()}",
    "Burst":"${$("body > main > div.contentbox.character_header__lVZI2 > div > ul > li:nth-child(6) > div:nth-child(2)").text()}",
    "Charging":""
},`;
console.log(str);

// 获取充速表
let wc = {};
$("body > main > table > tbody")
    .children()
    .each(function () {
        let nikke = $(this).find("span,td:nth-child(3)");
        wc[$(nikke[0]).text()] = $(nikke[1]).text();
    });
console.log(JSON.stringify(wc));
