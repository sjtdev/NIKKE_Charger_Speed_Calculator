let heroes = [];
$('#root > main > div:nth-child(4) > div > div.sc-kjOQFR.cdfvDP').children('div:not(:nth-child(1)):not(:nth-child(2))').each(function () {
    let hero_element = $(this).children().children();
    let pick_rate_str = hero_element.children('div:nth-child(11)').text();
    if (parseFloat(pick_rate_str.substring(0, pick_rate_str.length - 1)) >= 1.0) {
        let id = hero_element.attr('href').substring(8);
        let win_rate_str = hero_element.children('div:nth-child(6)').text();
        let win_rate = parseFloat(win_rate_str.substring(0, win_rate_str.length - 1));
        heroes.push({ 'id': id, 'win_rate': win_rate });
    }

})
console.log(JSON.stringify(heroes));
// 排序并分组
// let sorted_heroes = {};
// var sdic = Object.keys(heroes).sort(function (b, a) { return heroes[a] - heroes[b] });
// for (ki in sdic) {
//     sorted_heroes[sdic[ki]] = heroes[sdic[ki]]
// }
// console.log(JSON.stringify( sorted_heroes));

const category_width = 1200;
const category_height = 590 / 5;

let limit = Math.floor(heroes.length / 5);
let i = 0, j = 0;
let configs;
if (!configs)
    configs = { 'version': 3, 'configs': [] };
let new_config = { 'config_name': `${$('#root > main > div.sc-gsDKAQ.sc-jJoQJp.dJXCqB.fLfTSR > div > div.sc-fmBCVi.sc-lkgTHX.lhYtBr.sc-gA-DPUo.kIFQWV > details:nth-child(4) > summary > div > span').text()} 7.33c`, 'categories': [] };
let new_category = { 'hero_ids': [] };
let name_winRate = '';
for (let item of heroes) {

    if (i == 0) {
        name_winRate = `${item.win_rate}%${j == 4 ? '-' : ''}`;
        new_category = { 'hero_ids': [] };
        new_category['x_position'] = 0;
        new_category['y_position'] = j * category_height;
        new_category['width'] = category_width;
        new_category['height'] = category_height - 10;
    }
    new_category['hero_ids'].push(item.id);
    if (i++ >= limit-1 && j < 4) {
        name_winRate += `-${item.win_rate}%`;
        new_category['category_name'] = name_winRate;
        new_config.categories.push(new_category);
        i = 0;
        j++;
    } else if (item == heroes[heroes.length - 1]) {
        name_winRate += `-${item.win_rate}%`;
        new_category['category_name'] = name_winRate;
        new_config.categories.push(new_category);
    }
}
configs['configs'].push(new_config);
console.log(JSON.stringify(new_config));