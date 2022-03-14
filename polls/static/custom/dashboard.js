// global var

var $DOM = $(document);
var contentSpace = $("#content");
var cur_date = new Date();

// button
var dashboard3_btn = $('.dashboard3-btn');
var dashboard2_btn = $('.dashboard2-btn');
var apTableBtn = $('.ap-table-btn');
var invenTableBtn = $('.inven-table-btn');
// var invenTableBtn = $('.inven-table-btn');


// content
var apTableContent = $("#ap-table-content");
var invenTableContent = $('#inventory-content');
var apTableModal = $("#ap-table-modal");

// def
var active = apTableBtn;
var activeContent = apTableContent;


// test


// init
$('[data-toggle="tooltip"]').tooltip();
$(".datepicker-input").datepicker({
    format: 'dd/mm/yyyy',
    // container: container,
    autoclose: true,
    todayHighlight: true,
    orientation: "auto",
});
$(".datepicker-input").datepicker('setDate', new Date());



// ap modal init
accessPointModal.table = "#content #ap-table-jsgrid";
accessPointModal.modal = apTableModal;
accessPointModal.input = {
    ip: '.input-ip',
    customer: '.input-customer',
    phone: '.input-phone',
    _long: '.input-long',
    lat: '.input-lat',
    wifi: '.input-wifi',
    date: '.input-date',
    area: '.input-area',
    rt: '.input-rt',
    rw: '.input-rw',
    outdoor: '.input-outdoor',
    fo: '.input-fo',
    linka: '.input-linka',
    linka2: '.input-linka2',
    linkb: '.input-linkb',
    linkb2: '.input-linkb2',
    router: '.input-router',
    converter: '.input-converter',
    note: '.input-note',
};
accessPointModal.defaultVal = {
    ip: '192.168.8.',
    wifi: 'RT NET',
};
accessPointModal.init();

// inven table init
// InventoryContent.init();
inventoryContent();
TABLE_VAR.AP_INIT = true;
// console.log(InventoryContent.InventoryType.name);

// ap table init
accessPointTable();
TABLE_VAR.INVEN_INIT = true;
$("#content #ap-table-jsgrid").jsGrid('refreshData');

// dashboard btn
$DOM.on('click', '.dashboard3-btn', function () {
    console.log('dashboard3 clicked');
    menu_select(dashboard3_btn);
    dashboard3();
});

$DOM.on('click', '.dashboard2-btn', function () {
    console.log('dashboard2 clicked');
    menu_select(dashboard2_btn);
    dashboard2();
});

$DOM.on('click', '.ap-table-btn', function () {
    // console.log('AP Table clicked');
    if (!menu_select(apTableBtn, apTableContent)) { return }
});

$DOM.on('click', '.inven-table-btn', function () {
    // console.log('dashboard2 clicked');
    menu_select(invenTableBtn, invenTableContent);
    // dashboard2();
});

function menu_select(btn_item, content) {
    if (active != btn_item) {
        // let _content = content.clone(true, true);
        // contentSpace.empty();
        // contentSpace.append(_content);
        content.removeClass("d-none");
        activeContent.addClass('d-none');
        activeContent = content;
        $(active).removeClass('active');
        $(btn_item).addClass('active');
        active = btn_item;
        return true;
    }
    return false;
}
