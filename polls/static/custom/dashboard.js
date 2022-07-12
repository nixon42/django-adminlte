// global va
var contentSpace = $("#content");

// menu
var tableMenuBtn = $('.table-menu');
var reportMenuBtn = $('.report-menu');
var homeMenuBtn = $('.home-menu');
var customerMenuBtn = $('.customer-menu');
var outletMenuBtn = $('.outlet-menu');
var inventoryMenuBtn = $('a.inven-menu');

// btn
var invenInBtn = $('a.inven-in-btn');
var invenOutBtn = $('a.inven-out-btn');
var monthlyFormBtn = $('.monthly-form-btn');
var newCustomerFormBtn = $('.new-customer-form-btn');
var apTableBtn = $('.ap-table-btn');
var invenTableBtn = $('.inven-table-btn');
var areaTableBtn = $('.area-table-btn');
var netwatchReportBtn = $('.netwatch-report-btn');
var monthlyCustomerReportBtn = $('.monthly-customer-report-btn');
var monthlyCustomerBtn = $('.monthly-customer-btn');
var monthlyPlanBtn = $('.monthly-plan-btn');
var teamMenuBtn = $('.team-menu');
var teamTableBtn = $('.team-table-btn');
var roleTableBtn = $('.role-table-btn');
var permissionTableBtn = $('.permission-table-btn');
var outletTableBtn = $('a.outlet-table-btn');
var outletIncomeBtn = $('a.outlet-income-btn');
var logoutBtn = $('a.logout-menu');

// NOTE: content
// content
var monthlyFormContent = $('#monthly-form-content');
var newCustomerFormContent = $('#new-customer-form-content');
var apTableContent = $("#ap-table-content");
var invenTableContent = $('#inventory-content');
var areaTableContent = $('#area-content');
var monthlyCustomerContent = $('#monthly-customer-content');
var monthlyPlanContent = $('#monthly-plan-content');
var apTableModal = $("#ap-table-modal");
var teamTableContent = $('#team-table-content');
var roleTableContent = $('#role-table-content');
var permissionTableContent = $('#permission-table-content');
var outletTableContent = $('#outlet-table-content');
var outletIncomeContent = $('#outlet-income-content');
var invenInContent = $('#inven-in-content');

// report
var netwatchReportContent = $('#netwatch-content');
var monthlyCustomerReportContent = $('#monthly-customer-report-content');

// def
var menu_active;
var submenu_active;
var activeContent;

// init
$('[data-toggle="tooltip"]').tooltip();
getprofile();
if (PROFILE == null) {
    let block = $('#block-modal');
    block.find('h2.msg').append('CANT LOAD PROFILE!!');
    block.modal({ backdrop: 'static' });
    block.modal('show');
    throw new Error('cant load profile');
}
else {
    $('a.profile-name').text(PROFILE.first_name);
}


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

// NOTE: INIT

let menu = localStorage.getItem(LOCAL_STORAGE_KEY.MENU);

if (menu) {
    initMenu(menu);
}
else {
    initMenu();
}

function contentInit(nameIdt, menuBtn, keyStr, eventBtn, eventContent, initVar, depend, init) {
    console.log(nameIdt);
    if (!submenu_select(eventBtn, eventContent)) { return }
    localStorage.setItem(LOCAL_STORAGE_KEY.MENU, keyStr);
    menu_select(menuBtn);
    depend();
    if (!initVar) {
        console.log(nameIdt + ' init');
        init();
        initVar = true;
    }
}

