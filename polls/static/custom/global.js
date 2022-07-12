var cur_date = new Date();
let dt = luxon.DateTime.local();
var $DOM = $(document);
var AP_DATA = [];
var LOCAL_STORAGE_KEY = {
    MENU: 'rtnet-team-menu',
};
var SELECT_AP_DATA = [
    '',
    'MJTASU'
];
var INVEN_TYPE_DATA = [
    { pk: 1, name: '1cok' },
    { pk: 2, name: '2cok' },
    { pk: 3, name: '3cok' },
];
var INVEN_ROUTER = [{ pk: 0, name: 'asu' }];
var INVEN_KONVERTER = [{ pk: 0, name: 'asu' }];
var CONTENT_INIT = {
    AP_INIT: false,
    INVEN_INIT: false,
    AREA_INIT: false,
    NETWATCH_INIT: false,
    MONTHLY_CUSTOMER: false,
    MONTHLY_PLAN: false,
    SUBCRIBE_FORM: false,
    MONTHLY_CUSTOMER_REPORT: false,
    NEW_COSTUMER_FORM: false,
    TEAM_TABLE_INIT: false,
    ROLE_TABLE_INIT: false,
    OUTLET_TABLE_INIT: false,
    OUTLET_INCOME_INIT: false,
    INVEN_IN_INIT: false,
    table: {},
    key_string: {
        AP: 'ap',
        INVEN: 'inven',
        AREA: 'area',
        NETWATCH: 'netwatch',
        MONTHLY_CUSTOMER: 'monthly-customer',
        MONTHLY_PLAN: 'monthly-plan',
        SUBCRIBE_FORM: 'subcribe-form',
        MONTHLY_CUSTOMER_REPORT: 'monthly-customer-report',
        NEW_COSTUMER_FORM: 'new-customer-form',
        TEAM_TABLE: 'team',
        ROLE_TABLE: 'role',
        OUTLET_TABLE: 'outlet',
        OUTLET_INCOME: 'outlet-income',
        INVEN_IN: 'inven-in'
    }
};
var AREA = [{ pk: 0, name: 'cok', code: 'asu' }];
var NETWATCH_DATA = [{}];
var MONTHLY_PLAN_SELECT = [];
var MONTHLY_PLAN = [];
var MONTHLY_CUSTOMER = []
var MONTHLY_CUSTOMER_REPORT = [];
var PROFILE = null;
var TEAM = [];
var ROLE = [{ id: 1, name: 'asu' }];
var OUTLET = [];
var PERMISSION = [];

var API_URL = {
    outlet: {
        getoutlet: '/outlet/getoutlet',
        addoutlet: '/outlet/addoutlet',
        getdeposit: '/outlet/getdeposit',
        adddeposit: '/outlet/adddeposit',
        validate: '/outlet/validate',
    },
    team: {
        loginPage: '/login',
        login: '/team/login',
        logout: '/team/logout',
        getUser: '/team/getuser',
        addUser: '/team/adduser',
        getRole: '/team/getrole',
        addRole: '/team/addrole',
        getperm: '/team/getperm',
        profile: '/team/profile'
    },
    ap: {
        get: '/getap',
        add: '/addap'
    },
    netwatch: {
        get: '/getapup'
    },
    invent: {
        get: '/getinvent',
        add: '/addinvent'
    },
    inven: {
        get: '/getinven',
        add: '/addinven',
        addinvenin: '/inventory/addinvenin',
        getinvenin: '/inventory/getinvenin',
        addinvenout: '/inventory/addinvenout',
        getinvenout: '/inventory/getinvenout',
    },
    area: {
        get: '/getarea',
        add: '/addarea'
    },
    customer_plan: {
        get: '/customer/getplan',
        add: '/customer/addplan'
    },
    monthly_customer: {
        get: '/customer/getmonthly',
        add: '/customer/addmonthly',
        form: '/customer/subcribe',
        newcustomerlog: '/customer/getnewcus'
    },
    customer_report: {
        getInfo: '/customer/getinfo',
        filter: '/customer/filter',
    },
    form: {
        getTransactionLog: '/customer/getlog',
        getNewCustomerLog: '/customer/getnewcustomer'
    }
}

