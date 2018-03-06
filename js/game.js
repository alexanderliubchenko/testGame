$(window).on("load", function() {
    setTimeout(function() {
        $(".logo").fadeOut(1000);
    }, 1000); // через 13000 мс скрывается блок.
});

$(document).ready(function() {
    'use strict';
    
    $.getJSON("../content.json", function(data) {
        
        // функции показывают и скрывают элементы.
        
        function showElem(elem) {
            $(elem).show();
        }
        
        function hideElem(elem) {
            $(elem).hide();
        }
        
        // объект главного персонажа.
        
        var detective = {
            name: "Рэй Контли",
            characteristics: {
                health: 1000,
                damage: 20,
                armor: 0,
                evasion: 10,
                sharpshooting: 50
            }
        };
        
        $("#playerName").val(detective.name); // вывод имени главного персонажа.
        
        var $noteBlock = $(".noteBlock"),
            $cells = $(".cell"),
            $buttonBlock = $(".buttonBlock"),
            $contentBlock = $(".content"),
            $characterInputs = $(".character__input"),
            actualArr = [0, 0, 0, 0, 0],
            $buttonBlock__buttons = $(".buttonBlock__buttons"),
            $buttonPerform = $("#buttonPerform"),
            $buttonPutInBag = $("#buttonPutInBag"),
            $buttonSell = $("#buttonSell"),
            $buttonСancel = $("#buttonСancel"),
            $characterWeapon = $("#weapon"),
            $characterWaistcoat = $("#waistcoat"),
            $characterHelmet = $("#helmet"),
            $characterDevice = $("#device"),
            $arrClassesItems = ["no_weapons", "no_waistcoat", "no_helmet", "no_device", "empty"],
            $emptys = $(".empty"),
            $character__equipmentChilds,
            $arrClassesEquipItems = ["no_weapons", "no_waistcoat", "no_helmet", "no_device"],
            $story_lines = $(".story-line"),
            $storyOnward = $("#storyOnward"),
            indexMessage =  1,
            indexMessageMax = $story_lines.length,
            storyWrapper = document.querySelector(".story__wrapper"),
            $buttonStartMission = $("#startMission"),
            $darknessBlock = $(".darknessBlock"),
            $darknessBlock__smoke = $(".darknessBlock__smoke");
        
        // при наведении на блок с классом cell, рядом с ним открывается блок с информацией по данному предмету. Когда курсор мыши покидает пределы блока, блок с информацией скрывается и очищается.
        
        $($cells).mouseenter(function(pos) {
            event.stopPropagation(); // останавливаем всплытие.
            showElem($noteBlock);
            $($noteBlock).css({'left':(pos.pageX+5)+'px','top':(pos.pageY+10)+'px'});
            
            for (var key in data.items) {
                if ($(this).hasClass(key)) {
                    $($noteBlock).append('<div class="noteBlock__title">' + data.items[key].title + '</div><div class="noteBlock__characteristics"><table><tr><td>Здоровье</td><td>+ ' + data.items[key].characteristics.health + '</td></tr><tr><td>Урон</td><td>+ ' + data.items[key].characteristics.damage + '</td></tr><tr><td>Броня</td><td>+ ' + data.items[key].characteristics.armor + '</td></tr><tr><td>Уклонение</td><td>+ ' + data.items[key].characteristics.evasion + ' %</td></tr><tr><td>Меткость</td><td>+ ' + data.items[key].characteristics.sharpshooting + ' %</td></tr></table></div>');
                }
            }
            
        });
        
        $($cells).mouseleave(function() {
            hideElem($noteBlock);
            $($noteBlock).empty();
        });
        
        // функция должна перебирать массив actualArr и обнулять его значения.
        
        function setArrayValuesToZero() {
            for (var i = 0; i < actualArr.length; i++) {
                actualArr[i] = 0;
            }
        }
        
        // функция определяет какой именно предмет находится в конкретной ячейке "Снаряжения". Она принимает параметр - один из 4 возможных элементов "Снаряжения". Перебирает все возможные предметы в цикле for in. Если у элемента-параметра есть класс, по названию совпадающий с названием одного из перебираемых предметов, тогда вызывается функция sortCharacteristicsAndAdditionToArray. К ней в параметр попадают характеристики конкретного объекта(предмета).
        
        function sortObjectItems(arg) {
            for (var key in data.items) {
                if (arg.hasClass(key)) {
                    sortCharacteristicsAndAdditionToArray(data.items[key].characteristics);
                }
            }
        }
        
        // функция должна перебирать массив actualArr и input'ы с классом character__input и подставлять в input'ы значения из этого массива.
        
        function sortingValuesFromArrayIntoInputs() {
            for (var i = 0, j = 0; i < actualArr.length, j < $characterInputs.length; i++, j++) {
                $($characterInputs[j]).val(actualArr[i]);
            }
        }
        
        // функция должна перебирать свойства главного персонажа, а именно характеристики, в объекте detective и делать их значениями массива actualArr.
        
        function sortsCharacteristicsIntoArrayValues() {
            var count = -1;
            for (var key in detective.characteristics) {
                count++;
                actualArr[count] = detective.characteristics[key];
            }
        }
        
        // функция должна перебирать характеристики конкретного предмета и приплюсовывать их к значениям массива actualArr.
        
        function sortCharacteristicsAndAdditionToArray(concreteElement) {
            var count = -1;
            for (var key in concreteElement) {
                count++;
                actualArr[count] += concreteElement[key];
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
        
        // функция перебирает все ячейки с классом cell, и если у конкретной из них есть класс, совпадающий со свойством объекта data.items, то эта ячейка получает соответствующий фон.
        
        function sortsClassesChoosesBackgroundImage() {
            for (var i = 0; i < $cells.length; i++) {
                for (var clef in data.items) {
                    if ($($cells[i]).hasClass(clef)) {
                        $($cells[i]).css({"background-image": data.items[clef].image});
                    }
                }
            }
        }
        
        // функция должна "переносить" предметы из "Сумки" в "Снаряжения". Функция принимает два параметра - коллекцию ячеек "Снаряжения" и предмет, который мы хотим перенести из "Сумки" в одну из ячеек "Снаряжения". Функция вызывается в момент нажатия на кнопку "Применить".
        
        function appliesSubjectFromBag(equipmentChilds, subj) {
            var x,
                c,
                result = true,
                targetChild,
                y = $(subj).attr("class");
            
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
                $(subj).toggleClass("" + y + " empty");
                $(subj).addClass("cell");
            }
            
        }
        
        // функция должна проверять есть ли в "Сумке" свободное место и переносить предмет из "Снаряжения" в первую найденную ячейку. Если в "Сумке" нет свободных ячеек, то выводится сообщение. Функция вызывается в момент нажатия на кнопку "Снять".
        
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
                    if ($(child[i]).hasClass("empty")) { // если у перебираемой ячейки есть класс empty, то меняяем его на один из четырех классов.
                        
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
        
        // клик по элементу с классом cell.
        
        $($cells).on("click", function(pos1) {
            event.stopPropagation();
            var $clickSubject = this, // в переменную попадает объект на который кликнули.
                result = true;
            
            for (var i = 0; i < $arrClassesItems.length; i++) {
                if ($($clickSubject).hasClass($arrClassesItems[i])) {
                    result = false;
                }
            }
            
            if (result) {
                showElem($buttonBlock); // открывается ранее скрытый блок с кнопками в координатах.
                $($buttonBlock).css({'left':(pos1.pageX+5)+'px','top':(pos1.pageY+10)+'px'});
                $($contentBlock).css({"pointer-events": "none"}); // весь контент в этот момент становится не кликабельным.
            } else {
                return;
            }
            
            hideButton($clickSubject, $buttonPutInBag, "character__backpack"); // если клик по предмету, который находится в разделе "Сумка", то кнопка "Снять" скрыта.
            hideButton($clickSubject, $buttonPerform, "character__equipment"); // если клик по предмету, который находится в разделе "Снаряжение", то кнопка "Применить" скрыта.
            
            // клик по кнопке "Применить".
            
            $($buttonPerform).on("click", function() {
                $character__equipmentChilds = $(".character__equipment").children();
                
                appliesSubjectFromBag($character__equipmentChilds, $clickSubject); // пытаемся переместить предмет в "Снаряжение".
                sortsClassesChoosesBackgroundImage(); // контролируем внешний вид ячеек и предметов.
                
                setArrayValuesToZero(); // обнуляем массив характеристик персонажа.
                sortsCharacteristicsIntoArrayValues(); // записываем в массив исходные характеристики персонажа.
                sortObjectItems($characterWeapon); // проверяем усиление от оружия.
                sortObjectItems($characterWaistcoat); // проверяем усиление от жилета.
                sortObjectItems($characterHelmet); // проверяем усиление от шлема.
                sortObjectItems($characterDevice); // проверяем усиление от устройства.
                sortingValuesFromArrayIntoInputs(); // отображаем изменение массива в input'ах.
                
                hideElem($buttonBlock); // скрывается ранее открытый блок с кнопками.
                $($contentBlock).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                
                $buttonBlock__buttons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
            // клик по кнопке "Снять".
            
            $($buttonPutInBag).on("click", function() {
                transfersSubjectInBag($clickSubject); // пытаемся переместить предмет в "Сумку".
                sortsClassesChoosesBackgroundImage(); // контролируем внешний вид ячеек и предметов.
                
                setArrayValuesToZero(); // обнуляем массив характеристик персонажа.
                sortsCharacteristicsIntoArrayValues(); // записываем в массив исходные характеристики персонажа.
                sortObjectItems($characterWeapon); // проверяем усиление от оружия.
                sortObjectItems($characterWaistcoat); // проверяем усиление от жилета.
                sortObjectItems($characterHelmet); // проверяем усиление от шлема.
                sortObjectItems($characterDevice); // проверяем усиление от устройства.
                sortingValuesFromArrayIntoInputs(); // отображаем изменение массива в input'ах.
                
                hideElem($buttonBlock); // скрывается ранее открытый блок с кнопками.
                $($contentBlock).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                
                $buttonBlock__buttons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
            // клик по кнопке "Отмена".
            
            $($buttonСancel).on("click", function() {
                
                hideElem($buttonBlock); // скрывается ранее открытый блок с кнопками.
                $($contentBlock).css({"pointer-events": "auto"}); // весь контент становится кликабельным.
                
                $buttonBlock__buttons.off("click"); // удаляем обработчики события "клик" с кнопок.
            });
            
        });
        
        // помещаем стартовые предметы.
        
        $characterDevice.toggleClass("no_device electroshock");
        sortsClassesChoosesBackgroundImage(); // контролируем внешний вид ячеек и предметов.
        
        // при загрузке страницы.
        
        setArrayValuesToZero(); // обнуляем массив характеристик персонажа.
        sortsCharacteristicsIntoArrayValues(); // записываем в массив исходные характеристики персонажа.
        sortingValuesFromArrayIntoInputs(); // отображаем изменение массива в input'ах.
        sortObjectItems($characterWeapon); // проверяем усиление от оружия.
        sortObjectItems($characterWaistcoat); // проверяем усиление от жилета.
        sortObjectItems($characterHelmet); // проверяем усиление от шлема.
        sortObjectItems($characterDevice); // проверяем усиление от устройства.
        sortingValuesFromArrayIntoInputs(); // отображаем изменение массива в input'ах.
        
        // функция должна перебирать сюжетные сообщения и поочередно показывать следующее по клику на кнопку "Далее".
        
        function showMessages() {
            indexMessage++;
            $($story_lines[(indexMessage - 1)]).fadeIn(1000);
            var lastMessage = storyWrapper.querySelector("p:nth-child(" + indexMessage + ")");
            
            lastMessage.scrollIntoView(false); // последнее сообщение всегда внизу.
            storyWrapper.scrollBy(0, 5); // отступ 5px снизу.
            
            if (indexMessage === indexMessageMax) {
                $storyOnward.css({"display": "none"}); // скрытие кнопки "Далее".
            }
        }
        
        $storyOnward.on("click", showMessages);
        
        // при нажатии на кнопку "Начать".
        
        $buttonStartMission.on("click", function() {
            var indexSmoke = -1,
                count = 0;
            
            $darknessBlock.css({"display": "block"});
            
            setTimeout(function step() {
                count++;
                if (count < 25) {
                    setTimeout(step, 40);
                }
                
                if (count < 8) {
                    indexSmoke++;
                    $darknessBlock__smoke.css({"display": "none"});
                    $($darknessBlock__smoke[indexSmoke]).css({"display": "block"});
                } else if (count >= 7 && count < 19) {
                    return;
                } else if (count >= 19) {
                    indexSmoke--;
                    $darknessBlock__smoke.css({"display": "none"});
                    $($darknessBlock__smoke[indexSmoke]).css({"display": "block"});
                } else {
                    console.log("Error");
                }
                
//                if (count < 13) {
//                    setTimeout(step, 50);
//                }
//                
//                if (count < 8) {
//                    indexSmoke++;
//                    $darknessBlock__smoke.css({"display": "none"});
//                    $($darknessBlock__smoke[indexSmoke]).css({"display": "block"});
//                } else if (count >= 7) {
//                    indexSmoke--;
//                    $darknessBlock__smoke.css({"display": "none"});
//                    $($darknessBlock__smoke[indexSmoke]).css({"display": "block"});
//                } else {
//                    console.log("Error");
//                }
                
            }, 40);
            
            setTimeout(function() {
                $darknessBlock__smoke.css({"display": "none"});
                $darknessBlock.css({"display": "none"});
            }, 1100);
            
        });
        
    });

});
    