function initMenu(menu_key) {
    switch (menu_key) {
        // inven in table
        case CONTENT_INIT.key_string.INVEN_IN:
            // TODO: this
            contentInit(
                'Inven-In',
                inventoryMenuBtn,
                CONTENT_INIT.key_string.INVEN_IN,
                invenInBtn, invenInContent,
                CONTENT_INIT.INVEN_IN_INIT,
                () => { getoutlet(); },
                InvenIn
            );
            break;
        // outlet income table
        case CONTENT_INIT.key_string.OUTLET_INCOME:
            contentInit(
                'Outlet-Income',
                outletMenuBtn,
                CONTENT_INIT.key_string.OUTLET_INCOME,
                outletIncomeBtn, outletIncomeContent,
                CONTENT_INIT.OUTLET_INCOME_INIT,
                () => { getoutlet(); },
                OutletIncome
            );
            break;
        // outlet table
        case CONTENT_INIT.key_string.OUTLET_TABLE:
            contentInit('Outlet Table',
                outletMenuBtn,
                CONTENT_INIT.key_string.OUTLET_TABLE,
                outletTableBtn, outletTableContent,
                CONTENT_INIT.OUTLET_TABLE_INIT,
                () => { getrole(); getarea(); },
                OutletContent
            );
            break;
        case CONTENT_INIT.key_string.MONTHLY_CUSTOMER_REPORT:
            console.log('customer report');
            if (!submenu_select(monthlyCustomerReportBtn, monthlyCustomerReportContent)) { return }
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.MONTHLY_CUSTOMER_REPORT);
            menu_select(customerMenuBtn);
            getarea();
            getplan();
            if (!CONTENT_INIT.MONTHLY_CUSTOMER_REPORT) {
                console.log('customer report init');
                CustomerReport();
                CONTENT_INIT.MONTHLY_CUSTOMER_REPORT = true;
            }
            break;

        case CONTENT_INIT.key_string.NETWATCH:
            console.log('netwatch click');
            if (!submenu_select(netwatchReportBtn, netwatchReportContent)) { return }
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.NETWATCH);
            menu_select(reportMenuBtn);
            if (!CONTENT_INIT.NETWATCH_INIT) {
                netwatchContent();
                CONTENT_INIT.NETWATCH_INIT = true;
            }
            break;

        case CONTENT_INIT.key_string.AREA:
            console.log('area clicked');
            if (!submenu_select(areaTableBtn, areaTableContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.AREA);
            menu_select(areaTableBtn);
            if (!CONTENT_INIT.AREA_INIT) {
                // area table init
                areaContent();
                CONTENT_INIT.AREA_INIT = true;
            }
            break;

        case CONTENT_INIT.key_string.MONTHLY_PLAN:
            console.log('monthly plan clicked');
            if (!submenu_select(monthlyPlanBtn, monthlyPlanContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.MONTHLY_PLAN);
            menu_select(customerMenuBtn);
            if (!CONTENT_INIT.MONTHLY_PLAN) {
                // inven table init
                MonthlyPlan();
                CONTENT_INIT.MONTHLY_PLAN = true;
            }
            break;

        case CONTENT_INIT.key_string.MONTHLY_CUSTOMER:
            console.log('monthly customer clicked');
            if (!submenu_select(monthlyCustomerBtn, monthlyCustomerContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.MONTHLY_CUSTOMER);
            menu_select(customerMenuBtn);
            getarea();
            getap();
            getplan();
            if (!CONTENT_INIT.MONTHLY_CUSTOMER) {
                monthlyCustomer();
                CONTENT_INIT.MONTHLY_CUSTOMER = true;
            }
            break;

        case CONTENT_INIT.key_string.INVEN:
            console.log('inven clicked');
            if (!submenu_select(invenTableBtn, invenTableContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.INVEN);

            menu_select(tableMenuBtn);
            if (!CONTENT_INIT.INVEN_INIT) {
                // inven table init
                inventoryContent();
                CONTENT_INIT.INVEN_INIT = true;
            }
            break;

        case CONTENT_INIT.key_string.AP:
            console.log('AP Table clicked');
            if (!submenu_select(apTableBtn, apTableContent)) { return }
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.AP);
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
            break;

        case CONTENT_INIT.key_string.TEAM_TABLE:
            console.log('Team table click');
            if (!submenu_select(teamTableBtn, teamTableContent)) { return }
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.TEAM_TABLE);
            menu_select(teamMenuBtn);
            getrole();

            if (!CONTENT_INIT.TEAM_TABLE_INIT) {
                // console.log(' init');
                // CustomerReport();
                TeamTable();
                CONTENT_INIT.TEAM_TABLE_INIT = true;
            }
            break;

        case CONTENT_INIT.key_string.NEW_COSTUMER_FORM:
            console.log('new customer clicked');
            if (!submenu_select(newCustomerFormBtn, newCustomerFormContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.NEW_COSTUMER_FORM);

            menu_select(homeMenuBtn);
            getplan();
            getarea();
            getap();
            if (!CONTENT_INIT.NEW_COSTUMER_FORM) {
                NewCustomerForm();
                CONTENT_INIT.NEW_COSTUMER_FORM = true;
            }
            break;

        case CONTENT_INIT.key_string.SUBCRIBE_FORM:
            console.log('subcribe form clicked');
            if (!submenu_select(monthlyFormBtn, monthlyFormContent)) { return };
            localStorage.setItem(LOCAL_STORAGE_KEY.MENU, CONTENT_INIT.key_string.SUBCRIBE_FORM);
            menu_select(homeMenuBtn);
            getcustomer();
            getplan();
            if (!CONTENT_INIT.SUBCRIBE_FORM) {
                monthlyForm();
                CONTENT_INIT.SUBCRIBE_FORM = true;
            }
            break;

        default:
            console.log('subcribe form clicked');
            if (!submenu_select(monthlyFormBtn, monthlyFormContent)) { return };
            menu_select(homeMenuBtn);
            getcustomer();
            getplan();
            if (!CONTENT_INIT.SUBCRIBE_FORM) {
                monthlyForm();
                CONTENT_INIT.SUBCRIBE_FORM = true;
            }
            break;
    }
}

// NOTE : btn event
// team table btn
function btnEvent() {
    // inven in
    invenInBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.INVEN_IN);
    });
    // outlet deposit
    outletIncomeBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.OUTLET_INCOME);
    });
    // outlet table
    outletTableBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.OUTLET_TABLE);
    });
    // team table
    teamTableBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.TEAM_TABLE);
    });

    // role table btn
    roleTableBtn.on('click', () => { });

    // permission table btn
    permissionTableBtn.on('click', () => { });

    // ap table btn
    $DOM.on('click', '.ap-table-btn', function () {
        initMenu(CONTENT_INIT.key_string.AP);
    });

    // inventory
    $DOM.on('click', '.inven-table-btn', function () {
        initMenu(CONTENT_INIT.key_string.INVEN);
    });

    // subcribe form
    $DOM.on('click', '.monthly-form-btn', function () {
        initMenu(CONTENT_INIT.key_string.SUBCRIBE_FORM);
    });

    // new customer form
    newCustomerFormBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.NEW_COSTUMER_FORM);
    });

    // monthly customer
    $DOM.on('click', '.monthly-customer-btn', function () {
        initMenu(CONTENT_INIT.key_string.MONTHLY_CUSTOMER);
    });

    // monthly plan
    $DOM.on('click', '.monthly-plan-btn', function () {
        initMenu(CONTENT_INIT.key_string.MONTHLY_PLAN);
    });

    // area btn
    $DOM.on('click', '.area-table-btn', function () {
        initMenu(CONTENT_INIT.key_string.AREA);
        // dashboard2();
    });

    // netwatch report btn
    $DOM.on('click', '.netwatch-report-btn', () => {
        initMenu(CONTENT_INIT.key_string.NETWATCH);
    });

    // customer report
    monthlyCustomerReportBtn.on('click', () => {
        initMenu(CONTENT_INIT.key_string.MONTHLY_CUSTOMER_REPORT);
    })

    logoutBtn.on('click', () => {
        console.log('logout ...');
        $.ajax({
            url: API_URL.team.logout,
            method: 'GET'
        }).fail(() => {
            toastr.error('network fail');
        }).done(() => {
            window.location.href = '/';
        });
    });
}
btnEvent();

// NOTE: switch menu
function menu_select(btn_item) {
    if (menu_active != btn_item) {
        if (menu_active != null) {
            menu_active.removeClass('active');
        }
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
        if (activeContent != null) {
            activeContent.addClass('d-none');
        }
        activeContent = content;
        $(submenu_active).removeClass('active');
        $(btn_item).addClass('active');
        submenu_active = btn_item;
        return true;
    }
    return false;
}