function getprofile() {
    $.ajax({
        url: API_URL.team.profile,
        method: 'GET',
        dataType: 'json',
        async: false,
    }).fail(() => {
        toastr.error('failed to get permission, network error!');
    }).done((res) => {
        // console.log(res);
        PROFILE = res.data;
    });
}

function getprem() {
    $.ajax({
        url: API_URL.team.getperm,
        method: 'GET',
        dataType: 'json',
        async: false,
    }).fail(() => {
        toastr.error('failed to get permission, network error!');
    }).done((res) => {
        // console.log(res);
        PERMISSION = res.data;
    });
}

function getoutlet() {
    $.ajax({
        url: API_URL.outlet.getoutlet,
        method: 'GET',
        dataType: 'json',
        async: false,
    }).fail(() => {
        toastr.error('failed to get outlet');
    }).done((res) => {
        if (res.return_code != 0) {
            toastr.error(`[${res.return_code}] ${res.msg}`);
            return;
        }
        OUTLET = res.data;
        OUTLET.unshift({ pk: 0, name: "" });
        $('select.input-outlet-select').empty();
        $.each(OUTLET, (k, v) => {
            $('select.input-outlet-select').append(`<option value=${v.id}>${v.name}</option>`);
        });
    });
}

function getrole() {
    $.ajax({
        url: API_URL.team.getRole,
        method: 'GET',
        dataType: 'json',
        async: false
    }).fail(() => {
        toastr.error(`failed to get role`);
    }).done((res) => {
        if (res.return_code != 0) {
            toastr.error(`[${res.return_code}] ${res.msg}`);
            return;
        }
        ROLE = res.data;
        ROLE.unshift({ id: 0, name: '' })
        $('.input-role-select').empty();
        $.each(res.data, (i, v) => {
            $('.input-role-select').append(`<option value=${v.id}>${v.name}</option>`);
        });
    });
}
function getcustomer() {
    $.ajax({
        url: API_URL.monthly_customer.get,
        method: 'GET',
        dataType: 'json',
        async: false,
    }).fail(() => {
        toastr.error(`failed to get customer data`);
    }).done((res) => {
        // toastr.success(`done load customer data `);
        // console.log();
        let data = JSON.parse(res.data);
        MONTHLY_CUSTOMER = data;
        // AREA.push({ pk: 0, name: '', code: '' });
        // console.log(data);
        $('.input-customer-select').empty();
        $('.input-customer-select').append('<option value=""></option>');
        $.each(data, (key, val) => {
            // AREA.push({ pk: val.pk, name: val.fields.name, code: val.fields.code });
            $('.input-customer-select').append(`<option value="${val.pk}">${val.fields.code} - ${val.fields.name}</option>`);
        });
        // console.log(this.data);
    });
}

function getarea() {
    $.ajax({
        url: API_URL.area.get,
        method: 'GET',
        dataType: 'json',
        async: false,

    }).fail(() => {
        console.log(`failed to get data for ${this.name}`);
    }).done((res) => {
        console.log(`done load data ${this.name}`);
        let data = JSON.parse(res.data);
        AREA = [];
        AREA.push({ pk: 0, name: '', code: '' });
        // console.log(data);
        $('.input-area').empty();
        $('.input-area').append('<option value=""></option>');
        $.each(data, (key, val) => {
            AREA.push({ pk: val.pk, name: val.fields.name, code: val.fields.code });
            $('.input-area').append(`<option value="${val.pk}">${val.fields.code}</option>`);
        });
        // console.log(this.data);
    });

}
function getnetwatch() {
    $.ajax({
        url: API_URL.netwatch.get,
        method: 'GET',
        dataType: 'json',
        async: false,

    }).fail(() => {
        toastr.error(`failed to get data for ${this.name}`);
    }).done((res) => {
        console.log(`done load data ${this.name}`);
        let data = JSON.parse(res.data);
        NETWATCH_DATA = data;
        // console.log(this.data);
    });
}

