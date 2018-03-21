$(document).ready(function() {
    'use strict';
    
    $.getJSON("../content.json", function(data) {
        
        // функция должна сортировать значения характеристик главного персонажа в соответствующие input'ы.
        
        function sortCharacteristicsInInputs(arg1, arg2) {
            var count = -1;
            for (var key in arg1) {
                count++;
                $(arg2[count]).val(arg1[key]);
            }
        }
        
        // функция должна контролировать внешний вид ячеек.
        
        function sortBackgroundImages(arg1, arg2) {
            for (var i = 0; i < arg1.length; i++) {
                for (var key in arg2) {
                    if ($(arg1[i]).hasClass(key)) {
                        $(arg1[i]).css({"background-image": arg2[key].image});
                    }
                }
            }
        }
        
        // функция должна устанавливать стартовые характеристики главному персонажу, как будто у персонажа в Снаряжении ничего нет. Сразу после её вызова предположительно должны вызываться функции sortEquipment($characterEquipmentChilds, detective.characteristics) чтобы сортировать предметы Снаряжения приплюсовывая усиление от предметов и sortCharacteristicsInInputs(detective.characteristics, $characterInputs) чтобы контролировать значения в input'ах.
        
        function sortsStartingCharacteristics() {
            var count = -1;
            for (var key in detective.characteristics) {
                count++;
                detective.characteristics[key] = characterStartCharacteristicsArray[count];
            }
        }
        
        // функция должна перебирать ячейки Снаряжения. Если в конкретной ячейке есть какой-то предмет, функция определяет что это за предмет и  приплюсовывает его характеристики к значениям характеристик главного персонажа.
        
        function sortEquipment(arg1, arg2) {
            sortsStartingCharacteristics(); // устанавливаем стартовые "чистые" характеристики главного персонажа.
            for (var i = 0; i < arg1.length; i++) {
                for (var key in data.items) {
                    if ($(arg1[i]).hasClass(key)) {
                        
                        for (var clef in arg2) {
                            arg2[clef] += data.items[key].characteristics[clef];
                        }
                        
                    }
                }
            }
        }
        
        // функция должна контролировать наличие патронов у огнестрельного оружия. Если есть хотя бы один патрон, оружие будет наносить свой указанный урон. Если патронов 0, оружие перестаёт наносить урон.
        
        function controlsPresenceAmmunition() {
            var x;
            for (var key in data.items) {
                if ($($characterWeapon).hasClass(key)) {
                    x = data.items[key].ammunition;
                    
                    if (x < 1) {
                        data.items[key].characteristics.damage = 0;
                    } else {
                        data.items[key].characteristics.damage = data.items[key].characteristics.damage;
                    }
                    
                }
            }
        }
        
        // функция должна перебирать сюжетные сообщения и поочередно показывать следующее по клику на кнопку "Далее". Если порядковый номер сообщения совпадает с числом из массива arrIndexMessages, то кнопка "Далее" скрывается.
        
        function showMessages() {
            indexMessage++;
            $($story_lines[(indexMessage - 1)]).fadeIn(100);
            var lastMessage = storyWrapper.querySelector("p:nth-child(" + indexMessage + ")");
            
            lastMessage.scrollIntoView(false); // последнее сообщение всегда внизу.
            storyWrapper.scrollBy(0, 5); // отступ 5px снизу.
            
            for (var i = 0; i < arrIndexMessages.length; i++) {
                if (indexMessage === arrIndexMessages[i]) {
                    $storyOnward.css({"display": "none"}); // скрытие кнопки "Далее".
                }
            }   
        }
        
        // функция должна создавать анимированные эффекты.
        
        function darknessAnimation() {
            var indexSmoke = -1,
                count = 0;
            
            $darkness.css({"display": "block"});
            
            setTimeout(function step() {
                count++;
                if (count < 25) {
                    setTimeout(step, 40);
                }
                
                if (count < 8) {
                    indexSmoke++;
                    $darknessSmoke.css({"display": "none"});
                    $($darknessSmoke[indexSmoke]).css({"display": "block"});
                } else if (count >= 7 && count < 19) {
                    //
                } else if (count >= 19) {
                    indexSmoke--;
                    $darknessSmoke.css({"display": "none"});
                    $($darknessSmoke[indexSmoke]).css({"display": "block"});
                } else {
                    console.log("Error");
                }
                
            }, 40);
        }
        
        // функция должна заполнять объект rival значениями соперника, идущего под порядковым номером rivalCount и сортировать значения соперника в input'ы соперника.
        
        function sortRivalObjectInputs() {
            var rivalIndex = -1;
            
            rival.name = data.rivals["rival" + rivalCount].name;
            rival.health = data.rivals["rival" + rivalCount].health;
            rival.externality = data.rivals["rival" + rivalCount].image;
            rival.description = data.rivals["rival" + rivalCount].description;
            
            for (var key in data.rivals["rival" + rivalCount].characteristics) {
                rivalIndex++;
                rival.characteristics[key] = data.rivals["rival" + rivalCount].characteristics[key];
            }
            
            sortCharacteristicsInInputs(rival.characteristics, $rivalInputs); // сортируем значения характеристик текущего соперника в соответствующие input'ы.
            
            rivalIndex = -1;
            
            for (var clef in data.rivals["rival" + rivalCount].equipmentImages) {
                rival.equipmentImages[clef] = data.rivals["rival" + rivalCount].equipmentImages[clef];
                rivalIndex++;
                $($rivalCells[rivalIndex]).css({"background-image": rival.equipmentImages[clef]});
            }
            
            rival.money = data.rivals["rival" + rivalCount].money;
            
            $("#rivalName").val(rival.name);
            $($rivalHealthInput).val(rival.health);
            $(".rival__externality").css({"background-image": rival.externality});
            $(".rival__description").text(rival.description);
        }
        
        // функция возвращает случайное число от min до max. Предположительно от 1 до 10.
        
        function randomInteger(min, max) {
            var rand = min + Math.random() * (max + 1 - min);
            return Math.floor(rand);
        }
        
        // функция должна возвращать название класса предмета, который находится в ячейке оружия Снаряжения.
        
        function checksPresenceAmmunition() {
            var strClass = $characterWeapon.attr("class"),
                strIndx = strClass.indexOf("cell"),
                resClass;
                
            if (strIndx == 0) {
                resClass = strClass.substring(5);
            } else {
                resClass = strClass.slice(-strIndx);
            }
            
            return resClass;
            
        }
        
        // функция сражения.
        
        function calculationBattle() {
            var damageOnArmorCharacter,
                damageOnArmorRival,
                randomEvasionCharacter = randomInteger(1, 10), // случайное число для уклонения главного персонажа.
                randomAccuracyCharacter = randomInteger(1, 10), // случайное число для меткости главного персонажа.
                percentEvasionCharacter = detective.characteristics.evasion / 10, // текущее значение уклонения главного персонажа.
                percentAccuracyCharacter = detective.characteristics.sharpshooting / 10, // текущее значение меткости главного персонажа.
                randomEvasionRival = randomInteger(1, 10), // случайное число для уклонения противника.
                randomAccuracyRival = randomInteger(1, 10), // случайное число для меткости противника.
                percentEvasionRival = rival.characteristics.evasion / 10, // текущее значение уклонения противника.
                percentAccuracyRival = rival.characteristics.sharpshooting / 10, // текущее значение меткости противника.
                weaponClass = checksPresenceAmmunition(); // название/класс оружия.
            
            if (percentEvasionCharacter < randomEvasionCharacter && percentAccuracyRival >= randomAccuracyRival) {
                damageOnArmorCharacter = rival.characteristics.damage - detective.characteristics.armor;
                
                if (damageOnArmorCharacter > 0 && damageOnArmorCharacter <= detective.health) {
                    detective.health -= damageOnArmorCharacter;
                } else if (damageOnArmorCharacter > 0 && damageOnArmorCharacter > detective.health) {
                    detective.health -= detective.health; // 0
                } else {
                    return;
                }
            }
            
            data.items[weaponClass].ammunition -= 1; // уменьшаем количество боеприпасов на единицу за выстрел.
            
            if (data.items[weaponClass].ammunition < 1) {
                data.items[weaponClass].ammunition = 0;
            }
            
            controlsPresenceAmmunition(); // контролируем наличие боезапаса.
            sortEquipment($characterEquipmentChilds, detective.characteristics); // приплюсовываем характеристики Снаряжения к значениям характеристик главного персонажа.
            sortCharacteristicsInInputs(detective.characteristics, $characterInputs); // сортируем значения характеристик главного персонажа в соответствующие input'ы.
            
            if (percentEvasionRival < randomEvasionRival && percentAccuracyCharacter >= randomAccuracyCharacter) {
                damageOnArmorRival = detective.characteristics.damage - rival.characteristics.armor;
                
                if (damageOnArmorRival > 0 && damageOnArmorRival <= rival.health) {
                    rival.health -= damageOnArmorRival;
                } else if (damageOnArmorRival > 0 && damageOnArmorRival > rival.health) {
                    rival.health -= rival.health; // 0
                } else {
                    return;
                }
            }
            
        }
        
        // функция принимает три параметра: элемент на котором был клик, элемент который нужно будет скрыть и название класса в виде строки. Если у родительского элемента первого параметра есть класс - третий параметр, это значит, что он уже находится в одной из ячеек раздела. А это значит, что кнопка(второй параметр) должна быть скрыта.
        
        function hideButton(elem, bttn, actualClass) {
            var res = $(elem).parent().is("." + actualClass + "");
            if (res) {
                $(bttn).css({"display": "none"});
            } else {
                $(bttn).css({"display": "block"});
            }
        }
        
        // функция должна "переносить" предметы из "Сумки" в "Снаряжения". Функция принимает два параметра - коллекцию ячеек "Снаряжения" и предмет, который мы хотим перенести из "Сумки" в одну из ячеек "Снаряжения". Функция вызывается в момент нажатия на кнопку "Применить".
        
        function appliesSubjectFromBag(equipmentChilds, subj) {
            var x,
                c,
                result = true,
                targetChild,
                y = $(subj).attr("class"),
                z = "cell empty";
            
            for (var key in data.items) {
                if ($(subj).hasClass(key)) {
                    x = data.items[key].type; // определяем какой тип у предмета, что мы собираемся переносить.
                }
            }
            
            switch (x) {
                case "gun":
                    targetChild = $characterWeapon;
                    break;
                case "bodyShield":
                    targetChild = $characterWaistcoat;
                    break;
                case "headShield":
                    targetChild = $characterHelmet;
                    break;
                case "rig":
                    targetChild = $characterDevice;
                    break;
                default:
                    console.log("Error");
            }
            
            c = targetChild.attr("class");
            
            for (var i = 0; i < $arrClassesEquipItems.length; i++) {
                if ($(targetChild).hasClass($arrClassesEquipItems[i])) {
                    result = false; // проверяем нет ли уже в той ячейке, в которую мы собираемся переносить предмет, предмета такого же типа. Если есть, тогда  result = true. Если свободная, тогда  result = false.
                }
            }
            
            if (result) {
                console.log("В снаряжении уже есть предмет такого типа.");
            } else {
                targetChild.toggleClass("" + c + " " + y + "");
                $(subj).toggleClass("" + y + " " + z + "");
            }
            
        }
        
        // функция должна проверять есть ли в "Сумке" свободное место и переносить предмет из "Снаряжения" в первую найденную пустую ячейку. Если в "Сумке" нет свободных ячеек, то выводится сообщение. Функция вызывается в момент нажатия на кнопку "Снять".
        
        function transfersSubjectInBag(subj) {
            var x = $(".empty"), // в х попадают все свободные ячейки "Сумки".
                x_length = x.length, // количество свободных ячеек "Сумки".
                subj_classes = $(subj).attr("class"),
                a,
                child,
                result_id;
            
            if (x_length) { // если есть одна свободная ячейка или больше.
                a = $(x[0]).attr("class");
                $(x[0]).toggleClass("" + a + " " + subj_classes + "");
                $(subj).toggleClass("" + subj_classes + " " + a + "");
                child = $(".character__equipment").children(".cell");
                result_id = $(subj).attr("id");
                
                for (var i = 0; i < child.length; i++) { // перебираются все 4 ячейки "Снаряжения".
                    if ($(child[i]).hasClass("empty")) { // если у перебираемой ячейки есть класс empty, то меняем его на один из четырех классов.
                        
                        switch (result_id) {
                            case "weapon":
                                $(subj).toggleClass("empty no_weapons");
                                break;
                            case "waistcoat":
                                $(subj).toggleClass("empty no_waistcoat");
                                break;
                            case "helmet":
                                $(subj).toggleClass("empty no_helmet");
                                break;
                            case "device":
                                $(subj).toggleClass("empty no_device");
                                break;
                            default:
                                console.log("Error");
                        }
                        
                    }
                }
                
            } else {
                console.log("В сумке нет свободного места.");
            }
        }
        
        // функция должна перебирать ячейки Сумки и сортировать в раздел Магазина текущие предметы из Сумки с конкретной информацией. 
        
        function sortsSubjectsSatchelIntoStore() {
            $characterSatchelChilds = $(".character__satchel").children();
            
            for (var i = 0, j = 0; i < $characterSatchelChilds.length, j < $sellings.length; i++, j++) {
                var strClass = $($characterSatchelChilds[i]).attr("class"),
                    strIndx = strClass.indexOf("cell"),
                    tp,
                    resClass;
                
                if (strIndx == 0) {
                    resClass = strClass.substring(5);
                } else {
                    resClass = strClass.slice(-strIndx);
                }
                
                tp = data.items[resClass].type;
                
                if (resClass != "empty") {
                    
                    if (tp == "gun") {
                        $($sellings[j]).append('<div class="selling__title">' + data.items[resClass].title + '</div><div class="selling__image"></div><div class="selling__characteristics"><table><tr><td>Урон</td><td>+ ' + data.items[resClass].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[resClass].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[resClass].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[resClass].characteristics.sharpshooting + ' %</td></tr><tr><td>Стоимость</td><td>' + data.items[resClass].price + ' $</td></tr></table><button class="buttonSelling">Продать предмет</button><table><tr><td>Патроны</td><td>' + data.items[resClass].ammunition + '</td></tr></table><button class="buttonSelling">Купить патроны</button><p>Стоимость одной упаковки &nbsp;' + data.items[resClass].price_ammo + ' $. В одной упаковке 10 патронов.</p></div>');
                    
                        $($sellings[j]).children(".selling__image").css({"background-image": data.items[resClass].image});
                        
                    } else {
                        $($sellings[j]).append('<div class="selling__title">' + data.items[resClass].title + '</div><div class="selling__image"></div><div class="selling__characteristics"><table><tr><td>Урон</td><td>+ ' + data.items[resClass].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[resClass].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[resClass].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[resClass].characteristics.sharpshooting + ' %</td></tr><tr><td>Стоимость</td><td>' + data.items[resClass].price + ' $</td></tr></table><button class="buttonSelling">Продать предмет</button></div>');
                    
                        $($sellings[j]).children(".selling__image").css({"background-image": data.items[resClass].image});
                    }
                    
                }
            }
        }
        
        // функция должна проверять какие предметы уже есть у главного персонажа в разделах Снаряжение и Сумка, и сортировать в раздел Товар магазина предметы, которых среди них нет.
        
        function sortGoodsIntoStore() {
            var arr = [];
            
            for (var i = 0; i < $cells.length; i++) {
                var strClass = $($cells[i]).attr("class"),
                    strIndx = strClass.indexOf("cell"),
                    resClass;
                
                if (strIndx == 0) {
                    resClass = strClass.substring(5);
                } else {
                    resClass = strClass.slice(-strIndx);
                }
                
                arr.push(resClass);
            }
            
            for (var key in data.items) {
                
                switch (key) {
                    case "no_weapons":
                    case "no_waistcoat":
                    case "no_helmet":
                    case "no_device":
                    case "empty":
                    case arr[0]:
                    case arr[1]:
                    case arr[2]:
                    case arr[3]:
                    case arr[4]:
                    case arr[5]:
                    case arr[6]:
                    case arr[7]:
                        break;
                    default:
                        $shopPack.append('<div class="shop__goods"><div class="goods__col"><div class="goods__title">' + data.items[key].title + '</div><div class="goods__image" style="background-image: ' + data.items[key].image + ';"></div></div><div class="goods__col"><table><tr><td>Урон</td><td>+ ' + data.items[key].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[key].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[key].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[key].characteristics.sharpshooting + ' %</td></tr></table></div><div class="goods__col"><div class="goods__price">' + data.items[key].price + ' $</div><button class="buttonGoods">Купить предмет</button></div></div>');
                }
                
            }
        }
        
        // объект главного персонажа.
        
        var detective = {
            name: "Рэй Контли",
            externality: "url(../img/detective.jpg)",
            health: 1000,
            money: 553,
            characteristics: {
                damage: 50,
                armor: 0,
                evasion: 10,
                sharpshooting: 60
            }
        };
        
        // объект соперника.
        
        var rival = {
            name: "",
            externality: "",
            health: 0,
            characteristics: {
                damage: 0,
                armor: 0,
                evasion: 0,
                sharpshooting: 0
            },
            equipmentImages: {
                image1: "",
                image2: "",
                image3: "",
                image4: ""
            },
            description: "",
            money: 0
        };
        
        var $characterNameInput = $("#characterName"),
            $characterExternality = $(".character__externality"),
            $characterHealthInput = $("#characterHealth"),
            $characterMoneyInput = $("#characterMoney"),
            $characterInputs = $(".character__input"),
            $cells = $(".cell"),
            $note = $(".note"),
            $characterWeapon = $("#weapon"),
            $characterWaistcoat = $("#waistcoat"),
            $characterHelmet = $("#helmet"),
            $characterDevice = $("#device"),
            $characterEquipmentChilds = $(".character__equipment").children(),
            $story_lines = $(".story-line"),
            $storyOnward = $("#storyOnward"), // кнопка "Далее".
            indexMessage =  1,
            arrIndexMessages = [7, 10],
            storyWrapper = document.querySelector(".story__wrapper"),
            $buttonStartMission = $(".startMission"), // кнопка "Начать".
            $darkness = $(".darkness"),
            $darknessSmoke = $(".darkness__smoke"),
            $arena = $(".arena"),
            $rivalInputs = $(".rival__input"),
            $buttonAttack = $("#buttonAttack"), // кнопка "Атаковать".
            $buttonRetreat = $("#buttonRetreat"), // кнопка "Отступить".
            $rivalHealthInput = $("#rivalHealth"),
            $rivalCells = $(".rival-cell"),
            characterStartCharacteristicsArray = [50, 0, 10, 60],
            $extraction = $(".extraction"),
            $buttonWrapper = $(".button__wrapper"),
            $content = $(".content"),
            $buttonPerform = $("#buttonPerform"), // кнопка "Применить".
            $buttonPutInBag = $("#buttonPutInBag"), // кнопка "Снять".
            $buttonСancel = $("#buttonСancel"), // кнопка "Отмена".
            $arrClassesEquipItems = ["no_weapons", "no_waistcoat", "no_helmet", "no_device"],
            $buttonWrapperChildButtons = $(".button__wrapper").children(),
            $shop = $(".shop"), // скрытый блок "Магазин".
            $shopItem = $("#shopItem"), // ячейка "Магазин" в блоке Меню.
            $sellings = $(".selling"),
            $characterSatchelChilds, // ячейки Сумки.
            $shopPack = $(".shop__pack"),
            rivalCount = 1; // порядковый номер соперника.
        
        $characterNameInput.val(detective.name);
        $characterExternality.css({"background-image": detective.externality});
        $characterHealthInput.val(detective.health);
        $characterMoneyInput.val(detective.money);
        $characterDevice.toggleClass("no_device electroshock"); // помещаем стартовые предметы в Снаряжение.
        
        sortBackgroundImages($cells, data.items); // контролируем внешний вид ячеек главного персонажа.
        controlsPresenceAmmunition(); // проверяем есть ли боеприпасы у текущего оружия Снаряжения.
        sortEquipment($characterEquipmentChilds, detective.characteristics); // приплюсовываем характеристики Снаряжения к значениям характеристик главного персонажа.
        sortCharacteristicsInInputs(detective.characteristics, $characterInputs); // сортируем значения характеристик главного персонажа в соответствующие input'ы.
        
        // при наведении на ячейку Снаряжения или Сумки, рядом с ней открывается блок с информацией по данному предмету. Когда курсор мыши покидает пределы блока, блок с информацией скрывается и очищается.
        
        $($cells).mouseenter(function(pos) {
            event.stopPropagation();
            $note.show();
            $($note).css({'left':(pos.pageX+5)+'px','top':(pos.pageY+10)+'px'});
            
            for (var key in data.items) {
                if ($(this).hasClass(key)) {
                    var tp = data.items[key].type;
                    
                    switch (tp) {
                        case "nothing":
                            $($note).append('<div class="note__title">' + data.items[key].title + '</div>');
                            break;
                        case "gun":
                            $($note).append('<div class="note__title">' + data.items[key].title + '</div><div class="note__characteristics"><table><tr><td>Урон</td><td>+ ' + data.items[key].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[key].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[key].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[key].characteristics.sharpshooting + ' %</td></tr><tr><td>Патроны</td><td>' + data.items[key].ammunition + '</td></tr></table></div>');
                            break;
                        case "bodyShield":
                        case "headShield":
                        case "rig":
                            $($note).append('<div class="note__title">' + data.items[key].title + '</div><div class="note__characteristics"><table><tr><td>Урон</td><td>+ ' + data.items[key].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[key].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[key].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[key].characteristics.sharpshooting + ' %</td></tr></table></div>');
                            break;
                        default:
                            console.log("Error");
                    }
                }
            }
            
        });
        
        $($cells).mouseleave(function() {
            $note.hide();
            $($note).empty();
        });
        
        $storyOnward.on("click", showMessages); // при клике по кнопке "Далее".
        
        // при клике по кнопке "Начать".
        
        $($buttonStartMission).on("click", function() {
            darknessAnimation(); // анимация.
            sortRivalObjectInputs(); // комплектуем объект rival и заполняем input'ы соперника.
            
            setTimeout(function() {
                $arena.css({"display": "flex"}); // блок арена становится видимым.
            }, 550);
            
            setTimeout(function() {
                $darknessSmoke.css({"display": "none"});
                $darkness.css({"display": "none"});
            }, 1100);
        });
        
        // при клике по кнопке "Атаковать".
        
        $($buttonAttack).on("click", function() {
            calculationBattle(); // главный персонаж и соперник наносят друг другу урон.
            $characterHealthInput.val(detective.health); // обновляем поле Здоровья персонажа.
            $rivalHealthInput.val(rival.health); // обновляем поле Здоровья соперника.
            
            if (detective.health <= 0 ) {
                console.log("game over"); // игра окончена.
                $buttonAttack.css({"pointer-events": "none"}); // кнопка "Атаковать" не кликабельна.
                $buttonRetreat.css({"pointer-events": "none"}); // кнопка "Отступить" не кликабельна.
                
            } else if (rival.health <= 0) { // победа.
                $buttonAttack.css({"pointer-events": "none"}); // кнопка "Атаковать" не кликабельна.
                $buttonRetreat.css({"pointer-events": "none"}); // кнопка "Отступить" не кликабельна.
                $extraction.append("Добыча " + rival.money + " $");
                detective.money = detective.money + rival.money;
                $characterMoneyInput.val(detective.money);
                $extraction.slideDown(300).delay(3000).slideUp(300);
                
                setTimeout(function() {
                    darknessAnimation(); // анимация.
                }, 4000);
                
                setTimeout(function() {
                    $arena.css({"display": "none"}); // блок арена становится не видимым.
                    $extraction.empty();
                    $buttonAttack.css({"pointer-events": "auto"}); // кнопка "Атаковать" кликабельна.
                    $buttonRetreat.css({"pointer-events": "auto"}); // кнопка "Отступить" кликабельна.
                    detective.health = 1000;
                    $($characterHealthInput).val(detective.health);

                    $($(".startMission")[0]).remove(); // удаляем кнопку "Начать" из блока сюжетного сообщения пройденной миссии, чтобы её невозможно было проходить снова. Конкретный соперник мёртв навсегда.
                    $storyOnward.css({"display": "block"}); // кнопка "Далее" становится видна.
                }, 4550);

                setTimeout(function() {
                    $darknessSmoke.css({"display": "none"});
                    $darkness.css({"display": "none"});
                }, 5100);
                
                rivalCount++; // повышаем порядковый номер соперника.
                
                if (rivalCount == 2) { // после победы над первым соперником.
                    setTimeout(function() {
                        $characterWeapon.toggleClass("no_weapons revolver"); // помещаем предмет в Снаряжение.
                    
                        sortBackgroundImages($cells, data.items); // контролируем внешний вид ячеек главного персонажа.
                        controlsPresenceAmmunition(); // проверяем есть ли боеприпасы у текущего оружия Снаряжения.
                        sortEquipment($characterEquipmentChilds, detective.characteristics); // приплюсовываем характеристики Снаряжения к значениям характеристик главного персонажа.
                        sortCharacteristicsInInputs(detective.characteristics, $characterInputs); // сортируем значения характеристик главного персонажа в соответствующие input'ы.
                        
                        $("#shopItem").css({"display": "block"}); // ячейка "Магазин" становится доступна после победы над первым соперником.
                    }, 4550);
                }
                
                
            } else {
                return;
            }
            
        });
        
        // при клике по кнопке "Отступить".
        
        $($buttonRetreat).on("click", function() {
            
        });
        
        // при клике по элементу с классом cell.
        
        $($cells).on("click", function(pos1) {
            event.stopPropagation();
            
            var $clickSubject = this, // в переменную попадает объект на который кликнули.
                strClass = $($clickSubject).attr("class"),
                strIndx = strClass.indexOf("cell"),
                resClass, // класс ячейки(без cell), на которую кликнули.
                result;
                
            if (strIndx == 0) {
                resClass = strClass.substring(5);
            } else {
                resClass = strClass.slice(-strIndx);
            }
            
            switch (resClass) { // если класс один из этих, в переменную result попадает false.
                case "no_weapons":
                case "no_waistcoat":
                case "no_helmet":
                case "no_device":
                case "empty":
                    result = false;
                    break;
                default:
                    result = true; // иначе true.
            }
            
            if (result) {
                $($buttonWrapper).show(); // открывается ранее скрытый блок с кнопками в координатах.
                $($buttonWrapper).css({'left':(pos1.pageX+5)+'px','top':(pos1.pageY+10)+'px'});
                $($content).css({"pointer-events": "none"}); // весь контент в этот момент становится не кликабельным.
            } else {
                return;
            }
            
            hideButton($clickSubject, $buttonPutInBag, "character__satchel"); // если клик по предмету, который находится в разделе "Сумка", то кнопка "Снять" скрыта.
            hideButton($clickSubject, $buttonPerform, "character__equipment"); // если клик по предмету, который находится в разделе "Снаряжение", то кнопка "Применить" скрыта.
            
            // при клике по кнопке "Применить".
            
            $($buttonPerform).on("click", function() {
                var $character__equipmentChilds = $(".character__equipment").children();
                
                appliesSubjectFromBag($character__equipmentChilds, $clickSubject); // пытаемся переместить предмет в "Снаряжение".
                sortBackgroundImages($cells, data.items); // контролируем внешний вид ячеек главного персонажа.
                controlsPresenceAmmunition(); // проверяем есть ли боеприпасы у текущего оружия Снаряжения.
                sortEquipment($characterEquipmentChilds, detective.characteristics); // приплюсовываем характеристики Снаряжения к значениям характеристик главного персонажа.
                sortCharacteristicsInInputs(detective.characteristics, $characterInputs); // сортируем значения характеристик главного персонажа в соответствующие input'ы.
                
                $($buttonWrapper).hide(); // скрывается ранее открытый блок с кнопками.
                $($content).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                $buttonWrapperChildButtons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
            // при клике по кнопке "Снять".
            
            $($buttonPutInBag).on("click", function() {
                transfersSubjectInBag($clickSubject); // пытаемся переместить предмет в "Сумку".
                
                sortBackgroundImages($cells, data.items); // контролируем внешний вид ячеек главного персонажа.
                controlsPresenceAmmunition(); // проверяем есть ли боеприпасы у текущего оружия Снаряжения.
                sortEquipment($characterEquipmentChilds, detective.characteristics); // приплюсовываем характеристики Снаряжения к значениям характеристик главного персонажа.
                sortCharacteristicsInInputs(detective.characteristics, $characterInputs); // сортируем значения характеристик главного персонажа в соответствующие input'ы.
                
                $($buttonWrapper).hide(); // скрывается ранее открытый блок с кнопками.
                $($content).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                $buttonWrapperChildButtons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
            // при клике по кнопке "Отмена".
            
            $($buttonСancel).on("click", function() {
                $($buttonWrapper).hide(); // скрывается ранее открытый блок с кнопками.
                $($content).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                $buttonWrapperChildButtons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
        });
        
        // при клике по ячейке меню "Магазин".
        
        $shopItem.on("click", function() {
            $shop.slideDown(400);
            
            setTimeout(function() {
                $(".shop__wrapper").css({"opacity": 1});
                sortsSubjectsSatchelIntoStore(); // сортируем предметы Сумки в раздел продажи в Магазин.
                sortGoodsIntoStore(); // сортируем товары магазина.
            }, 500);
        });
        
    });
    
});
