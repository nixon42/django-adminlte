// global var

var $DOM = $(document);
var contentSpace = $("#content");
var cur_date = new Date();

// button
var tableMenuBtn = $('.table-menu');
var reportMenuBtn = $('.report-menu');
var customerMenuBtn = $('.customer-menu');
// var dashboard3_btn = $('.dashboard3-btn');
// var dashboard2_btn = $('.dashboard2-btn');
var apTableBtn = $('.ap-table-btn');
var invenTableBtn = $('.inven-table-btn');
var areaTableBtn = $('.area-table-btn');
var netwatchReportBtn = $('.netwatch-report-btn'); 1
var monthlyCustomerBtn = $('.monthly-customer-btn');


// var invenTableBtn = $('.inven-table-btn');


// NOTE: content
// table
var apTableContent = $("#ap-table-content");
var invenTableContent = $('#inventory-content');
var areaTableContent = $('#area-content');
var apTableModal = $("#ap-table-modal");

// report
var netwatchReportContent = $('#netwatch-content');

// def
var menu_active = reportMenuBtn;
var submenu_active = netwatchReportBtn;
var activeContent = netwatchReportContent;



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


// NOTE: ap modal init
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

netwatchContent();
CONTENT_INIT.NETWATCH_INIT = true;


// NOTE : btn event
// table btn
$DOM.on('click', '.ap-table-btn', function () {
    console.log('AP Table clicked');
    if (!submenu_select(apTableBtn, apTableContent)) { return }
    menu_select(tableMenuBtn);
    if (!CONTENT_INIT.INVEN_INIT) {
        // inven table init
        // InventoryContent.init();
        inventoryContent();
        CONTENT_INIT.INVEN_INIT = true;
    }
    if (!CONTENT_INIT.AREA_INIT) {
        // area table init
        areaContent();
        CONTENT_INIT.AREA_INIT = true;
    }
    if (!CONTENT_INIT.AREA_INIT) {
        // area table init
        areaContent();
        CONTENT_INIT.AREA_INIT = true;
    }
    if (!CONTENT_INIT.NETWATCH_INIT) {
        netwatchContent();
        CONTENT_INIT.NETWATCH_INIT = true;
    }
    if (!CONTENT_INIT.AP_INIT) {
        // ap table init
        accessPointTable();
        $("#content #ap-table-jsgrid").jsGrid('refreshData');
        CONTENT_INIT.AP_INIT = true;
    }
});

$DOM.on('click', '.inven-table-btn', function () {
    console.log('inven clicked');
    if (!submenu_select(invenTableBtn, invenTableContent)) { return };
    menu_select(tableMenuBtn);
    if (!CONTENT_INIT.INVEN_INIT) {
        // inven table init
        inventoryContent();
        CONTENT_INIT.INVEN_INIT = true;
    }
});

$DOM.on('click', '.area-table-btn', function () {
    console.log('area clicked');
    if (!submenu_select(areaTableBtn, areaTableContent)) { return };
    menu_select(tableMenuBtn);
    if (!CONTENT_INIT.AREA_INIT) {
        // area table init
        areaContent();
        CONTENT_INIT.AREA_INIT = true;
    }
    // dashboard2();
});

// report btn
$DOM.on('click', '.netwatch-report-btn', () => {
    console.log('netwatch click');
    if (!submenu_select(netwatchReportBtn, netwatchReportContent)) { return }
    menu_select(reportMenuBtn);
    if (!CONTENT_INIT.NETWATCH_INIT) {
        netwatchContent();
        CONTENT_INIT.NETWATCH_INIT = true;
    }
});


// NOTE: switch menu
function menu_select(btn_item) {
    if (menu_active != btn_item) {
        menu_active.removeClass('active');
        btn_item.addClass('active');
        menu_active = btn_item;
        return true;
    }
    return false;
}

function submenu_select(btn_item, content) {
    if (submenu_active != btn_item) {
        // let _content = content.clone(true, true);
        // contentSpace.empty();
        // contentSpace.append(_content);
        content.removeClass("d-none");
        activeContent.addClass('d-none');
        activeContent = content;
        $(submenu_active).removeClass('active');
        $(btn_item).addClass('active');
        submenu_active = btn_item;
        return true;
    }
    return false;
}