function getplan() {
    $.ajax({
        url: API_URL.customer_plan.get,
        method: 'GET',
        dataType: 'json',
        async: false,

    }).fail(() => {
        toastr.error(`failed to get monthly plan`);
    }).done((res) => {
        console.log(`done load data plan`);
        let data = JSON.parse(res.data);
        MONTHLY_PLAN = data;
        MONTHLY_PLAN_SELECT = [];
        MONTHLY_PLAN_SELECT.push({ pk: 0, name: '', code: '' });
        // console.log(data);
        $('.input-monthly-plan').empty();
        $('.input-monthly-plan').append('<option value="0"></option>');
        $.each(data, (key, val) => {
            MONTHLY_PLAN_SELECT.push({ pk: val.pk, name: val.fields.name, code: val.fields.code });
            $('.input-monthly-plan').append(`<option data-duration="${val.fields.duration}" value="${val.pk}">${val.fields.code}</option>`);
        });
        // console.log(this.data);
    });
}
function getap() {
    $.ajax({
        url: '/getap',
        dataType: 'json',
        async: false,
        method: 'GET',

    }).done(function (result) {
        let el = $('.input-ap');
        AP_DATA = JSON.parse(result.data);

        SELECT_AP_DATA = [''];
        el.empty();
        el.append('<option val=""></option>');
        $.each(AP_DATA, function (key, val) {
            // console.log(val.fields.code);
            el.append(`<option val="${val.fields.code}-${val.fields.customer}">${val.fields.code}-${val.fields.customer}</option>`);
            SELECT_AP_DATA.push(`${val.fields.code} - ${val.fields.customer}`);
        });
    }).fail(function () {
        toastr.error('failed to load ap data');
    }
    );
}

class ModalObjTemplate {
    constructor() {
        this.name;
        this.table;
        this.insertUrl;
        this.modal;
        this.input;
        this.defaultVal = {};
        this.inputDom = {};
        this.loadDataCB = null;
        this.cloneBtn = null;

    }
    set_prop(key, val) {
        this[key] = val;
    }
    init() {
        console.log(`[${this.name}] init`);
        if (this.input == null || this.modal == null || this.table == null) {
            console.log(`[${this.name}]Set input, modal, and table first`);
            return;
        }

        let _inputDom = this.inputDom;
        let _modal = $(this.modal);

        $.each(this.input, function (key, val) {
            $.extend(true, _inputDom, {
                [key]: _modal.find(val),
            });
        });
        // console.log(this.inputDom.name);
    }
    save(opt = null) {
        console.log(`[${this.name}] save`);
        let data = {};
        if (this.selectedItem != null && opt != 'clone') {
            data.pk = this.selectedItem.pk;
        }
        $.each(this.inputDom, (key, val) => {
            data[key] = val.val();
        });

        // console.log(this.inputDom.type.find(':selected').data('val'));
        $.ajax({
            url: this.insertUrl,
            data: data,
            dataType: 'json',
            method: 'POST',
            beforeSend: (req) => { req.setRequestHeader('X-CSRFToken', csrftoken); },
        }).fail(() => {
            toastr.error('failed to insert data')
        }).done((res) => {
            if (res.return_code != 0) { toastr.error(`[ERR${res.return_code}] ${res.msg}`); return; }
            toastr.success('Ok')
            this.modal.modal('hide');
            this.loadDataCB();
        });
    }
    showNew() {
        console.log(`[${this.name}] show new`);
        let $this = this;
        $.each(this.inputDom, (key, val) => {
            if (val.is('select')) { val.val(0).change(); return; }
            if (val.is('checkbox')) { val.prop('checked', 'false'); return; }
            val.val('');
        });
        $.each(this.defaultVal, (key, val) => {
            this.inputDom[key].val(val);
        });
        this.modal.modal();
    }
    show(item) {
        this.selectedItem = item;
        console.log(`[${this.name}] showing data`);
        // console.log(item);
        // console.log(data);

        $.each(this.inputDom, function (key, val) {
            if (val.is('select')) {
                val.val(item.fields[key]).change();
                // val.val(item.fields.key).trigger('change');
                return;
            }
            val.val(item.fields[key]);
        });
        // console.log($(this.cloneBtn).log());
        this.cloneBtn.removeClass('d-none');
        this.modal.modal();
    }
    hide() {
        console.log(`[${this.name}] hide`);
        this.cloneBtn.addClass('d-none');
        this.modal.modal('hide');
    }
}

$.fn.log = function () {
    console.log.apply(console, this);
    return this;
};

class TableObjTemplate {
    constructor() {
        this.name;
        this._content;
        this.data = [];
        this.dataUrl;
        this.jsgrid;
        this.jsgridConfig;
        this.modal;
        this.modalInput;
        this.modalDefaultVal;
        this.insertUrl;
        this.modalObj;
        this.modalSel;
        this.parseData = true;
        this.useEditModal = true;
        this.selected = null;
        this.selectedItem = null;
        this.globalVarUpdateCB = (item) => { };
        this.showMore = (arg) => { };
        this.dataPreProcess = (data) => { return data };
        this.editBtn = null;
        this.reinitJsGrid = () => {
            // console.log();
            $(this.jsgrid).jsGrid(this.jsgridConfig);
            $(this.jsgrid).jsGrid('loadData');
        };
    }
    refreshData() {
        console.log(`[${this.name}] refresh data`);
        // this.modalSel.find('.tool-btn-edit').addClass('d-none');
        if (this.editBtn != null) {
            this.editBtn.addClass('d-none');
        }
        this.selected = null;
        this.selectedItem = null;
        $.ajax({
            url: this.dataUrl,
            method: 'GET',
            async: false,
            dataType: 'json',
        }).fail(() => {
            toastr.error(`failed to get data for ${this.name}`);
        }).done((res) => {
            console.log(`done load data ${this.name}`);
            if (this.parseData) {
                this.data = JSON.parse(res.data);
            }
            else {
                this.data = res.data;
            }
            // console.log(this.data);
        }).always(() => {
            this.data = this.dataPreProcess(this.data);
            $(this.jsgrid).jsGrid('loadData');
            this.globalVarUpdateCB(this.data);
        });
    }
    showItem() {
        this.modalObj.show(this.selectedItem);
    }
    showMore() {
        this.showMore(this.selectedItem);
    }

    init() {
        console.log(`[${this.name}] init ...`);
        if (this.useEditModal) {
            let _modalObj = new ModalObjTemplate();
            _modalObj.name = `${this.name} Modal`
            _modalObj.table = this.jsgrid;
            _modalObj.insertUrl = this.insertUrl;
            _modalObj.input = this.modalInput;
            _modalObj.defaultVal = this.defaultVal;
            _modalObj.modal = this.modalSel;
            _modalObj.cloneBtn = this.modalSel.find('.modal-clone-btn');
            _modalObj.loadDataCB = this.refreshData.bind(this);
            _modalObj.init();
            this.modalObj = _modalObj;

            this.modalSel.on('hidden.bs.modal', () => {
                _modalObj.cloneBtn.addClass('d-none');
            });

            // modal btn
            var _modalSave = this.modalObj.save.bind(this.modalObj);
            this.modalSel.find('.modal-save-btn').click(() => { _modalSave() });
            this.modalSel.find('.modal-clone-btn').click(() => { _modalSave('clone'); });

            // add btn
            this.addBtn = this._content.find('.tool-btn-add');
            this.addBtn.click(this.modalObj.showNew.bind(this.modalObj));
            this.editBtn = this._content.find('.tool-btn-edit');
            this.editBtn.click(this.showItem.bind(this));
        }
        // console.log(this.jsgrid);
        // console.log(this.jsgridConfig);
        $(this.jsgrid).jsGrid(this.jsgridConfig);
        this.refreshData();
        // $(this.jsgrid).jsGrid('loadData');
        this.refreshBtn = $(this._content).find('.tool-btn-refresh');

        // console.log(this.refreshBtn);
        this.refreshBtn.click(this.refreshData.bind(this));
    }
}

